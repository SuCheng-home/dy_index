import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "师资队伍 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学师资队伍介绍，了解学校优秀教师团队",
}

const sidebarItems = [
  { label: "师资队伍", href: "/teachers" },
  { label: "名师工作室", href: "/teachers/studio" },
  { label: "教师培训", href: "/teachers/training" },
  { label: "教研成果", href: "/teachers/achievements" },
]

const news = [
  {
    id: 1,
    title: "我校张明老师荣获江苏省特级教师称号",
    date: "2026-04-05",
    image: "/placeholder-user.jpg",
    summary: "近日，江苏省教育厅公布了2026年特级教师评审结果，我校数学学科张明老师凭借突出的教学成绩和丰富的教研成果，成功获评江苏省特级教师。",
  },
  {
    id: 2,
    title: "青年教师基本功大赛我校教师斩获多项一等奖",
    date: "2026-04-02",
    image: "/placeholder-user.jpg",
    summary: "在镇江市第十二届青年教师教学基本功大赛中，我校6位青年教师参赛，4人荣获一等奖，2人荣获二等奖，充分展示了学校青年教师的专业素养。",
  },
  {
    id: 3,
    title: "学校举办2026年度师徒结对仪式",
    date: "2026-03-28",
    image: "/placeholder-user.jpg",
    summary: "为促进青年教师快速成长，学校隆重举行新学年师徒结对仪式，18对师徒正式签约，开启为期一年的教学指导与专业发展之旅。",
  },
]

export default function TeachersPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="师资队伍"
        subtitle="Faculty Team"
        breadcrumbs={[{ label: "教师发展" }, { label: "师资队伍" }]}
        sidebarItems={sidebarItems}
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            学校现有专任教师320余人，其中正高级教师8人，特级教师12人，高级教师156人，硕士研究生学历教师98人。学校坚持"以人为本、名师引领"的教师发展理念，形成了一支师德高尚、业务精湛、结构合理、充满活力的高素质教师队伍，为学校教育教学质量的持续提升提供了坚实保障。
          </p>
          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              教师风采
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
