"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown, ChevronRight, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

// 导航数据带二级和三级菜单
const navItems = [
  {
    label: "校园信息",
    href: "/about",
    image: "/view/view1.jpg",
    subMenus: [
      { label: "学校概况", children: ["学校简介", "文化标识", "大事记", "校园平面图"] },
      { label: "校史沿革", children: ["发展历程", "历任领导", "杰出校友"] },
      { label: "校园风光", children: ["教学楼群", "图书馆", "体育场馆", "学生宿舍"] },
      { label: "组织机构", children: ["行政部门", "教学部门", "后勤部门"] },
      { label: "领导班子", children: ["校领导", "中层干部"] },
    ],
  },
  {
    label: "党建工作",
    href: "/party",
    image: "/view/view2.jpg",
    subMenus: [
      { label: "党建动态", children: ["党建新闻", "支部活动", "主题党日"] },
      { label: "党史学习", children: ["学习资料", "心得体会", "专题讲座"] },
      { label: "主题教育", children: ["活动方案", "学习成果", "先进典型"] },
      { label: "党员风采", children: ["优秀党员", "入党积极分子"] },
    ],
  },
  {
    label: "德育之窗",
    href: "/moraledu",
    image: "/view/view3.jpg",
    subMenus: [
      { label: "德育动态", children: ["德育新闻", "班级风采", "先进表彰"] },
      { label: "心理健康", children: ["心理咨询", "心理课程", "心理活动"] },
      { label: "班主任工作", children: ["工作动态", "经验交流", "培训学习"] },
      { label: "学生社团", children: ["社团介绍", "社团活动", "社团招新"] },
      { label: "社会实践", children: ["研学旅行", "志愿服务", "社区活动"] },
    ],
  },
  {
    label: "教学管理",
    href: "/teaching",
    image: "/view/view4.jpg",
    subMenus: [
      { label: "教学动态", children: ["教学新闻", "教学简报", "教学通知"] },
      { label: "课程建设", children: ["课程方案", "校本课程", "选修课程"] },
      { label: "教学研究", children: ["教研活动", "课题研究", "论文发表"] },
      { label: "考试管理", children: ["考试安排", "成绩查询", "分析报告"] },
    ],
  },
  {
    label: "教师发展",
    href: "/teachers",
    image: "/view/view5.jpg",
    subMenus: [
      { label: "师资队伍", children: ["名师风采", "骨干教师", "青年教师"] },
      { label: "名师工作室", children: ["工作室介绍", "研修活动", "成果展示"] },
      { label: "教师培训", children: ["校本培训", "外出培训", "网络研修"] },
      { label: "教研成果", children: ["获奖情况", "论文著作", "课题成果"] },
    ],
  },
  {
    label: "群团工作",
    href: "/union",
    image: "/view/view6.jpg",
    subMenus: [
      { label: "工会活动", children: ["工会新闻", "教工活动", "关爱教职工"] },
      { label: "团委工作", children: ["团委动态", "团员培养", "青年志愿者"] },
      { label: "学生会", children: ["学生会介绍", "学生活动", "学生干部"] },
      { label: "关工委", children: ["关工委动态", "老教师风采", "关爱活动"] },
    ],
  },
  {
    label: "校园服务",
    href: "/service",
    image: "/view/view7.jpg",
    subMenus: [
      { label: "招生信息", children: ["招生简章", "招生政策", "录取查询"] },
      { label: "后勤服务", children: ["餐饮服务", "住宿管理", "校园安全"] },
      { label: "图书馆", children: ["馆藏资源", "借阅服务", "阅读推广"] },
      { label: "信息中心", children: ["网络服务", "设备维护", "信息化建设"] },
    ],
  },
  {
    label: "国际教育",
    href: "/international",
    image: "/view/view8.jpg",
    subMenus: [
      { label: "国际交流", children: ["交流动态", "友好学校", "来访接待"] },
      { label: "海外研学", children: ["研学项目", "研学日记", "研学成果"] },
      { label: "合作项目", children: ["项目介绍", "升学指导", "录取喜报"] },
      { label: "外教风采", children: ["外教团队", "外教课程", "文化活动"] },
    ],
  },
]

