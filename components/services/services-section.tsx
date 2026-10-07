'use client'

import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowRight, Pause, Play } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react'
import { type ServiceId } from '@/lib/content'
import { useSiteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import { EASE } from '@/components/motion/primitives'
import { ConsultingVisual } from './visuals/consulting-visual'
import { FinanceVisual } from './visuals/finance-visual'
import { LegalVisual } from './visuals/legal-visual'
import { LogisticsVisual } from './visuals/logistics-visual'
import { RecruitmentVisual } from './visuals/recruitment-visual'

const visuals: Record<ServiceId, ComponentType> = {
  consulting: ConsultingVisual,
  logistics: LogisticsVisual,
  recruitment: RecruitmentVisual,
  finance: FinanceVisual,
  legal: LegalVisual,
}

/** Where the ambient red glow sits for each service — it drifts as the system transforms. */
const glowPositions: Record<ServiceId, { x: string; y: string }> = {
  consulting: { x: '85%', y: '15%' },
  logistics: { x: '40%', y: '30%' },
  recruitment: { x: '82%', y: '62%' },
  finance: { x: '90%', y: '25%' },
  legal: { x: '55%', y: '88%' },
}

const CYCLE_MS = 9000

export function ServicesSection() {
  const { services } = useSiteContent()
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [hoverPaused, setHoverPaused] = useState(false)
  const [cycle, setCycle] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { margin: '-30% 0px' })
  const reduce = useReducedMotion()
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const service = services[index] ?? services[0]
  const autoplay = playing && !hoverPaused && inView && !reduce

  const select = useCallback((i: number, fromUser = true) => {
    setIndex((prev) => {
      if (prev === i) setCycle((c) => c + 1)
      return (i + services.length) % services.length
    })
    if (fromUser) setPlaying(false)
  }, [services.length])

  useEffect(() => {
    if (!autoplay) return
    const id = setTimeout(() => select(index + 1, false), CYCLE_MS)
    return () => clearTimeout(id)
  }, [autoplay, index, cycle, select])

  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<ServiceId>).detail
      const i = services.findIndex((s) => s.id === id)
      if (i >= 0) select(i)
    }
    window.addEventListener('ruxin:service', onSelect)
    return () => window.removeEventListener('ruxin:service', onSelect)
  }, [select, services])

  const onTabKey = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }
    if (e.key in keys) {
      e.preventDefault()
      const next = (index + keys[e.key] + services.length) % services.length
      select(next)
      document.getElementById(`service-tab-${services[next].id}`)?.focus()
    }
  }

  const hoverSelect = (i: number) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => {
      if (i !== index) select(i)
    }, 220)
  }
  const cancelHover = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
  }

  if (!service) return null
  const visualKey = (Object.hasOwn(visuals, service.id) ? service.id : 'consulting') as ServiceId
  const Visual = visuals[visualKey]

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-label="Services"
      className="relative overflow-hidden bg-ink pb-24 text-white md:pb-32"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute size-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(176,22,30,0.55), transparent 65%)' }}
        animate={{ left: glowPositions[visualKey].x, top: glowPositions[visualKey].y }}
        transition={{ duration: 1.6, ease: EASE }}
      />

      <div className="relative mx-auto max-w-[1440px] px-5 pt-10 md:px-10">
        <div className="flex items-end justify-between border-b border-white/10 pb-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">Capabilities</p>
          <div className="flex items-center gap-4">
            <p className="font-mono text-[11px] tracking-[0.2em] text-white/45" aria-live="polite">
              <span className="text-white">{service.number}</span> / {String(services.length).padStart(2, '0')}
            </p>
            {!reduce && (
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="flex size-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
                aria-label={playing ? 'Pause service rotation' : 'Play service rotation'}
              >
                {playing ? <Pause className="size-3" /> : <Play className="size-3" />}
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-12">
          {/* Navigation */}
          <div className="lg:col-span-4">
            <div
              role="tablist"
              aria-label="Ruxin services"
              aria-orientation="vertical"
              onKeyDown={onTabKey}
              className="no-scrollbar -mx-5 flex snap-x gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0"
            >
              {services.map((s, i) => {
                const isActive = i === index
                return (
                  <button
                    key={s.id}
                    id={`service-tab-${s.id}`}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    aria-controls="service-panel"
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => select(i)}
                    onMouseEnter={() => hoverSelect(i)}
                    onMouseLeave={cancelHover}
                    className={cn(
                      'group relative flex shrink-0 snap-start items-center gap-3 rounded-full border px-4 py-2.5 text-left transition-colors lg:gap-6 lg:rounded-none lg:border-0 lg:border-b lg:border-white/10 lg:px-0 lg:py-6',
                      isActive ? 'border-ruxin bg-ruxin/10 lg:bg-transparent' : 'border-white/15 hover:border-white/30',
                    )}
                  >
                    <span className={cn('font-mono text-[11px] transition-colors', isActive ? 'text-ruxin' : 'text-white/40')}>
                      {s.number}
                    </span>
                    <span className="hidden h-px w-6 bg-white/20 lg:block" aria-hidden="true" />
                    <span
                      className={cn(
                        'text-sm font-medium transition-all duration-500 lg:text-[clamp(1.5rem,2.4vw,2.25rem)] lg:font-semibold lg:tracking-tight',
                        isActive ? 'text-white lg:translate-x-1' : 'text-white/50 group-hover:text-white/80',
                      )}
                    >
                      {s.name}
                    </span>
                    {isActive && (
                      <span className="absolute inset-x-0 -bottom-px hidden h-px overflow-hidden lg:block" aria-hidden="true">
                        <motion.span
                          key={`${index}-${cycle}-${autoplay}`}
                          className="block h-full origin-left bg-ruxin"
                          initial={{ scaleX: autoplay ? 0 : 1 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: autoplay ? CYCLE_MS / 1000 : 0.4, ease: 'linear' }}
                        />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="mt-10 hidden lg:block"
              >
                <ServiceDetails index={index} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Visual stage */}
          <div className="lg:col-span-8">
            <div
              id="service-panel"
              role="tabpanel"
              aria-labelledby={`service-tab-${service.id}`}
              onMouseEnter={() => setHoverPaused(true)}
              onMouseLeave={() => setHoverPaused(false)}
              className="relative"
            >
              <motion.div
                drag={reduce ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) select(index + 1)
                  else if (info.offset.x > 60) select(index - 1)
                }}
                className="relative aspect-[4/3] w-full cursor-grab touch-pan-y overflow-hidden border border-white/10 bg-charcoal/60 active:cursor-grabbing"
              >
                <div className="pointer-events-none absolute inset-0 grid-fine" aria-hidden="true" />
                <CornerTicks />
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={service.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.97, filter: 'blur(8px)' }}
                    transition={{ duration: 0.8, ease: EASE }}
                  >
                    <Visual key={cycle} />
                  </motion.div>
                </AnimatePresence>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={service.number}
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-2 right-4 select-none text-[clamp(4rem,12vw,10rem)] font-semibold leading-none tracking-tighter text-white/[0.04]"
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    transition={{ duration: 0.8, ease: EASE }}
                  >
                    {service.number}
                  </motion.span>
                </AnimatePresence>
              </motion.div>
              <ConceptChain index={index} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="mt-8 lg:hidden"
              >
                <ServiceDetails index={index} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

function ServiceDetails({ index }: { index: number }) {
  const { services } = useSiteContent()
  const s = services[index]
  if (!s) return null
  return (
    <div>
      <h3 className="text-balance text-2xl font-semibold leading-tight tracking-tight md:text-3xl">{s.title}</h3>
      <p className="mt-4 max-w-md text-pretty leading-relaxed text-white/60">{s.description}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {s.capabilities.map((c) => (
          <li key={c} className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-white/70">
            {c}
          </li>
        ))}
      </ul>
      <a
        href="#contact"
        className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-white underline-offset-8 hover:underline"
      >
        Discuss {s.name.toLowerCase()}
        <ArrowRight className="size-4 text-ruxin transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
      </a>
    </div>
  )
}

function ConceptChain({ index }: { index: number }) {
  const { services } = useSiteContent()
  const s = services[index]
  if (!s) return null
  return (
    <div className="mt-4 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 md:text-[11px]">
      <AnimatePresence mode="wait">
        <motion.ol
          key={s.id}
          className="flex flex-wrap items-center gap-x-3 gap-y-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {s.concept.map((c, i) => (
            <li key={c} className="flex items-center gap-3">
              <span className={i === s.concept.length - 1 ? 'text-ruxin' : 'text-white/60'}>{c}</span>
              {i < s.concept.length - 1 && <span aria-hidden="true">{'→'}</span>}
            </li>
          ))}
        </motion.ol>
      </AnimatePresence>
      <span className="hidden shrink-0 sm:block">Swipe or select to explore</span>
    </div>
  )
}

function CornerTicks() {
  const base = 'pointer-events-none absolute size-3 border-white/40'
  return (
    <>
      <span className={cn(base, 'left-3 top-3 border-l border-t')} aria-hidden="true" />
      <span className={cn(base, 'right-3 top-3 border-r border-t')} aria-hidden="true" />
      <span className={cn(base, 'bottom-3 left-3 border-b border-l')} aria-hidden="true" />
      <span className={cn(base, 'bottom-3 right-3 border-b border-r')} aria-hidden="true" />
    </>
  )
}
