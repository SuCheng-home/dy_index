import { getAccessTrend } from "@/lib/school-web-two-admin"
import { ok, requireManageSession, withManageHandler } from "@/lib/manage-route"
import { resolveManageWebId } from "@/lib/manage-session"

function defaultRange() {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - 29)
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  }
}

export async function GET(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const { searchParams } = new URL(request.url)
    const range = defaultRange()
    const startDate = searchParams.get("startDate") ?? range.startDate
    const endDate = searchParams.get("endDate") ?? range.endDate
    const webId = resolveManageWebId(session)
    const trend = await getAccessTrend(session.token, startDate, endDate, webId)
    return ok({
      trend,
      startDate,
      endDate,
    })
  })
}
