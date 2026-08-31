import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ModuleMessageList } from "@/components/site/module-message-list"
import { SubPageLayout } from "@/components/sub-page-layout"
import { getPublicModulePage, getPublicSiteSnapshot } from "@/lib/public-site-data"

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

  const modulePage = await getPublicModulePage(newsColumn.id, newsModule.id)

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
        <ModuleMessageList
          messages={modulePage.messages.dataList}
          moduleType={newsModule.type}
          badgeLabel={newsModule.name}
        />
      </SubPageLayout>
      <Footer config={snapshot.config} />
    </>
  )
}
