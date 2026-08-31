import { NextResponse } from "next/server"

import { ManageRouteError } from "@/lib/manage-error"
import { getManageSession } from "@/lib/manage-session"
import { assertSameOriginRequest } from "@/lib/request-guard"

export { ManageRouteError }

export async function requireManageSession() {
  const session = await getManageSession()
  if (!session) {
    throw new ManageRouteError("请先登录后台", 401)
  }
  return session
}

export async function parseJsonBody<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T
  } catch {
    return {} as T
  }
}

export function ok<T>(data: T, msg = "ok", status = 200) {
  return NextResponse.json(
    {
      result: true,
      code: 200,
      msg,
      data,
    },
    { status }
  )
}

export function fail(error: unknown) {
  if (error instanceof ManageRouteError) {
    return NextResponse.json(
      {
        result: false,
        code: error.status,
        msg: error.message,
        data: null,
      },
      { status: error.status }
    )
  }

  const message = error instanceof Error ? error.message : "服务异常"
  return NextResponse.json(
    {
      result: false,
      code: 500,
      msg: message,
      data: null,
    },
    { status: 500 }
  )
}

export async function withManageHandler(handler: () => Promise<NextResponse>, options?: { csrf?: boolean }) {
  try {
    if (options?.csrf !== false) {
      await assertSameOriginRequest()
    }
    return await handler()
  } catch (error) {
    return fail(error)
  }
}
