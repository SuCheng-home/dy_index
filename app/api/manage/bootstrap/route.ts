import {
  getColumn,
  getManageSiteSetting,
  getManageSiteSettingBySchool,
  getMbTwTemplate,
  getPcTwTemplate,
  listAllModules,
  listColumns,
} from "@/lib/school-web-two-admin"
import { ok, requireManageSession, withManageHandler } from "@/lib/manage-route"
import { resolveManageWebId, setManageSession } from "@/lib/manage-session"
import { SCHOOL_WEB_TWO_CONFIG, type SiteSetting } from "@/lib/school-web-two"

export async function GET() {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const siteResult = await getManageSiteSettingBySchool(session.token)
    const siteList = Array.isArray(siteResult) ? siteResult : siteResult ? [siteResult] : []
    const activeSite = siteList.find((site: SiteSetting) => Number(site.id) === resolveManageWebId(session))
      ?? siteList.find((site: SiteSetting) => Number(site.id) === SCHOOL_WEB_TWO_CONFIG.webId)
      ?? siteList[0]
    const activeWebId = Number(activeSite?.id ?? resolveManageWebId(session))
    const activeSession = {
      ...session,
      activeWebId,
      activeWebName: activeSite?.webName ?? session.activeWebName ?? "",
    }
    await setManageSession(activeSession)

    const columns = await listColumns(session.token, activeWebId)
    const moduleGroups = await listAllModules(session.token, activeWebId)
    const firstColumn = columns[0]

    const [siteSetting, pcTemplate, mbTemplate, sampleColumn] = await Promise.all([
      getManageSiteSetting(session.token, activeWebId),
      getPcTwTemplate(session.token, activeWebId),
      getMbTwTemplate(session.token, activeWebId),
      firstColumn ? getColumn(session.token, firstColumn.id) : Promise.resolve(null),
    ])

    return ok({
      session: activeSession,
      siteList,
      activeWebId,
      siteSetting,
      columns,
      moduleGroups,
      pcTemplate,
      mbTemplate,
      sampleColumn,
    })
  })
}
