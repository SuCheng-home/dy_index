import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ChevronRight } from "lucide-react"

export const metadata = {
  title: "党建工作 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学党建工作动态和党员风采",
}

const sidebarItems = [
  { label: "党建动态", href: "/party" },
  { label: "党史学习", href: "/party/history" },
  { label: "主题教育", href: "/party/theme" },
  { label: "党员风采", href: "/party/members" },
]

const partyNews = [
  {
    id: 1,
    title: "我校党委召开2026年度党建工作会议",
    date: "2026-04-05",
    image: "/view/view7.jpg",
    summary: "会议总结了2025年度党建工作，部署了2026年度党建工作重点任务。",
  },
  {
    id: 2,
    title: "学习贯彻党的二十大精神专题培训班圆满结束",
    date: "2026-04-03",
    image: "/view/view3.jpg",
    summary: "全体党员干部深入学习党的二十大报告，进一步增强政治自觉。",
  },
  {
    id: 3,
    title: "我校开展「学党史、悟思想」主题党日活动",
    date: "2026-04-01",
    image: "/view/view3.jpg",
    summary: "党员教师重温入党誓词，参观红色教育基地，接受革命传统教育。",
  },
]

export default function PartyPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="党建工作"
        subtitle="Party Building"
        breadcrumbs={[{ label: "党建工作" }]}
        sidebarItems={sidebarItems}
        bannerImage="/view/view5.jpg"
      >
        <div className="space-y-8">
          {/* 头部引言 */}
          <div className="rounded-xl bg-gradient-to-r from-[#8B1A1A] to-[#6B1010] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">坚持党的全面领导 落实立德树人根本任务</h2>
            <p className="text-sm leading-relaxed opacity-90">
              江苏省丹阳高级中学党委始终坚持以习近平新时代中国特色社会主义思想为指导，全面贯彻党的教育方针，落实立德树人根本任务，团结带领全体党员干部和教职工，推动学校各项事业高质量发展。
            </p>
          </div>

          {/* 新闻列表 */}
          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              党建动态
            </h3>
            <div className="grid gap-6">
              {partyNews.map((news, index) => (
                <Link
                  key={news.id}
                  href={`/party/news/${news.id}`}
                  className="animate-in fade-in slide-in-from-bottom-4 group flex flex-col gap-5 rounded-xl bg-[#F8F4ED] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:flex-row"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-48 w-full overflow-hidden rounded-lg sm:h-36 sm:w-52 flex-shrink-0">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h4 className="mb-2 text-lg font-bold text-[#333] transition-colors group-hover:text-[#8B1A1A]">
                        {news.title}
                      </h4>
                      <p className="line-clamp-2 text-sm text-[#666]">{news.summary}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs text-[#999]">
                        <Calendar className="h-3.5 w-3.5" />
                        {news.date}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-[#8B1A1A] opacity-0 transition-opacity group-hover:opacity-100">
                        阅读更多
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 更多按钮 */}
          <div className="text-center">
            <Link
              href="/party/news"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#8B1A1A] px-8 py-3 font-medium text-[#8B1A1A] transition-all hover:bg-[#8B1A1A] hover:text-white"
            >
              查看更多
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </SubPageLayout>
      <Footer />
    </>
  )
}
