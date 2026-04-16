import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "党史学习 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学党史学习教育活动，传承红色基因，赓续精神血脉",
}

const sidebarItems = [
  { label: "党建动态", href: "/party" },
  { label: "党史学习", href: "/party/history" },
  { label: "主题教育", href: "/party/theme" },
  { label: "党员风采", href: "/party/members" },
]

const news = [
  {
    id: "party-history-1",
    title: "我校开展“重温百年党史 汲取奋进力量”专题学习活动",
    summary:
      "为深入推进党史学习教育常态化长效化，我校党委组织全体党员教师开展专题学习活动，通过专题讲座、集中研讨等形式，引导党员教师从百年党史中汲取智慧和力量。",
    date: "2025-11-15",
    image: "/view/view6.jpg",
  },
  {
    id: "party-history-2",
    title: "学校组织师生参观丹阳革命历史纪念馆",
    summary:
      "为弘扬革命精神、传承红色基因，我校组织党员教师和学生代表前往丹阳革命历史纪念馆参观学习，重温革命先烈的英勇事迹，接受深刻的爱国主义教育。",
    date: "2025-10-08",
    image: "/view/view1.jpg",
  },
  {
    id: "party-history-3",
    title: "我校举办“学党史、知党情、跟党走”知识竞赛",
    summary:
      "为激发广大师生学习党史的热情，检验党史学习教育成效，学校团委联合党委举办党史知识竞赛，吸引了全校师生的广泛参与，营造了浓厚的学习氛围。",
    date: "2025-09-20",
    image: "/view/view8.jpg",
  },
]

export default function PartyHistoryPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="党史学习"
        subtitle="Party History Study"
        breadcrumbs={[{ label: "党建工作", href: "/party" }, { label: "党史学习" }]}
        sidebarItems={sidebarItems}
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            江苏省丹阳高级中学党委高度重视党史学习教育，坚持把党史学习教育作为加强党的建设的重要抓手，引导全体党员教师学史明理、学史增信、学史崇德、学史力行，从党的百年奋斗历程中汲取前行力量，以优良作风推动学校教育事业高质量发展。
          </p>

          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              党史学习动态
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
