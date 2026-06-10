import { listCreatorMessages } from "@/lib/school-web-two-admin"
import { ok, requireManageSession, withManageHandler } from "@/lib/manage-route"
import { resolveManageWebId } from "@/lib/manage-session"

export async function GET(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const { searchParams } = new URL(request.url)
    const data = await listCreatorMessages(session.token, {
      moduleId: Number(searchParams.get("moduleId") ?? 0),
      title: searchParams.get("title") ?? "",
      pageNo: Number(searchParams.get("pageNo") ?? 1),
      pageSize: Number(searchParams.get("pageSize") ?? 20),
      state: Number(searchParams.get("state") ?? 0),
    }, resolveManageWebId(session))
    return ok(data)
  })
}
