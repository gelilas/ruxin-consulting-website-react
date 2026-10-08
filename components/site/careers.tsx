'use client'

import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, ArrowUpRight, Briefcase, Clock, MapPin, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { careers as careersShape } from '@/lib/content'
import { useSiteContent } from '@/lib/site-content'
import { EASE, Eyebrow, Reveal, SplitHeading } from '@/components/motion/primitives'

type Job = (typeof careersShape.jobs)[number]

export function Careers() {
  const { careers } = useSiteContent()
  const [job, setJob] = useState<Job | null>(null)
  const lastTrigger = useRef<HTMLButtonElement | null>(null)

  return (
    <section id="careers" aria-labelledby="careers-heading" className="relative overflow-hidden bg-stone py-24 text-ink md:py-36">
      <div className="pointer-events-none absolute inset-0 grid-fine-dark opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow dark>Careers</Eyebrow>
            </Reveal>
            <SplitHeading
              id="careers-heading"
              lines={['Build your future', 'with us.']}
              accentLast
              className="mt-7 text-balance text-[clamp(2.2rem,4.6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
            />
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-md text-pretty text-lg leading-relaxed text-ink/60">{careers.body}</p>
            </Reveal>
            <Reveal delay={0.25}>
              <ul className="mt-10 space-y-3 border-t border-ink/10 pt-8">
                {careers.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm text-ink/70">
                    <span className="size-1 rounded-full bg-ruxin" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <p className="flex items-center justify-between border-b border-ink/10 pb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/40">
                <span>Open positions</span>
                <span>{String(careers.jobs.length).padStart(2, '0')} roles</span>
              </p>
            </Reveal>
            <ul>
              {careers.jobs.map((j, i) => (
                <Reveal as="li" key={j.id} delay={i * 0.06}>
                  <button
                    type="button"
                    onClick={(e) => {
                      lastTrigger.current = e.currentTarget
                      setJob(j)
                    }}
                    className="group relative flex w-full flex-col gap-4 overflow-hidden border-b border-ink/10 py-7 text-left md:flex-row md:items-center md:justify-between"
                    aria-haspopup="dialog"
                  >
                    <span className="absolute inset-0 origin-left scale-x-0 bg-ruxin/[0.06] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" aria-hidden="true" />
                    <span className="relative">
                      <span className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ruxin">
                        {j.department}
                      </span>
                      <span className="mt-2 block text-xl font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-2 md:text-2xl">
                        {j.title}
                      </span>
                      <span className="mt-2 block max-w-lg text-sm text-ink/50">{j.summary}</span>
                    </span>
                    <span className="relative flex shrink-0 items-center gap-5 text-xs text-ink/50">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5" aria-hidden="true" />
                        {j.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5" aria-hidden="true" />
                        {j.type}
                      </span>
                      <span className="flex size-10 items-center justify-center rounded-full border border-ink/15 text-ink transition-all duration-500 group-hover:rotate-45 group-hover:border-ruxin group-hover:bg-ruxin group-hover:text-white">
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </span>
                    </span>
                  </button>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <JobDrawer
        job={job}
        onClose={() => {
          setJob(null)
          lastTrigger.current?.focus()
        }}
      />
    </section>
  )
}

function JobDrawer({ job, onClose }: { job: Job | null; onClose: () => void }) {
  const { careers } = useSiteContent()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!job) return
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => panelRef.current?.focus(), 50)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>('a, button')
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [job, onClose])

  return (
    <AnimatePresence>
      {job && (
        <div className="fixed inset-0 z-[60]">
          <motion.div
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-title"
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col overflow-y-auto bg-cream text-ink outline-none"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/8 bg-cream/90 px-6 py-4 backdrop-blur md:px-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ruxin">{job.department}</p>
              <button
                type="button"
                onClick={onClose}
                className="flex size-10 items-center justify-center rounded-full border border-ink/12 transition-colors hover:bg-ink hover:text-white"
                aria-label="Close job details"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex-1 px-6 py-10 md:px-10">
              <h3 id="job-title" className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                {job.title}
              </h3>
              <div className="mt-6 flex flex-wrap gap-2 text-xs text-ink/70">
                {[
                  { icon: Briefcase, label: job.department },
                  { icon: MapPin, label: job.location },
                  { icon: Clock, label: job.type },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-1.5 rounded-full border border-ink/10 px-3 py-1.5">
                    <Icon className="size-3.5" aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
              <p className="mt-8 text-pretty leading-relaxed text-ink/70">{job.description}</p>
              <DrawerList title="Responsibilities" items={job.responsibilities} />
              <DrawerList title="Requirements" items={job.requirements} />
              <DrawerList title="Benefits" items={careers.benefits} />
            </div>
            <div className="sticky bottom-0 border-t border-ink/8 bg-cream px-6 py-5 md:px-10">
              <a
                href={`mailto:careers@ruxinconsulting.com?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-ruxin text-sm font-medium text-white transition-colors hover:bg-ruxin-bright"
              >
                Apply for this role
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function DrawerList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-10">
      <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/45">{title}</h4>
      <ul className="mt-4 divide-y divide-ink/8 border-y border-ink/8">
        {items.map((item) => (
          <li key={item} className="flex gap-4 py-3.5 text-sm leading-relaxed">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-ruxin" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
