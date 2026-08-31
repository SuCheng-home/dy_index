import { NextResponse } from "next/server"

import { setManageSession } from "@/lib/manage-session"
import { parseJsonBody, withManageHandler } from "@/lib/manage-route"
import { enforceRateLimit } from "@/lib/request-guard"
import { buildManageSessionFromLoginData, isSchoolWebSuccess, postLoginEndpoint, type WechatLoginData } from "@/lib/school-web-two"

export async function POST(request: Request) {
  return withManageHandler(async () => {
    await enforceRateLimit("wechat-school", 20, 60_000)
    const body = await parseJsonBody<{ schoolId?: number | string; wxToken?: string }>(request)
    const response = await postLoginEndpoint<WechatLoginData>("login/weixin", {
      schoolId: body.schoolId,
      wxToken: body.wxToken,
    })

    if (isSchoolWebSuccess(response) && response.data?.token) {
      await setManageSession(buildManageSessionFromLoginData(response.data))
    }

    return NextResponse.json(response)
  })
}
