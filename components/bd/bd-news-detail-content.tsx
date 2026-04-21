'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Calendar, Eye, Share2, Printer } from 'lucide-react'
import { getBdNewsById, getBdPrevNext } from '@/lib/bd-news-data'

export default function BdNewsDetailContent({ id }: { id: string }) {
  const news = getBdNewsById(id) || {
    title: '丹阳高级中学新闻',
    date: '2026-04-16',
    category: '校园新闻',
    views: 100,
    image: '/bd/hero-1.jpg',
    content: ['新闻内容正在更新中，敬请期待。'],
    summary: '新闻内容正在更新中，敬请期待。',
    id: 'default',
    kind: 'news' as const,
  }
  const { prev, next } = getBdPrevNext(id)

  return (
    <main className="pt-[128px]" style={{ backgroundColor: '#fff' }}>
      <div className="max-w-[900px] mx-auto px-8 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-10" style={{ color: '#999' }}>
          <Link href="/bd" className="transition-colors duration-300 hover:text-[#8B1A1A]">
            首页
          </Link>
          <span>/</span>
          <Link href="/bd#news" className="transition-colors duration-300 hover:text-[#8B1A1A]">
            新闻公告
          </Link>
          <span>/</span>
          <span style={{ color: '#555' }}>正文</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl font-serif font-bold leading-relaxed mb-6" style={{ color: '#222' }}>
          {news.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-6 pb-6 border-b mb-8" style={{ borderColor: '#eee' }}>
          <div className="flex items-center gap-2">
            <Calendar size={14} style={{ color: '#999' }} />
            <span className="text-sm" style={{ color: '#999' }}>{news.date}</span>
          </div>
          <span
            className="px-3 py-0.5 rounded-sm text-xs"
            style={{ backgroundColor: 'rgba(139,26,26,0.08)', color: '#8B1A1A' }}
          >
            {news.category}
          </span>
          <div className="flex items-center gap-2">
            <Eye size={14} style={{ color: '#999' }} />
            <span className="text-sm" style={{ color: '#999' }}>{news.views} 次浏览</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button
              className="flex items-center gap-1 text-sm transition-colors duration-300 hover:text-[#8B1A1A]"
              style={{ color: '#999' }}
            >
              <Share2 size={14} />
              分享
            </button>
            <button
              className="flex items-center gap-1 text-sm transition-colors duration-300 hover:text-[#8B1A1A]"
              style={{ color: '#999' }}
              onClick={() => window.print()}
            >
              <Printer size={14} />
              打印
            </button>
          </div>
        </div>

        {/* Featured image */}
        <div className="relative w-full mb-10 rounded-sm overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="space-y-6 mb-16">
          {news.content.map((paragraph, index) => (
            <p
              key={index}
              className="text-[15px] leading-[2] indent-8"
              style={{ color: '#444' }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Prev / Next navigation */}
        <div className="border-t pt-8 flex items-center justify-between" style={{ borderColor: '#eee' }}>
          {prev ? (
            <Link
              href={`/bd/news/${prev.id}`}
              className="flex items-center gap-2 text-sm transition-colors duration-300 hover:text-[#8B1A1A] max-w-[45%] group"
              style={{ color: '#666' }}
            >
              <ChevronLeft size={16} className="flex-shrink-0 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="line-clamp-1">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/bd/news/${next.id}`}
              className="flex items-center gap-2 text-sm transition-colors duration-300 hover:text-[#8B1A1A] max-w-[45%] text-right group"
              style={{ color: '#666' }}
            >
              <span className="line-clamp-1">{next.title}</span>
              <ChevronRight size={16} className="flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </main>
  )
}
