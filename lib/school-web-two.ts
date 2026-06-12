function numberFromEnv(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export const SCHOOL_WEB_TWO_CONFIG = {
  loginBaseUrl: process.env.SCHOOL_WEB_TWO_LOGIN_BASE_URL ?? "https://www.zhxiaoyuan.cn/ucenter-web",
  webBaseUrl: process.env.SCHOOL_WEB_TWO_WEB_BASE_URL ?? "https://www.zhxiaoyuan.cn/wxcepClient1",
  domainName: process.env.SCHOOL_WEB_TWO_PUBLIC_DOMAIN ?? process.env.NEXT_PUBLIC_SCHOOL_WEB_TWO_PUBLIC_DOMAIN ?? "sdz.zhxiaoyuan.cn",
  webId: numberFromEnv(process.env.SCHOOL_WEB_TWO_DEFAULT_WEB_ID, 57),
  schoolId: numberFromEnv(process.env.SCHOOL_WEB_TWO_DEFAULT_SCHOOL_ID, 7439),
  templateTypePc: process.env.SCHOOL_WEB_TWO_TEMPLATE_TYPE_PC ?? "100001",
  templateTypeMb: process.env.SCHOOL_WEB_TWO_TEMPLATE_TYPE_MB ?? "100001",
}

export type SchoolWebResponse<T> = {
  result?: boolean
  code: number
  msg: string
  data: T
}

export type ManageSession = {
  token: string
  userId: number
  userName: string
  mobile: string
  schoolId: number
  expiresAt: number
  activeWebId?: number
  activeWebName?: string
  avatar?: string | null
}

export type SiteSetting = {
  id: number
  schoolId: number
  webName: string
  keyWord: string
  description: string
  address: string
  copyRight: string
  domainName: string
  domainNameTw: string
  oldDomainName: string
  logoUrl: string
  recodation: string
  postRecodation: string
  institution: string
  isInstitute: number
  isBatch?: number
  isToModule?: number
  batchUserJson?: string | null
  moduleJson?: string | null
  templateTypePc?: string | null
  templateTypeMb?: string | null
  createTime?: string
  createUserId?: number
  createUserName?: string
}

export type PublicSiteContext = {
  domainName: string
  webId: number
  schoolId: number
  templateTypePc: string
  templateTypeMb: string
  setting: SiteSetting
}

export type SchoolWebColumn = {
  id: number
  webId: number
  schoolId: number
  name: string
  orderNo: number
  type: number
  content: string
  columnUrl: string
  logoUrl: string
  managerUserJson?: string | null
  createTime?: string
  createUserId?: number
  createUserName?: string
  moduleList?: SchoolWebModule[]
}

export type SchoolWebModule = {
  id: number
  webId: number
  schoolId: number
  columnId: number
  name: string
  orderNo: number
  type: number
  isShow: number
  content: string
  columnUrl: string
  logoUrl: string
  createTime?: string
  createUserId?: number
  createUserName?: string
}

export type SchoolWebMessage = {
  id: number
  webId: number
  schoolId: number
  title: string
  titleMark: string
  content: string | null
  moduleIds: string
  moduleNames?: string
  messageType: number
  messageTypeName: string
  state: number
  fileJson: string | null
  logoUrl: string
  messageUrl: string
  mark: string
  orderNo: number
  setTop?: number
  createTime: string
  createUserId?: number
  createUserName?: string
  updateTime?: string | null
  readCount?: number
}

export type SuspendMessage = {
  id: number
  webId: number
  title: string
  startTime: string
  endTime: string
  messageType: number
  messageUrl: string
  fileJson: string | null
  messageJson: string | null
  createTime?: string
}

export type LetterBoxItem = {
  id: number
  webId: number
  title: string
  content: string
  email?: string
  contactType?: number
  status?: number
  replyContent?: string
  inscribe?: string
  createTime?: string
}

export type AccessSummary = {
  dateNumber: number
  monthNumber: number
  totalNumber: number
}

export type AccessTrendItem = {
  dateStr?: string
  accessNumber?: number
  totalNumber?: number
  dateNumber?: number
  monthNumber?: number
  [key: string]: unknown
}

export type Pagination = {
  firstPage: number
  lastPage: number
  pageNo: number
  pageSize: number
  pages: number
  total: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
}

export type PaginatedResult<T> = {
  dataList: T[]
  pagination: Pagination
  titleList?: string[] | null
}

export type HomeMessageSummary = {
  id: number
  title: string
  logoUrl: string
  messageType: number
  messageUrl: string
  createTime: string
}

export type HomeModuleSummary = {
  id: number
  name: string
  type: number
  logoUrl: string
  columnUrl: string
  messageList: HomeMessageSummary[]
}

export type HomeColumnSummary = {
  id: number
  name: string
  type: number
  logoUrl: string
  columnUrl: string
  moduleList: HomeModuleSummary[]
}

export type PcHomeTemplate = {
  initJson: Record<string, unknown>
  moduleList: { orderNum: number; moduleListJson: HomeModuleSummary[] }[]
  columnList: HomeColumnSummary[]
  photoJson: string[]
  urlModuleType?: number
  urlModuleJson?: unknown[]
}

export type PcTemplatePayload = {
  urlModuleJson: unknown[]
  urlModule2Json: unknown[]
  templateType: string
  urlModuleType: number
  moduleJson: unknown[]
  webId: number
  photoJson: string[]
  initJson: Record<string, unknown>
  columnJson: unknown[]
}

export type MbTemplatePayload = {
  messageInitJson: Record<string, unknown>
  moduleJson: unknown[]
  moduleInitJson: Record<string, unknown>
  photoJson: string[]
  templateType: string
  webId: number
  initJson: Record<string, unknown>
}

export type PcTwTemplatePayload = {
  rollModuleJson: Record<string, unknown>
  initJson: Record<string, unknown>
  templateType: string
  webId: number
  middleModuleJson: unknown[]
  leftMessageJson: Record<string, unknown>
  rightColumnJson: unknown[]
  columnJson: unknown[]
  photoJson: string[]
  bottomPhotoModuleJson: Record<string, unknown>
  leftModuleJson: Record<string, unknown>
  urlLeftModuleJson: unknown[]
}

export type MbTwTemplatePayload = {
  bottomModuleJson: unknown[]
  moduleJson: unknown[]
  tableModuleJson: Record<string, unknown>
  photoJson: string[]
  templateType: string
  webId: number
  initJson: Record<string, unknown>
  photoModuleJson: Record<string, unknown>
}

export type NavigationTreeNode = {
  id: number
  label: string
  href: string
  image: string
  type: number
  children: {
    id: number
    label: string
    href: string
    image: string
    type: number
    isVisible: boolean
  }[]
}

type RequestScope = "common" | "structure"

type RequestOptions = {
  scope: RequestScope
  endpoint: string
  method?: "GET" | "POST"
  query?: Record<string, unknown>
  body?: unknown
  token?: string
}

type WxcepRequestOptions = {
  endpoint: string
  method?: "GET" | "POST"
  query?: Record<string, unknown>
  body?: Record<string, unknown>
  token?: string
  contentType?: "json" | "form"
}

export type LoginResponseData = {
  token: string
  expires?: number
  loginUserId?: number
  loginWxToken?: string | null
  loginSchoolIds?: Array<{
    id: number
    name: string
    squareLogoUrl?: string
  }>
  userPageModel?: {
    id?: number
    name?: string
    mobile?: string
    avatar?: string | null
    schoolId?: number
  }
}

export type WechatPermitData = {
  appid: string
  redirect_url: string
}

export type WechatLoginData = LoginResponseData

function normalizeEndpoint(endpoint: string) {
  return endpoint.replace(/^\/+/, "").replace(/\/{2,}/g, "/")
}

function toQueryString(query: Record<string, unknown>) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue
    params.set(key, typeof value === "string" ? value : String(value))
  }

  return params.toString()
}

