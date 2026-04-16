import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "海外研学 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学海外研学项目，组织学生赴海外进行学习考察和文化体验。",
}

const sidebarItems = [
  { label: "国际交流", href: "/international" },
  { label: "海外研学", href: "/international/study" },
  { label: "合作项目", href: "/international/projects" },
  { label: "外教风采", href: "/international/teachers" },
]

const news = [
  {
    id: 411,
    title: "2026年暑期英国牛津研学营开始报名",
    date: "2026-04-06",
    image: "/view/view3.jpg",
    summary: "学校2026年暑期英国牛津研学营正式启动报名，为期两周的研学行程包括牛津大学课程体验、伦敦文化考察和英式寄宿家庭生活。",
  },
  {
    id: 412,
    title: "日本科技研学团圆满归来",
    date: "2026-03-28",
    image: "/view/view3.jpg",
    summary: "我校30名学生组成的日本科技研学团顺利完成为期10天的研学之旅，先后参访了东京大学、筑波科学城和丰田汽车博物馆等。",
  },
  {
    id: 413,
    title: "新加坡STEM研学项目成果汇报展",
    date: "2026-03-16",
    image: "/view/view1.jpg",
    summary: "参加新加坡STEM研学项目的同学举办成果汇报展，展示了在新加坡国立大学实验室完成的科研课题和学习收获，受到师生好评。",
  },
]

export default function StudyAbroadPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="海外研学"
        subtitle="Study Abroad Programs"
        breadcrumbs={[{ label: "国际教育", href: "/international" }, { label: "海外研学" }]}
        sidebarItems={sidebarItems}
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            学校积极组织开展海外研学活动，每年寒暑假期间组织优秀学生赴美国、英国、日本、新加坡等国家开展研学旅行。研学项目注重学术体验与文化浸润相结合，帮助学生开拓国际视野、提升综合素养、增强跨文化交际能力。
          </p>

          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              研学动态
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
