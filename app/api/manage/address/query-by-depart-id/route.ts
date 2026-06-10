import { queryAddressByDepartId } from "@/lib/school-web-two-admin"
import { ManageRouteError, ok, parseJsonBody, requireManageSession, withManageHandler } from "@/lib/manage-route"

export async function POST(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<{ departId?: number | string; userTypes?: string }>(request)
    if (body.departId === undefined || body.departId === null || body.departId === "") {
      throw new ManageRouteError("缺少部门 id")
    }
    const data = await queryAddressByDepartId(session.token, body.departId, body.userTypes ?? "1")
    return ok(data)
  })
}
