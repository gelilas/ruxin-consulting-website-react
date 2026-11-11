'use client'

import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { clients as clientShape } from '@/lib/content'
import { mediaUrl } from '@/lib/media'
import { useSiteContent } from '@/lib/site-content'
import { useUiCopy } from '@/lib/ui-copy'
import { cn } from '@/lib/utils'
import { EASE, Eyebrow, Magnetic, Reveal, SplitHeading } from '@/components/motion/primitives'

const markStyles = [
  'font-semibold tracking-[0.28em]',
  'font-bold tracking-tight italic',
  'font-light tracking-wide',
  'font-mono tracking-[0.2em]',
  'font-semibold lowercase tracking-tight',
]

function ClientMark({ client, i }: { client: (typeof clientShape)[number]; i: number }) {
  return (
    <li
      className="group flex h-24 w-52 shrink-0 items-center justify-center border-r border-ink/8 md:w-64"
      data-cursor="hover"
    >
      {client.logo ? (
        <img
          src={mediaUrl(client.logo)}
          alt={client.name}
          width={140}
          height={40}
          className="h-12 w-auto max-w-[160px] object-contain transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <span
          className={cn(
            'flex items-center gap-2 text-xl text-ink/35 transition-all duration-500 group-hover:scale-105 group-hover:text-ink',
            markStyles[i % markStyles.length],
          )}
        >
          <span
            className="size-2.5 rounded-full border border-current transition-colors duration-500 group-hover:border-ruxin group-hover:bg-ruxin"
            aria-hidden="true"
          />
          {client.mark}
          <span className="sr-only">{client.name}</span>
        </span>
      )}
    </li>
  )
}

export function Clients() {
  const { clients } = useSiteContent()
  const copy = useUiCopy()
  const row = [...clients, ...clients]
  return (
    <section id="clients" aria-labelledby="clients-heading" className="relative bg-paper py-24 text-ink md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Reveal>
              <Eyebrow>{copy.clients}</Eyebrow>
            </Reveal>
          </div>
          <div className="lg:col-span-9">
            <SplitHeading
              id="clients-heading"
              lines={copy.clientsHeadline}
              accentLast
              accentClassName="text-ruxin"
              className="text-balance text-[clamp(2.2rem,4.6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
            />
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink/65">
              {copy.clientsIntro}
            </p>
          </div>
        </div>
      </div>

      <Reveal delay={0.2} className="relative mt-16 md:mt-24">
        <div className="group/marquee relative overflow-hidden border-y border-ink/8 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <ul
            className="flex w-max animate-marquee group-hover/marquee:[animation-play-state:paused]"
            style={{ ['--marquee-duration' as string]: '50s' }}
            aria-label="Client logos"
          >
            {row.map((c, i) => (
              <ClientMark key={`${c.name}-${i}`} client={c} i={i} />
            ))}
          </ul>
        </div>
      </Reveal>

      <ClientVoices />
    </section>
  )
}

