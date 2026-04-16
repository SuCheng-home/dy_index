import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "招生信息 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学招生信息，包括招生政策、报名流程、录取标准和招生动态。",
}

const sidebarItems = [
  { label: "招生信息", href: "/service/admission" },
  { label: "后勤服务", href: "/service/logistics" },
  { label: "图书馆", href: "/service/library" },
  { label: "信息中心", href: "/service/info" },
]

const news = [
  {
    id: 311,
    title: "2026年招生简章正式发布",
    date: "2026-04-06",
    image: "/view/view8.jpg",
    summary: "江苏省丹阳高级中学2026年秋季招生简章正式发布，今年计划招收高一新生800名，其中包含创新实验班、强基计划班等多种班型。",
  },
  {
    id: 312,
    title: "校园开放日活动圆满举行",
    date: "2026-03-30",
    image: "/view/view7.jpg",
    summary: "学校举办2026年春季校园开放日活动，近2000名初三学生及家长走进校园，实地参观教学设施、体验特色课程、与名师面对面交流。",
  },
  {
    id: 313,
    title: "招生咨询会在丹阳市体育馆举行",
    date: "2026-03-22",
    image: "/view/view3.jpg",
    summary: "学校招生办参加丹阳市中招咨询会，现场解答考生和家长关于招生政策、志愿填报、特长生招录等方面的疑问，受到广泛好评。",
  },
]

export default function AdmissionPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="招生信息"
        subtitle="Admission Information"
        breadcrumbs={[{ label: "校园服务", href: "/service" }, { label: "招生信息" }]}
        sidebarItems={sidebarItems}
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            江苏省丹阳高级中学作为江苏省四星级高中，每年面向丹阳市及周边地区招收优秀初中毕业生。学校秉持"公开、公平、公正"的招生原则，严格执行上级教育主管部门的招生政策，为广大考生提供透明、规范的招生服务。学校设有创新实验班、强基计划班等特色班型，满足不同层次学生的发展需求。
          </p>

          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              招生动态
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
