import type { RootSiteConfig } from "@/lib/root-site-config"
import {
  type HomeColumnSummary,
  type HomeModuleSummary,
  type NavigationTreeNode,
  type PcHomeTemplate,
  type PublicSiteContext,
  type SchoolWebMessage,
  toColumnHref,
  toMessageHref,
  toModuleHref,
} from "@/lib/school-web-two"

const HOME_HERO_IMAGE_SRC = "https://cdnfile-10043692.file.myqcloud.com/productVersion/common/danyang/省丹中画册/view1.jpg"
const PRINCIPAL_AVATAR_SRC = "https://cdnfile-10043692.file.myqcloud.com/productVersion/common/danyang/省丹中画册/%E7%AC%AC32%E9%A1%B5-233.PNG"

export function normalizePublicImageUrl(url: string | null | undefined) {
  const value = String(url ?? "").trim()
  if (!value) return ""
  return value.replace(/^http:\/\/([^/]*picsh\.myqcloud\.com)/i, "https://$1")
}

const visualSectionConfig: Pick<RootSiteConfig, "book" | "features" | "stats" | "gallery" | "principal"> = {
  book: {
    title: "流金岁月-回忆篇",
    subtitle: "旧影流转，岁月成片",
    videoImage: "/view/view1.jpg",
    videoMoreText: "查看更多宣传片",
    videoMoreHref: "/about",
    historyText: "八十余年波澜壮阔的开拓史，犹如一首雄浑激越的进行曲。丹阳高级中学肇始于1941年，历经岁月洗礼，几易校址，数更其名。虽历烽火，弦歌不辍，薪火相传，桃李芬芳。",
    brochureImage: "/school_view/（提取图片）9.24省丹中画册-定稿/第20页-145.PNG",
    brochureText: "点击进入宣传册",
    brochureHref: "/about",
  },
  features: {
    eyebrow: "FEATURES",
    title: "办学特色",
    items: [
      { title: "大成教育", subtitle: "立德树人 · 全面发展", description: "以「成人、成才、成功」为育人目标，构建德智体美劳全面培养的教育体系，传承孔庙文脉，厚植家国情怀。", color: "from-[#8B1A1A] to-[#6B1010]", href: "/site/593" },
      { title: "创新培养", subtitle: "省首批试点学校", description: "作为江苏省首批创新人才培养试点学校，开设竞赛课程、研究性学习、STEM 教育等特色项目。", color: "from-[#D4AF37] to-[#B8942E]", href: "/site/596" },
      { title: "双高合作", subtitle: "名校直通", description: "与省内外优质高校建立深度合作，搭建学生进入高水平大学的成长通道。", color: "from-[#8B1A1A] to-[#6B1010]", href: "/site/595" },
      { title: "国际视野", subtitle: "多元发展平台", description: "开展国际交流项目，与海外名校建立合作关系，培养具有国际竞争力和跨文化交流能力的优秀人才。", color: "from-[#D4AF37] to-[#B8942E]", href: "/site/602" },
    ],
  },
  stats: {
    items: [
      { value: 85, suffix: "年", label: "办学历史", description: "弦歌不辍" },
      { value: 3000, suffix: "+", label: "在校学生", description: "青春向上" },
      { value: 290, suffix: "+", label: "教职工", description: "名师荟萃" },
      { value: 140, suffix: "+", label: "高级教师", description: "骨干引领" },
      { value: 90, suffix: "%", label: "连续多年本一率", description: "稳居高位" },
    ],
  },
  gallery: {
    eyebrow: "GALLERY",
    title: "校园风采",
    categories: ["全部", "校园风光", "文体活动", "学生风采", "教学场景"],
    moreHref: "/site/593",
    items: [
      { id: 1, category: "校园风光", title: "校园主入口航拍", image: "/school_view/（提取图片）9.24省丹中画册-定稿/第20页-145.PNG", type: "image" },
      { id: 2, category: "文体活动", title: "明镜映人主题活动", image: "/school_view/（提取图片）9.24省丹中画册-定稿/第25页-196.PNG", type: "video" },
      { id: 3, category: "学生风采", title: "实验课堂场景", image: "/bd/student-club.jpg", type: "image" },
      { id: 4, category: "教学场景", title: "现代化学习空间", image: "/school_view/（提取图片）9.24省丹中画册-定稿/第24页-188.PNG", type: "image" },
      { id: 5, category: "校园风光", title: "校园教学楼", image: "/school_view/（提取图片）9.24省丹中画册-定稿/第20页-143.PNG", type: "image" },
      { id: 6, category: "文体活动", title: "校园园林景观", image: "/school_view/（提取图片）9.24省丹中画册-定稿/第20页-146.PNG", type: "video" },
      { id: 7, category: "学生风采", title: "师生团队风采", image: "/bd/student-academy.jpg", type: "image" },
      { id: 8, category: "教学场景", title: "教师团队合影", image: "/school_view/（提取图片）9.24省丹中画册-定稿/第30页-219.PNG", type: "image" },
      { id: 9, category: "校园风光", title: "校园建筑视角", image: "/school_view/（提取图片）9.24省丹中画册-定稿/第20页-145.PNG", type: "video" },
    ],
  },
  principal: {
    title: "校长致辞",
    image: PRINCIPAL_AVATAR_SRC,
    name: "潘国良",
    role: "校长",
    paragraphs: [
      "欢迎来到江苏省丹阳高级中学！作为一所承载着八十余年历史底蕴的百年名校，我们始终秉承「大成教育」理念，以立德树人为根本，以培养全面发展的时代英才为使命。",
      "教育是点燃火焰，而非填满容器。我们相信每一位学生都有无限的潜能，在这里，你将遇到优秀的老师、志同道合的伙伴，收获知识、友谊和成长。",
      "愿每一位丹中学子，都能在这里找到属于自己的舞台，书写精彩的青春篇章！",
    ],
    signature: "大成教育 · 成就未来",
  },
}

