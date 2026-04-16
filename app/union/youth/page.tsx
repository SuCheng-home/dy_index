import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "团委工作 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学共青团工作与学生活动资讯",
}

const sidebarItems = [
  { label: "工会活动", href: "/union" },
  { label: "团委工作", href: "/union/youth" },
  { label: "学生会", href: "/union/student" },
  { label: "关工委", href: "/union/elderly" },
]

const news = [
  {
    id: 601,
    title: "“青春心向党”主题团日系列活动启动",
    date: "2026-04-05",
    image: "/view/view5.jpg",
    summary: "各团支部通过微团课、志愿服务与红色研学，引导团员坚定理想信念。",
  },
  {
    id: 602,
    title: "校园文化艺术节团委专场展演举行",
    date: "2026-03-31",
    image: "/view/view4.jpg",
    summary: "合唱、舞蹈与原创短剧同台献艺，展现团员青年的创造力与团队精神。",
  },
  {
    id: 603,
    title: "新团员入团仪式暨团校结业典礼",
    date: "2026-03-24",
    image: "/view/view6.jpg",
    summary: "宣读入团誓词，表彰优秀学员，勉励新团员在学习和实践中发挥先锋模范作用。",
  },
]

export default function UnionYouthPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="团委工作"
        subtitle="Youth League Work"
        breadcrumbs={[{ label: "统群工作", href: "/union" }, { label: "团委工作" }]}
        sidebarItems={sidebarItems}
        bannerImage="/view/view1.jpg"
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            校团委围绕立德树人根本任务，加强团员教育与管理，开展思想引领、社会实践与校园文化活动。通过团校、主题团日与志愿服务等阵地，团结带领广大团员青年听党话、跟党走，在成长成才中书写青春篇章。
          </p>
          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              团委动态
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
