"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowRight, Bell, ChevronRight } from "lucide-react"

const categories = ["全部", "校园新闻", "教学动态", "德育活动", "媒体报道"]

const newsItems = [
  {
    id: 1,
    category: "校园新闻",
    title: "我校举行2024届高三毕业典礼暨成人礼仪式",
    date: "2026-04-05",
    image: "/view/view6.jpg",
    summary: "典礼上，师生共同回顾三年时光，展望美好未来。",
  },
  {
    id: 2,
    category: "教学动态",
    title: "清华大学招生组莅临我校开展招生宣讲活动",
    date: "2026-04-03",
    image: "/view/view8.jpg",
    summary: "清华大学江苏招生组专家详细介绍了招生政策和专业设置。",
  },
  {
    id: 3,
    category: "媒体报道",
    title: "《新华日报》专题报道我校大成教育创新实践成果",
    date: "2026-04-01",
    image: "/view/view7.jpg",
    summary: "我校在教育改革创新方面的做法获得广泛关注和肯定。",
  },
  {
    id: 4,
    category: "德育活动",
    title: "第十五届校园文化艺术节隆重开幕",
    date: "2026-03-28",
    image: "/view/view8.jpg",
    summary: "艺术节以「青春·梦想·未来」为主题，精彩纷呈。",
  },
]

const notices = [
  { id: 1, title: "关于2026年高一招生工作的通知", date: "2026-04-06", isNew: true },
  { id: 2, title: "江苏省丹阳高级中学教师招聘公告", date: "2026-04-04", isNew: true },
  { id: 3, title: "关于开展阳光体育活动的通知", date: "2026-03-30", isNew: false },
  { id: 4, title: "2026年春季学期校历安排", date: "2026-03-28", isNew: false },
  { id: 5, title: "关于举办家长开放日活动的通知", date: "2026-03-25", isNew: false },
  { id: 6, title: "校园安全教育周活动安排", date: "2026-03-22", isNew: false },
  { id: 7, title: "第三届读书节即将启动", date: "2026-03-20", isNew: false },
]

export function NewsSection() {
  const [activeCategory, setActiveCategory] = useState("全部")

  const filteredNews =
    activeCategory === "全部"
      ? newsItems
      : newsItems.filter((item) => item.category === activeCategory)

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F0E8] to-[#FDFBF7] py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* 标题 */}
        <div className="mb-12 text-center">
          <span className="mb-2 inline-block font-serif text-sm tracking-widest text-[#D4AF37]">
            NEWS & NOTICE
          </span>
          <h2 className="mb-4 font-serif text-3xl font-bold text-[#2A0A0A] md:text-4xl">
            新闻公告
          </h2>
          <div className="mx-auto h-1 w-20 bg-gradient-to-r from-[#D4AF37] to-[#8B1A1A]" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* 左侧新闻区域 */}
          <div className="lg:col-span-2">
            {/* 分类筛选 */}
            <div className="mb-6 flex flex-wrap gap-2">
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

            {/* 新闻卡片网格 */}
            <div className="grid gap-6 sm:grid-cols-2">
              {filteredNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="group overflow-hidden rounded-lg bg-[#FDFBF7] shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute left-3 top-3">
                      <span className="rounded bg-[#8B1A1A] px-2 py-1 text-xs font-medium text-[#F5E6D3]">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 line-clamp-2 font-medium text-[#2A0A0A] transition-colors group-hover:text-[#8B1A1A]">
                      {item.title}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-sm text-[#666]">{item.summary}</p>
                    <div className="flex items-center justify-between text-xs text-[#999]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1 text-[#8B1A1A] opacity-0 transition-opacity group-hover:opacity-100">
                        阅读更多
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 查看更多 */}
            <div className="mt-6 text-center">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#8B1A1A] transition-colors hover:text-[#6B1010]"
              >
                查看更多新闻
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* 右侧通知公告 */}
          <div className="rounded-lg border border-[#E8DCC8] bg-[#FDFBF7] shadow-md">
            <div className="flex items-center justify-between border-b border-[#E8DCC8] px-5 py-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#D4AF37]" />
                <h3 className="font-serif text-lg font-bold text-[#2A0A0A]">通知公告</h3>
              </div>
              <Link
                href="/news"
                className="text-xs text-[#8B1A1A] transition-colors hover:text-[#6B1010]"
              >
                更多
              </Link>
            </div>
            <div className="divide-y divide-[#E8DCC8]">
              {notices.map((notice) => (
                <Link
                  key={notice.id}
                  href={notice.id === 1 ? "/service/admission" : "/news"}
                  className="group flex items-start gap-3 px-5 py-4 transition-colors hover:bg-[#8B1A1A]/5"
                >
                  <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#D4AF37]" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="truncate text-sm text-[#333] transition-colors group-hover:text-[#8B1A1A]">
                        {notice.title}
                      </h4>
                      {notice.isNew && (
                        <span className="flex-shrink-0 rounded bg-[#8B1A1A] px-1.5 py-0.5 text-[10px] text-[#F5E6D3]">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-[#999]">{notice.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
