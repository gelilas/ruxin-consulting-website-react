'use client'

import { motion } from 'motion/react'
import { EASE, MonoLabel, PathFollower, RED, StatusBadge, VisualSvg, useVisualMotion } from './shared'

const C = { x: 320, y: 250 }
const R = 190
const parallels = [-60, -30, 0, 30, 60]
const meridians = [15, 40, 65, 90]

const hubs = [
  { code: 'ADD', name: 'Addis Ababa', x: 352, y: 306 },
  { code: 'RTM', name: 'Rotterdam', x: 262, y: 128 },
  { code: 'DXB', name: 'Dubai', x: 432, y: 238 },
  { code: 'SHA', name: 'Shanghai', x: 470, y: 154 },
  { code: 'NBO', name: 'Nairobi', x: 336, y: 372 },
  { code: 'LOS', name: 'Lagos', x: 196, y: 300 },
]

const arc = (a: { x: number; y: number }, b: { x: number; y: number }, lift = 70) => {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2 - lift
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`
}

const origin = hubs[0]
const destination = hubs[1]
const mainRoute = arc(origin, destination, 90)
const secondary = [arc(origin, hubs[2], 50), arc(hubs[2], hubs[3], 40), arc(origin, hubs[4], 20), arc(hubs[5], origin, 50)]

export function LogisticsVisual() {
  const { d, dur, reduce } = useVisualMotion()
  return (
    <div className="absolute inset-0">
      <VisualSvg label="Abstract global logistics network: a shipment travels along a route from Addis Ababa to Rotterdam and is marked delivered.">
        <defs>
          <clipPath id="globe-clip">
            <circle cx={C.x} cy={C.y} r={R} />
          </clipPath>
        </defs>
        <motion.g initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: dur(1.2), ease: EASE }} style={{ transformOrigin: `${C.x}px ${C.y}px` }}>
          <circle cx={C.x} cy={C.y} r={R} fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.18)" />
          <g clipPath="url(#globe-clip)" stroke="rgba(255,255,255,0.08)" fill="none">
            {parallels.map((lat) => {
              const rad = (lat * Math.PI) / 180
              const rx = R * Math.cos(rad)
              return <ellipse key={lat} cx={C.x} cy={C.y + R * Math.sin(rad)} rx={rx} ry={rx * 0.16} />
            })}
            <motion.g
              animate={reduce ? undefined : { x: [0, -24, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            >
              {meridians.map((lon) => {
                const rx = R * Math.sin((lon * Math.PI) / 180)
                return <ellipse key={lon} cx={C.x} cy={C.y} rx={rx} ry={R} />
              })}
            </motion.g>
          </g>
        </motion.g>

        {secondary.map((p, i) => (
          <g key={i}>
            <motion.path
              d={p}
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeDasharray="3 5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: d(0.8 + i * 0.15), duration: dur(1.2), ease: EASE }}
            />
            <PathFollower d={p} duration={3 + i * 0.6} delay={d(1.6 + i * 0.3)} repeat>
              <circle r={2} fill="#fff" />
            </PathFollower>
          </g>
        ))}

        <motion.path
          d={mainRoute}
          fill="none"
          stroke={RED}
          strokeWidth={1.75}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: d(1.2), duration: dur(1.4), ease: EASE }}
        />

        {hubs.map((h, i) => {
          const isEnd = h.code === destination.code
          const isStart = h.code === origin.code
          return (
            <motion.g
              key={h.code}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: d(0.4 + i * 0.08), duration: dur(0.5), ease: EASE }}
              style={{ transformOrigin: `${h.x}px ${h.y}px` }}
            >
              {isEnd && (
                <motion.circle
                  cx={h.x}
                  cy={h.y}
                  fill="none"
                  stroke={RED}
                  initial={{ r: 6, opacity: 0 }}
                  animate={{ r: [6, 28], opacity: [0.9, 0] }}
                  transition={{ delay: d(4.2), duration: 1.4, repeat: reduce ? 0 : Infinity, repeatDelay: 0.6 }}
                />
              )}
              <circle cx={h.x} cy={h.y} r={isStart || isEnd ? 5 : 3} fill={isStart || isEnd ? '#fff' : 'rgba(255,255,255,0.6)'} />
              {(isStart || isEnd) && <circle cx={h.x} cy={h.y} r={11} fill="none" stroke="rgba(255,255,255,0.3)" />}
              <text x={h.x + 12} y={h.y + 4} className="fill-white/60 font-mono text-[10px] tracking-[0.14em]">
                {h.code}
              </text>
            </motion.g>
          )
        })}

        <PathFollower d={mainRoute} duration={dur(2.6)} delay={d(1.7)}>
          <g>
            <rect x={-7} y={-5} width={14} height={10} fill="#090909" stroke={RED} strokeWidth={1.5} />
            <line x1={-7} y1={0} x2={7} y2={0} stroke={RED} strokeWidth={0.75} />
          </g>
        </PathFollower>

        <MonoLabel x={40} y={52} anchor="start" delay={d(0.2)} className="fill-white/40">
          {'Origin → Route → Destination'}
        </MonoLabel>
        <MonoLabel x={40} y={440} anchor="start" delay={d(0.6)} className="fill-white/40">
          {`${origin.name} → ${destination.name}`}
        </MonoLabel>
      </VisualSvg>
      <StatusBadge x={destination.x + 6} y={destination.y - 50} delay={d(4.4)} sub="Shipment RX-2048">
        Delivered
      </StatusBadge>
    </div>
  )
}
