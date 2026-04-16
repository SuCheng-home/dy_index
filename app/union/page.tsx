import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "工会活动 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学工会活动，关心教职工生活，凝聚发展合力",
}

const sidebarItems = [
  { label: "工会活动", href: "/union" },
  { label: "团委工作", href: "/union/youth" },
  { label: "学生会", href: "/union/student" },
  { label: "关工委", href: "/union/elderly" },
]

const news = [
  {
    id: 13,
    title: "学校工会举办2026年春季教职工趣味运动会",
    date: "2026-04-06",
    image: "/view/view8.jpg",
    summary: "为丰富教职工文体生活、增强团队凝聚力，学校工会在校体育馆成功举办春季教职工趣味运动会，全校260余名教职工参与了拔河、接力跑、趣味投篮等项目。",
  },
  {
    id: 14,
    title: "工会组织教职工健康体检及心理关怀讲座",
    date: "2026-04-01",
    image: "/view/view7.jpg",
    summary: "学校工会联合丹阳市人民医院为全体教职工安排年度健康体检，并邀请心理健康专家开展“阳光心态、幸福教育”主题讲座，关注教师身心健康。",
  },
  {
    id: 15,
    title: "学校工会开展困难教职工慰问走访活动",
    date: "2026-03-26",
    image: "/view/view3.jpg",
    summary: "在学校党委的指导下，工会班子成员深入困难教职工家中开展走访慰问，送去慰问金和生活用品，详细了解他们的生活状况，传递学校的关怀与温暖。",
  },
]

export default function UnionPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="工会活动"
        subtitle="Union Activities"
        breadcrumbs={[{ label: "统群工作" }, { label: "工会活动" }]}
        sidebarItems={sidebarItems}
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            学校工会始终关心教职工生活，坚持"维护教职工合法权益、促进学校和谐发展"的工作宗旨。工会积极组织各类文体活动、开展教职工关怀慰问、推进民主管理，努力营造温馨和谐的校园氛围，增强教职工的归属感和幸福感。
          </p>
          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              工会动态
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
