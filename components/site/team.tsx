'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { mediaUrl } from '@/lib/media'
import { useSiteContent } from '@/lib/site-content'
import { useUiCopy } from '@/lib/ui-copy'
import { cn } from '@/lib/utils'
import { EASE, Eyebrow, Reveal, SplitHeading } from '@/components/motion/primitives'

function Linkedin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

export function Team() {
  const { team } = useSiteContent()
  const copy = useUiCopy()
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const person = team[active] ?? team[0]

  if (!person) return null

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (active + step + team.length) % team.length
    setActive(next)
    document.getElementById(`team-tab-${next}`)?.focus()
  }

  return (
    <section id="team" aria-labelledby="team-heading" className="relative isolate overflow-hidden bg-cream py-24 text-ink md:py-36">
      <div
        className="pointer-events-none absolute -left-40 top-1/3 -z-10 size-[560px] rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--ruxin), transparent 65%)' }}
        aria-hidden="true"
      />
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>{copy.team}</Eyebrow>
            </Reveal>
            <SplitHeading
              id="team-heading"
              lines={copy.teamHeadline}
              accentLast
              accentClassName="text-ruxin"
              className="mt-7 text-balance text-[clamp(2.2rem,4.6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
            />
          </div>
          <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
            <p className="text-pretty leading-relaxed text-ink/65">{copy.teamIntro}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <span className="absolute -bottom-4 -right-4 size-full border-2 border-ruxin" aria-hidden="true" />
              <div className="relative aspect-[4/5] overflow-hidden bg-white shadow-[0_28px_60px_-36px_rgba(130,7,16,0.45)]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img
                    key={active}
                    src={mediaUrl(person.image) || '/placeholder.svg'}
                    alt={`Portrait of ${person.name}, ${person.role}`}
                    className="absolute inset-0 size-full object-cover"
                    initial={{ opacity: 0, scale: reduce ? 1 : 1.07 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: EASE }}
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" aria-hidden="true" />
                <span className="absolute bottom-4 left-5 font-heading text-7xl font-semibold leading-none text-white/30" aria-hidden="true">
                  {String(active + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <div role="tablist" aria-orientation="vertical" onKeyDown={onKeyDown} className="flex flex-col">
              {team.map((member, i) => {
                const isActive = i === active
                return (
                  <div key={member.name} className="border-t border-ink/15 last:border-b">
                    <button
                      id={`team-tab-${i}`}
                      role="tab"
                      type="button"
                      aria-selected={isActive}
                      aria-controls="team-panel"
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      className="group flex w-full items-center gap-5 py-6 text-left"
                    >
                      <span className={cn('font-mono text-[11px] transition-colors', isActive ? 'text-ruxin' : 'text-ink/40')}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={cn(
                          'font-heading text-2xl font-semibold tracking-tight transition-all duration-500 md:text-4xl',
                          isActive ? 'translate-x-1 text-ruxin' : 'text-ink/50 group-hover:text-ink/80',
                        )}
                      >
                        {member.name}
                      </span>
                      <span className={cn('ml-auto hidden text-right font-mono text-[11px] uppercase tracking-[0.16em] transition-colors sm:block', isActive ? 'text-ink/80' : 'text-ink/40')}>
                        {member.role}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          id="team-panel"
                          role="tabpanel"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-5 pb-7 pl-10 sm:flex-row sm:items-start sm:justify-between">
                            <div className="max-w-lg">
                              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/80 sm:hidden">{member.role}</p>
                              <p className="mt-2 text-pretty leading-relaxed text-ink/70 sm:mt-0">{member.bio}</p>
                            </div>
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink/70 transition-colors hover:border-ruxin hover:bg-ruxin hover:text-white"
                              aria-label={`${member.name} on LinkedIn`}
                            >
                              <Linkedin className="size-4" />
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>

            <Reveal className="mt-10">
              <a
                href="#careers"
                className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-ink/15 px-6 py-5 text-white"
              >
                <img
                  src="/profile/team-meeting.jpg"
                  alt=""
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-r from-ruxin/90 to-ruxin/40" aria-hidden="true" />
                <span className="relative text-lg font-semibold tracking-tight">{copy.joinTeam}</span>
                <ArrowUpRight className="relative size-5 text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
