'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  '/view/view1.jpg',
  '/view/view2.jpg',
  '/view/view3.jpg',
  '/view/view4.jpg',
  '/view/view5.jpg',
  '/view/view6.jpg',
];

export function QhHeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  const prev = () => {
    setCurrentIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setCurrentIndex((current) => (current + 1) % slides.length);
  };

  return (
    <section 
      className="w-full h-screen relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 背景轮播图 */}
      {slides.map((src, index) => (
        <div
          key={src}
          className="absolute inset-0 transition-all duration-[1200ms]"
          style={{
            opacity: currentIndex === index ? 1 : 0,
            transform: `scale(${currentIndex === index ? 1 : 1.05})`,
            zIndex: currentIndex === index ? 1 : 0,
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <Image
            src={src}
            alt={`校园风光 ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover"
          />
        </div>
      ))}

      {/* 左右切换按钮 */}
      <button
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-white/40 group"
      >
        <ChevronLeft size={24} className="text-white transition-transform duration-300 group-hover:-translate-x-0.5" />
      </button>
      <button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-white/40 group"
      >
        <ChevronRight size={24} className="text-white transition-transform duration-300 group-hover:translate-x-0.5" />
      </button>

      {/* 底部指示器 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className="transition-all duration-500 rounded-full"
            style={{
              width: currentIndex === index ? '32px' : '10px',
              height: '10px',
              backgroundColor: currentIndex === index ? '#5B2C6F' : 'rgba(255,255,255,0.6)',
            }}
          />
        ))}
      </div>

      {/* 底部波浪效果 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden z-10">
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
