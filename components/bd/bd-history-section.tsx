'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useScrollReveal } from './use-scroll-reveal'

const historyItems = [
  {
    year: '2024',
    title: '张建国',
    role: '现任校长',
    image: '/bd/principal.jpg',
    description: [
      '2024年9月，丹阳高级中学新校区正式启用，开启学校发展新篇章。',
      '2024年高考再创辉煌，一本上线率突破85%，多名学子被清华、北大录取。',
      '学校荣获"全国文明校园"称号，办学质量获社会各界高度认可。',
    ],
  },
  {
    year: '2020',
    title: '李明远',
    role: '前任校长',
    image: '/bd/hero-2.jpg',
    description: [
      '2020年，学校积极应对疫情挑战，率先开展线上教学改革。',
      '推进"智慧校园"建设，引入AI辅助教学系统。',
      '成功承办江苏省中学生科技创新大赛，我校学子斩获多项金奖。',
    ],
  },
  {
    year: '1941',
    title: '创校元年',
    role: '建校历史',
    image: '/bd/campus-autumn.jpg',
    description: [
      '1941年，丹阳高级中学前身——私立正则中学在战火中诞生。',
      '秉承"厚德·明理·笃行"校训，为国家培养了无数栋梁之才。',
      '八十余年薪火相传，从私立正则到省丹中，始终不忘教育初心。',
    ],
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
          className="text-center text-3xl font-serif font-bold mb-16 transition-all duration-[1200ms]"
          style={{
            color: '#222',
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(40px)',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          丹中历史
        </h2>

        <div className="relative flex items-stretch gap-0 min-h-[560px]">
          {/* Giant year numbers - left side decorative */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[180px] flex items-center justify-center select-none pointer-events-none z-0 transition-all duration-[1400ms]"
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
            className="absolute right-0 top-0 bottom-0 w-[180px] flex items-center justify-center select-none pointer-events-none z-0 transition-all duration-[1400ms]"
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

          {/* Center content */}
          <div className="flex items-center gap-16 w-full max-w-[1000px] mx-auto relative z-10">
            {/* Left: Person image */}
            <div
              className="w-[400px] flex-shrink-0 transition-all duration-[1400ms]"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(60px)',
                transitionDelay: '0.3s',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div className="relative rounded-sm overflow-hidden shadow-2xl" style={{ aspectRatio: '3/4' }}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700"
                />
                {/* Red overlay at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1/3"
                  style={{
                    background: 'linear-gradient(to top, rgba(139,26,26,0.3), transparent)',
                  }}
                />
              </div>
            </div>

            {/* Right: Text content */}
            <div
              className="flex-1 transition-all duration-[1400ms]"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(60px)',
                transitionDelay: '0.5s',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <span
                className="text-5xl font-bold font-serif block mb-6"
                style={{ color: '#8B1A1A' }}
              >
                {item.year}
              </span>
              <div className="flex items-baseline gap-3 mb-8">
                <h3 className="text-2xl font-bold" style={{ color: '#222' }}>
                  {item.title}
                </h3>
                <span className="text-base" style={{ color: '#999' }}>
                  {item.role}
                </span>
              </div>
              <div className="space-y-4">
                {item.description.map((text, i) => (
                  <p key={i} className="text-[15px] leading-[1.8]" style={{ color: '#555' }}>
                    {text}
                  </p>
                ))}
              </div>
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
        </div>
      </div>
    </section>
  )
}
