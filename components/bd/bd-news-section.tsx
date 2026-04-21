'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useScrollReveal } from './use-scroll-reveal'
import { getBdNewsByKind } from '@/lib/bd-news-data'

export default function BdNewsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const revealed = useScrollReveal(sectionRef)
  const featuredNews = getBdNewsByKind('news').slice(0, 4)
  const notices = getBdNewsByKind('notice').slice(0, 9)

  return (
    <section ref={sectionRef} id="news" className="py-20" style={{ backgroundColor: '#fff' }}>
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Section title */}
        <div
          className="flex items-center justify-between mb-12 transition-all duration-[2000ms]"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(40px)',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <h2 className="text-3xl font-serif font-bold" style={{ color: '#222' }}>
            新闻动态
          </h2>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#8B1A1A' }} />
            <span className="w-20 h-px" style={{ backgroundColor: '#ddd' }} />
            <Link href="/bd/news" className="text-sm hover:text-[#8B1A1A] transition-colors" style={{ color: '#999' }}>更多</Link>
          </div>
        </div>
        
        {/* Featured news - 2x2 grid left + notice list right */}
        <div className="flex gap-8">
          {/* Left: news cards 2x2 */}
          <div className="flex-1 grid grid-cols-2 gap-6">
            {featuredNews.map((news, index) => (
              <Link
                key={news.id}
                href={`/bd/news/${news.id}`}
                className="group block transition-all duration-[2000ms]"
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? 'translateY(0)' : 'translateY(50px)',
                  transitionDelay: `${0.1 + index * 0.15}s`,
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-sm mb-4" style={{ aspectRatio: '16/10' }}>
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                {/* Text */}
                <div className="flex items-start justify-between gap-4">
                  <h3
                    className="text-[15px] leading-relaxed font-medium line-clamp-2 transition-colors duration-300 group-hover:text-[#8B1A1A]"
                    style={{ color: '#222' }}
                  >
                    {/* Underline effect on hover */}
                    <span className="bg-[linear-gradient(#8B1A1A,#8B1A1A)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                      {news.title}
                    </span>
                  </h3>
                  <span className="text-sm whitespace-nowrap flex-shrink-0 mt-0.5" style={{ color: '#999' }}>
                    {news.date}
                  </span>
                </div>
                {/* Summary for larger cards */}
                {index >= 2 && news.summary && (
                  <p className="text-sm mt-2 line-clamp-2 leading-relaxed" style={{ color: '#888' }}>
                    {news.summary}
                  </p>
                )}
              </Link>
            ))}
          </div>

          {/* Right: Notice text list */}
          <div
            className="w-[340px] flex-shrink-0 transition-all duration-[2000ms]"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0)' : 'translateY(50px)',
              transitionDelay: '0.7s',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {notices.map((notice, index) => (
              <Link
                key={notice.id}
                href={`/bd/news/${notice.id}`}
                className="block py-5 border-b group transition-colors duration-300"
                style={{ borderColor: '#eee' }}
              >
                <h4
                  className="text-[15px] font-medium leading-relaxed line-clamp-2 mb-2 transition-colors duration-300 group-hover:text-[#8B1A1A]"
                  style={{ color: '#222' }}
                >
                  {notice.title}
                </h4>
                <span
                  className="text-sm transition-colors duration-300 group-hover:text-[#C9A96E]"
                  style={{ color: '#bbb' }}
                >
                  {notice.date}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
