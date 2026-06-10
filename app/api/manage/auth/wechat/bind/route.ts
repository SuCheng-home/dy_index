import { NextResponse } from "next/server"

import { setManageSession } from "@/lib/manage-session"
import { parseJsonBody, withManageHandler } from "@/lib/manage-route"
import { buildManageSessionFromLoginData, isSchoolWebSuccess, postLoginEndpoint, type WechatLoginData } from "@/lib/school-web-two"

export async function POST(request: Request) {
  return withManageHandler(async () => {
    const body = await parseJsonBody<{ code?: string; mobile?: string; wxToken?: string; clientType?: string }>(request)
    const response = await postLoginEndpoint<WechatLoginData>("login/weixin/bind", {
      code: body.code,
      mobile: body.mobile,
      wxToken: body.wxToken,
      clientType: body.clientType,
    })

    if (isSchoolWebSuccess(response) && response.data?.token) {
      await setManageSession(buildManageSessionFromLoginData(response.data, body.mobile))
    }

    return NextResponse.json(response)
  })
}
