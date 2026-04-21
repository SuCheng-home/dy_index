'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, Share2, Printer, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { getQhNewsById, getQhRelatedNews, getQhNewsByKind } from '@/lib/qh-news-data';

export default function NewsDetailPage() {
  const params = useParams();
  const newsId = params.id as string;
  const news = getQhNewsById(newsId);
  const relatedNews = getQhRelatedNews(newsId);

  const orderedList = news ? getQhNewsByKind(news.kind) : [];
  const currentIndex = news ? orderedList.findIndex((item) => item.id === news.id) : -1;
  const prevNews = currentIndex > 0 ? orderedList[currentIndex - 1] : null;
  const nextNews = currentIndex >= 0 && currentIndex < orderedList.length - 1 ? orderedList[currentIndex + 1] : null;

  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F9FB' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">新闻不存在</h1>
          <Link href="/qh" className="text-[#5B2C6F] hover:underline">返回首页</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FB' }}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/qh" className="flex items-center gap-2 text-gray-600 hover:text-[#5B2C6F] transition-colors">
              <ArrowLeft size={20} />
              <span>返回首页</span>
            </Link>
          </div>
          
          {/* 面包屑导航 */}
          <nav className="hidden md:flex items-center gap-2 text-sm text-gray-500">
            <Link href="/qh" className="hover:text-[#5B2C6F] flex items-center gap-1">
              <Home size={14} />
              首页
            </Link>
            <span>/</span>
            <span>新闻动态</span>
            <span>/</span>
            <span className="text-[#5B2C6F]">{news.category}</span>
          </nav>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="分享">
              <Share2 size={18} className="text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="打印" onClick={() => window.print()}>
              <Printer size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="pt-16">
        {/* 文章头部 */}
        {news.image && (
          <div className="relative w-full h-64 md:h-80 lg:h-96">
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="max-w-[1000px] mx-auto">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3" style={{ backgroundColor: '#5B2C6F', color: '#fff' }}>
                  {news.category}
                </span>
                <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {news.title}
                </h1>
              </div>
            </div>
          </div>
        )}

        {/* 文章内容 */}
        <div className="max-w-[1000px] mx-auto px-6 py-10">
          {!news.image && (
            <>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ backgroundColor: '#5B2C6F', color: '#fff' }}>
                {news.category}
              </span>
              <h1 className="font-serif text-2xl md:text-3xl font-bold mb-6" style={{ color: '#121212' }}>
                {news.title}
              </h1>
            </>
          )}

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{news.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag size={14} />
              <span>{news.category}</span>
            </div>
            {news.author && <span>来源：{news.author}</span>}
            {news.views && <span>阅读：{news.views}</span>}
          </div>

          {/* 正文 */}
          <article 
            className="prose prose-lg max-w-none"
            style={{ 
              color: '#333',
              lineHeight: '1.8',
            }}
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          {/* 上下篇导航 */}
          <div className="mt-12 pt-8 border-t border-gray-200 grid grid-cols-2 gap-4">
            <Link 
              href={prevNews ? `/qh/news/${prevNews.id}` : '/qh/news'} 
              className="group flex items-center gap-3 p-4 rounded-lg bg-white hover:shadow-md transition-all"
            >
              <ChevronLeft size={20} className="text-gray-400 group-hover:text-[#5B2C6F]" />
              <div className="text-left">
                <p className="text-xs text-gray-400 mb-1">上一篇</p>
                <p className="text-sm font-medium text-gray-700 group-hover:text-[#5B2C6F] line-clamp-1">
                  {prevNews ? prevNews.title : '暂无更多'}
                </p>
              </div>
            </Link>
            <Link 
              href={nextNews ? `/qh/news/${nextNews.id}` : '/qh/news'} 
              className="group flex items-center justify-end gap-3 p-4 rounded-lg bg-white hover:shadow-md transition-all"
            >
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">下一篇</p>
                <p className="text-sm font-medium text-gray-700 group-hover:text-[#5B2C6F] line-clamp-1">
                  {nextNews ? nextNews.title : '暂无更多'}
                </p>
              </div>
              <ChevronRight size={20} className="text-gray-400 group-hover:text-[#5B2C6F]" />
            </Link>
          </div>
        </div>

        {/* 相关新闻 */}
        <div className="bg-white py-12">
          <div className="max-w-[1000px] mx-auto px-6">
            <h3 className="font-serif text-xl font-bold mb-6" style={{ color: '#121212' }}>相关新闻</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedNews.map((item) => (
                <Link 
                  key={item.id}
                  href={`/qh/news/${item.id}`}
                  className="group p-4 rounded-lg border border-gray-100 hover:border-[#5B2C6F]/30 hover:shadow-md transition-all"
                >
                  <p className="text-xs text-gray-400 mb-2">{item.date}</p>
                  <h4 className="font-medium text-gray-700 group-hover:text-[#5B2C6F] line-clamp-2 transition-colors">
                    {item.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 底部 */}
        <footer className="py-8 text-center text-sm text-gray-400" style={{ backgroundColor: '#5B2C6F' }}>
          <p className="text-white/60">江苏省丹阳高级中学 版权所有</p>
        </footer>
      </main>
    </div>
  );
}
