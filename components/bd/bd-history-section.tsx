'use client'

import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { useScrollReveal } from './use-scroll-reveal'

const historyItems = [
  {
    year: '2024',
    title: '张明远',
    role: '校长 · 特级教师',
    subtitle: '校长致辞',
    description: [
      '欢迎来到江苏省丹阳高级中学！作为一所承载着八十余年历史底蕴的百年名校，我们始终秉承「大成教育」理念，以立德树人为根本，以培养全面发展的时代英才为使命。',
      '教育是点燃火焰，而非填满容器。我们相信每一位学生都有无限的潜能，在这里，你将遇到优秀的老师、志同道合的伙伴，收获知识、友谊和成长。',
      '愿每一位丹中学子，都能在这里找到属于自己的舞台，书写精彩的青春篇章！',
    ],
    slogan: '大成教育 · 成就未来',
  },
  {
    year: '20xx',
    title: 'xxx',
    role: '前任校长',
    subtitle: '任期回顾',
    description: [
      '在任期间，积极推进教育教学改革，提升办学质量。',
      '加强师资队伍建设，引进优秀教育人才。',
      '推动校园文化建设，营造良好育人环境。',
    ],
    slogan: '立德树人 · 追求卓越',
  },
  {
    year: '1941',
    title: '创校元年',
    role: '建校历史',
    subtitle: '薪火相传',
    description: [
      '1941年，丹阳高级中学前身——私立正则中学在战火中诞生。',
      '秉承"厚德·明理·笃行"校训，为国家培养了无数栋梁之才。',
      '八十余年薪火相传，从私立正则到省丹中，始终不忘教育初心。',
    ],
    slogan: '厚德明理 · 笃行致远',
  },
]

export default function BdHistorySection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const revealed = useScrollReveal(sectionRef)
  const item = historyItems[currentIndex]

  const prev = () => setCurrentIndex((i) => (i - 1 + historyItems.length) % historyItems.length)
  const next = () => setCurrentIndex((i) => (i + 1) % historyItems.length)

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden" style={{ backgroundColor: '#fafafa' }}>
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Section title */}
        <h2
          className="text-center text-3xl font-serif font-bold mb-16 transition-all duration-[2000ms]"
          style={{
            color: '#222',
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(40px)',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          丹中历史
        </h2>

        <div className="relative flex items-stretch gap-0 min-h-[520px]">
          {/* Giant year numbers - left side decorative */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[180px] flex items-center justify-center select-none pointer-events-none z-0 transition-all duration-[2000ms]"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateX(0)' : 'translateX(-80px)',
              transitionDelay: '0.3s',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span
              className="text-[220px] font-black leading-none"
              style={{
                color: '#8B1A1A',
                opacity: 0.12,
                fontFamily: 'Georgia, serif',
                writingMode: 'vertical-lr',
                letterSpacing: '-0.05em',
              }}
            >
              {item.year}
            </span>
          </div>

          {/* Giant year numbers - right side decorative */}
          <div
            className="absolute right-0 top-0 bottom-0 w-[180px] flex items-center justify-center select-none pointer-events-none z-0 transition-all duration-[2000ms]"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateX(0)' : 'translateX(80px)',
              transitionDelay: '0.4s',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span
              className="text-[220px] font-black leading-none"
              style={{
                color: '#8B1A1A',
                opacity: 0.08,
                fontFamily: 'Georgia, serif',
                writingMode: 'vertical-lr',
                letterSpacing: '-0.05em',
              }}
            >
              {item.year}
            </span>
          </div>

          {/* Center content - text only, no image */}
          <div className="flex flex-col items-center justify-center w-full max-w-[800px] mx-auto relative z-10">
            {/* Header with name and role */}
            <div
              className="text-center mb-8 transition-all duration-[2000ms]"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: '0.3s',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <h3 className="text-3xl font-bold font-serif mb-2" style={{ color: '#222' }}>
                {item.title}
              </h3>
              <span className="text-base" style={{ color: '#8B1A1A' }}>
                {item.role}
              </span>
            </div>

            {/* Subtitle */}
            <div
              className="flex items-center gap-4 mb-8 transition-all duration-[2000ms]"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: '0.4s',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <span className="w-12 h-px" style={{ backgroundColor: '#8B1A1A' }} />
              <span className="text-lg font-medium" style={{ color: '#8B1A1A' }}>{item.subtitle}</span>
              <span className="w-12 h-px" style={{ backgroundColor: '#8B1A1A' }} />
            </div>

            {/* Quote icon */}
            <div
              className="mb-6 transition-all duration-[2000ms]"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'scale(1)' : 'scale(0.8)',
                transitionDelay: '0.5s',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <Quote size={32} style={{ color: '#8B1A1A', opacity: 0.3 }} />
            </div>

            {/* Description text */}
            <div
              className="text-center space-y-4 transition-all duration-[2000ms]"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: '0.6s',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {item.description.map((text, i) => (
                <p key={i} className="text-[16px] leading-[2]" style={{ color: '#555' }}>
                  {text}
                </p>
              ))}
            </div>

            {/* Slogan */}
            <div
              className="mt-10 transition-all duration-[2000ms]"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: '0.7s',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <span
                className="text-xl font-serif font-bold tracking-wider"
                style={{ color: '#8B1A1A' }}
              >
                {item.slogan}
              </span>
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-[200px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300"
            style={{ borderColor: 'rgba(139,26,26,0.3)', color: '#8B1A1A' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#8B1A1A'
              e.currentTarget.style.color = '#fff'
              e.currentTarget.style.borderColor = '#8B1A1A'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#8B1A1A'
              e.currentTarget.style.borderColor = 'rgba(139,26,26,0.3)'
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-[200px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300"
            style={{ borderColor: 'rgba(139,26,26,0.3)', color: '#8B1A1A' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#8B1A1A'
              e.currentTarget.style.color = '#fff'
              e.currentTarget.style.borderColor = '#8B1A1A'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#8B1A1A'
              e.currentTarget.style.borderColor = 'rgba(139,26,26,0.3)'
            }}
          >
            <ChevronRight size={20} />
          </button>

          {/* Page indicators */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
            {historyItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: i === currentIndex ? '#8B1A1A' : 'rgba(139,26,26,0.2)',
                  transform: i === currentIndex ? 'scale(1.2)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
