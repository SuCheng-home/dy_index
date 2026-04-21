import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "校园服务 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学校园服务，包括招生信息、后勤服务、图书馆和信息中心等综合服务平台。",
}

const sidebarItems = [
  { label: "招生信息", href: "/service/admission" },
  { label: "后勤服务", href: "/service/logistics" },
  { label: "图书馆", href: "/service/library" },
  { label: "信息中心", href: "/service/info" },
]

const serviceLinks = [
  { label: "招生信息", href: "/service/admission", desc: "了解学校招生政策、报名流程和历年录取情况" },
  { label: "后勤服务", href: "/service/logistics", desc: "校园餐饮、住宿、医疗和安全保障等后勤服务" },
  { label: "图书馆", href: "/service/library", desc: "致远图书馆资源查询、借阅服务和电子阅览" },
  { label: "信息中心", href: "/service/info", desc: "校园网络、信息化建设和技术支持服务" },
]

const news = [
  {
    id: 301,
    title: "2026年春季校园安全大检查顺利完成",
    date: "2026-04-05",
    image: "/view/view6.jpg",
    summary: "学校组织后勤、安保等部门对校园设施设备进行全面安全检查，确保师生安全。检查涵盖消防设施、用电安全、食品卫生等多个方面。",
  },
  {
    id: 302,
    title: "智慧校园二期项目正式启动",
    date: "2026-03-28",
    image: "/view/view5.jpg",
    summary: "学校信息中心联合多家技术企业，启动智慧校园二期建设项目，将实现校园管理、教学资源和家校互动的全面数字化升级。",
  },
  {
    id: 303,
    title: "图书馆新增5000册图书投入使用",
    date: "2026-03-20",
    image: "/view/view2.jpg",
    summary: "致远图书馆新采购的5000册各类图书已完成编目上架工作，涵盖文学、科学、历史等多个领域，进一步丰富了馆藏资源。",
  },
]

export default function ServicePage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="校园服务"
        subtitle="Campus Services"
        breadcrumbs={[{ label: "校园服务" }]}
        sidebarItems={sidebarItems}
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            江苏省丹阳高级中学致力于为全校师生提供优质、高效的校园服务。学校设有招生信息中心、后勤服务保障部门、致远图书馆和现代化信息中心，构建了完善的服务体系，全力保障教育教学工作的顺利开展。
          </p>

          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              服务导航
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {serviceLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group block rounded-lg border-l-4 border-[#8B1A1A] bg-[#F8F4ED] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <h4 className="mb-2 text-lg font-bold text-[#333] transition-colors group-hover:text-[#8B1A1A]">
                    {item.label}
                  </h4>
                  <p className="text-sm text-[#666]">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              服务动态
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
