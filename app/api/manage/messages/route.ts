import {
  createMessage,
  deleteMessage,
  getMessage,
  listMessages,
  updateMessage,
} from "@/lib/school-web-two-admin"
import { ManageRouteError, ok, parseJsonBody, requireManageSession, withManageHandler } from "@/lib/manage-route"
import type { SchoolWebMessage } from "@/lib/school-web-two"
import { resolveManageWebId } from "@/lib/manage-session"

export async function GET(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const { searchParams } = new URL(request.url)
    const messageId = Number(searchParams.get("messageId"))

    if (messageId) {
      const data = await getMessage(session.token, messageId)
      return ok(data)
    }

    const moduleId = Number(searchParams.get("moduleId"))
    if (!moduleId) throw new ManageRouteError("缺少模块 id")

    const data = await listMessages(session.token, {
      moduleId,
      title: searchParams.get("title") ?? "",
      pageNo: Number(searchParams.get("pageNo") ?? 1),
      pageSize: Number(searchParams.get("pageSize") ?? 20),
      state: Number(searchParams.get("state") ?? 2),
    }, resolveManageWebId(session))
    return ok(data)
  })
}

export async function POST(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<Partial<SchoolWebMessage> & { moduleIds?: string }>(request)
    if (!body.moduleIds) throw new ManageRouteError("缺少模块绑定")
    const data = await createMessage(session.token, body as Partial<SchoolWebMessage> & { moduleIds: string }, resolveManageWebId(session))
    return ok(data, "消息已新增", 201)
  })
}

export async function PATCH(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<Partial<SchoolWebMessage> & { id?: number; moduleIds?: string }>(request)
    if (!body.id || !body.moduleIds) throw new ManageRouteError("缺少消息 id 或模块绑定")
    const data = await updateMessage(session.token, body as Partial<SchoolWebMessage> & { id: number; moduleIds: string }, resolveManageWebId(session))
    return ok(data, "消息已更新")
  })
}

export async function DELETE(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const { searchParams } = new URL(request.url)
    const messageId = Number(searchParams.get("messageId"))
    if (!messageId) throw new ManageRouteError("缺少消息 id")
    const data = await deleteMessage(session.token, messageId)
    return ok(data, "消息已删除")
  })
}
