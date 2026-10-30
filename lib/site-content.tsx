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

const loadingCopy: Record<Locale, { title: string; body: string }> = {
  en: { title: 'Loading…', body: 'Preparing the selected language.' },
  am: { title: 'በመጫን ላይ…', body: 'የተመረጠውን ቋንቋ በማዘጋጀት ላይ።' },
  zh: { title: '加载中…', body: '正在准备所选语言。' },
}

const errorCopy: Record<Locale, { title: string; body: string; retry: string }> = {
  en: {
    title: 'This language is temporarily unavailable',
    body: 'Please refresh the page and try again.',
    retry: 'Refresh page',
  },
  am: {
    title: 'ይህ ቋንቋ ለጊዜው አይገኝም',
    body: 'እባክዎ ገጹን እንደገና ይጫኑና ይሞክሩ።',
    retry: 'ገጹን እንደገና ጫን',
  },
  zh: {
    title: '该语言暂时无法使用',
    body: '请刷新页面后重试。',
    retry: '刷新页面',
  },
}

function LocaleStatus({ locale, error }: { locale: Locale; error: boolean }) {
  const copy = error ? errorCopy[locale] : loadingCopy[locale]
  const retry = error ? errorCopy[locale].retry : null

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone px-6 text-center text-ink">
      <div className="max-w-md">
        <div className="mx-auto mb-6 h-1 w-16 overflow-hidden rounded-full bg-ruxin/20">
          <div className={`h-full rounded-full bg-ruxin ${error ? 'w-full' : 'w-1/2 animate-pulse'}`} />
        </div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-ruxin">{copy.title}</h1>
        <p className="mt-3 text-base text-ink/65">{copy.body}</p>
        {retry && (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-7 rounded-full bg-ruxin px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-85"
          >
            {retry}
          </button>
        )}
      </div>
    </main>
  )
}

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
  const [contentLocale, setContentLocale] = useState<Locale | null>(() => {
    if (typeof window === 'undefined') return 'en'
    const saved = window.localStorage.getItem('ruxin_locale')
    return saved === 'am' || saved === 'zh' ? null : 'en'
  })
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    window.localStorage.setItem('ruxin_locale', locale)
    document.documentElement.lang = locale
    const controller = new AbortController()
    setLoadError(false)
    loadCmsContent(controller.signal, locale)
      .then((data) => {
        if (data) {
          setContent(data)
          setContentLocale(locale)
        } else if (locale === 'en') {
          setContent(fallback)
          setContentLocale('en')
        } else {
          setLoadError(true)
        }
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        if (locale === 'en') {
          setContent(fallback)
          setContentLocale('en')
        } else {
          setLoadError(true)
        }
      })
    return () => controller.abort()
  }, [locale])

  const waitingForLocale = contentLocale !== locale

  return (
    <SiteContentContext.Provider value={content}>
      <LocaleContext.Provider value={{ locale, setLocale }}>
        {loadError ? <LocaleStatus locale={locale} error /> : waitingForLocale ? <LocaleStatus locale={locale} error={false} /> : children}
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
