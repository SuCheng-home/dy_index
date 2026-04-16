import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { Calendar, Eye, User, Share2, Printer, ArrowLeft, ArrowRight } from "lucide-react"

const newsDetail = {
  id: 1,
  category: "校园新闻",
  title: "我校召开2026年春季学期教职工大会",
  date: "2026-04-08",
  author: "校办",
  views: 1256,
  image: "/view/view8.jpg",
  content: `
    <p>4月8日上午，江苏省丹阳高级中学2026年春季学期教职工大会在学校报告厅隆重召开。全体教职工参加了本次大会，共同谋划新学期工作。</p>
    
    <p>大会由副校长主持。首先，教务处负责同志通报了上学期教学工作情况，对各年级教学质量进行了全面分析，肯定了取得的成绩，指出了存在的问题，并提出了改进措施。</p>
    
    <p>随后，学生处负责同志就德育工作进行了总结，重点介绍了心理健康教育、社团活动、社会实践等方面取得的成效，并对新学期德育工作进行了部署。</p>
    
    <p>校长在讲话中指出，过去一学期，全校教职工团结一心、奋发有为，各项工作取得了新进展。新的学期，学校将继续深化"大成教育"办学理念，坚持立德树人根本任务，全面提升教育教学质量。</p>
    
    <p>校长强调，全体教职工要进一步增强责任意识和使命担当，以更加饱满的热情投入到新学期工作中。一要加强师德师风建设，做"四有"好教师；二要深化课堂教学改革，提高课堂效率；三要关注学生身心健康，促进学生全面发展；四要加强家校合作，形成教育合力。</p>
    
    <p>最后，校长号召全体教职工不忘初心、牢记使命，为把学校建设成为省内一流、全国知名的高品质高中而不懈奋斗！</p>
  `,
}

const relatedNews = [
  { id: 2, title: "高三年级二模考试成绩分析会顺利召开", date: "2026-04-07" },
  { id: 3, title: "我校学生在省青少年科技创新大赛中斩获佳绩", date: "2026-04-06" },
  { id: 4, title: "省级课题《大成教育理念下的学科融合研究》顺利开题", date: "2026-04-05" },
]

export default function NewsDetailPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#FDFBF7]">
        {/* 面包屑导航 */}
        <div className="border-b border-[#E8DCC8] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <BreadcrumbNav
              items={[
                { label: "新闻中心", href: "/news" },
                { label: newsDetail.title },
              ]}
            />
          </div>
        </div>

        {/* 主内容 */}
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-col gap-10 lg:flex-row">
            {/* 文章主体 */}
            <article className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1">
              <div className="rounded-xl bg-white p-8 shadow-md">
                {/* 标题 */}
                <h1 className="mb-6 text-center font-serif text-3xl font-bold text-[#333]">
                  {newsDetail.title}
                </h1>

                {/* 元信息 */}
                <div className="mb-8 flex flex-wrap items-center justify-center gap-6 border-b border-[#E8DCC8] pb-6 text-sm text-[#666]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-[#8B1A1A]" />
                    {newsDetail.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-[#8B1A1A]" />
                    {newsDetail.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4 text-[#8B1A1A]" />
                    阅读 {newsDetail.views}
                  </span>
                  <span className="rounded bg-[#D4AF37]/20 px-2 py-0.5 text-xs font-medium text-[#8B1A1A]">
                    {newsDetail.category}
                  </span>
                </div>

                {/* 封面图 */}
                <div className="mb-8 overflow-hidden rounded-xl">
                  <Image
                    src={newsDetail.image}
                    alt={newsDetail.title}
                    width={1200}
                    height={600}
                    className="w-full object-cover"
                  />
                </div>

                {/* 正文 */}
                <div
                  className="prose prose-lg max-w-none text-[#555]"
                  dangerouslySetInnerHTML={{ __html: newsDetail.content }}
                />

                {/* 工具栏 */}
                <div className="mt-10 flex items-center justify-between border-t border-[#E8DCC8] pt-6">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 rounded-lg bg-[#F8F4ED] px-4 py-2 text-sm text-[#666] transition-colors hover:bg-[#8B1A1A] hover:text-white">
                      <Share2 className="h-4 w-4" />
                      分享
                    </button>
                    <button className="flex items-center gap-2 rounded-lg bg-[#F8F4ED] px-4 py-2 text-sm text-[#666] transition-colors hover:bg-[#8B1A1A] hover:text-white">
                      <Printer className="h-4 w-4" />
                      打印
                    </button>
                  </div>
                </div>

                {/* 上下篇导航 */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <Link
                    href="/news/0"
                    className="group flex items-center gap-3 rounded-lg bg-[#F8F4ED] p-4 transition-colors hover:bg-[#8B1A1A]"
                  >
                    <ArrowLeft className="h-5 w-5 text-[#8B1A1A] transition-colors group-hover:text-white" />
                    <div>
                      <div className="text-xs text-[#999] transition-colors group-hover:text-white/70">
                        上一篇
                      </div>
                      <div className="line-clamp-1 text-sm font-medium text-[#333] transition-colors group-hover:text-white">
                        校园安全教育周活动圆满结束
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/news/2"
                    className="group flex items-center justify-end gap-3 rounded-lg bg-[#F8F4ED] p-4 text-right transition-colors hover:bg-[#8B1A1A]"
                  >
                    <div>
                      <div className="text-xs text-[#999] transition-colors group-hover:text-white/70">
                        下一篇
                      </div>
                      <div className="line-clamp-1 text-sm font-medium text-[#333] transition-colors group-hover:text-white">
                        高三年级二模考试成绩分析会顺利召开
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-[#8B1A1A] transition-colors group-hover:text-white" />
                  </Link>
                </div>
              </div>
            </article>

            {/* 侧边栏 */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* 相关新闻 */}
                <div className="rounded-xl bg-white p-6 shadow-md">
                  <h3 className="mb-4 border-b-2 border-[#8B1A1A] pb-3 font-bold text-[#333]">
                    相关新闻
                  </h3>
                  <div className="space-y-4">
                    {relatedNews.map((news) => (
                      <Link
                        key={news.id}
                        href={`/news/${news.id}`}
                        className="group block"
                      >
                        <h4 className="line-clamp-2 text-sm text-[#555] transition-colors group-hover:text-[#8B1A1A]">
                          {news.title}
                        </h4>
                        <div className="mt-1 text-xs text-[#999]">{news.date}</div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* 返回列表 */}
                <Link
                  href="/news"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#8B1A1A] py-4 font-medium text-white transition-colors hover:bg-[#6B1010]"
                >
                  <ArrowLeft className="h-5 w-5" />
                  返回新闻列表
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
