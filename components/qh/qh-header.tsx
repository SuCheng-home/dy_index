'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, ChevronDown, Menu, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { mainNavItems } from '../shared/nav-data'

interface QhHeaderProps {
  onSearchClick?: () => void
}

// 香樟叶图标组件
function CamphorLeaf({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className}
      style={style}
      fill="currentColor"
    >
      <path d="M12 2C8 2 4 6 4 12c0 4 2 7 4 9l1-1c2 1 3 2 3 2s1-1 3-2l1 1c2-2 4-5 4-9 0-6-4-10-8-10zm0 2c3 0 6 3 6 8 0 3-1.5 5.5-3 7-1-.5-2-1-3-1s-2 .5-3 1c-1.5-1.5-3-4-3-7 0-5 3-8 6-8z"/>
      <path d="M12 6c-2.5 0-4 2-4 5s1.5 5 4 7c2.5-2 4-4 4-7s-1.5-5-4-5z" opacity="0.6"/>
    </svg>
  )
}

export function QhHeader({ onSearchClick }: QhHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [activeNav, setActiveNav] = useState<number | null>(null)
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
  }

  const handleNavLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveNav(null)
    }, 150)
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? 'rgba(255,255,255,0.98)' : '#fff',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/qh" className="flex items-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="江苏省丹阳高级中学"
              width={240}
              height={68}
              className="h-14 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center">
            {mainNavItems.map((item, index) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => handleNavEnter(index)}
                onMouseLeave={handleNavLeave}
              >
                <button
                  className="px-3 py-4 text-base font-bold transition-all duration-300 whitespace-nowrap flex items-center gap-1 relative group"
                  style={{ color: activeNav === index ? '#5B2C6F' : '#333' }}
                >
                  {/* 香樟叶图标 - 悬停时显示 */}
                  <CamphorLeaf 
                    className="w-4 h-4 transition-all duration-300"
                    style={{ 
                      color: '#5B2C6F',
                      opacity: activeNav === index ? 1 : 0,
                      transform: activeNav === index ? 'translateX(0) rotate(0)' : 'translateX(-8px) rotate(-45deg)',
                    }}
                  />
                  <span>{item.label}</span>
                  <ChevronDown 
                    size={14} 
                    className="transition-transform duration-300"
                    style={{ 
                      color: activeNav === index ? '#5B2C6F' : '#999',
                      transform: activeNav === index ? 'rotate(180deg)' : 'rotate(0)',
                    }}
                  />
                </button>

                {/* 普通下拉菜单 */}
                <div
                  className="absolute left-0 transition-all duration-300 z-[100]"
                  style={{
                    top: '100%',
                    marginTop: '4px',
                    opacity: activeNav === index ? 1 : 0,
                    visibility: activeNav === index ? 'visible' : 'hidden',
                    transform: activeNav === index ? 'translateY(0)' : 'translateY(-8px)',
                    pointerEvents: activeNav === index ? 'auto' : 'none',
                  }}
                  onMouseEnter={() => {
                    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
                  }}
                  onMouseLeave={handleNavLeave}
                >
                  <div 
                    className="bg-white rounded-lg shadow-xl border py-2 min-w-[200px]"
                    style={{ borderColor: '#eee' }}
                  >
                    {item.subMenus.map((sub) => (
                      <Link
                        key={sub.label}
                        href="#"
                        className="flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-300 group/item hover:bg-purple-50"
                        style={{ color: '#444' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#5B2C6F'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#444'
                        }}
                      >
                        {/* 小香樟叶图标 */}
                        <CamphorLeaf 
                          className="w-4 h-4 transition-all duration-300 opacity-0 group-hover/item:opacity-100 flex-shrink-0"
                          style={{ 
                            color: '#5B2C6F',
                            transform: 'rotate(-15deg)',
                          }}
                        />
                        <span>{sub.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a href="#" className="hidden md:block text-xs whitespace-nowrap hover:text-[#5B2C6F] transition-colors" style={{ color: '#666' }}>
              学校主页
            </a>
            <span className="hidden md:block text-gray-300">|</span>
            <a href="#" className="hidden md:block text-xs whitespace-nowrap hover:text-[#5B2C6F] transition-colors" style={{ color: '#666' }}>
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
      <div 
        className="h-[2px] transition-opacity duration-300" 
        style={{ 
          background: 'linear-gradient(to right, #5B2C6F, #9B59B6)',
          opacity: scrolled ? 1 : 0.5,
        }} 
      />

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
                <span className="flex items-center gap-2">
                  {mobileExpandedItem === item.label && (
                    <CamphorLeaf className="w-4 h-4" style={{ color: '#5B2C6F' }} />
                  )}
                  {item.label}
                </span>
                <ChevronDown
                  size={14}
                  className="transition-transform duration-300"
                  style={{ transform: mobileExpandedItem === item.label ? 'rotate(180deg)' : 'rotate(0)' }}
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
                    className="flex items-center gap-2 py-2 pl-6 text-sm text-gray-500 hover:text-[#5B2C6F]"
                  >
                    <CamphorLeaf className="w-3 h-3 opacity-50" style={{ color: '#5B2C6F' }} />
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
