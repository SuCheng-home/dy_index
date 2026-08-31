import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { type RootSiteConfig } from "@/lib/root-site-config"
import { SCHOOL_ADDRESS } from "@/lib/site-constants"

const defaultQuickLinks = [
  {
    title: "学校概况",
    links: [
      { label: "学校简介", href: "/site/593/1142" },
      { label: "校史长廊", href: "/site/593/1145" },
      { label: "名师风采", href: "/site/593/1144" },
      { label: "校园新闻", href: "/site/592/1139" },
    ],
  },
  {
    title: "招生信息",
    links: [
      { label: "招生招聘", href: "/site/598/1154" },
      { label: "通知公告", href: "/site/592/1140" },
      { label: "公共信息", href: "/site/592/1141" },
    ],
  },
  {
    title: "教学教研",
    links: [
      { label: "教学工作", href: "/site/595" },
      { label: "教育科研", href: "/site/596" },
      { label: "教研组之窗", href: "/site/595/1149" },
      { label: "教师发展", href: "/site/596/1153" },
    ],
  },
  {
    title: "校园生活",
    links: [
      { label: "学生发展", href: "/site/594" },
      { label: "校园之星", href: "/site/594/1147" },
      { label: "社团专栏", href: "/site/599" },
      { label: "教工之家", href: "/site/601" },
    ],
  },
]

/** 地址等联系文本：括号部分换行展示 */
function ContactText({ text }: { text: string }) {
  const full = text.indexOf("（")
  const half = text.indexOf("(")
  let breakIndex = -1
  if (full !== -1 && half !== -1) breakIndex = Math.min(full, half)
  else if (full !== -1) breakIndex = full
  else if (half !== -1) breakIndex = half
  if (breakIndex <= 0) return <>{text}</>
  return (
    <>
      {text.slice(0, breakIndex)}
      <br />
      {text.slice(breakIndex)}
    </>
  )
}

export function Footer({ config }: { config?: RootSiteConfig }) {
  const site = config?.site
  const footer = config?.footer
  const quickLinks = footer?.quickLinks?.length ? footer.quickLinks : defaultQuickLinks
  const contactItems = [
    { icon: MapPin, text: footer?.address || SCHOOL_ADDRESS },
    { icon: Phone, text: footer?.phone || "0511-86522062" },
    { icon: Mail, text: footer?.email || "sdygjzx@163.com" },
    { icon: Clock, text: footer?.hours || "工作日 8:00-17:30" },
  ].filter(Boolean) as { icon: typeof MapPin; text: string }[]
  const bottomLinks = (footer?.bottomLinks?.length ? footer.bottomLinks : [
    { label: "网站地图", href: "/site/593" },
    { label: "新闻中心", href: "/site/592" },
  ]).filter((link) => link.href !== "/manage" && link.label !== "后台管理")

  return (
    <footer className="bg-[#2A0A0A]">
      {/* 主要内容区 */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-5 lg:gap-12">
          {/* 联系信息 */}
          <div className="col-span-2 lg:col-span-2">
            {contactItems.length > 0 ? (
              <div className="space-y-3 text-sm text-[#F5E6D3]/80">
                {contactItems.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#D4AF37]" />
                    <span className="min-w-0 break-words leading-6 [overflow-wrap:anywhere]">
                      <ContactText text={text} />
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* 快速链接 */}
          {quickLinks.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 font-serif font-bold text-[#D4AF37]">{section.title}</h4>
              <ul className="space-y-2 break-words">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#F5E6D3]/70 transition-colors hover:text-[#D4AF37]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 底部版权信息 */}
      <div className="border-t border-[#3A1A1A]">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-[#F5E6D3]/50 md:flex-row md:text-left">
            <div>
              <p>{footer?.copyright || `© ${new Date().getFullYear()} ${site?.name || "江苏省丹阳高级中学"} 版权所有`}</p>
              {footer?.icp || footer?.police ? (
                <p className="mt-1">
                  {footer.icp ? (
                    <Link href="/" className="hover:text-[#D4AF37]">
                      {footer.icp}
                    </Link>
                  ) : null}
                  {footer.icp && footer.police ? " · " : null}
                  {footer.police ? (
                    <Link href="/" className="hover:text-[#D4AF37]">
                      {footer.police}
                    </Link>
                  ) : null}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:justify-end">
              {bottomLinks.map((link) => (
                <Link key={link.label} href={link.href} className="hover:text-[#D4AF37]">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
