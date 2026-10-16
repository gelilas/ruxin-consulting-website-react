'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { useSiteContent } from '@/lib/site-content'
import { ConnectionNetwork } from '@/components/network/connection-network'
import { EASE, Eyebrow, Magnetic, Reveal, SplitHeading } from '@/components/motion/primitives'
/** Hero → About → Services intro share one sticky, evolving network canvas. */
export function Story() {
  return (
    <div id="top" className="relative bg-paper text-ink">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="sticky top-0 h-svh overflow-hidden">
          <motion.div
            className="absolute inset-0 grid-fine-dark [mask-image:radial-gradient(ellipse_at_70%_50%,black_20%,transparent_75%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 opacity-40 lg:opacity-100">
            <ConnectionNetwork onLight />
          </div>
        </div>
      </div>
      <Hero />
      <About />
      <Values />
      <ServicesIntro />
    </div>
  )
}

function Hero() {
  const { hero } = useSiteContent()
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} aria-labelledby="hero-heading" className="relative flex min-h-svh items-end lg:items-center">
      <motion.div style={{ y, opacity }} className="relative mx-auto w-full max-w-[1440px] px-5 pb-20 pt-[48svh] md:px-10 lg:pb-0 lg:pt-0">
        <div className="max-w-2xl xl:max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
          >
            <Eyebrow dark>{hero.eyebrow}</Eyebrow>
          </motion.div>
          <SplitHeading
            as="h1"
            id="hero-heading"
            animateOnMount
            delay={0.7}
            lines={hero.headline}
            accentLast
            accentClassName="text-ruxin"
            className="mt-7 text-balance text-[clamp(2.6rem,6.4vw,6rem)] font-semibold leading-[0.98] tracking-[-0.035em]"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.3 }}
            className="mt-8 max-w-xl text-pretty text-base leading-relaxed text-ink/65 md:text-lg"
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
                className="group inline-flex h-13 w-full items-center justify-center gap-3 rounded-full bg-ruxin px-7 text-sm font-medium text-white transition-colors hover:bg-ruxin-bright sm:w-auto"
              >
                {hero.primaryCta.label}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={hero.secondaryCta.href}
                className="group inline-flex h-13 w-full items-center justify-center gap-3 rounded-full border border-ruxin px-7 text-sm font-medium text-ruxin transition-colors hover:bg-ruxin hover:text-white sm:w-auto"
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
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/40 transition-colors hover:text-ink lg:flex"
      >
        Scroll
        <ArrowDown className="size-3.5 motion-safe:animate-bounce" aria-hidden="true" />
      </motion.a>
    </section>
  )
}

function About() {
  const { about } = useSiteContent()
  return (
    <section id="about" aria-labelledby="about-heading" className="relative isolate bg-cream">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="sticky top-0 h-svh overflow-hidden">
          <ConnectionNetwork onLight />
        </div>
      </div>
      <div className="relative z-10 mx-auto grid min-h-svh max-w-[1440px] grid-cols-1 items-center px-5 py-28 text-ink md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-6 xl:col-span-5">
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
            <div className="mt-8 max-w-lg space-y-5 text-pretty text-base leading-relaxed text-ink/65 md:text-lg">
              <p>{about.body}</p>
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <ol className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 lg:hidden">
              {about.stages.map((s, i) => (
                <li key={s} className="flex items-center gap-3">
                  <span className={i === about.stages.length - 1 ? 'text-ruxin' : ''}>{s}</span>
                  {i < about.stages.length - 1 && <ArrowRight className="size-3" aria-hidden="true" />}
                </li>
              ))}
            </ol>
            <p className="sr-only lg:not-sr-only lg:mt-10 lg:font-mono lg:text-[11px] lg:uppercase lg:tracking-[0.18em] lg:text-ink/40">
              {about.stages.join(' → ')}
            </p>
          </Reveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {[about.vision, about.mission].map((item) => (
              <Reveal key={item.title}>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ruxin">{item.title}</h3>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-ink/70">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Values() {
  const { about, hero } = useSiteContent()
  const photos = [
    { src: hero.image, alt: 'Ruxin consultants working together' },
    { src: about.image, alt: 'A Ruxin consultant at work' },
    { src: about.visionImage, alt: 'A client meeting at Ruxin' },
    { src: about.valuesImage, alt: 'A handshake after a client meeting' },
  ].filter((photo) => photo.src)
  return (
    <section aria-labelledby="values-heading" className="relative bg-paper">
      <div className="mx-auto max-w-[1440px] px-5 py-28 md:px-10">
        <div className="max-w-3xl">
          <Reveal>
            <Eyebrow>Our core values</Eyebrow>
          </Reveal>
          <SplitHeading
            id="values-heading"
            lines={['How we work', 'with every client.']}
            accentLast
            accentClassName="text-ruxin"
            className="mt-7 text-balance text-[clamp(2.2rem,4.6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
          />
          <ul className="mt-12 grid gap-8 sm:grid-cols-2">
            {about.values.map((value) => (
              <li key={value.title}>
                <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ruxin">{value.title}</h3>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-ink/70">{value.body}</p>
              </li>
            ))}
          </ul>
        </div>
        {photos.length > 0 && (
          <ul className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-4">
            {photos.map((photo) => (
              <li key={photo.src}>
                <img src={photo.src} alt={photo.alt} className="aspect-[4/5] w-full object-cover" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function ServicesIntro() {
  const { services } = useSiteContent()
  return (
    <section id="services-intro" aria-labelledby="services-heading" className="relative">
      <div className="mx-auto flex min-h-[110svh] max-w-[1440px] flex-col justify-center px-5 py-28 md:px-10">
        <div className="max-w-xl">
          <Reveal>
            <Eyebrow dark>Our services</Eyebrow>
          </Reveal>
          <SplitHeading
            id="services-heading"
            lines={['Essential support,', 'under one roof.']}
            accentLast
            accentClassName="text-ruxin"
            className="mt-7 text-balance text-[clamp(2.2rem,4.6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
          />
          <Reveal delay={0.2}>
            <p className="mt-8 text-lg text-ink/65 md:text-xl">
              Five services. <span className="text-ink">One reliable partner.</span>
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
      </div>
    </section>
  )
}
