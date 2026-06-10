import { getPcTemplate, updatePcTemplate } from "@/lib/school-web-two-admin"
import { ok, parseJsonBody, requireManageSession, withManageHandler } from "@/lib/manage-route"
import type { PcTemplatePayload } from "@/lib/school-web-two"
import { resolveManageWebId } from "@/lib/manage-session"

export async function GET() {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const data = await getPcTemplate(session.token, resolveManageWebId(session))
    return ok(data)
  })
}

export async function PATCH(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<Partial<PcTemplatePayload>>(request)
    const data = await updatePcTemplate(session.token, body, resolveManageWebId(session))
    return ok(data, "普通 PC 模板已保存")
  })
}
