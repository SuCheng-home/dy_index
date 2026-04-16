import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "信息中心 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学信息中心，负责校园信息化建设、网络维护和技术支持服务。",
}

const sidebarItems = [
  { label: "招生信息", href: "/service/admission" },
  { label: "后勤服务", href: "/service/logistics" },
  { label: "图书馆", href: "/service/library" },
  { label: "信息中心", href: "/service/info" },
]

const news = [
  {
    id: 341,
    title: "校园无线网络全覆盖工程竣工",
    date: "2026-04-04",
    image: "/view/view2.jpg",
    summary: "信息中心完成校园无线网络全覆盖工程，部署Wi-Fi 6接入点280个，实现教学楼、图书馆、宿舍区等区域高速无线网络全覆盖。",
  },
  {
    id: 342,
    title: "教师信息技术应用能力培训圆满结束",
    date: "2026-03-27",
    image: "/view/view8.jpg",
    summary: "信息中心组织全校教师开展为期一周的信息技术应用能力提升培训，内容涵盖智慧课堂操作、在线教学平台使用和数字资源制作等。",
  },
  {
    id: 343,
    title: "学校官网及微信公众号全新改版上线",
    date: "2026-03-19",
    image: "/view/view2.jpg",
    summary: "信息中心完成学校官方网站和微信公众号的全面改版升级，新版界面更加美观大方，功能更加完善，信息发布更加及时便捷。",
  },
]

export default function InfoCenterPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="信息中心"
        subtitle="Information Center"
        breadcrumbs={[{ label: "校园服务", href: "/service" }, { label: "信息中心" }]}
        sidebarItems={sidebarItems}
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            信息中心是学校信息化建设的核心部门，承担着校园网络建设与维护、教育信息化推进、数字化教学资源开发和技术支持服务等重要职责。中心拥有一支专业的技术团队，致力于推动学校教育现代化进程，打造智慧校园。
          </p>

          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              信息中心动态
            </h3>
            <div className="grid gap-6">
              {news.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="group flex flex-col gap-5 rounded-xl bg-[#F8F4ED] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:flex-row"
                >
                  <div className="relative h-48 w-full flex-shrink-0 overflow-hidden rounded-lg sm:h-36 sm:w-52">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h4 className="mb-2 text-lg font-bold text-[#333] transition-colors group-hover:text-[#8B1A1A]">
                        {item.title}
                      </h4>
                      <p className="line-clamp-2 text-sm text-[#666]">{item.summary}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs text-[#999]">
                        <Calendar className="h-3.5 w-3.5" />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-[#8B1A1A] opacity-0 transition-opacity group-hover:opacity-100">
                        阅读更多
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </SubPageLayout>
      <Footer />
    </>
  )
}
