import { NextResponse } from "next/server"

import { buildNavigationTree } from "@/lib/public-site"
import { getPublicHomeTemplate } from "@/lib/school-web-two"
import { getPublicSiteContext, getRealtimeNavigationColumns, mergeColumnDetailLogos, resolvePublicDomainFromHost } from "@/lib/public-site-data"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const domain = resolvePublicDomainFromHost(url.searchParams.get("domain") || request.headers.get("host"))
    const context = await getPublicSiteContext(domain)
    const [{ columns, source }, template] = await Promise.all([
      getRealtimeNavigationColumns(context),
      getPublicHomeTemplate(context),
    ])
    const navigationColumns = columns.length > 0 ? columns : await mergeColumnDetailLogos(template.columnList)
    return NextResponse.json(
      {
        code: 200,
        result: true,
        data: {
          webId: context.webId,
          domain: context.domainName,
          source: columns.length > 0 ? source : "template",
          columns: navigationColumns,
          navigation: buildNavigationTree(navigationColumns).map((column) => ({
            label: column.label,
            href: column.href,
            image: column.image,
            subMenus: column.children.map((module) => ({
              label: module.label,
              href: module.href,
              children: [],
            })),
          })),
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        code: 500,
        result: false,
        msg: error instanceof Error ? error.message : "导航接口请求失败",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    )
  }
}
