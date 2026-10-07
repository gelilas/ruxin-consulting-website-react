import { ArrowUp } from 'lucide-react'
import { useSiteContent } from '@/lib/site-content'
import { Logo } from './navbar'

const companyLinks = [
  { label: 'About', href: '#about' },
  { label: 'Team', href: '#team' },
  { label: 'Careers', href: '#careers' },
  { label: 'Insights', href: '#insights' },
]

function Column({ title, links }: { title: string; links: { label: string; href: string; external?: boolean }[] }) {
  return (
    <div>
      <h3 className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/40">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="group inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
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
  const { company, services } = useSiteContent()
  return (
    <footer className="relative border-t border-white/10 bg-ink text-white">
      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-20 md:px-10">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <Logo />
            <p className="mt-6 max-w-xs text-pretty text-lg leading-snug text-white/70">{company.tagline}</p>
            <a href={`mailto:${company.email}`} className="mt-6 inline-block text-sm text-white/50 transition-colors hover:text-white">
              {company.email}
            </a>
          </div>
          <div className="md:col-span-2">
            <Column title="Company" links={companyLinks} />
          </div>
          <div className="md:col-span-2">
            <Column title="Services" links={services.map((s) => ({ label: s.name, href: '#services' }))} />
          </div>
          <div className="md:col-span-2 md:col-start-11">
            <Column title="Connect" links={company.socials.map((s) => ({ ...s, external: true }))} />
          </div>
        </div>

        <p
          className="mt-20 select-none text-center text-[clamp(4rem,17vw,16rem)] font-bold leading-none tracking-[-0.05em] text-white/[0.04]"
          aria-hidden="true"
        >
          RUXIN
        </p>

        <div className="mt-6 flex flex-col-reverse items-start justify-between gap-6 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row md:items-center">
          <p>{'© 2026 Ruxin Consulting. All rights reserved.'}</p>
          <a href="#top" className="group inline-flex items-center gap-2 transition-colors hover:text-white">
            Back to top
            <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}