const emptyRootSiteConfig: RootSiteConfig = {
  site: {
    name: "",
    englishName: "",
    logo: "",
    manageUrl: "/manage",
    seoTitle: "",
    seoDescription: "",
  },
  navigation: [],
  hero: {
    autoplayInterval: 3000,
    images: [{ src: HOME_HERO_IMAGE_SRC, alt: "江苏省丹阳高级中学国际交流栏目导航图" }],
  },
  news: {
    title: "新闻公告",
    categories: ["全部"],
    newsTitle: "新闻动态",
    announcementTitle: "通知公告",
    moreHref: "/news",
    items: [],
  },
  book: visualSectionConfig.book,
  features: visualSectionConfig.features,
  stats: visualSectionConfig.stats,
  gallery: visualSectionConfig.gallery,
  principal: visualSectionConfig.principal,
  footer: {
    address: "",
    phone: "",
    email: "",
    hours: "",
    quickLinks: [],
    socialLinks: [],
    copyright: "",
    icp: "",
    police: "",
    bottomLinks: [],
  },
}

function extractText(value: string) {
  const compact = value.replace(/\s+/g, " ").trim()
  return compact
}

function extractPhone(address: string) {
  return address.match(/电话[:：]\s*([0-9-]+)/)?.[1] ?? ""
}

function extractEmail(address: string) {
  return address.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? ""
}

function pickBannerImage(template: PcHomeTemplate) {
  void template
  return [HOME_HERO_IMAGE_SRC]
}

function moduleSummaryToNavItem(columnId: number, module: HomeModuleSummary) {
  const href = module.type === 4 && module.columnUrl
    ? module.columnUrl
    : toModuleHref(columnId, module.id)

  return {
    id: module.id,
    label: module.name,
    href,
    image: normalizePublicImageUrl(module.logoUrl),
    type: module.type,
    isVisible: true,
  }
}

function columnSummaryToHref(column: HomeColumnSummary) {
  return column.name === "国际交流" ? "/international" : toColumnHref(column.id)
}

export function buildNavigationTree(columns: HomeColumnSummary[]): NavigationTreeNode[] {
  return columns.map((column) => ({
    id: column.id,
    label: column.name,
    href: columnSummaryToHref(column),
    image: normalizePublicImageUrl(column.logoUrl),
    type: column.type,
    children: (column.moduleList ?? []).map((module) => moduleSummaryToNavItem(column.id, module)),
  }))
}

