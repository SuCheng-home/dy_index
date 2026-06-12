import { headers } from "next/headers"

import {
  type HomeMessageSummary,
  type HomeModuleSummary,
  type PcHomeTemplate,
  createPublicSiteContext,
  getPublicColumnById,
  getPublicHomeTemplate,
  getPublicMessageById,
  getPublicModuleById,
  getPublicModuleMessages,
  getPublicNavigationColumns,
  getPublicPrevNextMessage,
  getPublicSiteSetting,
  SCHOOL_WEB_TWO_CONFIG,
  type HomeColumnSummary,
  type PublicSiteContext,
  type SchoolWebMessage,
  type SchoolWebModule,
} from "@/lib/school-web-two"
import {
  buildNavigationTree,
  buildRootSiteConfigFromRemote,
  findColumnById,
  findModuleById,
} from "@/lib/public-site"

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"])

function cleanHost(value: string) {
  const host = value.split(",")[0]?.trim() ?? ""
  return host.replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^\[/, "").replace(/\]$/, "").split(":")[0]
}

export function resolvePublicDomainFromHost(host?: string | null) {
  const candidate = cleanHost(host ?? "")
  if (!candidate || LOCAL_HOSTS.has(candidate)) return SCHOOL_WEB_TWO_CONFIG.domainName
  return candidate
}

export async function getRequestPublicDomain(domain?: string | null) {
  if (domain) return resolvePublicDomainFromHost(domain)

  const headerStore = await headers()
  return resolvePublicDomainFromHost(
    headerStore.get("x-forwarded-host")
      ?? headerStore.get("host")
  )
}

export async function getPublicSiteContext(domain?: string | null): Promise<PublicSiteContext> {
  const resolvedDomain = await getRequestPublicDomain(domain)
  let setting = await getPublicSiteSetting(resolvedDomain)

  if (!setting && resolvedDomain !== SCHOOL_WEB_TWO_CONFIG.domainName) {
    setting = await getPublicSiteSetting(SCHOOL_WEB_TWO_CONFIG.domainName)
  }

  return createPublicSiteContext(setting, resolvedDomain)
}

export async function getRealtimeNavigationColumns(context?: Pick<PublicSiteContext, "webId">) {
  const webId = context?.webId ?? SCHOOL_WEB_TWO_CONFIG.webId
  const commonColumns = await getPublicNavigationColumns(webId).catch(() => [])
  if (commonColumns.length > 0) {
    return {
      columns: await mergeColumnDetailLogos(commonColumns),
      source: "common",
    }
  }

  return {
    columns: [],
    source: "empty",
  }
}

export async function mergeColumnDetailLogos(columns: HomeColumnSummary[]) {
  const detailLogos = await Promise.all(
    columns.map(async (column) => {
      if (column.logoUrl) return column.logoUrl
      const detail = await getPublicColumnById(column.id).catch(() => null)
      return detail?.logoUrl ?? ""
    })
  )

  return columns.map((column, index) => ({
    ...column,
    logoUrl: column.logoUrl || detailLogos[index] || "",
  }))
}

export async function getPublicSiteSnapshot(domain?: string | null) {
  const context = await getPublicSiteContext(domain)
  const template = await getPublicHomeTemplate(context)
  const { columns: navigationColumns, source } = await getRealtimeNavigationColumns(context)
  const templateColumns = navigationColumns.length > 0
    ? navigationColumns
    : await mergeColumnDetailLogos(template.columnList)
  const realtimeTemplate = await hydrateHomeTemplateMessages({
    ...template,
    columnList: templateColumns,
  })
  const config = buildRootSiteConfigFromRemote(context, realtimeTemplate)
  const navigationTree = buildNavigationTree(realtimeTemplate.columnList)
  return {
    setting: context.setting,
    context,
    template: realtimeTemplate,
    config,
    navigationTree,
    navigationSource: navigationColumns.length > 0 ? source : "template",
  }
}

async function hydrateHomeTemplateMessages(template: PcHomeTemplate) {
  const homeColumn = template.columnList[0]
  const homeModules = homeColumn?.moduleList ?? []
  if (homeModules.length === 0) return template

  const messageLists = await Promise.all(
    homeModules.map((module) => getHomeModuleMessageSummaries(module.id))
  )
  const messageListByModuleId = new Map(
    homeModules.map((module, index) => [module.id, messageLists[index]])
  )
  const hydratedHomeModules = homeModules.map((module) => ({
    ...module,
    messageList: messageListByModuleId.get(module.id) ?? module.messageList ?? [],
  }))

  return {
    ...template,
    columnList: template.columnList.map((column, index) => index === 0
      ? { ...column, moduleList: hydratedHomeModules }
      : column
    ),
    moduleList: template.moduleList.map((group) => ({
      ...group,
      moduleListJson: group.moduleListJson.map((module) => ({
        ...module,
        messageList: messageListByModuleId.get(module.id) ?? module.messageList ?? [],
      })),
    })),
  }
}

