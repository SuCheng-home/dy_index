import { listModulesByWebId } from "@/lib/school-web-two-admin"
import { ok, requireManageSession, withManageHandler } from "@/lib/manage-route"
import { resolveManageWebId } from "@/lib/manage-session"

export async function GET(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const { searchParams } = new URL(request.url)
    const typeParam = searchParams.get("type")
    const data = await listModulesByWebId(session.token, typeParam ? Number(typeParam) : undefined, resolveManageWebId(session))
    return ok(data)
  })
}
