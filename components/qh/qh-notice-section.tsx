'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bell, ArrowRight } from 'lucide-react';

const notices = [
  { id: 'n1', day: '05', month: '07', year: '2025', title: '假期开出国成绩通知说明', excerpt: '2025年7月7日—8月31日暑假期间，可通过邮箱申请学生出国成绩单。' },
  { id: 'n2', day: '04', month: '07', year: '2025', title: '"安全接送·文明交通"倡议书', excerpt: '安全接送·文明交通' },
  { id: 'n3', day: '16', month: '01', year: '2025', title: '江苏省丹阳高级中学在读证明（出境/出国使用）填写及下载指南', excerpt: '在读证明填写及下载指南' },
  { id: 'n4', day: '01', month: '09', year: '2024', title: '关于申请出具毕业证英文翻译版的说明', excerpt: '关于申请出具毕业证英文翻译版的说明' },
];

export function QhNoticeSection() {
  return (
    <section className="w-full py-16 relative overflow-hidden">
      {/* 左侧背景图区域 - 校园标志建筑 */}
      <div className="absolute left-0 top-0 bottom-0 w-1/3 hidden lg:block">
        <Image
          src="/qh/campus-landmark.jpg"
          alt="校园风光"
          fill
          className="object-cover"
        />
        {/* 浅紫色叠加 */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(91, 44, 111, 0.1)' }} />
      </div>

      {/* 中间校徽水印 */}
      <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-64 h-64 hidden lg:flex items-center justify-center opacity-10">
        <div className="w-full h-full rounded-full border-8 flex items-center justify-center" style={{ borderColor: '#5B2C6F' }}>
          <span className="font-serif text-6xl font-bold" style={{ color: '#5B2C6F' }}>丹高</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-12 gap-8">
          {/* 左侧留空（背景图区域）*/}
          <div className="hidden lg:block lg:col-span-4" />

          {/* 右侧内容区 */}
          <div className="col-span-12 lg:col-span-8">
            {/* 模块标题 */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(91, 44, 111, 0.1)' }}>
                <Bell size={24} style={{ color: '#5B2C6F' }} />
              </div>
              <div>
                <h3 className="font-serif text-3xl font-bold" style={{ color: '#121212' }}>
                  通知<span className="text-sm font-normal ml-1" style={{ color: '#E91E63' }}>Notice</span>公告
                </h3>
              </div>
            </div>

            {/* 通知卡片 2x2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notices.map((notice) => (
                <Link 
                  href={`/qh/news/${notice.id}`} 
                  key={notice.id}
                  className="group bg-white rounded-lg p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
                  style={{ border: '1px solid rgba(91, 44, 111, 0.1)' }}
                >
                  {/* 右上角 L 型装饰 */}
                  <div className="absolute top-0 right-0 w-6 h-6">
                    <div className="absolute top-0 right-0 w-full h-1" style={{ backgroundColor: '#5B2C6F' }} />
                    <div className="absolute top-0 right-0 w-1 h-full" style={{ backgroundColor: '#5B2C6F' }} />
                  </div>

                  <div className="flex gap-4">
                    {/* 左侧日期 - 竖排 */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <span className="text-3xl font-bold" style={{ color: '#5B2C6F' }}>{notice.day}</span>
                      <span className="text-lg font-medium" style={{ color: '#5B2C6F' }}>{notice.month}</span>
                      <span className="text-sm" style={{ color: '#999' }}>{notice.year}</span>
                    </div>

                    {/* 右侧内容 */}
                    <div className="flex-1 min-w-0 border-l pl-4" style={{ borderColor: 'rgba(91, 44, 111, 0.2)' }}>
                      <h4 className="font-bold text-base group-hover:text-[#5B2C6F] transition-colors line-clamp-2 mb-2" style={{ color: '#121212' }}>
                        {notice.title}
                      </h4>
                      <p className="text-sm text-gray-500 line-clamp-1">{notice.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 查看更多 */}
            <div className="flex justify-end mt-6">
              <Link 
                href="/qh/notice"
                className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#5B2C6F]"
                style={{ color: '#666' }}
              >
                查看全部公告
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
