"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Building2, ChevronRight, ChevronLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const departments = [
  { id: "all", label: "全部" },
  { id: "office", label: "校办" },
  { id: "academic", label: "教务处" },
  { id: "student", label: "学生处" },
  { id: "research", label: "教科室" },
  { id: "logistics", label: "后勤处" },
  { id: "youth", label: "团委" },
]

const todayNews = [
  {
    id: 1,
    department: "office",
    departmentName: "校办",
    title: "我校召开2026年春季学期教职工大会",
    summary: "会议总结了上学期工作成果，部署了新学期重点任务，强调了师德师风建设的重要性。",
    time: "08:30",
    image: "/view/view6.jpg",
    isTop: true,
  },
  {
    id: 2,
    department: "academic",
    departmentName: "教务处",
    title: "高三年级二模考试成绩分析会顺利召开",
    summary: "各学科备课组长深入分析了二模数据，制定了后期复习策略和提升方案。",
    time: "10:00",
    image: "/view/view8.jpg",
    isTop: false,
  },
  {
    id: 3,
    department: "student",
    departmentName: "学生处",
    title: "我校学生在省青少年科技创新大赛中斩获佳绩",
    summary: "我校代表队荣获一等奖2项、二等奖5项，充分展现了丹中学子的创新精神。",
    time: "11:30",
    image: "/view/view3.jpg",
    isTop: true,
  },
  {
    id: 4,
    department: "research",
    departmentName: "教科室",
    title: "省级课题《大成教育理念下的学科融合研究》顺利开题",
    summary: "专家组对课题研究方向给予高度肯定，并提出了宝贵的指导意见。",
    time: "14:00",
    image: "/view/view7.jpg",
    isTop: false,
  },
  {
    id: 5,
    department: "youth",
    departmentName: "团委",
    title: "志愿服务进社区 青春力量暖人心",
    summary: "我校青年志愿者走进丹凤社区，开展义务辅导、环境清洁等志愿服务活动。",
    time: "15:30",
    image: "/view/view8.jpg",
    isTop: false,
  },
  {
    id: 6,
    department: "logistics",
    departmentName: "后勤处",
    title: "校园绿化提升工程圆满完成",
    summary: "新种植樱花树、银杏树共计120株，进一步美化了校园环境。",
    time: "16:00",
    image: "/view/view1.jpg",
    isTop: false,
  },
]

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
  const weekDay = weekDays[date.getDay()]
  return `${year}年${month}月${day}日 ${weekDay}`
}

function getNewsForDate(date: Date) {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  
  // 基于日期生成确定的伪随机打乱
  const shuffled = [...todayNews].sort((a, b) => {
    const hashA = (a.id * seed) % 17
    const hashB = (b.id * seed) % 17
    return hashA - hashB
  })

  // 保证每天至少有一个部门的讯息，这里我们根据日期展示 3-6 条
  const count = (seed % 4) + 3
  const result = shuffled.slice(0, count)
  
  // 保证至少有一条被置顶以用于左侧大图展示
  if (!result.some(n => n.isTop)) {
    result[0].isTop = true
  }
  
  return result
}