function ClientVoices() {
  const { testimonials } = useSiteContent()
  const copy = useUiCopy()
  const [index, setIndex] = useState(0)
  const [burst, setBurst] = useState(0)
  const reduce = useReducedMotion()
  const active = testimonials[index]
  if (!active) return null

  const choose = (i: number) => {
    setIndex(i)
    setBurst((n) => n + 1)
  }

  return (
    <div className="mx-auto mt-20 max-w-[1440px] px-5 md:mt-28 md:px-10">
      <Reveal>
        <Eyebrow>{copy.testimonials}</Eyebrow>
        <h3 className="mt-4 max-w-xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
          In our clients’ words.
        </h3>
      </Reveal>

      <div className="mt-10 grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:col-span-5" aria-label="Choose a client">
          {testimonials.map((item, i) => {
            const selected = i === index
            return (
              <li key={item.company}>
                <motion.button
                  type="button"
                  onClick={() => choose(i)}
                  aria-pressed={selected}
                  aria-label={`${item.company} testimonial`}
                  whileTap={reduce ? undefined : { scale: 0.9, rotate: -2 }}
                  animate={selected ? { y: -8, scale: 1.05 } : { y: 0, scale: 1, rotate: 0 }}
                  transition={reduce ? { duration: 0.2 } : { type: 'spring', stiffness: 460, damping: 22 }}
                  className={cn(
                    'relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-white p-2.5 shadow-sm ring-1 ring-ink/10',
                    selected && 'shadow-[0_16px_30px_-18px_rgba(171,38,28,0.65)] ring-2 ring-ruxin',
                  )}
                >
                  {item.logo ? (
                    <img src={mediaUrl(item.logo)} alt="" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="px-1 text-center text-[10px] font-semibold tracking-wide text-ink/70">{item.mark}</span>
                  )}
                  {selected && (
                    <motion.span
                      layoutId="client-logo-glow"
                      className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-ruxin"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              </li>
            )
          })}
        </ul>

        <div className="lg:col-span-7 [perspective:900px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={active.company}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22, rotateX: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="rounded-[1.75rem] bg-white p-7 shadow-[0_28px_60px_-36px_rgba(130,7,16,0.28)] ring-1 ring-ink/8 md:p-10"
            >
              <div className="flex items-center gap-4">
                {active.logo ? (
                <motion.img
                  key={`${active.company}-${burst}`}
                  src={mediaUrl(active.logo)}
                  alt=""
                  initial={reduce ? { opacity: 1 } : { scale: 0.82, rotate: -6 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={reduce ? { duration: 0.2 } : { type: 'spring', stiffness: 420, damping: 18 }}
                  className="h-16 w-28 rounded-2xl bg-paper object-contain p-2 ring-1 ring-ink/10"
                />
                ) : null}
                <figcaption>
                  <p className="font-semibold tracking-tight">{active.company}</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ruxin">{active.detail}</p>
                </figcaption>
              </div>
              <blockquote className="mt-6 text-pretty text-xl font-medium leading-snug tracking-tight text-ink md:text-[1.7rem] md:leading-snug">
                <span className="text-ruxin" aria-hidden="true">
                  {'“'}
                </span>
                {active.quote}
                <span className="text-ruxin" aria-hidden="true">
                  {'”'}
                </span>
              </blockquote>
            </motion.figure>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

const WHY_CYCLE_MS = 7000

export function WhyChoose() {
  const { whyChoose } = useSiteContent()
  const copy = useUiCopy()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { margin: '-25% 0px' })
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  const [hovering, setHovering] = useState(false)
  const items = whyChoose.items
  const item = items[active] ?? items[0]
  const running = auto && !hovering && inView && !reduce

  useEffect(() => {
    if (!running) return
    const id = setTimeout(() => setActive((i) => (i + 1) % items.length), WHY_CYCLE_MS)
    return () => clearTimeout(id)
  }, [running, active, items.length])

  const pick = (i: number) => {
    setActive(i)
    setAuto(false)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (active + step + items.length) % items.length
    pick(next)
    document.getElementById(`why-tab-${next}`)?.focus()
  }

  if (!item) return null

  return (
    <section ref={ref} id="why" aria-labelledby="why-heading" className="relative isolate overflow-hidden bg-ruxin py-24 text-white md:py-36">
      <div
        className="pointer-events-none absolute -right-40 -top-40 -z-10 size-[640px] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.22), transparent 65%)' }}
        aria-hidden="true"
      />
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Reveal>
              <Eyebrow dark mark="white" className="text-white/80">{whyChoose.eyebrow}</Eyebrow>
            </Reveal>
          </div>
          <div className="lg:col-span-9">
            <SplitHeading
              id="why-heading"
              lines={whyChoose.headline}
              accentLast
              accentClassName="text-white/70"
              className="text-balance text-[clamp(2.4rem,5.4vw,5.5rem)] font-semibold leading-[1] tracking-[-0.035em] text-white"
            />
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/75">{whyChoose.body}</p>
          </div>
        </div>

        <div
          className="mt-14 grid grid-cols-1 gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-14"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] bg-ruxin/20 lg:col-span-7 lg:order-2 lg:aspect-auto lg:min-h-[34rem]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={active}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: reduce ? 1 : 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                <img src={mediaUrl(item.image)} alt="" className="size-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ruxin/90 via-ruxin/20 to-transparent" aria-hidden="true" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.p
                  key={active}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="max-w-md text-balance text-2xl font-semibold leading-tight tracking-tight md:text-3xl"
                >
                  {item.title}
                </motion.p>
              </AnimatePresence>
              <span className="font-heading text-6xl font-semibold leading-none text-white/25 md:text-8xl" aria-hidden="true">
                {String(active + 1).padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 lg:order-1">
            <div role="tablist" aria-orientation="vertical" onKeyDown={onKeyDown} className="flex flex-col">
              {items.map((it, i) => {
                const isActive = i === active
                return (
                  <div key={it.title} className="relative border-t border-white/20 last:border-b">
                    <button
                      id={`why-tab-${i}`}
                      role="tab"
                      type="button"
                      aria-selected={isActive}
                      aria-controls="why-panel"
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => pick(i)}
                      onMouseEnter={() => {
                        if (!isActive) pick(i)
                      }}
                      className="group flex w-full items-center gap-5 py-5 text-left"
                    >
                      <span className={cn('font-mono text-[11px] transition-colors', isActive ? 'text-white' : 'text-white/50')}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={cn(
                          'font-heading text-xl font-semibold tracking-tight transition-all duration-500 md:text-2xl',
                          isActive ? 'translate-x-1 text-white' : 'text-white/55 group-hover:text-white/85',
                        )}
                      >
                        {it.title}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          id="why-panel"
                          role="tabpanel"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="pb-6 pl-10 pr-2 text-pretty leading-relaxed text-white/75">{it.body}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {isActive && (
                      <span className="absolute inset-x-0 -top-px h-px overflow-hidden" aria-hidden="true">
                        <motion.span
                          key={`${active}-${running}`}
                          className="block h-full origin-left bg-white"
                          initial={{ scaleX: running ? 0 : 1 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: running ? WHY_CYCLE_MS / 1000 : 0.4, ease: 'linear' }}
                        />
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic>
                <a
                  href="#contact"
                  data-analytics-location="why"
                  className="group inline-flex h-13 items-center justify-center gap-3 rounded-full bg-white px-7 text-sm font-medium text-ruxin transition-colors hover:bg-cream"
                >
                  {copy.talk}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
