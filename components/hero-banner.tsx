"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { type RootSiteConfig } from "@/lib/root-site-config"

type HeroBannerConfig = RootSiteConfig["hero"]

const homeHeroFallbackImage = {
  src: "https://cdnfile-10043692.file.myqcloud.com/productVersion/common/danyang/省丹中画册/view1.jpg",
  alt: "江苏省丹阳高级中学国际交流栏目导航图",
}

export function HeroBanner({ config }: { config: HeroBannerConfig }) {
  // 优先使用服务端下发的图片（已携带缓存版本号 ?v=），仅在缺失时回退到本地默认图。
  const bannerImages = config.images.length > 0 ? config.images : [homeHeroFallbackImage]
  const hasMultipleImages = bannerImages.length > 1
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    // 如果鼠标没有悬停在 banner 上，则自动轮播（更长间隔更有高级感）
    if (hasMultipleImages && !isHovered) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % bannerImages.length)
      }, config.autoplayInterval)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [hasMultipleImages, isHovered, bannerImages.length, config.autoplayInterval])

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

  if (bannerImages.length === 0) {
    return null
  }

  return (
    <section
      className="relative w-full overflow-hidden bg-[#8B1A1A]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="group/banner relative h-[72svh] min-h-[480px] max-h-[680px] w-full lg:h-screen lg:max-h-none">
        {bannerImages.map((item, index) => (
          <Image
            key={`${item.src}-${index}`}
            src={item.src}
            alt={item.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className={`transition-opacity duration-1000 object-cover object-center ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}

        {hasMultipleImages && (
          <>
            {/* 左右切换按钮 */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/50 lg:left-8 lg:h-12 lg:w-12"
              aria-label="上一张图片"
            >
              <ChevronLeft className="h-6 w-6 lg:h-8 lg:w-8" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/50 lg:right-8 lg:h-12 lg:w-12"
              aria-label="下一张图片"
            >
              <ChevronRight className="h-6 w-6 lg:h-8 lg:w-8" />
            </button>
          </>
        )}
        
        {hasMultipleImages && (
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3 sm:bottom-8 lg:bottom-12">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`min-h-11 min-w-11 rounded-full transition-all duration-300 before:block before:h-2.5 before:rounded-full ${
                  index === currentIndex
                    ? "before:mx-1.5 before:bg-white"
                    : "before:mx-[17px] before:bg-white/50 hover:before:bg-white/80"
                }`}
                aria-label={`切换到第 ${index + 1} 张图片`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
