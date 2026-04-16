"use client"

import { useState } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { label: "学校概况", href: "/about" },
  { label: "校史沿革", href: "/about/history" },
  { label: "校园风光", href: "/about/campus" },
  { label: "组织机构", href: "/about/organization" },
  { label: "领导班子", href: "/about/leadership" },
  { label: "食堂菜谱", href: "/about/canteen" },
]

const categories = ["全部", "教学楼", "运动场馆", "图书馆", "宿舍餐厅", "校园环境"]

const galleryImages = [
  { id: 1, category: "教学楼", title: "大成楼", image: "/view/view1.jpg" },
  { id: 2, category: "运动场馆", title: "体育馆", image: "/view/view7.jpg" },
  { id: 3, category: "图书馆", title: "致远图书馆", image: "/view/view6.jpg" },
  { id: 4, category: "校园环境", title: "樱花大道", image: "/view/view2.jpg" },
  { id: 5, category: "教学楼", title: "科技楼", image: "/view/view1.jpg" },
  { id: 6, category: "宿舍餐厅", title: "学生公寓", image: "/view/view1.jpg" },
  { id: 7, category: "运动场馆", title: "田径场", image: "/view/view1.jpg" },
  { id: 8, category: "校园环境", title: "孔子像", image: "/view/view2.jpg" },
]

export default function CampusPage() {
  const [activeCategory, setActiveCategory] = useState("全部")
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const filteredImages =
    activeCategory === "全部"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory)

  const currentIndex = selectedImage !== null ? filteredImages.findIndex((img) => img.id === selectedImage) : -1

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedImage(filteredImages[currentIndex - 1].id)
    }
  }

  const handleNext = () => {
    if (currentIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentIndex + 1].id)
    }
  }

  return (
    <>
      <Header />
      <SubPageLayout
        title="校园风光"
        subtitle="Campus Scenery"
        breadcrumbs={[
          { label: "校园信息", href: "/about" },
          { label: "校园风光" },
        ]}
        sidebarItems={sidebarItems}
        bannerImage="/view/view8.jpg"
      >
        {/* 分类筛选 */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all duration-300",
                activeCategory === cat
                  ? "bg-[#8B1A1A] text-white shadow-md"
                  : "bg-[#F8F4ED] text-[#666] hover:bg-[#8B1A1A]/10 hover:text-[#8B1A1A]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 图片网格 */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredImages.map((img, index) => (
            <div
              key={img.id}
              onClick={() => setSelectedImage(img.id)}
              className="animate-in fade-in zoom-in-95 group cursor-pointer overflow-hidden rounded-xl shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative h-56">
                <Image
                  src={img.image}
                  alt={img.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                  <span className="mb-1 inline-block rounded bg-[#D4AF37] px-2 py-0.5 text-xs text-white">
                    {img.category}
                  </span>
                  <h3 className="text-lg font-bold text-white">{img.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 灯箱 */}
        {selectedImage !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </button>
            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
              onClick={(e) => {
                e.stopPropagation()
                handlePrev()
              }}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              disabled={currentIndex === filteredImages.length - 1}
            >
              <ChevronRight className="h-8 w-8" />
            </button>
            <div className="max-h-[80vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
              {filteredImages.find((img) => img.id === selectedImage) && (
                <>
                  <Image
                    src={filteredImages.find((img) => img.id === selectedImage)!.image}
                    alt={filteredImages.find((img) => img.id === selectedImage)!.title}
                    width={1200}
                    height={800}
                    className="max-h-[70vh] w-auto rounded-lg object-contain"
                  />
                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-bold text-white">
                      {filteredImages.find((img) => img.id === selectedImage)!.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/70">
                      {currentIndex + 1} / {filteredImages.length}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </SubPageLayout>
      <Footer />
    </>
  )
}
