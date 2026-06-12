"use client"

import { useCallback, useEffect, useState } from "react"
import { Building2, Loader2, Lock, MessageCircle, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const LOGIN_BG =
  "https://cdnfile-10043692.file.myqcloud.com/productVersion/common/danyang/省丹中画册/%E7%AC%AC21%E9%A1%B5-150.PNG"
const WX_LOGIN_SCRIPT = "https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js"
const WX_LOGIN_STATE = "WXLOGINNEW"
const WX_LOGIN_STYLE = "https://cdnfile-10043692.file.myqcloud.com/vuewxcep/common_css/new_wx_login.css"

const ENABLE_QYWX_LOGIN = false

type LoginTab = "wechat" | "account"

type ApiResponse<T> = {
  result?: boolean
  code: number
  msg?: string
  data?: T
}

type WechatPermitData = {
  appid: string
  redirect_url: string
}

type LoginData = {
  token?: string
  loginUserId?: string | number
  loginWxToken?: string | null
  loginSchoolIds?: SchoolItem[]
}

type SchoolItem = {
  id: number
  name: string
  squareLogoUrl?: string
}

declare global {
  interface Window {
    WxLogin?: new (options: Record<string, string>) => unknown
  }
}

function getLoginSuccessUrl(token: string): string {
  return `https://www.zhxiaoyuan.cn/#/main/homePage/danyangHome?token=${encodeURIComponent(token)}`
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes).map((byte) => byte.toString(16).padStart(2, "0")).join("")
}

async function encryptPassword(password: string) {
  const encoder = new TextEncoder()
  const key = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode("2019092415weiyan"),
    { name: "AES-CBC" },
    false,
    ["encrypt"]
  )
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-CBC", iv: encoder.encode("weiyan2019092415") },
    key,
    encoder.encode(password.trim())
  )
  return bytesToHex(new Uint8Array(encrypted))
}

function isValidPassword(value: string) {
  if (value.length < 8 || value.length > 20) return false
  return [/[0-9]/.test(value), /[A-Za-z]/.test(value), /[^0-9A-Za-z]/.test(value)].filter(Boolean).length >= 2
}

async function postJson<T>(url: string, body: Record<string, unknown> = {}): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const json = (await response.json()) as ApiResponse<T>
  if (!response.ok) {
    throw new Error(json?.msg || "请求失败")
  }
  return json
}

function loadWechatScript() {
  if (window.WxLogin) return Promise.resolve()
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${WX_LOGIN_SCRIPT}"]`)
  if (existing) {
    return new Promise<void>((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true })
      existing.addEventListener("error", () => reject(new Error("微信登录脚本加载失败")), { once: true })
    })
  }
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script")
    script.src = WX_LOGIN_SCRIPT
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("微信登录脚本加载失败"))
    document.head.appendChild(script)
  })
}

