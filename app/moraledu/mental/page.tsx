import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "心理健康 | 江苏省丹阳高级中学",
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
    title: "心理健康教育月系列活动启动",
    date: "2026-04-05",
    image: "/view/view8.jpg",
    summary: "为进一步加强学生心理健康教育，我校于四月启动心理健康教育月系列活动，涵盖心理讲座、团体辅导、心理情景剧展演等丰富内容，帮助学生树立积极健康的心理意识。",
  },
  {
    id: 2,
    title: "高三考前心理辅导讲座圆满举行",
    date: "2026-03-28",
    image: "/view/view8.jpg",
    summary: "临近高考，我校专职心理咨询师为高三年级全体学生开展考前心理辅导专题讲座，围绕情绪管理、压力调适和自信心培养等主题，为学子们提供科学有效的心理支持。",
  },
  {
    id: 3,
    title: "我校心理剧《向阳而生》获市级一等奖",
    date: "2026-03-15",
    image: "/view/view7.jpg",
    summary: "在丹阳市中小学心理健康教育优秀成果展评活动中，我校学生自编自导自演的心理情景剧《向阳而生》荣获一等奖，充分展示了学生积极向上的精神风貌。",
  },
]

export default function MentalHealthPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="心理健康"
        breadcrumbs={[{ label: "德育之窗", href: "/moraledu" }, { label: "心理健康" }]}
        sidebarItems={sidebarItems}
        activePath="/moraledu/mental"
      >
        <div className="mb-10">
          <p className="leading-relaxed text-[#555]">
            我校高度重视学生心理健康教育工作，建有专业心理咨询室，配备国家二级心理咨询师，定期开展心理讲座、团辅活动和个体咨询服务。学校以"阳光心灵、健康成长"为理念，构建了覆盖全体学生的心理健康教育体系，通过心理课程、心理社团、心理危机干预等多种途径，全面呵护学生身心健康发展。
          </p>
        </div>

        <h3 className="mb-6 text-xl font-bold text-[#333]">心理健康动态</h3>
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
