'use client'

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSiteContent } from '@/lib/site-content'
import { cn } from '@/lib/utils'
import { EASE, Magnetic } from '@/components/motion/primitives'

export function Logo({ className, light = true, mark = 'red' }: { className?: string; light?: boolean; mark?: 'red' | 'white' }) {
  return (
    <a href="#top" className={cn('group flex items-center gap-2.5', className)} aria-label="Ruxin Consulting — home">
      <span className="relative flex size-7 items-center justify-center" aria-hidden="true">
        <span
          className={cn(
            'absolute inset-0 rounded-full border transition-transform duration-500 group-hover:scale-110',
            mark === 'white' ? 'border-white/80' : 'border-ruxin/70',
          )}
        />
        <span className={cn('size-2 rounded-full', mark === 'white' ? 'bg-white' : 'bg-ruxin')} />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn('text-[17px] font-bold tracking-[0.18em]', light ? 'text-white' : 'text-ink')}>RUXIN</span>
        <span className={cn('mt-1 font-mono text-[8.5px] tracking-[0.42em]', light ? 'text-mute' : 'text-ink/45')}>
          CONSULTING
        </span>
      </span>
    </a>
  )
}

export function Navbar() {
  const { navLinks } = useSiteContent()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 40))

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [navLinks])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
        className="mx-auto bg-ruxin transition-all duration-500"
      >
        <nav
          aria-label="Primary"
          className={cn(
            'mx-auto flex max-w-[1440px] items-center justify-between px-5 transition-all duration-500 md:px-10',
            scrolled ? 'h-16' : 'h-20 md:h-24',
          )}
        >
          <Logo light mark="white" />
          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1)
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={cn(
                      'relative px-3.5 py-2 text-[13px] tracking-wide transition-colors',
                      isActive ? 'text-white' : 'text-white/75 hover:text-white',
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-white"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>
          <div className="flex items-center gap-3">
            <Magnetic strength={0.25} className="hidden sm:inline-block">
              <a
                href="#contact"
                className="group inline-flex h-10 items-center gap-2 rounded-full bg-cream pl-5 pr-4 text-[13px] font-medium text-ink transition-colors hover:bg-white"
              >
                {"Let's Talk"}
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            </Magnetic>
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full border border-white/30 text-white lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-0 -z-10 flex flex-col justify-between bg-ruxin px-6 pb-10 pt-28 text-white lg:hidden"
          >
            <ul className="flex flex-col">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, ease: EASE, duration: 0.5 }}
                  className="border-b border-white/15"
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between py-4 text-3xl font-medium tracking-tight text-white"
                  >
                    {link.label}
                    <span className="font-mono text-xs text-white/55">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="flex h-14 items-center justify-center gap-2 rounded-full bg-cream text-base font-medium text-ink"
            >
              {"Let's Talk"} <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
