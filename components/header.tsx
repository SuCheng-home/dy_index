"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, ChevronDown, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NEWS_DATA } from "@/lib/news-data"

const navItems = [
  {
    label: "校园信息",
    href: "/about",
    children: [
      { label: "学校概况", href: "/about" },
      { label: "校史沿革", href: "/about/history" },
      { label: "校园风光", href: "/about/campus" },
      { label: "组织机构", href: "/about/organization" },
      { label: "领导班子", href: "/about/leadership" },
      { label: "食堂菜谱", href: "/about/canteen" },
    ],
  },
  {
    label: "党建工作",
    href: "/party",
    children: [
      { label: "党建动态", href: "/party" },
      { label: "党史学习", href: "/party/history" },
      { label: "主题教育", href: "/party/theme" },
      { label: "党员风采", href: "/party/members" },
    ],
  },
  {
    label: "德育之窗",
    href: "/moraledu",
    children: [
      { label: "德育动态", href: "/moraledu" },
      { label: "心理健康", href: "/moraledu/mental" },
      { label: "班主任工作", href: "/moraledu/teacher" },
      { label: "学生社团", href: "/moraledu/clubs" },
      { label: "社会实践", href: "/moraledu/practice" },
    ],
  },
  {
    label: "教学管理",
    href: "/teaching",
    children: [
      { label: "教学动态", href: "/teaching" },
      { label: "课程建设", href: "/teaching/curriculum" },
      { label: "教学研究", href: "/teaching/research" },
      { label: "考试管理", href: "/teaching/exam" },
      { label: "学业评价", href: "/teaching/evaluation" },
    ],
  },
  {
    label: "教师发展",
    href: "/teachers",
    children: [
      { label: "师资队伍", href: "/teachers" },
      { label: "名师工作室", href: "/teachers/studio" },
      { label: "教师培训", href: "/teachers/training" },
      { label: "教研成果", href: "/teachers/achievements" },
    ],
  },
  {
    label: "统群工作",
    href: "/union",
    children: [
      { label: "工会活动", href: "/union" },
      { label: "团委工作", href: "/union/youth" },
      { label: "学生会", href: "/union/student" },
      { label: "关工委", href: "/union/elderly" },
    ],
  },
  {
    label: "校园服务",
    href: "/service",
    children: [
      { label: "招生信息", href: "/service/admission" },
      { label: "后勤服务", href: "/service/logistics" },
      { label: "图书馆", href: "/service/library" },
      { label: "信息中心", href: "/service/info" },
    ],
  },
  {
    label: "国际教育",
    href: "/international",
    children: [
      { label: "国际交流", href: "/international" },
      { label: "海外研学", href: "/international/study" },
      { label: "合作项目", href: "/international/projects" },
      { label: "外教风采", href: "/international/teachers" },
    ],
  },
]

export function Header({ variant = "default" }: { variant?: "default" | "home" }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const isNewsDetail = /^\/news\/[^/]+$/.test(pathname)
  const isOverlay = variant === "home" || (variant === "default" && pathname !== "/" && !isNewsDetail && pathname !== "/admin")
  const isTop = isOverlay && !isScrolled

  useEffect(() => {
    if (!isOverlay) {
      setIsScrolled(false)
      return
    }

    const update = () => {
      setIsScrolled(window.scrollY > 10)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [isOverlay, pathname])

  return (
    <header className={`${isOverlay ? "fixed" : "sticky"} top-0 z-50 w-full`}>
      <div
        className={`transition-colors duration-300 ${
          isTop
            ? "bg-transparent"
            : "border-b border-[#E8DCC8] bg-white shadow-sm"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-2 xl:px-4 py-3">
          <Link href="/" className="flex shrink-0 items-center mr-auto lg:mr-8 xl:mr-12">
            <Image
              src="/logo.png"
              alt="江苏省丹阳高级中学"
              width={200}
              height={56}
              className={`h-10 lg:h-11 xl:h-12 w-auto transition-all duration-300 ${isTop ? "brightness-0 invert" : ""}`}
              priority
            />
          </Link>

          {/* 桌面端导航 */}
          <nav className="hidden items-center gap-1 lg:gap-2 xl:gap-4 lg:flex">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="group relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-0.5 px-2 py-2 text-[15px] lg:text-[16px] xl:text-[18px] font-black tracking-wider transition-all duration-300 whitespace-nowrap ${
                    isTop
                      ? "text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:text-white hover:-translate-y-0.5"
                      : "text-[#333] hover:text-[#8B1A1A] hover:-translate-y-0.5"
                  }`}
                  style={isTop ? { textShadow: "0 2px 8px rgba(0,0,0,0.6), 0 0 2px rgba(0,0,0,0.8)" } : {}}
                >
                  {item.label}
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                </Link>
                {activeDropdown === item.label && (
                  <div className="absolute left-0 top-full z-50 min-w-[180px] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className={`mt-2 rounded-lg py-2 shadow-xl border transition-colors ${
                      isTop 
                        ? "bg-black/60 backdrop-blur-xl border-white/20 text-white" 
                        : "bg-[#FDFBF7]/95 backdrop-blur-md border-[#E8DCC8]"
                    }`}>
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`flex items-center gap-2 px-5 py-3 text-[15px] font-medium transition-all hover:pl-6 ${
                            isTop
                              ? "text-white/90 hover:bg-white/20 hover:text-white"
                              : "text-[#444] hover:bg-[#8B1A1A]/10 hover:text-[#8B1A1A]"
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full opacity-0 transition-opacity group-hover:opacity-100 ${
                            isTop ? "bg-white" : "bg-[#D4AF37]"
                          }`} />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* 移动端菜单 */}
          <div className="flex items-center gap-2 lg:gap-4 ml-auto lg:ml-0">
            <a
              href="https://www.zhxiaoyuan.cn/app/#/main/homePage/danyangHome"
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex h-9 items-center justify-center gap-1.5 rounded-full px-3 transition-all ${
                isTop 
                  ? "text-white hover:bg-white/20 backdrop-blur-sm" 
                  : "text-[#555] hover:bg-[#8B1A1A]/10 hover:text-[#8B1A1A]"
              }`}
              aria-label="管理系统"
            >
              <Settings className="h-4 w-4 transition-transform group-hover:rotate-90" />
              <span className="hidden text-[13px] font-medium xl:block whitespace-nowrap">管理后台</span>
            </a>
            <Button
              variant="ghost"
              size="icon"
              className={`lg:hidden ${
                isTop
                  ? "text-white hover:bg-white/10"
                  : "text-[#666] hover:bg-[#8B1A1A]/5 hover:text-[#8B1A1A]"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {mobileMenuOpen && (
          <div className="animate-in slide-in-from-top-2 border-t border-[#E8DCC8] bg-white lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="mx-auto max-w-7xl px-4 py-4">
              {navItems.map((item) => (
                <div key={item.label} className="border-b border-[#E8DCC8] last:border-b-0">
                  <button
                    className="flex w-full items-center justify-between py-3 text-left font-medium text-[#333]"
                    onClick={() =>
                      setActiveDropdown(activeDropdown === item.label ? null : item.label)
                    }
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        activeDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      activeDropdown === item.label ? "max-h-96 pb-3" : "max-h-0"
                    }`}
                  >
                    <div className="pl-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block py-2 text-sm text-[#666] transition-colors hover:text-[#8B1A1A]"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
