import { ok, requireManageSession, withManageHandler } from "@/lib/manage-route"
import { requestWxcep, unwrapSchoolWebResponse } from "@/lib/school-web-two"

export async function GET(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const { searchParams } = new URL(request.url)
    const sysBucket = Number(searchParams.get("sysBucket") ?? 2)
    const response = await requestWxcep<string>({
      endpoint: "common/getWxCosFileSign",
      method: "GET",
      query: {
        sysBucket,
      },
      token: session.token,
    })
    const data = unwrapSchoolWebResponse(response)
    return ok(typeof data === "string" ? JSON.parse(data) : data)
  })
}
