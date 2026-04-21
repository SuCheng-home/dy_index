"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setIsTransitioning(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [pathname, children])

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isTransitioning ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      {displayChildren}
    </div>
  )
}
