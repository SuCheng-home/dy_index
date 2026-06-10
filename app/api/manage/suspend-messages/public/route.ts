import { getPublicSuspendMessages } from "@/lib/school-web-two-admin"
import { ok, requireManageSession, withManageHandler } from "@/lib/manage-route"
import { resolveManageWebId } from "@/lib/manage-session"

export async function GET(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const { searchParams } = new URL(request.url)
    const searchTime = searchParams.get("searchTime") ?? new Date().toISOString().slice(0, 19).replace("T", " ")
    const data = await getPublicSuspendMessages(session.token, searchTime, resolveManageWebId(session))
    return ok(data)
  })
}
