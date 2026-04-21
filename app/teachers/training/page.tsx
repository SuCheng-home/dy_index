import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "教师培训 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学教师培训，助力教师专业发展与能力提升",
}

const sidebarItems = [
  { label: "师资队伍", href: "/teachers" },
  { label: "名师工作室", href: "/teachers/studio" },
  { label: "教师培训", href: "/teachers/training" },
  { label: "教研成果", href: "/teachers/achievements" },
]

const news = [
  {
    id: 7,
    title: "学校组织骨干教师赴上海参加新课标培训研修",
    date: "2026-04-04",
    image: "/placeholder-user.jpg",
    summary: "为深入推进新课程标准的落地实施，学校选派30名骨干教师赴上海华东师范大学参加为期五天的新课标专题培训，系统学习课程改革的理念与实践。",
  },
  {
    id: 8,
    title: "2026年青年教师暑期研修班圆满结束",
    date: "2026-03-30",
    image: "/placeholder-user.jpg",
    summary: "历时两周的青年教师暑期研修班圆满落幕，45名入职三年内的青年教师通过专家讲座、课堂实践、小组研讨等多种形式，全方位提升了教育教学能力。",
  },
  {
    id: 9,
    title: "信息技术与学科融合教学能力提升培训开班",
    date: "2026-03-22",
    image: "/placeholder-user.jpg",
    summary: "学校启动信息技术与学科融合教学能力提升培训项目，邀请省电教馆专家为全体教师讲解智慧课堂、数字化教学工具的应用方法与实践策略。",
  },
]

export default function TrainingPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="教师培训"
        subtitle="Teacher Training"
        breadcrumbs={[{ label: "教师发展", href: "/teachers" }, { label: "教师培训" }]}
        sidebarItems={sidebarItems}
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            学校高度重视教师专业发展，构建了"校本研修+外出培训+网络学习"三位一体的教师培训体系。每年投入专项经费用于教师培训，定期组织骨干教师赴省内外名校跟岗学习，邀请教育专家来校指导，开展校本教研活动，全面提升教师的教育教学水平和科研能力。
          </p>
          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              培训动态
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
