"use client"

import { type RefObject, useEffect, useState } from "react"

export function useAnimationActivity<T extends HTMLElement>(ref: RefObject<T | null>) {
  const [isInViewport, setIsInViewport] = useState(false)
  const [isDocumentVisible, setIsDocumentVisible] = useState(true)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (!("IntersectionObserver" in window)) {
      setIsInViewport(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInViewport(entry.isIntersecting),
      { rootMargin: "160px 0px", threshold: 0 }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  useEffect(() => {
    const updateVisibility = () => setIsDocumentVisible(!document.hidden)
    updateVisibility()
    document.addEventListener("visibilitychange", updateVisibility)
    return () => document.removeEventListener("visibilitychange", updateVisibility)
  }, [])

  return isInViewport && isDocumentVisible
}
