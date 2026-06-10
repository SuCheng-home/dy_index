"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { BellRing, BookOpen, ChevronRight, Columns3, Download, FileJson, Globe, LineChart, Loader2, Mailbox, RefreshCw, Save, Search, Send, ShieldCheck, Trash2, UserPlus, X } from "lucide-react"
import { CartesianGrid, Line, LineChart as RechartsLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { ImageUploadField, ManagedUploader, parseManagedFiles, stringifyManagedFiles } from "@/components/manage/managed-uploader"
import { UEditorField } from "@/components/manage/ueditor-field"
import type {
  AccessTrendItem,
  LetterBoxItem,
  MbTemplatePayload,
  MbTwTemplatePayload,
  ManageSession,
  PaginatedResult,
  PcTemplatePayload,
  PcTwTemplatePayload,
  SchoolWebColumn,
  SchoolWebMessage,
  SchoolWebModule,
  SiteSetting,
  SuspendMessage,
} from "@/lib/school-web-two"

type SectionKey =
  | "stats"
  | "workload"
  | "content"
  | "site"
  | "suspend"
  | "letterbox"
  | "templates"
  | "interface-tools"
  | "columns"
  | "modules"
  | "messages"
  | "mapping"

type UrlResource = {
  id: string
  name: string
  logoUrl: string
  url: string
  type: number
}

type BootstrapPayload = {
  session: ManageSession
  siteList: SiteSetting[]
  activeWebId: number
  siteSetting: SiteSetting
  columns: SchoolWebColumn[]
  moduleGroups: { column: SchoolWebColumn; modules: SchoolWebModule[] }[]
  pcTemplate: PcTwTemplatePayload
  mbTemplate: MbTwTemplatePayload
}

type TemplateResource = {
  id: number
  name: string
  logoUrl: string
  type: number
  columnUrl?: string
  url?: string
}

type AddressBookItem = {
  id: number
  pid?: number
  name: string
  loginname?: string
  mobile?: string
  avatar?: string
  dataType: "depart" | "user" | "group"
  hasChild?: boolean
  checked?: boolean
  type?: number | string
  wxDepartId?: string | number
  wxTagId?: string | number
}

type AddressBookValue = {
  departJson: AddressBookItem[]
  userJson: AddressBookItem[]
  groupJson: AddressBookItem[]
}

type WorkloadDimension = "person" | "department"
type WorkloadPeriodType = "month" | "semester"
type WorkloadCategory = {
  key: string
  name: string
}
type WorkloadStatRow = {
  id: string
  name: string
  values: Record<string, number>
}
type WorkloadReport = {
  title: string
  categories: WorkloadCategory[]
  rows: WorkloadStatRow[]
}

const sections: { key: SectionKey; label: string; icon: typeof Globe }[] = [
  { key: "stats", label: "访问统计", icon: LineChart },
  { key: "workload", label: "工作量统计", icon: BookOpen },
  { key: "site", label: "网站设置", icon: Globe },
  { key: "content", label: "栏目管理", icon: Columns3 },
  // { key: "suspend", label: "悬浮消息", icon: BellRing },
  // { key: "letterbox", label: "校长信箱", icon: Mailbox },
  // { key: "templates", label: "模板管理", icon: FileJson },
  // { key: "interface-tools", label: "接口工具", icon: BookOpen },
]

const menuTypeOptions = [
  { value: 1, label: "展示型" },
  { value: 2, label: "列表型" },
  { value: 3, label: "图片型" },
  { value: 4, label: "URL 类型" },
]

const messageTypeOptions = [
  { value: 1, label: "普通类型" },
  { value: 2, label: "URL 类型" },
]

const messageStateOptions = [
  { value: 1, label: "不发布" },
  { value: 2, label: "发布" },
  { value: 3, label: "待审批" },
  { value: 4, label: "通过" },
  { value: 5, label: "驳回" },
]

const workloadCategories: WorkloadCategory[] = [
  { key: "campus", name: "校园信息" },
  { key: "party", name: "党建工作" },
  { key: "moral", name: "德育之窗" },
  { key: "teaching", name: "教学科研" },
  { key: "notice", name: "通知公告" },
]

const mockPersonWorkloadRows: WorkloadStatRow[] = [
  { id: "u-1", name: "张三", values: { campus: 3, party: 0, moral: 0, teaching: 1, notice: 1 } },
  { id: "u-2", name: "李四", values: { campus: 2, party: 0, moral: 0, teaching: 2, notice: 1 } },
  { id: "u-3", name: "王五", values: { campus: 1, party: 0, moral: 0, teaching: 2, notice: 1 } },
]

const mockDepartmentWorkloadRows: WorkloadStatRow[] = [
  { id: "d-1", name: "办公室", values: { campus: 3, party: 0, moral: 0, teaching: 1, notice: 1 } },
  { id: "d-2", name: "党政办", values: { campus: 2, party: 0, moral: 0, teaching: 2, notice: 1 } },
  { id: "d-3", name: "教务处", values: { campus: 1, party: 0, moral: 0, teaching: 2, notice: 1 } },
]

const workloadSemesterOptions = [
  "2026学年第1学期",
  "2025学年第2学期",
  "2025学年第1学期",
]

const emptySiteSetting: SiteSetting = {
  id: 57,
  schoolId: 7439,
  webName: "",
  keyWord: "",
  description: "",
  address: "",
  copyRight: "",
  domainName: "",
  domainNameTw: "",
  oldDomainName: "",
  logoUrl: "",
  recodation: "",
  postRecodation: "",
  institution: "",
  isInstitute: 1,
}

const emptyColumn: SchoolWebColumn = {
  id: 0,
  webId: 57,
  schoolId: 7439,
  name: "",
  orderNo: 0,
  type: 1,
  content: "",
  columnUrl: "",
  logoUrl: "",
  managerUserJson: "[]",
}

const emptyModule: SchoolWebModule = {
  id: 0,
  webId: 57,
  schoolId: 7439,
  columnId: 0,
  name: "",
  orderNo: 0,
  type: 1,
  isShow: 1,
  content: "",
  columnUrl: "",
  logoUrl: "",
}

const emptyMessage: SchoolWebMessage = {
  id: 0,
  webId: 57,
  schoolId: 7439,
  title: "",
  titleMark: "",
  content: "",
  moduleIds: "",
  moduleNames: "",
  messageType: 1,
  messageTypeName: "普通类型",
  state: 2,
  fileJson: "[]",
  logoUrl: "",
  messageUrl: "",
  mark: "",
  orderNo: 0,
  createTime: "",
}

const emptySuspendMessage: SuspendMessage = {
  id: 0,
  webId: 57,
  title: "",
  startTime: "",
  endTime: "",
  messageType: 1,
  messageUrl: "",
  fileJson: "[]",
  messageJson: "{}",
}

const emptyLetterBox: LetterBoxItem = {
  id: 0,
  webId: 57,
  title: "",
  content: "",
  email: "",
  contactType: 1,
  status: 1,
  replyContent: "",
  inscribe: "",
}

type TreeSelection =
  | { type: "root" }
  | { type: "column-form"; columnId: number }
  | { type: "column"; columnId: number }
  | { type: "module"; columnId: number; moduleId: number }
  | { type: "messages"; columnId: number; moduleId: number }
  | { type: "message"; columnId: number; moduleId: number; messageId: number }

type DeleteConfirmDialog = {
  open: boolean
  title: string
  description: string
  confirmText: string
  onConfirm?: () => Promise<void> | void
}

const blankHtmlPattern = /^(\s|&nbsp;|<p><br\/?><\/p>|<p><br><\/p>|<br\/?>|<p>\s*<\/p>)+$/i
const httpUrlPattern = /^https?:\/\/[A-Za-z0-9][^<>"\s]*$/i

async function requestJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })
  const json = await response.json()
  if (!response.ok || json?.result === false || json?.code !== 200) {
    throw new Error(json?.msg || "请求失败")
  }
  return json.data as T
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()
}

function hasRichText(value?: string | null) {
  const content = value ?? ""
  if (!content.trim() || blankHtmlPattern.test(content.trim())) return false
  return stripHtml(content).length > 0 || /<(img|video|table|iframe)\b/i.test(content)
}

function normalizeAddressItem(item: unknown): AddressBookItem | null {
  if (!item || typeof item !== "object") return null
  const record = item as Record<string, unknown>
  const id = Number(record.id)
  if (!id || !record.name) return null
  const dataType = record.dataType === "depart" || record.dataType === "group" || record.dataType === "user"
    ? record.dataType
    : "user"
  return {
    id,
    pid: record.pid === undefined ? undefined : Number(record.pid),
    name: String(record.name),
    loginname: record.loginname ? String(record.loginname) : undefined,
    mobile: record.mobile ? String(record.mobile) : undefined,
    avatar: record.avatar || record.photoImg ? String(record.avatar ?? record.photoImg) : undefined,
    dataType,
    hasChild: record.hasChild === true || record.hasChild === 1,
    type: record.type as number | string | undefined,
    wxDepartId: record.wxDepartId as string | number | undefined,
    wxTagId: record.wxTagId as string | number | undefined,
  }
}

function normalizeManagerValue(value?: string | null | AddressBookItem[] | AddressBookValue): AddressBookValue {
  const empty: AddressBookValue = { departJson: [], userJson: [], groupJson: [] }
  if (!value) return empty
  let parsed: unknown = value
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value)
    } catch {
      return empty
    }
  }
  if (Array.isArray(parsed)) {
    return {
      ...empty,
      userJson: parsed.map(normalizeAddressItem).filter(Boolean) as AddressBookItem[],
    }
  }
  if (parsed && typeof parsed === "object") {
    const record = parsed as Partial<AddressBookValue>
    return {
      departJson: Array.isArray(record.departJson) ? record.departJson.map(normalizeAddressItem).filter(Boolean) as AddressBookItem[] : [],
      userJson: Array.isArray(record.userJson) ? record.userJson.map(normalizeAddressItem).filter(Boolean) as AddressBookItem[] : [],
      groupJson: Array.isArray(record.groupJson) ? record.groupJson.map(normalizeAddressItem).filter(Boolean) as AddressBookItem[] : [],
    }
  }
  return empty
}

function serializeManagerUsers(value?: string | null | AddressBookValue) {
  const manager = normalizeManagerValue(value)
  return JSON.stringify(manager.userJson.map((item) => ({
    id: item.id,
    name: item.name,
    loginname: item.loginname,
    dataType: "user",
    avatar: item.avatar,
    mobile: item.mobile,
    type: item.type,
  })))
}

function managerNames(value?: string | null) {
  return normalizeManagerValue(value).userJson.map((item) => item.name).filter(Boolean).join("、")
}

function requireField(condition: boolean, message: string) {
  if (!condition) {
    window.alert(message)
    return false
  }
  return true
}

function currentMonthValue() {
  return new Date().toISOString().slice(0, 7)
}

function formatMonthTitle(value: string) {
  const [year, month] = value.split("-")
  return `${year}年${Number(month)}月`
}

function getWorkloadTitle(dimension: WorkloadDimension, periodType: WorkloadPeriodType, month: string, semester: string) {
  const periodText = periodType === "month" ? formatMonthTitle(month) : semester
  const dimensionText = dimension === "person" ? "按人员" : "按部门"
  return `${periodText} 网站维护工作量统计（${dimensionText}）`
}

function buildMockWorkloadReport(dimension: WorkloadDimension, periodType: WorkloadPeriodType, month: string, semester: string): WorkloadReport {
  const baseRows = dimension === "person" ? mockPersonWorkloadRows : mockDepartmentWorkloadRows
  const semesterBoost = periodType === "semester" ? 0 : 0
  return {
    title: getWorkloadTitle(dimension, periodType, month, semester),
    categories: workloadCategories,
    rows: baseRows.map((row) => ({
      ...row,
      values: Object.fromEntries(
        workloadCategories.map((category) => [
          category.key,
          (row.values[category.key] ?? 0) + semesterBoost,
        ])
      ),
    })),
  }
}

