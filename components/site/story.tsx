'use client'

import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, ArrowRight, BadgeCheck, Gauge, HeartHandshake, Handshake, ShieldCheck, TrendingUp, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { mediaUrl } from '@/lib/media'
import { useSiteContent } from '@/lib/site-content'
import { useUiCopy } from '@/lib/ui-copy'
import { cn } from '@/lib/utils'
import { EASE, Eyebrow, Magnetic, Reveal, SplitHeading } from '@/components/motion/primitives'
/** Core Values uses the former hero network as a static visual; Services uses static imagery. */
export function Story() {
  return (
    <div id="top" className="relative bg-paper text-ink">
      <Hero />
      <About />
      <Values />
    </div>
  )
}

function Hero() {
  const { hero } = useSiteContent()
  const copy = useUiCopy()
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section id="hero" ref={ref} aria-labelledby="hero-heading" className="relative flex min-h-svh items-end overflow-hidden bg-ruxin text-white lg:items-center">
      <img
        src={mediaUrl(hero.image)}
        alt="Ruxin consultants working together"
        className="absolute inset-0 size-full object-cover grayscale opacity-75"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ruxin/55 via-ruxin/20 to-ruxin/5" aria-hidden="true" />
      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-20 pt-[48svh] md:px-10 lg:pb-0 lg:pt-0">
        <div className="max-w-2xl xl:max-w-3xl">
          {hero.eyebrow && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
            >
              <Eyebrow dark className="text-white/80">
                {hero.eyebrow}
              </Eyebrow>
            </motion.div>
          )}
          <SplitHeading
            as="h1"
            id="hero-heading"
            animateOnMount
            delay={0.7}
            lines={hero.headline}
            accentLast
            accentClassName="text-white/85"
            className={cn(hero.eyebrow && 'mt-7', 'text-balance text-[clamp(2.6rem,6.4vw,6rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-white')}
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.3 }}
            className="mt-8 max-w-xl text-pretty text-base leading-relaxed text-white/80 md:text-lg"
          >
            {hero.body}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.5 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Magnetic>
              <a
                href={hero.primaryCta.href}
                data-analytics-location="hero"
                className="group inline-flex h-13 w-full items-center justify-center gap-3 rounded-full bg-white px-7 text-sm font-medium text-ruxin transition-colors hover:bg-cream sm:w-auto"
              >
                {hero.primaryCta.label}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={hero.secondaryCta.href}
                data-analytics-location="hero"
                className="group inline-flex h-13 w-full items-center justify-center gap-3 rounded-full border border-white/70 px-7 text-sm font-medium text-white transition-colors hover:bg-white hover:text-ruxin sm:w-auto"
              >
                {hero.secondaryCta.label}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </motion.div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/75 transition-colors hover:text-white lg:flex"
      >
        {copy.scroll}
        <ArrowDown className="size-3.5 motion-safe:animate-bounce" aria-hidden="true" />
      </motion.a>
    </section>
  )
}

function About() {
  const { about } = useSiteContent()
  const copy = useUiCopy()
  const reduce = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start end', 'end start'] })
  const yMain = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [40, -40])
  const ySecond = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-30, 50])

  return (
    <section id="about" aria-labelledby="about-heading" className="relative isolate overflow-hidden bg-cream">
      <div className="pointer-events-none absolute -right-32 top-24 -z-10 size-[520px] rounded-full bg-ruxin/10 blur-3xl" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-28 text-ink md:px-10 md:py-36">
        <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <Reveal>
              <Eyebrow>{about.eyebrow}</Eyebrow>
            </Reveal>
            <SplitHeading
              id="about-heading"
              lines={about.headline}
              accentLast
              accentClassName="text-ruxin"
              className="mt-7 text-balance text-[clamp(2.4rem,5.4vw,5.5rem)] font-semibold leading-[1] tracking-[-0.035em]"
            />
          </div>
          <Reveal delay={0.2} className="lg:col-span-4">
            <p className="text-pretty text-base leading-relaxed text-ink/65 md:text-lg">{about.body}</p>
          </Reveal>
        </div>

        <div className="mt-16 grid items-center gap-16 lg:mt-24 lg:grid-cols-12 lg:gap-20">
          <div ref={stageRef} className="relative mx-auto w-full max-w-xl pb-16 lg:col-span-6 lg:max-w-none lg:pb-20">
            <Reveal>
              <motion.figure style={{ y: yMain }} className="relative w-[82%] overflow-hidden rounded-[1.75rem] border-t-8 border-ruxin bg-white shadow-[0_28px_60px_-36px_rgba(130,7,16,0.45)]">
                <img src={mediaUrl(about.image)} alt="Business consultants collaborating around a table" className="aspect-[4/5] w-full object-cover" />
              </motion.figure>
            </Reveal>
            {about.visionImage && (
              <motion.div
                style={{ y: ySecond }}
                className="absolute bottom-0 right-0 w-[52%] overflow-hidden rounded-[1.5rem] border-4 border-cream shadow-[0_28px_60px_-30px_rgba(130,7,16,0.5)]"
              >
                <img src={mediaUrl(about.visionImage)} alt="A client meeting at Ruxin" className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105" />
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.7, ease: EASE }}
              className="absolute left-[62%] top-6 flex size-28 items-center justify-center rounded-full bg-ruxin p-4 text-center text-[10px] font-medium uppercase leading-snug tracking-[0.16em] text-white shadow-[0_20px_40px_-20px_rgba(130,7,16,0.7)] md:size-36 md:text-[11px]"
            >
              <motion.span
                aria-hidden="true"
                className="absolute inset-1.5 rounded-full border border-dashed border-white/40"
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
              />
              <span className="relative">{copy.oneTrustedPartner}</span>
            </motion.div>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={0.1}>
              <div className="space-y-4 text-pretty text-sm leading-relaxed text-ink/65 md:text-base">
                {about.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
            <JourneySteps stages={about.stages} />
            <PurposeCards />
          </div>
        </div>
      </div>
    </section>
  )
}

