import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "教学研究 | 江苏省丹阳高级中学",
}

const sidebarItems = [
  { label: "教学动态", href: "/teaching" },
  { label: "课程建设", href: "/teaching/curriculum" },
  { label: "教学研究", href: "/teaching/research" },
  { label: "考试管理", href: "/teaching/exam" },
  { label: "学业评价", href: "/teaching/evaluation" },
]

const news = [
  {
    id: 1,
    title: "我校三项省级课题顺利开题",
    date: "2026-04-04",
    image: "/view/view3.jpg",
    summary:
      "江苏省教育科学“十四五”规划课题开题论证会在我校举行，我校申报的三项省级课题顺利通过专家组论证。课题涵盖学科核心素养培育、信息技术与教学融合、跨学科主题学习等前沿领域。",
  },
  {
    id: 2,
    title: "教研组集体备课展示活动精彩纷呈",
    date: "2026-03-24",
    image: "/view/view6.jpg",
    summary: "为推动教研组建设，学校开展了集体备课展示活动。各教研组围绕新课标、新教材，精心设计备课流程，展示了说课、磨课、议课等环节，促进了教师间的教学智慧共享与专业成长。",
  },
  {
    id: 3,
    title: "我校教师论文在核心期刊发表",
    date: "2026-03-11",
    image: "/view/view7.jpg",
    summary: "近期我校多位教师的教学研究论文在《中学数学教学参考》《中学语文教学》等核心期刊上发表，充分展现了我校教师的教研能力和学术水平，为学校教科研工作增添了新的亮点。",
  },
]

export default function ResearchPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="教学研究"
        breadcrumbs={[{ label: "教学管理", href: "/teaching" }, { label: "教学研究" }]}
        sidebarItems={sidebarItems}
        activePath="/teaching/research"
      >
        <div className="mb-10">
          <p className="leading-relaxed text-[#555]">
            我校坚持"科研兴校、教研强师"的发展战略，积极承担省市级课题研究，定期组织教研组活动和学术交流。学校鼓励教师在教学实践中发现问题、研究问题、解决问题，形成了"以研促教、以教助研"的良好学术氛围，教师论文发表和课题研究成果丰硕。
          </p>
        </div>

        <h3 className="mb-6 text-xl font-bold text-[#333]">教研动态</h3>
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
