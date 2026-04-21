import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "班主任工作 | 江苏省丹阳高级中学",
}

const sidebarItems = [
  { label: "德育动态", href: "/moraledu" },
  { label: "心理健康", href: "/moraledu/mental" },
  { label: "班主任工作", href: "/moraledu/teacher" },
  { label: "学生社团", href: "/moraledu/clubs" },
  { label: "社会实践", href: "/moraledu/practice" },
]

const news = [
  {
    id: 1,
    title: "班主任基本功大赛落幕",
    date: "2026-04-03",
    image: "/view/view6.jpg",
    summary: "为提升班主任专业素养和管理能力，我校举办了年度班主任基本功大赛。经过主题班会设计、教育叙事、情景模拟等环节的激烈角逐，多位班主任脱颖而出，展现了扎实的育人功底。",
  },
  {
    id: 2,
    title: "优秀班主任经验交流会",
    date: "2026-03-25",
    image: "/view/view7.jpg",
    summary: "学校德育处组织召开优秀班主任经验交流会，邀请多位资深班主任分享带班智慧。内容涉及班级文化建设、家校沟通策略、后进生转化等实践经验，为全体班主任提供了宝贵借鉴。",
  },
  {
    id: 3,
    title: "新班主任上岗培训圆满完成",
    date: "2026-03-12",
    image: "/view/view2.jpg",
    summary: "为帮助新任班主任尽快适应岗位要求，学校开展了为期一周的新班主任上岗培训。培训涵盖班级管理制度建设、学生心理特征分析、主题班会设计等内容，采用专家讲座与导师带教相结合的方式。",
  },
]

export default function TeacherPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="班主任工作"
        breadcrumbs={[{ label: "德育之窗", href: "/moraledu" }, { label: "班主任工作" }]}
        sidebarItems={sidebarItems}
        activePath="/moraledu/teacher"
      >
        <div className="mb-10">
          <p className="leading-relaxed text-[#555]">
            班主任是学校德育工作的核心力量。我校高度重视班主任队伍建设，通过班主任沙龙、德育培训、带班智慧分享等形式，不断提升班主任的专业素养和育人能力。学校建立了完善的班主任考核激励机制，定期评选表彰优秀班主任，营造比学赶超的良好氛围。
          </p>
        </div>

        <h3 className="mb-6 text-xl font-bold text-[#333]">班主任工作动态</h3>
        <div className="flex flex-col gap-5">
          {news.map((item) => (
            <Link key={item.id} href={`/news/${item.id}`} className="group flex flex-col gap-5 rounded-xl bg-[#F8F4ED] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:flex-row">
              <div className="relative h-48 w-full overflow-hidden rounded-lg sm:h-36 sm:w-52 flex-shrink-0">
                <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h4 className="mb-2 text-lg font-bold text-[#333] transition-colors group-hover:text-[#8B1A1A]">{item.title}</h4>
                  <p className="line-clamp-2 text-sm text-[#666]">{item.summary}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-[#999]"><Calendar className="h-3.5 w-3.5" />{item.date}</span>
                  <span className="flex items-center gap-1 text-sm text-[#8B1A1A] opacity-0 transition-opacity group-hover:opacity-100">阅读更多<ArrowRight className="h-4 w-4" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </SubPageLayout>
      <Footer />
    </>
  )
}
