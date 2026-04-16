'use client';

import Image from 'next/image';

export function QhHeroBanner() {
  return (
    <section className="w-full min-h-screen relative overflow-hidden pt-20">
      {/* 紫色渐变背景 */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #4A1A5E 0%, #5B2C6F 30%, #7D3C98 60%, #9B59B6 100%)',
        }}
      />

      {/* 动态光线效果 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 光线1 */}
        <div 
          className="absolute top-0 left-1/4 w-[800px] h-[2px] origin-left rotate-[30deg] opacity-30"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }}
        />
        {/* 光线2 */}
        <div 
          className="absolute top-20 left-1/3 w-[1000px] h-[1px] origin-left rotate-[25deg] opacity-20"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}
        />
        {/* 光线3 */}
        <div 
          className="absolute top-40 right-1/4 w-[600px] h-[1px] origin-right rotate-[-20deg] opacity-25"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}
        />
        {/* 曲线光带 */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          <path 
            d="M0,200 Q400,100 800,250 T1600,200" 
            fill="none" 
            stroke="url(#curveGrad)" 
            strokeWidth="2"
            className="animate-pulse"
          />
          <path 
            d="M0,400 Q500,300 1000,450 T2000,400" 
            fill="none" 
            stroke="url(#curveGrad)" 
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* 背景底图（半透明树木剪影）*/}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/qh/hero-bg.jpg"
          alt=""
          fill
          className="object-cover object-bottom"
          priority
        />
      </div>

      {/* 浮动装饰球 */}
      <div className="absolute top-32 left-[15%] w-6 h-6 rounded-full bg-orange-400 opacity-80 animate-bounce" style={{ animationDuration: '3s' }} />
      <div className="absolute top-48 right-[20%] w-10 h-10 rounded-full opacity-70 animate-bounce" style={{ animationDuration: '4s', background: 'linear-gradient(135deg, #E91E63 0%, #9C27B0 100%)' }} />
      <div className="absolute bottom-[30%] left-[10%] w-8 h-8 rounded-full bg-pink-400 opacity-60 animate-bounce" style={{ animationDuration: '3.5s' }} />
      <div className="absolute bottom-[40%] right-[15%] w-5 h-5 rounded-full bg-orange-500 opacity-70 animate-bounce" style={{ animationDuration: '2.5s' }} />
      <div className="absolute top-[40%] left-[30%] w-4 h-4 rounded-full bg-pink-300 opacity-50 animate-bounce" style={{ animationDuration: '4.5s' }} />

      {/* 主内容区 */}
      <div className="relative z-10 min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-center px-6">
        {/* 校徽 + 校名 */}
        <div className="flex items-center gap-4 mb-8 bg-white/10 backdrop-blur-sm px-8 py-4 rounded-full">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-white/30" style={{ background: 'rgba(255,255,255,0.15)' }}>
            丹
          </div>
          <div className="text-left">
            <h2 className="font-serif text-xl font-bold text-white tracking-wider">江苏省丹阳高级中学</h2>
            <p className="text-xs text-white/70 tracking-widest">JIANGSU DANYANG SENIOR HIGH SCHOOL</p>
          </div>
        </div>

        {/* 主标语 */}
        <h1 className="font-serif font-bold text-white mb-6" style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          立德树人 &nbsp; 笃学创新 &nbsp; 追求卓越
        </h1>

        {/* 副标语 - 书法风格底纹 */}
        <div className="relative">
          <p 
            className="font-serif text-3xl md:text-4xl font-medium tracking-widest opacity-40"
            style={{ color: 'rgba(255,255,255,0.5)', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
          >
            自强不息 &nbsp; 厚德载物
          </p>
        </div>
      </div>

      {/* 底部波浪效果 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        <svg viewBox="0 0 1440 120" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,120 L0,120 Z"
            fill="#F8F9FB"
          />
        </svg>
      </div>
    </section>
  );
}
