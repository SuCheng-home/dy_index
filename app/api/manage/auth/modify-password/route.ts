import { NextResponse } from "next/server"

import { consumePasswordTicket, getManageSession, setPasswordTicket } from "@/lib/manage-session"
import { ManageRouteError, ok, parseJsonBody, withManageHandler } from "@/lib/manage-route"
import { enforceRateLimit } from "@/lib/request-guard"
import { encryptPassword, postLoginEndpoint } from "@/lib/school-web-two"

export async function POST(request: Request) {
  return withManageHandler(async () => {
    await enforceRateLimit("modify-password", 8, 60_000)
    const session = await getManageSession()
    const ticketUserId = session ? null : await consumePasswordTicket()
    const userId = session ? String(session.userId) : ticketUserId
    if (!userId) {
      throw new ManageRouteError("请先登录后台", 401)
    }

    const body = await parseJsonBody<{
      currentPwd?: string
      newPwd?: string
      encryptedCurrentPwd?: string
      encryptedNewPwd?: string
    }>(request)
    const result = await postLoginEndpoint<unknown>("login/modifyPassword", {
      oldPwd: body.encryptedCurrentPwd || encryptPassword(body.currentPwd ?? ""),
      newPwd: body.encryptedNewPwd || encryptPassword(body.newPwd ?? ""),
      userId,
      ...(session?.token ? { token: session.token } : {}),
    })

    if (result.code !== 200 || result.result === false) {
      if (!session && ticketUserId) await setPasswordTicket(ticketUserId)
      return NextResponse.json(result)
    }

    return ok(true, result.msg || "修改成功")
  })
}
