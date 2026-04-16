import type { Metadata } from 'next'
import BdHeader from '@/components/bd/bd-header'
import BdHero from '@/components/bd/bd-hero'
import BdNewsSection from '@/components/bd/bd-news-section'
import BdHistorySection from '@/components/bd/bd-history-section'
import BdStatsSection from '@/components/bd/bd-stats-section'
import BdTeacherSection from '@/components/bd/bd-teacher-section'
import BdStudentLife from '@/components/bd/bd-student-life'
import BdFooter from '@/components/bd/bd-footer'

export const metadata: Metadata = {
  title: '江苏省丹阳高级中学 - 北大附中风格',
  description: '江苏省丹阳高级中学官网首页，创建于1941年，前身为私立正则中学，是一所具有深厚历史底蕴的江苏省四星级高中。',
}

export default function BdPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff' }}>
      <BdHeader />
      <BdHero />
      <BdNewsSection />
      <BdStatsSection />
      <BdHistorySection />
      <BdTeacherSection />
      <BdStudentLife />
      <BdFooter />
    </div>
  )
}
