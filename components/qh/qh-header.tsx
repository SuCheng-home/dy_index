'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, ChevronRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { mainNavItems, type NavItem } from '../shared/nav-data'

interface QhHeaderProps {
  onSearchClick?: () => void
}

export function QhHeader({ onSearchClick }: QhHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [activeNav, setActiveNav] = useState<number | null>(null)
  const [activeSubMenu, setActiveSubMenu] = useState<number>(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      className="fixed top-0 left-0 right-16 z-40 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? 'rgba(255,255,255,0.97)' : '#fff',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/qh" className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #5B2C6F 0%, #7D3C98 100%)' }}
            >
              丹
            </div>
            <div className="flex-shrink-0">
              <h1 className="font-serif font-bold text-lg whitespace-nowrap" style={{ color: '#5B2C6F' }}>
                江苏省丹阳高级中学
              </h1>
              <p className="text-[10px] tracking-wider whitespace-nowrap" style={{ color: '#666' }}>
                JIANGSU DANYANG SENIOR HIGH SCHOOL
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-0">
            {mainNavItems.map((item, index) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => handleNavEnter(index)}
                onMouseLeave={handleNavLeave}
              >
                <button
                  className="px-3.5 py-2 text-sm font-medium transition-colors duration-300 whitespace-nowrap relative"
                  style={{ color: activeNav === index ? '#5B2C6F' : '#333' }}
                >
                  {item.label}
                  <span
                    className="absolute bottom-0 left-3 right-3 h-[2px] transition-all duration-300"
                    style={{
                      backgroundColor: '#5B2C6F',
                      transform: activeNav === index ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'center',
                    }}
                  />
                </button>
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a href="#" className="hidden md:block text-xs whitespace-nowrap" style={{ color: '#666' }}>
              学校主页
            </a>
            <span className="hidden md:block text-gray-300">|</span>
            <a href="#" className="hidden md:block text-xs whitespace-nowrap" style={{ color: '#666' }}>
              EN
            </a>
            <button
              onClick={onSearchClick}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-purple-50 ml-2"
            >
              <Search size={18} style={{ color: '#5B2C6F' }} />
            </button>
            <button className="xl:hidden p-2 rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={20} style={{ color: '#5B2C6F' }} /> : <Menu size={20} style={{ color: '#5B2C6F' }} />}
            </button>
          </div>
        </div>
      </div>

      {/* Purple accent line */}
      <div className="h-[2px]" style={{ background: 'linear-gradient(to right, #5B2C6F, #9B59B6)' }} />

      {/* Mega dropdown - Desktop */}
      <div
        className="hidden xl:block absolute top-full left-0 right-16 transition-all duration-400 overflow-hidden"
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
            {/* Left: Image */}
            <div className="w-[480px] flex-shrink-0 relative overflow-hidden">
              {currentNavItem && (
                <Image
                  src={currentNavItem.image}
                  alt={currentNavItem.label}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 60%, rgba(255,255,255,0.4))' }} />
            </div>

            {/* Middle: Sub-menu */}
            <div className="w-[280px] flex-shrink-0 border-r py-6 px-2" style={{ borderColor: '#f0f0f0' }}>
              {currentNavItem?.subMenus.map((sub, i) => (
                <button
                  key={sub.label}
                  className="w-full text-left px-6 py-3.5 text-[15px] transition-all duration-300 rounded-sm flex items-center justify-between"
                  style={{
                    color: activeSubMenu === i ? '#5B2C6F' : '#444',
                    backgroundColor: activeSubMenu === i ? 'rgba(91,44,111,0.04)' : 'transparent',
                    fontWeight: activeSubMenu === i ? 600 : 400,
                  }}
                  onMouseEnter={() => setActiveSubMenu(i)}
                >
                  {sub.label}
                  {sub.children && sub.children.length > 0 && (
                    <ChevronRight size={14} style={{ color: activeSubMenu === i ? '#5B2C6F' : '#ccc' }} />
                  )}
                </button>
              ))}
            </div>

            {/* Right: Tertiary */}
            <div className="flex-1 py-8 px-10">
              {currentNavItem?.subMenus[activeSubMenu]?.children && (
                <div className="space-y-1">
                  {currentNavItem.subMenus[activeSubMenu].children!.map((child) => (
                    <Link
                      key={child}
                      href="#"
                      className="flex items-center gap-2 px-4 py-3 text-sm rounded-sm transition-all duration-300"
                      style={{ color: '#555' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(91,44,111,0.04)'
                        e.currentTarget.style.color = '#5B2C6F'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = '#555'
                      }}
                    >
                      <ChevronRight size={12} style={{ color: '#5B2C6F' }} />
                      {child}
                    </Link>
                  ))}
                </div>
              )}
              {(!currentNavItem?.subMenus[activeSubMenu]?.children ||
                currentNavItem.subMenus[activeSubMenu].children!.length === 0) && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm" style={{ color: '#bbb' }}>
                    {'点击"'}
                    <span style={{ color: '#5B2C6F' }}>{currentNavItem?.subMenus[activeSubMenu]?.label}</span>
                    {'"查看详情'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`xl:hidden absolute top-full left-0 right-0 bg-white shadow-xl transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="py-4 px-6 max-h-[70vh] overflow-y-auto">
          {mainNavItems.map((item) => (
            <div key={item.label} className="border-b border-gray-100">
              <button
                className="w-full py-3 flex justify-between items-center text-sm font-medium"
                style={{ color: mobileExpandedItem === item.label ? '#5B2C6F' : '#333' }}
                onClick={() => setMobileExpandedItem(mobileExpandedItem === item.label ? null : item.label)}
              >
                {item.label}
                <ChevronRight
                  size={14}
                  className="transition-transform duration-300"
                  style={{ transform: mobileExpandedItem === item.label ? 'rotate(90deg)' : 'rotate(0)' }}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  mobileExpandedItem === item.label ? 'max-h-96 pb-3' : 'max-h-0'
                }`}
              >
                {item.subMenus.map((sub) => (
                  <a
                    key={sub.label}
                    href="#"
                    className="block py-2 pl-4 text-sm text-gray-500 hover:text-[#5B2C6F]"
                  >
                    {sub.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
