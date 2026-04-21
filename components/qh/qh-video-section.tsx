'use client';

import Image from 'next/image';
import { Play, Video } from 'lucide-react';

export function QhVideoSection() {
  return (
    <section className="w-full py-16 relative" style={{ backgroundColor: '#F8F9FB' }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* 模块标题 */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(91, 44, 111, 0.1)' }}>
            <Video size={24} style={{ color: '#5B2C6F' }} />
          </div>
          <div>
            <h3 className="font-serif text-3xl font-bold" style={{ color: '#121212' }}>
              视频<span className="text-sm font-normal ml-1" style={{ color: '#E91E63' }}>Video</span>新闻
            </h3>
          </div>
        </div>

        {/* 视频布局：左小右大 */}
        <div className="grid grid-cols-12 gap-0 overflow-hidden rounded-xl shadow-lg">
          {/* 左侧校园图片 - 4列 */}
          <div className="col-span-12 lg:col-span-4 relative h-80 lg:h-auto overflow-hidden">
            <Image
              src="/qh/campus-landmark.jpg"
              alt="校园风光"
              fill
              className="object-cover"
            />
            {/* 紫色叠加 */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(91, 44, 111, 0.7) 0%, rgba(125, 60, 152, 0.5) 100%)' }} />
            
            {/* 底部标题条 */}
            <div className="absolute bottom-0 left-0 right-0 p-6" style={{ backgroundColor: 'rgba(91, 44, 111, 0.95)' }}>
              <p className="text-white font-medium text-lg">丹阳高中官方宣传片</p>
              <div className="w-24 h-1 mt-2" style={{ backgroundColor: '#E91E63' }} />
            </div>
          </div>

          {/* 右侧视频封面 - 8列 */}
          <div className="col-span-12 lg:col-span-8 relative h-80 lg:h-[450px] overflow-hidden group cursor-pointer">
            <Image
              src="/qh/video-cover.jpg"
              alt="官方宣传片"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* 半透明叠加 */}
            <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:bg-black/40" />

            {/* 中心播放按钮 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* 呼吸动画圈 */}
                <div className="absolute inset-0 w-24 h-24 rounded-full animate-ping opacity-30" style={{ backgroundColor: '#5B2C6F' }} />
                <button className="relative w-24 h-24 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 border-2 border-white/50" style={{ backgroundColor: 'rgba(91, 44, 111, 0.8)' }}>
                  <Play size={40} className="text-white ml-1" fill="white" />
                </button>
              </div>
            </div>

            {/* 视频标题叠加 */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
              <h4 className="font-serif text-3xl font-bold text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                星火<span style={{ color: '#FFD700' }}>点亮</span>未来
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
