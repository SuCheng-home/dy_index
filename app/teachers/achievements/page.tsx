import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "教研成果 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学教研成果展示，记录教师科研创新硕果",
}

const sidebarItems = [
  { label: "师资队伍", href: "/teachers" },
  { label: "名师工作室", href: "/teachers/studio" },
  { label: "教师培训", href: "/teachers/training" },
  { label: "教研成果", href: "/teachers/achievements" },
]

const news = [
  {
    id: 10,
    title: "我校三项省级教育科学规划课题顺利结题",
    date: "2026-04-07",
    image: "/placeholder-user.jpg",
    summary:
      "经江苏省教育科学规划领导小组办公室组织专家评审，我校申报的三项省级“十四五”教育科学规划课题全部顺利通过结题验收，研究成果获专家组高度评价。",
  },
  {
    id: 11,
    title: "教师论文在全国核心期刊发表量再创新高",
    date: "2026-03-29",
    image: "/placeholder-user.jpg",
    summary: "2025年度，我校教师在《中学数学教学参考》《中学语文教学》等全国核心期刊共发表学术论文42篇，同比增长15%，论文发表数量和质量均位列镇江市前茅。",
  },
  {
    id: 12,
    title: "物理教研组校本课程获省级精品课程认定",
    date: "2026-03-20",
    image: "/placeholder-user.jpg",
    summary: "我校物理教研组开发的《趣味物理实验与科技创新》校本课程，经省教育厅评审认定为江苏省普通高中精品校本课程，成为我校第四门获此殊荣的校本课程。",
  },
]

export default function AchievementsPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="教研成果"
        subtitle="Research Achievements"
        breadcrumbs={[{ label: "教师发展", href: "/teachers" }, { label: "教研成果" }]}
        sidebarItems={sidebarItems}
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            学校坚持"科研兴校"战略，鼓励教师积极参与教育科研。近五年来，学校承担国家级课题2项、省级课题18项、市级课题36项，教师发表核心期刊论文200余篇，出版教育专著12部，获省市级教学成果奖30余项，形成了浓厚的教育科研氛围。
          </p>
          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              最新成果
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
