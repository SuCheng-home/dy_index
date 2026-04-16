'use client';

import Image from 'next/image';

export function QhHeader() {
  const navItems = [
    '校园信息',
    '党建工作',
    '德育之窗',
    '教学管理',
    '教师发展',
    '统群工作',
    '校园服务',
    '国际教育',
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        {/* 左侧品牌区 */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* 校徽占位图 */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#19376D] to-[#2C5AA0] flex items-center justify-center text-white font-bold text-lg">
            丹
          </div>
          
          <div>
            <h2 className="font-serif-title font-bold text-lg text-[#121212]">
              江苏省丹阳高级中学
            </h2>
            <p className="text-xs text-[#666666]">JIANGSU DANYANG SENIOR HIGH SCHOOL</p>
          </div>
        </div>

        {/* 中间导航区 */}
        <nav className="hidden lg:flex items-center gap-8 flex-1 mx-8">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className="text-[#333333] text-sm font-medium hover:text-[#19376D] transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* 右侧快捷链接 */}
        <div className="flex items-center gap-4 text-sm text-[#333333] flex-shrink-0">
          <a href="#" className="hover:text-[#19376D] transition-colors">
            学校主页
          </a>
          <span className="text-[#E5E7EB]">|</span>
          <a href="#" className="hover:text-[#19376D] transition-colors">
            EN
          </a>
        </div>
      </div>
    </header>
  );
}
