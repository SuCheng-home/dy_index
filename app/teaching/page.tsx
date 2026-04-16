import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "教学管理 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学教学工作和课程建设",
}

const sidebarItems = [
  { label: "教学动态", href: "/teaching" },
  { label: "课程建设", href: "/teaching/curriculum" },
  { label: "教学研究", href: "/teaching/research" },
  { label: "考试管理", href: "/teaching/exam" },
  { label: "学业评价", href: "/teaching/evaluation" },
]

const quickLinks = [
  { title: "课程安排", href: "/teaching/curriculum", desc: "查看各年级课程设置与教学计划" },
  { title: "教学成果", href: "/teachers/achievements", desc: "师生教学竞赛获奖及论文成果" },
  { title: "教案资源", href: "/teaching/research", desc: "优秀教案、课件等教学资源共享" },
  { title: "成绩查询", href: "/teaching/exam", desc: "历次考试成绩及学业评价数据" },
]

const news = [
  {
    id: 1,
    title: "高三年级二模考试质量分析会召开",
    date: "2026-04-07",
    image: "/view/view5.jpg",
    summary: "各学科备课组长深入分析了二模数据，制定了后期复习策略。",
  },
  {
    id: 2,
    title: "我校开展新课标培训系列活动",
    date: "2026-04-05",
    image: "/view/view2.jpg",
    summary: "全体教师深入学习新课程标准，更新教育教学理念。",
  },
  {
    id: 3,
    title: "市级公开课在我校成功举办",
    date: "2026-04-03",
    image: "/view/view7.jpg",
    summary: "三位骨干教师展示精彩课堂，获得与会专家高度评价。",
  },
]

export default function TeachingPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="教学管理"
        subtitle="Teaching Management"
        breadcrumbs={[{ label: "教学管理" }]}
        sidebarItems={sidebarItems}
        bannerImage="/view/view4.jpg"
      >
        <div className="space-y-10">
          {/* 快捷入口 - 纯文字卡片 */}
          <div className="grid grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="group rounded-xl border border-[#E8DCC8] bg-[#F8F4ED] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#8B1A1A]/30 hover:shadow-lg"
              >
                <h4 className="mb-1 font-bold text-[#333] transition-colors group-hover:text-[#8B1A1A]">
                  {link.title}
                </h4>
                <p className="text-xs text-[#666]">{link.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-xs text-[#8B1A1A] opacity-0 transition-opacity group-hover:opacity-100">
                  进入
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>

          {/* 教学理念 */}
          <div className="overflow-hidden rounded-xl bg-white shadow-md">
            <div className="flex flex-col md:flex-row">
              <div className="relative h-64 md:h-auto md:w-1/2">
                <Image
                  src="/view/view4.jpg"
                  alt="课堂教学"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center p-8 md:w-1/2">
                <h3 className="mb-4 font-serif text-2xl font-bold text-[#8B1A1A]">
                  以学生为中心 构建高效课堂
                </h3>
                <p className="mb-4 leading-relaxed text-[#555]">
                  学校坚持"以学定教、以教促学"的教学理念，深入推进课堂教学改革，构建"自主、合作、探究"的学习模式，培养学生的学习能力和创新思维。
                </p>
                <ul className="space-y-2 text-sm text-[#666]">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                    深化课堂教学改革，提高课堂效率
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                    加强集体备课，优化教学设计
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                    开展分层教学，关注每一位学生
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 教学动态 */}
          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              教学动态
            </h3>
            <div className="grid gap-6">
              {news.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="group flex flex-col gap-5 rounded-xl bg-[#F8F4ED] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:flex-row"
                >
                  <div className="relative h-48 w-full overflow-hidden rounded-lg sm:h-32 sm:w-48 flex-shrink-0">
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
                      <p className="text-sm text-[#666]">{item.summary}</p>
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
