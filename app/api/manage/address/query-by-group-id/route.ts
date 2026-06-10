import { queryAddressByGroupId } from "@/lib/school-web-two-admin"
import { ManageRouteError, ok, parseJsonBody, requireManageSession, withManageHandler } from "@/lib/manage-route"

export async function POST(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<{ groupId?: number | string }>(request)
    if (body.groupId === undefined || body.groupId === null || body.groupId === "") {
      throw new ManageRouteError("缺少群组 id")
    }
    const data = await queryAddressByGroupId(session.token, body.groupId)
    return ok(data)
  })
}
