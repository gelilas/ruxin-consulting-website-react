'use client'

import { motion } from 'motion/react'
import { EASE, MonoLabel, RED, VisualSvg, useVisualMotion } from './shared'

const steps = [
  { label: 'Challenge', from: { x: 430, y: 400 }, to: { x: 92, y: 380 } },
  { label: 'Insight', from: { x: 130, y: 150 }, to: { x: 210, y: 322 } },
  { label: 'Strategy', from: { x: 540, y: 330 }, to: { x: 330, y: 262 } },
  { label: 'Decision', from: { x: 250, y: 92 }, to: { x: 446, y: 186 } },
  { label: 'Growth', from: { x: 330, y: 420 }, to: { x: 556, y: 96 } },
]

const pathD = `M ${steps.map((s) => `${s.to.x} ${s.to.y}`).join(' L ')}`
const areaD = `${pathD} L 556 420 L 92 420 Z`
const bars = [0.18, 0.26, 0.24, 0.36, 0.42, 0.5, 0.58, 0.66, 0.78, 0.9]

export function ConsultingVisual() {
  const { d, dur } = useVisualMotion()
  return (
    <VisualSvg label="Animated strategy pathway: scattered points labelled Challenge, Insight, Strategy, Decision and Growth connect into an upward path ending at Growth.">
      {/* chaos lines */}
      <motion.g initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} transition={{ delay: d(1), duration: dur(0.8) }}>
        {steps.map((a, i) =>
          steps.slice(i + 1).map((b, j) => (
            <line key={`${i}-${j}`} x1={a.from.x} y1={a.from.y} x2={b.from.x} y2={b.from.y} stroke="rgba(255,255,255,0.12)" strokeDasharray="2 5" />
          )),
        )}
      </motion.g>

      {/* axis + bars */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d(1.8), duration: dur(0.8) }}>
        <line x1={60} y1={420} x2={590} y2={420} stroke="rgba(255,255,255,0.18)" />
        {bars.map((h, i) => (
          <motion.rect
            key={i}
            x={92 + i * 48}
            width={10}
            fill="rgba(255,255,255,0.08)"
            initial={{ y: 420, height: 0 }}
            animate={{ y: 420 - h * 180, height: h * 180 }}
            transition={{ delay: d(1.9 + i * 0.05), duration: dur(0.9), ease: EASE }}
          />
        ))}
      </motion.g>

      <motion.path d={areaD} fill="url(#rx-area)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d(2.6), duration: dur(1) }} />
      <motion.path
        d={pathD}
        fill="none"
        stroke="#fff"
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: d(1.3), duration: dur(1.6), ease: EASE }}
      />

      {steps.map((s, i) => {
        const last = i === steps.length - 1
        return (
          <motion.g
            key={s.label}
            initial={{ x: s.from.x, y: s.from.y, opacity: 0 }}
            animate={{ x: s.to.x, y: s.to.y, opacity: 1 }}
            transition={{
              opacity: { delay: d(i * 0.08), duration: dur(0.4) },
              x: { delay: d(0.6 + i * 0.08), duration: dur(1.1), ease: EASE },
              y: { delay: d(0.6 + i * 0.08), duration: dur(1.1), ease: EASE },
            }}
          >
            {last && (
              <motion.circle
                r={44}
                fill="url(#rx-glow)"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: [0, 1, 0.7, 1], scale: 1 }}
                transition={{ delay: d(3), duration: dur(1.4) }}
              />
            )}
            <circle r={13} fill="#090909" stroke={last ? RED : 'rgba(255,255,255,0.3)'} />
            <motion.circle
              r={4.5}
              initial={{ fill: '#ffffff' }}
              animate={{ fill: last ? RED : '#ffffff' }}
              transition={{ delay: d(3), duration: dur(0.5) }}
            />
            <MonoLabel x={0} y={last ? -26 : 32} delay={d(1.6 + i * 0.1)} red={last}>
              {s.label}
            </MonoLabel>
          </motion.g>
        )
      })}

      <MonoLabel x={60} y={52} anchor="start" delay={d(0.2)} className="fill-white/40">
        {'Strategy → Decision → Growth'}
      </MonoLabel>
    </VisualSvg>
  )
}
