'use client';

import Image from 'next/image';
import { Bell, ArrowRight } from 'lucide-react';
import type { NewsItem } from '@/app/qh/page';

interface QhNoticeSectionProps {
  onNewsClick?: (news: NewsItem) => void;
}

export function QhNoticeSection({ onNewsClick }: QhNoticeSectionProps) {
  const notices: NewsItem[] = [
    {
      id: 'n1',
      date: '2026-04-15',
      category: '通知公告',
      title: '2026年春季招生报名已开始',
      excerpt: '欢迎广大学生家长咨询报名，咨询电话：0511-86522062',
      content: '2026年春季招生报名工作正式启动。学校将继续秉承"立德树人、笃学创新"的办学理念，为广大学子提供优质的教育资源。欢迎有志青年报考我校。'
    },
    {
      id: 'n2',
      date: '2026-04-12',
      category: '通知公告',
      title: '校园安全教育周启动',
      excerpt: '为深化平安校园建设，学校组织全校师生开展安全教育专题活动。',
      content: '为进一步增强师生的安全意识，提高自我保护能力，学校启动了校园安全教育周活动。活动期间将开展消防演练、应急疏散、安全知识讲座等系列活动。'
    },
    {
      id: 'n3',
      date: '2026-04-10',
      category: '通知公告',
      title: '教职工体检时间安排',
      excerpt: '2026年度教职工体检定于4月20日至25日进行，请各位教职工按时参加。',
      content: '根据学校年度工作计划，2026年度教职工体检定于4月20日至25日进行。请各位教职工提前安排好工作，按时参加体检。'
    },
    {
      id: 'n4',
      date: '2026-04-08',
      category: '通知公告',
      title: '信息技术教学设备升级完成',
      excerpt: '学校成功升级计算机教室设备，为师生提供更好的教学体验。',
      content: '为提升教学质量，学校投入专项资金对计算机教室进行了全面升级改造。新设备已投入使用，将为师生提供更好的教学体验。'
    },
  ];

  const formatDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    return {
      day: parts[2],
      month: parts[1],
      year: parts[0]
    };
  };

  return (
    <section className="max-w-7xl mx-auto py-20 px-6 lg:px-8 relative">
      {/* 背景底图 */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Image
          src="/qh/campus-landmark.jpg"
          alt=""
          fill
          className="object-cover"
          loading="lazy"
        />
      </div>

      {/* 半透明覆盖 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: 'rgba(248, 249, 251, 0.9)' }}
      />

      {/* 校徽水印 */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: 0.03 }}
      >
        <span className="text-[200px] font-serif font-bold" style={{ color: '#19376D' }}>
          丹
        </span>
      </div>

      <div className="relative z-10">
        {/* 模块标题 */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <Bell size={32} style={{ color: '#19376D' }} />
            <div>
              <h3 className="font-serif text-3xl font-bold" style={{ color: '#121212' }}>
                通知公告
              </h3>
              <span className="text-sm" style={{ color: '#666666' }}>
                Announcements
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
            全部公告
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 卡片网格 - 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notices.map((notice) => {
            const { day, month, year } = formatDate(notice.date);
            return (
              <button
                key={notice.id}
                onClick={() => onNewsClick?.(notice)}
                className="w-full rounded-2xl border backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden text-left group"
                style={{
                  borderColor: 'rgba(25, 55, 109, 0.15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                }}
              >
                {/* 右上角品牌色角标装饰 */}
                <div
                  className="absolute top-0 right-0 w-12 h-12 transition-all duration-300 group-hover:w-16 group-hover:h-16"
                  style={{
                    background: 'linear-gradient(135deg, #19376D 0%, #19376D 50%, transparent 50%)',
                    borderRadius: '0 16px 0 0',
                  }}
                />

                {/* 内容 */}
                <div className="flex gap-5 items-start">
                  {/* 左侧日期徽章 */}
                  <div 
                    className="flex flex-col items-center flex-shrink-0 p-3 rounded-xl transition-all duration-300 group-hover:scale-105"
                    style={{ backgroundColor: 'rgba(25, 55, 109, 0.06)' }}
                  >
                    <span
                      className="font-bold text-3xl"
                      style={{ color: '#19376D' }}
                    >
                      {day}
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: '#666666' }}
                    >
                      {month}月{year}
                    </span>
                  </div>

                  {/* 右侧内容 */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className="font-serif font-bold text-lg group-hover:text-[#19376D] transition-colors duration-300 line-clamp-1"
                      style={{ color: '#121212' }}
                    >
                      {notice.title}
                    </h4>
                    <p
                      className="mt-2 text-sm leading-relaxed line-clamp-2"
                      style={{ color: '#666666' }}
                    >
                      {notice.excerpt}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" style={{ color: '#19376D' }}>
                      查看详情 <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
