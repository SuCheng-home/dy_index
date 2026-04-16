'use client';

import { Trophy, ArrowRight } from 'lucide-react';

export function QhAchievementSection() {
  const achievements = [
    {
      title: '教学管理',
      items: [
        { year: '2024', text: '获评江苏省"五星级高中"' },
        { year: '2023', text: '高考一本上线率95.8%' },
        { year: '2023', text: '物理、化学学科基地评定' },
      ],
      span: 'lg:col-span-6',
    },
    {
      title: '德育之窗',
      items: [
        { year: '2024', text: '全国中小学党建示范校' },
        { year: '2024', text: '江苏省文明校园' },
        { year: '2023', text: '教育实践基地建设项目' },
      ],
      span: 'lg:col-span-3',
    },
    {
      title: '教师发展',
      items: [
        { year: '2024', text: '省特级教师数量3人' },
        { year: '2023', text: '省名师工作室建立' },
        { year: '2023', text: '教学比赛获省一等奖' },
      ],
      span: 'lg:col-span-3',
    },
    {
      title: '国际教育',
      items: [
        { year: '2024', text: '与英国牛津大学合作交流' },
        { year: '2024', text: '国际学生交流项目启动' },
        { year: '2023', text: '获认证为剑桥英语考点' },
      ],
      span: 'lg:col-span-12',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto py-20 px-8 relative">
      <div className="relative z-10">
        {/* 模块标题 */}
        <div className="flex items-center gap-3 mb-10">
          <Trophy size={32} style={{ color: '#19376D' }} />
          <h3 className="font-serif text-3xl font-bold text-[#121212]">办学成果</h3>
          <span className="text-sm text-[#666666]">Achievements</span>
        </div>

        {/* 内容网格 - 非对称权重布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {achievements.map((section, index) => (
            <div key={index} className={`${section.span}`}>
              <div className="rounded-3xl border border-[#19376D]/20 bg-white/80 backdrop-blur-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                {/* 标题 */}
                <h4 className="font-serif font-bold text-xl text-[#19376D] mb-6 pb-4 border-b border-[#19376D]/20">
                  {section.title}
                </h4>

                {/* 成果列表 */}
                <div className="flex-1 space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex gap-3 items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#19376D' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#666666] font-medium mb-1">{item.year}</p>
                        <p className="text-[#333333] text-sm leading-relaxed line-clamp-2">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 查看详情按钮 */}
                <button className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[#19376D] font-medium hover:bg-[#19376D]/5 transition-colors duration-300">
                  查看更多
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
