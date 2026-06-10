import { getPcTwTemplate, updatePcTwTemplate } from "@/lib/school-web-two-admin"
import { ok, parseJsonBody, requireManageSession, withManageHandler } from "@/lib/manage-route"
import type { PcTwTemplatePayload } from "@/lib/school-web-two"
import { resolveManageWebId } from "@/lib/manage-session"

export async function GET() {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const data = await getPcTwTemplate(session.token, resolveManageWebId(session))
    return ok(data)
  })
}

export async function PATCH(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<Partial<PcTwTemplatePayload>>(request)
    const data = await updatePcTwTemplate(session.token, body, resolveManageWebId(session))
    return ok(data, "PC 模板已保存")
  })
}
