'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useSiteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import { EASE } from '@/components/motion/primitives'

const DURATION = 7000

export function Testimonials() {
  const { testimonials } = useSiteContent()
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()
  const t = testimonials[index]

  const go = useCallback((delta: number) => {
    setDirection(delta)
    setIndex((i) => (i + delta + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    if (paused || reduce) return
    const id = setTimeout(() => go(1), DURATION)
    return () => clearTimeout(id)
  }, [index, paused, reduce, go])

  return (
    <div
      className="mx-auto mt-24 max-w-[1440px] px-5 md:mt-36 md:px-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <section aria-roledescription="carousel" aria-label="Client testimonials" className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="flex flex-row items-center justify-between gap-6 lg:col-span-3 lg:flex-col lg:items-start lg:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-500">Testimonials</p>
            <p className="mt-3 font-mono text-sm text-ink" aria-live="polite">
              <span className="font-semibold">{String(index + 1).padStart(2, '0')}</span>
              <span className="text-ink/40"> / {String(testimonials.length).padStart(2, '0')}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex size-12 items-center justify-center rounded-full border border-ink/15 transition-colors hover:border-ink hover:bg-ink hover:text-white"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="flex size-12 items-center justify-center rounded-full border border-ink/15 transition-colors hover:border-ink hover:bg-ink hover:text-white"
              aria-label="Next testimonial"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="relative lg:col-span-9">
          <div className="relative min-h-[420px] overflow-hidden md:min-h-[400px]">
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.figure
                key={index}
                custom={direction}
                variants={{
                  enter: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir * 80 }),
                  center: { opacity: 1, x: 0 },
                  exit: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir * -80 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.7, ease: EASE }}
                drag={reduce ? false : 'x'}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) go(1)
                  else if (info.offset.x > 80) go(-1)
                }}
                className="cursor-grab touch-pan-y select-none active:cursor-grabbing"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${testimonials.length}`}
              >
                <p className="flex items-center gap-2 text-lg font-semibold tracking-[0.2em] text-ink/50">
                  <span className="size-2.5 rounded-full border border-ruxin bg-ruxin" aria-hidden="true" />
                  {t.mark}
                </p>
                <blockquote className="mt-8">
                  <p className="text-balance text-[clamp(1.75rem,3.6vw,3.4rem)] font-medium leading-[1.1] tracking-[-0.025em]">
                    <span className="text-ruxin">{'“'}</span>
                    {t.quote}
                    <span className="text-ruxin">{'”'}</span>
                  </p>
                  <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-ink/60">{t.detail}</p>
                </blockquote>
                <figcaption className="mt-10 flex items-center gap-4">
                  <span className="h-px w-10 bg-ruxin" aria-hidden="true" />
                  <span>
                    <span className="block font-medium">{t.name}</span>
                    <span className="block text-sm text-ink/55">
                      {t.role}, {t.company}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex gap-2" role="tablist" aria-label="Select testimonial">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => go(i - index || 0)}
                className="relative h-8 flex-1"
              >
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ink/15" />
                {i === index && (
                  <motion.span
                    key={`${index}-${paused}`}
                    className={cn('absolute inset-x-0 top-1/2 h-px origin-left -translate-y-1/2 bg-ruxin')}
                    initial={{ scaleX: paused || reduce ? 1 : 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: paused || reduce ? 0.3 : DURATION / 1000, ease: 'linear' }}
                  />
                )}
                {i < index && <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ink/50" />}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
