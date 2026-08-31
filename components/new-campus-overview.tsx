"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { useAnimationActivity } from "@/hooks/use-animation-activity"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { FilmLightbox, type FilmLightboxPhoto } from "@/components/home-film-lightbox"

type FilmPhoto = {
  src: string
  alt: string
  caption: string
  original?: string
}

const todayOriginalBase = "/school_view/（提取图片）9.24省丹中画册-定稿"

const todayPhotos: FilmPhoto[] = [
  { src: "/optimized/home/today/today-dacheng-hall.jpg", alt: "大成殿", caption: "大成殿" },
  { src: "/optimized/home/today/today-confucius.jpg", alt: "孔子像", caption: "孔子像" },
  { src: "/optimized/home/today/today-xuesi-bridge.jpg", alt: "学思桥", caption: "学思桥" },
  { src: "/optimized/home/today/today-campus-corner.jpg", alt: "校园一角", caption: "校园一角" },
  { src: "/optimized/home/today/today-archway.jpg", alt: "牌坊", caption: "牌坊" },
  { src: "/optimized/home/today/today-huanqing-bridge.jpg", alt: "环青桥", caption: "环青桥" },
  { src: "/optimized/home/today/today-basketball-court.jpg", alt: "篮球场", caption: "篮球场" },
  { src: "/optimized/home/today/today-suocui-bridge.jpg", alt: "锁翠桥", caption: "锁翠桥" },
]

const futureImages = [
  {
    src: "/optimized/home/future/future-aerial-1600.jpg",
    mobileSrc: "/optimized/home/future/future-aerial-960.jpg",
    original: `${todayOriginalBase}/第21页-149.PNG`,
    alt: "丹中新校区鸟瞰总平面",
    caption: "新校区鸟瞰",
  },
  {
    src: "/optimized/home/future/future-axis-1600.jpg",
    mobileSrc: "/optimized/home/future/future-axis-960.jpg",
    original: `${todayOriginalBase}/第21页-150.PNG`,
    alt: "丹中新校区校园中轴鸟瞰",
    caption: "新校区中轴",
  },
]

const futureDescription =
  "为推进省丹中高品质示范高中建设，2020年丹阳市委市政府积极推动在练湖生态度假区建设丹中新校区。我们将以“未来学校”的架构为切入点，积极打造以人为本、功能完善、生态和谐、以传统文化为基调、以现代科技为引领的“一校两区”发展新格局。"

