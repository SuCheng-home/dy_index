'use client';

import { Play } from 'lucide-react';

export function QhVideoSection() {
  return (
    <section className="w-full py-20 relative overflow-hidden">
      {/* 背景图 */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1427504494785-cdfa56b47e37?w=1920&h=1080&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* 模块标题 */}
        <div className="flex items-center gap-3 mb-10">
          <Play size={32} style={{ color: '#19376D' }} />
          <h3 className="font-serif text-3xl font-bold text-[#121212]">视频新闻</h3>
          <span className="text-sm text-[#666666]">Video</span>
        </div>

        {/* 内容布局 */}
        <div className="grid grid-cols-12 gap-0 items-center overflow-hidden">
          {/* 左侧 - 4 列 */}
          <div
            className="col-span-12 lg:col-span-4 h-96 relative overflow-hidden flex flex-col justify-end p-8 text-white rounded-l-3xl"
            style={{
              backgroundColor: 'rgba(25, 55, 109, 0.9)',
              backgroundImage:
                'url("https://images.unsplash.com/photo-1516534775068-bb57f764d541?w=600&h=400&fit=crop")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'multiply',
            }}
          >
            <h3 className="font-serif font-bold text-2xl mb-2">视频新闻</h3>
            <p className="text-xl font-medium">江苏省丹阳高级中学官方宣传片</p>
          </div>

          {/* 右侧 - 8 列 */}
          <div
            className="col-span-12 lg:col-span-8 h-96 relative overflow-hidden flex items-center justify-center rounded-r-3xl"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1526739773649-5e93c6b9a59e?w=1200&h=800&fit=crop")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* 半透明覆盖 */}
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }} />

            {/* 播放按钮 */}
            <button className="relative z-10 w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white hover:scale-110 transition-transform duration-300 group">
              <Play
                size={40}
                className="text-white ml-1 group-hover:scale-125 transition-transform duration-300"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
