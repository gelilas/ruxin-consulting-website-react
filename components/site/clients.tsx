'use client'

import { clients as clientShape } from '@/lib/content'
import { useSiteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import { Eyebrow, Reveal, SplitHeading } from '@/components/motion/primitives'

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
          src={client.logo}
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
  const row = [...clients, ...clients]
  return (
    <section id="clients" aria-labelledby="clients-heading" className="relative bg-paper py-24 text-ink md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Reveal>
              <Eyebrow>Clients</Eyebrow>
            </Reveal>
          </div>
          <div className="lg:col-span-9">
            <SplitHeading
              id="clients-heading"
              lines={['Proudly serving clients', 'across industries.']}
              accentLast
              accentClassName="text-ruxin"
              className="text-balance text-[clamp(2.2rem,4.6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
            />
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink/65">
              Varying scales and complexities, with tailored solutions for each business.
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

    </section>
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
            <img src={item.image} alt="" className="aspect-[4/3] w-full object-cover" />
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ruxin">{item.title}</h3>
              <p className="mt-3 text-pretty leading-relaxed text-ink/70">{item.body}</p>
            </div>
          </li>
        ))}
      </ul>
      <img src={whyChoose.image} alt="Clients meeting with Ruxin" className="mt-16 aspect-[16/8] w-full object-cover" />
    </div>
    </section>
  )
}
