import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "名师工作室 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学名师工作室，名师引领促进教师专业成长",
}

const sidebarItems = [
  { label: "师资队伍", href: "/teachers" },
  { label: "名师工作室", href: "/teachers/studio" },
  { label: "教师培训", href: "/teachers/training" },
  { label: "教研成果", href: "/teachers/achievements" },
]

const news = [
  {
    id: 4,
    title: "王建华语文名师工作室开展古诗词教学专题研讨",
    date: "2026-04-06",
    image: "/placeholder-user.jpg",
    summary:
      "王建华语文名师工作室围绕“高中古诗词深度阅读教学”主题，组织工作室成员及青年教师开展课堂观摩与专题研讨，探索古诗词教学的新路径。",
  },
  {
    id: 5,
    title: "李芳数学名师工作室赴南京参加省级教研交流",
    date: "2026-04-01",
    image: "/placeholder-user.jpg",
    summary: "李芳数学名师工作室一行8人赴南京师范大学附属中学，参加江苏省高中数学核心素养教学研讨会，与省内名校教师深入交流数学教学经验。",
  },
  {
    id: 6,
    title: "陈伟英语名师工作室举办读写结合教学展示活动",
    date: "2026-03-25",
    image: "/placeholder-user.jpg",
    summary:
      "陈伟英语名师工作室举办“以读促写、读写融合”教学展示活动，三位工作室成员分别展示了精心设计的读写结合课堂，获得与会专家一致好评。",
  },
]

export default function StudioPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="名师工作室"
        subtitle="Master Teacher Studio"
        breadcrumbs={[{ label: "教师发展", href: "/teachers" }, { label: "名师工作室" }]}
        sidebarItems={sidebarItems}
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            学校现设有省级名师工作室3个、市级名师工作室6个，涵盖语文、数学、英语、物理等主要学科。名师工作室以学科带头人为核心，通过课题研究、课堂观摩、教学沙龙等形式，充分发挥名师示范引领作用，带动一批青年教师快速成长，形成了"名师领航、团队协作、共同发展"的良好格局。
          </p>
          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              工作室动态
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
