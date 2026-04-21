import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "后勤服务 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学后勤服务，包括校园餐饮、学生住宿、医疗保健和安全保障。",
}

const sidebarItems = [
  { label: "招生信息", href: "/service/admission" },
  { label: "后勤服务", href: "/service/logistics" },
  { label: "图书馆", href: "/service/library" },
  { label: "信息中心", href: "/service/info" },
]

const news = [
  {
    id: 321,
    title: "食堂改造升级工程顺利竣工",
    date: "2026-04-03",
    image: "/view/view6.jpg",
    summary: "学校第二食堂改造升级工程全面完工，新增自助餐区域和特色窗口，就餐环境焕然一新，可同时容纳1200名师生用餐。",
  },
  {
    id: 322,
    title: "春季校园绿化美化工作全面展开",
    date: "2026-03-25",
    image: "/view/view5.jpg",
    summary: "后勤部门组织开展春季校园绿化美化工作，新栽种各类花木500余株，修剪草坪绿篱3000平方米，校园环境更加优美宜人。",
  },
  {
    id: 323,
    title: "学生宿舍热水系统改造完成",
    date: "2026-03-18",
    image: "/view/view6.jpg",
    summary: "学校投资120万元对学生宿舍热水供应系统进行全面升级改造，采用空气能热泵技术，实现24小时恒温热水供应，改善住宿条件。",
  },
]

export default function LogisticsPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="后勤服务"
        subtitle="Logistics Services"
        breadcrumbs={[{ label: "校园服务", href: "/service" }, { label: "后勤服务" }]}
        sidebarItems={sidebarItems}
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            学校后勤服务保障部门始终坚持"服务育人、管理育人"的工作理念，为全校师生提供安全、舒适、便捷的校园生活保障。部门下设餐饮管理中心、物业管理中心、基建维修中心和安全保卫中心，全力打造高品质的校园后勤服务体系。
          </p>

          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              后勤动态
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
