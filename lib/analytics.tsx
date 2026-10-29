import { useEffect, useState } from 'react'

export type AnalyticsEventName =
  | 'page_view'
  | 'section_viewed'
  | 'service_viewed'
  | 'service_interest'
  | 'cta_clicked'
  | 'contact_form_started'
  | 'contact_form_submitted'
  | 'phone_clicked'
  | 'email_clicked'
  | 'map_clicked'
  | 'engagement'

type AnalyticsProperties = {
  section?: string
  service?: string
  label?: string
  location?: string
  value?: number
}

const cmsUrl = (import.meta.env.VITE_CMS_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:4001'
type Consent = 'unknown' | 'granted' | 'denied'

let pageViewSent = false
let runtimeConsent: Consent | null = null

function readConsent(): Consent {
  if (runtimeConsent) return runtimeConsent
  try {
    const value = window.localStorage.getItem('ruxin_analytics_consent')
    return value === 'granted' || value === 'denied' ? value : 'unknown'
  } catch {
    return 'unknown'
  }
}

function getVisitorId() {
  try {
    const key = 'ruxin_analytics_visitor'
    const existing = window.localStorage.getItem(key)
    if (existing) return existing
    const next = crypto.randomUUID()
    window.localStorage.setItem(key, next)
    return next
  } catch {
    return undefined
  }
}

export function trackAnalytics(name: AnalyticsEventName, properties: AnalyticsProperties = {}) {
  if (typeof window === 'undefined') return
  if (readConsent() !== 'granted') return

  const payload = {
    name,
    path: window.location.pathname || '/',
    visitorId: getVisitorId(),
    referrer: document.referrer || undefined,
    ...properties,
  }

  void fetch(`${cmsUrl}/api/analytics/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
    credentials: 'omit',
  }).catch(() => undefined)
}

function slug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
}

export function AnalyticsTracker() {
  const [consent, setConsent] = useState<Consent>('unknown')

  useEffect(() => {
    setConsent(readConsent())
  }, [])

  useEffect(() => {
    if (consent !== 'granted') return
    if (!pageViewSent) {
      pageViewSent = true
      trackAnalytics('page_view')
    }

    const seenSections = new Set<string>()
    const sections = ['hero', 'about', 'values', 'services', 'investment-intelligence', 'why', 'team', 'clients', 'contact']
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const section = (entry.target as HTMLElement).id
          if (!section || seenSections.has(section)) return
          seenSections.add(section)
          trackAnalytics('section_viewed', { section })
        })
      },
      { threshold: 0.25 },
    )
    sections.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest('a,button') : null
      if (!(target instanceof HTMLElement)) return

      const customEvent = target.dataset.analyticsEvent as AnalyticsEventName | undefined
      if (customEvent) {
        trackAnalytics(customEvent, {
          service: target.dataset.analyticsService,
          label: target.dataset.analyticsLabel,
          location: target.dataset.analyticsLocation,
        })
        return
      }

      const anchor = target instanceof HTMLAnchorElement ? target : target.closest('a')
      const href = anchor?.getAttribute('href') || ''
      if (href.startsWith('tel:')) trackAnalytics('phone_clicked')
      if (href.startsWith('mailto:')) trackAnalytics('email_clicked')
      if (href.includes('#contact')) {
        trackAnalytics('cta_clicked', {
          label: slug(target.textContent || 'contact'),
          location: target.dataset.analyticsLocation || 'unknown',
        })
      }
    }
    document.addEventListener('click', onClick)

    const startedAt = Date.now()
    let engagementSent = false
    const sendEngagement = () => {
      if (engagementSent) return
      engagementSent = true
      trackAnalytics('engagement', { value: Math.min(86400, Math.round((Date.now() - startedAt) / 1000)) })
    }
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') sendEngagement()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('pagehide', sendEngagement)

    return () => {
      observer.disconnect()
      document.removeEventListener('click', onClick)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('pagehide', sendEngagement)
    }
  }, [consent])

  if (consent !== 'unknown') return null

  const choose = (value: Exclude<Consent, 'unknown'>) => {
    runtimeConsent = value
    try {
      window.localStorage.setItem('ruxin_analytics_consent', value)
    } catch {
      // Continue without persistence if storage is unavailable.
    }
    setConsent(value)
  }

  return (
    <aside className="fixed inset-x-4 bottom-4 z-[80] mx-auto flex max-w-xl flex-col gap-4 border border-ink/15 bg-cream p-5 text-ink shadow-[0_18px_50px_-24px_rgba(0,0,0,0.45)] sm:flex-row sm:items-center sm:justify-between">
      <p className="max-w-md text-sm leading-relaxed">May we use anonymous analytics to understand which parts of the website are useful? We do not collect form names, contact details, or messages.</p>
      <div className="flex shrink-0 gap-2">
        <button type="button" onClick={() => choose('denied')} className="rounded-full border border-ink/15 px-4 py-2 text-xs font-medium hover:border-ink/40">Not now</button>
        <button type="button" onClick={() => choose('granted')} className="rounded-full bg-ruxin px-4 py-2 text-xs font-medium text-white hover:bg-ruxin-bright">Allow analytics</button>
      </div>
    </aside>
  )
}
