'use client';

import Image from 'next/image';
import { Newspaper } from 'lucide-react';

export function QhNewsSection() {
  const mainNews = {
    title: '学校入选全国党建工作示范校',
    date: '2024年04月15日',
    image: '/qh/news-main.jpg',
    excerpt:
      '近日，我校被中共中央组织部、教育部党组联合评定为"全国中小学党建工作示范校"，这是对我校党建工作的充分肯定，也是全校师生共同努力的成果。',
  };

  const newsList = [
    {
      title: '高考成绩再创新高，多名学子进入双一流名校',
      date: '2024年07月10日',
      image: '/qh/news-exam.jpg',
    },
    {
      title: '学生在全国学科竞赛中斩获多项大奖',
      date: '2024年06月20日',
      image: '/qh/news-competition.jpg',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto py-20 px-8 relative">
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
        <div className="flex items-center gap-2 mb-10">
          <Newspaper size={32} style={{ color: '#19376D' }} />
          <h3 className="font-serif text-3xl font-bold" style={{ color: '#121212' }}>
            新闻
          </h3>
          <span className="text-sm" style={{ color: '#666666' }}>
            News
          </span>
        </div>

        {/* 内容网格 - 非对称 7:5 */}
        <div className="grid grid-cols-12 gap-8">
          {/* 左栏头条 - 7 列 */}
          <div className="col-span-12 lg:col-span-7 h-full">
            <div className="rounded-2xl border overflow-hidden backdrop-blur-sm h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1" style={{ borderColor: 'rgba(25, 55, 109, 0.2)', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
              {/* 图片 */}
              <div className="relative w-full h-96 overflow-hidden">
                <Image
                  src={mainNews.image}
                  alt={mainNews.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* 内容 */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-px" style={{ backgroundColor: '#19376D' }} />
                  <p className="text-sm" style={{ color: '#666666' }}>
                    {mainNews.date}
                  </p>
                </div>

                <h4
                  className="font-serif font-bold text-xl mb-3 line-clamp-2"
                  style={{ color: '#121212' }}
                >
                  {mainNews.title}
                </h4>

                <p
                  className="text-base leading-relaxed flex-1"
                  style={{ color: '#666666' }}
                >
                  {mainNews.excerpt}
                </p>

                <button
                  className="mt-6 inline-block self-start px-6 py-2 rounded-lg border font-medium transition-colors duration-300 hover:text-white"
                  style={{
                    borderColor: '#19376D',
                    color: '#19376D',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#19376D';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#19376D';
                  }}
                >
                  查看详情
                </button>
              </div>
            </div>
          </div>

          {/* 右栏列表 - 5 列 */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
            {newsList.map((news, index) => (
              <div
                key={index}
                className="rounded-2xl border overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{
                  borderColor: 'rgba(25, 55, 109, 0.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                {/* 图片 */}
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* 内容 */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-6 h-px"
                      style={{ backgroundColor: '#19376D' }}
                    />
                    <p className="text-xs" style={{ color: '#666666' }}>
                      {news.date}
                    </p>
                  </div>

                  <h4
                    className="font-serif font-bold text-lg line-clamp-2"
                    style={{ color: '#121212' }}
                  >
                    {news.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
