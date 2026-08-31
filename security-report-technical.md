# 安全审计报告（技术版）

项目：丹中网站（dy-yanshi，Next.js 16 App Router）
日期：2026-08-28（上线后场景复测）
范围：对外暴露面、鉴权与会话、依赖漏洞（OSV）、注入点、部署相关

风险评分公式：Risk = CVSS×0.3 + 可利用性×0.3 + 业务关键性×0.2 + 暴露面×0.2

---

## F1【严重 8.8】改密接口未鉴权，可替任意用户改密码

文件：`app/api/manage/auth/modify-password/route.ts`

- 未调用 `requireManageSession`，任何匿名访问者均可 POST `/api/manage/auth/modify-password`。
- `userId` 取自请求体（`body.userId ?? ""`），完全由调用方控制。
- `postLoginEndpoint` 不携带任何凭据（无 token），属于未鉴权代理上游 `login/modifyPassword`。
- 上游是否强制校验旧密码未确认；即便校验，该接口仍是公开的密码尝试/枚举入口。

### 修复

```ts
// app/api/manage/auth/modify-password/route.ts
import { ok, parseJsonBody, requireManageSession, withManageHandler } from "@/lib/manage-route"

export async function POST(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()          // 1) 强制登录
    const body = await parseJsonBody<{
      currentPwd?: string
      newPwd?: string
      encryptedCurrentPwd?: string
      encryptedNewPwd?: string
    }>(request)
    const result = await postLoginEndpoint<unknown>("login/modifyPassword", {
      oldPwd: body.encryptedCurrentPwd || encryptPassword(body.currentPwd ?? ""),
      newPwd: body.encryptedNewPwd || encryptPassword(body.newPwd ?? ""),
      userId: String(session.userId),                     // 2) 身份取自会话，忽略请求体
      token: session.token,                               // 3) 携带会话凭据
    })
    ...
  })
}
```

### 验证测试

```bash
# 修复前：匿名调用应返回 200/上游响应（证明漏洞存在）
curl -s -X POST https://<站点>/api/manage/auth/modify-password \
  -H 'Content-Type: application/json' \
  -d '{"userId":"1","currentPwd":"x","newPwd":"y"}'
# 修复后：同一请求必须返回 401「请先登录后台」
```

---

## F2【高 8.4】会话 Cookie 为无签名 base64，可伪造/篡改

文件：`lib/manage-session.ts`

- Cookie `dy-school-web-manage-session` = base64url(JSON)，无签名、无服务端存储。
- 攻击者可任意改写 `expiresAt` 制造**永久会话**（即使上游 token 早已失效，本地校验仍通过；实际失效取决于上游对 token 的校验时机）。
- 持有任一有效 token 的低权限用户可伪造 `schoolId`/`userId` 字段（当前仅 `upload/file-record` 使用 `session.schoolId`，影响有限，但随功能演进会扩大）。

### 修复

用 HMAC 签名（最小改动）：

```ts
// lib/manage-session.ts
import { createHmac, timingSafeEqual } from "node:crypto"

const SECRET = process.env.MANAGE_SESSION_SECRET  // 部署时注入 32+ 字节随机值
if (!SECRET) throw new Error("MANAGE_SESSION_SECRET 未配置")

function sign(payload: string) {
  return createHmac("sha256", SECRET).update(payload).digest("base64url")
}

function encodeSession(session: ManageSession) {
  const payload = Buffer.from(JSON.stringify(session), "utf8").toString("base64url")
  return `${payload}.${sign(payload)}`
}

function decodeSession(raw: string): ManageSession | null {
  const [payload, mac] = raw.split(".")
  if (!payload || !mac) return null
  const expected = sign(payload)
  if (mac.length !== expected.length ||
      !timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return null
  // ...原 JSON 解析逻辑
}
```

### 验证测试

```bash
# 伪造 cookie（篡改 expiresAt 为 2099 年）后请求 /api/manage/auth/session
# 修复前：返回会话有效；修复后：签名校验失败，返回未登录
```

---

## F3【高 8.1】next@16.2.0 命中 23 个已知漏洞（含多个 middleware 绕过）

当前 `"next": "16.2.0"`，最新稳定版 16.3.3。命中清单（节选，共 23 条）：

