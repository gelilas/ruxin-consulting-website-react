'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { clients as clientShape } from '@/lib/content'
import { mediaUrl } from '@/lib/media'
import { useSiteContent } from '@/lib/site-content'
import { useUiCopy } from '@/lib/ui-copy'
import { cn } from '@/lib/utils'
import { EASE, Eyebrow, Reveal, SplitHeading } from '@/components/motion/primitives'

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
                    selected && 'shadow-[0_16px_30px_-18px_rgba(176,22,30,0.65)] ring-2 ring-ruxin',
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

export function WhyChoose() {
  const { whyChoose } = useSiteContent()
  return (
    <section id="why" className="bg-cream py-24 text-ink md:py-36">
    <div className="mx-auto max-w-[1440px] px-5 md:px-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <Reveal>
            <Eyebrow>{whyChoose.eyebrow}</Eyebrow>
          </Reveal>
        </div>
        <div className="lg:col-span-9">
          <SplitHeading
            lines={whyChoose.headline}
            accentLast
            accentClassName="text-ruxin"
            className="text-balance text-[clamp(2.2rem,4.6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
          />
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-ink/65">{whyChoose.body}</p>
        </div>
      </div>
      <ul className="mt-16 grid gap-10 md:grid-cols-2">
        {whyChoose.items.map((item) => (
          <li key={item.title} className="grid gap-5 border-t border-ink/10 pt-6 sm:grid-cols-[148px_1fr]">
            <img src={mediaUrl(item.image)} alt="" className="aspect-[4/3] w-full object-cover" />
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ruxin">{item.title}</h3>
              <p className="mt-3 text-pretty leading-relaxed text-ink/70">{item.body}</p>
            </div>
          </li>
        ))}
      </ul>
      <img src={mediaUrl(whyChoose.image)} alt="Clients meeting with Ruxin" className="mt-16 aspect-[16/8] w-full object-cover" />
    </div>
    </section>
  )
}
