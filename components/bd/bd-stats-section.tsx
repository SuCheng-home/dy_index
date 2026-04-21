'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useScrollReveal } from './use-scroll-reveal'

const stats = [
  { value: 1941, label: '建校年份', suffix: '', prefix: '' },
  { value: 85, label: '历届校长', suffix: '年', prefix: '' },
  { value: 3, label: '院士校友', suffix: '位', prefix: '' },
  { value: 100, label: '省级以上荣誉', suffix: '+', prefix: '' },
  { value: 98, label: '高考一本率', suffix: '%', prefix: '' },
]

function useCountUp(target: number, isActive: boolean, duration = 2800) {
  const [count, setCount] = useState(0)

  const animate = useCallback(() => {
    if (!isActive) return
    const startTime = performance.now()
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [isActive, target, duration])

  useEffect(() => {
    animate()
  }, [animate])

  return count
}

function StatItem({ value, label, suffix, isActive, delay }: {
  value: number
  label: string
  suffix: string
  isActive: boolean
  delay: number
}) {
  const count = useCountUp(value, isActive)

  return (
    <div
      className="text-center transition-all duration-[2000ms]"
      style={{
        opacity: isActive ? 1 : 0,
        transform: isActive ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
        transitionDelay: `${delay}s`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div className="flex items-baseline justify-center gap-1">
        <span
          className="text-5xl font-bold font-mono tabular-nums"
          style={{ color: '#8B1A1A' }}
        >
          {count}
        </span>
        {suffix && (
          <span className="text-lg font-medium" style={{ color: '#8B1A1A' }}>
            {suffix}
          </span>
        )}
      </div>
      <p className="mt-3 text-sm tracking-widest" style={{ color: '#999' }}>
        {label}
      </p>
    </div>
  )
}

export default function BdStatsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const revealed = useScrollReveal(sectionRef, 0.3)

  return (
    <section ref={sectionRef} className="py-20" style={{ backgroundColor: '#fff' }}>
      <div className="max-w-[1100px] mx-auto px-8">
        <div className="flex items-center justify-between">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              isActive={revealed}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
