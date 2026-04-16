import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "关工委 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学关工委工作与老教师育人活动资讯",
}

const sidebarItems = [
  { label: "工会活动", href: "/union" },
  { label: "团委工作", href: "/union/youth" },
  { label: "学生会", href: "/union/student" },
  { label: "关工委", href: "/union/elderly" },
]

const news = [
  {
    id: 621,
    title: "关工委开展“银龄讲堂”主题教育活动",
    date: "2026-04-04",
    image: "/view/view4.jpg",
    summary: "退休老教师走进课堂，结合自身经历讲述求学奋斗与家国情怀，激励学生立志成才。",
  },
  {
    id: 622,
    title: "老少结对帮扶计划启动",
    date: "2026-03-30",
    image: "/view/view1.jpg",
    summary: "关工委组织经验丰富的退休教师与青年班主任结对，围绕育人方法与班级管理开展常态化指导。",
  },
  {
    id: 623,
    title: "关工委走进社区开展家校协同宣讲",
    date: "2026-03-23",
    image: "/view/view4.jpg",
    summary: "围绕未成年人保护与家庭教育主题开展公益讲座，推动家校社协同育人机制落地。",
  },
]

export default function UnionElderlyPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="关工委"
        subtitle="Committee on Caring for the Next Generation"
        breadcrumbs={[{ label: "统群工作", href: "/union" }, { label: "关工委" }]}
        sidebarItems={sidebarItems}
        bannerImage="/view/view8.jpg"
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            学校关工委充分发挥老同志在经验、威望和情感方面的独特优势，围绕青少年思想道德建设、心理成长引导和法治安全教育，持续开展“银龄助学、银龄育人”系列活动，为学生健康成长保驾护航。
          </p>
          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              关工委动态
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
