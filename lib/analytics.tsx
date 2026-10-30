import { useEffect } from 'react'

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
  value?: number
}

const cmsUrl = (import.meta.env.VITE_CMS_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:4001'

let pageViewSent = false

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

export function AnalyticsTracker() {
  useEffect(() => {
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
          section: target.dataset.analyticsLocation,
        })
        return
      }

      const anchor = target instanceof HTMLAnchorElement ? target : target.closest('a')
      const href = anchor?.getAttribute('href') || ''
      if (href.startsWith('tel:')) trackAnalytics('phone_clicked')
      if (href.startsWith('mailto:')) trackAnalytics('email_clicked')
      if (href.includes('#contact')) {
        trackAnalytics('cta_clicked', {
          section: target.dataset.analyticsLocation || 'unknown',
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
  }, [])

  return null
}
