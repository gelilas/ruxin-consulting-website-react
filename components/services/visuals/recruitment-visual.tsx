'use client'

import { motion } from 'motion/react'
import { EASE, MonoLabel, RED, StatusBadge, VisualSvg, useVisualMotion } from './shared'

const skills = ['Leadership', 'Finance', 'Technology', 'Operations', 'Management']
const skillX = (i: number) => 88 + i * 116

const candidates = [
  { x: 96, y: 210, skill: 0 },
  { x: 168, y: 300, skill: 1 },
  { x: 240, y: 200, skill: 2 },
  { x: 120, y: 390, skill: 4 },
  { x: 300, y: 330, skill: 3 },
  { x: 210, y: 410, skill: 2 },
  { x: 350, y: 230, skill: 0 },
  { x: 380, y: 400, skill: 4 },
]
const MATCH = 4
const scanOrder = [0, 2, 6, 1, 4]
const opportunity = { x: 540, y: 300 }

function Person({ highlight }: { highlight?: boolean }) {
  return (
    <g>
      <circle r={20} fill="#0c0c0c" stroke={highlight ? RED : 'rgba(255,255,255,0.25)'} strokeWidth={highlight ? 1.5 : 1} />
      <circle cy={-5} r={5.5} fill={highlight ? '#fff' : 'rgba(255,255,255,0.7)'} />
      <path d="M -10 12 Q -10 2 0 2 Q 10 2 10 12" fill={highlight ? '#fff' : 'rgba(255,255,255,0.7)'} />
    </g>
  )
}

export function RecruitmentVisual() {
  const { d, dur, reduce } = useVisualMotion()
  const matchC = candidates[MATCH]
  const scanXs = scanOrder.map((i) => candidates[i].x)
  const scanYs = scanOrder.map((i) => candidates[i].y)

  return (
    <div className="absolute inset-0">
      <VisualSvg label="Abstract talent network: candidate profiles linked to skills are scanned until one candidate is connected to an opportunity as a perfect match.">
        {skills.map((s, i) => (
          <motion.g key={s} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d(0.1 + i * 0.08), duration: dur(0.6), ease: EASE }}>
            <rect x={skillX(i) - 50} y={78} width={100} height={26} rx={13} fill="none" stroke={i === candidates[MATCH].skill ? RED : 'rgba(255,255,255,0.18)'} />
            <text x={skillX(i)} y={95} textAnchor="middle" className="fill-white/70 font-mono text-[9.5px] uppercase tracking-[0.14em]">
              {s}
            </text>
          </motion.g>
        ))}

        {candidates.map((c, i) => (
          <motion.line
            key={`l-${i}`}
            x1={skillX(c.skill)}
            y1={104}
            x2={c.x}
            y2={c.y - 20}
            stroke={i === MATCH ? RED : 'rgba(255,255,255,0.08)'}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: i === MATCH ? [0, 0.3, 0.9] : 1 }}
            transition={{ delay: d(0.6 + i * 0.05), duration: dur(i === MATCH ? 3.2 : 1), ease: EASE }}
          />
        ))}

        {candidates.map((c, i) => (
          <motion.g
            key={`c-${i}`}
            initial={{ opacity: 0, scale: 0.6, x: c.x, y: c.y }}
            animate={{ opacity: i === MATCH ? 1 : [0, 1, 1, 0.35], scale: 1, x: c.x, y: c.y }}
            transition={{
              opacity: { delay: d(0.3 + i * 0.06), duration: dur(i === MATCH ? 0.6 : 3.4), times: i === MATCH ? undefined : [0, 0.1, 0.8, 1] },
              scale: { delay: d(0.3 + i * 0.06), duration: dur(0.6), ease: EASE },
            }}
          >
            <Person highlight={i === MATCH} />
          </motion.g>
        ))}

        {!reduce && (
          <motion.circle
            r={30}
            fill="none"
            stroke={RED}
            strokeWidth={1.25}
            strokeDasharray="4 4"
            initial={{ cx: scanXs[0], cy: scanYs[0], opacity: 0 }}
            animate={{ cx: scanXs, cy: scanYs, opacity: [0, 1, 1, 1, 1] }}
            transition={{ delay: 1.1, duration: 2.4, ease: 'easeInOut' }}
          />
        )}

        <motion.path
          d={`M ${matchC.x + 20} ${matchC.y} C ${matchC.x + 110} ${matchC.y}, ${opportunity.x - 120} ${opportunity.y}, ${opportunity.x - 28} ${opportunity.y}`}
          fill="none"
          stroke={RED}
          strokeWidth={1.75}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: d(3.6), duration: dur(0.9), ease: EASE }}
        />

        <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: d(0.9), duration: dur(0.6), ease: EASE }} style={{ transformOrigin: `${opportunity.x}px ${opportunity.y}px` }}>
          <motion.circle
            cx={opportunity.x}
            cy={opportunity.y}
            r={60}
            fill="url(#rx-glow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: d(4.3), duration: dur(0.8) }}
          />
          <rect x={opportunity.x - 28} y={opportunity.y - 28} width={56} height={56} fill="#0c0c0c" stroke="rgba(255,255,255,0.35)" />
          <rect x={opportunity.x - 12} y={opportunity.y - 6} width={24} height={16} fill="none" stroke="#fff" strokeWidth={1.25} />
          <path d={`M ${opportunity.x - 5} ${opportunity.y - 6} v -4 h 10 v 4`} fill="none" stroke="#fff" strokeWidth={1.25} />
          <text x={opportunity.x} y={opportunity.y + 50} textAnchor="middle" className="fill-white/70 font-mono text-[10px] uppercase tracking-[0.14em]">
            Opportunity
          </text>
          <text x={opportunity.x} y={opportunity.y + 66} textAnchor="middle" className="fill-white/40 font-mono text-[9px] uppercase tracking-[0.14em]">
            Head of Operations
          </text>
        </motion.g>

        <MonoLabel x={40} y={52} anchor="start" delay={d(0.2)} className="fill-white/40">
          {'Talent → Match → Opportunity'}
        </MonoLabel>
      </VisualSvg>
      <StatusBadge x={445} y={210} delay={d(4.4)} sub="98% alignment">
        Perfect Match
      </StatusBadge>
    </div>
  )
}