function JourneySteps({ stages }: { stages: string[] }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const ref = useRef<HTMLOListElement>(null)
  const seen = useInView(ref, { once: true, margin: '-15% 0px' })
  const last = stages.length - 1
  const lit = hovered ?? last

  return (
    <Reveal delay={0.15}>
      <ol ref={ref} className="relative mt-12 grid" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}>
        <span
          className="absolute top-5 h-px bg-ink/15"
          style={{ left: `${50 / stages.length}%`, right: `${50 / stages.length}%` }}
          aria-hidden="true"
        >
          <motion.span
            className="block h-full bg-ruxin"
            initial={{ width: 0 }}
            animate={{ width: seen ? `${(lit / Math.max(last, 1)) * 100}%` : 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          />
        </span>
        {stages.map((stage, i) => (
          <li
            key={stage}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="relative flex flex-col items-center gap-3 text-center"
          >
            <span
              className={cn(
                'relative flex size-10 items-center justify-center rounded-full border font-mono text-xs transition-all duration-500',
                i <= lit ? 'scale-105 border-ruxin bg-ruxin text-white' : 'border-ink/20 bg-cream text-ink/50',
              )}
            >
              {i + 1}
            </span>
            <span className={cn('font-mono text-[11px] uppercase tracking-[0.18em] transition-colors', i <= lit ? 'text-ruxin' : 'text-ink/60')}>{stage}</span>
          </li>
        ))}
      </ol>
    </Reveal>
  )
}

function PurposeCards() {
  const { about } = useSiteContent()
  const panels = [
    { id: 'vision', title: about.vision.title, body: about.vision.body },
    { id: 'mission', title: about.mission.title, body: about.mission.body },
  ]

  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2">
      {panels.map((panel, i) => (
        <Reveal key={panel.id} delay={0.1 + i * 0.1}>
          <article className="group relative h-full overflow-hidden rounded-2xl border border-ink/10 bg-white p-6 transition-all duration-500 hover:-translate-y-1 hover:border-ruxin hover:bg-ruxin hover:shadow-[0_28px_50px_-30px_rgba(130,7,16,0.6)]">
            <span className="absolute -right-3 -top-5 font-heading text-8xl font-semibold leading-none text-ruxin/8 transition-colors duration-500 group-hover:text-white/10" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="relative font-mono text-[11px] uppercase tracking-[0.18em] text-ruxin transition-colors duration-500 group-hover:text-white">{panel.title}</h3>
            <p className="relative mt-3 text-pretty text-sm leading-relaxed text-ink/70 transition-colors duration-500 group-hover:text-white/85">{panel.body}</p>
          </article>
        </Reveal>
      ))}
    </div>
  )
}

const valueIcons: LucideIcon[] = [ShieldCheck, Gauge, HeartHandshake, BadgeCheck, Handshake, TrendingUp]
const VALUE_CYCLE_MS = 4500

