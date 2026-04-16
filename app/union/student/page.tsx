import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "学生会 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学学生会工作与学生自治活动资讯",
}

const sidebarItems = [
  { label: "工会活动", href: "/union" },
  { label: "团委工作", href: "/union/youth" },
  { label: "学生会", href: "/union/student" },
  { label: "关工委", href: "/union/elderly" },
]

const news = [
  {
    id: 611,
    title: "学生会换届大会顺利举行",
    date: "2026-04-06",
    image: "/view/view5.jpg",
    summary: "大会选举产生新一届学生会干部，明确了“服务同学、锻炼自我、协同共进”的工作方向。",
  },
  {
    id: 612,
    title: "学生会发起文明校园倡议行动",
    date: "2026-04-02",
    image: "/view/view3.jpg",
    summary: "围绕课堂纪律、环境卫生与礼仪规范开展文明倡议周活动，营造积极向上的校园文化氛围。",
  },
  {
    id: 613,
    title: "食堂满意度调研与改进建议发布",
    date: "2026-03-27",
    image: "/view/view3.jpg",
    summary: "学生会生活部组织问卷调研并召开协商会议，推动餐品结构优化与就餐秩序改进。",
  },
]

export default function UnionStudentPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="学生会"
        subtitle="Student Union"
        breadcrumbs={[{ label: "统群工作", href: "/union" }, { label: "学生会" }]}
        sidebarItems={sidebarItems}
        bannerImage="/view/view5.jpg"
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            学生会是学校开展学生自治与服务的重要组织。围绕学习支持、校园文化、权益维护与志愿服务等方面，学生会积极搭建师生沟通桥梁，推动学生在参与中成长，在实践中提升责任意识和组织能力。
          </p>
          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              学生会动态
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
