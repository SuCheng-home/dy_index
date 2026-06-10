import { listModuleMessagesByModuleId } from "@/lib/school-web-two-admin"
import { ManageRouteError, ok, requireManageSession, withManageHandler } from "@/lib/manage-route"

export async function GET(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const { searchParams } = new URL(request.url)
    const moduleId = Number(searchParams.get("moduleId"))
    if (!moduleId) throw new ManageRouteError("缺少模块 id")
    const data = await listModuleMessagesByModuleId(session.token, moduleId)
    return ok(data)
  })
}
