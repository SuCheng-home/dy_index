'use client';

import { useState } from 'react';
import { QhHeader } from '@/components/qh/qh-header';
import { QhAside } from '@/components/qh/qh-aside';
import { QhHeroBanner } from '@/components/qh/qh-hero-banner';
import { QhNewsSection } from '@/components/qh/qh-news-section';
import { QhNoticeSection } from '@/components/qh/qh-notice-section';
import { QhVideoSection } from '@/components/qh/qh-video-section';
import { QhAchievementSection } from '@/components/qh/qh-achievement-section';
import { QhServiceSection } from '@/components/qh/qh-service-section';
import { QhFooter } from '@/components/qh/qh-footer';
import { QhNewsSearchModal } from '@/components/qh/qh-news-search-modal';
import { QhFeedbackBox } from '@/components/qh/qh-feedback-box';

export default function QhPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ backgroundColor: '#F8F9FB' }}>
      {/* 全局背景水印 - 学校 Logo */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute top-1/4 -right-32 text-[400px] font-serif font-bold select-none"
          style={{ color: 'rgba(91, 44, 111, 0.02)' }}
        >
          丹
        </div>
        <div 
          className="absolute bottom-1/4 -left-32 text-[300px] font-serif font-bold select-none"
          style={{ color: 'rgba(91, 44, 111, 0.015)' }}
        >
          高
        </div>
      </div>

      {/* 顶部固定导航 */}
      <QhHeader onSearchClick={() => setSearchOpen(true)} />

      {/* 右侧固定纵向悬浮导航 */}
      <QhAside 
        onSearchClick={() => setSearchOpen(true)} 
        onFeedbackClick={() => setFeedbackOpen(true)} 
      />

      {/* 主要内容区 */}
      <main className="relative z-10 pr-16">
        {/* 首屏 Hero Banner - 紫色渐变 + 波浪效果 */}
        <QhHeroBanner />

        {/* 新闻动态模块 - 杂志排版风格 */}
        <QhNewsSection />

        {/* 通知公告模块 */}
        <QhNoticeSection />

        {/* 视频新闻模块 */}
        <QhVideoSection />

        {/* 核心办学成果模块 */}
        <QhAchievementSection />

        {/* 校园服务快捷入口 */}
        <QhServiceSection onFeedbackClick={() => setFeedbackOpen(true)} />

        {/* 页脚 */}
        <QhFooter />
      </main>

      {/* 新闻搜索弹窗 */}
      <QhNewsSearchModal 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)}
      />

      {/* 意见箱弹窗 */}
      <QhFeedbackBox 
        isOpen={feedbackOpen} 
        onClose={() => setFeedbackOpen(false)} 
      />
    </div>
  );
}
