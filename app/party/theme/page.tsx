import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "主题教育 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学主题教育活动，深入学习贯彻党的创新理论",
}

const sidebarItems = [
  { label: "党建动态", href: "/party" },
  { label: "党史学习", href: "/party/history" },
  { label: "主题教育", href: "/party/theme" },
  { label: "党员风采", href: "/party/members" },
]

const news = [
  {
    id: "theme-edu-1",
    title: "我校召开主题教育专题民主生活会",
    summary:
      "按照上级党委统一部署，我校党委召开主题教育专题民主生活会，班子成员逐一进行对照检查，开展批评与自我批评，明确整改方向和具体措施。",
    date: "2025-12-10",
    image: "/view/view6.jpg",
  },
  {
    id: "theme-edu-2",
    title: "学校举办“学思想、强党性、重实践、建新功”主题宣讲",
    summary:
      "为推动主题教育走深走实，我校邀请市委党校专家来校开展专题宣讲，围绕习近平新时代中国特色社会主义思想进行深入解读，帮助党员教师准确把握核心要义。",
    date: "2025-11-22",
    image: "/view/view8.jpg",
  },
  {
    id: "theme-edu-3",
    title: "党员教师深入社区开展“我为群众办实事”实践活动",
    summary:
      "作为主题教育的重要实践环节，我校组织党员教师深入社区开展义务辅导、教育咨询等志愿服务活动，以实际行动践行为民服务宗旨，赢得社区居民广泛好评。",
    date: "2025-10-18",
    image: "/view/view1.jpg",
  },
]

export default function ThemeEducationPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="主题教育"
        subtitle="Theme Education"
        breadcrumbs={[{ label: "党建工作", href: "/party" }, { label: "主题教育" }]}
        sidebarItems={sidebarItems}
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            江苏省丹阳高级中学党委认真贯彻落实上级党组织关于主题教育的部署要求，坚持以学铸魂、以学增智、以学正风、以学促干，引导全体党员教师深入学习贯彻党的创新理论，将主题教育成果转化为推动学校高质量发展的强大动力。
          </p>

          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              主题教育动态
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