function buildSchoolWebUrl(scope: RequestScope, endpoint: string, query?: Record<string, unknown>) {
  const baseUrl = SCHOOL_WEB_TWO_CONFIG.webBaseUrl
  const path = `${scope}/schoolWebTwo/${normalizeEndpoint(endpoint)}`
  const url = new URL(`${baseUrl}/${path}`)
  const queryString = query ? toQueryString(query) : ""
  if (queryString) url.search = queryString
  return url.toString()
}

export function encryptPassword(password: string): string {
  // AES-128-CBC, same key/iv as newPC/src/utils/utils.js encrypt()
  const { createCipheriv } = require("node:crypto") as typeof import("node:crypto")
  const key = Buffer.from("2019092415weiyan", "utf8")
  const iv = Buffer.from("weiyan2019092415", "utf8")
  const cipher = createCipheriv("aes-128-cbc", key, iv)
  let encrypted = cipher.update(password.trim(), "utf8", "hex")
  encrypted += cipher.final("hex")
  return encrypted
}

export async function teacherLoginRaw(account: string, password: string, encryptedPassword?: string): Promise<SchoolWebResponse<LoginResponseData>> {
  const body = new URLSearchParams()
  body.append("account", account)
  body.append("password", encryptedPassword || encryptPassword(password))

  const url = `${SCHOOL_WEB_TWO_CONFIG.loginBaseUrl}/login`
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  })
  const text = await response.text()
  const json = (text ? JSON.parse(text) : {}) as SchoolWebResponse<LoginResponseData>

  if (!response.ok) {
    throw new Error(json.msg || `登录失败（${response.status}）`)
  }

  return json
}

