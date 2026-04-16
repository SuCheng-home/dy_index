'use client';

import { useState } from 'react';
import { Search, ChevronDown, Menu, X } from 'lucide-react';
import Link from 'next/link';

interface QhHeaderProps {
  onSearchClick?: () => void;
}

export function QhHeader({ onSearchClick }: QhHeaderProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: '学校概况', children: ['学校简介', '校史沿革', '校园风光', '领导班子', '组织架构'] },
    { name: '校园风貌', children: ['校园环境', '教学设施', '图书馆', '运动场馆', '学生公寓'] },
    { name: '教育科研', children: ['教学动态', '课程建设', '教研成果', '名师工作室', '学术交流'] },
    { name: '情系母校', children: ['校友会', '校友风采', '捐赠鸣谢', '校友活动', '联系方式'] },
    { name: '国际部', children: ['国际课程', '留学项目', '外教团队', '国际交流', '招生咨询'] },
    { name: '人才招聘', children: ['招聘公告', '岗位需求', '应聘流程', '福利待遇', '联系我们'] },
    { name: '招生专栏', children: ['招生简章', '报名须知', '历年分数', '常见问题', '在线咨询'] },
    { name: '智校平台', children: ['教务系统', '成绩查询', '选课平台', '资源中心', '家校互联'] },
  ];

  return (
    <header className="fixed top-0 left-0 right-16 z-40 bg-white shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* 左侧品牌区 - 防止换行 */}
          <Link href="/qh" className="flex items-center gap-3 flex-shrink-0">
            {/* 校徽 */}
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0" style={{ background: 'linear-gradient(135deg, #5B2C6F 0%, #7D3C98 100%)' }}>
              丹
            </div>
            <div className="flex-shrink-0">
              <h1 className="font-serif font-bold text-lg whitespace-nowrap" style={{ color: '#5B2C6F' }}>
                江苏省丹阳高级中学
              </h1>
              <p className="text-[10px] tracking-wider whitespace-nowrap" style={{ color: '#666' }}>
                JIANGSU DANYANG SENIOR HIGH SCHOOL
              </p>
            </div>
          </Link>

          {/* 中间导航区 - 桌面端 */}
          <nav className="hidden xl:flex items-center gap-0.5 flex-1 justify-center">
            {navItems.map((item) => (
              <div 
                key={item.name}
                className="relative"
                onMouseEnter={() => setActiveMenu(item.name)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button
                  className="flex items-center gap-0.5 px-3 py-2 text-sm font-medium transition-all duration-300 whitespace-nowrap"
                  style={{ color: activeMenu === item.name ? '#5B2C6F' : '#333' }}
                >
                  {item.name}
                  <ChevronDown 
                    size={12} 
                    className={`transition-transform duration-300 ${activeMenu === item.name ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* 下拉菜单 */}
                <div 
                  className={`absolute top-full left-0 mt-1 py-2 min-w-36 rounded-lg shadow-xl border bg-white transition-all duration-300 ${
                    activeMenu === item.name ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}
                  style={{ borderColor: 'rgba(91, 44, 111, 0.1)' }}
                >
                  {item.children.map((child) => (
                    <a
                      key={child}
                      href="#"
                      className="block px-4 py-2 text-sm transition-all duration-200 hover:bg-purple-50 hover:text-[#5B2C6F] hover:pl-5"
                      style={{ color: '#333' }}
                    >
                      {child}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a href="#" className="hidden md:block text-xs whitespace-nowrap" style={{ color: '#666' }}>学校主页</a>
            <span className="hidden md:block text-gray-300">|</span>
            <a href="#" className="hidden md:block text-xs whitespace-nowrap" style={{ color: '#666' }}>EN</a>
            
            {/* 搜索按钮 */}
            <button
              onClick={onSearchClick}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-purple-100 ml-2"
            >
              <Search size={18} style={{ color: '#5B2C6F' }} />
            </button>

            {/* 移动端菜单按钮 */}
            <button
              className="xl:hidden p-2 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} style={{ color: '#5B2C6F' }} /> : <Menu size={20} style={{ color: '#5B2C6F' }} />}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      <div 
        className={`xl:hidden absolute top-full left-0 right-0 bg-white shadow-xl transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="py-4 px-6 max-h-[70vh] overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.name} className="border-b border-gray-100">
              <button
                className="w-full py-3 flex justify-between items-center text-sm font-medium"
                style={{ color: '#333' }}
                onClick={() => setActiveMenu(activeMenu === item.name ? null : item.name)}
              >
                {item.name}
                <ChevronDown 
                  size={14} 
                  className={`transition-transform duration-300 ${activeMenu === item.name ? 'rotate-180' : ''}`}
                />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${activeMenu === item.name ? 'max-h-60 pb-3' : 'max-h-0'}`}>
                {item.children.map((child) => (
                  <a key={child} href="#" className="block py-2 pl-4 text-sm text-gray-500 hover:text-[#5B2C6F]">
                    {child}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
