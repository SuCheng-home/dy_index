import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "合作项目 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学国际合作项目，与海外学校开展课程共建、学生交换等合作。",
}

const sidebarItems = [
  { label: "国际交流", href: "/international" },
  { label: "海外研学", href: "/international/study" },
  { label: "合作项目", href: "/international/projects" },
  { label: "外教风采", href: "/international/teachers" },
]

const news = [
  {
    id: 421,
    title: "中美STEM教育合作项目正式启动",
    date: "2026-04-05",
    image: "/view/view3.jpg",
    summary: "我校与美国加州理工学院附属高中联合开展的STEM教育合作项目正式启动，双方将共同开发人工智能和机器人课程，培养学生科技创新能力。",
  },
  {
    id: 422,
    title: "中英双学历项目首届毕业生传来喜讯",
    date: "2026-03-24",
    image: "/view/view3.jpg",
    summary: "我校中英双学历项目首届毕业生全部获得中英两国高中毕业证书，其中12名同学被英国G5大学录取，合作办学成果显著。",
  },
  {
    id: 423,
    title: "中澳数学竞赛联合训练营在我校举行",
    date: "2026-03-17",
    image: "/view/view6.jpg",
    summary: "由我校与澳大利亚墨尔本文法学校联合举办的数学竞赛训练营在我校举行，中澳两国40名数学精英学生共同切磋，互学互鉴。",
  },
]

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="合作项目"
        subtitle="Cooperation Projects"
        breadcrumbs={[{ label: "国际教育", href: "/international" }, { label: "合作项目" }]}
        sidebarItems={sidebarItems}
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            学校与多个国家的知名学校和教育机构建立了长期稳定的合作关系，开展了包括课程共建、学生交换、师资培训、联合科研等多种形式的合作项目。这些项目为师生搭建了国际化的学习交流平台，有力推动了学校教育国际化进程。
          </p>

          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              项目动态
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