function Values() {
  const { about } = useSiteContent()
  const copy = useUiCopy()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-20% 0px' })
  const [active, setActive] = useState(0)
  const [hovering, setHovering] = useState(false)
  const values = about.values
  const running = inView && !hovering && !reduce

  useEffect(() => {
    if (!running || values.length === 0) return
    const id = setTimeout(() => setActive((i) => (i + 1) % values.length), VALUE_CYCLE_MS)
    return () => clearTimeout(id)
  }, [running, active, values.length])

  const current = values[active] ?? values[0]

  return (
    <section id="values" aria-labelledby="values-heading" className="relative isolate overflow-hidden">
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-28 md:px-10">
        <div
          className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <div className="max-w-xl lg:col-span-6 lg:max-w-[34rem]">
            <Reveal>
              <Eyebrow>{copy.coreValues}</Eyebrow>
            </Reveal>
            <SplitHeading
              id="values-heading"
              lines={copy.howWeWork}
              accentLast
              accentClassName="text-ruxin"
              className="mt-7 text-balance text-[clamp(2.2rem,4.6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
            />
            <ul className="mt-10 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {values.map((value, index) => (
                <Reveal key={value.title} as="li" delay={index * 0.05}>
                  <div
                    tabIndex={0}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    className={cn(
                      'rounded-xl border-l-2 px-4 py-3 transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-ruxin',
                      index === active ? 'border-ruxin bg-white shadow-[0_18px_40px_-28px_rgba(130,7,16,0.5)]' : 'border-transparent',
                    )}
                  >
                    <h3 className={cn('font-mono text-[11px] uppercase tracking-[0.18em] transition-colors', index === active ? 'text-ruxin' : 'text-ruxin/70')}>
                      {value.title}
                    </h3>
                    <p className="mt-2 text-pretty text-sm leading-relaxed text-ink/70">{value.body}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[34rem] lg:col-span-6 lg:col-start-7 lg:max-w-none">
            <ValueOrbit values={values} active={active} onSelect={setActive} current={current} reduce={!!reduce} />
          </div>
        </div>
      </div>
    </section>
  )
}

function ValueOrbit({
  values,
  active,
  onSelect,
  current,
  reduce,
}: {
  values: { title: string; body: string }[]
  active: number
  onSelect: (i: number) => void
  current?: { title: string; body: string }
  reduce: boolean
}) {
  const count = values.length || 1
  const point = (i: number, radius: number) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2
    return { x: 50 + Math.cos(angle) * radius, y: 50 + Math.sin(angle) * radius }
  }
  const target = point(active, 40)

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-[6%] rounded-full bg-gradient-to-br from-ruxin/12 via-ruxin/5 to-transparent blur-2xl" aria-hidden="true" />

      <motion.div
        aria-hidden="true"
        className="absolute inset-[10%] rounded-full border border-dashed border-ruxin/30"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 90, ease: 'linear', repeat: Infinity }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-[24%] rounded-full border border-ruxin/20"
        animate={reduce ? undefined : { rotate: -360 }}
        transition={{ duration: 120, ease: 'linear', repeat: Infinity }}
      >
        <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ruxin/60" />
        <span className="absolute bottom-0 left-1/2 size-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-ruxin/40" />
      </motion.div>

      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden="true">
        <motion.line
          x1="50"
          y1="50"
          animate={{ x2: target.x, y2: target.y }}
          transition={{ duration: 0.7, ease: EASE }}
          stroke="var(--ruxin)"
          strokeWidth="0.35"
          strokeLinecap="round"
          strokeDasharray="1.2 1.2"
        />
      </svg>

      {values.map((value, i) => {
        const Icon = valueIcons[i % valueIcons.length]
        const { x, y } = point(i, 40)
        const isActive = i === active
        return (
          <button
            key={value.title}
            type="button"
            onClick={() => onSelect(i)}
            onMouseEnter={() => onSelect(i)}
            aria-label={value.title}
            aria-pressed={isActive}
            style={{ left: `${x}%`, top: `${y}%` }}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
          >
            {isActive && (
              <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-ruxin/25 motion-reduce:hidden" aria-hidden="true" />
            )}
            <motion.span
              animate={{ scale: isActive ? 1.18 : 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              className={cn(
                'flex size-12 items-center justify-center rounded-full border shadow-[0_14px_30px_-16px_rgba(130,7,16,0.55)] transition-colors duration-500 md:size-16',
                isActive ? 'border-ruxin bg-ruxin text-white' : 'border-ruxin/20 bg-white text-ruxin group-hover:border-ruxin/50',
              )}
            >
              <Icon className="size-5 md:size-6" aria-hidden="true" />
            </motion.span>
          </button>
        )
      })}

      <div className="absolute left-1/2 top-1/2 flex aspect-square w-[46%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ruxin/15 bg-white p-[5%] text-center shadow-[0_40px_80px_-40px_rgba(130,7,16,0.55)]">
        <span className="absolute inset-[5px] rounded-full border border-ruxin/10" aria-hidden="true" />
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
              aria-live="polite"
            >
              <p className="font-mono text-[10px] tracking-[0.2em] text-ruxin/60">
                {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
              </p>
              <p className="mt-2 text-balance font-heading text-[clamp(1rem,2vw,1.75rem)] font-semibold leading-tight tracking-tight text-ruxin">
                {current.title}
              </p>
              <p className="mt-2 hidden text-pretty text-xs leading-relaxed text-ink/60 xl:block">{current.body}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
