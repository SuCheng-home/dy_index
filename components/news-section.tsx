"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { NEWS_DATA } from "@/lib/news-data"

const categories = ["全部", "校园新闻", "教学动态", "德育之窗", "科研成果", "媒体报道"]

const newsItems = NEWS_DATA.map((item) => {
  const [year, month, day] = item.date.split("-")
  return {
    ...item,
    day,
    yearMonth: `${year}.${month}`,
  }
})

const announcements = NEWS_DATA.slice(6, 15).map((item) => {
  const [year, month, day] = item.date.split("-")
  return {
    id: item.id,
    title: item.title,
    day,
    yearMonth: `${year}.${month}`,
  }
})

export function NewsSection() {
  const [activeCategory, setActiveCategory] = useState("全部")
  const { ref: sectionRef, isRevealed } = useScrollReveal()
  const [currentSlide, setCurrentSlide] = useState(0)

  const filteredNews =
    activeCategory === "全部"
      ? newsItems
      : newsItems.filter((item) => item.category === activeCategory)

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-[#F5F0E8] to-[#FDFBF7] py-20"
    >
      {/* 建筑剪影背景 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "url(/silhouette.jpg)",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
          backgroundSize: "80% auto",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4">
        {/* 标题 */}
        <div
          className="mb-12 text-center transition-all duration-1000"
          style={{
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <h2 className="mb-4 font-serif text-3xl font-bold text-[#2A0A0A] md:text-4xl">
            新闻公告
          </h2>
          <div className="mx-auto h-1 w-20 bg-gradient-to-r from-[#D4AF37] to-[#8B1A1A]" />
        </div>

        {/* 分类筛选 */}
        <div
          className="mb-8 flex flex-wrap gap-2 transition-all duration-1000"
          style={{
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? "translateY(0)" : "translateY(30px)",
            transitionDelay: "0.1s",
          }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-[#8B1A1A] text-[#F5E6D3] shadow-md"
                  : "bg-[#FDFBF7] text-[#666] hover:bg-[#8B1A1A]/10 hover:text-[#8B1A1A]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 校园新闻区域 */}
        <div
          className="mb-12 transition-all duration-1000"
          style={{
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? "translateY(0)" : "translateY(40px)",
            transitionDelay: "0.15s",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#2A0A0A]">校园新闻</h3>
            <Link
              href="/news"
              className="flex items-center gap-1 text-sm text-[#8B1A1A] hover:text-[#D4AF37] transition-colors"
            >
              查看更多
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex gap-6">
            {/* 左侧轮播图 */}
            <div className="w-[55%] flex-shrink-0">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={filteredNews[currentSlide]?.image || "/view/view6.jpg"}
                  alt={filteredNews[currentSlide]?.title || "校园新闻"}
                  fill
                  className="object-cover"
                />
                {/* 底部标题栏 */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1a365d]/95 to-[#1a365d]/70 px-6 py-4">
                  <h4 className="text-white font-medium mb-2">
                    {filteredNews[currentSlide]?.title || "校园新闻"}
                  </h4>
                  {/* 轮播指示器 */}
                  <div className="flex justify-end gap-2">
                    {filteredNews.slice(0, 5).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentSlide === index ? "bg-white w-4" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧新闻列表 */}
            <div className="flex-1">
              <div className="space-y-0 divide-y divide-[#E8DCC8]">
                {filteredNews.slice(0, 5).map((news, index) => (
                  <Link
                    key={news.id}
                    href={`/news/${news.id}`}
                    className="group flex items-start gap-4 py-4 hover:bg-[#8B1A1A]/5 px-2 -mx-2 transition-colors"
                    style={{
                      opacity: isRevealed ? 1 : 0,
                      transform: isRevealed ? "translateX(0)" : "translateX(20px)",
                      transitionDelay: `${0.2 + index * 0.08}s`,
                      transitionDuration: "0.7s",
                    }}
                  >
                    {/* 日期 */}
                    <div className="flex-shrink-0 text-center w-16 border-r border-[#E8DCC8] pr-4">
                      <span className="block text-2xl font-bold text-[#1a365d]">{news.day}</span>
                      <span className="block text-xs text-[#999]">{news.yearMonth}</span>
                    </div>
                    {/* 标题 */}
                    <div className="flex-1 pt-1">
                      <h4 className="text-sm text-[#333] group-hover:text-[#8B1A1A] transition-colors line-clamp-2">
                        {news.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 校务公告区域 */}
        <div
          className="transition-all duration-1000"
          style={{
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? "translateY(0)" : "translateY(40px)",
            transitionDelay: "0.4s",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#2A0A0A]">校务公告</h3>
            <Link
              href="/news"
              className="flex items-center gap-1 text-sm text-[#8B1A1A] hover:text-[#D4AF37] transition-colors"
            >
              查看更多
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {announcements.map((item, index) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="group flex items-center gap-4 p-4 rounded-lg bg-[#FDFBF7] hover:bg-[#8B1A1A]/5 transition-all border border-[#E8DCC8]"
                style={{
                  opacity: isRevealed ? 1 : 0,
                  transform: isRevealed ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: `${0.5 + index * 0.1}s`,
                  transitionDuration: "0.7s",
                }}
              >
                {/* 日期 */}
                <div className="flex-shrink-0 text-center border-r border-[#E8DCC8] pr-4">
                  <span className="block text-2xl font-bold text-[#1a365d]">{item.day}</span>
                  <span className="block text-xs text-[#999]">{item.yearMonth}</span>
                </div>
                {/* 标题 */}
                <div className="flex-1">
                  <h4 className="text-sm text-[#333] group-hover:text-[#8B1A1A] transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
