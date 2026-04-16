import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { ArrowRight, Calendar } from "lucide-react"

export const metadata = {
  title: "德育之窗 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学德育工作和学生活动",
}

const sidebarItems = [
  { label: "德育动态", href: "/moraledu" },
  { label: "心理健康", href: "/moraledu/mental" },
  { label: "班主任工作", href: "/moraledu/teacher" },
  { label: "学生社团", href: "/moraledu/clubs" },
  { label: "社会实践", href: "/moraledu/practice" },
]

const sections = [
  {
    title: "心理健康教育",
    desc: "设有专业心理咨询室，配备国家二级心理咨询师3名。定期开展心理讲座、团体辅导和个体咨询，关注学生心理健康成长。",
    href: "/moraledu/mental",
  },
  {
    title: "班主任工作室",
    desc: "由省市级优秀班主任领衔，形成「传帮带」梯队培养机制，定期开展班主任沙龙，分享德育经验与带班智慧。",
    href: "/moraledu/teacher",
  },
  {
    title: "学生社团活动",
    desc: "现有学术、文艺、体育、科技、公益五大类共30余个社团，每年举办社团文化节，丰富校园文化生活。",
    href: "/moraledu/clubs",
  },
  {
    title: "社会实践基地",
    desc: "与丹阳市博物馆、企业、社区建立合作关系，搭建志愿服务和社会实践平台，培养学生责任担当意识。",
    href: "/moraledu/practice",
  },
]

const activities = [
  {
    id: 1,
    title: "高一年级成人礼仪式隆重举行",
    date: "2026-04-06",
    image: "/view/view7.jpg",
    summary: "全体高一学生在家长和教师的见证下，跨过成人门，立下青春誓言。",
  },
  {
    id: 2,
    title: "我校学生参加市青年志愿者活动",
    date: "2026-04-04",
    image: "/view/view5.jpg",
    summary: "50余名志愿者走进社区开展敬老助残、环保宣传等公益活动。",
  },
  {
    id: 3,
    title: "心理健康教育月活动正式启动",
    date: "2026-04-02",
    image: "/view/view3.jpg",
    summary: "以「阳光心态·健康成长」为主题，开展心理剧展演、沙盘体验等系列活动。",
  },
  {
    id: 4,
    title: "班主任基本功大赛圆满落幕",
    date: "2026-03-28",
    image: "/view/view2.jpg",
    summary: "18位班主任通过主题班会、教育故事、才艺展示等环节同台竞技。",
  },
]

export default function MoralEduPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="德育之窗"
        subtitle="Moral Education"
        breadcrumbs={[{ label: "德育之窗" }]}
        sidebarItems={sidebarItems}
        bannerImage="/view/view5.jpg"
      >
        <div className="space-y-10">
          {/* 德育栏目导航 */}
          <div className="grid gap-4 sm:grid-cols-2">
            {sections.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex items-start gap-4 rounded-xl border-l-4 border-[#8B1A1A] bg-gradient-to-r from-[#F8F4ED] to-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-bold text-[#333] transition-colors group-hover:text-[#8B1A1A]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#666]">{item.desc}</p>
                </div>
                <ArrowRight className="mt-1 h-5 w-5 flex-shrink-0 text-[#ccc] transition-all group-hover:translate-x-1 group-hover:text-[#8B1A1A]" />
              </Link>
            ))}
          </div>

          {/* 德育理念 */}
          <div className="rounded-xl bg-gradient-to-r from-[#8B1A1A] to-[#6B1010] p-8 text-white">
            <h2 className="mb-4 font-serif text-2xl font-bold">大成德育 润泽心灵</h2>
            <p className="leading-relaxed opacity-90">
              学校秉承"大成教育"理念，构建"三全育人"体系，坚持把立德树人融入教育教学全过程。通过主题班会、社会实践、志愿服务、心理健康教育等多元途径，培养学生的社会责任感、创新精神和实践能力，促进学生德智体美劳全面发展。
            </p>
          </div>

          {/* 德育动态 */}
          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              德育动态
            </h3>
            <div className="grid gap-6">
              {activities.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="group flex flex-col gap-5 rounded-xl bg-[#F8F4ED] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:flex-row"
                >
                  <div className="relative h-48 w-full overflow-hidden rounded-lg sm:h-36 sm:w-52 flex-shrink-0">
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
