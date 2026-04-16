import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "校友之家 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学校友之家，汇聚校友力量，传承丹中精神，共建美好母校。",
}

const news = [
  {
    id: 501,
    title: "杰出校友、中科院院士回校开展学术讲座",
    date: "2026-04-05",
    image: "/view/view7.jpg",
    summary:
      "我校杰出校友、中国科学院院士张明远教授应邀回校，为全校师生带来题为“人工智能与未来教育”的精彩学术讲座，激励学子勇攀科学高峰。",
  },
  {
    id: 502,
    title: "校友会2026年度联谊活动圆满举行",
    date: "2026-03-29",
    image: "/view/view5.jpg",
    summary: "丹阳高级中学校友会2026年度联谊活动在学校报告厅隆重举行，300余名各届校友欢聚一堂，共叙同窗情谊，共话母校发展。",
  },
  {
    id: 503,
    title: "校友捐赠500万元设立“致远奖学金”",
    date: "2026-03-20",
    image: "/view/view5.jpg",
    summary:
      "1995届校友、知名企业家李志强先生向母校捐赠500万元，设立“致远奖学金”，用于奖励品学兼优的在校学生和资助家庭困难学生。",
  },
]

export default function AlumniPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="校友之家"
        subtitle="Alumni Home"
        breadcrumbs={[{ label: "校友之家" }]}
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            江苏省丹阳高级中学自建校以来，培养了数万名优秀毕业生，遍布海内外各行各业。学校校友会成立于1985年，致力于搭建校友与母校之间的沟通桥梁，凝聚校友力量，助力学校发展。历届校友中涌现出院士、将军、企业家、艺术家等大批杰出人才，他们以实际行动诠释着"致远"精神的深刻内涵。
          </p>

          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              校友动态
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