async function getHomeModuleMessageSummaries(moduleId: number): Promise<HomeMessageSummary[]> {
  const messages = await getPublicModuleMessages(moduleId, 1, 8).catch(() => null)
  return (messages?.dataList ?? []).map((message) => ({
    id: message.id,
    title: message.title,
    logoUrl: message.logoUrl,
    messageType: message.messageType,
    messageUrl: message.messageUrl,
    createTime: message.createTime,
  }))
}

export async function getPublicColumnPage(columnId: number, domain?: string | null) {
  const snapshot = await getPublicSiteSnapshot(domain)
  const columnSummary = findColumnById(snapshot.template.columnList, columnId)
  const columnDetail = await getPublicColumnById(columnId)

  return {
    ...snapshot,
    columnSummary,
    columnDetail,
  }
}

export async function getPublicModulePage(columnId: number, moduleId: number, pageNo = 1, pageSize = 20, domain?: string | null) {
  const snapshot = await getPublicSiteSnapshot(domain)
  const moduleMatch = findModuleById(snapshot.template.columnList, columnId, moduleId)
  const moduleDetail = await getPublicModuleById(moduleId)
  const messages = await getPublicModuleMessages(moduleId, pageNo, pageSize)

  return {
    ...snapshot,
    columnSummary: moduleMatch?.column ?? null,
    moduleSummary: moduleMatch?.module ?? null,
    moduleDetail,
    messages,
  }
}

export async function getPublicMessagePage(messageId: number, domain?: string | null) {
  const snapshot = await getPublicSiteSnapshot(domain)
  const message = await getPublicMessageById(messageId)
  const primaryModuleId = Number(String(message.moduleIds).split(",").find(Boolean) ?? 0)
  const moduleDetail = primaryModuleId ? await getPublicModuleById(primaryModuleId) : null
  const relatedMessages = primaryModuleId
    ? await getPublicModuleMessages(primaryModuleId, 1, 6)
    : { dataList: [], pagination: { firstPage: 1, lastPage: 1, pageNo: 1, pageSize: 6, pages: 1, total: 0 } }
  const siblings = primaryModuleId && message.createTime
    ? await getPublicPrevNextMessage(primaryModuleId, message.createTime)
    : { lastMessage: null, nextMessage: null }

  return {
    ...snapshot,
    message,
    moduleDetail,
    relatedMessages,
    siblings,
  }
}

export function buildColumnModuleCards(column: HomeColumnSummary | null, modules: SchoolWebModule[]) {
  const summaryMap = new Map((column?.moduleList ?? []).map((item) => [item.id, item]))
  const detailMap = new Map(modules.map((module) => [module.id, module]))
  const orderedIds = [
    ...(column?.moduleList ?? []).map((module) => module.id),
    ...modules.map((module) => module.id),
  ]
  const uniqueIds = Array.from(new Set(orderedIds))

  return uniqueIds.flatMap((id) => {
    const detail = detailMap.get(id)
    const summary = summaryMap.get(id)
    if (detail) {
      return [{
        ...detail,
        logoUrl: detail.logoUrl || summary?.logoUrl || "",
      }]
    }
    return summary ? [homeModuleSummaryToSchoolWebModule(column, summary)] : []
  })
}

export function filterVisibleModules(modules: SchoolWebModule[]) {
  return modules.filter((module) => module.isShow !== 2)
}

function homeModuleSummaryToSchoolWebModule(column: HomeColumnSummary | null, module: HomeModuleSummary): SchoolWebModule {
  return {
    id: module.id,
    webId: 0,
    schoolId: 0,
    columnId: column?.id ?? 0,
    name: module.name,
    orderNo: 0,
    type: module.type,
    isShow: 1,
    content: "",
    columnUrl: module.columnUrl,
    logoUrl: module.logoUrl,
  }
}

export function filterRelatedMessages(messages: SchoolWebMessage[], currentId: number) {
  return messages.filter((item) => item.id !== currentId).slice(0, 5)
}
