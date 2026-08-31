import { cookies } from "next/headers"

import type { ManageSession } from "@/lib/school-web-two"
import { SCHOOL_WEB_TWO_CONFIG } from "@/lib/school-web-two"
import { signValue, unsignValue } from "@/lib/signed-value"

const MANAGE_SESSION_COOKIE = "dy-school-web-manage-session"
const PASSWORD_TICKET_COOKIE = "dy-school-web-password-ticket"
const PASSWORD_TICKET_TTL_MS = 10 * 60 * 1000

type PasswordTicket = {
  userId: string
  expiresAt: number
}

function encodeJson(value: unknown) {
  return signValue(Buffer.from(JSON.stringify(value), "utf8").toString("base64url"))
}

function decodeJson<T>(raw: string | undefined | null): T | null {
  const payload = unsignValue(raw)
  if (!payload) return null
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as T
  } catch {
    return null
  }
}

function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  }
}

export function publicManageSession(session: ManageSession | null) {
  if (!session) return null
  return {
    userId: session.userId,
    userName: session.userName,
    mobile: session.mobile,
    schoolId: session.schoolId,
    expiresAt: session.expiresAt,
    activeWebId: session.activeWebId,
    activeWebName: session.activeWebName,
    avatar: session.avatar ?? null,
  }
}

export async function getManageSession() {
  const store = await cookies()
  const session = decodeJson<ManageSession>(store.get(MANAGE_SESSION_COOKIE)?.value)
  if (!session?.token || !session.expiresAt) return null
  if (session.expiresAt <= Date.now()) {
    store.delete(MANAGE_SESSION_COOKIE)
    return null
  }
  return session
}

export async function setManageSession(session: ManageSession) {
  const store = await cookies()
  store.set(MANAGE_SESSION_COOKIE, encodeJson(session), cookieOptions(new Date(session.expiresAt)))
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
  store.delete(PASSWORD_TICKET_COOKIE)
}

export async function setPasswordTicket(userId: string | number) {
  const ticket: PasswordTicket = {
    userId: String(userId),
    expiresAt: Date.now() + PASSWORD_TICKET_TTL_MS,
  }
  const store = await cookies()
  store.set(PASSWORD_TICKET_COOKIE, encodeJson(ticket), cookieOptions(new Date(ticket.expiresAt)))
}

export async function consumePasswordTicket() {
  const store = await cookies()
  const ticket = decodeJson<PasswordTicket>(store.get(PASSWORD_TICKET_COOKIE)?.value)
  store.delete(PASSWORD_TICKET_COOKIE)
  if (!ticket?.userId || ticket.expiresAt <= Date.now()) return null
  return ticket.userId
}