export function Header({ variant = "default" }: { variant?: "default" | "home" }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [activeSubMenu, setActiveSubMenu] = useState<number>(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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

  const handleNavEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
    setActiveDropdown(label)
    setActiveSubMenu(0)
  }

  const handleNavLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
      setActiveSubMenu(0)
    }, 200)
  }

  const currentNavItem = navItems.find((item) => item.label === activeDropdown)

  return (
    <>
      {/* 背景蒙层 - 当下拉菜单打开时显示，从左到右渐变 + 颗粒效果 */}
      <div
        className="fixed inset-0 z-40 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: activeDropdown ? 1 : 0,
        }}
      >
        {/* 主渐变遮罩 - 从左到右 */}
        <div
          className="absolute inset-0"
          style={{
            background: activeDropdown 
              ? 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.3) 70%, transparent 100%)' 
              : 'transparent',
          }}
        />
        {/* 颗粒/噪点效果 */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            opacity: activeDropdown ? 0.15 : 0,
            mixBlendMode: 'overlay',
          }}
        />
      </div>

      <header className={`${isOverlay ? "fixed" : "sticky"} top-0 z-50 w-full`}>
        <div
          className={`transition-all duration-500 ${
            isTop && !activeDropdown
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
                className={`h-10 lg:h-11 xl:h-12 w-auto transition-all duration-300 ${isTop && !activeDropdown ? "brightness-0 invert" : ""}`}
                priority
              />
            </Link>

            {/* 桌面端导航 */}
            <nav className="hidden items-center gap-1 lg:gap-2 xl:gap-4 lg:flex">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="group relative"
                  onMouseEnter={() => handleNavEnter(item.label)}
                  onMouseLeave={handleNavLeave}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-0.5 px-2 py-2 text-[15px] lg:text-[16px] xl:text-[17px] font-semibold tracking-wider transition-all duration-300 whitespace-nowrap relative ${
                      isTop && !activeDropdown
                        ? "text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:text-white"
                        : activeDropdown === item.label
                        ? "text-[#8B1A1A]"
                        : "text-[#333] hover:text-[#8B1A1A]"
                    }`}
                    style={isTop && !activeDropdown ? { textShadow: "0 2px 8px rgba(0,0,0,0.6), 0 0 2px rgba(0,0,0,0.8)" } : {}}
                  >
                    {item.label}
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${activeDropdown === item.label ? "rotate-180" : ""}`} />
                    {/* 底部指示线 */}
                    <span
                      className="absolute bottom-0 left-2 right-2 h-[2px] transition-all duration-300"
                      style={{
                        backgroundColor: '#8B1A1A',
                        transform: activeDropdown === item.label ? 'scaleX(1)' : 'scaleX(0)',
                        transformOrigin: 'center',
                      }}
                    />
                  </Link>
                </div>
              ))}
            </nav>

            {/* 右侧操作区 */}
            <div className="flex items-center gap-2 lg:gap-4 ml-auto lg:ml-0">
              <a
                href="https://www.zhxiaoyuan.cn/app/#/main/homePage/danyangHome"
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex h-9 items-center justify-center gap-1.5 rounded-full px-3 transition-all ${
                  isTop && !activeDropdown
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
                  isTop && !activeDropdown
                    ? "text-white hover:bg-white/10"
                    : "text-[#666] hover:bg-[#8B1A1A]/5 hover:text-[#8B1A1A]"
                }`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* 红色品牌线 */}
        <div
          className="h-[3px] transition-opacity duration-300"
          style={{
            backgroundColor: '#8B1A1A',
            opacity: activeDropdown || isScrolled ? 1 : 0,
          }}
        />

        {/* Mega Dropdown - 桌面端 */}
        <div
          className="hidden lg:block absolute top-full left-0 right-0 transition-all duration-400 overflow-hidden"
          style={{
            maxHeight: activeDropdown ? '420px' : '0px',
            opacity: activeDropdown ? 1 : 0,
            boxShadow: activeDropdown ? '0 12px 40px rgba(0,0,0,0.1)' : 'none',
          }}
          onMouseEnter={() => {
            if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
          }}
          onMouseLeave={handleNavLeave}
        >
          <div className="bg-white border-t" style={{ borderColor: '#f0f0f0' }}>
            <div className="max-w-[1400px] mx-auto flex" style={{ minHeight: '380px' }}>
              {/* 左侧：图片区域 - 保持图片原始比例 */}
              <div className="w-[520px] flex-shrink-0 relative overflow-hidden">
                {currentNavItem && (
                  <Image
                    src={currentNavItem.image}
                    alt={currentNavItem.label}
                    fill
                    className="object-cover transition-transform duration-700"
                    style={{ transform: 'scale(1.02)' }}
                  />
                )}
                {/* 右侧渐变遮罩 - 从左到右，更高级 */}
                <div
                  className="absolute inset-0"
                  style={{ 
                    background: 'linear-gradient(to right, transparent 30%, rgba(255,255,255,0.4) 70%, rgba(255,255,255,0.95) 100%)' 
                  }}
                />
                {/* 右侧颗粒效果 */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    opacity: 0.08,
                    mixBlendMode: 'overlay',
                    maskImage: 'linear-gradient(to right, transparent 40%, black 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 40%, black 100%)',
                  }}
                />
              </div>

              {/* 中间：二级菜单 */}
              <div className="w-[280px] flex-shrink-0 border-r py-6 px-2" style={{ borderColor: '#f0f0f0' }}>
                {currentNavItem?.subMenus.map((sub, i) => (
                  <button
                    key={sub.label}
                    className="w-full text-left px-6 py-3.5 text-[15px] transition-all duration-300 rounded-sm flex items-center justify-between"
                    style={{
                      color: activeSubMenu === i ? '#8B1A1A' : '#444',
                      backgroundColor: activeSubMenu === i ? 'rgba(139,26,26,0.04)' : 'transparent',
                      fontWeight: activeSubMenu === i ? 600 : 400,
                    }}
                    onMouseEnter={() => setActiveSubMenu(i)}
                  >
                    {sub.label}
                    {sub.children && sub.children.length > 0 && (
                      <ChevronRight size={14} style={{ color: activeSubMenu === i ? '#8B1A1A' : '#ccc' }} />
                    )}
                  </button>
                ))}
              </div>

              {/* 右侧：三级链接 */}
              <div className="flex-1 py-8 px-10">
                {currentNavItem?.subMenus[activeSubMenu]?.children && (
                  <div className="space-y-1">
                    {currentNavItem.subMenus[activeSubMenu].children.map((child) => (
                      <Link
                        key={child}
                        href="#"
                        className="flex items-center gap-2 px-4 py-3 text-sm rounded-sm transition-all duration-300 group/link"
                        style={{ color: '#555' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(139,26,26,0.04)'
                          e.currentTarget.style.color = '#8B1A1A'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.color = '#555'
                        }}
                      >
                        <ChevronRight size={12} style={{ color: '#8B1A1A' }} />
                        {child}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
                      {item.subMenus.map((sub) => (
                        <Link
                          key={sub.label}
                          href="#"
                          className="block py-2 text-sm text-[#666] transition-colors hover:text-[#8B1A1A]"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
