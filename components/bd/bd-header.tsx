'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { mainNavItems, type NavItem } from '../shared/nav-data'

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

export default function BdHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeNav, setActiveNav] = useState<number | null>(null)
  const [activeSubMenu, setActiveSubMenu] = useState<number>(0)
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

  const handleNavEnter = (index: number) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
    setActiveNav(index)
    setActiveSubMenu(0)
  }

  const handleNavLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveNav(null)
      setActiveSubMenu(0)
    }, 200)
  }

  const currentNavItem: NavItem | null = activeNav !== null ? mainNavItems[activeNav] : null

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? 'rgba(255,255,255,0.97)' : '#fff',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      {/* Top utility bar */}
      <div
        className="border-b transition-all duration-500 overflow-hidden"
        style={{
          borderColor: '#eee',
          height: scrolled ? '0px' : '36px',
          opacity: scrolled ? 0 : 1,
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
          <Link href="/bd" className="flex items-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="江苏省丹阳高级中学"
              width={200}
              height={56}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Nav items */}
          <nav className="flex items-center gap-0">
            {mainNavItems.map((item, index) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => handleNavEnter(index)}
                onMouseLeave={handleNavLeave}
              >
                <Link
                  href={item.href}
                  className="px-4 py-2 text-[15px] font-medium transition-colors duration-300 flex items-center relative whitespace-nowrap"
                  style={{ color: activeNav === index ? '#8B1A1A' : '#333' }}
                >
                  {item.label}
                  {/* Active underline */}
                  <span
                    className="absolute bottom-0 left-4 right-4 h-[2px] transition-all duration-300"
                    style={{
                      backgroundColor: '#8B1A1A',
                      transform: activeNav === index ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'center',
                    }}
                  />
                </Link>
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

      {/* Mega dropdown panel */}
      <div
        className="absolute top-full left-0 right-0 transition-all duration-400 overflow-hidden"
        style={{
          maxHeight: activeNav !== null ? '420px' : '0px',
          opacity: activeNav !== null ? 1 : 0,
          boxShadow: activeNav !== null ? '0 12px 40px rgba(0,0,0,0.1)' : 'none',
        }}
        onMouseEnter={() => {
          if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
        }}
        onMouseLeave={handleNavLeave}
      >
        <div className="bg-white border-t" style={{ borderColor: '#f0f0f0' }}>
          <div className="max-w-[1400px] mx-auto flex" style={{ minHeight: '380px' }}>
            {/* Left: Image area */}
            <div className="w-[480px] flex-shrink-0 relative overflow-hidden">
              {currentNavItem && (
                <Image
                  src={currentNavItem.imageBd}
                  alt={currentNavItem.label}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 60%, rgba(255,255,255,0.4))' }} />
            </div>

            {/* Middle: Sub-menu list */}
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

            {/* Right: Tertiary links */}
            <div className="flex-1 py-8 px-10">
              {currentNavItem?.subMenus[activeSubMenu]?.children && (
                <div className="space-y-1">
                  {currentNavItem.subMenus[activeSubMenu].children!.map((child) => (
                    <Link
                      key={child}
                      href="#"
                      className="flex items-center gap-2 px-4 py-3 text-sm rounded-sm transition-all duration-300 group"
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
              {/* If no children, show a placeholder message */}
              {(!currentNavItem?.subMenus[activeSubMenu]?.children ||
                currentNavItem.subMenus[activeSubMenu].children!.length === 0) && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm" style={{ color: '#bbb' }}>
                    {'点击"'}
                    <span style={{ color: '#8B1A1A' }}>{currentNavItem?.subMenus[activeSubMenu]?.label}</span>
                    {'"查看详情'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
