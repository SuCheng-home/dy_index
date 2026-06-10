import { getMbTwTemplate, updateMbTwTemplate } from "@/lib/school-web-two-admin"
import { ok, parseJsonBody, requireManageSession, withManageHandler } from "@/lib/manage-route"
import type { MbTwTemplatePayload } from "@/lib/school-web-two"
import { resolveManageWebId } from "@/lib/manage-session"

export async function GET() {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const data = await getMbTwTemplate(session.token, resolveManageWebId(session))
    return ok(data)
  })
}

export async function PATCH(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<Partial<MbTwTemplatePayload>>(request)
    const data = await updateMbTwTemplate(session.token, body, resolveManageWebId(session))
    return ok(data, "移动端模板已保存")
  })
}
