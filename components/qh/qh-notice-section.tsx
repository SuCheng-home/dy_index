'use client';

import Image from 'next/image';
import { Bell } from 'lucide-react';

export function QhNoticeSection() {
  const notices = [
    {
      date: '15',
      month: '04',
      year: '2024',
      title: '2024年春季招生报名已开始',
      excerpt: '欢迎广大学生家长咨询报名，咨询电话：0511-XXXX-XXXX',
    },
    {
      date: '12',
      month: '04',
      year: '2024',
      title: '校园安全教育周启动',
      excerpt: '为深化平安校园建设，学校组织全校师生开展安全教育专题活动。',
    },
    {
      date: '10',
      month: '04',
      year: '2024',
      title: '教职工体检时间安排',
      excerpt: '2024年度教职工体检定于4月20日至25日进行，请各位教职工按时参加。',
    },
    {
      date: '08',
      month: '04',
      year: '2024',
      title: '信息技术教学设备升级完成',
      excerpt: '学校成功升级计算机教室设备，为师生提供更好的教学体验。',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto py-20 px-8 relative">
      {/* 背景底图 */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Image
          src="/qh/campus-landmark.jpg"
          alt=""
          fill
          className="object-cover"
          loading="lazy"
        />
      </div>

      {/* 半透明覆盖 */}
      <div
        className="absolute inset-0 opacity-80 pointer-events-none"
        style={{ backgroundColor: '#F5F7FA' }}
      />

      {/* 校徽水印 */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: 0.04 }}
      >
        <span className="text-9xl font-serif font-bold" style={{ color: '#19376D' }}>
          丹
        </span>
      </div>

      <div className="relative z-10">
        {/* 模块标题 */}
        <div className="flex items-center gap-2 mb-10">
          <Bell size={32} style={{ color: '#19376D' }} />
          <h3 className="font-serif text-3xl font-bold" style={{ color: '#121212' }}>
            通知公告
          </h3>
          <span className="text-sm" style={{ color: '#666666' }}>
            Notice
          </span>
        </div>

        {/* 卡片网格 - 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {notices.map((notice, index) => (
            <div
              key={index}
              className="rounded-2xl border backdrop-blur-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden cursor-pointer"
              style={{
                borderColor: 'rgba(25, 55, 109, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              {/* 右上角品牌色角标装饰 */}
              <div
                className="absolute top-0 right-0 w-10 h-10"
                style={{
                  background:
                    'linear-gradient(135deg, #19376D 0%, #19376D 50%, transparent 50%)',
                  borderRadius: '0 16px 0 0',
                }}
              />

              {/* 内容 */}
              <div className="flex gap-4 items-start">
                {/* 左侧日期 */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <h4
                    className="font-bold text-2xl"
                    style={{ color: '#19376D' }}
                  >
                    {notice.date}
                  </h4>
                  <p
                    className="text-sm font-medium"
                    style={{ color: '#666666' }}
                  >
                    {notice.month}月{notice.year}
                  </p>
                </div>

                {/* 右侧内容 */}
                <div>
                  <h4
                    className="font-serif font-bold text-xl"
                    style={{ color: '#121212' }}
                  >
                    {notice.title}
                  </h4>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: '#666666' }}
                  >
                    {notice.excerpt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
