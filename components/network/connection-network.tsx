'use client'

import { useEffect, useRef } from 'react'
import { useSiteContent } from '@/lib/site-content'

type Vec = { x: number; y: number }
type Particle = { x: number; y: number; vx: number; vy: number; seed: number; size: number }
type Traveler = { edge: number; t: number; speed: number }

const RED = '176, 22, 30'
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const ease = (t: number) => 1 - Math.pow(1 - clamp(t), 3)
const mix = (a: Vec, b: Vec, t: number): Vec => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) })

function quad(p0: Vec, c: Vec, p1: Vec, t: number): Vec {
  const u = 1 - t
  return { x: u * u * p0.x + 2 * u * t * c.x + t * t * p1.x, y: u * u * p0.y + 2 * u * t * c.y + t * t * p1.y }
}

/**
 * The Ruxin Connection Network. A single canvas that evolves with scroll:
 * phase 0 = radial network (hero) → phase 1 = organized pathway (about) → phase 2 = five branches (services).
 * Phase anchors are read from elements with ids `about` and `services-intro`.
 */
export function ConnectionNetwork({ onLight = false }: { onLight?: boolean }) {
  const { about, services } = useSiteContent()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    let w = 0
    let h = 0
    let compact = false
    let dpr = 1
    let particles: Particle[] = []
    let travelers: Traveler[] = []
    let raf = 0
    let running = true
    let phase = 0
    const start = performance.now()
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, active: false, glow: 0 }
    const labels = services.map((s) => s.name.toUpperCase())

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      compact = w < 1024
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = compact ? 34 : 90
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        seed: Math.random() * 1000,
        size: Math.random() * 1.3 + 0.4,
      }))
      travelers = []
      for (let e = 0; e < 5; e++) {
        const n = compact ? 1 : 2
        for (let k = 0; k < n; k++) travelers.push({ edge: e, t: Math.random(), speed: 0.0018 + Math.random() * 0.0022 })
      }
    }

    const layout = () => {
      const cx = compact ? w * 0.5 : w * 0.72
      const cy = compact ? h * 0.3 : h * 0.52
      const R = compact ? Math.min(w * 0.32, h * 0.19) : Math.min(w * 0.19, h * 0.31)
      return { cx, cy, R }
    }

    const readPhase = () => {
      const vh = window.innerHeight
      const aboutEl = document.getElementById('about')
      const introEl = document.getElementById('services-intro')
      const p1 = aboutEl ? clamp((vh * 0.95 - aboutEl.getBoundingClientRect().top) / (vh * 0.7)) : 0
      const p2 = introEl ? clamp((vh * 0.95 - introEl.getBoundingClientRect().top) / (vh * 0.65)) : 0
      return p1 + p2
    }

    const onMove = (e: PointerEvent) => {
      if (!fine || reduce) return
      const r = canvas.getBoundingClientRect()
      mouse.tx = e.clientX - r.left
      mouse.ty = e.clientY - r.top
      mouse.active = true
    }
    const onLeave = () => {
      mouse.active = false
    }

    const draw = (now: number) => {
      const t = reduce ? 100 : (now - start) / 1000
      const target = readPhase()
      phase = reduce ? target : lerp(phase, target, 0.07)
      const { cx, cy, R } = layout()

      mouse.x = lerp(mouse.x || cx, mouse.active ? mouse.tx : cx, 0.06)
      mouse.y = lerp(mouse.y || cy, mouse.active ? mouse.ty : cy, 0.06)
      mouse.glow = lerp(mouse.glow, mouse.active ? 1 : 0, 0.05)
      const mdx = clamp((mouse.x - cx) / (w * 0.5), -1, 1)
      const mdy = clamp((mouse.y - cy) / (h * 0.5), -1, 1)
      const mouseDist = Math.hypot(mouse.x - cx, mouse.y - cy)
      const proximity = mouse.active ? clamp(1 - mouseDist / (R * 2.4)) : 0

      const toPath = ease(clamp(phase))
      const toBranch = ease(clamp(phase - 1))
      const pathness = clamp(1 - Math.abs(phase - 1) * 1.6)
      const alive = reduce ? 0 : ease((t - 3.2) / 1.5)
      const tone = onLight ? 9 : 255
      const line = (alpha: number) => `rgba(${tone}, ${tone}, ${tone}, ${onLight ? Math.min(1, alpha * 2.4) : alpha})`

      ctx.clearRect(0, 0, w, h)

      // Interaction glow
      if (mouse.glow > 0.01) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, R * 1.4)
        g.addColorStop(0, `rgba(${RED}, ${0.16 * mouse.glow})`)
        g.addColorStop(1, `rgba(${RED}, 0)`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }

      // Compute node positions for each phase
      const radial: Vec[] = [{ x: cx, y: cy }]
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + (i * Math.PI * 2) / 5 + Math.sin(t * 0.25 + i) * 0.04 * alive
        const rr = R * (1 + (i % 2 ? 0.08 : -0.04)) + Math.sin(t * 0.6 + i * 1.7) * 6 * alive
        radial.push({ x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr })
      }
      const pathStart = { x: cx - R * 1.25, y: cy + R * 0.7 }
      const pathEnd = { x: cx + R * 1.25, y: cy - R * 0.7 }
      const pathPoint = (k: number): Vec => {
        const u = k / 5
        const base = mix(pathStart, pathEnd, u)
        return { x: base.x, y: base.y + Math.sin(u * Math.PI) * R * 0.18 }
      }
      const path: Vec[] = [pathPoint(5), pathPoint(0), pathPoint(1), pathPoint(2), pathPoint(3), pathPoint(4)]
      const spread = compact ? Math.min(w * 0.42, R * 1.5) : R * 1.35
      const branch: Vec[] = [{ x: cx, y: cy - R * 0.85 }]
      for (let i = 0; i < 5; i++) {
        const u = i / 4
        branch.push({ x: cx - spread + u * spread * 2, y: cy + R * 0.7 + Math.abs(u - 0.5) * -R * 0.25 })
      }

      const nodes: Vec[] = radial.map((r, i) => {
        let p = mix(r, path[i], toPath)
        p = mix(p, branch[i], toBranch)
        const depth = i === 0 ? 6 : 12 + i * 2
        return {
          x: p.x + mdx * depth * (1 - pathness * 0.6) + Math.sin(t * 0.9 + i * 2.1) * 2.5 * alive,
          y: p.y + mdy * depth * (1 - pathness * 0.6) + Math.cos(t * 0.8 + i * 1.3) * 2.5 * alive,
        }
      })

      // Ambient particles: free drift (complexity) → pulled onto the pathway (clarity)
      const particleIn = ease((t - 0.3) / 1.1)
      for (const p of particles) {
        if (!reduce) {
          p.x += p.vx + mdx * 0.05
          p.y += p.vy + mdy * 0.05
          if (p.x < 0) p.x = w
          if (p.x > w) p.x = 0
          if (p.y < 0) p.y = h
          if (p.y > h) p.y = 0
        }
        let px = p.x
        let py = p.y
        if (pathness > 0.01 && !compact) {
          const u = (p.seed % 100) / 100
          const base = mix(pathStart, pathEnd, u)
          const target = { x: base.x, y: base.y + Math.sin(u * Math.PI) * R * 0.18 + Math.sin(p.seed + t) * 8 }
          px = lerp(p.x, target.x, pathness * 0.85)
          py = lerp(p.y, target.y, pathness * 0.85)
        }
        const twinkle = 0.35 + Math.sin(t * 1.4 + p.seed) * 0.2
        ctx.fillStyle = line(twinkle * particleIn * 0.6)
        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      // Edges
      const lineDraw = reduce ? 1 : ease((t - 1.7) / 1.1)
      const edgeCurve = (a: Vec, b: Vec, bend: number): Vec => {
        const mx = (a.x + b.x) / 2
        const my = (a.y + b.y) / 2
        const dx = b.x - a.x
        const dy = b.y - a.y
        return { x: mx - dy * bend, y: my + dx * bend }
      }
      const starEdges = [1, 2, 3, 4, 5].map((i) => {
        const a = nodes[0]
        const b = nodes[i]
        const bend = lerp(0.06 * (i % 2 ? 1 : -1), 0, toBranch)
        let c = edgeCurve(a, b, bend)
        if (toBranch > 0) c = mix(c, { x: b.x, y: a.y + (b.y - a.y) * 0.15 }, toBranch)
        return { a, b, c }
      })
      const pathOrder = [1, 2, 3, 4, 5, 0]
      const pathEdges = pathOrder.slice(0, -1).map((from, k) => ({ a: nodes[from], b: nodes[pathOrder[k + 1]] }))

      const starAlpha = 1 - pathness
      if (starAlpha > 0.01) {
        starEdges.forEach(({ a, b, c }, i) => {
          const isHot = mouse.active && proximity > 0.2
          ctx.strokeStyle = isHot ? `rgba(${RED}, ${0.5 * starAlpha})` : line(0.2 * starAlpha)
          ctx.lineWidth = 1
          ctx.beginPath()
          const steps = 28
          const progress = clamp(lineDraw * 1.4 - i * 0.08)
          for (let s = 0; s <= steps * progress; s++) {
            const pt = quad(a, c, b, s / steps)
            if (s === 0) ctx.moveTo(pt.x, pt.y)
            else ctx.lineTo(pt.x, pt.y)
          }
          ctx.stroke()
        })
      }
      if (pathness > 0.01) {
        ctx.strokeStyle = line(0.35 * pathness)
        ctx.lineWidth = 1
        ctx.setLineDash([])
        ctx.beginPath()
        pathEdges.forEach(({ a, b }, k) => {
          if (k === 0) ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
        })
        ctx.stroke()
      }

      // Travelling particles
      if (lineDraw >= 1) {
        const speedMul = 1 + proximity * 1.4
        const dir = mdx < -0.4 && mouse.active ? -1 : 1
        for (const tr of travelers) {
          if (!reduce) {
            tr.t += tr.speed * speedMul * dir
            if (tr.t > 1) tr.t -= 1
            if (tr.t < 0) tr.t += 1
          }
          let pt: Vec
          if (pathness > 0.5) {
            const e = pathEdges[tr.edge]
            pt = mix(e.a, e.b, tr.t)
          } else {
            const e = starEdges[tr.edge]
            pt = quad(e.a, e.c, e.b, tr.t)
          }
          const fade = Math.sin(tr.t * Math.PI)
          ctx.fillStyle = `rgba(${RED}, ${0.9 * fade})`
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = `rgba(${RED}, ${0.18 * fade})`
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Service nodes
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const labelIn = reduce ? 1 : ease((t - 3.0) / 0.8)
      for (let i = 1; i <= 5; i++) {
        const appear = reduce ? 1 : ease((t - 0.9 - (i - 1) * 0.18) / 0.5)
        if (appear <= 0) continue
        const n = nodes[i]
        const pulse = 1 + Math.sin(t * 1.6 + i) * 0.08 * alive
        ctx.strokeStyle = line(0.22 * appear)
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(n.x, n.y, 13 * appear * pulse, 0, Math.PI * 2)
        ctx.stroke()
        ctx.fillStyle = '#090909'
        ctx.beginPath()
        ctx.arc(n.x, n.y, 5 * appear, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = `rgba(255,255,255,${0.95 * appear})`
        ctx.beginPath()
        ctx.arc(n.x, n.y, 3.2 * appear, 0, Math.PI * 2)
        ctx.fill()

        const serviceLabelAlpha = labelIn * (1 - pathness)
        if (serviceLabelAlpha > 0.01) {
          ctx.font = `500 ${compact ? 9 : 10.5}px ui-monospace, "Geist Mono", monospace`
          if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '2px'
          const label = toBranch > 0.5 ? (compact ? services[i - 1].number : `${services[i - 1].number}  ${labels[i - 1]}`) : labels[i - 1]
          let ly: number
          let lx = n.x
          if (toBranch > 0.5) {
            ly = n.y + 30
          } else {
            const ang = Math.atan2(n.y - nodes[0].y, n.x - nodes[0].x)
            lx = n.x + Math.cos(ang) * 34
            ly = n.y + Math.sin(ang) * 26
          }
          ctx.fillStyle = line(0.8 * serviceLabelAlpha)
          ctx.fillText(label, lx, ly)
        }
      }

      // Stage labels on the pathway
      if (pathness > 0.05 && !compact) {
        ctx.font = '500 10.5px ui-monospace, "Geist Mono", monospace'
        if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '2px'
        about.stages.forEach((stage, k) => {
          const pp = pathPoint((k / (about.stages.length - 1)) * 5)
          const isLast = k === about.stages.length - 1
          ctx.fillStyle = isLast ? `rgba(${RED}, ${pathness})` : line(0.72 * pathness)
          ctx.fillText(stage.toUpperCase(), pp.x, pp.y + 34)
          ctx.fillStyle = line(0.45 * pathness)
          ctx.fillText(`0${k + 1}`, pp.x, pp.y - 30)
        })
      }

      // Central RUXIN node
      const centerIn = reduce ? 1 : ease((t - 2.5) / 0.7)
      if (centerIn > 0) {
        const c = nodes[0]
        const baseR = (compact ? 30 : 44) * (1 - pathness * 0.35)
        const r = baseR * centerIn * (1 + proximity * 0.08)
        const halo = ctx.createRadialGradient(c.x, c.y, r * 0.6, c.x, c.y, r * 3.2)
        halo.addColorStop(0, `rgba(${RED}, ${(0.28 + proximity * 0.2) * centerIn})`)
        halo.addColorStop(1, `rgba(${RED}, 0)`)
        ctx.fillStyle = halo
        ctx.beginPath()
        ctx.arc(c.x, c.y, r * 3.2, 0, Math.PI * 2)
        ctx.fill()

        const ring = (t * 0.5) % 1
        if (!reduce) {
          ctx.strokeStyle = `rgba(${RED}, ${(1 - ring) * 0.5 * centerIn})`
          ctx.beginPath()
          ctx.arc(c.x, c.y, r + ring * r * 0.9, 0, Math.PI * 2)
          ctx.stroke()
        }

        ctx.fillStyle = '#0c0c0c'
        ctx.beginPath()
        ctx.arc(c.x, c.y, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = `rgba(${RED}, ${centerIn})`
        ctx.lineWidth = 1.25
        ctx.stroke()

        if (r > 18) {
          ctx.fillStyle = `rgba(255,255,255,${centerIn})`
          ctx.font = `700 ${Math.round(r * 0.3)}px ui-sans-serif, "Geist", sans-serif`
          if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${Math.round(r * 0.06)}px`
          ctx.fillText('RUXIN', c.x + r * 0.03, c.y + 1)
        }
      }

      if (running) raf = requestAnimationFrame(draw)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      const shouldRun = entry.isIntersecting && !document.hidden
      if (shouldRun && !running) {
        running = true
        raf = requestAnimationFrame(draw)
      } else if (!shouldRun) {
        running = false
        cancelAnimationFrame(raf)
      }
    })
    io.observe(canvas)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(draw)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [onLight, about, services])

  return <canvas ref={canvasRef} className="block size-full" aria-hidden="true" />
}
