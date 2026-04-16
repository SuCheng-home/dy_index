import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "学生社团 | 江苏省丹阳高级中学",
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
    title: "社团文化节精彩纷呈",
    date: "2026-04-06",
    image: "/view/view2.jpg",
    summary: "一年一度的社团文化节隆重开幕，全校30余个社团精心策划展示活动。街舞社、合唱团、机器人社等纷纷亮出绝活，吸引了众多同学驻足参与，校园里洋溢着青春活力与创意激情。",
  },
  {
    id: 2,
    title: "模拟联合国社团获省级奖项",
    date: "2026-03-22",
    image: "/view/view1.jpg",
    summary: "我校模拟联合国社团在江苏省中学生模拟联合国大会中表现出色，三名同学分获最佳代表、杰出代表荣誉。社团成员以流利的英语和扎实的国际知识储备赢得了评委一致好评。",
  },
  {
    id: 3,
    title: "校园十佳社团评选揭晓",
    date: "2026-03-10",
    image: "/view/view8.jpg",
    summary: "经过社团自评、成果展示和全校投票等环节，2025—2026学年度校园十佳社团评选结果正式揭晓。文学社、辩论社、天文社等社团凭借突出的活动成效和社会影响力入选。",
  },
]

export default function ClubsPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="学生社团"
        breadcrumbs={[{ label: "德育之窗", href: "/moraledu" }, { label: "学生社团" }]}
        sidebarItems={sidebarItems}
        activePath="/moraledu/clubs"
      >
        <div className="mb-10">
          <p className="leading-relaxed text-[#555]">
            我校现有学生社团30余个，涵盖学术探究、文艺表演、体育竞技、科技创新、公益志愿五大类。学校为每个社团配备指导教师，提供活动场地和经费支持，定期举办社团文化节和成果展示活动。丰富多彩的社团生活为学生提供了展示才华、发展个性的广阔舞台。
          </p>
        </div>

        <h3 className="mb-6 text-xl font-bold text-[#333]">社团动态</h3>
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
