import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  about,
  assistant,
  careers,
  clients,
  company,
  hero,
  insightCategories,
  insights,
  navLinks,
  services,
  team,
  testimonials,
} from './content'

export type SiteContent = {
  company: typeof company
  navLinks: typeof navLinks
  hero: typeof hero
  about: typeof about
  services: typeof services
  clients: typeof clients
  testimonials: typeof testimonials
  team: typeof team
  careers: typeof careers
  insightCategories: string[]
  insights: typeof insights
  assistant: typeof assistant
}

const fallback: SiteContent = {
  company,
  navLinks,
  hero,
  about,
  services,
  clients,
  testimonials,
  team,
  careers,
  insightCategories: [...insightCategories],
  insights,
  assistant,
}

const SiteContentContext = createContext<SiteContent>(fallback)

const cmsUrl = import.meta.env.VITE_CMS_URL ?? 'http://localhost:4000'

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState(fallback)

  useEffect(() => {
    const controller = new AbortController()
    fetch(`${cmsUrl}/api/content`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('cms')
        return response.json() as Promise<SiteContent>
      })
      .then((data) => {
        if (data?.company && data.hero && data.services) setContent(data)
      })
      .catch(() => {})
    return () => controller.abort()
  }, [])

  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>
}

export function useSiteContent() {
  return useContext(SiteContentContext)
}