const todayTitleChars = ["风", "华", "正", "茂", "—", "今", "日", "校", "园"]
const futureTitleChars = ["继", "往", "开", "来", "—", "新", "区", "展", "望"]
export function NewCampusOverview() {
  const { ref, isRevealed } = useScrollReveal({ threshold: 0.12, rootMargin: "0px 0px -80px 0px" })
  const isAnimationActive = useAnimationActivity(ref)
  const [lightboxPhoto, setLightboxPhoto] = useState<FilmLightboxPhoto | null>(null)
  const closeLightbox = useCallback(() => setLightboxPhoto(null), [])
  const openLightbox = useCallback((photo: FilmPhoto) => {
    setLightboxPhoto({ src: photo.original || photo.src, title: photo.caption || photo.alt })
  }, [])

  return (
    <section
      ref={ref}
      suppressHydrationWarning
      className={`relative isolate overflow-hidden bg-[#F3EBDD] pb-9 pt-0 sm:pb-10 ${isAnimationActive ? "" : "home-animation-paused"}`}
    >
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,#F3EBDD_0%,#F6E7D3_42%,#F9F2E8_100%)]" />
      <div
        className="absolute inset-0 -z-10 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 18%, rgba(169,79,61,0.12), transparent 30%), radial-gradient(circle at 82% 42%, rgba(202,161,116,0.18), transparent 34%), radial-gradient(circle at 50% 100%, rgba(214,182,130,0.18), transparent 36%)",
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[86vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#A94F3D]/34 to-transparent" />

      <div
        className="space-y-6 transition-all duration-1000"
        style={{
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? "translateY(0)" : "translateY(36px)",
        }}
      >
        <TodayCampusFilm onOpen={openLightbox} />
        <FutureCampusFilm onOpen={openLightbox} />
      </div>
      <FilmLightbox photo={lightboxPhoto} onClose={closeLightbox} />
    </section>
  )
}

function TodayCampusFilm({ onOpen }: { onOpen: (photo: FilmPhoto) => void }) {
  return (
    <div className="relative">
      <div className="mx-auto mb-4 flex max-w-6xl justify-center px-4 sm:px-8">
        <BlockTitle chars={todayTitleChars} className="max-w-full" />
      </div>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-10 bg-gradient-to-r from-[#F4E6D2] to-transparent sm:w-20 lg:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-10 bg-gradient-to-l from-[#F4E6D2] to-transparent sm:w-20 lg:w-32" />
        <div className="story-film-strip bg-[#776E63]/54 py-3 shadow-[0_16px_36px_rgba(59,35,20,0.13)]">
          <div className="story-film-track flex w-max animate-story-film-left">
            {[0, 1].map((groupIndex) => (
              <div key={groupIndex} className="flex shrink-0 gap-2 pr-2">
                {todayPhotos.map((photo, index) => (
                  <StoryFilmFrame key={`${photo.src}-${groupIndex}-${index}`} photo={photo} onOpen={onOpen} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FutureCampusFilm({ onOpen }: { onOpen: (photo: FilmPhoto) => void }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-8">
      <div className="mb-4 flex justify-end">
        <BlockTitle chars={futureTitleChars} className="max-w-full" />
      </div>

      <div className="grid gap-5 sm:gap-7 lg:grid-cols-[1.48fr_0.52fr] lg:items-center">
        <div className="future-film-panel">
          <div className="future-film-window">
            {futureImages.map((image, index) => (
              <button
                key={image.src}
                type="button"
                className={`absolute inset-0 block h-full w-full cursor-zoom-in ${index === 0 ? "animate-future-slide-one" : "animate-future-slide-two"}`}
                onClick={() => onOpen(image)}
                title="点击查看原图"
                aria-label={`查看原图：${image.alt}`}
                tabIndex={index === 0 ? 0 : -1}
              >
                <picture>
                  <source media="(max-width: 1023px)" srcSet={image.mobileSrc} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </picture>
              </button>
            ))}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,233,0.08),rgba(70,44,22,0.1))]" />
          </div>
        </div>

        <div className="flex justify-end">
          <div className="max-w-[560px] border-l border-[#A94F3D]/36 pl-4 text-left sm:pl-6 lg:max-w-[410px]">
            <p className="font-serif text-[16px] font-semibold leading-8 tracking-normal text-[#594431] sm:text-[18px] sm:leading-9 lg:text-[19px] lg:leading-10">
              <span className="text-[1.12em] text-[#A94F3D]">为推进省丹中高品质示范高中建设，</span>
              2020年丹阳市委市政府积极推动在练湖生态度假区建设丹中新校区。我们将以“未来学校”的架构为切入点，积极打造以人为本、功能完善、生态和谐、以传统文化为基调、以现代科技为引领的“一校两区”发展新格局。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StoryFilmFrame({ photo, onOpen }: { photo: FilmPhoto; onOpen: (photo: FilmPhoto) => void }) {
  return (
    <figure className="group relative w-[150px] shrink-0 bg-[#FFF8E9] p-1.5 shadow-[0_8px_18px_rgba(48,35,20,0.16)] sm:w-[190px]">
      <button
        type="button"
        className="block w-full cursor-zoom-in"
        onClick={() => onOpen(photo)}
        title="点击查看原图"
        aria-label={`查看原图：${photo.caption}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#3D372A]">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="300px"
            loading="lazy"
            decoding="async"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(37,30,18,0.18)_100%)]" />
        </div>
        <figcaption className="mt-1.5 h-5 text-center font-serif text-xs font-semibold tracking-[0.12em] text-[#5D4A35]">
          {photo.caption}
        </figcaption>
      </button>
    </figure>
  )
}

function BlockTitle({ chars, className = "" }: { chars: string[]; className?: string }) {
  const content = chars.map((char, index) => (
    <span
      key={`${char}-${index}`}
      className="flex aspect-square min-w-0 items-center justify-center border-r border-white/45 bg-[#A94F3D] font-serif text-[clamp(1.15rem,6.5vw,2.25rem)] font-bold leading-none text-white last:border-r-0"
    >
      {char}
    </span>
  ))

  return (
    <h2
      className={`grid w-full shadow-[0_10px_24px_rgba(117,52,38,0.18)] ${className}`}
      style={{ gridTemplateColumns: `repeat(${chars.length}, minmax(0, 1fr))`, maxWidth: `${chars.length * 56}px` }}
    >
      {content}
    </h2>
  )
}