function messageToHomeNewsItem(moduleName: string, message: SchoolWebMessage) {
  const date = message.createTime?.slice(0, 10) || ""
  return {
    id: message.id,
    category: moduleName,
    title: message.title,
    summary: message.titleMark || "",
    date,
    views: message.readCount ?? 0,
    image: normalizePublicImageUrl(message.logoUrl),
    isTop: (message.setTop ?? -1) > 0,
    author: message.createUserName || "",
    content: message.content ?? "",
  }
}

export function findColumnById(columns: HomeColumnSummary[], columnId: number) {
  return columns.find((column) => column.id === columnId) ?? null
}

export function findModuleById(columns: HomeColumnSummary[], columnId: number, moduleId: number) {
  const column = findColumnById(columns, columnId)
  if (!column) return null
  const module = (column.moduleList ?? []).find((item) => item.id === moduleId) ?? null
  return module ? { column, module } : null
}

export function buildRootSiteConfigFromRemote(context: PublicSiteContext, template: PcHomeTemplate) {
  const setting = context.setting
  const navigation = buildNavigationTree(template.columnList)
  const primaryModules = template.columnList[0]?.moduleList ?? []
  const featuredModules = primaryModules.length > 0
    ? primaryModules
    : template.moduleList.flatMap((group) => group.moduleListJson)
  const newsItems = featuredModules.flatMap((module) =>
    (module.messageList ?? []).map((item) =>
      messageToHomeNewsItem(module.name, {
        id: item.id,
        webId: context.webId,
        schoolId: context.schoolId,
        title: item.title,
        titleMark: "",
        content: null,
        moduleIds: String(module.id),
        moduleNames: module.name,
        messageType: item.messageType,
        messageTypeName: item.messageType === 2 ? "链接类型" : "普通类型",
        state: 2,
        fileJson: "[]",
        logoUrl: normalizePublicImageUrl(item.logoUrl),
        messageUrl: item.messageUrl,
        mark: "",
        orderNo: 0,
        createTime: item.createTime,
        readCount: 0,
      })
    )
  )
  const quickLinks = template.columnList.slice(0, 4).map((column) => ({
    title: column.name,
    links: (column.moduleList ?? []).slice(0, 4).map((module) => ({
      label: module.name,
      href: module.type === 4 && module.columnUrl ? module.columnUrl : toModuleHref(column.id, module.id),
    })),
  }))

  const siteName = setting.webName || ""
  const copyrightName = setting.copyRight || setting.webName || ""

  return {
    ...emptyRootSiteConfig,
    site: {
      ...emptyRootSiteConfig.site,
      name: siteName,
      logo: setting.logoUrl || "",
      seoTitle: setting.keyWord || setting.webName || "",
      seoDescription: setting.description || "",
    },
    navigation: navigation.map((column) => ({
      label: column.label,
      href: column.href,
      image: column.image,
      subMenus: column.children.map((module) => ({
        label: module.label,
        href: module.href,
        children: [],
      })),
    })),
    hero: {
      autoplayInterval: Number(template.initJson.shufflingTime ?? 3) * 1000 || 3000,
      images: pickBannerImage(template).map((src, index) => ({
        src,
        alt: siteName ? `${siteName} 轮播图 ${index + 1}` : `轮播图 ${index + 1}`,
      })),
    },
    news: {
      ...emptyRootSiteConfig.news,
      categories: ["全部", ...primaryModules.map((item) => item.name)],
      newsTitle: primaryModules[0]?.name ?? "新闻动态",
      announcementTitle: primaryModules[1]?.name ?? "通知公告",
      moreHref: primaryModules[0] ? toModuleHref(template.columnList[0].id, primaryModules[0].id) : "/news",
      items: newsItems,
    },
    footer: {
      ...emptyRootSiteConfig.footer,
      address: extractText(setting.address),
      phone: extractPhone(setting.address),
      email: extractEmail(setting.address),
      quickLinks,
      copyright: copyrightName ? `© ${new Date().getFullYear()} ${copyrightName} 版权所有` : "",
      icp: setting.recodation || "",
      police: setting.postRecodation || "",
      bottomLinks: [
        { label: "网站首页", href: "/" },
        { label: "新闻中心", href: template.columnList[0] ? toColumnHref(template.columnList[0].id) : "/" },
        { label: "后台管理", href: "/manage" },
      ],
    },
  }
}
