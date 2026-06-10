import { getMbTemplate, updateMbTemplate } from "@/lib/school-web-two-admin"
import { ok, parseJsonBody, requireManageSession, withManageHandler } from "@/lib/manage-route"
import type { MbTemplatePayload } from "@/lib/school-web-two"
import { resolveManageWebId } from "@/lib/manage-session"

export async function GET() {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const data = await getMbTemplate(session.token, resolveManageWebId(session))
    return ok(data)
  })
}

export async function PATCH(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<Partial<MbTemplatePayload>>(request)
    const data = await updateMbTemplate(session.token, body, resolveManageWebId(session))
    return ok(data, "普通移动端模板已保存")
  })
}
