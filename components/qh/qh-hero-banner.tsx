'use client';

import Image from 'next/image';

export function QhHeroBanner() {
  return (
    <section className="w-full h-screen flex items-center justify-center relative mt-16 overflow-hidden">
      {/* 背景图层 - 校园实景 */}
      <Image
        src="/qh/hero-bg.jpg"
        alt="江苏省丹阳高级中学校园全景"
        fill
        className="object-cover"
        priority
      />

      {/* 学府藏青覆盖层 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(25, 55, 109, 0.55)',
          backdropFilter: 'blur(1px)',
        }}
      />

      {/* 极简光效渐变 */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse at 30% 40%, rgba(184, 134, 11, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(25, 55, 109, 0.1) 0%, transparent 50%)',
        }}
      />

      {/* 内容区 */}
      <div className="relative z-10 text-white text-center flex flex-col items-center gap-6">
        {/* 品牌块 */}
        <div className="flex flex-col items-center gap-2">
          {/* 校徽 */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #B8860B 0%, #8B6914 100%)',
            }}
          >
            丹
          </div>

          <h1 className="font-serif text-4xl font-bold tracking-wide mt-2">
            江苏省丹阳高级中学
          </h1>
          <p className="text-sm tracking-widest opacity-90">
            JIANGSU DANYANG SENIOR HIGH SCHOOL
          </p>
        </div>

        {/* 主标题 */}
        <h2
          className="font-serif font-bold tracking-tight text-balance mt-6"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
        >
          立德树人 笃学创新
        </h2>

        {/* 副标题 */}
        <p className="text-lg opacity-90 max-w-2xl mt-2">
          江苏省四星级公办重点中学
        </p>
      </div>

      {/* 底部校训水印 */}
      <div className="absolute bottom-0 left-0 w-full text-center py-12 opacity-20 text-7xl font-serif font-bold pointer-events-none text-white/30">
        立德树人 笃学创新
      </div>

      {/* 底部滚动提示 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <svg
          className="w-6 h-6 text-white opacity-75"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
