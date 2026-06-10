import { batchDeleteMessages } from "@/lib/school-web-two-admin"
import { ManageRouteError, ok, parseJsonBody, requireManageSession, withManageHandler } from "@/lib/manage-route"

export async function POST(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<{ messageIds?: string }>(request)
    if (!body.messageIds) throw new ManageRouteError("缺少消息 ids")
    const data = await batchDeleteMessages(session.token, body.messageIds)
    return ok(data, "消息已批量删除")
  })
}
