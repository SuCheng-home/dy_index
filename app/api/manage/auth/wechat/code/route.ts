import { NextResponse } from "next/server"

import { parseJsonBody, withManageHandler } from "@/lib/manage-route"
import { enforceRateLimit } from "@/lib/request-guard"
import { postLoginEndpoint } from "@/lib/school-web-two"

export async function POST(request: Request) {
  return withManageHandler(async () => {
    const body = await parseJsonBody<{ mobile?: string; clientType?: string }>(request)
    await enforceRateLimit("wechat-code", 3, 60_000, String(body.mobile ?? "").trim())
    const response = await postLoginEndpoint<unknown>("login/weixin/bind/getCode", {
      mobile: body.mobile,
      clientType: body.clientType,
    })
    return NextResponse.json(response)
  })
}
