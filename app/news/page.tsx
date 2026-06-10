import Link from "next/link"
import Image from "next/image"
import { Calendar, Eye } from "lucide-react"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { SubPageLayout } from "@/components/sub-page-layout"
import { getPublicModulePage, getPublicSiteSnapshot } from "@/lib/public-site-data"
import { toMessageHref } from "@/lib/school-web-two"

export const dynamic = "force-dynamic"

export default async function NewsPage() {
  const snapshot = await getPublicSiteSnapshot()
  const newsColumn = snapshot.template.columnList[0]
  const newsModule = newsColumn?.moduleList[0]

  if (!newsColumn || !newsModule) {
    return (
      <>
        <Header config={snapshot.config} />
        <SubPageLayout title="新闻中心" subtitle="News Center" breadcrumbs={[{ label: "新闻中心" }]}>
          <div className="rounded-xl border border-[#E8DCC8] bg-[#F8F4ED] p-10 text-center text-[#666]">
            当前网站尚未配置新闻模块。
          </div>
        </SubPageLayout>
        <Footer config={snapshot.config} />
      </>
    )
  }

  const modulePage = await getPublicModulePage(newsColumn.id, newsModule.id, 1, 30)

  return (
    <>
      <Header config={snapshot.config} />
      <SubPageLayout
        title={newsModule.name}
        subtitle="News Center"
        breadcrumbs={[{ label: newsColumn.name, href: `/site/${newsColumn.id}` }, { label: newsModule.name }]}
        sidebarItems={(newsColumn.moduleList ?? []).map((module) => ({
          label: module.name,
          href: `/site/${newsColumn.id}/${module.id}`,
        }))}
        bannerImage={snapshot.config.hero.images[0]?.src}
      >
        <div className="grid gap-6">
          {modulePage.messages.dataList.map((news) => (
            <Link
              key={news.id}
              href={toMessageHref(news.id)}
              className="group flex flex-col gap-5 rounded-xl bg-[#FDFBF7] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:flex-row"
            >
              {news.logoUrl ? (
                <div className="relative h-48 w-full overflow-hidden rounded-lg sm:h-40 sm:w-60 shrink-0">
                  <Image
                    src={news.logoUrl}
                    alt={news.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="rounded bg-[#D4AF37]/20 px-2 py-0.5 text-xs font-medium text-[#8B1A1A]">
                      {newsModule.name}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-[#333] transition-colors group-hover:text-[#8B1A1A]">
                    {news.title}
                  </h3>
                  {news.titleMark ? <p className="line-clamp-2 text-sm text-[#666]">{news.titleMark}</p> : null}
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-[#999]">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {news.createTime.slice(0, 10)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {news.readCount ?? 0}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </SubPageLayout>
      <Footer config={snapshot.config} />
    </>
  )
}
