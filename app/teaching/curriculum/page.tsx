import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "课程建设 | 江苏省丹阳高级中学",
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
    title: "新学期特色选修课程精彩亮相",
    date: "2026-04-07",
    image: "/view/view7.jpg",
    summary: "本学期我校新开设人工智能基础、传统文化经典研读、生活中的化学等12门特色选修课程，同学们通过网上选课系统自主选择，首日选课通道开放后即被一抢而空，充分体现了课程的吸引力。",
  },
  {
    id: 2,
    title: "国家课程校本化实施研讨会召开",
    date: "2026-03-26",
    image: "/view/view3.jpg",
    summary: "学校教务处组织各学科教研组长召开国家课程校本化实施研讨会，围绕新课标要求，研究如何结合校情学情对国家课程进行二次开发，形成具有丹中特色的课程实施方案。",
  },
  {
    id: 3,
    title: "分层教学改革阶段性成果显著",
    date: "2026-03-14",
    image: "/view/view1.jpg",
    summary: "经过一个学期的实践探索，我校在数学、英语等学科推行的分层教学改革取得阶段性成效。数据显示，各层次学生的学业成绩均有不同程度提升，学习自信心和课堂参与度明显增强。",
  },
]

export default function CurriculumPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="课程建设"
        breadcrumbs={[{ label: "教学管理", href: "/teaching" }, { label: "课程建设" }]}
        sidebarItems={sidebarItems}
        activePath="/teaching/curriculum"
      >
        <div className="mb-10">
          <p className="leading-relaxed text-[#555]">
            我校坚持"国家课程校本化、校本课程特色化"的课程建设理念，在全面落实国家课程方案的基础上，积极开发特色选修课程，推进分层教学改革。学校构建了"基础+拓展+研究"三级课程体系，满足不同层次学生的发展需求，努力为每一位学生提供适合的教育。
          </p>
        </div>

        <h3 className="mb-6 text-xl font-bold text-[#333]">课程建设动态</h3>
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
