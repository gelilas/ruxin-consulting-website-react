'use client'

import { animate, motion, useReducedMotion } from 'motion/react'
import { Check } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const VB_W = 640
export const VB_H = 480
export const RED = '#B0161E'
export const EASE = [0.22, 1, 0.36, 1] as const

/** Shared props: every visual receives `active` so it can stay calm until shown. */
export type VisualProps = { reduce?: boolean }

export function useVisualMotion() {
  const reduce = useReducedMotion() ?? false
  /** Delay helper: collapse the choreography when reduced motion is preferred. */
  const d = (s: number) => (reduce ? 0 : s)
  const dur = (s: number) => (reduce ? 0.4 : s)
  return { reduce, d, dur }
}

export function VisualSvg({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 size-full" role="img" aria-label={label}>
      <defs>
        <radialGradient id="rx-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={RED} stopOpacity="0.55" />
          <stop offset="100%" stopColor={RED} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rx-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={RED} stopOpacity="0.28" />
          <stop offset="100%" stopColor={RED} stopOpacity="0" />
        </linearGradient>
      </defs>
      {children}
    </svg>
  )
}

export function MonoLabel({
  x,
  y,
  children,
  anchor = 'middle',
  className,
  delay = 0,
  red = false,
}: {
  x: number
  y: number
  children: ReactNode
  anchor?: 'start' | 'middle' | 'end'
  className?: string
  delay?: number
  red?: boolean
}) {
  return (
    <motion.text
      x={x}
      y={y}
      textAnchor={anchor}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
      className={cn('font-mono text-[11px] uppercase tracking-[0.16em]', red ? 'fill-ruxin' : 'fill-white/70', className)}
    >
      {children}
    </motion.text>
  )
}

/** Moves its children along an SVG path. */
export function PathFollower({
  d,
  duration,
  delay = 0,
  repeat = false,
  children,
}: {
  d: string
  duration: number
  delay?: number
  repeat?: boolean
  children: ReactNode
}) {
  const pathRef = useRef<SVGPathElement>(null)
  const gRef = useRef<SVGGElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const path = pathRef.current
    const g = gRef.current
    if (!path || !g) return
    const len = path.getTotalLength()
    const place = (v: number) => {
      const p = path.getPointAtLength(len * v)
      g.setAttribute('transform', `translate(${p.x} ${p.y})`)
      g.style.opacity = repeat ? String(Math.sin(v * Math.PI)) : '1'
    }
    if (reduce) {
      place(repeat ? 0.5 : 1)
      return
    }
    place(0)
    g.style.opacity = '0'
    const controls = animate(0, 1, {
      duration,
      delay,
      ease: repeat ? 'linear' : [0.65, 0, 0.35, 1],
      repeat: repeat ? Infinity : 0,
      onUpdate: place,
    })
    return () => controls.stop()
  }, [d, duration, delay, repeat, reduce])

  return (
    <>
      <path ref={pathRef} d={d} fill="none" stroke="none" />
      <g ref={gRef}>{children}</g>
    </>
  )
}

export function Node({ r = 4, red = false, ring = true }: { r?: number; red?: boolean; ring?: boolean }) {
  return (
    <>
      {ring && <circle r={r * 3} fill="none" stroke={red ? RED : 'rgba(255,255,255,0.22)'} strokeWidth={1} />}
      <circle r={r} fill={red ? RED : '#fff'} />
    </>
  )
}

/** HTML badge positioned in viewBox coordinates. */
export function StatusBadge({
  x,
  y,
  delay,
  children,
  sub,
}: {
  x: number
  y: number
  delay: number
  children: ReactNode
  sub?: string
}) {
  return (
    <motion.div
      className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 rounded-full border border-ruxin/50 bg-ink/90 py-1.5 pl-1.5 pr-4 shadow-[0_0_40px_-8px_rgba(176,22,30,0.7)] backdrop-blur"
      style={{ left: `${(x / VB_W) * 100}%`, top: `${(y / VB_H) * 100}%` }}
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: EASE }}
    >
      <span className="flex size-6 items-center justify-center rounded-full bg-ruxin">
        <Check className="size-3.5 text-white" strokeWidth={2.5} aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[13px] font-semibold text-white">{children}</span>
        {sub && <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/50">{sub}</span>}
      </span>
    </motion.div>
  )
}

/** Seeded pseudo-random for deterministic SSR/CSR layouts. */
export function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}
