import sharp from "sharp"

import { consumeRateLimit } from "@/lib/request-guard"

const ALLOWED_HOSTS = new Set(["cos.zhxiaoyuan.cn", "wx.qlogo.cn", "wework.qpic.cn"])
const MAX_SOURCE_BYTES = 24 * 1024 * 1024
const REQUEST_TIMEOUT_MS = 20_000
const ALLOWED_WIDTHS = [640, 960]
const ALLOWED_HEIGHTS = [380, 720]
const ALLOWED_QUALITIES = [78]

function snapToAllowed(value: string | null, allowed: number[], fallback: number) {
  const parsed = Number(value)
  const target = Number.isFinite(parsed) ? parsed : fallback
  return allowed.reduce((closest, item) => (
    Math.abs(item - target) < Math.abs(closest - target) ? item : closest
  ))
}

function clientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")?.trim()
    || "unknown"
  )
}

export const dynamic = "force-dynamic"

function isAllowedImageUrl(value: string) {
  try {
    const url = new URL(value)
    if (url.protocol !== "https:") return false
    if (url.port && url.port !== "443") return false
    return ALLOWED_HOSTS.has(url.hostname) || url.hostname.endsWith(".myqcloud.com")
  } catch {
    return false
  }
}

async function readLimitedBody(response: Response) {
  const declaredLength = Number(response.headers.get("content-length") ?? 0)
  if (declaredLength > MAX_SOURCE_BYTES) throw new Error("图片文件过大")
  if (!response.body) throw new Error("图片响应为空")

  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > MAX_SOURCE_BYTES) {
      await reader.cancel()
      throw new Error("图片文件过大")
    }
    chunks.push(value)
  }

  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)))
}

export async function GET(request: Request) {
  if (!consumeRateLimit(`image-thumbnail:${clientIp(request)}`, 60, 60_000)) {
    return new Response("Too Many Requests", { status: 429 })
  }

  const requestUrl = new URL(request.url)
  const source = requestUrl.searchParams.get("url") ?? ""
  const width = snapToAllowed(requestUrl.searchParams.get("width"), ALLOWED_WIDTHS, 640)
  const height = snapToAllowed(requestUrl.searchParams.get("height"), ALLOWED_HEIGHTS, 380)
  const quality = snapToAllowed(requestUrl.searchParams.get("quality"), ALLOWED_QUALITIES, 78)
  if (!isAllowedImageUrl(source)) {
    return new Response("Invalid image URL", { status: 400 })
  }

  try {
    const response = await fetch(source, {
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: { Accept: "image/avif,image/webp,image/*" },
    })
    if (!response.ok) throw new Error(`图片请求失败（${response.status}）`)
    if (!isAllowedImageUrl(response.url)) throw new Error("图片重定向地址不受信任")
    if (!response.headers.get("content-type")?.toLowerCase().startsWith("image/")) {
      throw new Error("响应不是图片")
    }

    const sourceBuffer = await readLimitedBody(response)
    const output = await sharp(sourceBuffer)
      .rotate()
      .resize({ width, height, fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#efe6d8" })
      .jpeg({ quality, progressive: true, mozjpeg: true })
      .toBuffer()

    return new Response(new Uint8Array(output), {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=3600",
        "Content-Length": String(output.byteLength),
        "Content-Type": "image/jpeg",
      },
    })
  } catch {
    return new Response("Image processing failed", { status: 502 })
  }
}
