import { createManageSiteSetting, deleteManageSiteSetting, getManageSiteSetting, updateManageSiteSetting } from "@/lib/school-web-two-admin"
import { ok, parseJsonBody, requireManageSession, withManageHandler } from "@/lib/manage-route"
import type { SiteSetting } from "@/lib/school-web-two"
import { resolveManageWebId, updateManageSession } from "@/lib/manage-session"

export async function GET() {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const data = await getManageSiteSetting(session.token, resolveManageWebId(session))
    return ok(data)
  })
}

export async function POST(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<Partial<SiteSetting>>(request)
    const data = await createManageSiteSetting(session.token, body)
    const createdId = Number((data as { id?: number })?.id)
    if (createdId) {
      await updateManageSession({
        activeWebId: createdId,
        activeWebName: body.webName ?? "",
      })
    }
    return ok(data, "网站设置已新增", 201)
  })
}

export async function PATCH(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<Partial<SiteSetting>>(request)
    const data = await updateManageSiteSetting(session.token, body, resolveManageWebId(session))
    return ok(data, "网站设置已保存")
  })
}

export async function DELETE() {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const data = await deleteManageSiteSetting(session.token, resolveManageWebId(session))
    return ok(data, "网站已删除")
  })
}
