'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Newspaper, ArrowRight } from 'lucide-react';

// 新闻数据
const mainNews = {
  id: '1',
  title: '学校入选全国党建工作示范校',
  date: '2026-04-15',
  category: '党建工作',
  image: '/qh/news-main.jpg',
  excerpt: '近日，我校被中共中央组织部、教育部党组联合评定为"全国中小学党建工作示范校"，这是对我校党建工作的充分肯定。',
};

const topNews = {
  id: '2',
  title: '举行树立和践行正确政绩观学习教育领导班子专题读书班集中学习研讨',
  date: '2026-04-13',
  category: '党建工作',
  image: '/qh/news-exam.jpg',
};

const sideNewsList = [
  { id: '3', title: '住宿部开展"螺钿生辉·匠心传美"主题活动', date: '2026-04-12', image: '/qh/news-competition.jpg' },
  { id: '4', title: '每一拍，都是成长的节拍——"班超"羽毛球联赛收官', date: '2026-04-10', image: '/qh/campus-landmark.jpg' },
];

export function QhNewsSection() {
  return (
    <section className="w-full py-16 relative" style={{ backgroundColor: '#F8F9FB' }}>
      {/* 左上角紫色装饰块 */}
      <div className="absolute top-0 left-0 w-32 h-64" style={{ backgroundColor: '#5B2C6F' }} />
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">
        {/* 模块标题 */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(91, 44, 111, 0.1)' }}>
            <Newspaper size={24} style={{ color: '#5B2C6F' }} />
          </div>
          <div className="text-center">
            <h3 className="font-serif text-3xl font-bold" style={{ color: '#121212' }}>
              新闻<span className="text-sm font-normal ml-1" style={{ color: '#E91E63' }}>News</span>动态
            </h3>
          </div>
        </div>

        {/* 杂志布局：左大右小 */}
        <div className="grid grid-cols-12 gap-6">
          {/* 左侧大新闻 - 7列 */}
          <div className="col-span-12 lg:col-span-7">
            <Link href={`/qh/news/${mainNews.id}`} className="group block">
              {/* 大图 */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                <Image
                  src={mainNews.image}
                  alt={mainNews.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* 左下角引用文字装饰 */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-4 max-w-xs">
                  <p className="text-xs text-gray-500 mb-1">AI+衔接层课程</p>
                  <p className="text-sm text-gray-700 leading-relaxed">AI赋能下的衔接课程优化实践与创新，贯通大中衔接人才培养体系。</p>
                  <div className="text-4xl font-serif mt-2" style={{ color: '#5B2C6F' }}>&ldquo;&rdquo;</div>
                </div>
              </div>
              {/* 日期+标题 */}
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-px flex-1" style={{ backgroundColor: '#5B2C6F' }} />
                  <span className="text-sm font-medium" style={{ color: '#5B2C6F' }}>{mainNews.date}</span>
                  <div className="h-px flex-1" style={{ backgroundColor: '#5B2C6F' }} />
                </div>
                <h4 className="font-serif text-xl font-bold group-hover:text-[#5B2C6F] transition-colors" style={{ color: '#121212' }}>
                  {mainNews.title}
                </h4>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{mainNews.excerpt}</p>
              </div>
            </Link>
          </div>

          {/* 右侧新闻列表 - 5列 */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            {/* 顶部大新闻 */}
            <Link href={`/qh/news/${topNews.id}`} className="group block">
              <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100">
                <Image
                  src={topNews.image}
                  alt={topNews.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-px w-8" style={{ backgroundColor: '#5B2C6F' }} />
                  <span className="text-sm font-medium" style={{ color: '#5B2C6F' }}>{topNews.date}</span>
                  <div className="h-px flex-1" style={{ backgroundColor: '#5B2C6F' }} />
                </div>
                <h4 className="font-serif text-base font-bold group-hover:text-[#5B2C6F] transition-colors line-clamp-2" style={{ color: '#121212' }}>
                  {topNews.title}
                </h4>
              </div>
            </Link>

            {/* 底部两个小新闻 */}
            <div className="grid grid-cols-2 gap-4">
              {sideNewsList.map((news) => (
                <Link href={`/qh/news/${news.id}`} key={news.id} className="group block">
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center gap-1 mb-1">
                      <div className="h-px w-4" style={{ backgroundColor: '#5B2C6F' }} />
                      <span className="text-xs" style={{ color: '#5B2C6F' }}>{news.date}</span>
                      <div className="h-px flex-1" style={{ backgroundColor: '#5B2C6F' }} />
                    </div>
                    <h4 className="text-sm font-medium group-hover:text-[#5B2C6F] transition-colors line-clamp-2" style={{ color: '#121212' }}>
                      {news.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 查看更多 */}
        <div className="flex justify-center mt-10">
          <Link 
            href="/qh/news"
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg"
            style={{ backgroundColor: '#5B2C6F', color: '#fff' }}
          >
            查看全部新闻
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
