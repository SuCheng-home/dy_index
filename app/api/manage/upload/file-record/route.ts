import { ok, parseJsonBody, requireManageSession, withManageHandler } from "@/lib/manage-route"
import { resolveManageWebId } from "@/lib/manage-session"
import { requestWxcep, SCHOOL_WEB_TWO_CONFIG, unwrapSchoolWebResponse } from "@/lib/school-web-two"

type FileRecordBody = {
  fileId?: string
  fileSize?: number
  fileUrl?: string
  moduleCode?: string
  moduleName?: string
  schoolId?: number
}

export async function POST(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const body = await parseJsonBody<FileRecordBody>(request)
    const response = await requestWxcep<Record<string, unknown>>({
      endpoint: "common/wxfileInfo/addWxfileInfo",
      method: "POST",
      body: {
        fileId: body.fileId ?? "",
        fileSize: body.fileSize ?? 0,
        fileUrl: body.fileUrl ?? "",
        moduleCode: body.moduleCode ?? "2056",
        moduleName: body.moduleName ?? "wangzhan",
        schoolId: body.schoolId ?? session.schoolId ?? SCHOOL_WEB_TWO_CONFIG.schoolId,
        webId: resolveManageWebId(session),
      },
      token: session.token,
      contentType: "json",
    })
    return ok(unwrapSchoolWebResponse(response), "文件记录已保存")
  })
}

export async function DELETE(request: Request) {
  return withManageHandler(async () => {
    const session = await requireManageSession()
    const { searchParams } = new URL(request.url)
    const fileUrl = searchParams.get("fileUrl") ?? ""
    const response = await requestWxcep<Record<string, unknown>>({
      endpoint: "common/wxfileInfo/delWxfileInfo",
      method: "GET",
      query: {
        fileUrl,
      },
      token: session.token,
    })
    return ok(unwrapSchoolWebResponse(response), "文件记录已删除")
  })
}
