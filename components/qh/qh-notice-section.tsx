'use client';

import { Bell } from 'lucide-react';

export function QhNoticeSection() {
  const notices = [
    {
      date: '15',
      month: '04',
      title: '2024年春季招生报名已开始',
      excerpt: '欢迎广大学生家长咨询报名，咨询电话：0511-XXXX-XXXX',
    },
    {
      date: '12',
      month: '04',
      title: '校园安全教育周启动',
      excerpt: '为深化平安校园建设，学校组织全校师生开展安全教育专题活动。',
    },
    {
      date: '10',
      month: '04',
      title: '教职工体检时间安排',
      excerpt: '2024年度教职工体检定于4月20日-25日进行，请按时参加。',
    },
    {
      date: '08',
      month: '04',
      title: '信息技术教学设备升级完成',
      excerpt: '学校成功升级计算机教室设备，为师生提供更好的教学体验。',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto py-20 px-8 relative">
      {/* 背景图 */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1516534775068-bb57f764d541?w=1920&h=1080&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* 半透明背景覆盖 */}
      <div
        className="absolute inset-0 opacity-80"
        style={{ backgroundColor: '#F5F7FA' }}
      />

      {/* 校徽水印 */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 text-8xl font-serif font-bold pointer-events-none">
        丹
      </div>

      <div className="relative z-10">
        {/* 模块标题 */}
        <div className="flex items-center gap-3 mb-10">
          <Bell size={32} style={{ color: '#19376D' }} />
          <h3 className="font-serif text-3xl font-bold text-[#121212]">通知公告</h3>
          <span className="text-sm text-[#666666]">Notice</span>
        </div>

        {/* 卡片网格 - 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {notices.map((notice, index) => (
            <div
              key={index}
              className="rounded-3xl border border-[#19376D]/20 bg-white/90 backdrop-blur-sm p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
            >
              {/* 右上角装饰角标 */}
              <div
                className="absolute top-0 right-0 w-12 h-12"
                style={{
                  background: 'linear-gradient(135deg, #19376D 0%, #19376D 50%, transparent 50%)',
                  borderRadius: '0 20px 0 0',
                }}
              />

              {/* 内容 */}
              <div className="flex gap-6">
                {/* 左侧日期 */}
                <div className="flex flex-col items-center gap-0 flex-shrink-0">
                  <h4 className="font-bold text-3xl text-[#19376D]">{notice.date}</h4>
                  <p className="text-xs text-[#666666] font-medium">{notice.month}月</p>
                </div>

                {/* 右侧内容 */}
                <div className="flex-1">
                  <h4 className="font-serif font-bold text-lg text-[#121212] mb-2">
                    {notice.title}
                  </h4>
                  <p className="text-[#666666] text-sm leading-relaxed">
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
