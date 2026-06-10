import { createColumn, deleteColumn, getColumn, listColumns, updateColumn } from "@/lib/school-web-two-admin"
import { ManageRouteError, ok, parseJsonBody, requireManageSession, withManageHandler } from "@/lib/manage-route"
import type { SchoolWebColumn } from "@/lib/school-web-two"
import { resolveManageWebId } from "@/lib/manage-session"

export async function GET(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const { searchParams } = new URL(request.url)
    const columnId = Number(searchParams.get("columnId"))
    if (columnId) {
      const data = await getColumn(session.token, columnId)
      return ok(data)
    }
    const data = await listColumns(session.token, resolveManageWebId(session))
    return ok(data)
  })
}

export async function POST(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<Partial<SchoolWebColumn>>(request)
    const data = await createColumn(session.token, body, resolveManageWebId(session))
    return ok(data, "栏目已新增", 201)
  })
}

export async function PATCH(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<Partial<SchoolWebColumn> & { id?: number }>(request)
    if (!body.id) throw new ManageRouteError("缺少栏目 id")
    const data = await updateColumn(session.token, body as Partial<SchoolWebColumn> & { id: number }, resolveManageWebId(session))
    return ok(data, "栏目已更新")
  })
}

export async function DELETE(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const { searchParams } = new URL(request.url)
    const columnId = Number(searchParams.get("columnId"))
    if (!columnId) throw new ManageRouteError("缺少栏目 id")
    const data = await deleteColumn(session.token, columnId)
    return ok(data, "栏目已删除")
  })
}
