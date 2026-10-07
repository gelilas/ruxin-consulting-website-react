'use client'

import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'

/** A soft trailing ring that complements (never replaces) the native cursor on fine pointers. */
export function Cursor() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 350, damping: 30, mass: 0.4 })

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    setEnabled(mq.matches)
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const target = e.target as HTMLElement | null
      setHovering(!!target?.closest('a, button, [role="tab"], input, textarea, select, [data-cursor="hover"]'))
    }
    const onLeave = () => setVisible(false)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [x, y])

  if (!enabled || reduce) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
        animate={{
          width: hovering ? 44 : 22,
          height: hovering ? 44 : 22,
          opacity: visible ? (hovering ? 0.9 : 0.5) : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      />
    </motion.div>
  )
}
