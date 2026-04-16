'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useScrollReveal } from './use-scroll-reveal'

const teachers = [
  {
    name: '王志远',
    role: '语文学科长',
    subject: 'CHINESE',
    letter: 'C',
    image: '/bd/teacher-1.jpg',
    dots: 5,
  },
  {
    name: '陈丽华',
    role: '数学学科长',
    subject: 'MATH',
    letter: 'M',
    image: '/bd/teacher-2.jpg',
    dots: 6,
  },
  {
    name: '刘建国',
    role: '物理学科长',
    subject: 'PHYSICS',
    letter: 'P',
    image: '/bd/teacher-3.jpg',
    dots: 5,
  },
]

export default function BdTeacherSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const revealed = useScrollReveal(sectionRef)

  return (
    <section ref={sectionRef} id="teachers" className="py-24 overflow-hidden" style={{ backgroundColor: '#fafafa' }}>
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Section header */}
        <div
          className="flex items-center justify-between mb-16 transition-all duration-700"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          <h2 className="text-3xl font-serif font-bold" style={{ color: '#222' }}>
            教师风采
          </h2>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#8B1A1A' }} />
            <span className="w-20 h-px" style={{ backgroundColor: '#ddd' }} />
            <span className="text-sm" style={{ color: '#999' }}>更多</span>
          </div>
        </div>

        {/* Teacher cards */}
        <div className="flex items-center gap-8">
          {/* Left arrow */}
          <button
            className="w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300"
            style={{ borderColor: 'rgba(139,26,26,0.3)', color: '#8B1A1A' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#8B1A1A'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#8B1A1A'
            }}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Teachers */}
          <div className="flex-1 grid grid-cols-3 gap-12">
            {teachers.map((teacher, index) => (
              <div
                key={teacher.name}
                className="flex flex-col items-center transition-all duration-700"
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? 'translateY(0)' : 'translateY(30px)',
                  transitionDelay: `${index * 0.12}s`,
                  transitionTimingFunction: 'cubic-bezier(0.2, 0.9, 0.4, 1)',
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Image with letter background */}
                <div className="relative w-full flex items-center justify-center mb-8" style={{ height: '320px' }}>
                  {/* Giant letter behind */}
                  <span
                    className="absolute inset-0 flex items-center justify-center select-none pointer-events-none transition-transform duration-500"
                    style={{
                      fontSize: '280px',
                      fontWeight: 900,
                      color: '#8B1A1A',
                      opacity: 0.1,
                      fontFamily: 'Georgia, serif',
                      lineHeight: 1,
                      transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    {teacher.letter}
                  </span>
                  {/* Teacher photo */}
                  <div
                    className="relative w-[220px] h-[280px] rounded-sm overflow-hidden z-10 transition-all duration-500"
                    style={{
                      transform: hoveredIndex === index ? 'translateY(-6px)' : 'translateY(0)',
                      boxShadow: hoveredIndex === index
                        ? '0 20px 60px rgba(139,26,26,0.15), 0 0 0 3px rgba(201,169,110,0.2)'
                        : '0 8px 30px rgba(0,0,0,0.08)',
                    }}
                  >
                    <Image
                      src={teacher.image}
                      alt={teacher.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <h3 className="text-lg font-bold mb-1" style={{ color: '#222' }}>
                      {teacher.name}
                    </h3>
                    <p
                      className="text-sm mb-2 transition-all duration-400"
                      style={{
                        color: hoveredIndex === index ? '#8B1A1A' : '#999',
                        opacity: hoveredIndex === index ? 1 : 0.8,
                      }}
                    >
                      {teacher.role}
                    </p>
                    {/* Subject dots */}
                    <div className="flex items-center justify-center gap-1">
                      {Array.from({ length: teacher.dots }).map((_, i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-sm"
                          style={{ backgroundColor: '#8B1A1A' }}
                        />
                      ))}
                    </div>
                    <span
                      className="text-[11px] tracking-[0.3em] mt-1 block"
                      style={{ color: '#bbb' }}
                    >
                      {teacher.subject}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            className="w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300"
            style={{ borderColor: 'rgba(139,26,26,0.3)', color: '#8B1A1A' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#8B1A1A'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#8B1A1A'
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
