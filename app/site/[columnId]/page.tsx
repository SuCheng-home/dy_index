import { notFound, redirect } from "next/navigation"

import { buildColumnModuleCards, filterVisibleModules, getPublicColumnPage } from "@/lib/public-site-data"
import { toModuleHref } from "@/lib/school-web-two"

export const dynamic = "force-dynamic"

export default async function SiteColumnPage({
  params,
}: {
  params: Promise<{ columnId: string }>
}) {
  const { columnId } = await params
  const id = Number(columnId)
  if (!id) notFound()

  const page = await getPublicColumnPage(id)
  const columnSummary = page.columnSummary
  const columnDetail = page.columnDetail
  if (!columnSummary || !columnDetail) notFound()

  const visibleModules = filterVisibleModules(buildColumnModuleCards(columnSummary, columnDetail.moduleList ?? []))
  const firstModule = visibleModules[0]
  if (firstModule) {
    const firstHref = firstModule.type === 4 && firstModule.columnUrl
      ? firstModule.columnUrl
      : toModuleHref(columnSummary.id, firstModule.id)
    redirect(firstHref)
  }

  notFound()
}
