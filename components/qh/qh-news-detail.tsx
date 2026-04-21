'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X, Calendar, Tag, Share2, Printer, ChevronLeft, ChevronRight, Eye, ThumbsUp } from 'lucide-react';
import type { NewsItem } from '@/app/qh/page';

interface QhNewsDetailProps {
  news: NewsItem | null;
  onClose: () => void;
}

export function QhNewsDetail({ news, onClose }: QhNewsDetailProps) {
  // 阻止背景滚动
  useEffect(() => {
    if (news) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [news]);

  // ESC 键关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!news) return null;

  // 模拟相关新闻
  const relatedNews = [
    { id: '101', title: '学校召开2026年春季学期工作部署会', date: '2026-04-14' },
    { id: '102', title: '我校教师在省级教学比赛中获奖', date: '2026-04-11' },
    { id: '103', title: '校园文化艺术节精彩纷呈', date: '2026-04-09' },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.excerpt,
        url: window.location.href,
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 backdrop-blur-md"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        onClick={onClose}
      />

      {/* 详情面板 */}
      <div 
        className="relative w-full max-w-4xl h-[90vh] mx-4 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300"
        style={{ backgroundColor: '#fff' }}
      >
        {/* 顶部工具栏 */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ borderColor: 'rgba(25, 55, 109, 0.1)' }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="flex items-center gap-1 text-sm font-medium transition-colors duration-300"
              style={{ color: '#666' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#19376D'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#666'; }}
            >
              <ChevronLeft size={18} />
              返回
            </button>
            <div className="w-px h-4" style={{ backgroundColor: 'rgba(25, 55, 109, 0.2)' }} />
            <span className="text-sm" style={{ color: '#999' }}>新闻详情</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
              style={{ backgroundColor: 'rgba(25, 55, 109, 0.06)' }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.backgroundColor = 'rgba(25, 55, 109, 0.12)'; 
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.backgroundColor = 'rgba(25, 55, 109, 0.06)'; 
              }}
              title="分享"
            >
              <Share2 size={16} style={{ color: '#19376D' }} />
            </button>
            <button
              onClick={handlePrint}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
              style={{ backgroundColor: 'rgba(25, 55, 109, 0.06)' }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.backgroundColor = 'rgba(25, 55, 109, 0.12)'; 
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.backgroundColor = 'rgba(25, 55, 109, 0.06)'; 
              }}
              title="打印"
            >
              <Printer size={16} style={{ color: '#19376D' }} />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
              style={{ backgroundColor: 'rgba(25, 55, 109, 0.06)' }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.backgroundColor = 'rgba(200, 16, 46, 0.1)'; 
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.backgroundColor = 'rgba(25, 55, 109, 0.06)'; 
              }}
              title="关闭"
            >
              <X size={16} style={{ color: '#666' }} />
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8">
            {/* 文章头部 */}
            <header className="mb-8">
              {/* 分类标签 */}
              <div className="flex items-center gap-2 mb-4">
                <span 
                  className="px-3 py-1 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: 'rgba(200, 16, 46, 0.1)', color: '#C8102E' }}
                >
                  <Tag size={12} className="inline mr-1" />
                  {news.category}
                </span>
              </div>

              {/* 标题 */}
              <h1 
                className="font-serif font-bold text-3xl md:text-4xl leading-tight mb-6"
                style={{ color: '#121212' }}
              >
                {news.title}
              </h1>

              {/* 元信息 */}
              <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: '#666' }}>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {news.date}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={14} />
                  阅读 1,234
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp size={14} />
                  点赞 56
                </span>
              </div>
            </header>

            {/* 封面图 */}
            {news.image && (
              <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* 正文内容 */}
            <article 
              className="prose prose-lg max-w-none mb-12"
              style={{ color: '#333' }}
            >
              <p className="text-lg leading-relaxed mb-6" style={{ color: '#444' }}>
                {news.excerpt}
              </p>
              
              <p className="leading-relaxed mb-4">
                {news.content || '近日，我校在教育教学、党建工作、学生发展等方面取得了显著成绩，获得了社会各界的广泛关注和高度评价。学校将继续秉承"立德树人、笃学创新"的办学理念，为培养德智体美劳全面发展的社会主义建设者和接班人而不懈努力。'}
              </p>

              <p className="leading-relaxed mb-4">
                学校领导表示，这一荣誉的获得离不开全校师生的共同努力和社会各界的大力支持。未来，学校将继续深入贯彻党的教育方针，坚持五育并举，全面提升办学水平，为办好人民满意的教育作出新的更大贡献。
              </p>

              <p className="leading-relaxed mb-4">
                据悉，学校还将围绕这一主题开展系列活动，包括专题讲座、成果展示、交流研讨等，进一步扩大影响，发挥示范引领作用。欢迎广大师生、家长和社会各界人士积极参与，共同见证学校的发展进步。
              </p>
            </article>

            {/* 互动按钮 */}
            <div className="flex items-center gap-4 mb-12 pb-8 border-b" style={{ borderColor: 'rgba(25, 55, 109, 0.1)' }}>
              <button
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-md"
                style={{ backgroundColor: 'rgba(25, 55, 109, 0.08)', color: '#19376D' }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.backgroundColor = '#19376D'; 
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.backgroundColor = 'rgba(25, 55, 109, 0.08)'; 
                  e.currentTarget.style.color = '#19376D';
                }}
              >
                <ThumbsUp size={18} />
                点赞
              </button>
              <button
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-md"
                style={{ backgroundColor: 'rgba(25, 55, 109, 0.08)', color: '#19376D' }}
                onClick={handleShare}
              >
                <Share2 size={18} />
                分享
              </button>
            </div>

            {/* 相关新闻 */}
            <div>
              <h3 className="font-serif font-bold text-xl mb-4" style={{ color: '#121212' }}>
                相关新闻
              </h3>
              <div className="flex flex-col gap-3">
                {relatedNews.map((item) => (
                  <button
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-xl text-left transition-all duration-300 group"
                    style={{ backgroundColor: 'rgba(25, 55, 109, 0.04)' }}
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.backgroundColor = 'rgba(25, 55, 109, 0.08)'; 
                    }}
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.backgroundColor = 'rgba(25, 55, 109, 0.04)'; 
                    }}
                  >
                    <div className="flex-1">
                      <p 
                        className="font-medium group-hover:text-[#19376D] transition-colors duration-300 line-clamp-1"
                        style={{ color: '#333' }}
                      >
                        {item.title}
                      </p>
                      <p className="text-xs mt-1" style={{ color: '#999' }}>{item.date}</p>
                    </div>
                    <ChevronRight 
                      size={18} 
                      className="flex-shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                      style={{ color: '#19376D' }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 底部上下篇导航 */}
        <div 
          className="flex-shrink-0 border-t grid grid-cols-2"
          style={{ borderColor: 'rgba(25, 55, 109, 0.1)' }}
        >
          <button
            className="flex items-center gap-3 px-6 py-4 text-left transition-colors duration-300 border-r"
            style={{ borderColor: 'rgba(25, 55, 109, 0.1)' }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.backgroundColor = 'rgba(25, 55, 109, 0.04)'; 
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.backgroundColor = 'transparent'; 
            }}
          >
            <ChevronLeft size={20} style={{ color: '#19376D' }} />
            <div className="min-w-0">
              <p className="text-xs mb-1" style={{ color: '#999' }}>上一篇</p>
              <p className="text-sm font-medium line-clamp-1" style={{ color: '#333' }}>
                学校召开2026年春季学期工作部署会
              </p>
            </div>
          </button>
          <button
            className="flex items-center justify-end gap-3 px-6 py-4 text-right transition-colors duration-300"
            onMouseEnter={(e) => { 
              e.currentTarget.style.backgroundColor = 'rgba(25, 55, 109, 0.04)'; 
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.backgroundColor = 'transparent'; 
            }}
          >
            <div className="min-w-0">
              <p className="text-xs mb-1" style={{ color: '#999' }}>下一篇</p>
              <p className="text-sm font-medium line-clamp-1" style={{ color: '#333' }}>
                我校教师在省级教学比赛中获奖
              </p>
            </div>
            <ChevronRight size={20} style={{ color: '#19376D' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
