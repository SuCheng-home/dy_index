"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { NEWS_CATEGORIES, NEWS_DATA } from "@/lib/news-data"

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("全部")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredNews =
    activeCategory === "全部"
      ? NEWS_DATA
      : NEWS_DATA.filter((news) => news.category === activeCategory)

  return (
    <>
      <Header />
      <SubPageLayout
        title="新闻中心"
        subtitle="News Center"
        breadcrumbs={[{ label: "新闻中心" }]}
        bannerImage="/view/view1.jpg"
      >
        {/* 分类筛选 */}
        <div className="mb-8 flex flex-wrap gap-2 border-b border-[#E8DCC8] pb-6">
          {NEWS_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat)
                setCurrentPage(1)
              }}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all duration-300",
                activeCategory === cat
                  ? "bg-[#8B1A1A] text-white shadow-md"
                  : "bg-[#F8F4ED] text-[#666] hover:bg-[#8B1A1A]/10 hover:text-[#8B1A1A]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 新闻列表 */}
        <div className="grid gap-6">
          {filteredNews.map((news, index) => (
            <Link
              key={news.id}
              href={`/news/${news.id}`}
              className="animate-in fade-in slide-in-from-bottom-4 group flex flex-col gap-5 rounded-xl bg-[#FDFBF7] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:flex-row"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative h-48 w-full overflow-hidden rounded-lg sm:h-40 sm:w-60 flex-shrink-0">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {news.isTop && (
                  <div className="absolute left-3 top-3 rounded bg-[#8B1A1A] px-2 py-1 text-xs font-medium text-white">
                    置顶
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="rounded bg-[#D4AF37]/20 px-2 py-0.5 text-xs font-medium text-[#8B1A1A]">
                      {news.category}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-[#333] transition-colors group-hover:text-[#8B1A1A]">
                    {news.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-[#666]">{news.summary}</p>
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-[#999]">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {news.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {news.views}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 分页 */}
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E8DCC8] text-[#666] transition-colors hover:border-[#8B1A1A] hover:text-[#8B1A1A]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all",
                currentPage === page
                  ? "bg-[#8B1A1A] text-white shadow-md"
                  : "border border-[#E8DCC8] text-[#666] hover:border-[#8B1A1A] hover:text-[#8B1A1A]"
              )}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(5, currentPage + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E8DCC8] text-[#666] transition-colors hover:border-[#8B1A1A] hover:text-[#8B1A1A]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </SubPageLayout>
      <Footer />
    </>
  )
}
