import { createModule, deleteModule, getModule, listAllModules, listModulesByColumn, updateModule } from "@/lib/school-web-two-admin"
import { ManageRouteError, ok, parseJsonBody, requireManageSession, withManageHandler } from "@/lib/manage-route"
import type { SchoolWebModule } from "@/lib/school-web-two"
import { resolveManageWebId } from "@/lib/manage-session"

export async function GET(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const { searchParams } = new URL(request.url)
    const moduleId = Number(searchParams.get("moduleId"))
    if (moduleId) {
      const data = await getModule(session.token, moduleId)
      return ok(data)
    }
    const columnId = Number(searchParams.get("columnId"))
    const data = columnId
      ? await listModulesByColumn(session.token, columnId)
      : await listAllModules(session.token, resolveManageWebId(session))
    return ok(data)
  })
}

export async function POST(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<Partial<SchoolWebModule>>(request)
    const data = await createModule(session.token, body, resolveManageWebId(session))
    return ok(data, "模块已新增", 201)
  })
}

export async function PATCH(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<Partial<SchoolWebModule> & { id?: number }>(request)
    if (!body.id) throw new ManageRouteError("缺少模块 id")
    const data = await updateModule(session.token, body as Partial<SchoolWebModule> & { id: number }, resolveManageWebId(session))
    return ok(data, "模块已更新")
  })
}

export async function DELETE(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const { searchParams } = new URL(request.url)
    const moduleId = Number(searchParams.get("moduleId"))
    if (!moduleId) throw new ManageRouteError("缺少模块 id")
    const data = await deleteModule(session.token, moduleId)
    return ok(data, "模块已删除")
  })
}
