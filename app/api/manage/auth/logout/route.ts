import { clearManageSession } from "@/lib/manage-session"
import { ok, withManageHandler } from "@/lib/manage-route"

export async function POST() {
  return withManageHandler(async () => {
    await clearManageSession()
    return ok(true, "已退出登录")
  })
}
