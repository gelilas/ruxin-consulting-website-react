'use client'

import { ArrowUpRight } from 'lucide-react'
import { team } from '@/lib/content'
import { Eyebrow, Reveal, SplitHeading } from '@/components/motion/primitives'

function Linkedin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

export function Team() {
  return (
    <section id="team" aria-labelledby="team-heading" className="bg-white py-24 text-ink md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>Our Team</Eyebrow>
            </Reveal>
            <SplitHeading
              id="team-heading"
              lines={['The people', 'behind Ruxin.']}
              accentLast
              accentClassName="text-ink/40"
              className="mt-7 text-balance text-[clamp(2.2rem,4.6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
            />
          </div>
          <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
            <p className="text-pretty leading-relaxed text-ink/60">
              Strategists, operators, analysts, and advisors — a multidisciplinary team connected by one standard: results that last.
            </p>
          </Reveal>
        </div>

        <ul className="no-scrollbar -mx-5 mt-16 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-4">
          {team.map((person, i) => (
            <Reveal as="li" key={person.name} delay={i * 0.08} className={`w-[78%] shrink-0 snap-start md:w-auto ${i % 2 === 1 ? 'lg:mt-16' : ''}`}>
              <article className="group relative">
                <div className="relative aspect-[4/5] overflow-hidden bg-paper">
                  <img
                    src={person.image || '/placeholder.svg'}
                    alt={`Portrait of ${person.name}, ${person.role}`}
                    className="absolute inset-0 size-full object-cover grayscale-[35%] transition-all duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="max-h-0 overflow-hidden text-sm leading-relaxed text-white/80 opacity-0 transition-all duration-700 group-focus-within:max-h-40 group-focus-within:opacity-100 group-hover:max-h-40 group-hover:opacity-100 max-md:max-h-40 max-md:opacity-100">
                      {person.bio}
                    </p>
                  </div>
                  <span className="absolute left-0 top-0 h-full w-0.5 origin-top scale-y-0 bg-ruxin transition-transform duration-700 group-hover:scale-y-100" aria-hidden="true" />
                </div>
                <div className="mt-5 flex items-start justify-between gap-4 transition-transform duration-500 group-hover:translate-x-1">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">{person.name}</h3>
                    <p className="mt-1 text-sm text-ink/55">{person.role}</p>
                  </div>
                  <a
                    href={person.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex size-10 shrink-0 items-center justify-center rounded-full border border-ink/12 text-ink/60 transition-colors hover:border-ruxin hover:bg-ruxin hover:text-white"
                    aria-label={`${person.name} on LinkedIn`}
                  >
                    <Linkedin className="size-3.5" />
                  </a>
                </div>
                <span className="mt-5 block h-px w-full bg-ink/10" aria-hidden="true">
                  <span className="block h-full w-0 bg-ruxin transition-all duration-700 group-hover:w-full" />
                </span>
              </article>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-12">
          <a href="#careers" className="group inline-flex items-center gap-2 text-sm font-medium">
            Join the team
            <ArrowUpRight className="size-4 text-ruxin transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
