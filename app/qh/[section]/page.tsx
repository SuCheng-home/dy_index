import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar } from "lucide-react"
import { QhHeader } from "@/components/qh/qh-header"
import { QhFooter } from "@/components/qh/qh-footer"
import { getQhNewsByKind } from "@/lib/qh-news-data"
import { findSectionRouteInfo, normalizeSection } from "@/lib/site-section-routing"

export default async function QhSectionPage({
  params,
}: {
  params: Promise<{ section: string }>
}) {
  const { section } = await params
  const normalizedSection = normalizeSection(section)

  const isNewsLanding = normalizedSection === "news"
  const isNoticeLanding = normalizedSection === "notice"
  const sectionInfo = findSectionRouteInfo(normalizedSection)

  if (!isNewsLanding && !isNoticeLanding && !sectionInfo) {
    notFound()
  }

  const title = isNewsLanding
    ? "新闻动态"
    : isNoticeLanding
      ? "通知公告"
      : sectionInfo!.subLabel
  const parentLabel = isNewsLanding || isNoticeLanding ? "新闻中心" : sectionInfo!.parentLabel

  const list = isNoticeLanding
    ? getQhNewsByKind("notice")
    : getQhNewsByKind("news")

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <QhHeader />
      <main className="mx-auto max-w-[1100px] px-6 pt-28 pb-16">
        <div className="mb-8 rounded-xl border border-[#E9E2EE] bg-white p-6">
          <p className="mb-2 text-sm text-[#7A6A86]">{parentLabel}</p>
          <h1 className="font-serif text-3xl font-bold text-[#222]">{title}</h1>
          {!isNewsLanding && !isNoticeLanding && (
            <p className="mt-3 text-sm text-[#666]">
              以下内容按新闻时间排序展示，点击可查看详情。
            </p>
          )}
        </div>

        <div className="space-y-3">
          {list.map((item) => (
            <Link
              key={item.id}
              href={`/qh/news/${item.id}`}
              className="block rounded-lg border border-[#E9E2EE] bg-white p-5 transition-colors hover:border-[#C9B3D8]"
            >
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="rounded-full bg-[#F1EAF6] px-2.5 py-1 text-xs text-[#5B2C6F]">
                  {item.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-[#888]">
                  <Calendar className="h-3.5 w-3.5" />
                  {item.date}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-[#1E1E1E]">{item.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-[#666]">{item.excerpt}</p>
            </Link>
          ))}
        </div>

        {!isNewsLanding && !isNoticeLanding && (
          <div className="mt-8 flex gap-3">
            <Link
              href="/qh/news"
              className="rounded-full border border-[#D7C8E2] px-4 py-2 text-sm text-[#5B2C6F] hover:bg-[#F6F1FA]"
            >
              查看新闻
            </Link>
            <Link
              href="/qh/notice"
              className="rounded-full border border-[#D7C8E2] px-4 py-2 text-sm text-[#5B2C6F] hover:bg-[#F6F1FA]"
            >
              查看公告
            </Link>
          </div>
        )}

        <div className="mt-10">
          <Link
            href="/qh"
            className="inline-flex items-center gap-2 text-sm text-[#5B2C6F] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            返回青荷首页
          </Link>
        </div>
      </main>
      <QhFooter />
    </div>
  )
}
