import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  about,
  assistant,
  careers,
  clients,
  company,
  hero,
  investmentIntelligence,
  insightCategories,
  insights,
  navLinks,
  services,
  team,
  testimonials,
  whyChoose,
} from './content'

export type Locale = 'en' | 'am' | 'zh'

export type SiteContent = {
  company: typeof company
  navLinks: typeof navLinks
  hero: typeof hero
  investmentIntelligence: typeof investmentIntelligence
  about: typeof about
  services: typeof services
  clients: typeof clients
  testimonials: typeof testimonials
  whyChoose: typeof whyChoose
  team: typeof team
  careers: typeof careers
  insightCategories: string[]
  insights: typeof insights
  assistant: typeof assistant
}

const REQUIRED_KEYS = [
  'company',
  'navLinks',
  'hero',
  'investmentIntelligence',
  'about',
  'services',
  'clients',
  'testimonials',
  'whyChoose',
  'team',
  'careers',
  'insightCategories',
  'insights',
  'assistant',
] as const

/** Default site copy — always used for first paint and when CMS is unavailable/invalid. */
export const fallback: SiteContent = {
  company,
  navLinks,
  hero,
  investmentIntelligence,
  about,
  services,
  clients,
  testimonials,
  whyChoose,
  team,
  careers,
  insightCategories: [...insightCategories],
  insights,
  assistant,
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Full-document guard: accept API content only when complete; otherwise keep defaults. */
export function isSiteContent(value: unknown): value is SiteContent {
  if (!isRecord(value)) return false

  for (const key of REQUIRED_KEYS) {
    if (!(key in value)) return false
  }

  if (!isRecord(value.company)) return false
  if (!isNonEmptyString(value.company.name) || !isNonEmptyString(value.company.email)) return false

  if (!Array.isArray(value.navLinks)) return false

  if (!isRecord(value.hero)) return false
  if (!Array.isArray(value.hero.headline) || value.hero.headline.length === 0) return false

  if (!isRecord(value.about)) return false
  if (!Array.isArray(value.services) || value.services.length === 0) return false
  if (!Array.isArray(value.clients)) return false
  if (!Array.isArray(value.testimonials)) return false
  if (!Array.isArray(value.team)) return false

  if (!isRecord(value.careers)) return false
  if (!Array.isArray(value.insightCategories)) return false
  if (!Array.isArray(value.insights)) return false
  if (!isRecord(value.assistant)) return false

  return true
}

const SiteContentContext = createContext<SiteContent>(fallback)

const cmsUrl = (import.meta.env.VITE_CMS_URL as string | undefined)?.replace(/\/$/, '') || 'http://localhost:4001'

async function loadCmsContent(signal: AbortSignal, locale: Locale): Promise<SiteContent | null> {
  const response = await fetch(`${cmsUrl}/api/content?lang=${locale}`, { signal })
  if (!response.ok) return null
  const data: unknown = await response.json()
  return isSiteContent(data) ? data : null
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(fallback)
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === 'undefined') return 'en'
    const saved = window.localStorage.getItem('ruxin_locale')
    return saved === 'am' || saved === 'zh' ? saved : 'en'
  })

  useEffect(() => {
    window.localStorage.setItem('ruxin_locale', locale)
    document.documentElement.lang = locale
    const controller = new AbortController()
    loadCmsContent(controller.signal, locale)
      .then((data) => {
        if (data) setContent(data)
      })
      .catch(() => {
        // Network / abort — keep defaults
      })
    return () => controller.abort()
  }, [locale])

  return (
    <SiteContentContext.Provider value={content}>
      <LocaleContext.Provider value={{ locale, setLocale }}>
        {children}
      </LocaleContext.Provider>
    </SiteContentContext.Provider>
  )
}

export function useSiteContent() {
  return useContext(SiteContentContext)
}

const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void }>({
  locale: 'en',
  setLocale: () => undefined,
})

export function useLocale() {
  return useContext(LocaleContext)
}
