'use client'

import { useState, useEffect, type RefObject } from 'react'

export function useScrollReveal(ref: RefObject<HTMLElement | null>, threshold = 0.15) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.unobserve(element)
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, threshold])

  return revealed
}
