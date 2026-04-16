'use client';

import Image from 'next/image';
import { Search, ChevronDown } from 'lucide-react';

interface QhHeroBannerProps {
  onSearchClick?: () => void;
}

export function QhHeroBanner({ onSearchClick }: QhHeroBannerProps) {
  const navItems = [
    '校园信息',
    '党建工作',
    '德育之窗',
    '教学管理',
    '教师发展',
    '统群工作',
    '校园服务',
    '国际教育',
  ];

  return (
    <section className="w-full min-h-screen relative overflow-hidden">
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

      {/* 顶部导航栏 - 杂志风格简约导航 */}
      <nav className="absolute top-0 left-0 right-0 z-30 px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* 左侧品牌 */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #B8860B 0%, #8B6914 100%)',
              }}
            >
              丹
            </div>
            <div className="text-white">
              <h1 className="font-serif font-bold text-lg tracking-wide">江苏省丹阳高级中学</h1>
              <p className="text-xs opacity-70 tracking-widest">JIANGSU DANYANG SENIOR HIGH SCHOOL</p>
            </div>
          </div>

          {/* 中间导航 */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="text-white/80 text-sm font-medium hover:text-white transition-colors duration-300 relative group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#B8860B] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* 右侧搜索按钮 */}
          <button
            onClick={onSearchClick}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <Search size={18} />
            <span className="text-sm hidden md:inline">搜索</span>
          </button>
        </div>
      </nav>

      {/* 主内容区 - 非对称布局 */}
      <div className="relative z-10 h-screen flex items-end pb-48">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="grid grid-cols-12 gap-8 items-end">
            {/* 左侧主标题区 - 占 7 列 */}
            <div className="col-span-12 lg:col-span-7">
              {/* 日期徽章 */}
              <div className="inline-flex items-center gap-2 mb-6">
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
              <p className="text-white/80 text-lg max-w-md leading-relaxed">
                江苏省四星级公办重点中学，培养德智体美劳全面发展的社会主义建设者和接班人
              </p>
            </div>

            {/* 右侧浮动卡片 - 占 5 列，悬浮效果 */}
            <div className="col-span-12 lg:col-span-5 lg:-mb-24 relative">
              <div 
                className="rounded-3xl p-8 backdrop-blur-md shadow-2xl border border-white/10"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
              >
                {/* 卡片标题 */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#C8102E' }} />
                  <h3 className="font-serif font-bold text-lg" style={{ color: '#121212' }}>校园快讯</h3>
                </div>

                {/* 快讯列表 */}
                <div className="flex flex-col gap-4">
                  {[
                    { date: '04-15', title: '学校入选全国党建工作示范校' },
                    { date: '04-12', title: '2026年春季招生报名已开始' },
                    { date: '04-10', title: '高考百日誓师大会隆重举行' },
                  ].map((item, index) => (
                    <a
                      key={index}
                      href="#"
                      className="flex items-start gap-4 group p-3 -mx-3 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    >
                      {/* 日期徽章 */}
                      <div 
                        className="flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center"
                        style={{ backgroundColor: 'rgba(25, 55, 109, 0.08)' }}
                      >
                        <span className="text-xs font-medium" style={{ color: '#666' }}>04月</span>
                        <span className="text-xl font-bold" style={{ color: '#19376D' }}>{item.date.split('-')[1]}</span>
                      </div>
                      {/* 标题 */}
                      <p 
                        className="flex-1 font-medium pt-2 group-hover:text-[#19376D] transition-colors duration-300 line-clamp-2"
                        style={{ color: '#333' }}
                      >
                        {item.title}
                      </p>
                    </a>
                  ))}
                </div>

                {/* 查看更多 */}
                <button 
                  className="mt-6 w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-md"
                  style={{ backgroundColor: '#19376D', color: '#fff' }}
                >
                  查看全部新闻
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
