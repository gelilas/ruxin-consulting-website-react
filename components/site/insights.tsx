'use client'

import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { insights as insightShape } from '@/lib/content'
import { useSiteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import { EASE, Eyebrow, Reveal, SplitHeading } from '@/components/motion/primitives'

type Insight = (typeof insightShape)[number]

function Meta({ item, light = false }: { item: Insight; light?: boolean }) {
  return (
    <p className={cn('flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.18em]', light ? 'text-white/70' : 'text-ink/50')}>
      <span className="text-ruxin">{item.category}</span>
      <span aria-hidden="true">/</span>
      <time>{item.date}</time>
    </p>
  )
}

function ReadMore({ light = false }: { light?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-sm font-medium', light ? 'text-white' : 'text-ink')}>
      Read more
      <ArrowUpRight className="size-4 text-ruxin transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
    </span>
  )
}

function FeatureArticle({ item }: { item: Insight }) {
  return (
    <article className="group relative">
      <a href="#insights" className="block" aria-label={`Read: ${item.title}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-charcoal lg:aspect-[5/4]">
          <img
            src={item.image || '/placeholder.svg'}
            alt=""
            className="absolute inset-0 size-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <Meta item={item} light />
            <h3 className="mt-4 max-w-xl text-balance text-2xl font-semibold leading-tight tracking-tight text-white md:text-4xl">{item.title}</h3>
            <p className="mt-4 hidden max-w-lg text-pretty text-white/65 md:block">{item.description}</p>
            <div className="mt-6">
              <ReadMore light />
            </div>
          </div>
        </div>
      </a>
    </article>
  )
}

function SideArticle({ item }: { item: Insight }) {
  return (
    <article className="group">
      <a href="#insights" className="grid grid-cols-[1fr_auto] gap-5 border-b border-ink/10 py-6" aria-label={`Read: ${item.title}`}>
        <div>
          <Meta item={item} />
          <h3 className="mt-3 text-balance text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-ruxin md:text-xl">
            {item.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-ink/55">{item.description}</p>
          <div className="mt-4">
            <ReadMore />
          </div>
        </div>
        <div className="relative size-24 overflow-hidden bg-paper md:size-28">
          <img
            src={item.image || '/placeholder.svg'}
            alt=""
            className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      </a>
    </article>
  )
}

export function Insights() {
  const { insightCategories, insights } = useSiteContent()
  const [category, setCategory] = useState('All')
  const filtered = category === 'All' ? insights : insights.filter((i) => i.category === category)
  const [feature, ...rest] = filtered

  return (
    <section id="insights" aria-labelledby="insights-heading" className="bg-paper py-24 text-ink md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>Insights &amp; Updates</Eyebrow>
            </Reveal>
            <SplitHeading
              id="insights-heading"
              lines={['Ideas that move', 'business forward.']}
              accentLast
              accentClassName="text-ink/40"
              className="mt-7 text-balance text-[clamp(2.2rem,4.6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]"
            />
          </div>
          <Reveal delay={0.1} className="lg:col-span-5">
            <div role="group" aria-label="Filter insights by category" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:justify-end lg:px-0">
              {insightCategories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                  className={cn(
                    'relative shrink-0 rounded-full border px-4 py-2 text-xs transition-colors',
                    category === c ? 'border-ink bg-ink text-white' : 'border-ink/15 text-ink/70 hover:border-ink/40',
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14"
          >
            {feature && (
              <div className={cn(rest.length ? 'lg:col-span-7' : 'lg:col-span-8')}>
                <FeatureArticle item={feature} />
              </div>
            )}
            {rest.length > 0 && (
              <div className="lg:col-span-5">
                <p className="border-b border-ink/10 pb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/45">Latest</p>
                {rest.slice(0, 4).map((item) => (
                  <SideArticle key={item.id} item={item} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
