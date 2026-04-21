'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, ArrowRight, Calendar, Tag } from 'lucide-react';
import Image from 'next/image';
import type { NewsItem } from '@/app/qh/page';

interface QhNewsSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewsClick?: (news: NewsItem) => void;
}

export function QhNewsSearchModal({ isOpen, onClose, onNewsClick }: QhNewsSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchResults, setSearchResults] = useState<NewsItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const categories = ['全部', '校园动态', '党建工作', '教学教研', '学生活动', '通知公告'];

  const hotSearches = ['招生报名', '高考成绩', '党建示范', '学科竞赛', '校园开放日'];

  const recentSearches = ['2026年招生', '百日誓师', '教师节'];

  // 模拟新闻数据
  const allNews: NewsItem[] = [
    {
      id: '1',
      title: '学校入选全国党建工作示范校',
      date: '2026-04-15',
      category: '党建工作',
      image: '/qh/news-main.jpg',
      excerpt: '近日，我校被中共中央组织部、教育部党组联合评定为"全国中小学党建工作示范校"。',
      content: '近日，我校被中共中央组织部、教育部党组联合评定为"全国中小学党建工作示范校"，这是对我校党建工作的充分肯定，也是全校师生共同努力的成果。学校将以此为契机，继续加强党的建设，推动学校各项事业高质量发展。'
    },
    {
      id: '2',
      title: '2026年春季招生报名已开始',
      date: '2026-04-12',
      category: '通知公告',
      image: '/qh/campus-landmark.jpg',
      excerpt: '欢迎广大学生家长咨询报名，咨询电话：0511-86522062',
      content: '2026年春季招生报名工作正式启动。学校将继续秉承"立德树人、笃学创新"的办学理念，为广大学子提供优质的教育资源。欢迎有志青年报考我校，共同书写美好未来。'
    },
    {
      id: '3',
      title: '高考百日誓师大会隆重举行',
      date: '2026-04-10',
      category: '学生活动',
      image: '/qh/news-exam.jpg',
      excerpt: '高三全体师生齐聚操场，为即将到来的高考加油助威。',
      content: '在距离2026年高考100天之际，我校隆重举行高考百日誓师大会。高三全体师生齐聚操场，共同见证这一激动人心的时刻。校长发表了热情洋溢的动员讲话，勉励同学们珍惜时间，奋力拼搏。'
    },
    {
      id: '4',
      title: '学生在全国学科竞赛中斩获多项大奖',
      date: '2026-04-08',
      category: '教学教研',
      image: '/qh/news-competition.jpg',
      excerpt: '我校学子在全国物理、化学、生物等学科竞赛中表现优异。',
      content: '在近期举行的全国中学生学科竞赛中，我校学子表现出色，共获得省级以上奖项23项，其中全国一等奖3项。这些成绩的取得，充分展示了我校在拔尖创新人才培养方面的丰硕成果。'
    },
    {
      id: '5',
      title: '校园安全教育周启动',
      date: '2026-04-05',
      category: '校园动态',
      image: '/qh/hero-bg.jpg',
      excerpt: '为深化平安校园建设，学校组织全校师生开展安全教育专题活动。',
      content: '为进一步增强师生的安全意识，提高自我保护能力，学校启动了校园安全教育周活动。活动期间将开展消防演练、应急疏散、安全知识讲座等系列活动。'
    },
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      // 模拟搜索延迟
      const timer = setTimeout(() => {
        const results = allNews.filter(news => {
          const matchQuery = news.title.includes(searchQuery) || news.excerpt?.includes(searchQuery);
          const matchCategory = activeCategory === '全部' || news.category === activeCategory;
          return matchQuery && matchCategory;
        });
        setSearchResults(results);
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      const results = activeCategory === '全部' 
        ? allNews 
        : allNews.filter(news => news.category === activeCategory);
      setSearchResults(results);
    }
  }, [searchQuery, activeCategory]);

  const handleNewsClick = (news: NewsItem) => {
    onNewsClick?.(news);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center pt-20 px-4">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        onClick={onClose}
      />

      {/* 搜索面板 */}
      <div 
        className="relative w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300"
        style={{ backgroundColor: '#fff' }}
      >
        {/* 搜索头部 */}
        <div className="p-6 pb-4" style={{ backgroundColor: '#5B2C6F' }}>
          {/* 关闭按钮 */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <X size={24} />
          </button>

          {/* 标题 */}
          <h2 className="text-white font-serif font-bold text-xl mb-4">新闻查询</h2>

          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="输入关键词搜索新闻..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-base outline-none transition-all duration-300 focus:ring-2 focus:ring-[#5B2C6F]"
              style={{ backgroundColor: '#fff' }}
            />
          </div>

          {/* 分类标签 */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-white text-[#5B2C6F]'
                    : 'bg-white/20 text-white/90 hover:bg-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 搜索内容区 */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* 无搜索词时显示热门搜索和历史 */}
          {!searchQuery.trim() && searchResults.length === 0 && (
            <div className="flex flex-col gap-6">
              {/* 热门搜索 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={16} style={{ color: '#C8102E' }} />
                  <span className="text-sm font-medium" style={{ color: '#333' }}>热门搜索</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hotSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-4 py-2 rounded-full text-sm transition-all duration-300 hover:shadow-md"
                      style={{ 
                        backgroundColor: 'rgba(91, 44, 111, 0.06)',
                        color: '#333'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(91, 44, 111, 0.12)';
                        e.currentTarget.style.color = '#5B2C6F';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(91, 44, 111, 0.06)';
                        e.currentTarget.style.color = '#333';
                      }}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* 最近搜索 */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={16} style={{ color: '#666' }} />
                    <span className="text-sm font-medium" style={{ color: '#333' }}>最近搜索</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="px-4 py-2 rounded-full text-sm border transition-all duration-300"
                  style={{ 
                    borderColor: 'rgba(91, 44, 111, 0.2)',
                    color: '#666'
                  }}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 搜索结果 */}
          {(searchQuery.trim() || activeCategory !== '全部') && (
            <div>
              {isSearching ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[#5B2C6F] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : searchResults.length > 0 ? (
                <div className="flex flex-col gap-4">
                  <p className="text-sm" style={{ color: '#666' }}>
                    找到 <span style={{ color: '#5B2C6F' }} className="font-medium">{searchResults.length}</span> 条相关新闻
                  </p>
                  {searchResults.map((news) => (
                    <button
                      key={news.id}
                      onClick={() => handleNewsClick(news)}
                      className="flex gap-4 p-4 rounded-2xl text-left transition-all duration-300 hover:shadow-lg group"
                      style={{ backgroundColor: 'rgba(91, 44, 111, 0.03)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(91, 44, 111, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(91, 44, 111, 0.03)';
                      }}
                    >
                      {/* 图片 */}
                      {news.image && (
                        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                          <Image
                            src={news.image}
                            alt={news.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                      )}
                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span 
                            className="px-2 py-0.5 rounded text-xs"
                            style={{ backgroundColor: 'rgba(200, 16, 46, 0.1)', color: '#C8102E' }}
                          >
                            {news.category}
                          </span>
                          <span className="text-xs flex items-center gap-1" style={{ color: '#999' }}>
                            <Calendar size={12} />
                            {news.date}
                          </span>
                        </div>
                        <h4 
                          className="font-medium line-clamp-1 mb-1 group-hover:text-[#5B2C6F] transition-colors duration-300"
                          style={{ color: '#121212' }}
                        >
                          {news.title}
                        </h4>
                        <p className="text-sm line-clamp-2" style={{ color: '#666' }}>
                          {news.excerpt}
                        </p>
                      </div>
                      {/* 箭头 */}
                      <ArrowRight 
                        size={20} 
                        className="flex-shrink-0 self-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                        style={{ color: '#5B2C6F' }}
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: 'rgba(91, 44, 111, 0.06)' }}
                  >
                    <Search size={24} style={{ color: '#999' }} />
                  </div>
                  <p style={{ color: '#666' }}>未找到相关新闻</p>
                  <p className="text-sm mt-1" style={{ color: '#999' }}>请尝试其他关键词</p>
                </div>
              )}
            </div>
          )}

          {/* 默认显示最新新闻 */}
          {!searchQuery.trim() && activeCategory === '全部' && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={16} style={{ color: '#5B2C6F' }} />
                <span className="text-sm font-medium" style={{ color: '#333' }}>最新新闻</span>
              </div>
              <div className="flex flex-col gap-3">
                {allNews.slice(0, 5).map((news) => (
                  <button
                    key={news.id}
                    onClick={() => handleNewsClick(news)}
                    className="flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-300 group"
                    style={{ backgroundColor: 'rgba(91, 44, 111, 0.03)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(91, 44, 111, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(91, 44, 111, 0.03)';
                    }}
                  >
                    <span 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: '#5B2C6F', color: '#fff' }}
                    >
                      {news.date.split('-')[2]}
                    </span>
                    <span 
                      className="flex-1 line-clamp-1 group-hover:text-[#5B2C6F] transition-colors duration-300"
                      style={{ color: '#333' }}
                    >
                      {news.title}
                    </span>
                    <span className="text-xs" style={{ color: '#999' }}>{news.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