function escapeCsvCell(value: string | number) {
  const text = String(value)
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function RootManagePage() {
  const [activeSection, setActiveSection] = useState<SectionKey>("stats")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [session, setSession] = useState<ManageSession | null>(null)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [siteCreateDialogOpen, setSiteCreateDialogOpen] = useState(false)
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<DeleteConfirmDialog>({
    open: false,
    title: "确认删除",
    description: "删除后不可恢复，是否继续？",
    confirmText: "确认删除",
  })
  const [siteList, setSiteList] = useState<SiteSetting[]>([])
  const [activeWebId, setActiveWebId] = useState<number>(57)
  const [siteSetting, setSiteSetting] = useState<SiteSetting>(emptySiteSetting)
  const [siteCreateForm, setSiteCreateForm] = useState<SiteSetting>(emptySiteSetting)
  const [columns, setColumns] = useState<SchoolWebColumn[]>([])
  const [moduleGroups, setModuleGroups] = useState<{ column: SchoolWebColumn; modules: SchoolWebModule[] }[]>([])
  const [statsRange, setStatsRange] = useState({
    startDate: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
  })
  const [selectedStatsColumnId, setSelectedStatsColumnId] = useState<number>(0)
  const [accessTrend, setAccessTrend] = useState<AccessTrendItem[]>([])
  const [workloadDimension, setWorkloadDimension] = useState<WorkloadDimension>("person")
  const [workloadPeriodType, setWorkloadPeriodType] = useState<WorkloadPeriodType>("month")
  const [workloadMonth, setWorkloadMonth] = useState(currentMonthValue())
  const [workloadSemester, setWorkloadSemester] = useState(workloadSemesterOptions[0])
  const [workloadReport, setWorkloadReport] = useState<WorkloadReport | null>(null)
  const [pcTemplate, setPcTemplate] = useState<PcTwTemplatePayload | null>(null)
  const [mbTemplate, setMbTemplate] = useState<MbTwTemplatePayload | null>(null)
  const [pcOneTemplate, setPcOneTemplate] = useState<PcTemplatePayload | null>(null)
  const [pcTemplateText, setPcTemplateText] = useState("")
  const [mbTemplateText, setMbTemplateText] = useState("")
  const [pcOneTemplateText, setPcOneTemplateText] = useState("")
  const [loginForm, setLoginForm] = useState({ account: "", password: "" })
  const [selectedColumnId, setSelectedColumnId] = useState<number>(0)
  const [selectedModuleId, setSelectedModuleId] = useState<number>(0)
  const [messagePage, setMessagePage] = useState<PaginatedResult<SchoolWebMessage> | null>(null)
  const [messageQuery, setMessageQuery] = useState({ title: "", state: 2 })
  const [messagePagination, setMessagePagination] = useState({ pageNo: 1, pageSize: 20 })
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([])
  const [suspendPage, setSuspendPage] = useState<PaginatedResult<SuspendMessage> | null>(null)
  const [selectedSuspendIds, setSelectedSuspendIds] = useState<string[]>([])
  const [letterBoxPage, setLetterBoxPage] = useState<PaginatedResult<LetterBoxItem> | null>(null)
  const [publicLetterBoxPage, setPublicLetterBoxPage] = useState<PaginatedResult<LetterBoxItem> | null>(null)
  const [suspendEditing, setSuspendEditing] = useState(false)
  const [letterEditing, setLetterEditing] = useState(false)
  const [moveDialogOpen, setMoveDialogOpen] = useState(false)
  const [columnForm, setColumnForm] = useState<SchoolWebColumn>(emptyColumn)
  const [moduleForm, setModuleForm] = useState<SchoolWebModule>(emptyModule)
  const [messageForm, setMessageForm] = useState<SchoolWebMessage>(emptyMessage)
  const [suspendForm, setSuspendForm] = useState<SuspendMessage>(emptySuspendMessage)
  const [letterForm, setLetterForm] = useState<LetterBoxItem>(emptyLetterBox)
  const [moveTargetModuleId, setMoveTargetModuleId] = useState<number>(0)
  const [treeSelection, setTreeSelection] = useState<TreeSelection | null>(null)
  const [expandedColumnIds, setExpandedColumnIds] = useState<number[]>([])
  const [siteSettingBySchoolText, setSiteSettingBySchoolText] = useState("")
  const [webModules, setWebModules] = useState<SchoolWebModule[]>([])
  const [creatorModules, setCreatorModules] = useState<SchoolWebModule[]>([])
  const [urlResources, setUrlResources] = useState<UrlResource[]>([])
  const [moduleMessageList, setModuleMessageList] = useState<SchoolWebMessage[]>([])
  const [creatorMessagePage, setCreatorMessagePage] = useState<PaginatedResult<SchoolWebMessage> | null>(null)
  const [publicSuspendMessages, setPublicSuspendMessages] = useState<SuspendMessage[]>([])
  const [publicSuspendTime, setPublicSuspendTime] = useState(new Date().toISOString().slice(0, 19).replace("T", " "))
  const [normalPcTemplateText, setNormalPcTemplateText] = useState("")
  const [normalMbTemplateText, setNormalMbTemplateText] = useState("")

  const accessChartData = useMemo(
    () =>
      accessTrend.map((item, index) => ({
        date: String(item.dateStr ?? item.date ?? item.createTime ?? index + 1),
        value: Number(item.accessNumber ?? item.dateNumber ?? item.number ?? item.value ?? 0),
      })),
    [accessTrend]
  )

  async function refreshBootstrap() {
    setLoading(true)
    try {
      const data = await requestJson<BootstrapPayload>("/api/manage/bootstrap")
      hydrateBootstrap(data)
      setLoginDialogOpen(false)
    } catch (error) {
      setSession(null)
      setLoginDialogOpen(true)
      setMessage(error instanceof Error ? error.message : "后台连接失败")
    } finally {
      setLoading(false)
    }
  }

  function hydrateBootstrap(data: BootstrapPayload) {
    setSession(data.session)
    setSiteList(data.siteList ?? [])
    setActiveWebId(data.activeWebId ?? data.siteSetting.id)
    setSiteSetting(data.siteSetting)
    setSiteCreateForm({ ...emptySiteSetting, schoolId: data.siteSetting.schoolId })
    setColumns(data.columns)
    setModuleGroups(data.moduleGroups)
    setPcTemplate(data.pcTemplate)
    setMbTemplate(data.mbTemplate)
    setPcTemplateText(JSON.stringify(data.pcTemplate, null, 2))
    setMbTemplateText(JSON.stringify(data.mbTemplate, null, 2))
    loadPcOneTemplate()
    const defaultColumnId = data.columns[0]?.id ?? 0
    const defaultModuleId = data.moduleGroups[0]?.modules[0]?.id ?? 0
    setSelectedColumnId(defaultColumnId)
    setSelectedModuleId(defaultModuleId)
    setExpandedColumnIds(defaultColumnId ? [defaultColumnId] : [])
    setTreeSelection({ type: "root" })
  }

  useEffect(() => {
    refreshBootstrap()
  }, [])

  useEffect(() => {
    if (!message) return
    const timer = window.setTimeout(() => setMessage(""), 3000)
    return () => window.clearTimeout(timer)
  }, [message])

  useEffect(() => {
    if (session && selectedModuleId) {
      refreshMessages(selectedModuleId)
    }
  }, [session, selectedModuleId])

  useEffect(() => {
    if (!session) return
    refreshSuspendMessages()
    refreshLetterBoxes()
    refreshStats()
  }, [session])

  useEffect(() => {
    if (!session || activeSection !== "templates" || urlResources.length > 0) return
    requestJson<UrlResource[]>("/api/manage/modules/url-resources")
      .then(setUrlResources)
      .catch((error) => setMessage(error instanceof Error ? error.message : "URL 资源加载失败"))
  }, [activeSection, session, urlResources.length])

  async function refreshMessages(moduleId = selectedModuleId, pageNo = messagePagination.pageNo) {
    if (!moduleId) return
    const data = await requestJson<PaginatedResult<SchoolWebMessage>>(
      `/api/manage/messages?moduleId=${moduleId}&pageNo=${pageNo}&pageSize=${messagePagination.pageSize}&state=${messageQuery.state}&title=${encodeURIComponent(messageQuery.title)}`
    )
    setMessagePage(data)
    setMessagePagination((current) => ({
      ...current,
      pageNo: data.pagination?.pageNo ?? pageNo,
      pageSize: data.pagination?.pageSize ?? current.pageSize,
    }))
    setSelectedMessageIds([])
  }

  async function refreshSuspendMessages() {
    const data = await requestJson<PaginatedResult<SuspendMessage>>("/api/manage/suspend-messages?pageNo=1&pageSize=20")
    setSuspendPage(data)
    setSelectedSuspendIds([])
  }

  async function refreshLetterBoxes() {
    const data = await requestJson<PaginatedResult<LetterBoxItem>>("/api/manage/letterbox?pageNo=1&pageSize=20")
    setLetterBoxPage(data)
  }

  async function refreshStats() {
    const data = await requestJson<{ trend: AccessTrendItem[] }>(
      `/api/manage/stats?startDate=${statsRange.startDate}&endDate=${statsRange.endDate}`
    )
    setAccessTrend(data.trend)
  }

  async function refreshWorkload() {
    setWorkloadReport(buildMockWorkloadReport(workloadDimension, workloadPeriodType, workloadMonth, workloadSemester))
  }

  function exportWorkload() {
    const report = workloadReport ?? buildMockWorkloadReport(workloadDimension, workloadPeriodType, workloadMonth, workloadSemester)
    const header = ["统计对象", ...report.categories.map((category) => category.name), "合计"]
    const rows = report.rows.map((row) => {
      const total = report.categories.reduce((sum, category) => sum + (row.values[category.key] ?? 0), 0)
      return [row.name, ...report.categories.map((category) => row.values[category.key] ?? 0), total]
    })
    const csv = [
      [report.title],
      header,
      ...rows,
    ].map((row) => row.map(escapeCsvCell).join(",")).join("\n")
    const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${report.title}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    try {
      await requestJson<ManageSession>("/api/manage/auth/login", {
        method: "POST",
        body: JSON.stringify(loginForm),
      })
      await refreshBootstrap()
      setActiveSection("stats")
      setMessage("")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "登录失败")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleLogout() {
    setSubmitting(true)
    try {
      await requestJson<boolean>("/api/manage/auth/logout", { method: "POST" })
      setSession(null)
      setActiveSection("stats")
      setLoginDialogOpen(true)
      setMessage("已退出登录。")
    } finally {
      setSubmitting(false)
    }
  }

  function openDeleteConfirm(options: Omit<DeleteConfirmDialog, "open">) {
    setDeleteConfirmDialog({
      ...options,
      open: true,
    })
  }

  async function confirmDeleteAction() {
    if (!deleteConfirmDialog.onConfirm) return
    setSubmitting(true)
    try {
      await deleteConfirmDialog.onConfirm()
      setDeleteConfirmDialog((current) => ({ ...current, open: false, onConfirm: undefined }))
    } finally {
      setSubmitting(false)
    }
  }

  async function saveSiteSetting() {
    setSubmitting(true)
    try {
      await requestJson("/api/manage/site-setting", {
        method: "PATCH",
        body: JSON.stringify(siteSetting),
      })
      setMessage("网站设置已保存。")
      await refreshBootstrap()
    } finally {
      setSubmitting(false)
    }
  }

  function deleteSiteSetting() {
    openDeleteConfirm({
      title: "确认删除网站",
      description: "删除网站后网站将无法访问，是否需要删除？",
      confirmText: "确认删除",
      onConfirm: async () => {
        await requestJson("/api/manage/site-setting", {
          method: "DELETE",
        })
        setMessage("网站已删除。")
        await refreshBootstrap()
      },
    })
  }

  async function createSiteSetting() {
    setSubmitting(true)
    try {
      const data = await requestJson<{ id?: number }>("/api/manage/site-setting", {
        method: "POST",
        body: JSON.stringify(siteCreateForm),
      })
      const createdId = Number(data?.id)
      if (createdId) {
        await requestJson("/api/manage/site-setting/select", {
          method: "PATCH",
          body: JSON.stringify({ webId: createdId }),
        })
      }
      setSiteCreateDialogOpen(false)
      setMessage("网站已新增。")
      await refreshBootstrap()
    } finally {
      setSubmitting(false)
    }
  }

  async function selectSite(webId: number) {
    if (!webId || webId === activeWebId) return
    setSubmitting(true)
    try {
      await requestJson("/api/manage/site-setting/select", {
        method: "PATCH",
        body: JSON.stringify({ webId }),
      })
      setMessage("")
      await refreshBootstrap()
    } finally {
      setSubmitting(false)
    }
  }

  async function submitColumn() {
    if (!requireField(columnForm.name.trim().length > 0, "请输入栏目名称!")) return
    if (!requireField(columnForm.name.trim().length <= 10, "栏目名称不能超过10个字符!")) return
    if (!requireField([1, 2, 3, 4].includes(Number(columnForm.type)), "请选择栏目类型!")) return
    if (!requireField(String(columnForm.orderNo).trim() !== "", "栏目序号不能为空!")) return
    if (!requireField(Number.isFinite(Number(columnForm.orderNo)), "栏目序号不合法!")) return
    if ([2, 3].includes(Number(columnForm.type))) {
      const manager = normalizeManagerValue(columnForm.managerUserJson)
      if (!requireField(manager.userJson.length > 0, "请选择管理员!")) return
    }
    if (Number(columnForm.type) === 1 && !requireField(hasRichText(columnForm.content), "展示型栏目内容不能为空!")) return
    if (Number(columnForm.type) === 4 && !requireField(columnForm.columnUrl.trim().length > 0, "栏目url不能为空!")) return

    setSubmitting(true)
    try {
      const payload = {
        ...columnForm,
        name: columnForm.name.trim(),
        orderNo: Number(columnForm.orderNo),
        type: Number(columnForm.type),
        content: Number(columnForm.type) === 4 ? "" : columnForm.content,
        columnUrl: Number(columnForm.type) === 4 ? columnForm.columnUrl.trim() : "",
        managerUserJson: serializeManagerUsers(columnForm.managerUserJson),
      }
      await requestJson("/api/manage/columns", {
        method: columnForm.id ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      })
      setColumnForm(emptyColumn)
      setTreeSelection({ type: "root" })
      setMessage("栏目已保存。")
      await refreshBootstrap()
    } finally {
      setSubmitting(false)
    }
  }

  function removeColumn(columnId: number) {
    openDeleteConfirm({
      title: "确认删除栏目",
      description: "删除后该栏目相关内容可能无法继续展示，是否继续？",
      confirmText: "删除栏目",
      onConfirm: async () => {
        await requestJson(`/api/manage/columns?columnId=${columnId}`, { method: "DELETE" })
        setMessage("栏目已删除。")
        await refreshBootstrap()
      },
    })
  }

  async function submitModule() {
    if (!requireField(moduleForm.name.trim().length > 0, "请输入模块名称!")) return
    if (!requireField(moduleForm.name.trim().length <= 10, "模块名称不能超过10个字符!")) return
    if (!requireField([1, 2, 3, 4].includes(Number(moduleForm.type)), "请选择模块类型!")) return
    if (!requireField(String(moduleForm.orderNo).trim() !== "", "模块序号不能为空!")) return
    if (!requireField(Number.isFinite(Number(moduleForm.orderNo)), "模块序号不合法!")) return
    if (!requireField(moduleForm.logoUrl.trim().length > 0, "请上传模块图标!")) return
    if (Number(moduleForm.type) === 1 && !requireField(hasRichText(moduleForm.content), "展示型模块内容不能为空!")) return
    if (Number(moduleForm.type) === 4) {
      if (!requireField(moduleForm.columnUrl.trim().length > 0, "模块url不能为空!")) return
      if (!requireField(httpUrlPattern.test(moduleForm.columnUrl.trim()), "url格式不正确!")) return
    }

    setSubmitting(true)
    try {
      const payload = {
        ...moduleForm,
        name: moduleForm.name.trim(),
        orderNo: Number(moduleForm.orderNo),
        type: Number(moduleForm.type),
        isShow: Number(moduleForm.isShow) === 1 ? 1 : 2,
        content: Number(moduleForm.type) === 4 ? "" : moduleForm.content,
        columnUrl: Number(moduleForm.type) === 4 ? moduleForm.columnUrl.trim() : "",
      }
      await requestJson("/api/manage/modules", {
        method: moduleForm.id ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      })
      setModuleForm(emptyModule)
      setTreeSelection({ type: "column", columnId: moduleForm.columnId })
      setMessage("模块已保存。")
      await refreshBootstrap()
    } finally {
      setSubmitting(false)
    }
  }

  function removeModule(moduleId: number) {
    openDeleteConfirm({
      title: "确认删除模块",
      description: "删除后该模块下内容可能无法继续展示，是否继续？",
      confirmText: "删除模块",
      onConfirm: async () => {
        await requestJson(`/api/manage/modules?moduleId=${moduleId}`, { method: "DELETE" })
        setMessage("模块已删除。")
        await refreshBootstrap()
      },
    })
  }

  async function submitMessage() {
    setSubmitting(true)
    try {
      await requestJson("/api/manage/messages", {
        method: messageForm.id ? "PATCH" : "POST",
        body: JSON.stringify(messageForm),
      })
      setMessageForm({
        ...emptyMessage,
        moduleIds: String(selectedModuleId || ""),
      })
      if (selectedModuleId) {
        const columnId = moduleGroups.find((group) => group.modules.some((module) => module.id === selectedModuleId))?.column.id ?? selectedColumnId
        setTreeSelection({ type: "messages", columnId, moduleId: selectedModuleId })
      }
      setMessage("消息已保存。")
      await refreshMessages()
    } finally {
      setSubmitting(false)
    }
  }

  async function editMessageFromList(item: SchoolWebMessage, columnId: number, moduleId: number) {
    setSubmitting(true)
    try {
      const detail = await requestJson<SchoolWebMessage>(`/api/manage/messages?messageId=${item.id}`)
      setMessageForm({
        ...item,
        ...detail,
        moduleIds: detail.moduleIds || item.moduleIds || String(moduleId),
      })
      setTreeSelection({ type: "message", columnId, moduleId, messageId: item.id })
    } finally {
      setSubmitting(false)
    }
  }

  function removeMessage(messageId: number) {
    openDeleteConfirm({
      title: "确认删除消息",
      description: "删除后该消息将从对应模块中移除，是否继续？",
      confirmText: "删除消息",
      onConfirm: async () => {
        await requestJson(`/api/manage/messages?messageId=${messageId}`, { method: "DELETE" })
        setMessage("消息已删除。")
        await refreshMessages()
      },
    })
  }

  function batchDeleteSelectedMessages() {
    if (selectedMessageIds.length === 0) return
    openDeleteConfirm({
      title: "确认批量删除消息",
      description: `已选择 ${selectedMessageIds.length} 条消息，删除后不可恢复，是否继续？`,
      confirmText: "批量删除",
      onConfirm: async () => {
        await requestJson("/api/manage/messages/batch-delete", {
          method: "POST",
          body: JSON.stringify({ messageIds: selectedMessageIds.join(",") }),
        })
        setMessage("已批量删除消息。")
        await refreshMessages()
      },
    })
  }

  async function toggleTop(messageId: number, currentTop?: number) {
    setSubmitting(true)
    try {
      await requestJson("/api/manage/messages/top", {
        method: "POST",
        body: JSON.stringify({
          messageId,
          ropAndDownState: currentTop && currentTop > 0 ? 2 : 1,
        }),
      })
      setMessage("置顶状态已更新。")
      await refreshMessages()
    } finally {
      setSubmitting(false)
    }
  }

  async function submitMoveMessages() {
    if (selectedMessageIds.length === 0 || !moveTargetModuleId) return
    setSubmitting(true)
    try {
      await requestJson("/api/manage/messages/move", {
        method: "POST",
        body: JSON.stringify({
          messageIds: selectedMessageIds.join(","),
          moduleIds: String(moveTargetModuleId),
        }),
      })
      setMoveDialogOpen(false)
      setMoveTargetModuleId(0)
      setMessage("消息已移动到目标模块。")
      await refreshMessages()
    } finally {
      setSubmitting(false)
    }
  }

  async function submitSuspendMessage() {
    setSubmitting(true)
    try {
      await requestJson("/api/manage/suspend-messages", {
        method: suspendForm.id ? "PATCH" : "POST",
        body: JSON.stringify(suspendForm),
      })
      setSuspendForm(emptySuspendMessage)
      setSuspendEditing(false)
      setMessage("悬浮消息已保存。")
      await refreshSuspendMessages()
    } finally {
      setSubmitting(false)
    }
  }

  function removeSuspendMessage(messageId: number) {
    openDeleteConfirm({
      title: "确认删除悬浮消息",
      description: "删除后该悬浮消息将不再展示，是否继续？",
      confirmText: "删除悬浮消息",
      onConfirm: async () => {
        await requestJson(`/api/manage/suspend-messages?messageId=${messageId}`, { method: "DELETE" })
        setMessage("悬浮消息已删除。")
        await refreshSuspendMessages()
      },
    })
  }

  function batchDeleteSelectedSuspendMessages() {
    if (selectedSuspendIds.length === 0) return
    openDeleteConfirm({
      title: "确认批量删除悬浮消息",
      description: `已选择 ${selectedSuspendIds.length} 条悬浮消息，删除后不可恢复，是否继续？`,
      confirmText: "批量删除",
      onConfirm: async () => {
        await requestJson("/api/manage/suspend-messages/batch-delete", {
          method: "POST",
          body: JSON.stringify({ messageIds: selectedSuspendIds.join(",") }),
        })
        setMessage("已批量删除悬浮消息。")
        await refreshSuspendMessages()
      },
    })
  }

  async function submitLetterBoxReply() {
    setSubmitting(true)
    try {
      await requestJson("/api/manage/letterbox", {
        method: letterForm.id ? "PATCH" : "POST",
        body: JSON.stringify(letterForm),
      })
      setLetterForm(emptyLetterBox)
      setLetterEditing(false)
      setMessage("信箱内容已保存。")
      await refreshLetterBoxes()
    } finally {
      setSubmitting(false)
    }
  }

  function removeLetterBox(id: number) {
    openDeleteConfirm({
      title: "确认删除信箱内容",
      description: "删除后该信箱内容不可恢复，是否继续？",
      confirmText: "删除信箱内容",
      onConfirm: async () => {
        await requestJson(`/api/manage/letterbox?messageIds=${id}`, { method: "DELETE" })
        setMessage("信箱内容已删除。")
        await refreshLetterBoxes()
      },
    })
  }

  async function saveTemplate(kind: "pc-one" | "pc" | "mb") {
    setSubmitting(true)
    try {
      const url = kind === "pc-one" ? "/api/manage/templates/pc" : kind === "pc" ? "/api/manage/templates/pc-tw" : "/api/manage/templates/mb-tw"
      const text = kind === "pc-one" ? pcOneTemplateText : kind === "pc" ? pcTemplateText : mbTemplateText
      await requestJson(url, {
        method: "PATCH",
        body: text,
      })
      setMessage(kind === "pc-one" ? "PC 模板一 JSON 已保存。" : kind === "pc" ? "PC 模板二 JSON 已保存。" : "移动端模板 JSON 已保存。")
      await refreshBootstrap()
    } finally {
      setSubmitting(false)
    }
  }

  async function loadPcOneTemplate() {
    try {
      const data = await requestJson<PcTemplatePayload>("/api/manage/templates/pc")
      setPcOneTemplate(data)
      setPcOneTemplateText(JSON.stringify(data, null, 2))
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "PC 模板一加载失败")
    }
  }

  async function saveVisualTemplate(kind: "pc-one" | "pc-two" | "mb-one") {
    setSubmitting(true)
    try {
      if (kind === "pc-one" && pcOneTemplate) {
        await requestJson("/api/manage/templates/pc", {
          method: "PATCH",
          body: JSON.stringify(pcOneTemplate),
        })
        setMessage("PC 模板一已保存。")
      }
      if (kind === "pc-two" && pcTemplate) {
        await requestJson("/api/manage/templates/pc-tw", {
          method: "PATCH",
          body: JSON.stringify(pcTemplate),
        })
        setMessage("PC 模板二已保存。")
      }
      if (kind === "mb-one" && mbTemplate) {
        await requestJson("/api/manage/templates/mb-tw", {
          method: "PATCH",
          body: JSON.stringify(mbTemplate),
        })
        setMessage("移动端模板一已保存。")
      }
      await refreshBootstrap()
    } finally {
      setSubmitting(false)
    }
  }

  async function loadInterfaceTools() {
    setSubmitting(true)
    try {
      const [
        siteBySchool,
        modulesByWeb,
        creatorModuleList,
        urlResourceList,
        moduleMessages,
        creatorMessages,
        publicSuspendList,
        publicLetterBoxes,
        normalPcTemplate,
        normalMbTemplate,
      ] = await Promise.all([
        requestJson<SiteSetting>("/api/manage/site-setting/by-school"),
        requestJson<SchoolWebModule[]>("/api/manage/modules/by-web"),
        requestJson<SchoolWebModule[]>("/api/manage/modules/creator"),
        requestJson<UrlResource[]>("/api/manage/modules/url-resources"),
        selectedModuleId
          ? requestJson<SchoolWebMessage[]>(`/api/manage/messages/by-module?moduleId=${selectedModuleId}`)
          : Promise.resolve([]),
        requestJson<PaginatedResult<SchoolWebMessage>>(`/api/manage/messages/creator?moduleId=${selectedModuleId || 0}&pageNo=1&pageSize=20&state=0`),
        requestJson<SuspendMessage[]>(`/api/manage/suspend-messages/public?searchTime=${encodeURIComponent(publicSuspendTime)}`),
        requestJson<PaginatedResult<LetterBoxItem>>("/api/manage/letterbox/public?pageNo=1&pageSize=20"),
        requestJson<PcTemplatePayload>("/api/manage/templates/pc"),
        requestJson<MbTemplatePayload>("/api/manage/templates/mb"),
      ])
      setSiteSettingBySchoolText(JSON.stringify(siteBySchool, null, 2))
      setWebModules(modulesByWeb)
      setCreatorModules(creatorModuleList)
      setUrlResources(urlResourceList)
      setModuleMessageList(moduleMessages)
      setCreatorMessagePage(creatorMessages)
      setPublicSuspendMessages(publicSuspendList)
      setPublicLetterBoxPage(publicLetterBoxes)
      setNormalPcTemplateText(JSON.stringify(normalPcTemplate, null, 2))
      setNormalMbTemplateText(JSON.stringify(normalMbTemplate, null, 2))
      setMessage("数据已刷新。")
    } finally {
      setSubmitting(false)
    }
  }

  async function saveNormalTemplate(kind: "pc" | "mb") {
    setSubmitting(true)
    try {
      const url = kind === "pc" ? "/api/manage/templates/pc" : "/api/manage/templates/mb"
      const text = kind === "pc" ? normalPcTemplateText : normalMbTemplateText
      await requestJson(url, {
        method: "PATCH",
        body: text,
      })
      setMessage(kind === "pc" ? "普通 PC 模板已保存。" : "普通移动端模板已保存。")
      await loadInterfaceTools()
    } finally {
      setSubmitting(false)
    }
  }

  const loadingOverlay = loading ? (
    <div className="flex min-h-[240px] items-center justify-center text-sm text-slate-500">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      正在加载数据…
    </div>
  ) : null

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 w-64 border-r border-slate-200 bg-white text-slate-900 shadow-sm">
        <div className="border-b border-slate-200 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="px-0 py-1">
              <Image src="/logo.png" alt="江苏省丹阳高级中学" width={150} height={42} className="max-h-10 w-auto max-w-[180px] object-contain" />
            </div>
          </div>
          <div className="mt-4 text-base font-semibold tracking-wide text-slate-900">智慧丹中网站管理系统</div>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.key}
                type="button"
                onClick={() => setActiveSection(section.key)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  activeSection === section.key
                    ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </button>
            )
          })}
        </nav>
      </aside>

      <div className="pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <select
                value={activeWebId}
                onChange={(event) => selectSite(Number(event.target.value))}
                className="h-9 min-w-64 rounded-md border border-slate-300 bg-white px-3 text-sm"
                disabled={!session || submitting}
              >
                {siteList.map((site) => (
                  <option key={site.id} value={site.id}>{site.webName || `网站 ${site.id}`}</option>
                ))}
              </select>
              <Button variant="outline" onClick={() => { setSiteCreateForm({ ...emptySiteSetting }); setSiteCreateDialogOpen(true) }} disabled={!session || submitting}>
                新增网站
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {session ? <span className="text-sm text-slate-600">你好！<span className="font-medium text-slate-900">{session.userName}</span></span> : null}
              {session ? (
                <Button variant="outline" onClick={handleLogout} disabled={submitting}>
                  <ShieldCheck className="h-4 w-4" />
                  退出登录
                </Button>
              ) : null}
            </div>
          </div>
        </header>

        <main className="space-y-6 p-6">
          {message ? (
            <div className="fixed right-6 top-20 z-50 flex max-w-sm items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-lg">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span className="min-w-0 break-words">{message}</span>
            </div>
          ) : null}

          {activeSection === "site" && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <CardTitle>网站设置</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={deleteSiteSetting} disabled={submitting} className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                      删除网站
                    </Button>
                    <Button onClick={saveSiteSetting} disabled={submitting}>
                      <Save className="h-4 w-4" />
                      保存网站设置
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loadingOverlay ?? (
                  <div className="grid gap-4 lg:grid-cols-2">
                    <Field label="网站Logo" className="lg:col-span-2"><ImageUploadField value={siteSetting.logoUrl} alt={siteSetting.webName} onChange={(value) => setSiteSetting((current) => ({ ...current, logoUrl: value }))} logoMode /></Field>
                    <Field label="网站名称" required><Input maxLength={20} value={siteSetting.webName} onChange={(event) => setSiteSetting((current) => ({ ...current, webName: event.target.value }))} placeholder="网站名称（1-20个字符）" /></Field>
                    <Field label="网站域名"><Input maxLength={100} value={siteSetting.domainName} onChange={(event) => setSiteSetting((current) => ({ ...current, domainName: event.target.value }))} /></Field>
                    <Field label="备用域名"><Input maxLength={100} value={siteSetting.domainNameTw} onChange={(event) => setSiteSetting((current) => ({ ...current, domainNameTw: event.target.value }))} /></Field>
                    <Field label="原网站"><Input maxLength={100} value={siteSetting.oldDomainName} onChange={(event) => setSiteSetting((current) => ({ ...current, oldDomainName: event.target.value }))} /></Field>
                    <Field label="关键词" required><Input maxLength={100} value={siteSetting.keyWord} onChange={(event) => setSiteSetting((current) => ({ ...current, keyWord: event.target.value }))} placeholder="网站关键词（1-100个字符）" /></Field>
                    <Field label="版权信息"><Input maxLength={200} value={siteSetting.copyRight} onChange={(event) => setSiteSetting((current) => ({ ...current, copyRight: event.target.value }))} /></Field>
                    <Field label="备案信息"><Input maxLength={100} value={siteSetting.recodation} onChange={(event) => setSiteSetting((current) => ({ ...current, recodation: event.target.value }))} /></Field>
                    <Field label="公安备案号"><Input maxLength={100} value={siteSetting.postRecodation} onChange={(event) => setSiteSetting((current) => ({ ...current, postRecodation: event.target.value }))} /></Field>
                    <Field label="联系方式"><Input maxLength={100} value={siteSetting.address} onChange={(event) => setSiteSetting((current) => ({ ...current, address: event.target.value }))} /></Field>
                    <Field label="事业单位标记">
                      <label className="flex h-9 items-center gap-2 text-sm text-slate-700">
                        <Checkbox
                          checked={Number(siteSetting.isInstitute) === 2}
                          onCheckedChange={(checked) => setSiteSetting((current) => ({ ...current, isInstitute: checked ? 2 : 1 }))}
                        />
                        增加标记
                      </label>
                    </Field>
                    {Number(siteSetting.isInstitute) === 2 ? (
                      <Field label="事业单位链接"><Input maxLength={1000} value={siteSetting.institution} onChange={(event) => setSiteSetting((current) => ({ ...current, institution: event.target.value }))} placeholder="事业单位链接" /></Field>
                    ) : null}
                    <Field label="网站介绍" className="lg:col-span-2" required><Textarea rows={4} maxLength={500} value={siteSetting.description} onChange={(event) => setSiteSetting((current) => ({ ...current, description: event.target.value }))} placeholder="网站介绍（1-500个字符）" /></Field>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeSection === "content" && (
            <Card>
              <CardHeader>
                <CardTitle>栏目管理</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingOverlay ?? (
                  <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
                    <div className="min-w-0 rounded-lg border border-slate-200 bg-white">
                      <button
                        type="button"
                        onClick={() => {
                          setTreeSelection({ type: "root" })
                          setSelectedColumnId(0)
                          setColumnForm(emptyColumn)
                        }}
                        className={`flex w-full items-center border-b border-slate-200 px-4 py-3 text-left font-semibold ${
                          treeSelection?.type === "root" ? "bg-primary/10 text-primary" : "text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        <span className="min-w-0 truncate">{siteSetting.webName || "江苏省丹阳高级中学"}</span>
                      </button>
                      <div className="space-y-1 p-2">
                        {moduleGroups.map((group) => (
                          <div key={group.column.id}>
                            <div className={`flex items-center rounded-md ${treeSelection?.type === "column" && selectedColumnId === group.column.id ? "bg-primary/10" : "hover:bg-slate-50"}`}>
                              <button
                                type="button"
                                className="flex h-9 w-9 items-center justify-center text-slate-500"
                                onClick={() => {
                                  setExpandedColumnIds((current) =>
                                    current.includes(group.column.id)
                                      ? current.filter((id) => id !== group.column.id)
                                      : [...current, group.column.id]
                                  )
                                }}
                              >
                                <ChevronRight className={`h-4 w-4 transition-transform ${expandedColumnIds.includes(group.column.id) ? "rotate-90" : ""}`} />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedColumnId(group.column.id)
                                  setColumnForm(group.column)
                                  setTreeSelection({ type: "column", columnId: group.column.id })
                                  setExpandedColumnIds((current) => current.includes(group.column.id) ? current : [...current, group.column.id])
                                }}
                                className="flex min-w-0 flex-1 items-center py-2 pr-3 text-left text-sm"
                              >
                                <span className="truncate font-medium text-slate-800">{group.column.name}</span>
                              </button>
                            </div>
                            {expandedColumnIds.includes(group.column.id) ? (
                              <div className="ml-9 border-l border-slate-200 py-1 pl-3">
                                {group.modules.map((module) => (
                                  <div key={module.id} className={`flex items-center rounded-md ${treeSelection?.type === "messages" && treeSelection.moduleId === module.id ? "bg-primary/10" : "hover:bg-slate-50"}`}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedColumnId(group.column.id)
                                        setSelectedModuleId(module.id)
                                        setMessagePagination((current) => ({ ...current, pageNo: 1 }))
                                        setTreeSelection({ type: "messages", columnId: group.column.id, moduleId: module.id })
                                        refreshMessages(module.id, 1)
                                      }}
                                      className={`flex min-w-0 flex-1 items-center px-3 py-2 text-left text-sm ${
                                        treeSelection?.type === "messages" && treeSelection.moduleId === module.id ? "text-primary" : "text-slate-600"
                                      }`}
                                    >
                                      <span className="truncate">{module.name}</span>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="min-w-0">
                      {treeSelection?.type === "root" ? (
                        <DataTablePanel
                          title="一级栏目"
                          action={<Button onClick={() => { setColumnForm(emptyColumn); setTreeSelection({ type: "column-form", columnId: 0 }) }}>新增栏目</Button>}
                        >
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>栏目名称</TableHead>
                                <TableHead>栏目排序</TableHead>
                                <TableHead>栏目类型</TableHead>
                                <TableHead>管理人员</TableHead>
                                <TableHead>操作</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {columns.map((column) => (
                                <TableRow key={column.id}>
                                  <TableCell>{column.name}</TableCell>
                                  <TableCell>{column.orderNo}</TableCell>
                                  <TableCell>{menuTypeLabel(column.type)}</TableCell>
                                  <TableCell className="max-w-[240px] truncate">{managerNames(column.managerUserJson) || "-"}</TableCell>
                                  <TableCell>
                                    <TextActions>
                                      <TextAction onClick={() => { setColumnForm(column); setSelectedColumnId(column.id); setTreeSelection({ type: "column-form", columnId: column.id }) }}>编辑</TextAction>
                                      <TextAction onClick={() => removeColumn(column.id)}>删除</TextAction>
                                    </TextActions>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </DataTablePanel>
                      ) : null}
                      {treeSelection?.type === "column" ? (
                        <DataTablePanel
                          title={`${columnForm.name || "栏目"} `}
                          action={<Button onClick={() => { setModuleForm({ ...emptyModule, columnId: treeSelection.columnId }); setTreeSelection({ type: "module", columnId: treeSelection.columnId, moduleId: 0 }) }}>新增模块</Button>}
                        >
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>图标</TableHead>
                                <TableHead>模块名称</TableHead>
                                <TableHead>模块类型</TableHead>
                                <TableHead>上级栏目</TableHead>
                                <TableHead>在网站展示</TableHead>
                                <TableHead>操作</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(moduleGroups.find((group) => group.column.id === treeSelection.columnId)?.modules ?? []).map((module) => (
                                <TableRow key={module.id}>
                                  <TableCell><LogoPreview src={module.logoUrl} alt={module.name} /></TableCell>
                                  <TableCell>{module.name}</TableCell>
                                  <TableCell>{menuTypeLabel(module.type)}</TableCell>
                                  <TableCell>{columnForm.name}</TableCell>
                                  <TableCell>{module.isShow === 1 ? "显示" : "不显示"}</TableCell>
                                  <TableCell>
                                    <TextActions>
                                      <TextAction onClick={() => { setModuleForm(module); setSelectedModuleId(module.id); setTreeSelection({ type: "module", columnId: treeSelection.columnId, moduleId: module.id }) }}>编辑</TextAction>
                                      <TextAction onClick={() => removeModule(module.id)}>删除</TextAction>
                                    </TextActions>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </DataTablePanel>
                      ) : null}
                      {treeSelection?.type === "column-form" ? (
                        <div className="space-y-4">
                          <EditPanel
                            title={columnForm.id ? "编辑栏目" : "新增栏目"}
                            onBack={() => { setColumnForm(emptyColumn); setTreeSelection({ type: "root" }) }}
                            onSave={submitColumn}
                            onDelete={columnForm.id ? () => removeColumn(columnForm.id) : undefined}
                            submitting={submitting}
                          >
                            <Field label="栏目序号" required><Input value={String(columnForm.orderNo)} onChange={(event) => setColumnForm((current) => ({ ...current, orderNo: Number(event.target.value) }))} placeholder="请输入栏目序号" /></Field>
                            <Field label="栏目名称" required><Input maxLength={10} value={columnForm.name} onChange={(event) => setColumnForm((current) => ({ ...current, name: event.target.value }))} placeholder="标题(1-10个字符)" /></Field>
                            <Field label="栏目类型" required><MenuTypeSelect value={columnForm.type} onChange={(value) => setColumnForm((current) => ({ ...current, type: value }))} /></Field>
                            {Number(columnForm.type) === 4 ? (
                              <Field label="栏目url" required><Input maxLength={200} value={columnForm.columnUrl} onChange={(event) => setColumnForm((current) => ({ ...current, columnUrl: event.target.value }))} placeholder="栏目url(1-200个字符)" /></Field>
                            ) : null}
                            {[2, 3].includes(Number(columnForm.type)) ? (
                              <Field label="管理员" className="md:col-span-2"><AddressBookPicker value={normalizeManagerValue(columnForm.managerUserJson)} onChange={(value) => setColumnForm((current) => ({ ...current, managerUserJson: JSON.stringify(value) }))} /></Field>
                            ) : null}
                            <Field label="栏目图片" className="md:col-span-2"><ImageUploadField value={columnForm.logoUrl} alt={columnForm.name} onChange={(value) => setColumnForm((current) => ({ ...current, logoUrl: value }))} /></Field>
                            {Number(columnForm.type) !== 4 ? (
                              <Field label="栏目内容" className="md:col-span-2" required={Number(columnForm.type) === 1}><UEditorField value={columnForm.content} onChange={(value) => setColumnForm((current) => ({ ...current, content: value }))} height={360} /></Field>
                            ) : null}
                          </EditPanel>
                        </div>
                      ) : null}
                      {treeSelection?.type === "module" ? (
                        <EditPanel
                          title={moduleForm.id ? "编辑模块" : "新增模块"}
                          onBack={() => { setModuleForm(emptyModule); setTreeSelection({ type: "column", columnId: treeSelection.columnId }) }}
                          onSave={submitModule}
                          onDelete={moduleForm.id ? () => removeModule(treeSelection.moduleId) : undefined}
                          submitting={submitting}
                        >
                          <Field label="模块名称" required><Input maxLength={10} value={moduleForm.name} onChange={(event) => setModuleForm((current) => ({ ...current, name: event.target.value }))} placeholder="标题(1-10个字符)" /></Field>
                          <Field label="模块类型" required><MenuTypeSelect value={moduleForm.type} onChange={(value) => setModuleForm((current) => ({ ...current, type: value }))} /></Field>
                          {Number(moduleForm.type) === 4 ? (
                            <Field label="模块url" className="md:col-span-2" required><Input maxLength={200} value={moduleForm.columnUrl} onChange={(event) => setModuleForm((current) => ({ ...current, columnUrl: event.target.value }))} placeholder="模块url(1-200个字符)" /></Field>
                          ) : null}
                          <Field label="在网站展示">
                            <label className="flex h-9 items-center gap-3 text-sm text-slate-700">
                              <Switch
                                checked={Number(moduleForm.isShow) === 1}
                                onCheckedChange={(checked) => setModuleForm((current) => ({ ...current, isShow: checked ? 1 : 2 }))}
                              />
                              {Number(moduleForm.isShow) === 1 ? "显示" : "不显示"}
                            </label>
                          </Field>
                          <Field label="模块序号" required><Input value={String(moduleForm.orderNo)} onChange={(event) => setModuleForm((current) => ({ ...current, orderNo: Number(event.target.value) }))} placeholder="请输入模块序号" maxLength={9} /></Field>
                          <Field label="模块图标" className="md:col-span-2" required><ImageUploadField value={moduleForm.logoUrl} alt={moduleForm.name} onChange={(value) => setModuleForm((current) => ({ ...current, logoUrl: value }))} /></Field>
                          {Number(moduleForm.type) !== 4 ? (
                            <Field label="模块内容" className="md:col-span-2" required={Number(moduleForm.type) === 1}><UEditorField value={moduleForm.content} onChange={(value) => setModuleForm((current) => ({ ...current, content: value }))} height={420} /></Field>
                          ) : null}
                        </EditPanel>
                      ) : null}
                      {treeSelection?.type === "messages" ? (
                        <MessagesManager
                          messageQuery={messageQuery}
                          setMessageQuery={setMessageQuery}
                          messagePagination={messagePagination}
                          refreshMessages={refreshMessages}
                          messagePage={messagePage}
                          selectedMessageIds={selectedMessageIds}
                          setSelectedMessageIds={setSelectedMessageIds}
                          batchDeleteSelectedMessages={batchDeleteSelectedMessages}
                          setMoveDialogOpen={setMoveDialogOpen}
                          editMessage={(item) => editMessageFromList(item, treeSelection.columnId, treeSelection.moduleId)}
                          createMessage={() => {
                            setMessageForm({ ...emptyMessage, moduleIds: String(selectedModuleId || "") })
                            setTreeSelection({ type: "message", columnId: treeSelection.columnId, moduleId: treeSelection.moduleId, messageId: 0 })
                          }}
                          toggleTop={toggleTop}
                          removeMessage={removeMessage}
                        />
                      ) : null}
                      {treeSelection?.type === "message" ? (
                        <MessageEditPanel
                          title={messageForm.id ? "编辑模块消息" : "新增模块消息"}
                          messageForm={messageForm}
                          setMessageForm={setMessageForm}
                          onBack={() => setTreeSelection({ type: "messages", columnId: treeSelection.columnId, moduleId: treeSelection.moduleId })}
                          onSave={submitMessage}
                          onDelete={messageForm.id ? () => removeMessage(messageForm.id) : undefined}
                          submitting={submitting}
                        />
                      ) : null}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeSection === "suspend" && (
            <SimpleListSection
              title="悬浮消息"
              description=""
              action={
                <div className="flex flex-wrap gap-2">
	                  <Button variant="outline" onClick={batchDeleteSelectedSuspendMessages} disabled={selectedSuspendIds.length === 0}>批量删除</Button>
	                  <Button onClick={() => { setSuspendForm(emptySuspendMessage); setSuspendEditing(true) }}>新增悬浮消息</Button>
	                </div>
	              }
	            >
	              {loadingOverlay ?? (
	                <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
	                  <Table>
	                    <TableHeader>
	                      <TableRow>
	                        <TableHead></TableHead>
	                        <TableHead>标题</TableHead>
	                        <TableHead>开始时间</TableHead>
	                        <TableHead>结束时间</TableHead>
	                        <TableHead>操作</TableHead>
	                      </TableRow>
	                    </TableHeader>
	                    <TableBody>
	                      {suspendPage?.dataList.map((item) => (
	                        <TableRow key={item.id}>
	                          <TableCell>
	                            <input
	                              type="checkbox"
	                              checked={selectedSuspendIds.includes(String(item.id))}
	                              onChange={(event) => {
	                                const checked = event.target.checked
	                                setSelectedSuspendIds((current) =>
	                                  checked ? [...current, String(item.id)] : current.filter((value) => value !== String(item.id))
	                                )
	                              }}
	                            />
	                          </TableCell>
	                          <TableCell>{item.title}</TableCell>
	                          <TableCell>{item.startTime}</TableCell>
	                          <TableCell>{item.endTime}</TableCell>
	                          <TableCell>
	                            <TextActions>
	                              <TextAction onClick={() => { setSuspendForm(item); setSuspendEditing(true) }}>编辑</TextAction>
	                              <TextAction onClick={() => removeSuspendMessage(item.id)}>删除</TextAction>
	                            </TextActions>
	                          </TableCell>
	                        </TableRow>
	                      ))}
	                    </TableBody>
	                  </Table>
	                  {suspendEditing ? (
	                    <SuspendEditPanel
	                      suspendForm={suspendForm}
	                      setSuspendForm={setSuspendForm}
	                      onBack={() => { setSuspendForm(emptySuspendMessage); setSuspendEditing(false) }}
	                      onSave={submitSuspendMessage}
	                      onDelete={suspendForm.id ? () => removeSuspendMessage(suspendForm.id) : undefined}
	                      submitting={submitting}
	                    />
	                  ) : null}
	                </div>
	              )}
	            </SimpleListSection>
	          )}

          {activeSection === "letterbox" && (
            <SimpleListSection
              title="校长信箱"
              description="管理回复状态、回复内容与落款，公开写入仍可通过 common 接口提交。"
	              action={<Button onClick={() => { setLetterForm(emptyLetterBox); setLetterEditing(true) }}>新增留言</Button>}
	            >
	              {loadingOverlay ?? (
	                <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
	                  <Table>
	                    <TableHeader>
	                      <TableRow>
	                        <TableHead>标题</TableHead>
	                        <TableHead>状态</TableHead>
	                        <TableHead>创建时间</TableHead>
	                        <TableHead>操作</TableHead>
	                      </TableRow>
	                    </TableHeader>
	                    <TableBody>
	                      {letterBoxPage?.dataList.map((item) => (
	                        <TableRow key={item.id}>
	                          <TableCell className="max-w-[320px] truncate">{item.title}</TableCell>
	                          <TableCell>{item.status ?? "-"}</TableCell>
	                          <TableCell>{item.createTime ?? "-"}</TableCell>
	                          <TableCell>
	                            <TextActions>
	                              <TextAction onClick={() => { setLetterForm(item); setLetterEditing(true) }}>回复</TextAction>
	                              <TextAction onClick={() => removeLetterBox(item.id)}>删除</TextAction>
	                            </TextActions>
	                          </TableCell>
	                        </TableRow>
	                      ))}
	                    </TableBody>
	                  </Table>
	                  {letterEditing ? (
	                    <LetterBoxEditPanel
	                      letterForm={letterForm}
	                      setLetterForm={setLetterForm}
	                      onBack={() => { setLetterForm(emptyLetterBox); setLetterEditing(false) }}
	                      onSave={submitLetterBoxReply}
	                      onDelete={letterForm.id ? () => removeLetterBox(letterForm.id) : undefined}
	                      submitting={submitting}
	                    />
	                  ) : null}
	                </div>
	              )}
	            </SimpleListSection>
          )}

          {activeSection === "stats" && (
            <Card>
              <CardHeader>
                <CardTitle>访问统计</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingOverlay ?? (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">时间范围</span>
                        <button type="button" onClick={() => { const end = new Date().toISOString().slice(0, 10); const start = new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString().slice(0, 10); setStatsRange({ startDate: start, endDate: end }) }} className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50">近一周</button>
                        <button type="button" onClick={() => { const end = new Date().toISOString().slice(0, 10); const start = new Date(Date.now() - 29 * 24 * 3600 * 1000).toISOString().slice(0, 10); setStatsRange({ startDate: start, endDate: end }) }} className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50">近一月</button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">开始日期</span>
                        <Input type="date" value={statsRange.startDate} onChange={(event) => setStatsRange((current) => ({ ...current, startDate: event.target.value }))} className="w-36" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">结束日期</span>
                        <Input type="date" value={statsRange.endDate} onChange={(event) => setStatsRange((current) => ({ ...current, endDate: event.target.value }))} className="w-36" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">栏目</span>
                        <select
                          value={selectedStatsColumnId}
                          onChange={(event) => setSelectedStatsColumnId(Number(event.target.value))}
                          className="h-9 w-36 rounded-md border border-slate-300 bg-white px-3 text-sm"
                        >
                          <option value={0}>全站</option>
                          {columns.map((col) => (
                            <option key={col.id} value={col.id}>{col.name}</option>
                          ))}
                        </select>
                      </div>
                      <Button variant="outline" onClick={refreshStats}>查询</Button>
                    </div>
                    <div className="h-[360px] rounded-lg border border-slate-200 bg-white p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={accessChartData} margin={{ left: 8, right: 20, top: 20, bottom: 8 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#cbd5e1" }} />
                          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#cbd5e1" }} />
                          <Tooltip
                            contentStyle={{ borderRadius: 8, borderColor: "#e2e8f0" }}
                            formatter={(value) => [value, "访问量"]}
                            labelFormatter={(label) => `日期：${label}`}
                          />
                          <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)" }} activeDot={{ r: 6 }} />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeSection === "workload" && (
            <Card>
              <CardHeader>
                <CardTitle>工作量统计</CardTitle>
                <CardDescription>当前先使用模拟数据展示，后端接口就绪后替换为真实统计。</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingOverlay ?? (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">统计维度</span>
                        <select
                          value={workloadDimension}
                          onChange={(event) => setWorkloadDimension(event.target.value as WorkloadDimension)}
                          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
                        >
                          <option value="person">按人员</option>
                          <option value="department">按部门</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600">统计周期</span>
                        <select
                          value={workloadPeriodType}
                          onChange={(event) => setWorkloadPeriodType(event.target.value as WorkloadPeriodType)}
                          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
                        >
                          <option value="month">按月</option>
                          <option value="semester">按学期</option>
                        </select>
                      </div>
                      {workloadPeriodType === "month" ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600">月份</span>
                          <Input type="month" value={workloadMonth} onChange={(event) => setWorkloadMonth(event.target.value)} className="w-40" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600">学期</span>
                          <select
                            value={workloadSemester}
                            onChange={(event) => setWorkloadSemester(event.target.value)}
                            className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm"
                          >
                            {workloadSemesterOptions.map((item) => (
                              <option key={item} value={item}>{item}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      <Button variant="outline" onClick={refreshWorkload} disabled={submitting}>查询</Button>
                      <Button onClick={exportWorkload} disabled={submitting || !workloadReport}>
                        <Download className="mr-2 h-4 w-4" />
                        导出
                      </Button>
                    </div>
                    {workloadReport ? (
                      <div className="manage-table-panel overflow-x-auto rounded-lg border border-slate-200 bg-white">
                        <div className="border-b border-slate-200 px-4 py-3 text-center text-base font-semibold text-slate-800">
                          {workloadReport.title}
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="min-w-28">统计对象</TableHead>
                              {workloadReport.categories.map((category) => (
                                <TableHead key={category.key} className="min-w-28 text-right">{category.name}</TableHead>
                              ))}
                              <TableHead className="min-w-24 text-right">合计</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {workloadReport.rows.map((row) => (
                              <TableRow key={row.id}>
                                <TableCell className="font-medium">{row.name}</TableCell>
                                {workloadReport.categories.map((category) => (
                                  <TableCell key={category.key} className="text-right tabular-nums">
                                    {row.values[category.key] ?? 0}
                                  </TableCell>
                                ))}
                                <TableCell className="text-right font-semibold tabular-nums">
                                  {workloadReport.categories.reduce((sum, category) => sum + (row.values[category.key] ?? 0), 0)}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="border-t-2 border-slate-200 font-semibold">
                              <TableCell>合计</TableCell>
                              {workloadReport.categories.map((category) => (
                                <TableCell key={category.key} className="text-right tabular-nums">
                                  {workloadReport.rows.reduce((sum, row) => sum + (row.values[category.key] ?? 0), 0)}
                                </TableCell>
                              ))}
                              <TableCell className="text-right tabular-nums">
                                {workloadReport.rows.reduce(
                                  (sum, row) => sum + workloadReport.categories.reduce((rowSum, category) => rowSum + (row.values[category.key] ?? 0), 0),
                                  0
                                )}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-slate-200 py-16 text-center text-sm text-slate-400">
                        点击"查询"按钮加载工作量统计数据
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeSection === "templates" && (
            <Tabs defaultValue="pc-one">
              <TabsList className="flex flex-wrap">
                <TabsTrigger value="pc-one">PC 模板一</TabsTrigger>
                <TabsTrigger value="pc-two">PC 模板二</TabsTrigger>
                <TabsTrigger value="mb-one">移动端模板一</TabsTrigger>
                <TabsTrigger value="json">JSON 编辑</TabsTrigger>
              </TabsList>
              <TabsContent value="pc-one">
                {pcOneTemplate ? (
                  <PcOneTemplatePanel
                    template={pcOneTemplate}
                    setTemplate={setPcOneTemplate}
                    columns={columns}
                    modules={moduleGroups.flatMap((group) => group.modules)}
                    urlResources={urlResources}
                    loading={loading}
                    submitting={submitting}
                    onSave={() => saveVisualTemplate("pc-one")}
                  />
                ) : (
                  <TemplateLoading loading={loading} label="正在加载 PC 模板一…" />
                )}
              </TabsContent>
              <TabsContent value="pc-two">
                {pcTemplate ? (
                  <PcTwoTemplatePanel
                    template={pcTemplate}
                    setTemplate={setPcTemplate}
                    columns={columns}
                    modules={moduleGroups.flatMap((group) => group.modules)}
                    urlResources={urlResources}
                    loading={loading}
                    submitting={submitting}
                    onSave={() => saveVisualTemplate("pc-two")}
                  />
                ) : (
                  <TemplateLoading loading={loading} label="正在加载 PC 模板二…" />
                )}
              </TabsContent>
              <TabsContent value="mb-one">
                {mbTemplate ? (
                  <MbOneTemplatePanel
                    template={mbTemplate}
                    setTemplate={setMbTemplate}
                    modules={moduleGroups.flatMap((group) => group.modules)}
                    loading={loading}
                    submitting={submitting}
                    onSave={() => saveVisualTemplate("mb-one")}
                  />
                ) : (
                  <TemplateLoading loading={loading} label="正在加载移动端模板一…" />
                )}
              </TabsContent>
              <TabsContent value="json" className="space-y-6">
                <TemplateEditorCard
                  title="PC 模板一 JSON"
                  value={pcOneTemplateText}
                  onChange={setPcOneTemplateText}
                  onSave={() => saveTemplate("pc-one")}
                  loading={loading}
                  submitting={submitting}
                />
                <TemplateEditorCard
                  title="PC 模板二 JSON"
                  value={pcTemplateText}
                  onChange={setPcTemplateText}
                  onSave={() => saveTemplate("pc")}
                  loading={loading}
                  submitting={submitting}
                />
                <TemplateEditorCard
                  title="移动端模板一 JSON"
                  value={mbTemplateText}
                  onChange={setMbTemplateText}
                  onSave={() => saveTemplate("mb")}
                  loading={loading}
                  submitting={submitting}
                />
              </TabsContent>
            </Tabs>
          )}

          {activeSection === "interface-tools" && (
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle>接口工具</CardTitle>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Field label="公开悬浮查询时间">
                      <Input value={publicSuspendTime} onChange={(event) => setPublicSuspendTime(event.target.value)} />
                    </Field>
                    <Button onClick={loadInterfaceTools} disabled={submitting}>
                      <RefreshCw className={`h-4 w-4 ${submitting ? "animate-spin" : ""}`} />
                      刷新补全接口
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loadingOverlay ?? (
                  <Tabs defaultValue="modules">
                    <TabsList className="flex flex-wrap">
                      <TabsTrigger value="modules">模块查询</TabsTrigger>
                      <TabsTrigger value="messages">消息查询</TabsTrigger>
                      <TabsTrigger value="public">公开接口</TabsTrigger>
                      <TabsTrigger value="templates">普通模板</TabsTrigger>
                      <TabsTrigger value="site">站点按校查询</TabsTrigger>
                    </TabsList>
                    <TabsContent value="modules" className="space-y-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>模块名称</TableHead>
                            <TableHead>类型</TableHead>
                            <TableHead>显示</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {webModules.map((item) => (
                            <TableRow key={`web-${item.id}`}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{menuTypeLabel(item.type)}</TableCell>
                              <TableCell>{item.isShow === 1 ? "显示" : "隐藏"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <JsonPreview title="创建人模块列表" value={creatorModules} />
                      <JsonPreview title="URL 型栏目和消息资源" value={urlResources} />
                    </TabsContent>
                    <TabsContent value="messages" className="space-y-6">
                      <JsonPreview title="按模块直接查询消息列表" value={moduleMessageList} />
                      <JsonPreview title="当前创建人消息列表" value={creatorMessagePage} />
                    </TabsContent>
                    <TabsContent value="public" className="space-y-6">
                      <JsonPreview title="当前时间有效悬浮消息" value={publicSuspendMessages} />
                      <JsonPreview title="公开校长信箱列表" value={publicLetterBoxPage} />
                    </TabsContent>
                    <TabsContent value="templates" className="space-y-6">
                      <TemplateEditorCard
                        title="普通 PC 模板 JSON"
                        value={normalPcTemplateText}
                        onChange={setNormalPcTemplateText}
                        onSave={() => saveNormalTemplate("pc")}
                        loading={false}
                        submitting={submitting}
                      />
                      <TemplateEditorCard
                        title="普通移动端模板 JSON"
                        value={normalMbTemplateText}
                        onChange={setNormalMbTemplateText}
                        onSave={() => saveNormalTemplate("mb")}
                        loading={false}
                        submitting={submitting}
                      />
                    </TabsContent>
                    <TabsContent value="site">
                      <Textarea rows={24} value={siteSettingBySchoolText} onChange={(event) => setSiteSettingBySchoolText(event.target.value)} className="font-mono text-xs" />
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          )}

          {false && activeSection === "mapping" && (
            <Card>
              <CardHeader>
                <CardTitle>接口对照说明</CardTitle>
                <CardDescription>本页用于给实施过程中的对照文档做快速校验。</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="mapping">
                  <TabsList>
                    <TabsTrigger value="mapping">结构映射</TabsTrigger>
                    <TabsTrigger value="routes">前台路由</TabsTrigger>
                  </TabsList>
                  <TabsContent value="mapping">
                    <ul className="space-y-2 text-sm leading-7 text-slate-700">
                      <li>一级栏目 = `getSchooWebColumnListByWebId`</li>
                      <li>二级模块 = `getSchoolWebModuleListByColumnId`</li>
                      <li>模块消息列表 = `getSchoolWebModuleMessageList`</li>
                      <li>消息详情 = `getSchoolWebModuleMessageById`</li>
                      <li>上一篇 / 下一篇 = `getLastAndNextSchoolMessage`</li>
                      <li>站点设置 = `getSchoolWebSettingById`</li>
                      <li>全站模块 = `getSchoolWebModuleListByWebId / getSchoolWebModuleList`</li>
                      <li>URL 资源 = `getSchoolWebColumnAndMessageUrlListByWebId`</li>
                      <li>普通模板 = `getSchoolWebTemplatePc / getSchoolWebTemplateMb`</li>
                      <li>公开信箱 = `getPublicSchoolWebLetterBoxList / getSchoolWebLetterBoxById`</li>
                      <li>公开悬浮 = `getSchoolWebSuspendMessageListByTime`</li>
                    </ul>
                  </TabsContent>
                  <TabsContent value="routes">
                    <ul className="space-y-2 text-sm leading-7 text-slate-700">
                      <li>`/site/[columnId]` = 一级栏目页</li>
                      <li>`/site/[columnId]/[moduleId]` = 二级模块页</li>
                      <li>`/site/message/[messageId]` = 消息详情页</li>
                      <li>一级菜单点击进入栏目页，二级菜单点击进入模块页或外链</li>
                    </ul>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      <style jsx global>{`
        .manage-table-panel thead tr {
          background: color-mix(in oklch, var(--primary) 7%, white);
        }
        .manage-table-panel thead th {
          border-bottom: 1px solid var(--border);
          color: oklch(0.25 0.04 250);
          font-weight: 700;
        }
        .manage-table-panel tbody tr:hover {
          background: color-mix(in oklch, var(--primary) 4%, white);
        }
      `}</style>

      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>后台登录</DialogTitle>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={handleLogin}>
            <Field label="用户名">
              <Input value={loginForm.account} onChange={(event) => setLoginForm((current) => ({ ...current, account: event.target.value }))} />
            </Field>
            <Field label="密码">
              <Input type="password" value={loginForm.password} onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))} />
            </Field>
            <DialogFooter>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                登录
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={siteCreateDialogOpen} onOpenChange={setSiteCreateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>新增网站</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="网站Logo" className="md:col-span-2"><ImageUploadField value={siteCreateForm.logoUrl} alt={siteCreateForm.webName} onChange={(value) => setSiteCreateForm((current) => ({ ...current, logoUrl: value }))} logoMode /></Field>
            <Field label="网站名称" required><Input maxLength={20} value={siteCreateForm.webName} onChange={(event) => setSiteCreateForm((current) => ({ ...current, webName: event.target.value }))} placeholder="网站名称（1-20个字符）" /></Field>
            <Field label="网站域名"><Input maxLength={100} value={siteCreateForm.domainName} onChange={(event) => setSiteCreateForm((current) => ({ ...current, domainName: event.target.value }))} /></Field>
            <Field label="备用域名"><Input maxLength={100} value={siteCreateForm.domainNameTw} onChange={(event) => setSiteCreateForm((current) => ({ ...current, domainNameTw: event.target.value }))} /></Field>
            <Field label="原网站"><Input maxLength={100} value={siteCreateForm.oldDomainName} onChange={(event) => setSiteCreateForm((current) => ({ ...current, oldDomainName: event.target.value }))} /></Field>
            <Field label="关键词" required><Input maxLength={100} value={siteCreateForm.keyWord} onChange={(event) => setSiteCreateForm((current) => ({ ...current, keyWord: event.target.value }))} placeholder="网站关键词（1-100个字符）" /></Field>
            <Field label="版权信息"><Input maxLength={200} value={siteCreateForm.copyRight} onChange={(event) => setSiteCreateForm((current) => ({ ...current, copyRight: event.target.value }))} /></Field>
            <Field label="备案信息"><Input maxLength={100} value={siteCreateForm.recodation} onChange={(event) => setSiteCreateForm((current) => ({ ...current, recodation: event.target.value }))} /></Field>
            <Field label="公安备案号"><Input value={siteCreateForm.postRecodation} onChange={(event) => setSiteCreateForm((current) => ({ ...current, postRecodation: event.target.value }))} /></Field>
            <Field label="联系方式"><Input maxLength={100} value={siteCreateForm.address} onChange={(event) => setSiteCreateForm((current) => ({ ...current, address: event.target.value }))} /></Field>
            <Field label="事业单位标记">
              <label className="flex h-9 items-center gap-2 text-sm text-slate-700">
                <Checkbox
                  checked={Number(siteCreateForm.isInstitute) === 2}
                  onCheckedChange={(checked) => setSiteCreateForm((current) => ({ ...current, isInstitute: checked ? 2 : 1 }))}
                />
                增加标记
              </label>
            </Field>
            {Number(siteCreateForm.isInstitute) === 2 ? (
              <Field label="事业单位链接"><Input maxLength={1000} value={siteCreateForm.institution} onChange={(event) => setSiteCreateForm((current) => ({ ...current, institution: event.target.value }))} placeholder="事业单位链接" /></Field>
            ) : null}
            <Field label="网站介绍" className="md:col-span-2" required><Textarea rows={4} maxLength={500} value={siteCreateForm.description} onChange={(event) => setSiteCreateForm((current) => ({ ...current, description: event.target.value }))} placeholder="网站介绍（1-500个字符）" /></Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSiteCreateDialogOpen(false)}>取消</Button>
            <Button onClick={createSiteSetting} disabled={submitting}>新增网站</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteConfirmDialog.open}
        onOpenChange={(open) => setDeleteConfirmDialog((current) => ({ ...current, open }))}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{deleteConfirmDialog.title}</DialogTitle>
            <DialogDescription>{deleteConfirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmDialog((current) => ({ ...current, open: false }))}
              disabled={submitting}
            >
              取消
            </Button>
            <Button onClick={confirmDeleteAction} disabled={submitting} className="bg-red-600 hover:bg-red-700 text-white">
              <Trash2 className="h-4 w-4" />
              {deleteConfirmDialog.confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>移动消息到目标模块</DialogTitle>
            <DialogDescription>已选择 {selectedMessageIds.length} 条消息。</DialogDescription>
          </DialogHeader>
          <Field label="目标模块">
            <select
              value={moveTargetModuleId}
              onChange={(event) => setMoveTargetModuleId(Number(event.target.value))}
              className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
            >
              <option value={0}>请选择目标模块</option>
              {moduleGroups.flatMap((group) => group.modules.map((module) => (
                <option key={module.id} value={module.id}>{group.column.name} / {module.name}</option>
              )))}
            </select>
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMoveDialogOpen(false)}>取消</Button>
            <Button onClick={submitMoveMessages} disabled={submitting || !moveTargetModuleId}>确认移动</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Field({ label, children, className, required = false }: { label: string; children: React.ReactNode; className?: string; required?: boolean }) {
  return (
    <div className={`min-w-0 ${className ?? ""}`}>
      <div className="mb-2 text-sm font-medium text-slate-700">
        {required ? <span className="mr-1 text-red-500">*</span> : null}
        {label}
      </div>
      {children}
    </div>
  )
}

function AddressBookPicker({
  value,
  onChange,
}: {
  value: AddressBookValue
  onChange: (value: AddressBookValue) => void
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<AddressBookItem[]>([])
  const [selected, setSelected] = useState<AddressBookItem[]>(value.userJson ?? [])
  const [breadcrumb, setBreadcrumb] = useState<AddressBookItem[]>([{ id: -1000, name: "全部", dataType: "depart" }])
  const [searchText, setSearchText] = useState("")
  const [searchResults, setSearchResults] = useState<AddressBookItem[]>([])
  const selectedIds = useMemo(() => new Set(selected.map((item) => item.id)), [selected])
  const valueSignature = JSON.stringify(value)

  useEffect(() => {
    setSelected(value.userJson ?? [])
  }, [valueSignature])

  async function loadRoot() {
    setLoading(true)
    try {
      const data = await requestJson<{ departs?: unknown[]; users?: unknown[]; groups?: unknown[] }>("/api/manage/address/init", {
        method: "POST",
        body: JSON.stringify({ isSchoolManager: false }),
      })
      setItems(packAddressItems(data))
      setBreadcrumb([{ id: -1000, name: "全部", dataType: "depart" }])
    } finally {
      setLoading(false)
    }
  }

  async function loadDepart(item: AddressBookItem, nextBreadcrumb?: AddressBookItem[]) {
    if (!item.hasChild) return
    setLoading(true)
    try {
      const data = await requestJson<{ departs?: unknown[]; users?: unknown[] }>("/api/manage/address/query-by-depart-id", {
        method: "POST",
        body: JSON.stringify({ departId: item.id, userTypes: "1" }),
      })
      setItems(packAddressItems(data))
      setBreadcrumb(nextBreadcrumb ?? ((current) => [...current, item]))
    } finally {
      setLoading(false)
    }
  }

  async function searchUsers(text: string) {
    setSearchText(text)
    if (!text.trim()) {
      setSearchResults([])
      return
    }
    const data = await requestJson<{ users?: unknown[] }>("/api/manage/address/retrieval-users", {
      method: "POST",
      body: JSON.stringify({
        condition: text.trim(),
        userTypes: "1",
        excludeUserIdsStr: selected.map((item) => item.id).join(","),
        departIds: items.filter((item) => item.dataType === "depart").map((item) => item.id).join(","),
      }),
    })
    setSearchResults(packAddressItems(data).filter((item) => item.dataType === "user"))
  }

  function toggleUser(item: AddressBookItem) {
    if (item.dataType !== "user") return
    setSelected((current) =>
      current.some((selectedItem) => selectedItem.id === item.id)
        ? current.filter((selectedItem) => selectedItem.id !== item.id)
        : [...current, item]
    )
  }

  function confirmSelection() {
    onChange({ departJson: [], userJson: selected, groupJson: [] })
    setOpen(false)
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => {
          setOpen(true)
          void loadRoot()
        }}
        className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-left text-sm"
      >
        {selected.length ? (
          <div className="flex flex-wrap gap-2">
            {selected.map((item) => (
              <span key={item.id} className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-slate-700">
                {item.name}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-slate-400">点击选择范围</span>
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>请选择管理员</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="min-h-11 rounded-md border border-slate-200 bg-slate-50 p-2">
              {selected.length ? (
                <div className="flex flex-wrap gap-2">
                  {selected.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => toggleUser(item)}
                      className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-sm text-slate-700 ring-1 ring-slate-200"
                    >
                      {item.name}
                      <X className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-1 py-1 text-sm text-slate-400">已选人员会显示在这里</div>
              )}
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input className="pl-9" value={searchText} onChange={(event) => searchUsers(event.target.value)} placeholder="请输入姓名或手机快速找人" />
              {searchText ? (
                <div className="absolute z-10 mt-1 max-h-52 w-full overflow-auto rounded-md border border-slate-200 bg-white shadow-lg">
                  {searchResults.length ? searchResults.map((item) => (
                    <button key={item.id} type="button" onClick={() => toggleUser(item)} className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50">
                      <span>{item.name}</span>
                      {selectedIds.has(item.id) ? <span className="text-primary">已选</span> : null}
                    </button>
                  )) : <div className="px-3 py-3 text-sm text-slate-500">没有匹配的信息</div>}
                </div>
              ) : null}
            </div>
            <div className="rounded-md border border-slate-200">
              <div className="flex flex-wrap gap-1 border-b border-slate-200 px-3 py-2 text-sm">
                {breadcrumb.map((item, index) => (
                  <button
                    key={`${item.id}-${index}`}
                    type="button"
                    onClick={() => index === 0 ? loadRoot() : loadDepart(item, breadcrumb.slice(0, index + 1))}
                    className="text-slate-600 hover:text-primary"
                  >
                    {index > 0 ? "/ " : ""}{item.name}
                  </button>
                ))}
              </div>
              <div className="max-h-[360px] overflow-auto p-2">
                {loading ? (
                  <div className="flex min-h-40 items-center justify-center text-sm text-slate-500">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    正在加载…
                  </div>
                ) : items.length ? items.map((item) => (
                  <div key={`${item.dataType}-${item.id}`} className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-slate-50">
                    <button
                      type="button"
                      onClick={() => item.dataType === "depart" ? loadDepart(item) : toggleUser(item)}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm"
                    >
                      {item.dataType === "user" ? <UserPlus className="h-4 w-4 text-slate-400" /> : <ChevronRight className={`h-4 w-4 text-slate-400 ${item.hasChild ? "" : "opacity-30"}`} />}
                      <span className="truncate">{item.name}</span>
                    </button>
                    {item.dataType === "user" ? (
                      <Checkbox checked={selectedIds.has(item.id)} onCheckedChange={() => toggleUser(item)} />
                    ) : null}
                  </div>
                )) : (
                  <div className="px-3 py-10 text-center text-sm text-slate-500">暂无数据</div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>取 消</Button>
            <Button onClick={confirmSelection}>确 定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function packAddressItems(data: { departs?: unknown[]; users?: unknown[]; groups?: unknown[] }): AddressBookItem[] {
  const departs = (data.departs ?? []).map((item) => normalizeAddressItem({ ...(item as object), dataType: "depart" })).filter(Boolean) as AddressBookItem[]
  const users = (data.users ?? []).map((item) => normalizeAddressItem({ ...(item as object), dataType: "user" })).filter(Boolean) as AddressBookItem[]
  const groups = (data.groups ?? []).map((item) => normalizeAddressItem({ ...(item as object), dataType: "group" })).filter(Boolean) as AddressBookItem[]
  return [...departs, ...users, ...groups]
}

function SimpleListSection({
  title,
  description,
  action,
  children,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function DataTablePanel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="manage-table-panel rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function TextActions({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-x-3 gap-y-1">{children}</div>
}

function TextAction({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-sm font-medium text-primary hover:underline">
      {children}
    </button>
  )
}

function EditPanel({
  title,
  children,
  onBack,
  onSave,
  onDelete,
  submitting,
}: {
  title: string
  children: React.ReactNode
  onBack?: () => void
  onSave: () => void
  onDelete?: () => void
  submitting: boolean
}) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack ? <Button variant="outline" size="sm" onClick={onBack}>返回</Button> : null}
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        </div>
        <div className="flex gap-2">
          {onDelete ? (
            <Button variant="outline" onClick={onDelete} disabled={submitting}>
              <Trash2 className="h-4 w-4" />
              删除
            </Button>
          ) : null}
          <Button onClick={onSave} disabled={submitting}>
            <Save className="h-4 w-4" />
            保存
          </Button>
        </div>
      </div>
      <div className="grid min-w-0 gap-4 md:grid-cols-2">{children}</div>
    </div>
  )
}

function MessagesManager({
  messageQuery,
  setMessageQuery,
  messagePagination,
  refreshMessages,
  messagePage,
  selectedMessageIds,
  setSelectedMessageIds,
  batchDeleteSelectedMessages,
  setMoveDialogOpen,
  editMessage,
  createMessage,
  toggleTop,
  removeMessage,
}: {
  messageQuery: { title: string; state: number }
  setMessageQuery: React.Dispatch<React.SetStateAction<{ title: string; state: number }>>
  messagePagination: { pageNo: number; pageSize: number }
  refreshMessages: (moduleId?: number, pageNo?: number) => Promise<void>
  messagePage: PaginatedResult<SchoolWebMessage> | null
  selectedMessageIds: string[]
  setSelectedMessageIds: React.Dispatch<React.SetStateAction<string[]>>
  batchDeleteSelectedMessages: () => void
  setMoveDialogOpen: (value: boolean) => void
  editMessage: (item: SchoolWebMessage) => void
  createMessage: () => void
  toggleTop: (messageId: number, currentTop?: number) => Promise<void>
  removeMessage: (messageId: number) => void
}) {
  function previewMessage(item: SchoolWebMessage) {
    const target = Number(item.messageType) === 2 && item.messageUrl ? item.messageUrl : `/site/message/${item.id}`
    window.open(target, "_blank", "noopener,noreferrer")
  }

  const pagination = messagePage?.pagination
  const pageNo = pagination?.pageNo ?? messagePagination.pageNo
  const pageSize = pagination?.pageSize ?? messagePagination.pageSize
  const total = pagination?.total ?? 0
  const pages = Math.max(1, pagination?.pages ?? (Math.ceil(total / pageSize) || 1))
  const hasPreviousPage = pageNo > 1
  const hasNextPage = pageNo < pages

  return (
    <div className="manage-table-panel min-w-0 rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            className="w-56"
            value={messageQuery.title}
            onChange={(event) => setMessageQuery((current) => ({ ...current, title: event.target.value }))}
            placeholder="按标题搜索"
          />
          <Button variant="outline" onClick={() => refreshMessages(undefined, 1)}>查询</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={batchDeleteSelectedMessages} disabled={selectedMessageIds.length === 0}>批量删除</Button>
          <Button variant="outline" onClick={() => setMoveDialogOpen(true)} disabled={selectedMessageIds.length === 0}>移动</Button>
          <Button onClick={createMessage}>新增消息</Button>
        </div>
      </div>
      <Table className="table-fixed">
        <colgroup>
          <col className="w-10" />
          <col />
          <col className="w-20" />
          <col className="w-36" />
          <col className="w-24" />
          <col className="w-20" />
          <col className="w-28" />
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>标题</TableHead>
            <TableHead>封面</TableHead>
            <TableHead>创建时间</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>置顶</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messagePage?.dataList.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedMessageIds.includes(String(item.id))}
                  onChange={(event) => {
                    const checked = event.target.checked
                    setSelectedMessageIds((current) =>
                      checked ? [...current, String(item.id)] : current.filter((value) => value !== String(item.id))
                    )
                  }}
                />
              </TableCell>
              <TableCell className="min-w-0">
                <button
                  type="button"
                  onClick={() => previewMessage(item)}
                  className="block max-w-full truncate text-left font-medium text-primary hover:underline"
                  title={item.title}
                >
                  {item.title}
                </button>
              </TableCell>
              <TableCell><LogoPreview src={item.logoUrl} alt={item.title} /></TableCell>
              <TableCell>{item.createTime?.slice(0, 16)}</TableCell>
              <TableCell>{messageStateLabel(item.state)}</TableCell>
              <TableCell>{item.setTop && item.setTop > 0 ? "是" : "否"}</TableCell>
              <TableCell>
                <TextActions>
                  <TextAction onClick={() => editMessage(item)}>编辑</TextAction>
                  <TextAction onClick={() => toggleTop(item.id, item.setTop)}>{item.setTop && item.setTop > 0 ? "取消置顶" : "置顶"}</TextAction>
                  <TextAction onClick={() => removeMessage(item.id)}>删除</TextAction>
                </TextActions>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm text-slate-600">
        <div>
          共 <span className="font-medium text-slate-900">{total}</span> 条，
          每页 <span className="font-medium text-slate-900">{pageSize}</span> 条
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refreshMessages(undefined, pageNo - 1)} disabled={!hasPreviousPage}>
            上一页
          </Button>
          <span className="min-w-20 text-center">
            第 <span className="font-medium text-slate-900">{pageNo}</span> / {pages} 页
          </span>
          <Button variant="outline" size="sm" onClick={() => refreshMessages(undefined, pageNo + 1)} disabled={!hasNextPage}>
            下一页
          </Button>
        </div>
      </div>
    </div>
  )
}

function JsonPreview({ title, value }: { title: string; value: unknown }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 text-sm font-semibold text-slate-800">{title}</div>
      <pre className="max-h-[360px] overflow-auto rounded-lg bg-slate-950 p-4 text-xs leading-6 text-slate-100">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  )
}

function TemplateLoading({ loading, label }: { loading: boolean; label: string }) {
  return (
    <Card>
      <CardContent>
        <div className="flex min-h-[240px] items-center justify-center text-sm text-slate-500">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {label}
        </div>
      </CardContent>
    </Card>
  )
}

function resourceFromModule(module: SchoolWebModule): TemplateResource {
  return {
    id: module.id,
    name: module.name,
    logoUrl: module.logoUrl,
    type: module.type,
    columnUrl: module.columnUrl,
  }
}

function resourceFromColumn(column: SchoolWebColumn): TemplateResource {
  return {
    id: column.id,
    name: column.name,
    logoUrl: column.logoUrl,
    type: column.type,
    columnUrl: column.columnUrl,
  }
}

function imageFilesFromUrls(urls: unknown): { fileUrl: string; fileName: string }[] {
  return Array.isArray(urls)
    ? urls.map((url) => ({ fileUrl: String(url), fileName: String(url).split("/").pop() || "图片" }))
    : []
}

function urlsFromFiles(files: { fileUrl: string }[]) {
  return files.map((file) => file.fileUrl)
}

function resourceMultiSelect({
  resources,
  selected,
  onChange,
  max,
}: {
  resources: TemplateResource[]
  selected: unknown[]
  onChange: (value: TemplateResource[]) => void
  max?: number
}) {
  const selectedIds = new Set(selected.map((item) => Number((item as { id?: number }).id)).filter(Boolean))
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {resources.map((item) => {
        const checked = selectedIds.has(Number(item.id))
        return (
          <label key={`${item.id}-${item.name}`} className={`flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-sm ${checked ? "border-primary bg-primary/10" : "border-slate-200 bg-white"}`}>
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) => {
                const nextIds = new Set(selectedIds)
                if (event.target.checked) nextIds.add(Number(item.id))
                else nextIds.delete(Number(item.id))
                const next = resources.filter((resource) => nextIds.has(Number(resource.id))).slice(0, max)
                onChange(next)
              }}
            />
            <LogoPreview src={item.logoUrl} alt={item.name} />
            <span className="min-w-0 flex-1 truncate">{item.name}</span>
          </label>
        )
      })}
    </div>
  )
}

function ResourceMultiSelect(props: {
  resources: TemplateResource[]
  selected: unknown[]
  onChange: (value: TemplateResource[]) => void
  max?: number
}) {
  return resourceMultiSelect(props)
}

function ResourceSelect({
  resources,
  value,
  onChange,
}: {
  resources: TemplateResource[]
  value: unknown
  onChange: (value: TemplateResource | Record<string, never>) => void
}) {
  const selectedId = Number((value as { id?: number } | null)?.id ?? 0)
  return (
    <select
      value={selectedId}
      onChange={(event) => {
        const id = Number(event.target.value)
        onChange(resources.find((item) => Number(item.id) === id) ?? {})
      }}
      className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
    >
      <option value={0}>请选择</option>
      {resources.map((item) => (
        <option key={item.id} value={item.id}>{item.name}</option>
      ))}
    </select>
  )
}

function PcOneTemplatePanel({
  template,
  setTemplate,
  columns,
  modules,
  urlResources,
  loading,
  submitting,
  onSave,
}: {
  template: PcTemplatePayload
  setTemplate: React.Dispatch<React.SetStateAction<PcTemplatePayload | null>>
  columns: SchoolWebColumn[]
  modules: SchoolWebModule[]
  urlResources: UrlResource[]
  loading: boolean
  submitting: boolean
  onSave: () => void
}) {
  const initJson = template.initJson ?? {}
  const moduleRows = Array.isArray(template.moduleJson) ? template.moduleJson as Array<{ orderNum: number; moduleListJson: TemplateResource[] }> : []
  const columnResources = columns.map(resourceFromColumn)
  const moduleResources = modules.filter((module) => [2, 3].includes(module.type)).map(resourceFromModule)
  const footerResources = urlResources.map((item) => ({
    id: Number(item.id),
    name: item.name,
    logoUrl: item.logoUrl,
    type: item.type,
    columnUrl: item.url,
    url: item.url,
  }))

  function patchTemplate(patch: Partial<PcTemplatePayload>) {
    setTemplate((current) => current ? { ...current, ...patch } : current)
  }

  function patchInit(key: string, value: unknown) {
    patchTemplate({ initJson: { ...initJson, [key]: value } })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle>PC 模板一可视化配置</CardTitle>
          <Button onClick={onSave} disabled={loading || submitting}><Save className="h-4 w-4" />保存模板</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <Field label="皮肤">
            <select value={Number(initJson.infoType ?? 1)} onChange={(event) => patchInit("infoType", Number(event.target.value))} className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm">
              {[1, 2, 3, 4].map((item) => <option key={item} value={item}>皮肤 {item}</option>)}
            </select>
          </Field>
          <Field label="播放切换时间">
            <select value={Number(initJson.shufflingTime ?? 2)} onChange={(event) => patchInit("shufflingTime", Number(event.target.value))} className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm">
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => <option key={item} value={item}>{item} 秒</option>)}
            </select>
          </Field>
          <Field label="顶部窗口">
            <select value={Number(initJson.windowType ?? 1)} onChange={(event) => patchInit("windowType", Number(event.target.value))} className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm">
              <option value={1}>登录</option>
              <option value={2}>搜索</option>
            </select>
          </Field>
        </div>
        <Field label="默认封面">
          <ImageUploadField value={String(initJson.initPhoto ?? "")} onChange={(value) => patchInit("initPhoto", value)} />
        </Field>
        <Field label="首页轮播图">
          <ManagedUploader
            value={imageFilesFromUrls(template.photoJson)}
            onChange={(files) => patchTemplate({ photoJson: urlsFromFiles(files) })}
            mode="image"
            multiple
            max={5}
            buttonText="添加轮播图"
          />
        </Field>
        <Field label="导航栏目">
          <ResourceMultiSelect resources={columnResources} selected={template.columnJson} onChange={(value) => patchTemplate({ columnJson: value })} />
        </Field>
        <div className="rounded-lg border border-slate-200 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="font-semibold text-slate-900">主体模块行</div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => patchTemplate({ moduleJson: [...moduleRows, { orderNum: moduleRows.length, moduleListJson: [] }] })}>添加一行</Button>
              <Button variant="outline" onClick={() => patchTemplate({ moduleJson: moduleRows.slice(0, -1) })} disabled={moduleRows.length === 0}>删除一行</Button>
            </div>
          </div>
          <div className="space-y-4">
            {moduleRows.map((row, index) => (
              <Field key={index} label={`第 ${index + 1} 行模块`}>
                <ResourceMultiSelect
                  resources={moduleResources}
                  selected={Array.isArray(row.moduleListJson) ? row.moduleListJson : []}
                  max={3}
                  onChange={(value) => {
                    const nextRows = [...moduleRows]
                    nextRows[index] = { ...row, orderNum: index, moduleListJson: value }
                    patchTemplate({ moduleJson: nextRows })
                  }}
                />
              </Field>
            ))}
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <Field label="底部配置类型">
            <select value={Number(template.urlModuleType ?? 1)} onChange={(event) => patchTemplate({ urlModuleType: Number(event.target.value) })} className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm">
              <option value={1}>按链接配置</option>
              <option value={2}>按二级栏目配置</option>
            </select>
          </Field>
          <Field label={Number(template.urlModuleType ?? 1) === 2 ? "底部二级栏目" : "底部 URL 资源"}>
            <ResourceMultiSelect
              resources={Number(template.urlModuleType ?? 1) === 2 ? moduleResources : footerResources}
              selected={Number(template.urlModuleType ?? 1) === 2 ? template.urlModule2Json : template.urlModuleJson}
              onChange={(value) => patchTemplate(Number(template.urlModuleType ?? 1) === 2 ? { urlModule2Json: value, urlModuleJson: [] } : { urlModuleJson: value, urlModule2Json: [] })}
            />
          </Field>
        </div>
      </CardContent>
    </Card>
  )
}

function PcTwoTemplatePanel({
  template,
  setTemplate,
  columns,
  modules,
  urlResources,
  loading,
  submitting,
  onSave,
}: {
  template: PcTwTemplatePayload
  setTemplate: React.Dispatch<React.SetStateAction<PcTwTemplatePayload | null>>
  columns: SchoolWebColumn[]
  modules: SchoolWebModule[]
  urlResources: UrlResource[]
  loading: boolean
  submitting: boolean
  onSave: () => void
}) {
  const initJson = template.initJson ?? {}
  const columnResources = columns.map(resourceFromColumn)
  const moduleResources = modules.map(resourceFromModule)
  const urlResourceList = urlResources.map((item) => ({
    id: Number(item.id),
    name: item.name,
    logoUrl: item.logoUrl,
    type: item.type,
    columnUrl: item.url,
    url: item.url,
  }))

  function patchTemplate(patch: Partial<PcTwTemplatePayload>) {
    setTemplate((current) => current ? { ...current, ...patch } : current)
  }

  function patchInit(key: string, value: unknown) {
    patchTemplate({ initJson: { ...initJson, [key]: value } })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle>PC 模板二可视化配置</CardTitle>
          <Button onClick={onSave} disabled={loading || submitting}><Save className="h-4 w-4" />保存模板</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <Field label="皮肤">
            <select value={Number(initJson.infoType ?? 1)} onChange={(event) => patchInit("infoType", Number(event.target.value))} className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm">
              {[1, 2].map((item) => <option key={item} value={item}>皮肤 {item}</option>)}
            </select>
          </Field>
          <Field label="播放切换时间">
            <select value={Number(initJson.shufflingTime ?? 2)} onChange={(event) => patchInit("shufflingTime", Number(event.target.value))} className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm">
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => <option key={item} value={item}>{item} 秒</option>)}
            </select>
          </Field>
          <Field label="默认封面">
            <ImageUploadField value={String(initJson.initPhoto ?? "")} onChange={(value) => patchInit("initPhoto", value)} />
          </Field>
        </div>
        <Field label="轮播图">
          <ManagedUploader value={imageFilesFromUrls(template.photoJson)} onChange={(files) => patchTemplate({ photoJson: urlsFromFiles(files) })} mode="image" multiple max={5} buttonText="添加轮播图" />
        </Field>
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="导航栏目"><ResourceMultiSelect resources={columnResources} selected={template.columnJson} onChange={(value) => patchTemplate({ columnJson: value })} /></Field>
          <Field label="右侧栏目"><ResourceMultiSelect resources={columnResources} selected={template.rightColumnJson} onChange={(value) => patchTemplate({ rightColumnJson: value })} /></Field>
          <Field label="滚动模块"><ResourceSelect resources={moduleResources} value={template.rollModuleJson} onChange={(value) => patchTemplate({ rollModuleJson: value })} /></Field>
          <Field label="左侧模块"><ResourceSelect resources={moduleResources} value={template.leftModuleJson} onChange={(value) => patchTemplate({ leftModuleJson: value })} /></Field>
          <Field label="左侧消息"><ResourceSelect resources={urlResourceList} value={template.leftMessageJson} onChange={(value) => patchTemplate({ leftMessageJson: value })} /></Field>
          <Field label="底部图片模块"><ResourceSelect resources={moduleResources} value={template.bottomPhotoModuleJson} onChange={(value) => patchTemplate({ bottomPhotoModuleJson: value })} /></Field>
        </div>
        <Field label="中部模块">
          <ResourceMultiSelect resources={moduleResources} selected={template.middleModuleJson} onChange={(value) => patchTemplate({ middleModuleJson: value })} max={6} />
        </Field>
        <Field label="左侧 URL 资源">
          <ResourceMultiSelect resources={urlResourceList} selected={template.urlLeftModuleJson} onChange={(value) => patchTemplate({ urlLeftModuleJson: value })} />
        </Field>
      </CardContent>
    </Card>
  )
}

function MbOneTemplatePanel({
  template,
  setTemplate,
  modules,
  loading,
  submitting,
  onSave,
}: {
  template: MbTwTemplatePayload
  setTemplate: React.Dispatch<React.SetStateAction<MbTwTemplatePayload | null>>
  modules: SchoolWebModule[]
  loading: boolean
  submitting: boolean
  onSave: () => void
}) {
  const initJson = template.initJson ?? {}
  const moduleResources = modules.map(resourceFromModule)
  const mainModuleResources = modules.filter((module) => [2, 3].includes(module.type)).map(resourceFromModule)

  function patchTemplate(patch: Partial<MbTwTemplatePayload>) {
    setTemplate((current) => current ? { ...current, ...patch } : current)
  }

  function patchInit(key: string, value: unknown) {
    patchTemplate({ initJson: { ...initJson, [key]: value } })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle>移动端模板一可视化配置</CardTitle>
          <Button onClick={onSave} disabled={loading || submitting}><Save className="h-4 w-4" />保存模板</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Field label="播放切换时间">
          <select value={Number(initJson.shufflingTime ?? 2)} onChange={(event) => patchInit("shufflingTime", Number(event.target.value))} className="h-9 w-full max-w-xs rounded-md border border-slate-300 bg-white px-3 text-sm">
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => <option key={item} value={item}>{item} 秒</option>)}
          </select>
        </Field>
        <Field label="移动端轮播图">
          <ManagedUploader value={imageFilesFromUrls(template.photoJson)} onChange={(files) => patchTemplate({ photoJson: urlsFromFiles(files) })} mode="image" multiple max={5} buttonText="添加轮播图" />
        </Field>
        <Field label="导航模块">
          <ResourceMultiSelect resources={moduleResources} selected={template.moduleJson} onChange={(value) => patchTemplate({ moduleJson: value })} max={8} />
        </Field>
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="主体头部模块"><ResourceSelect resources={mainModuleResources} value={template.tableModuleJson} onChange={(value) => patchTemplate({ tableModuleJson: value })} /></Field>
          <Field label="主体轮播模块"><ResourceSelect resources={mainModuleResources} value={template.photoModuleJson} onChange={(value) => patchTemplate({ photoModuleJson: value })} /></Field>
        </div>
        <Field label="底部切换模块">
          <ResourceMultiSelect resources={mainModuleResources} selected={template.bottomModuleJson} onChange={(value) => patchTemplate({ bottomModuleJson: value })} max={3} />
        </Field>
      </CardContent>
    </Card>
  )
}

function MessageEditPanel({
  title,
  messageForm,
  setMessageForm,
  onBack,
  onSave,
  onDelete,
  submitting,
}: {
  title: string
  messageForm: SchoolWebMessage
  setMessageForm: React.Dispatch<React.SetStateAction<SchoolWebMessage>>
  onBack: () => void
  onSave: () => void
  onDelete?: () => void
  submitting: boolean
}) {
  return (
    <EditPanel title={title} onBack={onBack} onSave={onSave} onDelete={onDelete} submitting={submitting}>
      <Field label="标题" required><Input value={messageForm.title} onChange={(event) => setMessageForm((current) => ({ ...current, title: event.target.value }))} /></Field>
      <Field label="副标题"><Input value={messageForm.titleMark} onChange={(event) => setMessageForm((current) => ({ ...current, titleMark: event.target.value }))} /></Field>
      <Field label="排序"><Input type="number" value={messageForm.orderNo} onChange={(event) => setMessageForm((current) => ({ ...current, orderNo: Number(event.target.value) }))} /></Field>
      <Field label="消息类型" required><MessageTypeSelect value={messageForm.messageType} onChange={(value) => setMessageForm((current) => ({ ...current, messageType: value, messageTypeName: value === 2 ? "url类型" : "普通类型" }))} /></Field>
      <Field label="发布状态" required><MessageStateSelect value={messageForm.state} onChange={(value) => setMessageForm((current) => ({ ...current, state: value }))} /></Field>
      <Field label="封面" className="md:col-span-2"><ImageUploadField value={messageForm.logoUrl} alt={messageForm.title} onChange={(value) => setMessageForm((current) => ({ ...current, logoUrl: value }))} /></Field>
      <Field label="外链地址" className="md:col-span-2"><Input value={messageForm.messageUrl} onChange={(event) => setMessageForm((current) => ({ ...current, messageUrl: event.target.value }))} /></Field>
      <Field label="附件" className="md:col-span-2">
        <ManagedUploader
          value={parseManagedFiles(messageForm.fileJson)}
          onChange={(files) => setMessageForm((current) => ({ ...current, fileJson: stringifyManagedFiles(files) }))}
          mode="file"
          multiple
          max={10}
          sysBucket={2}
        />
      </Field>
      <Field label="正文" className="md:col-span-2" required={Number(messageForm.messageType) !== 2}><UEditorField value={messageForm.content ?? ""} onChange={(value) => setMessageForm((current) => ({ ...current, content: value }))} height={520} /></Field>
    </EditPanel>
  )
}

function SuspendEditPanel({
  suspendForm,
  setSuspendForm,
  onBack,
  onSave,
  onDelete,
  submitting,
}: {
  suspendForm: SuspendMessage
  setSuspendForm: React.Dispatch<React.SetStateAction<SuspendMessage>>
  onBack: () => void
  onSave: () => void
  onDelete?: () => void
  submitting: boolean
}) {
  return (
    <EditPanel title={suspendForm.id ? "编辑悬浮消息" : "新增悬浮消息"} onBack={onBack} onSave={onSave} onDelete={onDelete} submitting={submitting}>
      <Field label="标题"><Input value={suspendForm.title} onChange={(event) => setSuspendForm((current) => ({ ...current, title: event.target.value }))} /></Field>
      <Field label="消息类型"><MessageTypeSelect value={suspendForm.messageType} onChange={(value) => setSuspendForm((current) => ({ ...current, messageType: value }))} /></Field>
      <Field label="开始时间"><Input value={suspendForm.startTime} onChange={(event) => setSuspendForm((current) => ({ ...current, startTime: event.target.value }))} /></Field>
      <Field label="结束时间"><Input value={suspendForm.endTime} onChange={(event) => setSuspendForm((current) => ({ ...current, endTime: event.target.value }))} /></Field>
      <Field label="外链 URL" className="md:col-span-2"><Input value={suspendForm.messageUrl} onChange={(event) => setSuspendForm((current) => ({ ...current, messageUrl: event.target.value }))} /></Field>
      <Field label="附件" className="md:col-span-2">
        <ManagedUploader
          value={parseManagedFiles(suspendForm.fileJson)}
          onChange={(files) => setSuspendForm((current) => ({ ...current, fileJson: stringifyManagedFiles(files) }))}
          mode="file"
          multiple
          max={10}
          sysBucket={2}
        />
      </Field>
      <Field label="消息配置 JSON" className="md:col-span-2"><Textarea rows={6} value={suspendForm.messageJson ?? "{}"} onChange={(event) => setSuspendForm((current) => ({ ...current, messageJson: event.target.value }))} /></Field>
    </EditPanel>
  )
}

function LetterBoxEditPanel({
  letterForm,
  setLetterForm,
  onBack,
  onSave,
  onDelete,
  submitting,
}: {
  letterForm: LetterBoxItem
  setLetterForm: React.Dispatch<React.SetStateAction<LetterBoxItem>>
  onBack: () => void
  onSave: () => void
  onDelete?: () => void
  submitting: boolean
}) {
  return (
    <EditPanel title={letterForm.id ? "回复校长信箱" : "新增校长信箱留言"} onBack={onBack} onSave={onSave} onDelete={onDelete} submitting={submitting}>
      <Field label="标题"><Input value={letterForm.title} onChange={(event) => setLetterForm((current) => ({ ...current, title: event.target.value }))} /></Field>
      <Field label="邮箱"><Input value={letterForm.email ?? ""} onChange={(event) => setLetterForm((current) => ({ ...current, email: event.target.value }))} /></Field>
      <Field label="联系方式类型"><Input type="number" value={letterForm.contactType ?? 1} onChange={(event) => setLetterForm((current) => ({ ...current, contactType: Number(event.target.value) }))} /></Field>
      <Field label="状态"><Input type="number" value={letterForm.status ?? 1} onChange={(event) => setLetterForm((current) => ({ ...current, status: Number(event.target.value) }))} /></Field>
      <Field label="留言内容" className="md:col-span-2"><Textarea rows={6} value={letterForm.content} onChange={(event) => setLetterForm((current) => ({ ...current, content: event.target.value }))} /></Field>
      <Field label="回复内容" className="md:col-span-2"><Textarea rows={6} value={letterForm.replyContent ?? ""} onChange={(event) => setLetterForm((current) => ({ ...current, replyContent: event.target.value }))} /></Field>
      <Field label="落款" className="md:col-span-2"><Input value={letterForm.inscribe ?? ""} onChange={(event) => setLetterForm((current) => ({ ...current, inscribe: event.target.value }))} /></Field>
    </EditPanel>
  )
}

function MenuTypeSelect({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <select value={value} onChange={(event) => onChange(Number(event.target.value))} className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm">
      {menuTypeOptions.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  )
}

function MessageTypeSelect({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <select value={value} onChange={(event) => onChange(Number(event.target.value))} className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm">
      {messageTypeOptions.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  )
}

function MessageStateSelect({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <select value={value} onChange={(event) => onChange(Number(event.target.value))} className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm">
      {messageStateOptions.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  )
}

function menuTypeLabel(value?: number) {
  return menuTypeOptions.find((option) => option.value === value)?.label ?? "-"
}

function messageStateLabel(value?: number) {
  const option = messageStateOptions.find((item) => item.value === value)
  return option ? option.label : "-"
}

function LogoPreview({ src, alt }: { src?: string; alt?: string }) {
  if (!src) {
    return <span className="text-xs text-slate-400">无图片</span>
  }

  return (
    <img
      src={src}
      alt={alt || "图片"}
      className="h-14 w-20 rounded border border-slate-200 object-contain"
    />
  )
}

function TemplateEditorCard({
  title,
  description,
  value,
  onChange,
  onSave,
  loading,
  submitting,
}: {
  title: string
  description?: string
  value: string
  onChange: (value: string) => void
  onSave: () => void
  loading: boolean
  submitting: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center text-sm text-slate-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            正在加载模板…
          </div>
        ) : (
          <div className="space-y-4">
            <Textarea rows={24} value={value} onChange={(event) => onChange(event.target.value)} className="font-mono text-xs" />
            <div className="flex justify-end">
              <Button onClick={onSave} disabled={submitting}>
                <Save className="h-4 w-4" />
                保存模板
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
