import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "图书馆 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学致远图书馆，藏书10万册，设有电子阅览室，为师生提供丰富的阅读资源。",
}

const sidebarItems = [
  { label: "招生信息", href: "/service/admission" },
  { label: "后勤服务", href: "/service/logistics" },
  { label: "图书馆", href: "/service/library" },
  { label: "信息中心", href: "/service/info" },
]

const news = [
  {
    id: 331,
    title: "第十二届校园读书节隆重开幕",
    date: "2026-04-02",
    image: "/view/view8.jpg",
    summary:
      "以“阅读点亮人生，书香浸润校园”为主题的第十二届校园读书节正式开幕，活动将持续一个月，包含名著导读、读书征文、诗词大赛等系列活动。",
  },
  {
    id: 332,
    title: "电子阅览室数字资源平台全面升级",
    date: "2026-03-26",
    image: "/view/view3.jpg",
    summary: "图书馆电子阅览室完成数字资源平台升级，新增中国知网、万方数据等学术数据库访问权限，师生可免费查阅各类学术论文和期刊。",
  },
  {
    id: 333,
    title: "作家进校园——著名作家毕飞宇文学讲座",
    date: "2026-03-15",
    image: "/view/view1.jpg",
    summary: "图书馆邀请著名作家、茅盾文学奖得主毕飞宇先生来校举办文学讲座，与师生分享文学创作经验，激发学生阅读与写作热情。",
  },
]

export default function LibraryPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="图书馆"
        subtitle="Library"
        breadcrumbs={[{ label: "校园服务", href: "/service" }, { label: "图书馆" }]}
        sidebarItems={sidebarItems}
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            致远图书馆是学校重要的文化地标和学习中心，建筑面积达3600平方米，馆藏图书10万余册，订阅期刊报纸300余种。图书馆设有综合阅览室、电子阅览室、教师研修室和学生自习区，配备先进的图书管理系统和数字资源平台，全天候为师生提供优质的阅读和学习服务。
          </p>

          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              图书馆动态
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
