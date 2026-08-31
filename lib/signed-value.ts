import { createHmac, randomBytes, timingSafeEqual } from "node:crypto"

declare global {
  var __dyManageSigningSecret: string | undefined
}

function resolveSigningSecret() {
  const configured = process.env.MANAGE_SESSION_SECRET?.trim()
  if (configured && configured.length >= 16) return configured
  if (!globalThis.__dyManageSigningSecret) {
    globalThis.__dyManageSigningSecret = randomBytes(32).toString("base64url")
  }
  return globalThis.__dyManageSigningSecret
}

function hmac(payload: string) {
  return createHmac("sha256", resolveSigningSecret()).update(payload).digest("base64url")
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  if (leftBuffer.length !== rightBuffer.length) return false
  return timingSafeEqual(leftBuffer, rightBuffer)
}

export function signValue(payload: string) {
  return `${payload}.${hmac(payload)}`
}

export function unsignValue(raw: string | undefined | null) {
  if (!raw) return null
  const separator = raw.lastIndexOf(".")
  if (separator <= 0) return null
  const payload = raw.slice(0, separator)
  const mac = raw.slice(separator + 1)
  if (!payload || !mac) return null
  if (!safeEqual(mac, hmac(payload))) return null
  return payload
}
