"use client"

import Image from "next/image"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { type RootSiteConfig } from "@/lib/root-site-config"

type BookSectionConfig = RootSiteConfig["book"]

type MemoryPhoto = {
  src: string
  title: string
  width: number
}

const photoHeight = 671
const memoryFrameHeight = 142
const memoryPhotoBase =
  "https://cdnfile-10043692.file.myqcloud.com/productVersion/common/danyang/省丹中画册/2.砚池春秋 薪火相传"
const memoryPhotos: MemoryPhoto[] = [
  {
    src: `${memoryPhotoBase}/%E7%AC%AC15%E9%A1%B5-86.PNG`,
    title: "1948年江苏省立丹阳中学高中第一届毕业纪念",
    width: 2178,
  },
  {
    src: `${memoryPhotoBase}/%E7%AC%AC15%E9%A1%B5-83.PNG`,
    title: "1949年春省丹中参加文艺公演的部分同学",
    width: 1033,
  },
  {
    src: `${memoryPhotoBase}/%E7%AC%AC15%E9%A1%B5-87.PNG`,
    title: "1955年考取北京高校的丹中校友在天安门前合影",
    width: 1132,
  },
  {
    src: `${memoryPhotoBase}/%E7%AC%AC16%E9%A1%B5-89.PNG`,
    title: "1956年团省丹中总支高三乙分支全体团员合影",
    width: 1169,
  },
  {
    src: `${memoryPhotoBase}/%E7%AC%AC16%E9%A1%B5-91.PNG`,
    title: "1958年共青团省丹中高三甲分支整团留念",
    width: 1100,
  },
  {
    src: `${memoryPhotoBase}/%E7%AC%AC16%E9%A1%B5-93.PNG`,
    title: "1975年丹阳县第一中学附设中学-语文教师轮训班结业留影",
    width: 1152,
  },
  {
    src: `${memoryPhotoBase}/%E7%AC%AC17%E9%A1%B5-101.PNG`,
    title: "2001年9月党总支换届选举大会",
    width: 1069,
  },
  {
    src: `${memoryPhotoBase}/%E7%AC%AC17%E9%A1%B5-104.PNG`,
    title: "丹阳一中革命家长会",
    width: 565,
  },
  {
    src: `${memoryPhotoBase}/%E7%AC%AC17%E9%A1%B5-106.PNG`,
    title: "海燕社合影",
    width: 1001,
  },
  {
    src: `${memoryPhotoBase}/%E7%AC%AC17%E9%A1%B5-108.PNG`,
    title: "活报剧照片",
    width: 880,
  },
  {
    src: `${memoryPhotoBase}/%E7%AC%AC17%E9%A1%B5-113.PNG`,
    title: "树立共产主义理想为革命勤奋学习",
    width: 1037,
  },
]

const topPhotos = memoryPhotos
const titleChars = ["流", "金", "岁", "月", "－", "回", "忆", "篇"]

