import { NextResponse } from "next/server"

import { parseJsonBody, withManageHandler } from "@/lib/manage-route"
import { postLoginEndpoint } from "@/lib/school-web-two"

export async function POST(request: Request) {
  return withManageHandler(async () => {
    const body = await parseJsonBody<{ mobile?: string; clientType?: string }>(request)
    const response = await postLoginEndpoint<unknown>("login/weixin/bind/getCode", {
      mobile: body.mobile,
      clientType: body.clientType,
    })
    return NextResponse.json(response)
  })
}
