'use client'

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { useRef, useState, type KeyboardEvent } from 'react'
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
      <ServicesIntro />
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
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
          >
            <Eyebrow dark className="text-white/80">
              {hero.eyebrow}
            </Eyebrow>
          </motion.div>
          <SplitHeading
            as="h1"
            id="hero-heading"
            animateOnMount
            delay={0.7}
            lines={hero.headline}
            accentLast
            accentClassName="text-white/85"
            className="mt-7 text-balance text-[clamp(2.6rem,6.4vw,6rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-white"
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
  return (
    <section id="about" aria-labelledby="about-heading" className="relative isolate bg-cream">
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-28 text-ink md:px-10 md:py-36">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="max-w-xl lg:col-span-6 lg:max-w-[34rem]">
            <Reveal>
              <Eyebrow>{about.eyebrow}</Eyebrow>
            </Reveal>
            <SplitHeading
              id="about-heading"
              lines={about.headline}
              accentLast
              accentClassName="text-ruxin"
              className="mt-7 text-balance text-[clamp(2.2rem,4.6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
            />
            <Reveal delay={0.2}>
              <p className="mt-8 text-pretty text-base leading-relaxed text-ink/65 md:text-lg">{about.body}</p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-8 space-y-4 text-pretty text-sm leading-relaxed text-ink/60 md:text-base">
                {about.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <ol className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/70">
                {about.stages.map((s, i) => (
                  <li key={s} className="flex items-center gap-3">
                    <span className={i === about.stages.length - 1 ? 'text-ruxin' : ''}>{s}</span>
                    {i < about.stages.length - 1 && <ArrowRight className="size-3" aria-hidden="true" />}
                  </li>
                ))}
              </ol>
            </Reveal>
            <PurposeToggle />
          </div>
          <Reveal delay={0.15} className="lg:col-span-5 lg:col-start-8 lg:pt-12">
            <figure className="overflow-hidden rounded-[1.75rem] border-t-8 border-ruxin bg-white shadow-[0_28px_60px_-36px_rgba(130,7,16,0.45)]">
              <img
                src={mediaUrl(about.image)}
                alt="Business consultants collaborating around a table"
                className="aspect-[4/5] w-full object-cover"
              />
              <figcaption className="flex items-center justify-between gap-4 px-5 py-4 text-xs uppercase tracking-[0.16em] text-ruxin">
                <span>{copy.oneTrustedPartner}</span>
                <span>01 / 03</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function PurposeToggle() {
  const { about } = useSiteContent()
  const reduce = useReducedMotion()
  const panels = [
    { id: 'vision', title: about.vision.title, body: about.vision.body },
    { id: 'mission', title: about.mission.title, body: about.mission.body },
  ]
  const [activeId, setActiveId] = useState(panels[0].id)
  const active = panels.find((panel) => panel.id === activeId) ?? panels[0]

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const next = active.id === 'vision' ? 'mission' : 'vision'
    setActiveId(next)
    document.getElementById(`purpose-tab-${next}`)?.focus()
  }

  return (
    <div className="mt-10 max-w-lg">
      <div role="tablist" aria-label="Vision and mission" onKeyDown={onKeyDown} className="inline-flex rounded-full bg-white/80 p-1 ring-1 ring-ink/10">
        {panels.map((panel) => {
          const selected = panel.id === active.id
          return (
            <button
              key={panel.id}
              id={`purpose-tab-${panel.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="purpose-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(panel.id)}
              className={cn(
                'relative rounded-full px-5 py-2 text-sm font-medium transition-colors',
                selected ? 'text-white' : 'text-ink/70 hover:text-ink',
              )}
            >
              {selected && (
                <motion.span
                  layoutId="purpose-pill"
                  className="absolute inset-0 rounded-full bg-ruxin"
                  transition={reduce ? { duration: 0.2 } : { type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}
              <span className="relative">{panel.title}</span>
            </button>
          )
        })}
      </div>
      <div id="purpose-panel" role="tabpanel" aria-labelledby={`purpose-tab-${active.id}`} className="relative mt-5 min-h-24">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={active.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="text-pretty text-base leading-relaxed text-ink/75"
          >
            {active.body}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}

function Values() {
  const { about, hero } = useSiteContent()
  const copy = useUiCopy()
  const photos = [
    { src: mediaUrl(hero.image), alt: 'Ruxin consultants working together', frame: 'col-span-7', aspect: 'aspect-[4/3]', shift: [18, -14] as const },
    { src: mediaUrl(about.image), alt: 'A Ruxin consultant at work', frame: 'col-span-5 mt-6', aspect: 'aspect-[3/4]', shift: [28, -8] as const },
    { src: mediaUrl(about.visionImage), alt: 'A client meeting at Ruxin', frame: 'col-span-5', aspect: 'aspect-[4/3]', shift: [12, -18] as const },
    { src: mediaUrl(about.valuesImage), alt: 'A handshake after a client meeting', frame: 'col-span-7', aspect: 'aspect-[16/10]', shift: [22, -10] as const },
  ].filter((photo) => photo.src)

  return (
    <section id="values" aria-labelledby="values-heading" className="relative isolate overflow-hidden">
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-28 md:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
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
            <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {about.values.map((value, index) => (
                <Reveal key={value.title} as="li" delay={index * 0.05}>
                  <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ruxin">{value.title}</h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-ink/70">{value.body}</p>
                </Reveal>
              ))}
            </ul>
            {photos.length > 0 && (
              <div className="mt-12">
                <ValueCollage photos={photos} />
              </div>
            )}
          </div>

          <div className="relative aspect-[1050/897] w-full max-w-[42rem] lg:col-span-6 lg:col-start-7 lg:justify-self-end">
            <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
              <div className="network-image-halo absolute inset-[10%] rounded-full bg-ruxin/10 blur-3xl" />
              <img
                src="/profile/ruxin-network.png"
                alt=""
                className="network-image-art network-image-glow absolute inset-0 size-full object-contain mix-blend-multiply"
              />
              <div className="network-image-core absolute size-5 rounded-full bg-ruxin/60 blur-[2px]" />
              <div className="network-image-pulse absolute size-24 rounded-full border border-ruxin/50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ValueCollage({
  photos,
}: {
  photos: { src: string; alt: string; frame: string; aspect: string; shift: readonly [number, number] }[]
}) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLUListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  return (
    <ul ref={ref} className="grid grid-cols-12 gap-3 md:gap-4">
      {photos.map((photo, index) => (
        <CollagePhoto key={photo.src} photo={photo} index={index} progress={scrollYProgress} reduce={!!reduce} />
      ))}
    </ul>
  )
}

function CollagePhoto({
  photo,
  index,
  progress,
  reduce,
}: {
  photo: { src: string; alt: string; frame: string; aspect: string; shift: readonly [number, number] }
  index: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  reduce: boolean
}) {
  const y = useTransform(progress, [0, 1], reduce ? [0, 0] : [photo.shift[0], photo.shift[1]])
  return (
    <motion.li
      style={{ y }}
      className={cn('self-start overflow-hidden rounded-[1.6rem] shadow-[0_24px_50px_-28px_rgba(130,7,16,0.34)]', photo.frame)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.08 }}
    >
      <motion.img
        src={photo.src}
        alt={photo.alt}
        className={cn('w-full object-cover', photo.aspect)}
        initial={{ scale: reduce ? 1 : 1.08 }}
        whileInView={{ scale: 1 }}
        whileHover={reduce ? undefined : { scale: 1.06 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
      />
    </motion.li>
  )
}

function ServicesIntro() {
  const { services } = useSiteContent()
  const copy = useUiCopy()
  return (
    <section id="services-intro" aria-labelledby="services-heading" className="relative isolate overflow-hidden">
      <div className="relative z-10 mx-auto flex min-h-[110svh] max-w-[1440px] flex-col justify-center px-5 py-28 md:px-10">
        <div className="grid w-full gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="max-w-xl lg:col-span-6">
            <Reveal>
              <Eyebrow dark>{copy.services}</Eyebrow>
            </Reveal>
            <SplitHeading
              id="services-heading"
              lines={copy.essentialSupport}
              accentLast
              accentClassName="text-ruxin"
              className="mt-7 text-balance text-[clamp(2.2rem,4.6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
            />
            <Reveal delay={0.2}>
              <p className="mt-8 text-lg text-ink/65 md:text-xl">
                {copy.servicesLead}
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <ul className="mt-12 flex flex-col border-t border-ink/10">
                {services.map((s) => (
                  <li key={s.id}>
                    <a
                      href="#services"
                      onClick={() => window.dispatchEvent(new CustomEvent('ruxin:service', { detail: s.id }))}
                      className="group flex items-center justify-between border-b border-ink/10 py-4 text-sm text-ink/70 transition-colors hover:text-ink"
                    >
                      <span className="flex items-center gap-5">
                        <span className="flex size-7 items-center justify-center bg-ruxin font-mono text-[10px] text-white">
                          {s.number}
                        </span>
                        {s.name}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/35">
                        {s.concept.join(' → ')}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:col-span-5 lg:col-start-8">
            {services.map((service, index) => (
              <Reveal key={service.id} delay={index * 0.05} className={index === 0 ? 'col-span-2' : ''}>
                <figure className="group relative overflow-hidden border-2 border-ruxin bg-ruxin">
                  <img
                    src={mediaUrl(service.image)}
                    alt={`${service.name} in practice`}
                    className={cn('w-full object-cover grayscale transition-[filter,transform] duration-700 group-hover:scale-105 group-hover:grayscale-0', index === 0 ? 'aspect-[16/8]' : 'aspect-[4/3]')}
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ruxin/90 to-transparent px-4 pb-3 pt-8 text-xs font-medium uppercase tracking-[0.14em] text-white">
                    {service.name}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
