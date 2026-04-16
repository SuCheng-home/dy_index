"use client"

import { useEffect, useState, useRef } from "react"

const stats = [
  { value: 83, suffix: "年", label: "办学历史", description: "薪火相传" },
  { value: 3200, suffix: "+", label: "在校学生", description: "莘莘学子" },
  { value: 280, suffix: "+", label: "教职员工", description: "名师荟萃" },
  { value: 98.5, suffix: "%", label: "本科率", description: "卓越成绩" },
  { value: 60, suffix: "+", label: "省市荣誉", description: "硕果累累" },
]

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

export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#8B1A1A] via-[#7A1515] to-[#8B1A1A] py-16">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="grid gap-8 md:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
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
