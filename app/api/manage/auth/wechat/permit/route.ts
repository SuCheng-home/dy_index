import { NextResponse } from "next/server"

import { parseJsonBody, withManageHandler } from "@/lib/manage-route"
import { postLoginEndpoint, type WechatPermitData } from "@/lib/school-web-two"

export async function POST(request: Request) {
  return withManageHandler(async () => {
    const body = await parseJsonBody<{ loginType?: string }>(request)
    const response = await postLoginEndpoint<WechatPermitData>("login/weixin/permit", {
      loginType: body.loginType,
    })
    return NextResponse.json(response)
  })
}
