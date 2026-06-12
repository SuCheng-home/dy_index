import { NextResponse } from "next/server"

import { setManageSession } from "@/lib/manage-session"
import { ok, parseJsonBody, withManageHandler } from "@/lib/manage-route"
import { SCHOOL_WEB_TWO_CONFIG, buildManageSessionFromLoginData, isSchoolWebSuccess, teacherLoginRaw, type SiteSetting } from "@/lib/school-web-two"
import { getManageSiteSettingBySchool } from "@/lib/school-web-two-admin"

export async function POST(request: Request) {
  return withManageHandler(async () => {
    const body = await parseJsonBody<{ account?: string; password?: string; encryptedPassword?: string }>(request)
    const loginResult = await teacherLoginRaw(body.account ?? "", body.password ?? "", body.encryptedPassword)

    if (!isSchoolWebSuccess(loginResult)) {
      return NextResponse.json(loginResult)
    }

    if (!loginResult.data?.token) {
      return NextResponse.json({
        result: false,
        code: loginResult.code ?? 500,
        msg: loginResult.msg || "登录失败",
        data: loginResult.data ?? null,
      })
    }

    const session = buildManageSessionFromLoginData(loginResult.data, body.account ?? "")
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
