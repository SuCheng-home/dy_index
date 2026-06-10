import { readFile } from "node:fs/promises"
import path from "node:path"

import { NextResponse } from "next/server"

const ueditorRoot = path.join(process.cwd(), "webManage", "static", "ueditor1_4_3_3")

const mimeTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".eot": "application/vnd.ms-fontobject",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".swf": "application/x-shockwave-flash",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
}

export async function GET(_request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path: pathParts } = await context.params
  const relativePath = pathParts.join("/")
  const filePath = path.normalize(path.join(ueditorRoot, relativePath))

  if (!filePath.startsWith(ueditorRoot)) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  try {
    const data = await readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    return new NextResponse(data, {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": mimeTypes[ext] ?? "application/octet-stream",
      },
    })
  } catch {
    return new NextResponse("Not found", { status: 404 })
  }
}
