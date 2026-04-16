'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useScrollReveal } from './use-scroll-reveal'

const departments = [
  { name: '正则书院', english: 'ZHENGZE', color: '#8B1A1A', type: 'circle' },
  { name: '笃行书院', english: 'DUXING', color: '#C9A96E', type: 'circle' },
  { name: '明理书院', english: 'MINGLI', color: '#8B1A1A', type: 'square' },
  { name: '厚德书院', english: 'HOUDE', color: '#C9A96E', type: 'square' },
]

export default function BdAnniversarySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const revealed = useScrollReveal(sectionRef)

  return (
    <section 
      ref={sectionRef} 
      className="relative py-0 overflow-hidden"
      style={{ backgroundColor: '#8B1A1A' }}
    >
      {/* Full width anniversary banner */}
      <div className="relative w-full h-[400px]">
        <Image
          src="/banner-80th.png"
          alt="江苏省丹阳高级中学80周年校庆"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(139,26,26,0.3) 0%, transparent 50%, rgba(139,26,26,0.3) 100%)'
          }}
        />
      </div>

      {/* Content section with geometric design */}
      <div className="relative py-24" style={{ backgroundColor: '#8B1A1A' }}>
        {/* Decorative geometric shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Left side triangles */}
          <div 
            className="absolute left-0 top-1/4 transition-all duration-[2000ms]"
            style={{
              opacity: revealed ? 0.15 : 0,
              transform: revealed ? 'translateX(0)' : 'translateX(-100px)',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <svg width="200" height="300" viewBox="0 0 200 300">
              <polygon points="0,0 200,150 0,300" fill="#fff" />
            </svg>
          </div>
          
          {/* Floating circles */}
          <div 
            className="absolute right-[15%] top-[10%] w-32 h-32 rounded-full transition-all duration-[2500ms]"
            style={{ 
              backgroundColor: '#C9A96E',
              opacity: revealed ? 0.3 : 0,
              transform: revealed ? 'scale(1)' : 'scale(0)',
              transitionDelay: '0.3s',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
          <div 
            className="absolute right-[25%] bottom-[20%] w-20 h-20 rounded-full transition-all duration-[2500ms]"
            style={{ 
              backgroundColor: '#C9A96E',
              opacity: revealed ? 0.25 : 0,
              transform: revealed ? 'scale(1)' : 'scale(0)',
              transitionDelay: '0.5s',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
          <div 
            className="absolute right-[8%] top-[40%] w-16 h-16 rounded-full transition-all duration-[2500ms]"
            style={{ 
              backgroundColor: '#fff',
              opacity: revealed ? 0.1 : 0,
              transform: revealed ? 'scale(1)' : 'scale(0)',
              transitionDelay: '0.7s',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
          
          {/* Right side squares */}
          <div 
            className="absolute right-[5%] bottom-[10%] w-24 h-24 transition-all duration-[2000ms]"
            style={{ 
              backgroundColor: '#C9A96E',
              opacity: revealed ? 0.2 : 0,
              transform: revealed ? 'rotate(15deg)' : 'rotate(0deg) scale(0)',
              transitionDelay: '0.6s',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>

        <div className="max-w-[1400px] mx-auto px-8 relative z-10">
          <div className="flex items-start gap-20">
            {/* Left: School philosophy text */}
            <div 
              className="flex-1 max-w-[600px] transition-all duration-[2000ms]"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateX(0)' : 'translateX(-60px)',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <h2 
                className="text-4xl font-serif font-bold leading-[1.8] mb-8"
                style={{ color: 'rgba(255,255,255,0.95)' }}
              >
                丹阳高中秉承"厚德、明理、笃行"<br/>
                的校训精神，大力培育勤奋、<br/>
                严谨、求实、创新的优良学风。
              </h2>
              <p 
                className="text-lg leading-[2] mb-10"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                致力于培养具有家国情怀、国际视野和面向未来的新时代领军人才。
                他们健康自信、尊重自然，善于学习、勇于创新，
                既能在生活中关爱他人，又能热忱服务社会和国家发展。
              </p>
              
              <Link 
                href="/bd/about"
                className="inline-flex items-center gap-4 group"
              >
                <span 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: '#C9A96E' }}
                />
                <span 
                  className="w-16 h-px transition-all duration-500 group-hover:w-24"
                  style={{ backgroundColor: 'rgba(255,255,255,0.4)' }}
                />
                <span 
                  className="text-sm tracking-wider transition-colors duration-300 group-hover:text-[#C9A96E]"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  更多
                </span>
              </Link>
            </div>

            {/* Right: Department circles and images */}
            <div 
              className="flex-1 relative"
              style={{ minHeight: '500px' }}
            >
              {/* Campus photo circles */}
              <div 
                className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full overflow-hidden transition-all duration-[2000ms]"
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? 'scale(1)' : 'scale(0.5)',
                  transitionDelay: '0.3s',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <Image
                  src="/view/view3.jpg"
                  alt="校园秋景"
                  fill
                  className="object-cover"
                />
              </div>
              
              <div 
                className="absolute top-[180px] right-[180px] w-[240px] h-[240px] rounded-full overflow-hidden transition-all duration-[2000ms]"
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? 'scale(1)' : 'scale(0.5)',
                  transitionDelay: '0.5s',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <Image
                  src="/view/view5.jpg"
                  alt="校园风光"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Department labels */}
              {departments.map((dept, index) => (
                <div
                  key={dept.name}
                  className="absolute transition-all duration-[2000ms] cursor-pointer group"
                  style={{
                    top: index === 0 ? '60px' : index === 1 ? '200px' : index === 2 ? '340px' : '420px',
                    right: index === 0 ? '220px' : index === 1 ? '0' : index === 2 ? '250px' : '80px',
                    opacity: revealed ? 1 : 0,
                    transform: revealed ? 'translateY(0)' : 'translateY(30px)',
                    transitionDelay: `${0.4 + index * 0.15}s`,
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div 
                    className={`w-[100px] h-[100px] flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${dept.type === 'circle' ? 'rounded-full' : ''}`}
                    style={{ backgroundColor: dept.color }}
                  >
                    <span className="text-white text-sm font-bold">{dept.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
