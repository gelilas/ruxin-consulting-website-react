import { ArrowUpRight, BarChart3, BriefcaseBusiness, ChartNoAxesCombined } from 'lucide-react'
import { mediaUrl } from '@/lib/media'
import { useSiteContent } from '@/lib/site-content'
import { Eyebrow, Reveal, SplitHeading } from '@/components/motion/primitives'

const lensIcons = [BriefcaseBusiness, BarChart3, ChartNoAxesCombined]

export function InvestmentIntelligence() {
  const { hero, investmentIntelligence } = useSiteContent()

  return (
    <section id="investment-intelligence" aria-labelledby="investment-intelligence-heading" className="relative isolate overflow-hidden bg-paper py-24 text-ink md:py-36">
      <div className="relative z-10 mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal>
              <Eyebrow>{investmentIntelligence.eyebrow}</Eyebrow>
            </Reveal>
            <SplitHeading
              id="investment-intelligence-heading"
              lines={investmentIntelligence.headline}
              accentLast
              accentClassName="text-ruxin"
              className="mt-7 text-balance text-[clamp(2.2rem,4.6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
            />
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-ink/65">
                {investmentIntelligence.body}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <a href={investmentIntelligence.ctaHref} data-analytics-location="investment-intelligence" className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-ruxin">
                {investmentIntelligence.ctaLabel}
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="lg:col-span-5 lg:col-start-8">
            <div className="relative overflow-hidden border-2 border-ruxin bg-ruxin">
              <img
                src={mediaUrl(investmentIntelligence.image) || mediaUrl(hero.image)}
                alt={investmentIntelligence.imageAlt}
                className="aspect-[4/3] w-full object-cover opacity-75 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ruxin/85 via-ruxin/10 to-transparent" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">{investmentIntelligence.frameworkLabel}</p>
                <p className="mt-2 max-w-sm text-xl font-semibold leading-tight">{investmentIntelligence.frameworkBody}</p>
              </div>
            </div>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-8 border-t border-ink/10 pt-8 md:grid-cols-3 md:gap-6">
          {investmentIntelligence.lenses.map(({ label, body }, index) => {
            const Icon = lensIcons[index % lensIcons.length]
            return (
              <Reveal as="li" key={label} delay={index * 0.08}>
                <Icon className="size-5 text-ruxin" aria-hidden="true" />
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{label}</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/65">{body}</p>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
