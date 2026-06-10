"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { type RootSiteConfig } from "@/lib/root-site-config"

type CampusGalleryConfig = RootSiteConfig["gallery"]
export function CampusGallery({ config }: { config: CampusGalleryConfig }) {
  const categories = config.categories.length > 0 ? config.categories : ["全部"]
  const galleryItems = config.items
  const [activeCategory, setActiveCategory] = useState("全部")
  const { ref, isRevealed } = useScrollReveal()

  const filteredItems =
    activeCategory === "全部"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory)

  if (galleryItems.length === 0) {
    return null
  }

  return (
    <section ref={ref} className="bg-[#FDFBF7] py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* 标题 */}
        <div
          className="mb-12 text-center transition-all duration-1000"
          style={{
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <span className="mb-2 inline-block font-serif text-sm tracking-widest text-[#D4AF37]">
            {config.eyebrow}
          </span>
          <h2 className="mb-4 font-serif text-3xl font-bold text-[#2A0A0A] md:text-4xl">
            {config.title}
          </h2>
          <div className="mx-auto h-1 w-20 bg-gradient-to-r from-[#D4AF37] to-[#8B1A1A]" />
        </div>

        {/* 分类筛选 */}
        <div
          className="mb-8 flex flex-wrap justify-center gap-2 transition-all duration-1000"
          style={{
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? "translateY(0)" : "translateY(30px)",
            transitionDelay: "0.1s",
          }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-[#8B1A1A] text-[#F5E6D3] shadow-md"
                  : "bg-[#F5F0E8] text-[#666] hover:bg-[#8B1A1A]/10 hover:text-[#8B1A1A]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 图片网格 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="group relative aspect-[16/10] overflow-hidden rounded-lg shadow-md transition-all duration-700"
              style={{
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? "translateY(0)" : "translateY(40px)",
                transitionDelay: `${0.2 + index * 0.08}s`,
              }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* 遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A0A0A]/80 via-[#2A0A0A]/20 to-transparent opacity-60 transition-opacity group-hover:opacity-90" />
              
              {/* 视频图标 */}
              {item.type === "video" && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/90 shadow-lg transition-transform group-hover:scale-110">
                    <Play className="ml-1 h-6 w-6 fill-[#2A0A0A] text-[#2A0A0A]" />
                  </div>
                </div>
              )}

              {/* 标题 */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="mb-1 inline-block rounded bg-[#D4AF37] px-2 py-0.5 text-xs font-medium text-[#2A0A0A]">
                  {item.category}
                </span>
                <h3 className="font-medium text-[#F5E6D3]">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* 查看更多 */}
        <div className="mt-10 text-center">
          <Link
            href={config.moreHref}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#8B1A1A] px-8 py-3 font-medium text-[#8B1A1A] transition-all hover:bg-[#8B1A1A] hover:text-[#F5E6D3]"
          >
            查看更多
          </Link>
        </div>
      </div>
    </section>
  )
}
