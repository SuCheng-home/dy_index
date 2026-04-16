'use client';

import { Trophy, ArrowRight } from 'lucide-react';

export function QhAchievementSection() {
  const achievements = [
    {
      title: '教学管理',
      items: [
        { year: '2024', text: '获评江苏省"五星级高中"' },
        { year: '2023', text: '高考一本上线率95.8%' },
        { year: '2023', text: '物理、化学学科基地评定通过' },
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
        { year: '2024', text: '省特级教师数量达3人' },
        { year: '2023', text: '省名师工作室正式建立' },
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
    <section className="max-w-7xl mx-auto py-20 px-8">
      {/* 模块标题 */}
      <div className="flex items-center gap-2 mb-10">
        <Trophy size={32} style={{ color: '#5B2C6F' }} />
        <h3 className="font-serif text-3xl font-bold" style={{ color: '#121212' }}>
          办学成果
        </h3>
        <span className="text-sm" style={{ color: '#666666' }}>
          Achievements
        </span>
      </div>

      {/* 内容网格 - 非对称权重布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {achievements.map((section, index) => (
          <div key={index} className={section.span}>
            <div
              className="rounded-2xl border backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col"
              style={{
                borderColor: 'rgba(91, 44, 111, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              {/* 标题 */}
              <h4
                className="font-serif font-bold text-xl pb-4 border-b mb-6"
                style={{ color: '#5B2C6F', borderColor: 'rgba(91, 44, 111, 0.2)' }}
              >
                {section.title}
              </h4>

              {/* 成果列表 */}
              <div className={`flex-1 ${section.span === 'lg:col-span-12' ? 'grid grid-cols-1 md:grid-cols-3 gap-4' : 'flex flex-col gap-4'}`}>
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex gap-3 items-start">
                    <div className="flex-shrink-0 mt-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: '#5B2C6F' }}
                    />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-medium mb-1"
                        style={{ color: '#666666' }}
                      >
                        {item.year}
                      </p>
                      <p
                        className="text-sm leading-relaxed line-clamp-2"
                        style={{ color: '#333333' }}
                      >
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 查看详情按钮 */}
              <button
                className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-300 self-start"
                style={{ color: '#5B2C6F' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(91, 44, 111, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                查看更多
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
