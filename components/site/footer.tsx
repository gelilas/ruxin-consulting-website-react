import { ArrowUp } from 'lucide-react'
import { useSiteContent } from '@/lib/site-content'
import { useUiCopy } from '@/lib/ui-copy'
import { LogoMark } from '@/components/site/logo'
import { Logo } from './navbar'

function Column({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string; external?: boolean }[]
}) {
  return (
    <div>
      <h3 className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ruxin">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="group inline-flex items-center gap-2 text-sm text-ink/70 transition-colors hover:text-ruxin"
            >
              <span className="h-px w-0 bg-ruxin transition-all duration-300 group-hover:w-3" aria-hidden="true" />
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  const { company, navLinks, services } = useSiteContent()
  const copy = useUiCopy()
  const companyLinks = navLinks.filter((link) => link.href !== '#services')
  return (
    <footer className="relative border-t-[3px] border-ruxin bg-paper text-ink">
      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-20 md:px-10">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <Logo light={false} />
            <p className="mt-6 max-w-xs text-pretty text-lg leading-snug text-ink/70">{company.tagline}</p>
            <a href={`mailto:${company.email}`} className="mt-6 inline-block text-sm text-ruxin transition-colors hover:text-ruxin-bright">
              {company.email}
            </a>
          </div>
          <div className="md:col-span-2">
            <Column title={copy.company} links={companyLinks} />
          </div>
          <div className="md:col-span-2">
            <Column title={copy.services} links={services.map((s) => ({ label: s.name, href: '#services' }))} />
          </div>
          {company.socials.length > 0 && (
            <div className="md:col-span-2 md:col-start-11">
              <Column title={copy.connect} links={company.socials.map((s) => ({ ...s, external: true }))} />
            </div>
          )}
        </div>

        <LogoMark
          className="mx-auto mt-16 h-[clamp(9rem,28vw,20rem)] w-auto max-w-full text-ruxin-bright/25 md:h-[clamp(9rem,28vw,20rem)]"
        />

        <div className="mt-6 flex flex-col-reverse items-start justify-between gap-6 border-t border-ink/10 pt-8 text-xs text-ink/65 md:flex-row md:items-center">
          <p>{'© 2026 Ruxin Consulting. All rights reserved.'}</p>
          <a href="#top" className="group inline-flex items-center gap-2 transition-colors hover:text-ruxin">
            {copy.backToTop}
            <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}
