"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { type RootSiteConfig } from "@/lib/root-site-config"
import { toMessageHref } from "@/lib/school-web-two"

type NewsSectionConfig = RootSiteConfig["news"]

export function NewsSection({ config }: { config: NewsSectionConfig }) {
  const categories = config.categories.length > 0 ? config.categories : ["全部"]
  const newsItems = config.items.map((item) => {
    const [year, month, day] = (item.date || "").split("-")
    return {
      ...item,
      day: day || "",
      yearMonth: year && month ? `${year}.${month}` : "",
    }
  })
  const announcements = [...config.items]
    .filter((item) => item.category === config.announcementTitle)
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
    .slice(0, 9)
    .map((item) => {
      const [year, month, day] = (item.date || "").split("-")
      return {
        id: item.id,
        title: item.title,
        day: day || "",
        yearMonth: year && month ? `${year}.${month}` : "",
      }
    })
  const [activeCategory, setActiveCategory] = useState("全部")
  const { ref: sectionRef, isRevealed } = useScrollReveal()
  const [currentSlide, setCurrentSlide] = useState(0)

  const filteredNews =
    activeCategory === "全部"
      ? newsItems.filter((item) => item.category === config.newsTitle)
      : newsItems.filter((item) => item.category === activeCategory)
  const featuredNews = filteredNews[currentSlide] ?? filteredNews[0]
  const currentNewsTitle = activeCategory === "全部" ? config.newsTitle : activeCategory

  if (config.items.length === 0) {
    return null
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-[#F5F0E8] to-[#FDFBF7] py-12 sm:py-16 lg:py-20"
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
          className="mb-8 text-center transition-all duration-1000 sm:mb-10 lg:mb-12"
          style={{
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <h2 className="mb-4 font-serif text-3xl font-bold text-[#2A0A0A] md:text-4xl">
            {config.title}
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
              onClick={() => {
                setActiveCategory(category)
                setCurrentSlide(0)
              }}
              className={`min-h-11 rounded-full px-4 py-2 text-sm font-medium transition-all ${
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
            <h3 className="text-xl font-bold text-[#2A0A0A]">{currentNewsTitle}</h3>
            <Link
              href={config.moreHref}
              className="flex items-center gap-1 text-sm text-[#8B1A1A] hover:text-[#D4AF37] transition-colors"
            >
              查看更多
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex min-w-0 flex-col gap-6 lg:flex-row">
            {/* 左侧轮播图 */}
            <div className="w-full flex-shrink-0 lg:w-[55%]">
              <div className="overflow-hidden rounded-lg bg-white shadow-lg">
                <Link
                  href={featuredNews ? toMessageHref(featuredNews.id) : config.moreHref}
                  className="group relative block aspect-[4/3] overflow-hidden bg-white"
                >
                  {featuredNews?.image ? (
                    <Image
                      src={featuredNews.image}
                      alt={featuredNews.title}
                      fill
                      className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#E8DCC8] px-8 text-center text-lg font-semibold text-[#8B1A1A]">
                      {featuredNews?.title}
                    </div>
                  )}
                </Link>
                <div className="bg-[#1a365d] px-6 py-4">
                  <Link
                    href={featuredNews ? toMessageHref(featuredNews.id) : config.moreHref}
                    className="mb-2 block font-medium text-white line-clamp-2 transition-colors hover:text-[#D4AF37]"
                  >
                    {featuredNews?.title}
                  </Link>
                  <div className="flex justify-end gap-2">
                    {filteredNews.slice(0, 5).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-8 min-w-8 rounded-full transition-all before:mx-auto before:block before:h-2 before:rounded-full ${
                          currentSlide === index ? "before:w-4 before:bg-white" : "before:w-2 before:bg-white/50"
                        }`}
                        aria-label={`显示第 ${index + 1} 条新闻`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧新闻列表 */}
            <div className="min-w-0 flex-1">
              <div className="space-y-0 divide-y divide-[#E8DCC8]">
                {filteredNews.slice(0, 5).map((news, index) => (
                  <Link
                    key={news.id}
                    href={toMessageHref(news.id)}
                    className="group -mx-2 flex min-w-0 items-start gap-3 px-2 py-4 transition-colors hover:bg-[#8B1A1A]/5 sm:gap-4"
                    style={{
                      opacity: isRevealed ? 1 : 0,
                      transform: isRevealed ? "translateX(0)" : "translateX(20px)",
                      transitionDelay: `${0.2 + index * 0.08}s`,
                      transitionDuration: "0.7s",
                    }}
                  >
                    {/* 日期 */}
                    <div className="w-14 flex-shrink-0 border-r border-[#E8DCC8] pr-3 text-center sm:w-16 sm:pr-4">
                      <span className="block text-2xl font-bold text-[#1a365d]">{news.day}</span>
                      <span className="block text-xs text-[#999]">{news.yearMonth}</span>
                    </div>
                    {/* 标题 */}
                    <div className="min-w-0 flex-1 pt-1">
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

        {announcements.length > 0 ? (
          <div
            className="transition-all duration-1000"
            style={{
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? "translateY(0)" : "translateY(40px)",
              transitionDelay: "0.4s",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#2A0A0A]">{config.announcementTitle}</h3>
              {config.announcementHref ? (
                <Link
                  href={config.announcementHref}
                  className="flex items-center gap-1 text-sm text-[#8B1A1A] hover:text-[#D4AF37] transition-colors"
                >
                  查看更多
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {announcements.map((item, index) => (
                <Link
                  key={item.id}
                  href={toMessageHref(item.id)}
                  className="group flex min-w-0 items-center gap-3 rounded-lg border border-[#E8DCC8] bg-[#FDFBF7] p-4 transition-all hover:bg-[#8B1A1A]/5 sm:gap-4"
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
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm text-[#333] group-hover:text-[#8B1A1A] transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
