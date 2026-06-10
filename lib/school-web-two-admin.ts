import {
  defaultMbTemplatePayload,
  defaultMbTwTemplatePayload,
  defaultPcTemplatePayload,
  defaultPcTwTemplatePayload,
  hydrateColumn,
  hydrateLetterBox,
  hydrateMessage,
  hydrateModule,
  hydrateSuspendMessage,
  requestSchoolWeb,
  requestWxcep,
  SCHOOL_WEB_TWO_CONFIG,
  type AccessTrendItem,
  type LetterBoxItem,
  type MbTemplatePayload,
  type MbTwTemplatePayload,
  type PaginatedResult,
  type PcTemplatePayload,
  type PcTwTemplatePayload,
  type SchoolWebColumn,
  type SchoolWebMessage,
  type SchoolWebModule,
  type SiteSetting,
  type SuspendMessage,
  unwrapSchoolWebResponse,
} from "@/lib/school-web-two"

export type AddressBookUser = {
  id: number
  pid?: number
  name: string
  loginname?: string
  mobile?: string
  photoImg?: string
  avatar?: string
  type?: number | string
}

export type AddressBookDepart = {
  id: number
  pid?: number
  name: string
  wxDepartId?: string | number
  hasChild?: number | boolean
  type?: number | string
}

export type AddressBookGroup = {
  id: number
  pid?: number
  name: string
  wxTagId?: string | number
  type?: number | string
}

export type AddressBookData = {
  departs?: AddressBookDepart[]
  users?: AddressBookUser[]
  groups?: AddressBookGroup[]
}

function structureGet<T>(token: string, endpoint: string, query?: Record<string, unknown>) {
  return requestSchoolWeb<T>({
    scope: "structure",
    endpoint,
    query,
    token,
  })
}

function structurePost<T>(token: string, endpoint: string, body?: Record<string, unknown>, query?: Record<string, unknown>) {
  return requestSchoolWeb<T>({
    scope: "structure",
    endpoint,
    method: "POST",
    body,
    query,
    token,
  })
}

function commonPost<T>(endpoint: string, body?: Record<string, unknown>, query?: Record<string, unknown>) {
  return requestSchoolWeb<T>({
    scope: "common",
    endpoint,
    method: "POST",
    body,
    query,
  })
}

function wxcepAddressPost<T>(token: string, endpoint: string, body?: Record<string, unknown>) {
  return requestWxcep<T>({
    endpoint,
    method: "POST",
    body,
    token,
    contentType: "form",
  })
}