| Advisory | 问题 | 修复版本 |
|---|---|---|
| GHSA-267c-6grr-h53f (CVE-2026-44575) | App Router segment-prefetch 绕过 middleware | 16.2.5 |
| GHSA-26hh-7cqf-hhc6 (CVE-2026-45109) | 上述修复不完全（Turbopack） | 16.2.6 |
| GHSA-492v-c6pp-mqqv | 动态路由参数注入绕过 middleware | 16.2.5 |
| GHSA-6gpp-xcg3-4w24 | middleware 绕过（Turbopack） | 16.2.11 |
| GHSA-955p-x3mx-jcvp | Server Function 内部端点未授权暴露 | 16.2.11 |
| GHSA-89xv-2m56-2m9x / GHSA-p9j2-gv94-2wf4 | SSRF（Server Actions / rewrites） | 16.2.11 |
| GHSA-gx5p-jg67-6x7h | beforeInteractive 脚本 XSS（本项目使用 beforeInteractive） | 16.2.5 |
| GHSA-8h8q-6873-q5fj / GHSA-q4gf-8mx6-v5v3 / GHSA-m99w-x7hq-7vfj | Server Components / Server Actions DoS | 16.2.5~16.2.11 |
| GHSA-h64f-5h5j-jqjh / GHSA-q8wf-6r8g-63ch | Image Optimization DoS | 16.2.5+ |
| GHSA-wfc6-r584-vfw7 / GHSA-vfv6-92ff-j949 / GHSA-3g8h-86w9-wvmq | RSC/middleware 缓存投毒 | 16.2.5 |

**对本项目的直接影响**：`middleware.ts` 是本站唯一的安全闸门（维护模式拦截），上述绕过可使其完全失效。

### 修复

```bash
pnpm add next@16.3.3        # 或至少 next@16.2.11
pnpm build && pnpm start    # 回归验证
```

### 验证测试

```bash
# 修复后回归：访问维护模式开关打开的域名，确认仍返回 403 维护页
# 检查 /_next 路径变体（如 /%2e/_next、带 segment-prefetch 参数的请求）不再绕过
```

---

## F4【中 6.7】middleware 每请求阻塞外网 fetch：fail-open + 可伪造域名 + 放大攻击

文件：`middleware.ts`

- 每个非静态请求都同步 `fetch` 外网 `getSchoolWebSettingByDomainName`（`cache: no-store`）：外网故障/慢时全站首字节被拖死；攻击者刷页面即可放大对外网接口的请求量。
- `catch` 分支 fail-open：外网接口挂了，维护模式自动失效。
- `x-forwarded-host` 可被客户端伪造（除非上游反代强制覆盖），可操控维护判定所用域名。

### 修复要点

1. 给设置查询结果加内存缓存（如 60s TTL，按域名键控），失败时沿用上次成功值。
2. 为 fetch 加 `AbortSignal.timeout(2000)`，超时按缓存值/放行处理并告警。
3. 若部署在反代后，只信任反代写入的 `host`，忽略客户端 `x-forwarded-host`（或在反代层强制覆盖）。

---

## F5【中 5.9】富文本未消毒 + 无安全响应头（存储型 XSS 放大器）

- `dangerouslySetInnerHTML` 渲染后台富文本，无任何 sanitize：
  - `app/news/[id]/page.tsx:80`
  - `app/site/[columnId]/[moduleId]/page.tsx:48`
  - `app/qh/news/[id]/page.tsx:126`
- 内容来自管理端/上游系统：管理账号被盗、上游被入侵或上游本身存在 XSS 时，恶意脚本将直接投放给所有访客。
- `next.config.mjs` 只设置了 `X-UA-Compatible`，缺 CSP / HSTS / X-Frame-Options / X-Content-Type-Options / Referrer-Policy，XSS 与点击劫持均无兜底防线。

### 修复

```bash
pnpm add sanitize-html
```

服务端渲染前消毒（三处共用一个工具函数）：

```ts
// lib/sanitize-html.ts
import sanitize from "sanitize-html"
export function sanitizeRichHtml(html: string) {
  return sanitize(html, {
    allowedTags: sanitize.defaults.allowedTags.concat(["img", "span", "figure", "figcaption", "video", "source"]),
    allowedAttributes: { ...sanitize.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height"], video: ["src", "controls", "poster"], source: ["src", "type"] },
  })
}
```

`next.config.mjs` headers 增加：

