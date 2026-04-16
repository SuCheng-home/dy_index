'use client';

import { GraduationCap, Users, Trophy, Building, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const stats = [
  {
    icon: GraduationCap,
    number: 15,
    unit: '位',
    label: '正高级教师',
  },
  {
    icon: Users,
    number: 186,
    unit: '位',
    label: '高级教师',
  },
  {
    icon: Trophy,
    number: 12,
    unit: '枚',
    label: '学科竞赛金牌',
  },
  {
    icon: Building,
    number: 56,
    unit: '个',
    label: '学生社团',
  },
  {
    icon: BookOpen,
    number: 128,
    unit: '门',
    label: '选修课程',
  },
];

export function QhAchievementSection() {
  return (
    <section className="bg-white py-20">
      {/* 顶部统计区 */}
      <div className="max-w-6xl mx-auto px-8 mb-20">
        {/* 标题 */}
        <div className="text-center mb-4">
          <h2 className="text-3xl font-serif font-bold" style={{ color: '#5B2C6F' }}>
            入读丹中
          </h2>
        </div>
        <p className="text-center text-sm leading-relaxed mb-16 max-w-3xl mx-auto" style={{ color: '#666' }}>
          "以天下为己任的使命感和责任感，做时代向上、向善的力量，坚定理想信念，追求真理，崇高学术，崇尚团队，追求卓越"
          <br />
          是代代丹中人的精神长相！
        </p>

        {/* 统计图标 */}
        <div className="flex justify-center gap-8 lg:gap-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex flex-col items-center group">
                {/* 圆形图标容器 - 虚线边框 */}
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110"
                  style={{
                    border: '2px dashed #5B2C6F',
                  }}
                >
                  <Icon size={36} strokeWidth={1.5} style={{ color: '#5B2C6F' }} />
                </div>
                {/* 数字 */}
                <div className="flex items-baseline gap-0.5 mb-1">
                  <span className="text-2xl font-bold" style={{ color: '#5B2C6F' }}>
                    {stat.number}
                  </span>
                  <span className="text-sm" style={{ color: '#5B2C6F' }}>
                    {stat.unit}
                  </span>
                </div>
                {/* 标签 */}
                <span className="text-sm" style={{ color: '#666' }}>
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 底部招生信息区 */}
      <div className="relative h-[420px] flex">
        {/* 左侧蓝图背景区 */}
        <div 
          className="w-[400px] flex-shrink-0 relative overflow-hidden"
          style={{ backgroundColor: '#19376D' }}
        >
          {/* 蓝图装饰 - 使用CSS绘制网格线条 */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
          {/* 装饰性建筑线条 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/10 text-[120px] font-serif font-bold">丹</div>
          </div>
          
          {/* 招生入口链接 */}
          <div className="absolute bottom-20 left-0 right-0 px-12 space-y-6">
            <Link 
              href="#" 
              className="flex items-center gap-3 text-white text-lg font-medium transition-all duration-300 hover:translate-x-2 group"
            >
              初升高
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link 
              href="#" 
              className="flex items-center gap-3 text-white text-lg font-medium transition-all duration-300 hover:translate-x-2 group"
            >
              国际部招生
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* 右侧图片区 */}
        <div className="flex-1 relative overflow-hidden">
          <Image
            src="/view/view6.jpg"
            alt="丹阳高中学生"
            fill
            className="object-cover"
          />
          {/* 办学传统文字叠加 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="p-8 rounded-lg text-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
            >
              <div className="text-sm mb-2" style={{ color: '#5B2C6F' }}>办学传统</div>
              <div className="space-y-1">
                <p className="text-2xl font-serif font-bold" style={{ color: '#8B1A1A' }}>启迪有方</p>
                <p className="text-2xl font-serif font-bold" style={{ color: '#8B1A1A' }}>治学严谨</p>
                <p className="text-2xl font-serif font-bold" style={{ color: '#8B1A1A' }}>爱生育人</p>
              </div>
            </div>
          </div>
        </div>

        {/* 最右侧品牌色块 */}
        <div 
          className="w-20 flex-shrink-0"
          style={{ backgroundColor: '#5B2C6F' }}
        />
      </div>
    </section>
  );
}