function parseJsonField<T>(value: unknown, fallback: T): T {
  if (Array.isArray(value) || (value && typeof value === "object")) return value as T
  if (typeof value !== "string" || !value.trim()) return fallback

  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

function manageWebId(webId?: number) {
  return Number(webId || SCHOOL_WEB_TWO_CONFIG.webId)
}

function withManageWebContext<T extends Record<string, unknown>>(webId: number | undefined, payload?: T) {
  return {
    webId: manageWebId(webId),
    schoolId: SCHOOL_WEB_TWO_CONFIG.schoolId,
    ...(payload ?? {}),
  }
}

export async function getManageSiteSetting(token: string, webId?: number) {
  const response = await structureGet<SiteSetting>(token, "getSchoolWebSettingById", {
    webId: manageWebId(webId),
  })
  return unwrapSchoolWebResponse(response)
}

export async function initAddressBook(token: string, isSchoolManager = false) {
  const response = await wxcepAddressPost<AddressBookData>(token, "api/address/init", {
    isSchoolManager,
  })
  return unwrapSchoolWebResponse(response)
}

export async function queryAddressByDepartId(token: string, departId: number | string, userTypes = "1") {
  const response = await wxcepAddressPost<AddressBookData>(token, "api/address/queryByDepartId", {
    departId,
    userTypes,
  })
  return unwrapSchoolWebResponse(response)
}

export async function retrievalAddressUsers(token: string, query: {
  condition?: string
  userTypes?: string
  excludeUserIdsStr?: string
  departIds?: string
}) {
  const response = await wxcepAddressPost<AddressBookData>(token, "api/address/retrievalUsers", {
    condition: query.condition ?? "",
    userTypes: query.userTypes ?? "1",
    excludeUserIdsStr: query.excludeUserIdsStr ?? "",
    departIds: query.departIds ?? "",
  })
  return unwrapSchoolWebResponse(response)
}

export async function queryAddressByGroupId(token: string, groupId: number | string) {
  const response = await wxcepAddressPost<AddressBookData>(token, "api/address/queryByGroupId", {
    groupId,
  })
  return unwrapSchoolWebResponse(response)
}

export async function createManageSiteSetting(token: string, payload: Partial<SiteSetting>) {
  const response = await structurePost<{ id: number }>(token, "addSchoolWebSetting", {
    address: payload.address ?? "",
    description: payload.description ?? "",
    webName: payload.webName ?? "",
    keyWord: payload.keyWord ?? "",
    copyRight: payload.copyRight ?? "",
    postRecodation: payload.postRecodation ?? "",
    recodation: payload.recodation ?? "",
    institution: payload.institution ?? "",
    domainName: payload.domainName ?? "",
    oldDomainName: payload.oldDomainName ?? "",
    logoUrl: payload.logoUrl ?? "",
    isInstitute: payload.isInstitute ?? 1,
    domainNameTw: payload.domainNameTw ?? "",
  })
  return unwrapSchoolWebResponse(response)
}

export async function updateManageSiteSetting(token: string, payload: Partial<SiteSetting>, webId?: number) {
  const response = await structurePost<Record<string, never>>(token, "updateSchoolWebSetting", {
    ...payload,
    Id: manageWebId(webId),
  })
  return unwrapSchoolWebResponse(response)
}

export async function deleteManageSiteSetting(token: string, webId?: number) {
  const response = await structureGet<Record<string, never>>(token, "delSchoolWebSettingById", {
    webId: manageWebId(webId),
  })
  return unwrapSchoolWebResponse(response)
}

export async function getManageSiteSettingBySchool(token: string) {
  const response = await structurePost<SiteSetting[] | SiteSetting>(token, "getSchoolWebSettingBySchoolId")
  return unwrapSchoolWebResponse(response)
}

export async function listColumns(token: string, webId?: number) {
  const response = await structureGet<SchoolWebColumn[]>(token, "getSchooWebColumnListByWebId", {
    webId: manageWebId(webId),
  })
  return unwrapSchoolWebResponse(response).map(hydrateColumn).sort((a, b) => a.orderNo - b.orderNo)
}

export async function getColumn(token: string, columnId: number) {
  const response = await structureGet<SchoolWebColumn>(token, "getSchooWebColumnById", {
    columnId,
  })
  return hydrateColumn(unwrapSchoolWebResponse(response))
}

export async function createColumn(token: string, payload: Partial<SchoolWebColumn>, webId?: number) {
  const response = await structurePost<Record<string, never>>(token, "addSchooWebColumn", withManageWebContext(webId, {
    orderNo: payload.orderNo ?? 0,
    columnUrl: payload.columnUrl ?? "",
    content: payload.content ?? "",
    type: payload.type ?? 1,
    logoUrl: payload.logoUrl ?? "",
    managerUserJson: parseJsonField(payload.managerUserJson, []),
    name: payload.name ?? "",
}))
  return unwrapSchoolWebResponse(response)
}

export async function updateColumn(token: string, payload: Partial<SchoolWebColumn> & { id: number }, webId?: number) {
  const response = await structurePost<Record<string, never>>(token, "updateSchooWebColumn", withManageWebContext(webId, {
    id: payload.id,
    orderNo: payload.orderNo ?? 0,
    columnUrl: payload.columnUrl ?? "",
    content: payload.content ?? "",
    type: payload.type ?? 1,
    logoUrl: payload.logoUrl ?? "",
    managerUserJson: parseJsonField(payload.managerUserJson, []),
    name: payload.name ?? "",
}))
  return unwrapSchoolWebResponse(response)
}

export async function deleteColumn(token: string, columnId: number) {
  const response = await structureGet<Record<string, never>>(token, "delSchooWebColumnById", {
    columnId,
  })
  return unwrapSchoolWebResponse(response)
}

export async function listModulesByColumn(token: string, columnId: number) {
  const response = await structureGet<SchoolWebModule[]>(token, "getSchoolWebModuleListByColumnId", {
    columnId,
  })
  return unwrapSchoolWebResponse(response).map(hydrateModule).sort((a, b) => a.orderNo - b.orderNo)
}

export async function listModulesByWebId(token: string, type?: number, webId?: number) {
  const response = await structureGet<SchoolWebModule[]>(token, "getSchoolWebModuleListByWebId", {
    webId: manageWebId(webId),
    type,
  })
  return unwrapSchoolWebResponse(response).map(hydrateModule).sort((a, b) => a.orderNo - b.orderNo)
}

export async function listCreatorModules(token: string, webId?: number) {
  const response = await structureGet<SchoolWebModule[]>(token, "getSchoolWebModuleList", {
    webId: manageWebId(webId),
  })
  return unwrapSchoolWebResponse(response).map(hydrateModule).sort((a, b) => a.orderNo - b.orderNo)
}

export async function listUrlResources(token: string, webId?: number) {
  const response = await structureGet<Array<{
    id: string
    name: string
    logoUrl: string
    url: string
    type: number
  }>>(token, "getSchoolWebColumnAndMessageUrlListByWebId", {
    webId: manageWebId(webId),
  })
  return unwrapSchoolWebResponse(response)
}

export async function listAllModules(token: string, webId?: number) {
  const columns = await listColumns(token, webId)
  const grouped = await Promise.all(
    columns.map(async (column) => ({
      column,
      modules: await listModulesByColumn(token, column.id),
    }))
  )
  return grouped
}

export async function getModule(token: string, moduleId: number) {
  const response = await structureGet<SchoolWebModule>(token, "getSchoolWebModuleById", {
    moduleId,
  })
  return hydrateModule(unwrapSchoolWebResponse(response))
}

export async function createModule(token: string, payload: Partial<SchoolWebModule>, webId?: number) {
  const response = await structurePost<Record<string, never>>(token, "addSchoolWebModule", withManageWebContext(webId, {
    name: payload.name ?? "",
    isShow: payload.isShow ?? 1,
    content: payload.content ?? "",
    type: payload.type ?? 1,
    columnId: payload.columnId ?? 0,
    orderNo: payload.orderNo ?? 0,
    logoUrl: payload.logoUrl ?? "",
    columnUrl: payload.columnUrl ?? "",
  }))
  return unwrapSchoolWebResponse(response)
}

export async function updateModule(token: string, payload: Partial<SchoolWebModule> & { id: number }, webId?: number) {
  const response = await structurePost<Record<string, never>>(token, "updateSchoolWebModule", withManageWebContext(webId, {
    id: payload.id,
    name: payload.name ?? "",
    isShow: payload.isShow ?? 1,
    content: payload.content ?? "",
    type: payload.type ?? 1,
    columnId: payload.columnId ?? 0,
    orderNo: payload.orderNo ?? 0,
    logoUrl: payload.logoUrl ?? "",
    columnUrl: payload.columnUrl ?? "",
  }))
  return unwrapSchoolWebResponse(response)
}

export async function deleteModule(token: string, moduleId: number) {
  const response = await structureGet<Record<string, never>>(token, "delSchoolWebModuleById", {
    moduleId,
  })
  return unwrapSchoolWebResponse(response)
}

export async function listMessages(token: string, query: {
  moduleId: number
  title?: string
  pageNo?: number
  pageSize?: number
  state?: number
}, webId?: number) {
  const response = await structureGet<PaginatedResult<SchoolWebMessage>>(token, "getSchoolWebModuleMessageList", {
    moduleId: query.moduleId,
    title: query.title ?? "",
    pageNo: query.pageNo ?? 1,
    pageSize: query.pageSize ?? 20,
    state: query.state ?? 2,
    webId: String(manageWebId(webId)),
  })
  const result = unwrapSchoolWebResponse(response)
  return {
    ...result,
    dataList: Array.isArray(result.dataList) ? result.dataList.map(hydrateMessage) : [],
  }
}

export async function listModuleMessagesByModuleId(token: string, moduleId: number) {
  const response = await structureGet<SchoolWebMessage[]>(token, "getModuleMessageListByModuleId", {
    moduleId,
  })
  return unwrapSchoolWebResponse(response).map(hydrateMessage)
}

export async function listCreatorMessages(token: string, query: {
  moduleId?: number
  title?: string
  pageNo?: number
  pageSize?: number
  state?: number
}, webId?: number) {
  const response = await structureGet<PaginatedResult<SchoolWebMessage>>(token, "getSchoolWebCreateUserMessageList", {
    moduleId: query.moduleId ?? 0,
    title: query.title ?? "",
    pageNo: query.pageNo ?? 1,
    pageSize: query.pageSize ?? 20,
    state: query.state ?? 0,
    webId: manageWebId(webId),
  })
  const result = unwrapSchoolWebResponse(response)
  return {
    ...result,
    dataList: Array.isArray(result.dataList) ? result.dataList.map(hydrateMessage) : [],
  }
}

export async function getMessage(token: string, messageId: number) {
  const response = await structureGet<SchoolWebMessage>(token, "getSchoolWebModuleMessageById", {
    messageId,
  })
  return hydrateMessage(unwrapSchoolWebResponse(response))
}

export async function createMessage(token: string, payload: Partial<SchoolWebMessage> & { moduleIds: string }, webId?: number) {
  const response = await structurePost<Record<string, never>>(token, "addSchoolWebModuleMessage", withManageWebContext(webId, {
    title: payload.title ?? "",
    titleMark: payload.titleMark ?? "",
    createTime: payload.createTime ?? new Date().toISOString().slice(0, 19).replace("T", " "),
    mark: payload.mark ?? "",
    messageType: payload.messageType ?? 1,
    messageTypeName: payload.messageTypeName ?? "普通类型",
    content: payload.content ?? "",
    moduleIds: payload.moduleIds,
    state: payload.state ?? 2,
    fileJson: parseJsonField(payload.fileJson, []),
    logoUrl: payload.logoUrl ?? "",
    messageUrl: payload.messageUrl ?? "",
    orderNo: payload.orderNo ?? 0,
}))
  return unwrapSchoolWebResponse(response)
}

export async function updateMessage(token: string, payload: Partial<SchoolWebMessage> & { id: number; moduleIds: string }, webId?: number) {
  const response = await structurePost<Record<string, never>>(token, "updateSchoolWebModuleMessage", withManageWebContext(webId, {
    id: payload.id,
    messageType: payload.messageType ?? 1,
    state: payload.state ?? 2,
    fileJson: parseJsonField(payload.fileJson, []),
    mark: payload.mark ?? "",
    messageUrl: payload.messageUrl ?? "",
    titleMark: payload.titleMark ?? "",
    moduleIds: payload.moduleIds,
    title: payload.title ?? "",
    messageTypeName: payload.messageTypeName ?? "普通类型",
    logoUrl: payload.logoUrl ?? "",
    orderNo: payload.orderNo ?? 0,
    content: payload.content ?? "",
}))
  return unwrapSchoolWebResponse(response)
}

export async function deleteMessage(token: string, messageId: number) {
  const response = await structureGet<Record<string, never>>(token, "delSchoolWebModuleMessageById", {
    messageId,
  })
  return unwrapSchoolWebResponse(response)
}

export async function batchDeleteMessages(token: string, messageIds: string) {
  const response = await structureGet<Record<string, never>>(token, "delSchoolWebModuleMessageByIds", {
    messageIds,
  })
  return unwrapSchoolWebResponse(response)
}

export async function moveMessages(token: string, messageIds: string, moduleIds: string) {
  const response = await structurePost<Record<string, never>>(token, "moveSchoolWebModuleMessage", {
    messageIds,
    moduleIds,
  })
  return unwrapSchoolWebResponse(response)
}

export async function topMessage(token: string, messageId: number, ropAndDownState: number) {
  const response = await structureGet<Record<string, never>>(token, "updateSchoolWebModuleMessageTop", {
    messageId,
    ropAndDownState,
  })
  return unwrapSchoolWebResponse(response)
}

export async function approveMessage(token: string, payload: { id: number; state: number; addType: number }) {
  const response = await structurePost<Record<string, never>>(token, "batchSchoolWebModuleMessage", payload)
  return unwrapSchoolWebResponse(response)
}

export async function listSuspendMessages(token: string, query?: { title?: string; pageNo?: number; pageSize?: number }, webId?: number) {
  const response = await structureGet<PaginatedResult<SuspendMessage>>(token, "getSchoolWebSuspendMessageList", {
    pageNo: query?.pageNo ?? 1,
    title: query?.title ?? "",
    pageSize: query?.pageSize ?? 20,
    webId: manageWebId(webId),
  })
  const result = unwrapSchoolWebResponse(response)
  return {
    ...result,
    dataList: Array.isArray(result.dataList) ? result.dataList.map(hydrateSuspendMessage) : [],
  }
}

export async function getSuspendMessage(token: string, messageId: number) {
  const response = await structureGet<SuspendMessage>(token, "getSchoolWebSuspendMessageById", {
    messageId,
  })
  return hydrateSuspendMessage(unwrapSchoolWebResponse(response))
}

export async function createSuspendMessage(token: string, payload: Partial<SuspendMessage>, webId?: number) {
  const response = await structurePost<Record<string, never>>(token, "addSchoolWebSuspendMessage", {
    webId: manageWebId(webId),
    title: payload.title ?? "",
    startTime: payload.startTime ?? "",
    endTime: payload.endTime ?? "",
    messageType: payload.messageType ?? 1,
    messageUrl: payload.messageUrl ?? "",
    fileJson: parseJsonField(payload.fileJson, []),
    messageJson: parseJsonField(payload.messageJson, {}),
  })
  return unwrapSchoolWebResponse(response)
}

export async function updateSuspendMessage(token: string, payload: Partial<SuspendMessage> & { id: number }, webId?: number) {
  const response = await structurePost<Record<string, never>>(token, "updateSchoolWebSuspendMessage", {
    id: payload.id,
    webId: manageWebId(webId),
    title: payload.title ?? "",
    startTime: payload.startTime ?? "",
    endTime: payload.endTime ?? "",
    messageType: payload.messageType ?? 1,
    messageUrl: payload.messageUrl ?? "",
    fileJson: parseJsonField(payload.fileJson, []),
    messageJson: parseJsonField(payload.messageJson, {}),
  })
  return unwrapSchoolWebResponse(response)
}

export async function deleteSuspendMessage(token: string, messageId: number) {
  const response = await structureGet<Record<string, never>>(token, "delSchoolWebSuspendMessageById", {
    messageId,
  })
  return unwrapSchoolWebResponse(response)
}

export async function batchDeleteSuspendMessages(token: string, messageIds: string) {
  const response = await structureGet<Record<string, never>>(token, "delSchoolWebSuspendMessageByIds", {
    messageIds,
  })
  return unwrapSchoolWebResponse(response)
}

export async function listLetterBox(token: string, query?: { title?: string; pageNo?: number; pageSize?: number; status?: number }, webId?: number) {
  const response = await structureGet<PaginatedResult<LetterBoxItem>>(token, "getSchoolWebLetterBoxList", {
    pageNo: query?.pageNo ?? 1,
    title: query?.title ?? "",
    pageSize: query?.pageSize ?? 20,
    status: query?.status ?? 0,
    webId: manageWebId(webId),
  })
  const result = unwrapSchoolWebResponse(response)
  return {
    ...result,
    dataList: Array.isArray(result.dataList) ? result.dataList.map(hydrateLetterBox) : [],
  }
}

export async function getLetterBox(token: string, messageId: number) {
  const response = await structureGet<LetterBoxItem>(token, "getSchoolWebLetterBoxById", {
    messageId,
  })
  return hydrateLetterBox(unwrapSchoolWebResponse(response))
}

export async function createLetterBox(payload: Partial<LetterBoxItem>, webId?: number) {
  const response = await commonPost<Record<string, never>>("addSchoolWebLetterBox", {
    webId: manageWebId(webId),
    title: payload.title ?? "",
    content: payload.content ?? "",
    email: payload.email ?? "",
    contactType: payload.contactType ?? 1,
  })
  return unwrapSchoolWebResponse(response)
}

export async function updateLetterBox(token: string, payload: Partial<LetterBoxItem> & { id: number }, webId?: number) {
  const response = await structurePost<Record<string, never>>(token, "updateSchoolWebLetterBox", {
    id: payload.id,
    webId: manageWebId(webId),
    replyContent: payload.replyContent ?? "",
    status: payload.status ?? 1,
    inscribe: payload.inscribe ?? "",
  })
  return unwrapSchoolWebResponse(response)
}

export async function deleteLetterBox(token: string, messageIds: string) {
  const response = await structureGet<Record<string, never>>(token, "delSchoolWebLetterBoxByIds", {
    messageIds,
  })
  return unwrapSchoolWebResponse(response)
}

export async function getAccessTrend(token: string, startDate: string, endDate: string, webId?: number) {
  const response = await structureGet<AccessTrendItem[]>(token, "getWebAccessNumberList", {
    webId: manageWebId(webId),
    startDate,
    endDate,
  })
  return unwrapSchoolWebResponse(response)
}

export async function getPcTwTemplate(token: string, webId?: number) {
  const response = await structureGet<PcTwTemplatePayload | null>(token, "getSchoolWebTemplatePcTw", {
    webId: manageWebId(webId),
    templateType: SCHOOL_WEB_TWO_CONFIG.templateTypePc,
  })
  return unwrapSchoolWebResponse(response) ?? { ...defaultPcTwTemplatePayload(), webId: manageWebId(webId) }
}

export async function getPcTemplate(token: string, webId?: number) {
  const response = await structureGet<PcTemplatePayload | null>(token, "getSchoolWebTemplatePc", {
    webId: manageWebId(webId),
    templateType: SCHOOL_WEB_TWO_CONFIG.templateTypePc,
  })
  return unwrapSchoolWebResponse(response) ?? { ...defaultPcTemplatePayload(), webId: manageWebId(webId) }
}

export async function updatePcTemplate(token: string, payload: Partial<PcTemplatePayload>, webId?: number) {
  const response = await structurePost<{ id: number }>(token, "addAndUpdateSchoolWebTemplatePc", {
    ...defaultPcTemplatePayload(),
    ...payload,
    templateType: SCHOOL_WEB_TWO_CONFIG.templateTypePc,
    webId: manageWebId(webId),
  })
  return unwrapSchoolWebResponse(response)
}

export async function updatePcTwTemplate(token: string, payload: Partial<PcTwTemplatePayload>, webId?: number) {
  const response = await structurePost<Record<string, never>>(token, "addAndUpdateSchoolWebTemplatePcTw", {
    ...defaultPcTwTemplatePayload(),
    ...payload,
    templateType: SCHOOL_WEB_TWO_CONFIG.templateTypePc,
    webId: manageWebId(webId),
  })
  return unwrapSchoolWebResponse(response)
}

export async function getMbTwTemplate(token: string, webId?: number) {
  const response = await structureGet<MbTwTemplatePayload | null>(token, "getSchoolWebTemplateMbTw", {
    webId: manageWebId(webId),
    templateType: SCHOOL_WEB_TWO_CONFIG.templateTypeMb,
  })
  return unwrapSchoolWebResponse(response) ?? { ...defaultMbTwTemplatePayload(), webId: manageWebId(webId) }
}

export async function getMbTemplate(token: string, webId?: number) {
  const response = await structureGet<MbTemplatePayload | null>(token, "getSchoolWebTemplateMb", {
    webId: manageWebId(webId),
    templateType: SCHOOL_WEB_TWO_CONFIG.templateTypeMb,
  })
  return unwrapSchoolWebResponse(response) ?? { ...defaultMbTemplatePayload(), webId: manageWebId(webId) }
}

export async function updateMbTemplate(token: string, payload: Partial<MbTemplatePayload>, webId?: number) {
  const response = await structurePost<{ id: number }>(token, "addAndUpdateSchoolWebTemplateMb", {
    ...defaultMbTemplatePayload(),
    ...payload,
    templateType: SCHOOL_WEB_TWO_CONFIG.templateTypeMb,
    webId: manageWebId(webId),
  })
  return unwrapSchoolWebResponse(response)
}

export async function updateMbTwTemplate(token: string, payload: Partial<MbTwTemplatePayload>, webId?: number) {
  const response = await structurePost<Record<string, never>>(token, "addAndUpdateSchoolWebTemplateMbTw", {
    ...defaultMbTwTemplatePayload(),
    ...payload,
    templateType: SCHOOL_WEB_TWO_CONFIG.templateTypeMb,
    webId: manageWebId(webId),
  })
  return unwrapSchoolWebResponse(response)
}

export async function getPublicSuspendMessages(token: string, searchTime: string, webId?: number) {
  const response = await requestSchoolWeb<SuspendMessage[]>({
    scope: "common",
    endpoint: "getSchoolWebSuspendMessageListByTime",
    query: {
      webId: manageWebId(webId),
      searchTime,
    },
    token,
  })
  return unwrapSchoolWebResponse(response).map(hydrateSuspendMessage)
}

export async function listPublicLetterBox(query?: { title?: string; pageNo?: number; pageSize?: number }, webId?: number) {
  const response = await requestSchoolWeb<PaginatedResult<LetterBoxItem>>({
    scope: "common",
    endpoint: "getPublicSchoolWebLetterBoxList",
    query: {
      pageNo: query?.pageNo ?? 1,
      title: query?.title ?? "",
      pageSize: query?.pageSize ?? 20,
      webId: manageWebId(webId),
    },
  })
  const result = unwrapSchoolWebResponse(response)
  return {
    ...result,
    dataList: Array.isArray(result.dataList) ? result.dataList.map(hydrateLetterBox) : [],
  }
}
