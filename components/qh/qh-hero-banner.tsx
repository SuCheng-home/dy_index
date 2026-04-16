'use client';

export function QhHeroBanner() {
  return (
    <section className="w-full h-screen flex items-center justify-center relative mt-16 overflow-hidden bg-gradient-to-br from-[#19376D] via-[#2C5AA0] to-[#1a2d5f]">
      {/* 背景图层 - 校园实景 */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1427504494785-cdfa56b47e37?w=1920&h=1080&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />

      {/* 蓝色覆盖层 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(25, 55, 109, 0.5)',
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* 装饰渐变 */}
      <div className="absolute inset-0 opacity-30" style={{
        background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.1) 0%, rgba(200, 16, 46, 0.1) 50%, rgba(25, 55, 109, 0.1) 100%)',
      }} />

      {/* 内容区 */}
      <div className="relative z-10 text-white text-center flex flex-col items-center gap-8">
        {/* 品牌块 */}
        <div className="flex flex-col items-center gap-3">
          {/* 校徽 */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#B8860B] to-[#8B6914] flex items-center justify-center text-3xl font-bold shadow-lg">
            丹
          </div>

          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-wide">
            江苏省丹阳高级中学
          </h1>
          <p className="text-sm md:text-base tracking-widest opacity-90">
            JIANGSU DANYANG SENIOR HIGH SCHOOL
          </p>
        </div>

        {/* 主标题 */}
        <div className="mt-6">
          <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-balance">
            立德树人
          </h2>
          <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-balance mt-2">
            笃学创新
          </h2>
        </div>

        {/* 副标题 */}
        <p className="text-lg md:text-xl opacity-90 max-w-2xl mt-4">
          江苏省四星级公办重点中学
        </p>
      </div>

      {/* 底部校训水印 */}
      <div
        className="absolute bottom-12 left-0 right-0 text-center opacity-10 text-6xl font-serif font-bold"
        style={{ color: 'rgba(255, 255, 255, 0.3)' }}
      >
        立德树人 笃学创新
      </div>

      {/* 底部滚动提示 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <svg className="w-6 h-6 text-white opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
