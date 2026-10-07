'use client'

import { motion } from 'motion/react'
import { Fragment } from 'react'
import { EASE, MonoLabel, RED, StatusBadge, VisualSvg, useVisualMotion } from './shared'

const stack = [
  { from: { x: 380, y: 300, r: 18 }, to: { x: 64, y: 150 } },
  { from: { x: 90, y: 280, r: -22 }, to: { x: 78, y: 162 } },
  { from: { x: 470, y: 110, r: 12 }, to: { x: 92, y: 174 } },
  { from: { x: 210, y: 90, r: -10 }, to: { x: 106, y: 186 } },
]

const doc = { x: 290, y: 84, w: 250, h: 330 }
const clauses = Array.from({ length: 11 }, (_, i) => ({
  y: doc.y + 70 + i * 22,
  w: [0.9, 0.75, 0.82, 0.6, 0.88, 0.7, 0.85, 0.65, 0.8, 0.55, 0.72][i],
}))
const highlighted = [
  { idx: 2, note: 'Liability' },
  { idx: 5, note: 'Termination' },
  { idx: 8, note: 'Compliance' },
]

export function LegalVisual() {
  const { d, dur } = useVisualMotion()
  return (
    <div className="absolute inset-0">
      <VisualSvg label="Abstract legal review: scattered documents organize, key clauses are highlighted and reviewed, and the agreement is marked protected.">
        {stack.map((s, i) => (
          <motion.g
            key={i}
            initial={{ x: s.from.x, y: s.from.y, rotate: s.from.r, opacity: 0 }}
            animate={{ x: s.to.x, y: s.to.y, rotate: 0, opacity: 1 }}
            transition={{
              opacity: { delay: d(i * 0.08), duration: dur(0.4) },
              default: { delay: d(0.4 + i * 0.1), duration: dur(1.2), ease: EASE },
            }}
          >
            <rect width={120} height={156} fill="#0e0e0e" stroke="rgba(255,255,255,0.2)" />
            {[22, 36, 50, 64, 78, 92, 106].map((y, k) => (
              <rect key={y} x={14} y={y} width={k % 3 === 2 ? 60 : 90} height={3} fill="rgba(255,255,255,0.12)" />
            ))}
          </motion.g>
        ))}

        <motion.path
          d={`M 226 260 C 256 260, 260 ${doc.y + 160}, ${doc.x} ${doc.y + 160}`}
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeDasharray="3 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: d(1.6), duration: dur(0.6) }}
        />

        <motion.g initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d(1.4), duration: dur(0.8), ease: EASE }}>
          <rect x={doc.x} y={doc.y} width={doc.w} height={doc.h} fill="#0c0c0c" stroke="rgba(255,255,255,0.3)" />
          <rect x={doc.x + 20} y={doc.y + 24} width={110} height={6} fill="rgba(255,255,255,0.6)" />
          <rect x={doc.x + 20} y={doc.y + 40} width={70} height={3} fill="rgba(255,255,255,0.2)" />
          {clauses.map((c, i) => (
            <rect key={i} x={doc.x + 20} y={c.y} width={(doc.w - 56) * c.w} height={4} fill="rgba(255,255,255,0.16)" />
          ))}
        </motion.g>

        {highlighted.map((h, i) => {
          const c = clauses[h.idx]
          const delay = d(2.2 + i * 0.45)
          const noteY = c.y + 2
          return (
            <Fragment key={h.idx}>
              <motion.rect
                x={doc.x + 16}
                y={c.y - 5}
                height={14}
                width={(doc.w - 48) * c.w}
                fill={RED}
                fillOpacity={0.28}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay, duration: dur(0.5), ease: EASE }}
                style={{ transformOrigin: `${doc.x + 16}px ${c.y}px` }}
              />
              <motion.line
                x1={doc.x + doc.w}
                y1={noteY}
                x2={doc.x + doc.w + 26}
                y2={noteY}
                stroke={RED}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: delay + d(0.3), duration: dur(0.3) }}
              />
              <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: delay + d(0.45), duration: dur(0.4) }}>
                <circle cx={doc.x + doc.w + 34} cy={noteY} r={7} fill="none" stroke={RED} />
                <path d={`M ${doc.x + doc.w + 30.5} ${noteY} l 2.5 2.5 l 4.5 -5`} fill="none" stroke="#fff" strokeWidth={1.25} />
                <text x={doc.x + doc.w + 46} y={noteY + 3.5} className="fill-white/70 font-mono text-[9.5px] uppercase tracking-[0.14em]">
                  {h.note}
                </text>
              </motion.g>
            </Fragment>
          )
        })}

        <motion.rect
          x={doc.x}
          width={doc.w}
          height={2}
          fill={RED}
          initial={{ y: doc.y, opacity: 0 }}
          animate={{ y: [doc.y, doc.y + doc.h], opacity: [0, 0.9, 0] }}
          transition={{ delay: d(1.9), duration: dur(1.8), ease: 'easeInOut' }}
        />

        <MonoLabel x={40} y={52} anchor="start" delay={d(0.2)} className="fill-white/40">
          {'Review → Protection → Confidence'}
        </MonoLabel>
        <MonoLabel x={124} y={370} delay={d(1.2)} className="fill-white/40">
          4 documents
        </MonoLabel>
      </VisualSvg>
      <StatusBadge x={doc.x + doc.w / 2} y={doc.y + doc.h + 12} delay={d(3.9)} sub="Review complete">
        Protected
      </StatusBadge>
    </div>
  )
}
