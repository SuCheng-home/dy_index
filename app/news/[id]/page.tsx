import Link from "next/link"
import Image from "next/image"
import { Calendar, Eye, User, ArrowLeft, ArrowRight } from "lucide-react"
import { notFound } from "next/navigation"

import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { filterRelatedMessages, getPublicMessagePage } from "@/lib/public-site-data"
import { toMessageHref } from "@/lib/school-web-two"

export const dynamic = "force-dynamic"

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id?: string; messageId?: string }>
}) {
  const { id, messageId: altMessageId } = await params
  const messageId = Number(id ?? altMessageId)
  if (!messageId) notFound()

  const page = await getPublicMessagePage(messageId)
  const message = page.message
  if (!message) notFound()

  const relatedNews = filterRelatedMessages(page.relatedMessages.dataList, message.id)

  return (
    <>
      <Header config={page.config} />
      <div className="min-h-screen bg-[#FDFBF7]">
        <div className="border-b border-[#E8DCC8] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <BreadcrumbNav
              items={[
                { label: page.moduleDetail?.name ?? "新闻中心", href: "/news" },
                { label: message.title },
              ]}
            />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-col gap-10 lg:flex-row">
            <article className="flex-1">
              <div className="rounded-xl bg-white p-8 shadow-md">
                <h1 className="mb-3 text-center font-serif text-3xl font-bold text-[#333]">
                  {message.title}
                </h1>
                {message.titleMark ? (
                  <p className="mb-6 text-center text-base text-[#8B1A1A]">{message.titleMark}</p>
                ) : null}

                <div className="mb-8 flex flex-wrap items-center justify-center gap-6 border-b border-[#E8DCC8] pb-6 text-sm text-[#666]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-[#8B1A1A]" />
                    {message.createTime.slice(0, 16)}
                  </span>
                  {message.createUserName ? (
                    <span className="flex items-center gap-1.5">
                      <User className="h-4 w-4 text-[#8B1A1A]" />
                      {message.createUserName}
                    </span>
                  ) : null}
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4 text-[#8B1A1A]" />
                    阅读 {message.readCount ?? 0}
                  </span>
                </div>

                {message.logoUrl ? (
                  <div className="mb-8 overflow-hidden rounded-xl">
                    <Image
                      src={message.logoUrl}
                      alt={message.title}
                      width={1200}
                      height={600}
                      className="w-full object-cover"
                    />
                  </div>
                ) : null}

                <div
                  className="school-web-richtext prose prose-lg max-w-none text-[#555] [&_img]:h-auto [&_img]:max-w-full [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_video]:max-w-full"
                  dangerouslySetInnerHTML={{ __html: message.content || "<p>暂无正文内容</p>" }}
                />

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <Link
                    href={page.siblings.lastMessage ? toMessageHref(page.siblings.lastMessage.id) : "/news"}
                    className="group flex items-center gap-3 rounded-lg bg-[#F8F4ED] p-4 transition-colors hover:bg-[#8B1A1A]"
                  >
                    <ArrowLeft className="h-5 w-5 text-[#8B1A1A] transition-colors group-hover:text-white" />
                    <div>
                      <div className="text-xs text-[#999] transition-colors group-hover:text-white/70">上一篇</div>
                      <div className="line-clamp-1 text-sm font-medium text-[#333] transition-colors group-hover:text-white">
                        {page.siblings.lastMessage ? page.siblings.lastMessage.title : "暂无上一篇"}
                      </div>
                    </div>
                  </Link>
                  <Link
                    href={page.siblings.nextMessage ? toMessageHref(page.siblings.nextMessage.id) : "/news"}
                    className="group flex items-center justify-end gap-3 rounded-lg bg-[#F8F4ED] p-4 text-right transition-colors hover:bg-[#8B1A1A]"
                  >
                    <div>
                      <div className="text-xs text-[#999] transition-colors group-hover:text-white/70">下一篇</div>
                      <div className="line-clamp-1 text-sm font-medium text-[#333] transition-colors group-hover:text-white">
                        {page.siblings.nextMessage ? page.siblings.nextMessage.title : "暂无下一篇"}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-[#8B1A1A] transition-colors group-hover:text-white" />
                  </Link>
                </div>
              </div>
            </article>

            <aside className="w-full shrink-0 lg:w-80">
              <div className="sticky top-24 space-y-6">
                <div className="rounded-xl bg-white p-6 shadow-md">
                  <h3 className="mb-4 border-b-2 border-[#8B1A1A] pb-3 font-bold text-[#333]">同栏目更多内容</h3>
                  <div className="space-y-4">
                    {relatedNews.map((news) => (
                      <Link key={news.id} href={toMessageHref(news.id)} className="group block">
                        <h4 className="line-clamp-2 text-sm text-[#555] transition-colors group-hover:text-[#8B1A1A]">
                          {news.title}
                        </h4>
                        <div className="mt-1 text-xs text-[#999]">{news.createTime.slice(0, 10)}</div>
                      </Link>
                    ))}
                  </div>
                </div>

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
      <Footer config={page.config} />
    </>
  )
}
