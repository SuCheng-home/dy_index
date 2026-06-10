import { setManageSession } from "@/lib/manage-session"
import { ok, parseJsonBody, withManageHandler } from "@/lib/manage-route"
import { SCHOOL_WEB_TWO_CONFIG, teacherLogin, type SiteSetting } from "@/lib/school-web-two"
import { getManageSiteSettingBySchool } from "@/lib/school-web-two-admin"

export async function POST(request: Request) {
  return withManageHandler(async () => {
    const body = await parseJsonBody<{ account?: string; password?: string }>(request)
    const session = await teacherLogin(body.account ?? "", body.password ?? "")
    const siteResult = await getManageSiteSettingBySchool(session.token)
    const siteList = Array.isArray(siteResult) ? siteResult : siteResult ? [siteResult] : []
    const activeSite = siteList.find((site: SiteSetting) => Number(site.id) === SCHOOL_WEB_TWO_CONFIG.webId) ?? siteList[0]
    const nextSession = {
      ...session,
      activeWebId: activeSite?.id ?? SCHOOL_WEB_TWO_CONFIG.webId,
      activeWebName: activeSite?.webName ?? "",
    }
    await setManageSession(nextSession)
    return ok(nextSession, "登录成功")
  })
}
