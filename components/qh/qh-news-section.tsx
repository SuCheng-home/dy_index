'use client';

import { Newspaper } from 'lucide-react';

export function QhNewsSection() {
  const mainNews = {
    title: '学校入选全国党建工作示范校',
    date: '2024年04月15日',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    excerpt:
      '近日，我校被中共中央组织部、教育部党组联合评定为"全国中小学党建工作示范校"，这是对我校党建工作的充分肯定。',
  };

  const newsList = [
    {
      title: '高考成绩创新高，多人进入名校',
      date: '2024年07月10日',
      image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=300&fit=crop',
    },
    {
      title: '学生在全国学科竞赛中斩获多项大奖',
      date: '2024年06月20日',
      image: 'https://images.unsplash.com/photo-1427504494785-cdfa56b47e37?w=600&h=300&fit=crop',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto py-20 px-8 relative">
      {/* 背景图 */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1427504494785-cdfa56b47e37?w=1920&h=1080&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10">
        {/* 模块标题 */}
        <div className="flex items-center gap-3 mb-10">
          <Newspaper size={32} style={{ color: '#19376D' }} />
          <h3 className="font-serif text-3xl font-bold text-[#121212]">新闻</h3>
          <span className="text-sm text-[#666666]">News</span>
        </div>

        {/* 内容网格 */}
        <div className="grid grid-cols-12 gap-8">
          {/* 左栏头条 - 7 列 */}
          <div className="col-span-12 lg:col-span-7 h-full">
            <div className="rounded-3xl border border-[#19376D]/20 overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
              {/* 图片 */}
              <div className="relative w-full h-96 overflow-hidden bg-gradient-to-br from-[#19376D] to-[#2C5AA0]">
                <img
                  src={mainNews.image}
                  alt={mainNews.title}
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                />
              </div>

              {/* 内容 */}
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-px" style={{ backgroundColor: '#19376D' }} />
                  <p className="text-sm text-[#666666]">{mainNews.date}</p>
                </div>

                <h4 className="font-serif font-bold text-2xl text-[#121212] mb-4 line-clamp-2">
                  {mainNews.title}
                </h4>

                <p className="text-[#333333] text-base leading-relaxed flex-1">
                  {mainNews.excerpt}
                </p>

                <button className="mt-6 inline-block px-6 py-2 rounded-lg border border-[#19376D] text-[#19376D] font-medium hover:bg-[#19376D] hover:text-white transition-colors duration-300">
                  查看详情
                </button>
              </div>
            </div>
          </div>

          {/* 右栏列表 - 5 列 */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            {newsList.map((news, index) => (
              <div
                key={index}
                className="rounded-3xl border border-[#19376D]/20 overflow-hidden bg-white/80 backdrop-blur-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* 图片 */}
                <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-[#19376D] to-[#2C5AA0]">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>

                {/* 内容 */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-px" style={{ backgroundColor: '#19376D' }} />
                    <p className="text-xs text-[#666666]">{news.date}</p>
                  </div>

                  <h4 className="font-serif font-bold text-lg text-[#121212] line-clamp-2">
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
