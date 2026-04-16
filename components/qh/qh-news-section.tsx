'use client';

import Image from 'next/image';
import { Newspaper, ArrowRight, Calendar } from 'lucide-react';
import type { NewsItem } from '@/app/qh/page';

interface QhNewsSectionProps {
  onNewsClick?: (news: NewsItem) => void;
}

export function QhNewsSection({ onNewsClick }: QhNewsSectionProps) {
  const mainNews: NewsItem = {
    id: '1',
    title: '学校入选全国党建工作示范校',
    date: '2026-04-15',
    category: '党建工作',
    image: '/qh/news-main.jpg',
    excerpt: '近日，我校被中共中央组织部、教育部党组联合评定为"全国中小学党建工作示范校"，这是对我校党建工作的充分肯定，也是全校师生共同努力的成果。',
    content: '近日，我校被中共中央组织部、教育部党组联合评定为"全国中小学党建工作示范校"，这是对我校党建工作的充分肯定，也是全校师生共同努力的成果。学校将以此为契机，继续加强党的建设，推动学校各项事业高质量发展。'
  };

  const newsList: NewsItem[] = [
    {
      id: '4',
      title: '高考成绩再创新高，多名学子进入双一流名校',
      date: '2026-04-10',
      category: '教学教研',
      image: '/qh/news-exam.jpg',
      excerpt: '在2026年高考中，我校学子表现优异，本科上线率再创新高。',
      content: '在2026年高考中，我校学子表现优异，一本上线率达到92%，多名学子被北京大学、清华大学、复旦大学等顶尖高校录取。这一成绩充分展示了我校在教育教学方面的丰硕成果。'
    },
    {
      id: '5',
      title: '学生在全国学科竞赛中斩获多项大奖',
      date: '2026-04-08',
      category: '学生活动',
      image: '/qh/news-competition.jpg',
      excerpt: '我校学子在全国物理、化学、生物等学科竞赛中表现优异。',
      content: '在近期举行的全国中学生学科竞赛中，我校学子表现出色，共获得省级以上奖项23项，其中全国一等奖3项。'
    },
  ];

  return (
    <section className="max-w-7xl mx-auto py-20 px-6 lg:px-8 relative">
      {/* 背景底图 */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <Image
          src="/qh/hero-bg.jpg"
          alt=""
          fill
          className="object-cover"
          loading="lazy"
        />
      </div>

      <div className="relative z-10">
        {/* 模块标题 */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Newspaper size={32} style={{ color: '#19376D' }} />
            <div>
              <h3 className="font-serif text-3xl font-bold" style={{ color: '#121212' }}>
                新闻动态
              </h3>
              <span className="text-sm" style={{ color: '#666666' }}>
                News & Events
              </span>
            </div>
          </div>
          <button 
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-md"
            style={{ 
              backgroundColor: 'rgba(25, 55, 109, 0.08)',
              color: '#19376D'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#19376D';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(25, 55, 109, 0.08)';
              e.currentTarget.style.color = '#19376D';
            }}
          >
            查看全部
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 内容网格 - 非对称 7:5 */}
        <div className="grid grid-cols-12 gap-8">
          {/* 左栏头条 - 7 列 */}
          <div className="col-span-12 lg:col-span-7 h-full">
            <button 
              onClick={() => onNewsClick?.(mainNews)}
              className="w-full rounded-2xl border overflow-hidden backdrop-blur-sm h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left group" 
              style={{ borderColor: 'rgba(25, 55, 109, 0.15)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
            >
              {/* 图片 */}
              <div className="relative w-full h-80 overflow-hidden">
                <Image
                  src={mainNews.image!}
                  alt={mainNews.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {/* 分类标签 */}
                <div 
                  className="absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ backgroundColor: 'rgba(200, 16, 46, 0.9)', color: '#fff' }}
                >
                  {mainNews.category}
                </div>
              </div>

              {/* 内容 */}
              <div className="p-6 flex flex-col flex-1">
                {/* 日期 */}
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={14} style={{ color: '#19376D' }} />
                  <p className="text-sm" style={{ color: '#666666' }}>
                    {mainNews.date}
                  </p>
                </div>

                <h4
                  className="font-serif font-bold text-xl mb-3 line-clamp-2 group-hover:text-[#19376D] transition-colors duration-300"
                  style={{ color: '#121212' }}
                >
                  {mainNews.title}
                </h4>

                <p
                  className="text-base leading-relaxed flex-1 line-clamp-3"
                  style={{ color: '#666666' }}
                >
                  {mainNews.excerpt}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-medium" style={{ color: '#19376D' }}>
                  阅读全文
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          </div>

          {/* 右栏列表 - 5 列 */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            {newsList.map((news) => (
              <button
                key={news.id}
                onClick={() => onNewsClick?.(news)}
                className="w-full rounded-2xl border overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-left group"
                style={{
                  borderColor: 'rgba(25, 55, 109, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                {/* 图片 */}
                <div className="relative w-full h-44 overflow-hidden">
                  <Image
                    src={news.image!}
                    alt={news.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* 分类标签 */}
                  <div 
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-medium"
                    style={{ backgroundColor: 'rgba(25, 55, 109, 0.9)', color: '#fff' }}
                  >
                    {news.category}
                  </div>
                </div>

                {/* 内容 */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={12} style={{ color: '#999' }} />
                    <p className="text-xs" style={{ color: '#666666' }}>
                      {news.date}
                    </p>
                  </div>

                  <h4
                    className="font-serif font-bold text-base line-clamp-2 group-hover:text-[#19376D] transition-colors duration-300"
                    style={{ color: '#121212' }}
                  >
                    {news.title}
                  </h4>
                </div>
              </button>
            ))}

            {/* 更多新闻按钮 - 移动端显示 */}
            <button 
              className="md:hidden flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-medium transition-all duration-300"
              style={{ 
                backgroundColor: 'rgba(25, 55, 109, 0.08)',
                color: '#19376D'
              }}
            >
              查看更多新闻
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
