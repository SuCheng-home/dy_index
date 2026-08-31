import { headers } from "next/headers"

import { ManageRouteError } from "@/lib/manage-error"

const rateBuckets = new Map<string, { count: number; resetAt: number }>()

function cleanHost(value: string | null | undefined) {
  const host = value?.split(",")[0]?.trim() ?? ""
  return host
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .split(":")[0]
    .toLowerCase()
}

function hostFromUrl(value: string | null) {
  if (!value) return ""
  try {
    return cleanHost(new URL(value).host)
  } catch {
    return ""
  }
}

export function getClientIp(headerStore: Headers) {
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim()
    || headerStore.get("x-real-ip")?.trim()
    || "unknown"
  )
}

export function consumeRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const current = rateBuckets.get(key)
  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (current.count >= limit) return false
  current.count += 1
  return true
}

export async function assertSameOriginRequest() {
  const headerStore = await headers()
  const requestHost = cleanHost(headerStore.get("x-forwarded-host") || headerStore.get("host"))
  if (!requestHost) return

  const originHost = hostFromUrl(headerStore.get("origin"))
  const refererHost = hostFromUrl(headerStore.get("referer"))
  const incomingHost = originHost || refererHost
  if (!incomingHost) return
  if (incomingHost !== requestHost) {
    throw new ManageRouteError("非法请求来源", 403)
  }
}

export async function enforceRateLimit(scope: string, limit: number, windowMs: number, extra = "") {
  const headerStore = await headers()
  const key = `${scope}:${getClientIp(headerStore)}:${extra}`
  if (!consumeRateLimit(key, limit, windowMs)) {
    throw new ManageRouteError("操作过于频繁，请稍后再试", 429)
  }
}