export async function teacherLogin(account: string, password: string): Promise<ManageSession> {
  const json = await teacherLoginRaw(account, password)

  if (!isSchoolWebSuccess(json) || !json.data?.token) {
    throw new Error(json.msg || "登录失败")
  }

  return buildManageSessionFromLoginData(json.data, account)
}

export function buildManageSessionFromLoginData(data: LoginResponseData, fallbackName = ""): ManageSession {
  const user = data.userPageModel ?? {}
  return {
    token: data.token,
    userId: user.id ?? data.loginUserId ?? 0,
    userName: user.name ?? fallbackName,
    mobile: user.mobile ?? fallbackName,
    schoolId: user.schoolId ?? SCHOOL_WEB_TWO_CONFIG.schoolId,
    avatar: user.avatar ?? null,
    expiresAt: Date.now() + (data.expires ?? 7200) * 1000,
  }
}

export function postLoginEndpoint<T>(endpoint: string, body?: Record<string, unknown>): Promise<SchoolWebResponse<T>> {
  return postLoginForm<T>(endpoint, body)
}

async function postLoginForm<T>(endpoint: string, body?: Record<string, unknown>): Promise<SchoolWebResponse<T>> {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(body ?? {})) {
    if (value === undefined || value === null || value === "") continue
    params.set(key, typeof value === "string" ? value : String(value))
  }

  const response = await fetch(`${SCHOOL_WEB_TWO_CONFIG.loginBaseUrl}/${normalizeEndpoint(endpoint)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
    cache: "no-store",
  })
  const text = await response.text()
  const json = (text ? JSON.parse(text) : {}) as SchoolWebResponse<T>

  if (!response.ok) {
    throw new Error(json.msg || `请求失败（${response.status}）`)
  }

  return json
}

export async function requestSchoolWeb<T>({
  scope,
  endpoint,
  method = "GET",
  query = {},
  body,
  token,
}: RequestOptions): Promise<SchoolWebResponse<T>> {
  const fullQuery = {
    ...query,
    ...(token ? { token } : {}),
  }
  const url = buildSchoolWebUrl(scope, endpoint, fullQuery)
  const response = await fetch(url, {
    method,
    cache: "no-store",
    headers: method === "POST" ? { "Content-Type": "application/json" } : undefined,
    body: method === "POST" ? JSON.stringify(body ?? {}) : undefined,
  })

  const text = await response.text()
  const json = (text ? JSON.parse(text) : {}) as SchoolWebResponse<T>

  if (!response.ok) {
    throw new Error(json.msg || `请求失败（${response.status}）`)
  }

  return json
}

export async function requestWxcep<T>({
  endpoint,
  method = "GET",
  query = {},
  body,
  token,
  contentType = "form",
}: WxcepRequestOptions): Promise<SchoolWebResponse<T>> {
  const url = new URL(`${SCHOOL_WEB_TWO_CONFIG.webBaseUrl}/${normalizeEndpoint(endpoint)}`)
  const fullQuery = {
    ...query,
    ...(token ? { token } : {}),
  }
  const queryString = toQueryString(fullQuery)
  if (queryString) url.search = queryString

  let requestBody: BodyInit | undefined
  let headers: HeadersInit | undefined
  if (method === "POST") {
    if (contentType === "json") {
      requestBody = JSON.stringify(body ?? {})
      headers = { "Content-Type": "application/json" }
    } else {
      const params = new URLSearchParams()
      for (const [key, value] of Object.entries(body ?? {})) {
        if (value === undefined || value === null) continue
        params.set(key, typeof value === "string" ? value : String(value))
      }
      requestBody = params
    }
  }

  const response = await fetch(url.toString(), {
    method,
    cache: "no-store",
    headers,
    body: requestBody,
  })
  const text = await response.text()
  const json = (text ? JSON.parse(text) : {}) as SchoolWebResponse<T>

  if (!response.ok) {
    throw new Error(json.msg || `请求失败（${response.status}）`)
  }

  return json
}

export function isSchoolWebSuccess<T>(response: SchoolWebResponse<T>) {
  return response.code === 200 && response.result !== false
}

export function unwrapSchoolWebResponse<T>(response: SchoolWebResponse<T>) {
  if (!isSchoolWebSuccess(response)) {
    throw new Error(response.msg || "接口请求失败")
  }
  return response.data
}

export function withWebContext<T extends Record<string, unknown>>(payload?: T) {
  return {
    webId: SCHOOL_WEB_TWO_CONFIG.webId,
    schoolId: SCHOOL_WEB_TWO_CONFIG.schoolId,
    ...(payload ?? {}),
  }
}

export function defaultPcTwTemplatePayload(): PcTwTemplatePayload {
  return {
    rollModuleJson: {},
    initJson: {
      infoType: 1,
      initPhoto: "",
      shufflingTime: 3,
      windowType: 1,
    },
    templateType: SCHOOL_WEB_TWO_CONFIG.templateTypePc,
    webId: SCHOOL_WEB_TWO_CONFIG.webId,
    middleModuleJson: [],
    leftMessageJson: {},
    rightColumnJson: [],
    columnJson: [],
    photoJson: [],
    bottomPhotoModuleJson: {},
    leftModuleJson: {},
    urlLeftModuleJson: [],
  }
}

export function defaultPcTemplatePayload(): PcTemplatePayload {
  return {
    urlModuleJson: [],
    urlModule2Json: [],
    templateType: SCHOOL_WEB_TWO_CONFIG.templateTypePc,
    urlModuleType: 1,
    moduleJson: [],
    webId: SCHOOL_WEB_TWO_CONFIG.webId,
    photoJson: [],
    initJson: {
      infoType: 1,
      initPhoto: "",
      shufflingTime: 3,
      windowType: 1,
    },
    columnJson: [],
  }
}

export function defaultMbTemplatePayload(): MbTemplatePayload {
  return {
    messageInitJson: {},
    moduleJson: [],
    moduleInitJson: {},
    photoJson: [],
    templateType: SCHOOL_WEB_TWO_CONFIG.templateTypeMb,
    webId: SCHOOL_WEB_TWO_CONFIG.webId,
    initJson: {
      infoType: 1,
      initPhoto: "",
      shufflingTime: 3,
      windowType: 1,
    },
  }
}

export function defaultMbTwTemplatePayload(): MbTwTemplatePayload {
  return {
    bottomModuleJson: [],
    moduleJson: [],
    tableModuleJson: {},
    photoJson: [],
    templateType: SCHOOL_WEB_TWO_CONFIG.templateTypeMb,
    webId: SCHOOL_WEB_TWO_CONFIG.webId,
    initJson: {
      infoType: 1,
      initPhoto: "",
      shufflingTime: 3,
      windowType: 1,
    },
    photoModuleJson: {},
  }
}

export function toColumnHref(columnId: number) {
  return `/site/${columnId}`
}

export function toModuleHref(columnId: number, moduleId: number) {
  return `/site/${columnId}/${moduleId}`
}

export function toMessageHref(messageId: number) {
  return `/site/message/${messageId}`
}

export function extractPrimaryModuleId(moduleIds: string) {
  return Number(String(moduleIds).split(",").map((item) => item.trim()).find(Boolean) ?? 0)
}

export function safeJsonParse<T>(value: unknown, fallback: T): T {
  if (Array.isArray(value) || (value && typeof value === "object")) {
    return value as T
  }
  if (typeof value !== "string" || !value.trim()) return fallback

  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function stringifyJsonLike(value: unknown, fallback = "") {
  if (typeof value === "string") return value
  if (value === undefined || value === null) return fallback

  try {
    return JSON.stringify(value)
  } catch {
    return fallback
  }
}

export function normalizeHomeTemplate(raw: Record<string, unknown> | null | undefined): PcHomeTemplate {
  const data = raw ?? {}
  return {
    initJson: safeJsonParse<Record<string, unknown>>(data.initJson, {}),
    moduleList: Array.isArray(data.moduleList)
      ? (data.moduleList as { orderNum: number; moduleListJson: HomeModuleSummary[] }[])
      : [],
    columnList: Array.isArray(data.columnList) ? (data.columnList as HomeColumnSummary[]) : [],
    photoJson: safeJsonParse<string[]>(data.photoJson, []),
    urlModuleType: typeof data.urlModuleType === "number" ? data.urlModuleType : undefined,
    urlModuleJson: safeJsonParse<unknown[]>(data.urlModuleJson, []),
  }
}

export function createDefaultSiteSetting(domainName = SCHOOL_WEB_TWO_CONFIG.domainName): SiteSetting {
  return {
    id: SCHOOL_WEB_TWO_CONFIG.webId,
    schoolId: SCHOOL_WEB_TWO_CONFIG.schoolId,
    webName: "",
    keyWord: "",
    description: "",
    address: "",
    copyRight: "",
    domainName,
    domainNameTw: "",
    oldDomainName: "",
    logoUrl: "",
    recodation: "",
    postRecodation: "",
    institution: "",
    isInstitute: 0,
    templateTypePc: SCHOOL_WEB_TWO_CONFIG.templateTypePc,
    templateTypeMb: SCHOOL_WEB_TWO_CONFIG.templateTypeMb,
  }
}

export function createPublicSiteContext(
  setting: SiteSetting | null | undefined,
  requestDomain?: string,
): PublicSiteContext {
  const resolved = setting ?? createDefaultSiteSetting(requestDomain)
  return {
    domainName: resolved.domainName || requestDomain || SCHOOL_WEB_TWO_CONFIG.domainName,
    webId: Number(resolved.id || SCHOOL_WEB_TWO_CONFIG.webId),
    schoolId: Number(resolved.schoolId || SCHOOL_WEB_TWO_CONFIG.schoolId),
    templateTypePc: String(resolved.templateTypePc || SCHOOL_WEB_TWO_CONFIG.templateTypePc),
    templateTypeMb: String(resolved.templateTypeMb || SCHOOL_WEB_TWO_CONFIG.templateTypeMb),
    setting: resolved,
  }
}

export async function getPublicSiteSetting(domain = SCHOOL_WEB_TWO_CONFIG.domainName) {
  const response = await requestSchoolWeb<SiteSetting | null>({
    scope: "common",
    endpoint: "getSchoolWebSettingByDomainName",
    query: {
      domain,
    },
  })
  return unwrapSchoolWebResponse(response)
}

export async function getPublicHomeTemplate(context?: Pick<PublicSiteContext, "webId" | "templateTypePc">) {
  const response = await requestSchoolWeb<Record<string, unknown> | null>({
    scope: "common",
    endpoint: "getSchoolWebTemplatePcHome",
    query: {
      webId: context?.webId ?? SCHOOL_WEB_TWO_CONFIG.webId,
      templateType: context?.templateTypePc ?? SCHOOL_WEB_TWO_CONFIG.templateTypePc,
    },
  })
  return normalizeHomeTemplate(unwrapSchoolWebResponse(response))
}

export async function getPublicColumnListByWebId(webId = SCHOOL_WEB_TWO_CONFIG.webId) {
  const response = await requestSchoolWeb<SchoolWebColumn[]>({
    scope: "common",
    endpoint: "getSchooWebColumnListByWebId",
    query: { webId },
  })
  const data = unwrapSchoolWebResponse(response)
  return Array.isArray(data) ? data.map(hydrateColumn).sort((a, b) => a.orderNo - b.orderNo) : []
}

export async function getPublicModuleListByColumnId(columnId: number) {
  const response = await requestSchoolWeb<SchoolWebModule[]>({
    scope: "common",
    endpoint: "getSchoolWebModuleListByColumnId",
    query: { columnId },
  })
  const data = unwrapSchoolWebResponse(response)
  return Array.isArray(data) ? data.map(hydrateModule).sort((a, b) => a.orderNo - b.orderNo) : []
}

export async function getPublicNavigationColumns(webId = SCHOOL_WEB_TWO_CONFIG.webId) {
  const columns = await getPublicColumnListByWebId(webId)
  const columnsWithModules = await Promise.all(
    columns.map(async (column) => {
      const modules = await getPublicModuleListByColumnId(column.id)
      return {
        id: column.id,
        name: column.name,
        type: column.type,
        logoUrl: column.logoUrl,
        columnUrl: column.columnUrl,
        moduleList: modules
          .filter((module) => module.isShow !== 2)
          .map((module) => ({
            id: module.id,
            name: module.name,
            type: module.type,
            logoUrl: module.logoUrl,
            columnUrl: module.columnUrl,
            messageList: [],
          })),
      } satisfies HomeColumnSummary
    })
  )
  return columnsWithModules
}

export async function getPublicPcTwHomeTemplate(context?: Pick<PublicSiteContext, "webId" | "templateTypePc">) {
  const response = await requestSchoolWeb<Record<string, unknown> | null>({
    scope: "common",
    endpoint: "getSchoolWebTemplatePcTwHome",
    query: {
      webId: context?.webId ?? SCHOOL_WEB_TWO_CONFIG.webId,
      templateType: context?.templateTypePc ?? SCHOOL_WEB_TWO_CONFIG.templateTypePc,
    },
  })
  return unwrapSchoolWebResponse(response)
}

export async function getPublicMbTwHomeTemplate(context?: Pick<PublicSiteContext, "webId" | "templateTypeMb">) {
  const response = await requestSchoolWeb<Record<string, unknown> | null>({
    scope: "common",
    endpoint: "getSchoolWebTemplateMbTwHome",
    query: {
      webId: context?.webId ?? SCHOOL_WEB_TWO_CONFIG.webId,
      templateType: context?.templateTypeMb ?? SCHOOL_WEB_TWO_CONFIG.templateTypeMb,
    },
  })
  return unwrapSchoolWebResponse(response)
}

export async function getPublicColumnById(columnId: number) {
  const response = await requestSchoolWeb<SchoolWebColumn>({
    scope: "common",
    endpoint: "getSchooWebColumnById",
    query: { columnId },
  })
  return hydrateColumn(unwrapSchoolWebResponse(response))
}

export async function getPublicModuleById(moduleId: number) {
  const response = await requestSchoolWeb<SchoolWebModule>({
    scope: "common",
    endpoint: "getSchoolWebModuleById",
    query: { moduleId },
  })
  return hydrateModule(unwrapSchoolWebResponse(response))
}

export async function getPublicModuleMessages(moduleId: number, pageNo = 1, pageSize = 10) {
  const response = await requestSchoolWeb<PaginatedResult<SchoolWebMessage>>({
    scope: "common",
    endpoint: "getSchoolWebModuleMessageList",
    query: {
      moduleId,
      pageNo,
      pageSize,
    },
  })
  const result = unwrapSchoolWebResponse(response)
  return {
    ...result,
    dataList: Array.isArray(result.dataList) ? result.dataList.map(hydrateMessage) : [],
  }
}

export async function getPublicMessageById(messageId: number) {
  const response = await requestSchoolWeb<SchoolWebMessage>({
    scope: "common",
    endpoint: "getSchoolWebModuleMessageById",
    query: { messageId },
  })
  return hydrateMessage(unwrapSchoolWebResponse(response))
}

export async function getPublicPrevNextMessage(moduleId: number, createTime: string) {
  const response = await requestSchoolWeb<Record<string, SchoolWebMessage | null>>({
    scope: "common",
    endpoint: "getLastAndNextSchoolMessage",
    query: {
      moduleId,
      createTime,
    },
  })
  const data = unwrapSchoolWebResponse(response)
  return {
    lastMessage: data.lastMessage ? hydrateMessage(data.lastMessage) : null,
    nextMessage: data.nextMessage ? hydrateMessage(data.nextMessage) : null,
  }
}

export async function getPublicSuspendMessagesByTime(searchTime: string, context?: Pick<PublicSiteContext, "webId">) {
  const response = await requestSchoolWeb<SuspendMessage[]>({
    scope: "common",
    endpoint: "getSchoolWebSuspendMessageListByTime",
    query: {
      webId: context?.webId ?? SCHOOL_WEB_TWO_CONFIG.webId,
      searchTime,
    },
  })
  const data = unwrapSchoolWebResponse(response)
  return Array.isArray(data) ? data.map(hydrateSuspendMessage) : []
}

export async function getPublicLetterBoxById(messageId: number) {
  const response = await requestSchoolWeb<LetterBoxItem>({
    scope: "common",
    endpoint: "getSchoolWebLetterBoxById",
    query: { messageId },
  })
  return hydrateLetterBox(unwrapSchoolWebResponse(response))
}

export async function getPublicLetterBoxList(query?: { pageNo?: number; pageSize?: number; title?: string }, context?: Pick<PublicSiteContext, "webId">) {
  const response = await requestSchoolWeb<PaginatedResult<LetterBoxItem>>({
    scope: "common",
    endpoint: "getPublicSchoolWebLetterBoxList",
    query: {
      pageNo: query?.pageNo ?? 1,
      pageSize: query?.pageSize ?? 20,
      webId: context?.webId ?? SCHOOL_WEB_TWO_CONFIG.webId,
      title: query?.title ?? "",
    },
  })
  const data = unwrapSchoolWebResponse(response)
  return {
    ...data,
    dataList: Array.isArray(data.dataList) ? data.dataList.map(hydrateLetterBox) : [],
  }
}

export function hydrateColumn(column: Partial<SchoolWebColumn>) {
  return {
    id: Number(column.id ?? 0),
    webId: Number(column.webId ?? SCHOOL_WEB_TWO_CONFIG.webId),
    schoolId: Number(column.schoolId ?? SCHOOL_WEB_TWO_CONFIG.schoolId),
    name: String(column.name ?? ""),
    orderNo: Number(column.orderNo ?? 0),
    type: Number(column.type ?? 2),
    content: String(column.content ?? ""),
    columnUrl: String(column.columnUrl ?? ""),
    logoUrl: String(column.logoUrl ?? ""),
    managerUserJson: column.managerUserJson ?? null,
    createTime: column.createTime,
    createUserId: column.createUserId,
    createUserName: column.createUserName,
    moduleList: Array.isArray(column.moduleList) ? column.moduleList.map(hydrateModule) : [],
  } satisfies SchoolWebColumn
}

export function hydrateModule(module: Partial<SchoolWebModule>) {
  return {
    id: Number(module.id ?? 0),
    webId: Number(module.webId ?? SCHOOL_WEB_TWO_CONFIG.webId),
    schoolId: Number(module.schoolId ?? SCHOOL_WEB_TWO_CONFIG.schoolId),
    columnId: Number(module.columnId ?? 0),
    name: String(module.name ?? ""),
    orderNo: Number(module.orderNo ?? 0),
    type: Number(module.type ?? 2),
    isShow: Number(module.isShow ?? 1),
    content: String(module.content ?? ""),
    columnUrl: String(module.columnUrl ?? ""),
    logoUrl: String(module.logoUrl ?? ""),
    createTime: module.createTime,
    createUserId: module.createUserId,
    createUserName: module.createUserName,
  } satisfies SchoolWebModule
}

export function hydrateMessage(message: Partial<SchoolWebMessage>) {
  return {
    id: Number(message.id ?? 0),
    webId: Number(message.webId ?? SCHOOL_WEB_TWO_CONFIG.webId),
    schoolId: Number(message.schoolId ?? SCHOOL_WEB_TWO_CONFIG.schoolId),
    title: String(message.title ?? ""),
    titleMark: String(message.titleMark ?? ""),
    content: typeof message.content === "string" ? message.content : null,
    moduleIds: String(message.moduleIds ?? ""),
    moduleNames: message.moduleNames,
    messageType: Number(message.messageType ?? 1),
    messageTypeName: String(message.messageTypeName ?? "普通类型"),
    state: Number(message.state ?? 2),
    fileJson: stringifyJsonLike(message.fileJson, "[]"),
    logoUrl: String(message.logoUrl ?? ""),
    messageUrl: String(message.messageUrl ?? ""),
    mark: String(message.mark ?? ""),
    orderNo: Number(message.orderNo ?? 0),
    setTop: typeof message.setTop === "number" ? message.setTop : undefined,
    createTime: String(message.createTime ?? ""),
    createUserId: message.createUserId,
    createUserName: message.createUserName,
    updateTime: message.updateTime ?? null,
    readCount: typeof message.readCount === "number" ? message.readCount : 0,
  } satisfies SchoolWebMessage
}

export function hydrateSuspendMessage(message: Partial<SuspendMessage>) {
  return {
    id: Number(message.id ?? 0),
    webId: Number(message.webId ?? SCHOOL_WEB_TWO_CONFIG.webId),
    title: String(message.title ?? ""),
    startTime: String(message.startTime ?? ""),
    endTime: String(message.endTime ?? ""),
    messageType: Number(message.messageType ?? 1),
    messageUrl: String(message.messageUrl ?? ""),
    fileJson: stringifyJsonLike(message.fileJson, "[]"),
    messageJson: stringifyJsonLike(message.messageJson, "{}"),
    createTime: message.createTime,
  } satisfies SuspendMessage
}

export function hydrateLetterBox(item: Partial<LetterBoxItem>) {
  return {
    id: Number(item.id ?? 0),
    webId: Number(item.webId ?? SCHOOL_WEB_TWO_CONFIG.webId),
    title: String(item.title ?? ""),
    content: String(item.content ?? ""),
    email: item.email ?? "",
    contactType: Number(item.contactType ?? 1),
    status: Number(item.status ?? 1),
    replyContent: item.replyContent ?? "",
    inscribe: item.inscribe ?? "",
    createTime: item.createTime,
  } satisfies LetterBoxItem
}
