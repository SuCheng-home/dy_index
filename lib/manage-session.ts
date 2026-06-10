import { cookies } from "next/headers"

import type { ManageSession } from "@/lib/school-web-two"
import { SCHOOL_WEB_TWO_CONFIG } from "@/lib/school-web-two"

const MANAGE_SESSION_COOKIE = "dy-school-web-manage-session"

function encodeSession(session: ManageSession) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url")
}

function decodeSession(raw: string): ManageSession | null {
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as ManageSession
    if (!parsed?.token || !parsed.expiresAt) return null
    return parsed
  } catch {
    return null
  }
}

export async function getManageSession() {
  const store = await cookies()
  const raw = store.get(MANAGE_SESSION_COOKIE)?.value
  if (!raw) return null

  const session = decodeSession(raw)
  if (!session) return null
  if (session.expiresAt <= Date.now()) {
    store.delete(MANAGE_SESSION_COOKIE)
    return null
  }
  return session
}

export async function setManageSession(session: ManageSession) {
  const store = await cookies()
  store.set(MANAGE_SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(session.expiresAt),
  })
}

export function resolveManageWebId(session: ManageSession) {
  return Number(session.activeWebId || SCHOOL_WEB_TWO_CONFIG.webId)
}

export async function updateManageSession(patch: Partial<ManageSession>) {
  const session = await getManageSession()
  if (!session) return null
  const nextSession = {
    ...session,
    ...patch,
  }
  await setManageSession(nextSession)
  return nextSession
}

export async function clearManageSession() {
  const store = await cookies()
  store.delete(MANAGE_SESSION_COOKIE)
}