```js
{ key: "Content-Security-Policy", value: "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; script-src 'self'" },
{ key: "X-Content-Type-Options", value: "nosniff" },
{ key: "X-Frame-Options", value: "SAMEORIGIN" },
{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
```

（CSP 需按实际用到的内联脚本/样式、第三方域名逐步收紧，先上报告模式 `Content-Security-Policy-Report-Only` 调优亦可。）

---

## F6【高 7.0（待上游确认）】微信绑定接口未鉴权

文件：`app/api/manage/auth/wechat/bind/route.ts`

- 匿名可调用 `login/weixin/bind`，成功即建立管理端会话。
- 若上游未强制短信验证码，攻击者可用自己的微信 code + 他人手机号，**将微信绑定到受害者账号并直接登录**。

### 处理

1. 立即与上游确认 `login/weixin/bind` 是否校验短信验证码；不校验则要求上游修复或本地下线该路由。
2. 确认前可临时在路由内拒绝匿名请求。

---

## F7【中 7.1】登录无速率限制

- `/api/manage/auth/login`、微信登录等端点无任何限流，可无限暴破账号密码。
- 管理端密码一旦弱口令，直接全站内容沦陷（配合 F5 投放 XSS）。

### 修复

- 反代层（Nginx `limit_req`）对 `/api/manage/auth/*` 按 IP 限速（如 10 req/min）。
- 应用内按账号+IP 做失败计数与短时锁定（连续 5 次失败锁 15 分钟）。

---

## F8【低-中 6.1】公开缩略图接口无速率限制（CPU DoS）

文件：`app/api/public/image-thumbnail/route.ts`

- 实现本身较稳（https-only、域名白名单、重定向目标复检、大小限制、content-type 校验），SSRF 已受控。
- 但该接口公开、每请求做外网抓取 + sharp 转码，无限流/缓存键较粗（响应缓存 300s 但不同 width/height/quality 组合可轻易构造大量缓存穿透），可作为 CPU 耗尽攻击入口。
- `*.myqcloud.com` 通配允许任何腾讯云 COS 桶，等于对攻击者的图片做免费转码代理（轻度滥用）。

### 修复

- 反代限速；将 width/height 收敛为固定档位（如 3 档）；考虑收窄 `myqcloud.com` 到项目实际使用的桶域名。

---

## F9【中｜需确认部署方式】遗留子项目携带 191 个漏洞依赖

- `webManage/`（53 依赖）、`newPC/`（72）、`web-old/`（51）共命中 191 条旧漏洞（axios×75、next×23、webpack-dev-server×21、lodash×14、node-sass、jquery、ueditor 等），其中大量为 RCE/原型污染/路径穿越级别。
- 三个目录在 git 中均为**未跟踪**状态；但 `app/api/manage/ueditor-assets/[...path]` 会从 `webManage/static/` 读文件。
- **关键问题**：若上线部署是「整机目录打包」而非「git 构建」，这些含漏洞的旧应用会一并上线；若是 git 构建，则 ueditor 路由恒 404，需确认管理端富文本编辑器是否还依赖它。

### 处理

1. 确认部署产物是否包含这三个目录；包含则立即从产物中剔除。
2. 确认后将目录移出版本库工作区或加入部署排除清单。

---

## F10【低】其他

- `postcss@8.5.x` 命中路径穿越（GHSA-6g55-p6wh-862q 等），仅构建期风险：`pnpm add -D postcss@^8.5.23`。
- `typescript.ignoreBuildErrors: true`：构建不拦类型错误，安全相关改动建议恢复局部检查。
- 会话 Cookie 的 `secure` 依赖 `NODE_ENV=production`，确认线上启动命令确实注入该值。

---

## 修复优先级

| 顺序 | 项 | 预计工作量 |
|---|---|---|
| 1 | F1 改密接口加鉴权（3 行改动） | 10 分钟 |
| 2 | F3 升级 next → 16.3.3 + 回归 | 1~2 小时 |
| 3 | F2 会话签名 + 环境变量注入 | 1 小时 |
| 4 | F6 微信绑定接口与上游核实 | 沟通 + 10 分钟 |
| 5 | F9 确认部署打包范围 | 30 分钟 |
| 6 | F7 登录限流 | 1 小时 |
| 7 | F5 sanitize + 安全头 | 2 小时 |
| 8 | F4 middleware 缓存与超时 | 1 小时 |
| 9 | F8 缩略图限流 | 30 分钟 |
