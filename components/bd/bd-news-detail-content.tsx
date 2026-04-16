'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Calendar, Eye, Share2, Printer } from 'lucide-react'

const newsDatabase: Record<string, {
  title: string
  date: string
  category: string
  views: number
  image: string
  content: string[]
  prevId?: string
  prevTitle?: string
  nextId?: string
  nextTitle?: string
}> = {
  '1': {
    title: '国际信息学奥林匹克竞赛（IOI）主席一行到访丹阳高中指导工作',
    date: '2026-03-18',
    category: '校园新闻',
    views: 1256,
    image: '/bd/news-1.jpg',
    content: [
      '3月18日，国际信息学奥林匹克竞赛（IOI）组委会主席一行莅临我校参观指导，就信息学竞赛教学、人才培养等方面进行了深入交流。',
      '校长张建国代表学校对来宾表示热烈欢迎，并详细介绍了学校信息学竞赛的发展历程和取得的优异成绩。近年来，我校学生在各级信息学竞赛中屡获佳绩，多名学子获得全国一等奖并被顶尖高校录取。',
      'IOI主席对我校信息学教育给予了高度评价，认为学校在培养学生计算思维和创新能力方面做出了卓越贡献。双方就未来合作交流达成了初步共识，将在国际竞赛交流、师资培训等方面开展深入合作。',
      '此次访问是我校国际化办学的重要里程碑，标志着学校在信息学教育领域的影响力进一步提升。学校将以此为契机，继续深化信息学课程改革，为培养更多科技创新人才奠定坚实基础。',
    ],
    nextId: '2',
    nextTitle: '数学之趣，在探索中遇见希望——丹阳高中第三届数学文化节',
  },
  '2': {
    title: '数学之趣，在探索中遇见希望——丹阳高中第三届数学文化节圆满举办',
    date: '2026-03-16',
    category: '校园新闻',
    views: 982,
    image: '/bd/news-2.jpg',
    content: [
      '为激发学生数学学习兴趣，感受数学之美，3月16日，江苏省丹阳高级中学成功举办第三届数学文化节。活动以"探索与发现"为主题，设置了数学建模、趣味竞赛、数学史展览等多项内容。',
      '本次文化节吸引了全校师生的广泛参与。在数学建模环节，同学们以小组为单位，运用数学知识解决实际问题，展现了出色的数学思维和团队协作能力。',
      '趣味数学竞赛环节精彩纷呈，从经典的数独挑战到创新的数学接力赛，每一项活动都充满了智慧与欢乐。数学史展览让同学们了解了数学发展的辉煌历程，感受到了数学家们不懈探索的精神。',
    ],
    prevId: '1',
    prevTitle: '国际信息学奥林匹克竞赛（IOI）主席一行到访丹阳高中指导工作',
    nextId: '3',
    nextTitle: '提升管理质效 聚势向新而行 | 丹阳高中教育集团召开2026年寒假战略研讨会',
  },
  '3': {
    title: '提升管理质效 聚势向新而行 | 丹阳高中教育集团召开2026年寒假战略研讨会',
    date: '2026-03-05',
    category: '学校要闻',
    views: 1543,
    image: '/bd/hero-2.jpg',
    content: [
      '春归万物生，策马启新程。为深入贯彻全国教育大会精神，总结2025年办学成果，部署新学期工作，凝聚共识、砥砺奋进，丹阳高中教育集团相继召开寒假战略研讨会。',
      '研讨会上，各部门负责人就2025年工作进行了全面总结，并对2026年重点工作进行了部署。会议强调，要以"苦炼内功，提升品质，凝心聚力，再创辉煌"为主题，持续推进教育教学改革。',
      '校长在总结讲话中指出，全体教职工要紧抓教育高质量发展的历史机遇，不断提升教育教学水平，努力将学校建设成为国内一流、国际知名的现代化示范高中。',
    ],
    prevId: '2',
    prevTitle: '数学之趣，在探索中遇见希望——丹阳高中第三届数学文化节',
  },
}

const defaultNews = {
  title: '丹阳高级中学新闻',
  date: '2026-04-16',
  category: '校园新闻',
  views: 100,
  image: '/bd/hero-1.jpg',
  content: ['新闻内容正在更新中，敬请期待。'],
}

export default function BdNewsDetailContent({ id }: { id: string }) {
  const news = newsDatabase[id] || defaultNews

  return (
    <main className="pt-[128px]" style={{ backgroundColor: '#fff' }}>
      <div className="max-w-[900px] mx-auto px-8 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-10" style={{ color: '#999' }}>
          <Link href="/bd" className="transition-colors duration-300 hover:text-[#8B1A1A]">
            首页
          </Link>
          <span>/</span>
          <Link href="/bd#news" className="transition-colors duration-300 hover:text-[#8B1A1A]">
            新闻公告
          </Link>
          <span>/</span>
          <span style={{ color: '#555' }}>正文</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl font-serif font-bold leading-relaxed mb-6" style={{ color: '#222' }}>
          {news.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-6 pb-6 border-b mb-8" style={{ borderColor: '#eee' }}>
          <div className="flex items-center gap-2">
            <Calendar size={14} style={{ color: '#999' }} />
            <span className="text-sm" style={{ color: '#999' }}>{news.date}</span>
          </div>
          <span
            className="px-3 py-0.5 rounded-sm text-xs"
            style={{ backgroundColor: 'rgba(139,26,26,0.08)', color: '#8B1A1A' }}
          >
            {news.category}
          </span>
          <div className="flex items-center gap-2">
            <Eye size={14} style={{ color: '#999' }} />
            <span className="text-sm" style={{ color: '#999' }}>{news.views} 次浏览</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button
              className="flex items-center gap-1 text-sm transition-colors duration-300 hover:text-[#8B1A1A]"
              style={{ color: '#999' }}
            >
              <Share2 size={14} />
              分享
            </button>
            <button
              className="flex items-center gap-1 text-sm transition-colors duration-300 hover:text-[#8B1A1A]"
              style={{ color: '#999' }}
              onClick={() => window.print()}
            >
              <Printer size={14} />
              打印
            </button>
          </div>
        </div>

        {/* Featured image */}
        <div className="relative w-full mb-10 rounded-sm overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="space-y-6 mb-16">
          {news.content.map((paragraph, index) => (
            <p
              key={index}
              className="text-[15px] leading-[2] indent-8"
              style={{ color: '#444' }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Prev / Next navigation */}
        <div className="border-t pt-8 flex items-center justify-between" style={{ borderColor: '#eee' }}>
          {news.prevId ? (
            <Link
              href={`/bd/news/${news.prevId}`}
              className="flex items-center gap-2 text-sm transition-colors duration-300 hover:text-[#8B1A1A] max-w-[45%] group"
              style={{ color: '#666' }}
            >
              <ChevronLeft size={16} className="flex-shrink-0 transition-transform duration-300 group-hover:-translate-x-1" />
              <span className="line-clamp-1">{news.prevTitle}</span>
            </Link>
          ) : (
            <span />
          )}
          {news.nextId ? (
            <Link
              href={`/bd/news/${news.nextId}`}
              className="flex items-center gap-2 text-sm transition-colors duration-300 hover:text-[#8B1A1A] max-w-[45%] text-right group"
              style={{ color: '#666' }}
            >
              <span className="line-clamp-1">{news.nextTitle}</span>
              <ChevronRight size={16} className="flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </main>
  )
}
