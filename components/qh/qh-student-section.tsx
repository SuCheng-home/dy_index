'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

const studentActivities = [
  {
    id: 1,
    title: '住宿部开展"螺钿生辉·匠心传美"主题活动',
    description: '4月12日晚，丹阳高中住宿部举办"螺钿生辉·匠心传美"螺钿非遗手工体验活动。',
    image: '/view/view1.jpg',
    date: { day: '12', month: '2026-04' },
    size: 'large',
  },
  {
    id: 2,
    title: '每一拍，都是成长的节拍——丹阳高中"班超"羽毛球联赛收官',
    image: '/view/view2.jpg',
    date: { day: '04', month: '2026-04' },
    size: 'medium',
  },
  {
    id: 3,
    title: '四把钥匙解锁认知边界，科技人文共育创新基因——丹阳高中举办四场讲座践行"全面个性开放"育人理念',
    image: '/view/view3.jpg',
    date: { day: '04', month: '2026-04' },
    size: 'small',
  },
  {
    id: 4,
    title: '闪耀夺魁 晋级全球站——丹阳高中学子在学术五项全能2026中国站摘金',
    description: '4月3至6日，学术五项全能研习2026中国站中，丹阳高中44名学子获金牌24枚、银牌16枚、铜牌21枚，两支队伍顺利晋级全球站。',
    image: '/view/view4.jpg',
    date: { day: '06', month: '2026-04' },
    size: 'wide',
  },
];

export function QhStudentSection() {
  const { ref, isRevealed } = useScrollReveal();

  return (
    <section ref={ref} className="w-full py-20 relative" style={{ backgroundColor: '#F8F9FB' }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* 模块标题 */}
        <div 
          className="flex items-center justify-center gap-3 mb-12 transition-all duration-1000"
          style={{
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(91, 44, 111, 0.1)' }}
          >
            <Users size={28} style={{ color: '#5B2C6F' }} />
          </div>
          <div className="text-center">
            <h3 className="font-serif text-4xl font-bold" style={{ color: '#121212' }}>
              学生<span className="text-base font-normal ml-2" style={{ color: '#5B2C6F' }}>Student</span>天地
            </h3>
          </div>
        </div>

        {/* 活动卡片网格 - 参考图中布局 */}
        <div className="grid grid-cols-12 gap-5">
          {/* 第一张大卡片 - 左侧 */}
          <div 
            className="col-span-12 md:col-span-4 transition-all duration-700"
            style={{
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.1s',
            }}
          >
            <Link href="#" className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={studentActivities[0].image}
                  alt={studentActivities[0].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* 日期标签 */}
                <div 
                  className="absolute bottom-4 right-4 px-4 py-2 rounded-lg text-center"
                  style={{ backgroundColor: 'rgba(91, 44, 111, 0.9)' }}
                >
                  <div className="text-2xl font-bold text-white leading-none">{studentActivities[0].date.day}</div>
                  <div className="text-xs text-white/80">{studentActivities[0].date.month}</div>
                </div>
              </div>
              <h4 className="mt-4 text-lg font-bold text-gray-900 group-hover:text-[#5B2C6F] transition-colors line-clamp-2">
                {studentActivities[0].title}
              </h4>
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">{studentActivities[0].description}</p>
            </Link>
          </div>

          {/* 第二张中卡片 - 中间 */}
          <div 
            className="col-span-12 md:col-span-4 transition-all duration-700"
            style={{
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.2s',
            }}
          >
            <Link href="#" className="group block relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={studentActivities[1].image}
                  alt={studentActivities[1].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* 日期标签 - 顶部 */}
                <div 
                  className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-sm"
                  style={{ backgroundColor: 'rgba(91, 44, 111, 0.9)' }}
                >
                  <span className="text-white font-bold">{studentActivities[1].date.day}</span>
                </div>
                {/* 底部标题遮罩 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white text-sm font-medium line-clamp-2">{studentActivities[1].title}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* 第三张小卡片 - 右侧 */}
          <div 
            className="col-span-12 md:col-span-4 transition-all duration-700"
            style={{
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.3s',
            }}
          >
            <Link href="#" className="group block relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={studentActivities[2].image}
                  alt={studentActivities[2].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* 右上角标题遮罩 */}
                <div className="absolute top-0 right-0 bottom-0 w-2/3 p-4 flex flex-col justify-start bg-gradient-to-l from-black/70 via-black/40 to-transparent">
                  <p className="text-white text-sm font-medium leading-relaxed">{studentActivities[2].title}</p>
                </div>
              </div>
            </Link>
          </div>

          {/* 第四张宽卡片 - 下方左侧 */}
          <div 
            className="col-span-12 md:col-span-5 transition-all duration-700"
            style={{
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.4s',
            }}
          >
            <Link href="#" className="group block relative">
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={studentActivities[3].image}
                  alt={studentActivities[3].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* 日期标签 */}
                <div 
                  className="absolute top-4 right-4 px-4 py-2 rounded-lg text-center"
                  style={{ backgroundColor: 'rgba(91, 44, 111, 0.9)' }}
                >
                  <div className="text-2xl font-bold text-white leading-none">{studentActivities[3].date.day}</div>
                  <div className="text-xs text-white/80">{studentActivities[3].date.month}</div>
                </div>
              </div>
            </Link>
          </div>

          {/* 第四张内容描述 - 下方右侧 */}
          <div 
            className="col-span-12 md:col-span-7 flex flex-col justify-center transition-all duration-700"
            style={{
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.5s',
            }}
          >
            <h4 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#5B2C6F] transition-colors">
              {studentActivities[3].title}
            </h4>
            <p className="text-gray-500 leading-relaxed">{studentActivities[3].description}</p>
            <Link 
              href="#" 
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: '#5B2C6F' }}
            >
              查看更多学生活动
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
