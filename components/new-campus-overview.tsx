"use client"

import Image from "next/image"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

type FilmPhoto = {
  src: string
  alt: string
  caption: string
}

const todayPhotos: FilmPhoto[] = [
  {
    src: "https://cdnfile-10043692.file.myqcloud.com/productVersion/common/danyang/省丹中画册/2.砚池春秋 薪火相传/%E7%AC%AC20%E9%A1%B5-145.PNG",
    alt: "校园全景",
    caption: "校园全景",
  },
  {
    src: "https://cdnfile-10043692.file.myqcloud.com/productVersion/common/danyang/省丹中画册/2.砚池春秋 薪火相传/%E7%AC%AC20%E9%A1%B5-140.PNG",
    alt: "古殿新姿",
    caption: "古殿新姿",
  },
  {
    src: "https://cdnfile-10043692.file.myqcloud.com/productVersion/common/danyang/省丹中画册/2.砚池春秋 薪火相传/%E7%AC%AC20%E9%A1%B5-139.PNG",
    alt: "牌坊",
    caption: "牌坊",
  },
  {
    src: "https://cdnfile-10043692.file.myqcloud.com/productVersion/common/danyang/省丹中画册/2.砚池春秋 薪火相传/%E7%AC%AC20%E9%A1%B5-141.PNG",
    alt: "锦绣 笔架山",
    caption: "锦绣 笔架山",
  },
  {
    src: "https://cdnfile-10043692.file.myqcloud.com/productVersion/common/danyang/省丹中画册/2.砚池春秋 薪火相传/%E7%AC%AC20%E9%A1%B5-142.PNG",
    alt: "体育馆与田径场一角",
    caption: "体育馆与田径场一角",
  },
  {
    src: "https://cdnfile-10043692.file.myqcloud.com/productVersion/common/danyang/省丹中画册/2.砚池春秋 薪火相传/%E7%AC%AC20%E9%A1%B5-143.PNG",
    alt: "晚霞中的来秀楼",
    caption: "晚霞中的来秀楼",
  },
  {
    src: "https://cdnfile-10043692.file.myqcloud.com/productVersion/common/danyang/省丹中画册/2.砚池春秋 薪火相传/%E7%AC%AC20%E9%A1%B5-146.PNG",
    alt: "学思桥",
    caption: "学思桥",
  },
  {
    src: "https://cdnfile-10043692.file.myqcloud.com/productVersion/common/danyang/省丹中画册/2.砚池春秋 薪火相传/%E7%AC%AC20%E9%A1%B5-147.PNG",
    alt: "砚池水畔春来早",
    caption: "砚池水畔春来早",
  },
]

const futureImages: FilmPhoto[] = [
  {
    src: "https://cdnfile-10043692.file.myqcloud.com/productVersion/common/danyang/省丹中画册/%E7%AC%AC21%E9%A1%B5-149.PNG",
    alt: "丹中新校区鸟瞰总平面",
    caption: "新校区鸟瞰",
  },
  {
    src: "https://cdnfile-10043692.file.myqcloud.com/productVersion/common/danyang/省丹中画册/%E7%AC%AC21%E9%A1%B5-150.PNG",
    alt: "丹中新校区校园中轴鸟瞰",
    caption: "新校区中轴",
  },
]

const futureDescription =
  "为推进省丹中高品质示范高中建设，2020年丹阳市委市政府积极推动在练湖生态度假区建设丹中新校区。我们将以“未来学校”的架构为切入点，积极打造以人为本、功能完善、生态和谐、以传统文化为基调、以现代科技为引领的“一校两区”发展新格局。"

const todayTitleChars = ["风", "华", "正", "茂", "—", "今", "日", "校", "园"]
const futureTitleChars = ["继", "往", "开", "来", "—", "新", "区", "展", "望"]
const todayFilmLoopPhotos = [...todayPhotos, ...todayPhotos]

