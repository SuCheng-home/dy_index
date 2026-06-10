import { initAddressBook } from "@/lib/school-web-two-admin"
import { ok, parseJsonBody, requireManageSession, withManageHandler } from "@/lib/manage-route"

export async function POST(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<{ isSchoolManager?: boolean }>(request)
    const data = await initAddressBook(session.token, Boolean(body.isSchoolManager))
    return ok(data)
  })
}
