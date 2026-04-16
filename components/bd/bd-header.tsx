'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, ChevronDown } from 'lucide-react'
import Link from 'next/link'

const utilityLinks = [
  { label: '学生', href: '#' },
  { label: '教师', href: '#' },
  { label: '家长', href: '#' },
  { label: '校友', href: '#' },
  { label: '工会', href: '#' },
]

const quickLinks = [
  { label: '首页', href: '/bd' },
  { label: '门户', href: '#' },
  { label: '邮箱', href: '#' },
  { label: '校历', href: '#' },
  { label: '初中部', href: '#' },
]

const mainNav = [
  {
    label: '了解丹中',
    href: '#',
    children: ['学校简介', '校长致辞', '校训校风', '组织机构', '校园风光'],
  },
  {
    label: '新闻公告',
    href: '#news',
    children: ['校园新闻', '媒体丹中', '通知公告', '招标信息'],
  },
  {
    label: '招生招聘',
    href: '#',
    children: ['高中招生', '国际部招生', '人才招聘'],
  },
  {
    label: '学院课程',
    href: '#',
    children: ['课程体系', '学科建设', '教学成果', '教研动态'],
  },
  {
    label: '师生风采',
    href: '#teachers',
    children: ['名师荟萃', '学科带头人', '优秀学子', '校友风采'],
  },
  {
    label: '学生生活',
    href: '#student-life',
    children: ['书院文化', '社团活动', '体育赛事', '艺术节'],
  },
]

export default function BdHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 120)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  const handleDropdownEnter = (index: number) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
    setActiveDropdown(index)
  }

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 150)
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,1)',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      {/* Top utility bar */}
      <div
        className="border-b transition-all duration-500"
        style={{
          borderColor: '#eee',
          height: scrolled ? '0px' : '36px',
          opacity: scrolled ? 0 : 1,
          overflow: 'hidden',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-8 h-9 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {utilityLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm transition-colors duration-300 hover:text-[#8B1A1A]"
                style={{ color: '#555' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm transition-colors duration-300 hover:text-[#8B1A1A]"
                style={{ color: '#555' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main nav bar */}
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/bd" className="flex items-center gap-3 flex-shrink-0">
            {/* School crest */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center border-2 flex-shrink-0"
              style={{ borderColor: '#8B1A1A', backgroundColor: '#fff' }}
            >
              <span
                className="text-xs font-bold leading-tight text-center"
                style={{ color: '#8B1A1A', fontFamily: 'serif' }}
              >
                {'丹中'}
              </span>
            </div>
            <div className="flex flex-col">
              <span
                className="text-xl font-bold tracking-wide whitespace-nowrap"
                style={{ color: '#8B1A1A', fontFamily: 'serif' }}
              >
                江苏省丹阳高级中学
              </span>
              <span className="text-[10px] tracking-[0.2em] whitespace-nowrap" style={{ color: '#999' }}>
                JIANGSU DANYANG HIGH SCHOOL
              </span>
            </div>
          </Link>

          {/* Nav items */}
          <nav className="flex items-center gap-1">
            {mainNav.map((item, index) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(index)}
                onMouseLeave={handleDropdownLeave}
              >
                <Link
                  href={item.href}
                  className="px-5 py-2 text-[15px] font-medium transition-colors duration-300 flex items-center gap-1 relative group"
                  style={{ color: index === 0 ? '#8B1A1A' : '#333' }}
                >
                  {item.label}
                  <ChevronDown
                    size={14}
                    className="transition-transform duration-300"
                    style={{
                      transform: activeDropdown === index ? 'rotate(180deg)' : 'rotate(0deg)',
                      color: '#999',
                    }}
                  />
                  {/* Red underline on first item */}
                  {index === 0 && (
                    <span
                      className="absolute bottom-0 left-5 right-5 h-[2px]"
                      style={{ backgroundColor: '#8B1A1A' }}
                    />
                  )}
                </Link>

                {/* Dropdown */}
                {item.children && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-300"
                    style={{
                      opacity: activeDropdown === index ? 1 : 0,
                      pointerEvents: activeDropdown === index ? 'auto' : 'none',
                      transform: `translateX(-50%) translateY(${activeDropdown === index ? '0' : '-8px'})`,
                    }}
                  >
                    <div
                      className="bg-white rounded-lg shadow-xl border py-2 min-w-[160px]"
                      style={{ borderColor: '#f0f0f0' }}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child}
                          href="#"
                          className="block px-5 py-2.5 text-sm transition-all duration-200"
                          style={{ color: '#555' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#faf5f5'
                            e.currentTarget.style.color = '#8B1A1A'
                            e.currentTarget.style.paddingLeft = '24px'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.color = '#555'
                            e.currentTarget.style.paddingLeft = '20px'
                          }}
                        >
                          {child}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              className="flex items-center rounded-full border overflow-hidden transition-all duration-500"
              style={{
                borderColor: searchOpen ? '#8B1A1A' : '#ddd',
                width: searchOpen ? '260px' : '44px',
                backgroundColor: searchOpen ? '#fff' : 'transparent',
              }}
            >
              {searchOpen && (
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="请输入关键词"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 text-sm outline-none bg-transparent"
                  style={{ color: '#333' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSearchOpen(false)
                      setSearchQuery('')
                    }
                  }}
                />
              )}
              <button
                onClick={() => {
                  if (searchOpen && !searchQuery) {
                    setSearchOpen(false)
                  } else {
                    setSearchOpen(true)
                  }
                }}
                className="w-11 h-11 flex items-center justify-center rounded-full transition-colors duration-300"
                style={{ color: '#8B1A1A' }}
              >
                {searchOpen ? <X size={18} /> : <Search size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Red accent line */}
      <div className="h-[3px]" style={{ backgroundColor: '#8B1A1A' }} />
    </header>
  )
}
