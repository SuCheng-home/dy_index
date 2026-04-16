"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

const bannerImages = [
  "/view/view1.jpg",
  "/view/view2.jpg",
  "/view/view3.jpg",
  "/view/view4.jpg",
  "/view/view5.jpg",
  "/view/view6.jpg",
  "/view/view7.jpg",
  "/view/view8.jpg",
]

export function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    // 如果鼠标没有悬停在 banner 上，则自动轮播（更长间隔更有高级感）
    if (!isHovered) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % bannerImages.length)
      }, 6000) // 每 6 秒切换一次
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isHovered])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % bannerImages.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)
  }

  // 添加滚轮事件监听，实现滚动一次就切换到"今日丹中"，严丝合缝
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // 只有在页面顶部附近且向下滚动时才触发
      if (window.scrollY < 100 && e.deltaY > 0) {
        e.preventDefault() // 阻止默认滚动
        
        const target = document.getElementById("today-danzhong")
        if (target) {
          // 平滑滚动到目标元素顶部，严丝合缝对齐
          window.scrollTo({
            top: target.offsetTop,
            behavior: "smooth"
          })
        }
      }
    }

    // 需要设置 passive: false 才能调用 preventDefault
    window.addEventListener("wheel", handleWheel, { passive: false })
    
    return () => {
      window.removeEventListener("wheel", handleWheel)
    }
  }, [])

  return (
    <section
      className="relative w-full overflow-hidden bg-[#8B1A1A]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-screen w-full group/banner">
        {bannerImages.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`江苏省丹阳高级中学 - 校园风光 ${index + 1}`}
            fill
            priority={index === 0}
            sizes="100vw"
            className={`transition-opacity duration-1000 object-cover object-center ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}

        {/* 左右切换按钮 */}
        <button
          onClick={prevSlide}
          className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-black/20 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm transition-all duration-300 z-20"
          aria-label="上一张图片"
        >
          <ChevronLeft className="h-6 w-6 lg:h-8 lg:w-8" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-black/20 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm transition-all duration-300 z-20"
          aria-label="下一张图片"
        >
          <ChevronRight className="h-6 w-6 lg:h-8 lg:w-8" />
        </button>
        
        {/* 轮播指示器 */}
        <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 gap-3 z-20">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`切换到第 ${index + 1} 张图片`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
