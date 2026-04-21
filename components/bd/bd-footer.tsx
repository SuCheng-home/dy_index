'use client'

import { ChevronUp } from 'lucide-react'
import Link from 'next/link'

const footerLinks = [
  {
    title: '了解丹中',
    links: [
      { label: '学校简介', href: '/bd/学校简介' },
      { label: '校长致辞', href: '/bd/校长致辞' },
      { label: '校训校风', href: '/bd/校歌校训' },
      { label: '组织机构', href: '/bd/组织架构' },
      { label: '校园风光', href: '/bd/校园风光' },
    ],
  },
  {
    title: '教育教学',
    links: [
      { label: '课程体系', href: '/bd/课程改革' },
      { label: '学科建设', href: '/bd/教研组建设' },
      { label: '教学成果', href: '/bd/科研教学处' },
      { label: '教研动态', href: '/bd/教学动态' },
    ],
  },
  {
    title: '招生招聘',
    links: [
      { label: '高中招生', href: '/bd/招生咨询' },
      { label: '国际部招生', href: '/bd/国际课程' },
      { label: '人才招聘', href: '/bd/学校发展中心' },
      { label: '在线咨询', href: '/bd/news' },
    ],
  },
  {
    title: '校园服务',
    links: [
      { label: '图书馆', href: '/bd/图书馆' },
      { label: '校历查询', href: '/bd/学校简介' },
      { label: '邮箱系统', href: '/bd/信息中心' },
      { label: '门户登录', href: '/bd/学校保障中心' },
    ],
  },
]

export default function BdFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer style={{ backgroundColor: '#1a1a1a' }}>
      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-8 py-16">
        <div className="flex gap-16">
          {/* School info */}
          <div className="flex-shrink-0 w-[300px]">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: '#8B1A1A' }}
              >
                <span className="text-xs font-bold" style={{ color: '#8B1A1A', fontFamily: 'serif' }}>
                  {'丹中'}
                </span>
              </div>
              <div>
                <span className="text-lg font-bold block" style={{ color: '#e5e5e5', fontFamily: 'serif' }}>
                  江苏省丹阳高级中学
                </span>
                <span className="text-[10px] tracking-[0.15em]" style={{ color: '#777' }}>
                  JIANGSU DANYANG HIGH SCHOOL
                </span>
              </div>
            </div>
            <div className="space-y-2 text-sm" style={{ color: '#888' }}>
              <p>地址：江苏省丹阳市新民中路138号</p>
              <p>电话：0511-86522028</p>
              <p>邮编：212300</p>
              <p>邮箱：jsdygz@163.com</p>
            </div>
          </div>

          {/* Link columns */}
          <div className="flex-1 grid grid-cols-4 gap-8">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h4 className="text-sm font-bold mb-4 pb-3 border-b" style={{ color: '#ccc', borderColor: '#333' }}>
                  {group.title}
                </h4>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm transition-colors duration-300 hover:text-[#C9A96E]"
                        style={{ color: '#888' }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t" style={{ borderColor: '#2a2a2a' }}>
        <div className="max-w-[1400px] mx-auto px-8 py-5 flex items-center justify-between">
          <p className="text-xs" style={{ color: '#666' }}>
            {'Copyright \u00A9 2026 江苏省丹阳高级中学 All Rights Reserved. 苏ICP备XXXXXXXX号'}
          </p>
          <button
            onClick={scrollToTop}
            className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300"
            style={{ borderColor: '#444', color: '#888' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#8B1A1A'
              e.currentTarget.style.color = '#8B1A1A'
              e.currentTarget.style.backgroundColor = 'rgba(139,26,26,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#444'
              e.currentTarget.style.color = '#888'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <ChevronUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  )
}
