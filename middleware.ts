import { NextResponse, type NextRequest } from "next/server"

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"])
const LOCAL_TEST_DOMAIN = "bxky.zhxiaoyuan.cn"
const SITE_SETTING_ENDPOINT = "https://www.zhxiaoyuan.cn/wxcepClient1/common/schoolWebTwo/getSchoolWebSettingByDomainName"

function cleanHost(value: string | null) {
  const host = value?.split(",")[0]?.trim() ?? ""
  return host
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .split(":")[0]
}

function resolveDomain(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host")
  const host = cleanHost(forwardedHost || request.headers.get("host"))
  return !host || LOCAL_HOSTS.has(host) ? LOCAL_TEST_DOMAIN : host
}

const SITE_SETTING_CACHE_MS = 60_000
const SITE_SETTING_TIMEOUT_MS = 2000
const siteSettingCache = new Map<string, { closed: boolean; expiresAt: number }>()
const lastKnownShutState = new Map<string, boolean>()

function isAssetRequest(pathname: string) {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap") ||
    /\.(?:css|js|map|png|jpg|jpeg|gif|webp|svg|ico|txt|xml|woff2?|ttf|otf)$/i.test(pathname)
  )
}

function maintenanceHtml() {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex,nofollow" />
  <title>系统维护中，暂停访问</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f7f3ec;
      --panel: #fffdf9;
      --text: #2d2520;
      --muted: #766a60;
      --line: #e8ded1;
      --brand: #8b1a1a;
      --brand-dark: #651111;
    }
    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      margin: 0;
      font-family: "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif;
      background:
        linear-gradient(180deg, rgba(139, 26, 26, 0.06), transparent 34%),
        var(--bg);
      color: var(--text);
    }
    .page {
      min-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 18px;
    }
    .card {
      width: min(720px, 100%);
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 18px;
      box-shadow: 0 24px 70px rgba(78, 46, 24, 0.12);
      overflow: hidden;
    }
    .bar {
      height: 6px;
      background: linear-gradient(90deg, var(--brand-dark), var(--brand), #b98945);
    }
    .content {
      padding: 54px 56px 48px;
      text-align: center;
    }
    .status {
      margin: 0 0 20px;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 18px;
      letter-spacing: 0.16em;
      color: var(--brand);
      font-weight: 700;
    }
    h1 {
      margin: 0;
      font-size: clamp(30px, 5vw, 42px);
      line-height: 1.25;
      font-weight: 700;
      letter-spacing: 0.08em;
    }
    .divider {
      width: 68px;
      height: 2px;
      margin: 28px auto;
      background: var(--brand);
    }
    @media (max-width: 640px) {
      .content { padding: 42px 26px 38px; }
    }
  </style>
</head>
<body>
  <main class="page">
    <section class="card" aria-labelledby="title">
      <div class="bar"></div>
      <div class="content">
        <div class="status">403</div>
        <h1 id="title">系统维护中，暂停访问!</h1>
        <div class="divider"></div>
      </div>
    </section>
  </main>
</body>
</html>`
}

async function isSiteClosed(domain: string) {
  const cached = siteSettingCache.get(domain)
  if (cached && cached.expiresAt > Date.now()) return cached.closed

  const url = new URL(SITE_SETTING_ENDPOINT)
  url.searchParams.set("domain", domain)

  try {
    const response = await fetch(url.toString(), {
      cache: "no-store",
      signal: AbortSignal.timeout(SITE_SETTING_TIMEOUT_MS),
      headers: {
        Accept: "application/json",
      },
    })
    const payload = await response.json() as {
      result?: boolean
      code?: number
      data?: null | { shutState?: number | string | null }
    }
    const shutState = Number(payload.data?.shutState ?? 0)
    const closed = response.ok && payload.result === true && payload.code === 200 && (!payload.data || shutState !== 0)
    siteSettingCache.set(domain, { closed, expiresAt: Date.now() + SITE_SETTING_CACHE_MS })
    lastKnownShutState.set(domain, closed)
    return closed
  } catch {
    return lastKnownShutState.get(domain) ?? false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (isAssetRequest(pathname)) return NextResponse.next()

  const closed = await isSiteClosed(resolveDomain(request))
  if (!closed) return NextResponse.next()

  return new NextResponse(maintenanceHtml(), {
    status: 403,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
}
