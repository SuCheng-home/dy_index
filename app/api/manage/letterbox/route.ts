import {
  createLetterBox,
  deleteLetterBox,
  getLetterBox,
  listLetterBox,
  updateLetterBox,
} from "@/lib/school-web-two-admin"
import { ManageRouteError, ok, parseJsonBody, requireManageSession, withManageHandler } from "@/lib/manage-route"
import type { LetterBoxItem } from "@/lib/school-web-two"
import { resolveManageWebId } from "@/lib/manage-session"

export async function GET(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const { searchParams } = new URL(request.url)
    const messageId = Number(searchParams.get("messageId"))
    if (messageId) {
      const data = await getLetterBox(session.token, messageId)
      return ok(data)
    }
    const data = await listLetterBox(session.token, {
      title: searchParams.get("title") ?? "",
      pageNo: Number(searchParams.get("pageNo") ?? 1),
      pageSize: Number(searchParams.get("pageSize") ?? 20),
      status: Number(searchParams.get("status") ?? 0),
    }, resolveManageWebId(session))
    return ok(data)
  })
}

export async function POST(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<Partial<LetterBoxItem>>(request)
    const data = await createLetterBox(body, resolveManageWebId(session))
    return ok(data, "信箱内容已新增", 201)
  })
}

export async function PATCH(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<Partial<LetterBoxItem> & { id?: number }>(request)
    if (!body.id) throw new ManageRouteError("缺少信箱 id")
    const data = await updateLetterBox(session.token, body as Partial<LetterBoxItem> & { id: number }, resolveManageWebId(session))
    return ok(data, "信箱内容已更新")
  })
}

export async function DELETE(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const { searchParams } = new URL(request.url)
    const messageIds = searchParams.get("messageIds")
    if (!messageIds) throw new ManageRouteError("缺少信箱 ids")
    const data = await deleteLetterBox(session.token, messageIds)
    return ok(data, "信箱内容已删除")
  })
}
