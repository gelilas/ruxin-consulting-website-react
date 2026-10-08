'use client'

import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const EASE = [0.22, 1, 0.36, 1] as const

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  as?: 'div' | 'section' | 'li' | 'article' | 'header'
}) {
  const reduce = useReducedMotion()
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: reduce ? 0.3 : 0.9, ease: EASE, delay }}
    >
      {children}
    </Comp>
  )
}

/** Word-by-word heading reveal. Each entry in `lines` renders on its own line. */
export function SplitHeading({
  lines,
  className,
  as = 'h2',
  delay = 0,
  accentLast = false,
  animateOnMount = false,
  id,
  accentClassName = 'text-mute',
}: {
  lines: string[]
  className?: string
  as?: 'h1' | 'h2' | 'h3'
  delay?: number
  accentLast?: boolean
  animateOnMount?: boolean
  id?: string
  accentClassName?: string
}) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  let wordIndex = 0
  const trigger = animateOnMount ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, margin: '-10% 0px' } }
  return (
    <Tag id={id} className={className} initial="hidden" {...trigger} aria-label={lines.join(' ')}>
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden="true">
          {line.split(' ').map((word, wi) => {
            const i = wordIndex++
            return (
              <span key={wi} className="inline-block overflow-hidden pb-[0.08em] align-top">
                <motion.span
                  className={cn('inline-block', accentLast && li === lines.length - 1 && accentClassName)}
                  variants={{
                    hidden: { y: reduce ? 0 : '105%', opacity: reduce ? 0 : 1 },
                    show: { y: '0%', opacity: 1 },
                  }}
                  transition={{ duration: reduce ? 0.4 : 0.9, ease: EASE, delay: delay + i * 0.06 }}
                >
                  {word}
                  {'\u00A0'}
                </motion.span>
              </span>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}

export function Counter({ value, suffix = '', className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setDisplay(value)
      return
    }
    const controls = animate(0, value, {
      duration: 2,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value, reduce])

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  )
}

/** Subtle cursor-following displacement for CTAs. */
export function Magnetic({ children, strength = 0.3, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.3 })
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.3 })

  return (
    <motion.div
      ref={ref}
      className={cn('inline-block', className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse' || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

export function Eyebrow({
  children,
  className,
  dark = false,
  mark = 'red',
}: {
  children: ReactNode
  className?: string
  dark?: boolean
  mark?: 'red' | 'white'
}) {
  return (
    <p
      className={cn(
        'flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em]',
        dark ? 'text-mute' : 'text-ink/50',
        className,
      )}
    >
      <span className="relative flex size-1.5">
        <span className={cn('absolute inset-0 rounded-full', mark === 'white' ? 'bg-white' : 'bg-ruxin')} />
      </span>
      {children}
    </p>
  )
}
