"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { type RootSiteConfig } from "@/lib/root-site-config"

type CampusGalleryConfig = RootSiteConfig["gallery"]

export function CampusGallery({ config }: { config: CampusGalleryConfig }) {
  const categories = config.categories.length > 0 ? config.categories : ["全部"]
  const galleryItems = config.items
  const [activeCategory, setActiveCategory] = useState("全部")
  const { ref, isRevealed } = useScrollReveal()

  const filteredItems = useMemo(() => {
    if (activeCategory !== "全部") {
      return galleryItems.filter((item) => item.category === activeCategory).slice(0, 5)
    }

    const firstItemByCategory = new Map<string, typeof galleryItems[number]>()
    for (const item of galleryItems) {
      if (!firstItemByCategory.has(item.category)) {
        firstItemByCategory.set(item.category, item)
      }
    }
    return Array.from(firstItemByCategory.values()).slice(0, 5)
  }, [activeCategory, galleryItems])

  if (galleryItems.length === 0) {
    return null
  }

  return (
    <section id="campus-gallery" ref={ref} className="bg-[#FDFBF7] py-20">
      <div className="mx-auto max-w-7xl px-4">
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

        <div className="grid gap-4 lg:grid-cols-4 lg:grid-rows-2">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className={`group relative min-h-[220px] overflow-hidden rounded-2xl bg-[#EFE6D8] shadow-md transition-all duration-700 hover:-translate-y-1 hover:shadow-xl ${
                index === 0 ? "lg:col-span-2 lg:row-span-2 lg:min-h-[456px]" : ""
              }`}
              style={{
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? "translateY(0)" : "translateY(40px)",
                transitionDelay: `${0.2 + Math.min(index, 8) * 0.06}s`,
              }}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A0A0A]/70 via-[#2A0A0A]/10 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
              {item.description ? (
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="line-clamp-2 text-sm leading-6 text-[#F5E6D3]/90">
                    {item.description}
                  </p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
