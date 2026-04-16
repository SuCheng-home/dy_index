import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

const quickLinks = [
  {
    title: "学校概况",
    links: [
      { label: "学校简介", href: "/about" },
      { label: "校史沿革", href: "/about/history" },
      { label: "校园风光", href: "/about/campus" },
      { label: "组织机构", href: "/about/organization" },
    ],
  },
  {
    title: "招生信息",
    links: [
      { label: "招生简章", href: "/service/admission" },
      { label: "报名指南", href: "/service/admission" },
      { label: "历年分数", href: "/service/admission" },
      { label: "常见问题", href: "/service/admission" },
    ],
  },
  {
    title: "教学教研",
    links: [
      { label: "课程设置", href: "/teaching/curriculum" },
      { label: "教学动态", href: "/teaching" },
      { label: "名师工作室", href: "/teachers/studio" },
      { label: "教研成果", href: "/teaching/research" },
    ],
  },
  {
    title: "校园生活",
    links: [
      { label: "学生社团", href: "/moraledu/clubs" },
      { label: "校园活动", href: "/news" },
      { label: "心理健康", href: "/moraledu/mental" },
      { label: "后勤服务", href: "/service/logistics" },
    ],
  },
]

const socialLinks = [
  { name: "微信公众号", icon: "wechat", href: "/service/info" },
  { name: "官方微博", icon: "weibo", href: "/news" },
  { name: "校园APP", icon: "app", href: "/service/info" },
]

export function Footer() {
  return (
    <footer className="bg-[#2A0A0A]">
      {/* 主要内容区 */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* 学校信息 */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#8B1A1A] to-[#6B1010]">
                <span className="font-serif text-lg font-bold text-[#D4AF37]">丹</span>
              </div>
              <div>
                <div className="font-serif text-lg font-bold text-[#F5E6D3]">
                  江苏省丹阳高级中学
                </div>
                <div className="text-xs tracking-wider text-[#F5E6D3]/60">
                  JIANGSU DANYANG HIGH SCHOOL
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-[#F5E6D3]/80">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#D4AF37]" />
                <span>江苏省镇江市丹阳市新民西路138号</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-[#D4AF37]" />
                <span>0511-86522016（办公室）</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-[#D4AF37]" />
                <span>office@dygjzx.cn</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 flex-shrink-0 text-[#D4AF37]" />
                <span>工作日 8:00-17:30</span>
              </div>
            </div>

            {/* 社交媒体 */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3A1A1A] text-[#F5E6D3]/60 transition-all hover:bg-[#D4AF37] hover:text-[#2A0A0A]"
                  title={social.name}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    {social.icon === "wechat" && (
                      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.004-.268-.032-.406-.032zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
                    )}
                    {social.icon === "weibo" && (
                      <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.737 5.439l-.002.004zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.601.622.263.82.972.442 1.592zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.18.573h.014zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.64 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zm7.563-1.224c-.346-.105-.579-.18-.4-.649.388-.998.428-1.86.003-2.474-.793-1.149-2.96-1.092-5.451-.03 0 0-.78.34-.58-.275.378-1.208.32-2.22-.266-2.807-1.328-1.327-4.86.05-7.886 3.074C.816 11.729 0 14.122 0 16.161c0 3.907 5.016 6.285 9.92 6.285 6.427 0 10.698-3.731 10.698-6.694 0-1.787-1.506-2.801-2.56-3.103h.001zm2.754-7.612c-.926-1.025-2.29-1.59-3.838-1.59l-.147.003a.654.654 0 0 0-.633.678.655.655 0 0 0 .678.632l.123-.002c1.15 0 2.16.422 2.852 1.188a4.326 4.326 0 0 1 1.035 3.043.654.654 0 0 0 .617.688l.035.002a.654.654 0 0 0 .652-.616 5.6 5.6 0 0 0-1.374-4.026zm-2.258 1.605a2.96 2.96 0 0 0-2.222.03.654.654 0 0 0 .505 1.206 1.673 1.673 0 0 1 2.228 1.974.654.654 0 0 0 1.262.34 2.96 2.96 0 0 0-1.773-3.55z" />
                    )}
                    {social.icon === "app" && (
                      <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
                    )}
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* 快速链接 */}
          {quickLinks.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 font-serif font-bold text-[#D4AF37]">{section.title}</h4>
              <ul className="space-y-2">
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
              <p>© 2024 江苏省丹阳高级中学 版权所有</p>
              <p className="mt-1">
                <Link href="/about" className="hover:text-[#D4AF37]">
                  苏ICP备XXXXXXXX号-1
                </Link>
                {" · "}
                <Link href="/about" className="hover:text-[#D4AF37]">
                  苏公网安备XXXXXXXXXXXXX号
                </Link>
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="/about" className="hover:text-[#D4AF37]">
                网站地图
              </Link>
              <Link href="/service/info" className="hover:text-[#D4AF37]">
                隐私政策
              </Link>
              <Link href="/service/info" className="hover:text-[#D4AF37]">
                使用条款
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
