'use client'

import { animate, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { EASE, RED, VisualSvg, VB_H, VB_W, seeded, useVisualMotion, MonoLabel } from './shared'

const rand = seeded(42)
const COUNT = 22
const points = Array.from({ length: COUNT }, (_, i) => {
  const u = i / (COUNT - 1)
  const trend = 380 - u * 250 - Math.sin(u * 9) * 14 - (rand() - 0.5) * 18
  return {
    from: { x: 60 + rand() * 520, y: 90 + rand() * 300 },
    to: { x: 70 + u * 500, y: trend },
  }
})
const lineD = `M ${points.map((p) => `${p.to.x.toFixed(1)} ${p.to.y.toFixed(1)}`).join(' L ')}`
const areaD = `${lineD} L 570 410 L 70 410 Z`
const floatingNumbers = ['1.24', '−0.8', '3.6k', '17%', '0.92', '4.1M', '−2.3', '88']

function useCount(target: number, delay: number, reduce: boolean) {
  const [v, setV] = useState(reduce ? target : 0)
  useEffect(() => {
    if (reduce) return
    const c = animate(0, target, { delay, duration: 1.8, ease: EASE, onUpdate: (n) => setV(Math.round(n)) })
    return () => c.stop()
  }, [target, delay, reduce])
  return v
}

export function FinanceVisual() {
  const { d, dur, reduce } = useVisualMotion()
  const pct = useCount(24, d(2.6), reduce)

  return (
    <div className="absolute inset-0">
      <VisualSvg label="Financial data visualization: scattered data points organize into a clean upward trend line. Illustrative demo data.">
        {[150, 230, 310, 390].map((y) => (
          <line key={y} x1={60} x2={580} y1={y} y2={y} stroke="rgba(255,255,255,0.06)" />
        ))}
        <line x1={60} x2={580} y1={410} y2={410} stroke="rgba(255,255,255,0.18)" />

        {floatingNumbers.map((n, i) => (
          <motion.text
            key={n}
            x={90 + ((i * 67) % 480)}
            y={130 + ((i * 97) % 250)}
            className="fill-white/40 font-mono text-[10px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0], y: [130 + ((i * 97) % 250), 110 + ((i * 97) % 250)] }}
            transition={{ delay: d(0.1 + i * 0.12), duration: dur(1.8) }}
          >
            {n}
          </motion.text>
        ))}

        {points.map((p, i) => (
          <motion.rect
            key={`bar-${i}`}
            x={p.to.x - 3}
            width={6}
            fill="rgba(255,255,255,0.07)"
            initial={{ y: 410, height: 0 }}
            animate={{ y: 410 - (20 + (i % 5) * 9), height: 20 + (i % 5) * 9 }}
            transition={{ delay: d(1.6 + i * 0.03), duration: dur(0.7), ease: EASE }}
          />
        ))}

        <motion.path d={areaD} fill="url(#rx-area)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d(2.4), duration: dur(1) }} />
        <motion.path
          d={lineD}
          fill="none"
          stroke="#fff"
          strokeWidth={1.5}
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: d(1.5), duration: dur(1.6), ease: EASE }}
        />

        {points.map((p, i) => (
          <motion.circle
            key={i}
            r={i === COUNT - 1 ? 5 : 2.2}
            fill={i === COUNT - 1 ? RED : '#fff'}
            initial={{ cx: p.from.x, cy: p.from.y, opacity: 0 }}
            animate={{ cx: p.to.x, cy: p.to.y, opacity: 1 }}
            transition={{
              opacity: { delay: d(i * 0.02), duration: dur(0.3) },
              cx: { delay: d(0.6 + i * 0.02), duration: dur(1.1), ease: EASE },
              cy: { delay: d(0.6 + i * 0.02), duration: dur(1.1), ease: EASE },
            }}
          />
        ))}
        <motion.circle
          cx={points[COUNT - 1].to.x}
          cy={points[COUNT - 1].to.y}
          r={40}
          fill="url(#rx-glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: d(3), duration: dur(0.8) }}
        />

        <MonoLabel x={60} y={52} anchor="start" delay={d(0.2)} className="fill-white/40">
          {'Data → Insight → Growth'}
        </MonoLabel>
        {['Q1', 'Q2', 'Q3', 'Q4'].map((q, i) => (
          <text key={q} x={70 + i * 166} y={432} className="fill-white/35 font-mono text-[9px] tracking-[0.14em]">
            {q}
          </text>
        ))}
      </VisualSvg>

      <motion.div
        className="absolute flex flex-col"
        style={{ left: `${(60 / VB_W) * 100}%`, top: `${(80 / VB_H) * 100}%` }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: d(2.5), duration: dur(0.6), ease: EASE }}
      >
        <span className="text-[clamp(1.8rem,4vw,3.25rem)] font-semibold leading-none tracking-tight text-white">
          +{pct}
          <span className="text-ruxin">%</span>
        </span>
        <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">Business Performance</span>
        <span className="mt-2 w-fit rounded-sm border border-white/15 px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.16em] text-white/40">
          Illustrative demo data
        </span>
      </motion.div>
    </div>
  )
}