export function TodayDanzhong() {
  const [activeTab, setActiveTab] = useState("all")
  const [dateOffset, setDateOffset] = useState(0)
  const { ref: sectionRef, isRevealed } = useScrollReveal()

  const displayDate = new Date()
  displayDate.setDate(displayDate.getDate() + dateOffset)

  const currentNews = getNewsForDate(displayDate)

  const filteredNews =
    activeTab === "all" ? currentNews : currentNews.filter((item) => item.department === activeTab)

  const topNews = filteredNews.filter((item) => item.isTop)
  const otherNews = filteredNews.filter((item) => !item.isTop)

  // 如果筛选后没有新闻，就提供一个空状态或者降级处理
  const hasNews = filteredNews.length > 0

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-to-b from-[#FDFBF7] to-[#F8F4ED] py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* 标题区域 */}
        <div
          className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row transition-all duration-1000"
          style={{
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-12 w-1.5 rounded-full bg-gradient-to-b from-[#8B1A1A] to-[#D4AF37]" />
              <div className="absolute -left-1 top-0 h-3 w-3 animate-pulse rounded-full bg-[#D4AF37]" />
            </div>
            <div>
              <h2 className="font-serif text-3xl font-bold text-[#8B1A1A]">今日丹中</h2>
              <p className="mt-1 text-sm text-[#666]">Daily News of Danyang High School</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white px-2 py-1.5 sm:px-3 shadow-sm">
            <button 
              onClick={() => setDateOffset(prev => prev - 1)}
              className="p-1.5 sm:p-2 hover:bg-[#8B1A1A]/10 rounded-full transition-colors group"
              aria-label="前一天"
            >
              <ChevronLeft className="h-4 w-4 text-[#666] group-hover:text-[#8B1A1A]" />
            </button>
            <div className="flex items-center gap-2 px-1 sm:px-3 border-x border-gray-100 min-w-[140px] sm:min-w-[180px] justify-center">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-[#8B1A1A]" />
              <span className="font-medium text-[#333] text-sm sm:text-base select-none">{formatDate(displayDate)}</span>
            </div>
            <button 
              onClick={() => setDateOffset(prev => prev + 1)}
              className="p-1.5 sm:p-2 hover:bg-[#8B1A1A]/10 rounded-full transition-colors group disabled:opacity-50 disabled:hover:bg-transparent"
              disabled={dateOffset === 0}
              aria-label="后一天"
            >
              <ChevronRight className="h-4 w-4 text-[#666] group-hover:text-[#8B1A1A]" />
            </button>
          </div>
        </div>

        {/* 部门筛选标签 */}
        <div
          className="mb-8 flex flex-wrap items-center gap-2 transition-all duration-1000"
          style={{
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? "translateY(0)" : "translateY(30px)",
            transitionDelay: "0.1s",
          }}
        >
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setActiveTab(dept.id)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all duration-300",
                activeTab === dept.id
                  ? "bg-[#8B1A1A] text-white shadow-md"
                  : "bg-white text-[#666] shadow-sm hover:bg-[#8B1A1A]/5 hover:text-[#8B1A1A]"
              )}
            >
              {dept.label}
            </button>
          ))}
        </div>

        {/* 新闻内容区 */}
        <div
          className="grid gap-6 lg:grid-cols-3 transition-all duration-1000"
          style={{
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? "translateY(0)" : "translateY(40px)",
            transitionDelay: "0.2s",
          }}
        >
          {/* 左侧重点新闻 */}
          <div className="lg:col-span-2">
            <div className="grid gap-6 sm:grid-cols-2">
              {topNews.map((news, index) => (
                <Link
                  key={news.id}
                  href={`/news/${news.id}`}
                  className={cn(
                    "group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl",
                    index === 0 && "sm:col-span-2"
                  )}
                >
                  <div className={cn("relative", index === 0 ? "h-72" : "h-48")}>
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="mb-2 flex items-center gap-3">
                        <span className="rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-medium text-white">
                          {news.departmentName}
                        </span>
                      </div>
                      <h3
                        className={cn(
                          "font-bold text-white transition-colors group-hover:text-[#D4AF37]",
                          index === 0 ? "text-xl" : "text-base"
                        )}
                      >
                        {news.title}
                      </h3>
                      {index === 0 && (
                        <p className="mt-2 line-clamp-2 text-sm text-white/80">{news.summary}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 右侧新闻列表 */}
          <div className="rounded-xl bg-white p-5 shadow-md">
            <div className="mb-4 flex items-center justify-between border-b border-[#E8DCC8] pb-3">
              <h3 className="flex items-center gap-2 font-bold text-[#333]">
                <Building2 className="h-5 w-5 text-[#8B1A1A]" />
                各部门动态
              </h3>
              <Link
                href="/news"
                className="flex items-center gap-1 text-sm text-[#8B1A1A] transition-colors hover:text-[#D4AF37]"
              >
                更多
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {otherNews.slice(0, 5).map((news) => (
                <Link
                  key={news.id}
                  href={`/news/${news.id}`}
                  className="group flex gap-4 rounded-lg p-2 transition-colors hover:bg-[#8B1A1A]/5"
                >
                  <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="line-clamp-2 text-sm font-medium text-[#333] transition-colors group-hover:text-[#8B1A1A]">
                      {news.title}
                    </h4>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-[#999]">
                      <span className="text-[#8B1A1A]">{news.departmentName}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 查看全部按钮 */}
        <div className="mt-10 text-center">
          <Link
            href="/news"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-[#8B1A1A] bg-transparent px-8 py-3 font-medium text-[#8B1A1A] transition-all duration-300 hover:bg-[#8B1A1A] hover:text-white"
          >
            查看全部新闻
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
