import { cn } from '@/lib/utils'

/**
 * Official Ruxin Consulting lockup, traced from the brand guide.
 * Bright red on light surfaces, white on wine or bright red.
 */
export function LogoMark({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'block aspect-[2.262] h-11 shrink-0 bg-current md:h-14',
        light ? 'text-white' : 'text-ruxin-bright',
        className,
      )}
      style={{
        maskImage: 'url(/brand/logo.svg)',
        WebkitMaskImage: 'url(/brand/logo.svg)',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
      }}
    />
  )
}

export function Logo({
  className,
  light = false,
}: {
  className?: string
  light?: boolean
  mark?: 'red' | 'white'
}) {
  return (
    <a href="#top" className={cn('inline-flex shrink-0 items-center', className)} aria-label="Ruxin Consulting — home">
      <LogoMark light={light} />
    </a>
  )
}
