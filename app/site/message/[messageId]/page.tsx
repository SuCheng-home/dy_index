import { notFound } from "next/navigation"

import NewsDetailPage from "@/app/news/[id]/page"

export default async function SiteMessagePage({
  params,
}: {
  params: Promise<{ messageId: string }>
}) {
  const { messageId } = await params
  if (!messageId) notFound()
  return <NewsDetailPage params={Promise.resolve({ messageId })} />
}
