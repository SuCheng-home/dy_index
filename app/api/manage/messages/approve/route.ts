import { approveMessage } from "@/lib/school-web-two-admin"
import { ManageRouteError, ok, parseJsonBody, requireManageSession, withManageHandler } from "@/lib/manage-route"

export async function POST(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<{ id?: number; state?: number; addType?: number }>(request)
    if (!body.id || body.state === undefined || body.addType === undefined) {
      throw new ManageRouteError("缺少审批参数")
    }
    const data = await approveMessage(session.token, {
      id: body.id,
      state: body.state,
      addType: body.addType,
    })
    return ok(data, "审批状态已更新")
  })
}
