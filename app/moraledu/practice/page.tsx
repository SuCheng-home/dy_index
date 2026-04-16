import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "社会实践 | 江苏省丹阳高级中学",
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
    title: "志愿服务进社区活动圆满开展",
    date: "2026-04-02",
    image: "/view/view3.jpg",
    summary: "我校青年志愿者走进丹阳市多个社区，开展义务辅导、环境清洁、关爱孤寡老人等志愿服务活动。同学们以实际行动践行社会责任，受到社区居民的一致好评和热情欢迎。",
  },
  {
    id: 2,
    title: "暑期社会实践报告会成功举办",
    date: "2026-03-20",
    image: "/view/view6.jpg",
    summary: "各班级代表在暑期社会实践报告会上分享了实践成果。同学们深入农村、企业、社区等开展调研，形成了一批高质量的调查报告，多个项目获评市级优秀社会实践成果。",
  },
  {
    id: 3,
    title: "研学旅行走进南京",
    date: "2026-03-08",
    image: "/view/view5.jpg",
    summary: "高一年级全体学生赴南京开展为期两天的研学旅行。行程涵盖侵华日军南京大屠杀遇难同胞纪念馆、南京大学、中山陵等地，让学生在行走中铭记历史、感悟文化、开拓视野。",
  },
]

export default function PracticePage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="社会实践"
        breadcrumbs={[{ label: "德育之窗", href: "/moraledu" }, { label: "社会实践" }]}
        sidebarItems={sidebarItems}
        activePath="/moraledu/practice"
      >
        <div className="mb-10">
          <p className="leading-relaxed text-[#555]">
            社会实践是学校德育工作的重要组成部分。我校积极拓展实践育人渠道，通过志愿服务、社区合作、研学旅行等多元化活动，引导学生走出校园、走进社会，在实践中增长见识、锤炼品格、培养社会责任感和公民意识。
          </p>
        </div>

        <h3 className="mb-6 text-xl font-bold text-[#333]">实践活动动态</h3>
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
