import Link from "next/link"
import Image from "next/image"
import { Calendar, Eye } from "lucide-react"
import { notFound } from "next/navigation"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { SubPageLayout } from "@/components/sub-page-layout"
import { normalizePublicImageUrl } from "@/lib/public-site"
import { buildColumnModuleCards, filterVisibleModules, getPublicModulePage } from "@/lib/public-site-data"
import { toMessageHref, toModuleHref } from "@/lib/school-web-two"

export const dynamic = "force-dynamic"

export default async function SiteModulePage({
  params,
}: {
  params: Promise<{ columnId: string; moduleId: string }>
}) {
  const { columnId, moduleId } = await params
  const parsedColumnId = Number(columnId)
  const parsedModuleId = Number(moduleId)
  if (!parsedColumnId || !parsedModuleId) notFound()

  const page = await getPublicModulePage(parsedColumnId, parsedModuleId)
  if (!page.columnSummary || !page.moduleDetail) notFound()

  const visibleModules = filterVisibleModules(buildColumnModuleCards(page.columnSummary, []))
  const sidebarItems = visibleModules.map((module) => ({
    label: module.name,
    href: module.type === 4 && module.columnUrl ? module.columnUrl : toModuleHref(page.columnSummary!.id, module.id),
  }))
  const columnNavImage = page.navigationTree.find((item) => item.id === page.columnSummary?.id)?.image || ""
  const columnBannerImage = normalizePublicImageUrl(page.columnSummary.logoUrl) || columnNavImage || page.config.hero.images[0]?.src

  return (
    <>
      <Header variant="home" config={page.config} />
      <SubPageLayout
        title={page.moduleDetail.name}
        subtitle="Module"
        breadcrumbs={[{ label: page.columnSummary.name, href: `/site/${page.columnSummary.id}` }, { label: page.moduleDetail.name }]}
        sidebarItems={sidebarItems}
        bannerImage={columnBannerImage}
      >
        <div className="space-y-8">
          {page.moduleDetail.content ? (
            <div
              className="school-web-richtext prose prose-lg max-w-none text-[#555] [&_img]:h-auto [&_img]:max-w-full [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: page.moduleDetail.content }}
            />
          ) : null}

          {page.moduleDetail.type === 3 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {page.messages.dataList.map((item) => (
                <Link key={item.id} href={toMessageHref(item.id)} className="group overflow-hidden rounded-xl bg-[#F8F4ED] shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  {item.logoUrl ? (
                    <div className="relative h-56">
                      <Image src={item.logoUrl} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  ) : null}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-[#333]">{item.title}</h3>
                    {item.titleMark ? <p className="mt-2 text-sm text-[#666]">{item.titleMark}</p> : null}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid gap-6">
              {page.messages.dataList.map((item) => (
                <Link
                  key={item.id}
                  href={toMessageHref(item.id)}
                  className="group flex flex-col gap-5 rounded-xl bg-[#F8F4ED] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:flex-row"
                >
                  {item.logoUrl ? (
                    <div className="relative h-44 w-full overflow-hidden rounded-lg sm:h-32 sm:w-48 shrink-0">
                      <Image
                        src={item.logoUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-[#333] transition-colors group-hover:text-[#8B1A1A]">{item.title}</h3>
                      {item.titleMark ? <p className="mt-2 text-sm leading-6 text-[#666]">{item.titleMark}</p> : null}
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-[#999]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {item.createTime.slice(0, 10)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {item.readCount ?? 0}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </SubPageLayout>
      <Footer config={page.config} />
    </>
  )
}
