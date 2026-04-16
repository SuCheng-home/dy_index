"use client"

import { useEffect, useRef, useState } from "react"

interface UseScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const { threshold = 0.1, rootMargin = "0px 0px -50px 0px", once = true } = options
  const ref = useRef<HTMLDivElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
          if (once) {
            observer.unobserve(element)
          }
        } else if (!once) {
          setIsRevealed(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, isRevealed }
}

// CSS styles for reveal animation
export const revealStyles = {
  hidden: {
    opacity: 0,
    transform: "translateY(40px)",
  },
  visible: {
    opacity: 1,
    transform: "translateY(0)",
  },
}

// Staggered delay calculator
export function getStaggerDelay(index: number, baseDelay = 0.1) {
  return `${index * baseDelay}s`
}