export function BookSection(_props: { config: BookSectionConfig }) {
  const { ref: sectionRef, isRevealed } = useScrollReveal()

  return (
    <section
      ref={sectionRef}
      suppressHydrationWarning
      className="relative isolate overflow-hidden bg-[#F3EBDD] py-8 sm:py-9"
    >
      <div
        className="absolute inset-0 -z-10 opacity-95"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(255,252,244,0.84), rgba(238,228,211,0.82)), radial-gradient(circle at 18% 28%, rgba(92,86,78,0.14) 0 1px, transparent 2px), radial-gradient(circle at 74% 38%, rgba(70,66,60,0.12) 0 1px, transparent 2px), radial-gradient(circle at 48% 72%, rgba(154,84,64,0.1) 0 1px, transparent 2px)",
          backgroundSize: "100% 100%, 68px 68px, 92px 92px, 120px 120px",
        }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-45 mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'%3E%3Cg fill='none' stroke-linecap='round'%3E%3Cg stroke='%238c7b62' stroke-width='0.7' stroke-opacity='0.22'%3E%3Cpath d='M4 31c28-9 45 3 71-8 22-9 46-6 69 2 26 9 47-4 74-8 30-5 47 6 96-6'/%3E%3Cpath d='M-18 132c35-13 60 6 92-4 36-12 60 11 91-1 35-13 67 5 142-8'/%3E%3Cpath d='M36-8c5 21-6 37 0 58 6 19 22 32 10 59-7 18 9 36 1 73'/%3E%3Cpath d='M242-10c-8 31 17 45 8 76-8 28-31 47-7 94'/%3E%3C/g%3E%3Cg stroke='%236d665d' stroke-width='0.55' stroke-opacity='0.16'%3E%3Cpath d='M65 18c-12 8-18 20-33 18'/%3E%3Cpath d='M120 90c23-6 32-21 56-17'/%3E%3Cpath d='M214 49c13 15 29 18 46 10'/%3E%3Cpath d='M285 145c-18-10-36-11-57 2'/%3E%3Cpath d='M13 164c18-4 31-14 45-28'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(8deg, rgba(118,103,82,0.11) 0 1px, transparent 1px 34px), repeating-linear-gradient(96deg, rgba(255,255,255,0.24) 0 1px, transparent 1px 28px)",
          filter: "blur(0.2px)",
        }}
      />

      <div
        className="mx-auto mb-4 max-w-6xl px-5 transition-all duration-1000 sm:px-8"
        style={{
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? "translateY(0)" : "translateY(24px)",
        }}
      >
        <h2 className="inline-flex shadow-[0_10px_24px_rgba(117,52,38,0.18)]">
          {titleChars.map((char, index) => (
            <span
              key={`${char}-${index}`}
              className="flex h-12 w-12 items-center justify-center border-r border-white/45 bg-[#A94F3D] font-serif text-3xl font-bold leading-none text-white last:border-r-0 sm:h-14 sm:w-14 sm:text-4xl"
            >
              {char}
            </span>
          ))}
        </h2>
      </div>

      <div
        className="transition-all duration-1000"
        style={{
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? "translateY(0)" : "translateY(36px)",
          transitionDelay: "160ms",
        }}
      >
        <FilmStrip photos={topPhotos} direction="left" />
      </div>
    </section>
  )
}

function FilmStrip({ photos, direction }: { photos: MemoryPhoto[]; direction: "left" | "right" }) {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-20 bg-gradient-to-r from-[#F3EBDD] to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-20 bg-gradient-to-l from-[#F3EBDD] to-transparent sm:w-32" />
      <div className="film-strip mx-auto max-w-none bg-[#776E63]/58 py-4 shadow-[0_16px_36px_rgba(59,35,20,0.13)]">
        <div
          className={`film-track flex w-max ${
            direction === "left" ? "animate-memory-left" : "animate-memory-right"
          }`}
        >
          {[0, 1].map((groupIndex) => (
            <div key={groupIndex} className="flex shrink-0 gap-2 pr-2">
              {photos.map((photo, index) => (
                <MemoryFrame key={`${photo.src}-${groupIndex}-${index}`} photo={photo} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MemoryFrame({ photo }: { photo: MemoryPhoto }) {
  return (
    <figure
      className="group relative shrink-0 bg-[#F7F1E4] p-2 shadow-[0_8px_18px_rgba(35,25,18,0.26)]"
      style={{ width: `${Math.round((photo.width / photoHeight) * memoryFrameHeight)}px` }}
    >
      <div
        className="relative overflow-hidden bg-[#2B2722]"
        style={{ height: `${memoryFrameHeight}px` }}
      >
        <Image
          src={photo.src}
          alt={photo.title}
          fill
          sizes="260px"
          className="object-cover grayscale-[0.2] sepia-[0.18] transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_42%,rgba(62,42,24,0.18)_100%)]" />
      </div>
      <figcaption className="mt-2 flex min-h-8 items-center justify-center text-center text-[11px] leading-4 text-[#473A31]">
        {photo.title}
      </figcaption>
    </figure>
  )
}
