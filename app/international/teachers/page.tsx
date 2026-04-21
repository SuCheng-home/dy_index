import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "外教风采 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学外籍教师风采展示，了解学校外教团队和英语教学特色。",
}

const sidebarItems = [
  { label: "国际交流", href: "/international" },
  { label: "海外研学", href: "/international/study" },
  { label: "合作项目", href: "/international/projects" },
  { label: "外教风采", href: "/international/teachers" },
]

const news = [
  {
    id: 431,
    title: "外教David荣获丹阳市“优秀外籍教师”称号",
    date: "2026-04-03",
    image: "/placeholder-user.jpg",
    summary:
      "我校英语外教David Thompson凭借出色的教学业绩和对中外文化交流的突出贡献，荣获丹阳市2025年度“优秀外籍教师”荣誉称号。",
  },
  {
    id: 432,
    title: "外教主题英语角——走进莎士比亚戏剧",
    date: "2026-03-26",
    image: "/placeholder-user.jpg",
    summary: "外教团队举办主题英语角活动，以莎士比亚经典戏剧为素材，带领学生进行英语戏剧表演和文学赏析，激发学生英语学习兴趣。",
  },
  {
    id: 433,
    title: "新学期两位外教加入我校教学团队",
    date: "2026-03-10",
    image: "/placeholder-user.jpg",
    summary: "新学期，来自美国和澳大利亚的两位外籍教师正式加入我校，分别担任英语口语和学术英语课程教学，进一步充实了学校外教师资力量。",
  },
]

export default function ForeignTeachersPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="外教风采"
        subtitle="Foreign Teachers"
        breadcrumbs={[{ label: "国际教育", href: "/international" }, { label: "外教风采" }]}
        sidebarItems={sidebarItems}
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            学校常年聘请来自英语国家的优秀外籍教师任教，目前拥有5名全职外教，分别来自美国、英国和澳大利亚。外教团队承担英语口语、学术英语、英美文学等课程教学，并积极参与校园文化活动，为学生创造沉浸式英语学习环境。
          </p>

          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              外教动态
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
