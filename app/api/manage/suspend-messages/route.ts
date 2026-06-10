import {
  batchDeleteSuspendMessages,
  createSuspendMessage,
  deleteSuspendMessage,
  getSuspendMessage,
  listSuspendMessages,
  updateSuspendMessage,
} from "@/lib/school-web-two-admin"
import { ManageRouteError, ok, parseJsonBody, requireManageSession, withManageHandler } from "@/lib/manage-route"
import type { SuspendMessage } from "@/lib/school-web-two"
import { resolveManageWebId } from "@/lib/manage-session"

export async function GET(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const { searchParams } = new URL(request.url)
    const messageId = Number(searchParams.get("messageId"))
    if (messageId) {
      const data = await getSuspendMessage(session.token, messageId)
      return ok(data)
    }
    const data = await listSuspendMessages(session.token, {
      title: searchParams.get("title") ?? "",
      pageNo: Number(searchParams.get("pageNo") ?? 1),
      pageSize: Number(searchParams.get("pageSize") ?? 20),
    }, resolveManageWebId(session))
    return ok(data)
  })
}

export async function POST(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<Partial<SuspendMessage>>(request)
    const data = await createSuspendMessage(session.token, body, resolveManageWebId(session))
    return ok(data, "悬浮消息已新增", 201)
  })
}

export async function PATCH(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<Partial<SuspendMessage> & { id?: number }>(request)
    if (!body.id) throw new ManageRouteError("缺少悬浮消息 id")
    const data = await updateSuspendMessage(session.token, body as Partial<SuspendMessage> & { id: number }, resolveManageWebId(session))
    return ok(data, "悬浮消息已更新")
  })
}

export async function DELETE(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const { searchParams } = new URL(request.url)
    const messageId = Number(searchParams.get("messageId"))
    const messageIds = searchParams.get("messageIds")

    if (!messageIds && !messageId) throw new ManageRouteError("缺少悬浮消息 id")

    const data = messageIds
      ? await batchDeleteSuspendMessages(session.token, messageIds)
      : await deleteSuspendMessage(session.token, messageId)
    return ok(data, "悬浮消息已删除")
  })
}
