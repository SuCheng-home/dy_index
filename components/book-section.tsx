"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, ArrowRight } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function BookSection() {
  const { ref: sectionRef, isRevealed } = useScrollReveal()
  const [bookOpen, setBookOpen] = useState(false)
  
  // 当滚动显示后延迟打开书本
  useEffect(() => {
    if (isRevealed) {
      const timer = setTimeout(() => {
        setBookOpen(true)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isRevealed])

  // 获取当前日期
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const day = today.getDate()
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"]
  const weekDay = weekDays[today.getDay()]

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20"
      style={{
        background: "linear-gradient(to bottom, #F5EFE6 0%, #EDE4D3 50%, #F5EFE6 100%)",
      }}
    >
      {/* 装饰性角落花纹 */}
      <div
        className="absolute top-8 right-8 w-24 h-24 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 10 Q60 30 80 30 Q60 40 60 60 Q50 40 30 40 Q50 30 50 10' fill='%238B1A1A' opacity='0.3'/%3E%3Ccircle cx='50' cy='50' r='8' fill='%23D4AF37' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "contain",
        }}
      />

      <div className="mx-auto max-w-6xl px-4">
        {/* 标题 */}
        <div
          className="text-center mb-12 transition-all duration-1000"
          style={{
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <h2
            className="text-3xl md:text-4xl font-serif font-bold mb-3"
            style={{ color: "#8B1A1A" }}
          >
            广学甄微 · 大成未来
          </h2>
          <div className="flex items-center justify-center gap-2 text-[#8B1A1A]">
            <span className="text-sm">✦</span>
            <p className="text-sm" style={{ color: "#8B1A1A" }}>
              各得其所、身心愉悦、走向卓越
            </p>
            <span className="text-sm">✦</span>
          </div>
        </div>

        {/* 书本容器 */}
        <div
          className="relative mx-auto transition-all duration-1000"
          style={{
            maxWidth: "1000px",
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? "translateY(0)" : "translateY(50px)",
            transitionDelay: "0.2s",
            perspective: "2000px",
          }}
        >
          {/* 书本底座阴影 */}
          <div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-8 rounded-[50%] transition-all duration-1000"
            style={{
              background: "radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%)",
              opacity: bookOpen ? 1 : 0,
            }}
          />

          {/* 书本主体 */}
          <div
            className="relative flex transition-all duration-1000"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* 左页 */}
            <div
              className="relative w-1/2 bg-[#F8F4ED] rounded-l-md shadow-lg overflow-hidden transition-all duration-1000"
              style={{
                minHeight: "450px",
                transform: bookOpen ? "rotateY(0deg)" : "rotateY(-30deg)",
                transformOrigin: "right center",
                boxShadow: bookOpen
                  ? "inset -10px 0 30px rgba(0,0,0,0.08), -5px 5px 20px rgba(0,0,0,0.1)"
                  : "none",
              }}
            >
              {/* 左页内容 - 日期和宣传片 */}
              <div className="p-8 h-full flex flex-col">
                {/* 日期显示 */}
                <div className="mb-6 text-center">
                  <div className="inline-block border-b-2 border-[#8B1A1A] pb-2">
                    <span className="text-6xl font-serif font-bold text-[#8B1A1A]">{day}</span>
                    <span className="text-lg text-[#666] ml-2">
                      {year}.{month.toString().padStart(2, "0")} 星期{weekDay}
                    </span>
                  </div>
                </div>

                {/* 宣传视频区域 */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-[#2A0A0A]/10 mb-4">
                    <Image
                      src="/view/view1.jpg"
                      alt="学校宣传片"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <button className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-[#8B1A1A] ml-1" />
                      </button>
                    </div>
                  </div>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-sm text-[#8B1A1A] hover:text-[#D4AF37] transition-colors"
                  >
                    查看更多宣传片
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* 书页边缘装饰线 */}
              <div
                className="absolute right-0 top-0 bottom-0 w-px"
                style={{
                  background: "linear-gradient(to bottom, transparent, rgba(139,26,26,0.2), transparent)",
                }}
              />
            </div>

            {/* 书脊 */}
            <div
              className="w-4 relative z-10 transition-all duration-1000"
              style={{
                background: "linear-gradient(to right, #D4C4A8, #E8DCC8, #D4C4A8)",
                boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                transform: bookOpen ? "scaleX(1)" : "scaleX(0.5)",
              }}
            />

            {/* 右页 */}
            <div
              className="relative w-1/2 bg-[#F8F4ED] rounded-r-md shadow-lg overflow-hidden transition-all duration-1000"
              style={{
                minHeight: "450px",
                transform: bookOpen ? "rotateY(0deg)" : "rotateY(30deg)",
                transformOrigin: "left center",
                boxShadow: bookOpen
                  ? "inset 10px 0 30px rgba(0,0,0,0.08), 5px 5px 20px rgba(0,0,0,0.1)"
                  : "none",
              }}
            >
              {/* 右页内容 - 学校历史和宣传册 */}
              <div className="p-8 h-full flex flex-col">
                {/* 历史简介 */}
                <div className="mb-6">
                  <p className="text-sm text-[#666] leading-relaxed">
                    八十余年波澜壮阔的开拓史，犹如一首雄浑激越的进行曲。
                    丹阳高级中学肇始于1941年，历经岁月洗礼，几易校址，数更其名。
                    虽历烽火，弦歌不辍，薪火相传，桃李芬芳。
                  </p>
                </div>

                {/* 校园建筑插画 */}
                <div className="flex-1 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-[90%] aspect-[4/3]">
                      <Image
                        src="/view/view4.jpg"
                        alt="丹阳高级中学"
                        fill
                        className="object-contain rounded-lg"
                        style={{
                          filter: "sepia(20%) saturate(80%)",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 进入宣传册链接 */}
                <div className="text-center mt-4">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 px-6 py-2 border border-[#8B1A1A] text-[#8B1A1A] rounded-full hover:bg-[#8B1A1A] hover:text-white transition-all"
                  >
                    点击进入宣传册
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* 书页边缘装饰线 */}
              <div
                className="absolute left-0 top-0 bottom-0 w-px"
                style={{
                  background: "linear-gradient(to bottom, transparent, rgba(139,26,26,0.2), transparent)",
                }}
              />
            </div>
          </div>

          {/* 右侧竖排书法文字 */}
          <div
            className="absolute -right-20 top-1/2 -translate-y-1/2 hidden xl:block transition-all duration-1000"
            style={{
              opacity: bookOpen ? 1 : 0,
              transform: bookOpen ? "translateX(0)" : "translateX(20px)",
              transitionDelay: "0.5s",
            }}
          >
            <div
              className="writing-mode-vertical text-4xl font-serif tracking-widest"
              style={{
                color: "#8B6914",
                writingMode: "vertical-rl",
                textOrientation: "upright",
              }}
            >
              大成留韵
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
