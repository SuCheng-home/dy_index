import { getManageSiteSettingBySchool } from "@/lib/school-web-two-admin"
import { ok, requireManageSession, withManageHandler } from "@/lib/manage-route"

export async function GET() {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const data = await getManageSiteSettingBySchool(session.token)
    return ok(Array.isArray(data) ? data : data ? [data] : [])
  })
}
