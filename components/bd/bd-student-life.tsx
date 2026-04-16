'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { useScrollReveal } from './use-scroll-reveal'

const activities = [
  {
    title: '书院',
    english: 'ACADEMY',
    image: '/bd/student-academy.jpg',
    shape: 'circle',
    color: '#1A4B5C',
  },
  {
    title: '社团',
    english: 'ASSOCIATION',
    image: '/bd/student-club.jpg',
    shape: 'square',
    color: '#8B1A1A',
  },
  {
    title: '赛事',
    english: 'MATCH',
    image: '/bd/student-basketball.jpg',
    shape: 'triangle',
    color: '#C9A96E',
  },
]

function GeometricShape({ shape, color, hovered }: { shape: string; color: string; hovered: boolean }) {
  const baseStyle = {
    transition: 'all 0.6s cubic-bezier(0.2, 0.9, 0.4, 1)',
    transform: hovered ? 'scale(1.08) rotate(5deg)' : 'scale(1) rotate(0deg)',
  }

  if (shape === 'circle') {
    return (
      <div
        className="absolute top-4 left-4 w-[180px] h-[180px] rounded-full z-10"
        style={{ ...baseStyle, backgroundColor: color, opacity: 0.85 }}
      />
    )
  }
  if (shape === 'square') {
    return (
      <div
        className="absolute top-4 left-4 w-[160px] h-[160px] z-10"
        style={{ ...baseStyle, backgroundColor: color, opacity: 0.85 }}
      />
    )
  }
  // triangle
  return (
    <div
      className="absolute top-4 left-8 z-10"
      style={{ ...baseStyle }}
    >
      <svg width="180" height="180" viewBox="0 0 180 180">
        <polygon
          points="90,10 170,170 10,170"
          fill={color}
          opacity={0.85}
        />
      </svg>
    </div>
  )
}

export default function BdStudentLife() {
  const sectionRef = useRef<HTMLElement>(null)
  const revealed = useScrollReveal(sectionRef)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <section ref={sectionRef} id="student-life" className="py-24 relative overflow-hidden" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Decorative elements on sides - like PKU */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3">
        <svg width="120" height="160" viewBox="0 0 120 160">
          <polygon points="120,0 120,160 0,80" fill="#8B1A1A" opacity="0.12" />
        </svg>
      </div>
      <div className="absolute left-8 top-1/2 translate-y-8">
        <div className="w-10 h-10 rounded-full" style={{ backgroundColor: '#C9A96E', opacity: 0.3 }} />
        <div className="w-6 h-6 rounded-full mt-2 ml-4" style={{ backgroundColor: '#C9A96E', opacity: 0.2 }} />
      </div>
      <div className="absolute right-8 bottom-20">
        <div className="w-12 h-12 rounded-full" style={{ backgroundColor: '#C9A96E', opacity: 0.25 }} />
      </div>

      <div className="max-w-[1200px] mx-auto px-8">
        {/* Title */}
        <h2
          className="text-3xl font-serif font-bold text-center mb-16 transition-all duration-[1200ms]"
          style={{
            color: '#222',
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(40px)',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          学生生活
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-8">
          {activities.map((activity, index) => (
            <div
              key={activity.title}
              className="relative transition-all duration-[1400ms] cursor-pointer"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(60px)',
                transitionDelay: `${index * 0.2}s`,
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className="relative bg-white rounded-sm overflow-hidden transition-shadow duration-500"
                style={{
                  aspectRatio: '3/4',
                  boxShadow: hoveredCard === index
                    ? '0 20px 60px rgba(0,0,0,0.12)'
                    : '0 4px 20px rgba(0,0,0,0.06)',
                }}
              >
                {/* Geometric shape overlay */}
                <GeometricShape
                  shape={activity.shape}
                  color={activity.color}
                  hovered={hoveredCard === index}
                />

                {/* Vertical text */}
                <div className="absolute top-6 left-6 z-20">
                  <span
                    className="text-2xl font-bold block"
                    style={{
                      color: '#fff',
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed',
                      letterSpacing: '0.15em',
                    }}
                  >
                    {activity.title}
                  </span>
                  <span
                    className="text-[10px] tracking-[0.1em] block mt-2"
                    style={{
                      color: 'rgba(255,255,255,0.8)',
                      writingMode: 'vertical-rl',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {activity.english}
                  </span>
                </div>

                {/* Photo */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    className="object-cover transition-transform duration-700"
                    style={{
                      transform: hoveredCard === index ? 'scale(1.05)' : 'scale(1)',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
