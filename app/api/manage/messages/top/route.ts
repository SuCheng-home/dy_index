import { topMessage } from "@/lib/school-web-two-admin"
import { ManageRouteError, ok, parseJsonBody, requireManageSession, withManageHandler } from "@/lib/manage-route"

export async function POST(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<{ messageId?: number; ropAndDownState?: number }>(request)
    if (!body.messageId || body.ropAndDownState === undefined) {
      throw new ManageRouteError("缺少置顶参数")
    }
    const data = await topMessage(session.token, body.messageId, body.ropAndDownState)
    return ok(data, "置顶状态已更新")
  })
}
