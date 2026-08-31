import { notFound } from "next/navigation"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ModuleMessageList } from "@/components/site/module-message-list"
import { SubPageLayout } from "@/components/sub-page-layout"
import { normalizePublicImageUrl } from "@/lib/public-site"
import { buildColumnModuleCards, filterVisibleModules, getPublicModulePage } from "@/lib/public-site-data"
import { sanitizeRichHtml } from "@/lib/sanitize-html"
import { toModuleHref } from "@/lib/school-web-two"

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
              dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(page.moduleDetail.content) }}
            />
          ) : null}

          <ModuleMessageList messages={page.messages.dataList} moduleType={page.moduleDetail.type} />
        </div>
      </SubPageLayout>
      <Footer config={page.config} />
    </>
  )
}
