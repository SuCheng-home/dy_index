"use client"

import { useEffect, useState, useRef } from "react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { type RootSiteConfig } from "@/lib/root-site-config"

type StatsSectionConfig = RootSiteConfig["stats"]
function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 2000
          const steps = 60
          const increment = value / steps
          let current = 0

          const timer = setInterval(() => {
            current += increment
            if (current >= value) {
              setDisplayValue(value)
              clearInterval(timer)
            } else {
              setDisplayValue(Math.floor(current * 10) / 10)
            }
          }, duration / steps)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value])

  return (
    <div ref={ref} className="font-serif text-4xl font-bold text-[#D4AF37] md:text-5xl">
      {displayValue % 1 === 0 ? Math.floor(displayValue) : displayValue.toFixed(1)}
      <span className="text-2xl md:text-3xl">{suffix}</span>
    </div>
  )
}

export function StatsSection({ config }: { config: StatsSectionConfig }) {
  const stats = config.items
  const { ref, isRevealed } = useScrollReveal()

  if (stats.length === 0) {
    return null
  }
  
  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-r from-[#8B1A1A] via-[#7A1515] to-[#8B1A1A] py-16">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-5">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center transition-all duration-1000"
              style={{
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${index * 0.1}s`,
              }}
            >
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              <div className="mt-2 text-lg font-medium text-[#F5E6D3]">{stat.label}</div>
              <div className="text-sm text-[#F5E6D3]/60">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
