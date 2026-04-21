import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, ChevronLeft } from "lucide-react"
import BdHeader from "@/components/bd/bd-header"
import BdFooter from "@/components/bd/bd-footer"
import { getBdNewsByKind } from "@/lib/bd-news-data"
import { findSectionRouteInfo, normalizeSection } from "@/lib/site-section-routing"

export const metadata: Metadata = {
  title: "栏目动态 - 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学栏目动态与新闻列表",
}

export default async function BdSectionPage({
  params,
}: {
  params: Promise<{ section: string }>
}) {
  const { section } = await params
  const normalizedSection = normalizeSection(section)
  const sectionInfo = findSectionRouteInfo(normalizedSection)
  const isNewsLanding = normalizedSection === "news"

  if (!sectionInfo && !isNewsLanding) {
    notFound()
  }

  const list = isNewsLanding
    ? [...getBdNewsByKind("news"), ...getBdNewsByKind("notice")]
    : [...getBdNewsByKind("news"), ...getBdNewsByKind("notice")]

  const title = isNewsLanding ? "新闻公告" : sectionInfo!.subLabel
  const parent = isNewsLanding ? "新闻中心" : sectionInfo!.parentLabel

  return (
    <div className="min-h-screen bg-white">
      <BdHeader />
      <main className="pt-[128px]">
        <div className="mx-auto max-w-[1100px] px-8 py-12">
          <div className="mb-8 border-b pb-5" style={{ borderColor: "#eee" }}>
            <p className="text-sm" style={{ color: "#999" }}>
              {parent}
            </p>
            <h1 className="mt-2 text-3xl font-serif font-bold" style={{ color: "#222" }}>
              {title}
            </h1>
          </div>

          <div className="space-y-4">
            {list.map((item) => (
              <Link
                key={item.id}
                href={`/bd/news/${item.id}`}
                className="block rounded-sm border p-5 transition-colors hover:border-[#d6c0a0]"
                style={{ borderColor: "#eee" }}
              >
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span
                    className="rounded-sm px-2 py-0.5 text-xs"
                    style={{ backgroundColor: "rgba(139,26,26,0.08)", color: "#8B1A1A" }}
                  >
                    {item.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: "#999" }}>
                    <Calendar className="h-3.5 w-3.5" />
                    {item.date}
                  </span>
                </div>
                <h2 className="text-lg font-medium" style={{ color: "#222" }}>
                  {item.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm" style={{ color: "#666" }}>
                  {item.summary}
                </p>
              </Link>
            ))}
          </div>

          <Link
            href="/bd"
            className="mt-10 inline-flex items-center gap-1 text-sm transition-colors hover:text-[#8B1A1A]"
            style={{ color: "#666" }}
          >
            <ChevronLeft className="h-4 w-4" />
            返回丹中首页
          </Link>
        </div>
      </main>
      <BdFooter />
    </div>
  )
}
