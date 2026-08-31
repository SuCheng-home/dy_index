import { getManageSession, publicManageSession } from "@/lib/manage-session"
import { ok, withManageHandler } from "@/lib/manage-route"

export async function GET() {
  return withManageHandler(async () => {
    const session = await getManageSession()
    return ok(publicManageSession(session))
  }, { csrf: false })
}
