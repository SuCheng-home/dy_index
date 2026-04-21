import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { Calendar, Eye, User, Share2, Printer, ArrowLeft, ArrowRight } from "lucide-react"
import { NEWS_DATA } from "@/lib/news-data"
import { notFound } from "next/navigation"

const buildArticleContent = (summary: string) => `
  <p>${summary}</p>
  <p>学校相关部门围绕本次工作主题组织了专题研讨，进一步明确了责任分工和推进节奏，确保各项任务可执行、可检查、可复盘。</p>
  <p>下一阶段，学校将持续跟进落实情况，强化过程管理与质量评估，以更高标准推动教育教学和校园治理协同提升。</p>
`

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const newsId = Number(id)
  const currentIndex = NEWS_DATA.findIndex((item) => item.id === newsId)

  if (currentIndex === -1) {
    notFound()
  }

  const newsDetail = NEWS_DATA[currentIndex]
  const prevNews = currentIndex > 0 ? NEWS_DATA[currentIndex - 1] : null
  const nextNews = currentIndex < NEWS_DATA.length - 1 ? NEWS_DATA[currentIndex + 1] : null
  const relatedNews = NEWS_DATA.filter(
    (item) => item.category === newsDetail.category && item.id !== newsDetail.id
  ).slice(0, 3)

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
                    校办
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
                  dangerouslySetInnerHTML={{ __html: buildArticleContent(newsDetail.summary) }}
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
                    href={prevNews ? `/news/${prevNews.id}` : "/news"}
                    className="group flex items-center gap-3 rounded-lg bg-[#F8F4ED] p-4 transition-colors hover:bg-[#8B1A1A]"
                  >
                    <ArrowLeft className="h-5 w-5 text-[#8B1A1A] transition-colors group-hover:text-white" />
                    <div>
                      <div className="text-xs text-[#999] transition-colors group-hover:text-white/70">
                        上一篇
                      </div>
                      <div className="line-clamp-1 text-sm font-medium text-[#333] transition-colors group-hover:text-white">
                        {prevNews ? prevNews.title : "暂无上一篇"}
                      </div>
                    </div>
                  </Link>
                  <Link
                    href={nextNews ? `/news/${nextNews.id}` : "/news"}
                    className="group flex items-center justify-end gap-3 rounded-lg bg-[#F8F4ED] p-4 text-right transition-colors hover:bg-[#8B1A1A]"
                  >
                    <div>
                      <div className="text-xs text-[#999] transition-colors group-hover:text-white/70">
                        下一篇
                      </div>
                      <div className="line-clamp-1 text-sm font-medium text-[#333] transition-colors group-hover:text-white">
                        {nextNews ? nextNews.title : "暂无下一篇"}
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
