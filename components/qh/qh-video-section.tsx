'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';

export function QhVideoSection() {
  return (
    <section className="w-full py-20 relative overflow-hidden">
      {/* 背景底图 */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Image
          src="/qh/hero-bg.jpg"
          alt=""
          fill
          className="object-cover"
          loading="lazy"
        />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* 模块标题 */}
        <div className="flex items-center gap-2 mb-10">
          <Play size={32} style={{ color: '#19376D' }} />
          <h3 className="font-serif text-3xl font-bold" style={{ color: '#121212' }}>
            视频新闻
          </h3>
          <span className="text-sm" style={{ color: '#666666' }}>
            Video
          </span>
        </div>

        {/* 内容布局 - 通栏 4:8 */}
        <div className="grid grid-cols-12 gap-0 items-stretch overflow-hidden rounded-2xl">
          {/* 左侧 - 4 列文字区 */}
          <div className="col-span-12 lg:col-span-4 h-96 relative overflow-hidden flex flex-col justify-end p-8 text-white">
            {/* 背景图 + 混合 */}
            <Image
              src="/qh/campus-landmark.jpg"
              alt=""
              fill
              className="object-cover"
              loading="lazy"
            />
            <div
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(25, 55, 109, 0.9)', mixBlendMode: 'multiply' }}
            />

            {/* 内容 */}
            <div className="relative z-10">
              <h3 className="font-serif font-bold text-2xl text-white">视频新闻</h3>
              <p className="text-xl font-medium mt-2 text-white">
                江苏省丹阳高级中学官方宣传片
              </p>
            </div>
          </div>

          {/* 右侧 - 8 列视频区 */}
          <div className="col-span-12 lg:col-span-8 h-96 relative overflow-hidden flex items-center justify-center">
            {/* 视频封面 */}
            <Image
              src="/qh/video-cover.jpg"
              alt="江苏省丹阳高级中学官方宣传片"
              fill
              className="object-cover"
              loading="lazy"
            />

            {/* 半透明覆盖 */}
            <div
              className="absolute inset-0"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            />

            {/* 播放按钮 */}
            <button className="relative z-10 w-20 h-20 rounded-full backdrop-blur-sm flex items-center justify-center border-2 border-white transition-transform duration-300 hover:scale-110 group" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
              <Play
                size={40}
                className="text-white ml-1 transition-transform duration-300 group-hover:scale-110"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
