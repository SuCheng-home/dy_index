import { retrievalAddressUsers } from "@/lib/school-web-two-admin"
import { ok, parseJsonBody, requireManageSession, withManageHandler } from "@/lib/manage-route"

export async function POST(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<{
      condition?: string
      userTypes?: string
      excludeUserIdsStr?: string
      departIds?: string
    }>(request)
    const data = await retrievalAddressUsers(session.token, body)
    return ok(data)
  })
}
