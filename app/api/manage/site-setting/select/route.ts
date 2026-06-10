import { updateManageSession } from "@/lib/manage-session"
import { ManageRouteError, ok, parseJsonBody, requireManageSession, withManageHandler } from "@/lib/manage-route"
import { getManageSiteSetting } from "@/lib/school-web-two-admin"

export async function PATCH(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<{ webId?: number }>(request)
    const webId = Number(body.webId)
    if (!webId) throw new ManageRouteError("缺少网站 id")
    const site = await getManageSiteSetting(session.token, webId)
    const nextSession = await updateManageSession({
      activeWebId: webId,
      activeWebName: site.webName,
    })
    return ok(nextSession)
  })
}
