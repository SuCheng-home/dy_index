import { moveMessages } from "@/lib/school-web-two-admin"
import { ManageRouteError, ok, parseJsonBody, requireManageSession, withManageHandler } from "@/lib/manage-route"

export async function POST(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<{ messageIds?: string; moduleIds?: string }>(request)
    if (!body.messageIds || !body.moduleIds) throw new ManageRouteError("缺少移动参数")
    const data = await moveMessages(session.token, body.messageIds, body.moduleIds)
    return ok(data, "消息已移动")
  })
}
