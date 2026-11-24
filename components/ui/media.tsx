'use client'

import { useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { mediaUrl } from '@/lib/media'

type MediaProps = {
  /** Always set. Used alone, or as the poster frame when `video` is present. */
  image: string
  /** When set, plays instead of the image. */
  video?: string
  alt?: string
  className?: string
  /**
   * Stop playback without unmounting. Collapsed service cards pass true so
   * offscreen videos aren't decoded — several autoplaying videos on one page
   * is the fastest way to stall a phone.
   */
  paused?: boolean
}

/**
 * Renders a CMS media slot: video when one is set, image otherwise.
 *
 * Honours prefers-reduced-motion by not autoplaying; the viewer gets the
 * poster frame and native controls instead of motion they didn't ask for.
 */
export function Media({ image, video, alt = '', className, paused = false }: MediaProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || !video) return
    if (paused || reduce) {
      element.pause()
      return
    }
    // play() rejects when the browser blocks autoplay; the poster still shows.
    void element.play().catch(() => {})
  }, [paused, reduce, video])

  if (!video) {
    return <img src={mediaUrl(image)} alt={alt} className={className} />
  }

  return (
    <video
      ref={ref}
      src={mediaUrl(video)}
      poster={image ? mediaUrl(image) : undefined}
      className={className}
      autoPlay={!reduce && !paused}
      controls={Boolean(reduce)}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={alt || undefined}
    />
  )
}
