import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "学业评价 | 江苏省丹阳高级中学",
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
    title: "综合素质评价系统正式上线运行",
    date: "2026-04-05",
    image: "/view/view5.jpg",
    summary: "我校自主研发的学生综合素质评价系统正式上线。该系统覆盖思想品德、学业水平、身心健康、艺术素养、社会实践五个维度，实现了评价数据的电子化采集和智能化分析。",
  },
  {
    id: 2,
    title: "过程性评价改革试点工作稳步推进",
    date: "2026-03-23",
    image: "/view/view3.jpg",
    summary: "作为镇江市过程性评价改革试点校，我校在高一年级率先开展课堂表现、作业完成、实验操作等多维度的过程性评价，将学生日常学习表现纳入学业评价体系，促进学生全面发展。",
  },
  {
    id: 3,
    title: "学业水平质量监测报告发布",
    date: "2026-03-09",
    image: "/view/view5.jpg",
    summary: "学校发布2025—2026学年度第一学期学业水平质量监测报告，从学科成绩、增值评价、学习品质等角度全面呈现各年级教学质量状况，为后续教学决策提供了科学数据支撑。",
  },
]

export default function EvaluationPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="学业评价"
        breadcrumbs={[{ label: "教学管理", href: "/teaching" }, { label: "学业评价" }]}
        sidebarItems={sidebarItems}
        activePath="/teaching/evaluation"
      >
        <div className="mb-10">
          <p className="leading-relaxed text-[#555]">
            我校积极推进学业评价改革，构建了"过程性评价+终结性评价+综合素质评价"的多元评价体系。学校借助信息化手段，建立学生成长档案和学业质量监测系统，关注学生的全面发展和个性成长，让评价真正成为促进学生学习、改进教师教学的有效工具。
          </p>
        </div>

        <h3 className="mb-6 text-xl font-bold text-[#333]">学业评价动态</h3>
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
