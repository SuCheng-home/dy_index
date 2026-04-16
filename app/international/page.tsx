import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "国际交流 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学国际交流项目，与美国、英国、日本等国学校建立友好合作关系。",
}

const sidebarItems = [
  { label: "国际交流", href: "/international" },
  { label: "海外研学", href: "/international/study" },
  { label: "合作项目", href: "/international/projects" },
  { label: "外教风采", href: "/international/teachers" },
]

const news = [
  {
    id: 401,
    title: "美国友好学校师生代表团来校访问交流",
    date: "2026-04-07",
    image: "/view/view2.jpg",
    summary: "美国加州圣何塞Lincoln高中师生代表团一行20人来校进行为期一周的交流访问，双方师生开展课堂互动、文化体验和社团交流等丰富活动。",
  },
  {
    id: 402,
    title: "我校与英国伊顿公学签署合作备忘录",
    date: "2026-03-29",
    image: "/view/view8.jpg",
    summary: "学校与英国伊顿公学正式签署教育合作备忘录，双方将在师资培训、课程开发、学生交换等领域开展深入合作，拓展国际教育合作新空间。",
  },
  {
    id: 403,
    title: "中日青少年文化交流活动在我校举办",
    date: "2026-03-21",
    image: "/view/view3.jpg",
    summary: "由江苏省教育厅主办的中日青少年文化交流活动在我校举行，来自日本东京、大阪等地的50名高中生与我校学生开展书法、茶道等文化交流。",
  },
]

export default function InternationalPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="国际交流"
        subtitle="International Exchange"
        breadcrumbs={[{ label: "国际教育" }, { label: "国际交流" }]}
        sidebarItems={sidebarItems}
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            江苏省丹阳高级中学积极拓展国际教育交流与合作，先后与美国、英国、日本、澳大利亚、新加坡等国家的十余所知名学校建立了友好合作关系。学校通过师生互访、课程共建、联合研究等多种形式，推动中外教育文化深度交流，培养具有国际视野和跨文化交流能力的新时代人才。
          </p>

          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              交流动态
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