export default function SmartDanzhongLoginPage() {
  const [loginType, setLoginType] = useState<LoginTab>("wechat")
  const [account, setAccount] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [wechatLoading, setWechatLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [qywxLink, setQywxLink] = useState("")
  const [wechatContainerKey, setWechatContainerKey] = useState(0)
  const [wxToken, setWxToken] = useState("")
  const [schools, setSchools] = useState<SchoolItem[]>([])
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(null)
  const [bindOpen, setBindOpen] = useState(false)
  const [bindMobile, setBindMobile] = useState("")
  const [bindCode, setBindCode] = useState("")
  const [codeCountdown, setCodeCountdown] = useState(0)
  const [firstLoginOpen, setFirstLoginOpen] = useState(false)
  const [firstLoginUserId, setFirstLoginUserId] = useState("")
  const [resetPwdForm, setResetPwdForm] = useState({ currentPwd: "", newPwd: "", confirmPwd: "" })
  const [passwordSuccessOpen, setPasswordSuccessOpen] = useState(false)

  const finishLogin = useCallback((data?: LoginData) => {
    if (data?.token) {
      window.location.href = getLoginSuccessUrl(data.token)
      return true
    }
    return false
  }, [])

  const handleWechatResponse = useCallback(
    (json: ApiResponse<LoginData>) => {
      if (json.code === 200 && finishLogin(json.data)) return
      if (json.code === 1055 && json.data?.loginSchoolIds?.length) {
        setWxToken(json.data.loginWxToken || "")
        setSchools(json.data.loginSchoolIds)
        setSelectedSchoolId(json.data.loginSchoolIds[0]?.id ?? null)
        setMessage("")
        return
      }
      if (json.code === 1060) {
        setWxToken(json.data?.loginWxToken || "")
        setBindOpen(true)
        setMessage("")
        return
      }
      throw new Error(json.msg || "登录失败")
    },
    [finishLogin]
  )

  const initWxLogin = useCallback(async () => {
    const wechatPermit = await postJson<WechatPermitData>("/api/manage/auth/wechat/permit")
    await loadWechatScript()

    if (wechatPermit.code === 200 && wechatPermit.data && window.WxLogin) {
      document.getElementById("login-code")?.replaceChildren()
      new window.WxLogin({
        id: "login-code",
        appid: wechatPermit.data.appid,
        scope: "snsapi_login",
        redirect_uri: wechatPermit.data.redirect_url,
        state: WX_LOGIN_STATE,
        style: "black",
        href: WX_LOGIN_STYLE,
      })
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get("code")
    const loginTypeParam = params.get("loginType")
    if (!code) return

    setWechatLoading(true)
    postJson<LoginData>("/api/manage/auth/wechat/login", {
      code,
      state: WX_LOGIN_STATE,
      loginType: loginTypeParam || undefined,
    })
      .then(handleWechatResponse)
      .catch((error) => setMessage(error instanceof Error ? error.message : "微信登录失败"))
      .finally(() => setWechatLoading(false))
  }, [handleWechatResponse])

  useEffect(() => {
    if (!ENABLE_QYWX_LOGIN) return

    let cancelled = false

    async function initProviderLogin() {
      try {
        const providerPermit = await postJson<WechatPermitData>("/api/manage/auth/wechat/permit", { loginType: "provider" })

        if (cancelled) return
        if (providerPermit.code === 200 && providerPermit.data) {
          setQywxLink(
            `https://open.work.weixin.qq.com/wwopen/sso/3rd_qrConnect?appid=${providerPermit.data.appid}&redirect_uri=${providerPermit.data.redirect_url}&state=WXLOGINCOMMON_www.zhxiaoyuan.cn/&usertype=member`
          )
        }
      } catch (error) {
        if (!cancelled) setMessage(error instanceof Error ? error.message : "微信登录初始化失败")
      }
    }

    initProviderLogin()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (loginType !== "wechat") return

    let cancelled = false
    window.requestAnimationFrame(() => {
      if (cancelled) return
      initWxLogin().catch((error) => {
        if (!cancelled) setMessage(error instanceof Error ? error.message : "微信登录初始化失败")
      })
    })

    return () => {
      cancelled = true
    }
  }, [initWxLogin, loginType, wechatContainerKey])

  useEffect(() => {
    if (codeCountdown <= 0) return
    const timer = window.setTimeout(() => setCodeCountdown((current) => current - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [codeCountdown])

  async function submitLogin(event: React.FormEvent) {
    event.preventDefault()
    setMessage("")
    if (!account.trim() || !password) {
      setMessage("请输入账号和密码")
      return
    }
    setLoading(true)
    try {
      const encryptedPassword = await encryptPassword(password)
      const response = await fetch("/api/manage/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account: account.trim(), encryptedPassword }),
      })
      const json = (await response.json()) as ApiResponse<LoginData>
      if (json?.code === 1052) {
        setFirstLoginUserId(String(json.data?.loginUserId ?? ""))
        setResetPwdForm({ currentPwd: password, newPwd: "", confirmPwd: "" })
        setFirstLoginOpen(true)
        setMessage("")
        return
      }
      if (!response.ok || json?.result === false || json?.code !== 200) {
        throw new Error(json?.msg || "登录失败")
      }
      if (!finishLogin(json.data)) throw new Error("登录响应缺少 token")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "登录失败")
    } finally {
      setLoading(false)
    }
  }

  async function submitFirstLoginPassword() {
    setMessage("")
    if (!resetPwdForm.currentPwd.trim()) {
      setMessage("请输入当前密码")
      return
    }
    if (resetPwdForm.currentPwd !== password) {
      setMessage("当前密码不正确")
      return
    }
    if (!resetPwdForm.newPwd.trim()) {
      setMessage("请输入新密码")
      return
    }
    if (resetPwdForm.newPwd === resetPwdForm.currentPwd) {
      setMessage("新旧密码不能相同")
      return
    }
    if (!isValidPassword(resetPwdForm.newPwd)) {
      setMessage("新密码长度为8-20个字符，至少含数字/字母/字符2种组合")
      return
    }
    if (resetPwdForm.confirmPwd !== resetPwdForm.newPwd) {
      setMessage("两次输入密码不一致")
      return
    }
    if (!firstLoginUserId) {
      setMessage("缺少用户信息，请重新登录")
      return
    }

    setLoading(true)
    try {
      const [encryptedCurrentPwd, encryptedNewPwd] = await Promise.all([
        encryptPassword(resetPwdForm.currentPwd),
        encryptPassword(resetPwdForm.newPwd),
      ])
      const json = await postJson<boolean>("/api/manage/auth/modify-password", {
        userId: firstLoginUserId,
        encryptedCurrentPwd,
        encryptedNewPwd,
      })
      if (json.code !== 200) throw new Error(json.msg || "修改密码失败")
      setFirstLoginOpen(false)
      setPassword("")
      setResetPwdForm({ currentPwd: "", newPwd: "", confirmPwd: "" })
      setMessage("")
      setPasswordSuccessOpen(true)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "修改密码失败")
    } finally {
      setLoading(false)
    }
  }

  async function submitChosenSchool() {
    if (!selectedSchoolId || !wxToken) {
      setMessage("请选择学校")
      return
    }
    setWechatLoading(true)
    try {
      const json = await postJson<LoginData>("/api/manage/auth/wechat/school", {
        schoolId: selectedSchoolId,
        wxToken,
      })
      handleWechatResponse(json)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "登录失败")
    } finally {
      setWechatLoading(false)
    }
  }

  async function sendBindCode() {
    if (!/^0?1[345789][0-9]\d{8}$/.test(bindMobile.trim())) {
      setMessage("请输入正确的手机号码")
      return
    }
    setCodeCountdown(60)
    try {
      const json = await postJson<unknown>("/api/manage/auth/wechat/code", { mobile: bindMobile.trim() })
      if (json.code !== 200) throw new Error(json.msg || "验证码发送失败")
      setMessage(json.msg || "验证码已发送")
    } catch (error) {
      setCodeCountdown(0)
      setMessage(error instanceof Error ? error.message : "验证码发送失败")
    }
  }

  async function submitBind() {
    if (!bindMobile.trim() || !bindCode.trim() || !wxToken) {
      setMessage("请输入手机号和验证码")
      return
    }
    setWechatLoading(true)
    try {
      const json = await postJson<LoginData>("/api/manage/auth/wechat/bind", {
        mobile: bindMobile.trim(),
        code: bindCode.trim(),
        wxToken,
      })
      setBindOpen(false)
      handleWechatResponse(json)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "绑定失败")
    } finally {
      setWechatLoading(false)
    }
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `linear-gradient(90deg, rgba(20,18,16,0.08), rgba(20,18,16,0.24) 48%, rgba(20,18,16,0.54)), url(${LOGIN_BG})` }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0.28))]" />
      <section className="relative z-10 flex min-h-screen items-center justify-end px-5 py-10 md:px-12 lg:px-20">
        <div className="w-full max-w-[430px] overflow-hidden rounded-lg border border-white/55 bg-[#fffaf2]/90 shadow-[0_26px_70px_rgba(32,22,16,0.34)] backdrop-blur-xl">
          <div className="h-1 bg-gradient-to-r from-[#8b1a1a] to-[#d4af37]" />
          <div className="px-8 pt-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h1 className="text-2xl font-semibold tracking-normal text-[#3b2723]">欢迎使用智慧丹中平台</h1>
              {ENABLE_QYWX_LOGIN && qywxLink ? (
                <a className="flex shrink-0 items-center gap-1 text-sm text-[#2476c8] hover:text-[#155898]" href={qywxLink}>
                  <Building2 className="h-4 w-4" />
                  企业微信
                </a>
              ) : null}
            </div>

            <div className="mb-5 grid grid-cols-2 rounded-md border border-[#eadfce] bg-white/70 p-1">
              <button
                className={`h-10 rounded text-sm font-medium ${loginType === "wechat" ? "bg-[#8b1a1a] text-white" : "text-[#6b4a2e]"}`}
                type="button"
                onClick={() => {
                  setLoginType("wechat")
                  setMessage("")
                  setWechatContainerKey((current) => current + 1)
                }}
              >
                扫码登录
              </button>
              <button
                className={`h-10 rounded text-sm font-medium ${loginType === "account" ? "bg-[#8b1a1a] text-white" : "text-[#6b4a2e]"}`}
                type="button"
                onClick={() => setLoginType("account")}
              >
                账号登录
              </button>
            </div>

            <div className="pb-8">
              <div className="flex h-[354px] items-center justify-center rounded-md border border-[#eadfce] bg-white/90 px-4 py-3">
                {loginType === "wechat" ? (
                  wechatLoading ? (
                    <Loader2 className="h-7 w-7 animate-spin text-[#8b1a1a]" />
                  ) : (
                    <div key={wechatContainerKey} id="login-code" className="wechat-login-code flex h-[315px] w-full max-w-[330px] items-start justify-center overflow-hidden" />
                  )
                ) : (
                  <form className="w-full space-y-4" onSubmit={submitLogin}>
                    <label className="relative block">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a16b2a]" />
                      <Input
                        className="h-12 border-[#eadfce] bg-white/95 pl-10 text-[#3b2723]"
                        placeholder="手机号码 / 账号"
                        value={account}
                        onChange={(event) => setAccount(event.target.value)}
                      />
                    </label>
                    <label className="relative block">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a16b2a]" />
                      <Input
                        className="h-12 border-[#eadfce] bg-white/95 pl-10 text-[#3b2723]"
                        placeholder="密码"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                      />
                    </label>
                    <Button type="submit" className="h-11 w-full bg-[#8b1a1a] text-base font-semibold tracking-[0.2em] text-white hover:bg-[#6b1010]" disabled={loading}>
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      登录
                    </Button>
                  </form>
                )}
              </div>
              <div className="mt-3 h-5 text-sm text-red-600">{message}</div>
            </div>
          </div>
        </div>
      </section>

      {schools.length ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-[560px] rounded-lg bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-[#3b2723]">选择学校</h2>
            <div className="mt-5 grid max-h-[360px] grid-cols-2 gap-3 overflow-auto sm:grid-cols-3">
              {schools.map((school) => (
                <button
                  className={`rounded-md border p-3 text-center ${selectedSchoolId === school.id ? "border-[#8b1a1a] bg-[#fff5f0]" : "border-[#eadfce]"}`}
                  key={school.id}
                  type="button"
                  onClick={() => setSelectedSchoolId(school.id)}
                >
                  <div className="mx-auto h-16 w-16 rounded bg-[#f6efe5] bg-cover bg-center" style={{ backgroundImage: school.squareLogoUrl ? `url(${school.squareLogoUrl})` : undefined }} />
                  <div className="mt-2 text-sm text-[#3b2723]">{school.name}</div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => setSchools([])}>
                取消
              </Button>
              <Button className="bg-[#8b1a1a] hover:bg-[#6b1010]" type="button" onClick={submitChosenSchool} disabled={wechatLoading}>
                进入
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {firstLoginOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-[460px] rounded-lg bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-[#3b2723]">首次登录需修改密码</h2>
            <div className="mt-5 space-y-4">
              <Input
                placeholder="当前密码"
                type="password"
                value={resetPwdForm.currentPwd}
                onChange={(event) => setResetPwdForm((current) => ({ ...current, currentPwd: event.target.value }))}
              />
              <Input
                placeholder="长度为8-20个字符，至少含数字/字母/字符2种组合"
                type="password"
                value={resetPwdForm.newPwd}
                onChange={(event) => setResetPwdForm((current) => ({ ...current, newPwd: event.target.value }))}
              />
              <Input
                placeholder="确认密码"
                type="password"
                value={resetPwdForm.confirmPwd}
                onChange={(event) => setResetPwdForm((current) => ({ ...current, confirmPwd: event.target.value }))}
              />
            </div>
            <div className="mt-3 min-h-5 text-sm text-red-600">{message}</div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => setFirstLoginOpen(false)} disabled={loading}>
                取消
              </Button>
              <Button className="bg-[#8b1a1a] hover:bg-[#6b1010]" type="button" onClick={submitFirstLoginPassword} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                确定
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {passwordSuccessOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-[420px] rounded-lg bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff5f0] text-2xl font-bold text-[#8b1a1a]">✓</div>
            <h2 className="mt-4 text-lg font-semibold text-[#3b2723]">修改成功</h2>
            <p className="mt-2 text-sm text-[#6b4a2e]">请使用新密码重新登录。</p>
            <Button
              className="mt-6 w-full bg-[#8b1a1a] hover:bg-[#6b1010]"
              type="button"
              onClick={() => setPasswordSuccessOpen(false)}
            >
              我知道了
            </Button>
          </div>
        </div>
      ) : null}

      {bindOpen ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-[460px] rounded-lg bg-white p-6 shadow-2xl">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[#3b2723]">
              <MessageCircle className="h-5 w-5 text-[#8b1a1a]" />
              验证微信账号
            </h2>
            <div className="mt-5 space-y-4">
              <div className="flex gap-2">
                <Input placeholder="当前您的手机号码" value={bindMobile} onChange={(event) => setBindMobile(event.target.value)} />
                <Button className="shrink-0" variant="outline" type="button" onClick={sendBindCode} disabled={codeCountdown > 0}>
                  {codeCountdown > 0 ? `重新获取(${codeCountdown})` : "获取验证码"}
                </Button>
              </div>
              <Input placeholder="您手机上收到的验证码" value={bindCode} onChange={(event) => setBindCode(event.target.value)} />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => setBindOpen(false)}>
                取消
              </Button>
              <Button className="bg-[#8b1a1a] hover:bg-[#6b1010]" type="button" onClick={submitBind} disabled={wechatLoading}>
                确定
              </Button>
            </div>
          </div>
        </div>
      ) : null}
      <style jsx global>{`
        .wechat-login-code iframe {
          width: 330px !important;
          height: 315px !important;
          max-width: 100%;
          border: 0;
          display: block;
        }
      `}</style>
    </main>
  )
}
