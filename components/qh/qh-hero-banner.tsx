'use client';

import Image from 'next/image';
import { ChevronDown, ArrowRight } from 'lucide-react';
import type { NewsItem } from '@/app/qh/page';

interface QhHeroBannerProps {
  onNewsClick?: (news: NewsItem) => void;
}

export function QhHeroBanner({ onNewsClick }: QhHeroBannerProps) {
  const quickNews: NewsItem[] = [
    { 
      id: '1',
      title: '学校入选全国党建工作示范校', 
      date: '2026-04-15',
      category: '党建工作',
      image: '/qh/news-main.jpg',
      excerpt: '近日，我校被中共中央组织部、教育部党组联合评定为"全国中小学党建工作示范校"。',
      content: '近日，我校被中共中央组织部、教育部党组联合评定为"全国中小学党建工作示范校"，这是对我校党建工作的充分肯定，也是全校师生共同努力的成果。'
    },
    { 
      id: '2',
      title: '2026年春季招生报名已开始', 
      date: '2026-04-12',
      category: '通知公告',
      image: '/qh/campus-landmark.jpg',
      excerpt: '欢迎广大学生家长咨询报名，咨询电话：0511-86522062',
      content: '2026年春季招生报名工作正式启动。学校将继续秉承"立德树人、笃学创新"的办学理念，为广大学子提供优质的教育资源。'
    },
    { 
      id: '3',
      title: '高考百日誓师大会隆重举行', 
      date: '2026-04-10',
      category: '学生活动',
      image: '/qh/news-exam.jpg',
      excerpt: '高三全体师生齐聚操场，为即将到来的高考加油助威。',
      content: '在距离2026年高考100天之际，我校隆重举行高考百日誓师大会。高三全体师生齐聚操场，共同见证这一激动人心的时刻。'
    },
  ];

  return (
    <section className="w-full min-h-screen relative overflow-hidden pt-20">
      {/* 背景图层 - 校园实景 */}
      <Image
        src="/qh/hero-bg.jpg"
        alt="江苏省丹阳高级中学校园全景"
        fill
        className="object-cover"
        priority
      />

      {/* 渐变覆盖层 - 从底部深色到顶部透明 */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(25, 55, 109, 0.95) 0%, rgba(25, 55, 109, 0.7) 40%, rgba(25, 55, 109, 0.3) 100%)',
        }}
      />

      {/* 不规则裁切装饰 - 曲线效果 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        <svg viewBox="0 0 1440 120" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,120 L0,120 Z"
            fill="#F8F9FB"
          />
        </svg>
      </div>

      {/* 主内容区 - 非对称布局 */}
      <div className="relative z-10 min-h-[calc(100vh-5rem)] flex items-end pb-48">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid grid-cols-12 gap-8 items-end">
            {/* 左侧主标题区 - 占 7 列 */}
            <div className="col-span-12 lg:col-span-7">
              {/* 日期徽章 */}
              <div className="inline-flex items-center gap-3 mb-6">
                <div 
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{ backgroundColor: 'rgba(184, 134, 11, 0.9)', color: '#fff' }}
                >
                  2026年04月
                </div>
                <div className="w-12 h-px bg-white/50" />
              </div>

              {/* 主标题 */}
              <h2 className="font-serif font-bold text-white mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: '1.1' }}>
                立德树人
                <br />
                <span style={{ color: '#B8860B' }}>笃学创新</span>
              </h2>

              {/* 副标题 */}
              <p className="text-white/80 text-lg max-w-md leading-relaxed mb-8">
                江苏省四星级公办重点中学，培养德智体美劳全面发展的社会主义建设者和接班人
              </p>

              {/* 快捷操作按钮 */}
              <div className="flex flex-wrap gap-4">
                <button 
                  className="px-6 py-3 rounded-full font-medium text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
                  style={{ backgroundColor: '#B8860B' }}
                >
                  了解更多
                </button>
                <button 
                  className="px-6 py-3 rounded-full font-medium transition-all duration-300 hover:bg-white/20"
                  style={{ 
                    border: '2px solid rgba(255,255,255,0.5)', 
                    color: '#fff' 
                  }}
                >
                  招生咨询
                </button>
              </div>
            </div>

            {/* 右侧浮动卡片 - 占 5 列，悬浮效果 */}
            <div className="col-span-12 lg:col-span-5 lg:-mb-24 relative">
              <div 
                className="rounded-3xl p-6 backdrop-blur-md shadow-2xl border border-white/10"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
              >
                {/* 卡片标题 */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#C8102E' }} />
                    <h3 className="font-serif font-bold text-lg" style={{ color: '#121212' }}>校园快讯</h3>
                  </div>
                  <button 
                    className="text-xs flex items-center gap-1 transition-colors duration-300"
                    style={{ color: '#666' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#19376D'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#666'; }}
                  >
                    更多 <ArrowRight size={12} />
                  </button>
                </div>

                {/* 快讯列表 */}
                <div className="flex flex-col gap-3">
                  {quickNews.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onNewsClick?.(item)}
                      className="flex items-start gap-4 group p-3 -mx-3 rounded-xl hover:bg-gray-50 transition-all duration-300 text-left"
                    >
                      {/* 日期徽章 */}
                      <div 
                        className="flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105"
                        style={{ backgroundColor: 'rgba(25, 55, 109, 0.08)' }}
                      >
                        <span className="text-xs font-medium" style={{ color: '#666' }}>04月</span>
                        <span className="text-xl font-bold" style={{ color: '#19376D' }}>{item.date.split('-')[2]}</span>
                      </div>
                      {/* 标题 */}
                      <div className="flex-1 pt-1">
                        <p 
                          className="font-medium group-hover:text-[#19376D] transition-colors duration-300 line-clamp-2"
                          style={{ color: '#333' }}
                        >
                          {item.title}
                        </p>
                        <span 
                          className="text-xs mt-1 inline-block"
                          style={{ color: '#999' }}
                        >
                          {item.category}
                        </span>
                      </div>
                      {/* 箭头 */}
                      <ArrowRight 
                        size={16} 
                        className="flex-shrink-0 mt-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                        style={{ color: '#19376D' }}
                      />
                    </button>
                  ))}
                </div>

                {/* 查看更多 */}
                <button 
                  className="mt-4 w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#19376D', color: '#fff' }}
                >
                  查看全部新闻
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部滚动提示 */}
      <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/60 text-xs">向下滚动</span>
        <ChevronDown size={20} className="text-white/60" />
      </div>
    </section>
  );
}
