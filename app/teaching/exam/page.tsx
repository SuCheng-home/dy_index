import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "考试管理 | 江苏省丹阳高级中学",
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
    title: "期中考试质量分析会顺利召开",
    date: "2026-04-06",
    image: "/view/view7.jpg",
    summary: "学校教务处组织各年级召开期中考试质量分析会，各备课组对考试数据进行了详细分析，查找教学薄弱环节，制定针对性改进措施，力争在下阶段教学中实现精准提质。",
  },
  {
    id: 2,
    title: "规范命题研讨会提升试题质量",
    date: "2026-03-28",
    image: "/view/view3.jpg",
    summary: "为进一步提高校内考试命题水平，学校邀请市教研室专家到校指导，围绕新高考命题趋势、核心素养导向的试题设计等主题开展专题研讨，帮助教师提升命题能力和试题质量。",
  },
  {
    id: 3,
    title: "诚信考试教育活动全面开展",
    date: "2026-03-16",
    image: "/view/view5.jpg",
    summary: "考前一周，学校在全校范围内开展诚信考试主题教育活动。通过国旗下讲话、主题班会、签订诚信承诺书等形式，引导学生端正考试态度，营造公平公正的考试环境。",
  },
]

export default function ExamPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="考试管理"
        breadcrumbs={[{ label: "教学管理", href: "/teaching" }, { label: "考试管理" }]}
        sidebarItems={sidebarItems}
        activePath="/teaching/exam"
      >
        <div className="mb-10">
          <p className="leading-relaxed text-[#555]">
            我校建立了科学规范的考试管理体系，涵盖命题审核、考务组织、阅卷评分、质量分析等各个环节。学校注重发挥考试的诊断与反馈功能，通过大数据分析为教学改进提供依据，同时坚持诚信考试教育，培养学生诚实守信的良好品质。
          </p>
        </div>

        <h3 className="mb-6 text-xl font-bold text-[#333]">考试管理动态</h3>
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
