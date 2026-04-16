import type { Metadata } from 'next'
import BdHeader from '@/components/bd/bd-header'
import BdFooter from '@/components/bd/bd-footer'
import BdNewsDetailContent from '@/components/bd/bd-news-detail-content'

export const metadata: Metadata = {
  title: '新闻详情 - 江苏省丹阳高级中学',
  description: '江苏省丹阳高级中学新闻详情页',
}

export default async function BdNewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff' }}>
      <BdHeader />
      <BdNewsDetailContent id={id} />
      <BdFooter />
    </div>
  )
}
