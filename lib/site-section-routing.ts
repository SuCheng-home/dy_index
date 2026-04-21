import { mainNavItems } from "@/components/shared/nav-data"

export type SiteVariant = "qh" | "bd"

export type SectionRouteInfo = {
  section: string
  parentLabel: string
  subLabel: string
  children: string[]
}

const SECTION_ALIASES: Record<string, string> = {
  校长致辞: "学校简介",
  校训校风: "校歌校训",
  课程体系: "课程改革",
  学科建设: "教研组建设",
  教学成果: "科研教学处",
  教研动态: "教学动态",
  高中招生: "招生咨询",
  国际部招生: "国际课程",
  人才招聘: "学校发展中心",
  校历查询: "学校简介",
  邮箱系统: "信息中心",
  门户登录: "学校保障中心",
  校园风貌: "校园风光",
  教育科研: "科研教学处",
  情系母校: "荣誉殿堂",
  招生专栏: "招生咨询",
  智校平台: "信息中心",
}

export function normalizeSection(section: string) {
  try {
    const decoded = decodeURIComponent(section)
    return SECTION_ALIASES[decoded] ?? decoded
  } catch {
    return SECTION_ALIASES[section] ?? section
  }
}

export function findSectionRouteInfo(section: string): SectionRouteInfo | null {
  const normalized = normalizeSection(section)

  for (const parent of mainNavItems) {
    for (const sub of parent.subMenus) {
      if (sub.label === normalized) {
        return {
          section: normalized,
          parentLabel: parent.label,
          subLabel: sub.label,
          children: sub.children ?? [],
        }
      }
    }
  }

  return null
}

export function getAllSectionParams() {
  return mainNavItems.flatMap((parent) => parent.subMenus.map((sub) => ({ section: sub.label })))
}

export function toSiteSectionPath(site: SiteVariant, section: string) {
  return `/${site}/${normalizeSection(section)}`
}
