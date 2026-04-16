'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    image: '/bd/hero-1.jpg',
    title: '丹阳高级中学教育集团2026年寒假战略研讨会',
  },
  {
    image: '/bd/hero-2.jpg',
    title: '深化课程改革 推动教育高质量发展',
  },
  {
    image: '/bd/campus-autumn.jpg',
    title: '千年学宫 人皆能大成',
  },
]

export default function BdHero() {
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setCurrent(index)
      setTimeout(() => setIsTransitioning(false), 1400)
    },
    [isTransitioning]
  )

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo])
  const prev = useCallback(
    () => goTo((current - 1 + slides.length) % slides.length),
    [current, goTo]
  )

  // 更长的间隔，更有高级感
  useEffect(() => {
    const timer = setInterval(next, 7000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <section className="relative w-full h-[calc(100vh-128px)] min-h-[500px] max-h-[800px] overflow-hidden mt-[128px]">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 transition-all duration-[1400ms]"
          style={{
            opacity: current === index ? 1 : 0,
            transform: `scale(${current === index ? 1 : 1.08})`,
            zIndex: current === index ? 1 : 0,
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Minimal navigation arrows like PKU */}
      <button
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300"
        style={{
          borderColor: 'rgba(255,255,255,0.6)',
          color: 'rgba(255,255,255,0.8)',
          backgroundColor: 'rgba(0,0,0,0.1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#fff'
          e.currentTarget.style.backgroundColor = 'rgba(139,26,26,0.7)'
          e.currentTarget.style.color = '#fff'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'
          e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)'
          e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
        }}
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300"
        style={{
          borderColor: 'rgba(255,255,255,0.6)',
          color: 'rgba(255,255,255,0.8)',
          backgroundColor: 'rgba(0,0,0,0.1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#fff'
          e.currentTarget.style.backgroundColor = 'rgba(139,26,26,0.7)'
          e.currentTarget.style.color = '#fff'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'
          e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)'
          e.currentTarget.style.color = 'rgba(255,255,255,0.8)'
        }}
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className="transition-all duration-700 rounded-full"
            style={{
              width: current === index ? '32px' : '10px',
              height: '10px',
              backgroundColor: current === index ? '#8B1A1A' : 'rgba(255,255,255,0.7)',
            }}
          />
        ))}
      </div>
    </section>
  )
}
