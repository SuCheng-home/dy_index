"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Loader2, X } from "lucide-react"

export type FilmLightboxPhoto = {
  src: string
  title: string
}

/**
 * 首页胶卷照片原图预览灯箱。
 * 通过 portal 渲染到 body，避免胶卷区块的 transform/overflow 影响 fixed 定位。
 */
export function FilmLightbox({
  photo,
  onClose,
}: {
  photo: FilmLightboxPhoto | null
  onClose: () => void
}) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
  }, [photo?.src])

  useEffect(() => {
    if (!photo) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [photo, onClose])

  if (!photo) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#160B07]/90 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`查看原图：${photo.title}`}
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#F5E6D3] transition-colors hover:bg-[#D4AF37] hover:text-[#2A0A0A] sm:right-6 sm:top-6"
        onClick={onClose}
        aria-label="关闭原图预览"
      >
        <X className="h-5 w-5" />
      </button>

      <figure
        className="flex max-h-full max-w-full flex-col items-center"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative flex min-h-[220px] min-w-[260px] items-center justify-center bg-[#FFF8E9] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.45)] sm:p-3">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-[#5D4A35]">
              <Loader2 className="h-4 w-4 animate-spin" />
              原图加载中…
            </div>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt={photo.title}
            className={`max-h-[76vh] max-w-[90vw] object-contain transition-opacity duration-300 sm:max-w-[84vw] ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setLoaded(true)}
          />
        </div>
        <figcaption className="mt-3 max-w-[90vw] text-center text-sm leading-6 text-[#F5E6D3]/85">
          {photo.title}
        </figcaption>
      </figure>
    </div>,
    document.body,
  )
}
