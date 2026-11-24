'use client'

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react'
import { type ServiceId } from '@/lib/content'
import { trackAnalytics } from '@/lib/analytics'
import { useSiteContent } from '@/lib/site-content'
import { useUiCopy } from '@/lib/ui-copy'
import { cn } from '@/lib/utils'
import { EASE, Eyebrow, Reveal, SplitHeading } from '@/components/motion/primitives'
import { Media } from '@/components/ui/media'
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

/**
 * Collapsed-rail tints. The brand is only three colours, so panels are
 * separated by depth within the red range rather than by hue.
 */
const railTints = [
  'color-mix(in srgb, var(--brand-wine-red) 94%, black)',
  'var(--brand-wine-red)',
  'color-mix(in srgb, var(--brand-bright-red) 85%, var(--brand-wine-red))',
  'color-mix(in srgb, var(--brand-wine-red) 65%, var(--brand-bright-red))',
  'var(--brand-bright-red)',
  'color-mix(in srgb, var(--brand-bright-red) 80%, black)',
]

const PANEL_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
/** Width of a closed rail. Wide enough for vertical text plus breathing room. */
const RAIL = '5.25rem'

export function ServicesSection() {
  const { services } = useSiteContent()
  const copy = useUiCopy()
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollDriven = !reduce
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (!scrollDriven || services.length === 0) return
    const next = Math.min(services.length - 1, Math.max(0, Math.floor(value * services.length)))
    setIndex((prev) => (prev === next ? prev : next))
  })

  const select = useCallback(
    (i: number, fromUser = true) => {
      if (services.length === 0) return
      const bounded = (i + services.length) % services.length
      if (fromUser) {
        const service = services[bounded]
        if (service) trackAnalytics('service_interest', { service: service.id })
      }
      setIndex(bounded)
    },
    [services],
  )

  const service = services[index] ?? services[0]

  useEffect(() => {
    if (service) trackAnalytics('service_viewed', { service: service.id })
  }, [service?.id])

  useEffect(() => {
    const onSelect = (event: Event) => {
      const id = (event as CustomEvent<ServiceId>).detail
      const i = services.findIndex((s) => s.id === id)
      if (i >= 0) select(i)
    }
    window.addEventListener('ruxin:service', onSelect)
    return () => window.removeEventListener('ruxin:service', onSelect)
  }, [select, services])

  const onKeyDown = (event: React.KeyboardEvent) => {
    const steps: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }
    if (!(event.key in steps)) return
    event.preventDefault()
    const next = (index + steps[event.key] + services.length) % services.length
    select(next)
    document.getElementById(`service-panel-${services[next].id}`)?.focus()
  }

  if (!service) return null

  const header = (
    <div className="mx-auto max-w-[1600px] px-5 md:px-10">
      <div className="max-w-3xl">
        <Reveal>
          <Eyebrow>{copy.services}</Eyebrow>
        </Reveal>
        <SplitHeading
          lines={copy.essentialSupport}
          accentLast
          accentClassName="text-ruxin"
          className="mt-7 text-balance text-[clamp(2.2rem,4.6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
        />
        <Reveal delay={0.2}>
          <p className="mt-6 text-lg text-ink/65 md:text-xl">{copy.servicesLead}</p>
        </Reveal>
      </div>
    </div>
  )

  const accordion = (
    <div className="mx-auto w-full max-w-[1600px] px-5 md:px-10">
      <div
        role="tablist"
        aria-label={copy.services}
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="flex w-full flex-col gap-2.5 md:h-[clamp(30rem,74svh,46rem)] md:flex-row md:gap-3"
      >
        {services.map((item, i) => {
          const isActive = i === index
          const Visual = visuals[(Object.hasOwn(visuals, item.id) ? item.id : 'consulting') as ServiceId]
          return (
            <button
              key={item.id}
              id={`service-panel-${item.id}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-expanded={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => select(i)}
              onMouseEnter={() => !reduce && select(i, false)}
              onFocus={() => select(i, false)}
              style={{
                backgroundColor: railTints[i % railTints.length],
                // flex-grow/basis are animatable, so the panels slide open
                // without a layout library fighting the flex container.
                flexGrow: isActive ? 1 : 0,
                flexBasis: isActive ? '0%' : RAIL,
                flexShrink: isActive ? 1 : 0,
                transition: reduce
                  ? undefined
                  : `flex-grow 700ms ${PANEL_EASE}, flex-basis 700ms ${PANEL_EASE}`,
              }}
              className={cn(
                'group relative overflow-hidden rounded-[1.75rem] text-left outline-none ring-ruxin/60 focus-visible:ring-2',
                // Mobile stacks: the open card gets real height, rails stay short.
                isActive ? 'min-h-[26rem] md:min-h-0' : 'min-h-[4.25rem] md:min-h-0',
              )}
            >
              {/* Media sits behind everything. Collapsed rails keep a dim blur. */}
              <span
                className={cn(
                  'absolute inset-0 transition-[opacity,filter] duration-700',
                  isActive ? 'opacity-70' : 'opacity-30 blur-[3px]',
                )}
                aria-hidden="true"
              >
                {item.image || item.video ? (
                  <Media image={item.image} video={item.video} paused={!isActive} className="size-full object-cover" />
                ) : (
                  <Visual />
                )}
              </span>
              <span
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10"
                aria-hidden="true"
              />

              {/* Closed rail: vertical label, centred. */}
              <span
                className={cn(
                  'absolute inset-0 flex items-center justify-between gap-3 px-5 transition-opacity duration-300 md:justify-center md:px-0',
                  isActive ? 'pointer-events-none opacity-0' : 'opacity-100 delay-200',
                )}
              >
                <span className="font-heading text-base font-semibold text-white md:rotate-180 md:text-[1.0625rem] md:[writing-mode:vertical-rl]">
                  {item.name}
                </span>
                <span className="font-mono text-[11px] text-white/70 md:hidden">{item.number}</span>
              </span>

              {/* Open card: normal flow anchored to the bottom, so nothing clips. */}
              <span
                className={cn(
                  'relative flex h-full min-w-0 flex-col justify-end p-7 transition-opacity duration-500 md:p-10',
                  isActive ? 'opacity-100 delay-200' : 'pointer-events-none opacity-0',
                )}
              >
                <span className="flex items-end justify-between gap-6">
                  <span className="min-w-0 max-w-2xl">
                    <span className="block font-mono text-[11px] uppercase tracking-[0.22em] text-white/70">
                      {item.number} / {String(services.length).padStart(2, '0')}
                    </span>
                    <span className="mt-4 block text-balance font-heading text-[clamp(1.75rem,2.9vw,3.25rem)] font-semibold leading-[1.04] tracking-tight text-white">
                      {item.title || item.name}
                    </span>
                    <span className="mt-4 line-clamp-4 block text-pretty text-sm leading-relaxed text-white/85 md:text-base">
                      {item.description}
                    </span>
                    {item.capabilities.length > 0 && (
                      <span className="mt-6 hidden flex-wrap gap-2 lg:flex">
                        {item.capabilities.slice(0, 4).map((capability) => (
                          <span
                            key={capability}
                            className="rounded-full border border-white/30 px-3.5 py-1.5 text-xs text-white/90"
                          >
                            {capability}
                          </span>
                        ))}
                      </span>
                    )}
                    <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-white">
                      {copy.discuss} {item.name.toLowerCase()}
                      <ArrowRight
                        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </span>
                  </span>

                  {/* Circular affordance, as in the reference. */}
                  <span
                    className="hidden size-24 shrink-0 items-center justify-center rounded-full border border-white/40 text-sm text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-white group-hover:text-ink xl:flex"
                    aria-hidden="true"
                  >
                    Explore
                  </span>
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-7 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/60 md:text-[11px]">
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {service.concept.map((step, i) => (
            <li key={step} className="flex items-center gap-3">
              <span className={i === service.concept.length - 1 ? 'text-ruxin' : 'text-ink/60'}>{step}</span>
              {i < service.concept.length - 1 && <span aria-hidden="true">{'→'}</span>}
            </li>
          ))}
        </ol>
        <a href="#contact" className="shrink-0 underline-offset-4 transition-colors hover:text-ruxin hover:underline">
          {copy.discuss}
        </a>
      </div>
    </div>
  )

  if (!scrollDriven) {
    return (
      <section id="services" aria-label={copy.services} className="bg-stone py-24 text-ink md:py-32">
        {header}
        <div className="mt-12">{accordion}</div>
      </section>
    )
  }

  return (
    <section id="services" aria-label={copy.services} className="bg-stone text-ink">
      <div className="pt-24 md:pt-32">{header}</div>
      <div ref={trackRef} style={{ height: `${services.length * 85 + 40}svh` }} className="relative">
        <motion.div className="sticky top-0 flex min-h-svh items-center py-10">{accordion}</motion.div>
      </div>
    </section>
  )
}
