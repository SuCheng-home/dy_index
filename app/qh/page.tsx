'use client';

import { QhHeader } from '@/components/qh/qh-header';
import { QhAside } from '@/components/qh/qh-aside';
import { QhHeroBanner } from '@/components/qh/qh-hero-banner';
import { QhNewsSection } from '@/components/qh/qh-news-section';
import { QhNoticeSection } from '@/components/qh/qh-notice-section';
import { QhVideoSection } from '@/components/qh/qh-video-section';
import { QhAchievementSection } from '@/components/qh/qh-achievement-section';
import { QhServiceSection } from '@/components/qh/qh-service-section';
import { QhFooter } from '@/components/qh/qh-footer';

export default function QhPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F7FA' }}>
      {/* 双导航布局 */}
      <QhHeader />
      <QhAside />

      {/* 主要内容区，预留右侧固定导航宽度 */}
      <main className="mr-16">
        {/* 首屏 Hero Banner */}
        <QhHeroBanner />

        {/* 新闻动态模块 */}
        <QhNewsSection />

        {/* 通知公告模块 */}
        <QhNoticeSection />

        {/* 视频新闻模块 */}
        <QhVideoSection />

        {/* 核心办学成果模块 */}
        <QhAchievementSection />

        {/* 校园服务快捷入口 */}
        <QhServiceSection />
      </main>

      {/* 页脚 */}
      <QhFooter />
    </div>
  );
}
