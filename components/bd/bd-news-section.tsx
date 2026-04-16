'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useScrollReveal } from './use-scroll-reveal'

const featuredNews = [
  {
    id: 1,
    image: '/bd/news-1.jpg',
    title: '国际信息学奥林匹克竞赛（IOI）主席一行到访丹阳高中指导...',
    date: '2026-03-18',
    summary: '3月18日，国际信息学奥林匹克竞赛组委会主席一行莅临我校参观指导，对我校信息学竞赛教学给予高度评价。',
  },
  {
    id: 2,
    image: '/bd/news-2.jpg',
    title: '数学之趣，在探索中遇见希望——丹阳高中第三届数学文化节...',
    date: '2026-03-16',
    summary: '为激发学生数学学习兴趣，我校举办第三届数学文化节，活动包含数学建模、趣味竞赛等多项内容。',
  },
  {
    id: 3,
    image: '/bd/hero-2.jpg',
    title: '提升管理质效 聚势向新而行 | 丹阳高中教育集团召开2026...',
    date: '2026-03-05',
    summary: '春归万物生，策马启新程。为深入贯彻全国教育大会精神，总结2025年办学成果，部署新学期工作。',
  },
  {
    id: 4,
    image: '/bd/campus-autumn.jpg',
    title: '集众智 凝共识 创未来——江苏省丹阳高级中学第九届教职工代表大...',
    date: '2026-03-05',
    summary: '2026年2月27日，江苏省丹阳高级中学第九届教职工代表大会第三次会议在学校致慧礼堂举行。',
  },
]

const notices = [
  { id: 1, title: '丹阳高中对外投诉电话公示', date: '2026-04-16' },
  { id: 2, title: '江苏省丹阳高级中学2025年校服双送检验收结果以及售后服务承诺公示', date: '2025-12-25' },
  { id: 3, title: '毕业生事务办理', date: '2026-03-21' },
  { id: 4, title: '高中部课程评价方式与标准', date: '2026-01-12' },
  { id: 5, title: '丹阳高中图书馆电子资源链接', date: '2025-09-01' },
]

export default function BdNewsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const revealed = useScrollReveal(sectionRef)

  return (
    <section ref={sectionRef} id="news" className="py-20" style={{ backgroundColor: '#fff' }}>
      <div className="max-w-[1400px] mx-auto px-8">
        {/* Featured news - 2x2 grid left + notice list right */}
        <div className="flex gap-8">
          {/* Left: news cards 2x2 */}
          <div className="flex-1 grid grid-cols-2 gap-6">
            {featuredNews.map((news, index) => (
              <Link
                key={news.id}
                href={`/bd/news/${news.id}`}
                className="group block transition-all duration-[1200ms]"
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? 'translateY(0)' : 'translateY(50px)',
                  transitionDelay: `${index * 0.15}s`,
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
            className="w-[340px] flex-shrink-0 transition-all duration-[1200ms]"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0)' : 'translateY(50px)',
              transitionDelay: '0.6s',
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