export function NewCampusOverview() {
  const { ref, isRevealed } = useScrollReveal({ threshold: 0.12, rootMargin: "0px 0px -80px 0px" })

  return (
    <section ref={ref} suppressHydrationWarning className="relative isolate overflow-hidden bg-[#F3EBDD] pb-9 pt-0 sm:pb-10">
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
        <TodayCampusFilm />
        <FutureCampusFilm />
      </div>
    </section>
  )
}

function TodayCampusFilm() {
  return (
    <div className="relative">
      <div className="mx-auto mb-4 flex max-w-6xl justify-center px-5 sm:px-8">
        <BlockTitle chars={todayTitleChars} className="max-w-full" />
      </div>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-20 bg-gradient-to-r from-[#F4E6D2] to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-20 bg-gradient-to-l from-[#F4E6D2] to-transparent sm:w-32" />
        <div className="story-film-strip bg-[#776E63]/54 py-3 shadow-[0_16px_36px_rgba(59,35,20,0.13)]">
          <div className="story-film-track flex w-max animate-story-film-left">
            {[0, 1].map((groupIndex) => (
              <div key={groupIndex} className="flex shrink-0 gap-2 pr-2">
                {todayFilmLoopPhotos.map((photo, index) => (
                  <StoryFilmFrame key={`${photo.src}-${groupIndex}-${index}`} photo={photo} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FutureCampusFilm() {
  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <div className="mb-4 flex justify-end">
        <BlockTitle chars={futureTitleChars} className="max-w-full" />
      </div>

      <div className="grid gap-7 lg:grid-cols-[1.48fr_0.52fr] lg:items-center">
        <div className="future-film-panel">
          <div className="future-film-window">
            {futureImages.map((image, index) => (
              <Image
                key={image.src}
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 52vw, 92vw"
                className={`object-cover ${index === 0 ? "animate-future-slide-one" : "animate-future-slide-two"}`}
              />
            ))}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,233,0.08),rgba(70,44,22,0.1))]" />
          </div>
        </div>

        <div className="flex justify-end">
          <div className="max-w-[410px] border-l border-[#A94F3D]/36 pl-5 text-left sm:pl-6">
            <p className="font-serif text-[17px] font-semibold leading-9 tracking-normal text-[#594431] sm:text-[19px] sm:leading-10">
              <span className="text-[1.12em] text-[#A94F3D]">为推进省丹中高品质示范高中建设，</span>
              2020年丹阳市委市政府积极推动在练湖生态度假区建设丹中新校区。我们将以“未来学校”的架构为切入点，积极打造以人为本、功能完善、生态和谐、以传统文化为基调、以现代科技为引领的“一校两区”发展新格局。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StoryFilmFrame({ photo }: { photo: FilmPhoto }) {
  return (
    <figure className="group relative w-[190px] shrink-0 bg-[#FFF8E9] p-1.5 shadow-[0_8px_18px_rgba(48,35,20,0.16)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#3D372A]">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="300px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(37,30,18,0.18)_100%)]" />
      </div>
      <figcaption className="mt-1.5 h-5 text-center font-serif text-xs font-semibold tracking-[0.12em] text-[#5D4A35]">
        {photo.caption}
      </figcaption>
    </figure>
  )
}

function BlockTitle({ chars, className = "" }: { chars: string[]; className?: string }) {
  const content = chars.map((char, index) => (
    <span
      key={`${char}-${index}`}
      className="flex h-12 w-12 items-center justify-center border-r border-white/45 bg-[#A94F3D] font-serif text-3xl font-bold leading-none text-white last:border-r-0 sm:h-14 sm:w-14 sm:text-4xl"
    >
      {char}
    </span>
  ))

  return (
    <h2 className={`flex flex-wrap shadow-[0_10px_24px_rgba(117,52,38,0.18)] ${className}`}>
      {content}
    </h2>
  )
}
