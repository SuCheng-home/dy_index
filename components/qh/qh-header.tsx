'use client';

import { useState } from 'react';
import { Search, ChevronDown, Menu, X } from 'lucide-react';

interface QhHeaderProps {
  onSearchClick?: () => void;
}

export function QhHeader({ onSearchClick }: QhHeaderProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { 
      name: '校园信息', 
      children: ['学校概况', '校史沿革', '校园风光', '领导班子', '组织架构'] 
    },
    { 
      name: '党建工作', 
      children: ['党建动态', '党务公开', '党员风采', '主题教育', '学习园地'] 
    },
    { 
      name: '德育之窗', 
      children: ['德育动态', '班主任工作', '心理健康', '家校共育', '学生风采'] 
    },
    { 
      name: '教学管理', 
      children: ['教学动态', '课程建设', '教学研究', '考试招生', '教学资源'] 
    },
    { 
      name: '教师发展', 
      children: ['名师风采', '教师培训', '教研活动', '论文著作', '荣誉成果'] 
    },
    { 
      name: '统群工作', 
      children: ['工会工作', '团委工作', '学生会', '社团活动', '志愿服务'] 
    },
    { 
      name: '校园服务', 
      children: ['教务系统', '图书馆', '校园网络', '后勤服务', '安全保卫'] 
    },
    { 
      name: '国际教育', 
      children: ['国际交流', '留学项目', '外教风采', '海外校友', '国际课程'] 
    },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-16 z-40 transition-all duration-300"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', boxShadow: '0 2px 20px rgba(0,0,0,0.08)' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* 左侧品牌区 */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* 校徽 */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md transition-transform duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #19376D 0%, #2C5AA0 100%)',
              }}
            >
              丹
            </div>

            <div>
              <h1
                className="font-serif font-bold text-lg tracking-wide"
                style={{ color: '#121212' }}
              >
                江苏省丹阳高级中学
              </h1>
              <p className="text-xs tracking-wider" style={{ color: '#666666' }}>
                JIANGSU DANYANG SENIOR HIGH SCHOOL
              </p>
            </div>
          </div>

          {/* 中间导航区 - 桌面端 */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navItems.map((item) => (
              <div 
                key={item.name}
                className="relative"
                onMouseEnter={() => setActiveMenu(item.name)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg"
                  style={{ 
                    color: activeMenu === item.name ? '#19376D' : '#333333',
                    backgroundColor: activeMenu === item.name ? 'rgba(25, 55, 109, 0.08)' : 'transparent'
                  }}
                >
                  {item.name}
                  <ChevronDown 
                    size={14} 
                    className={`transition-transform duration-300 ${activeMenu === item.name ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* 下拉菜单 */}
                <div 
                  className={`absolute top-full left-0 mt-1 py-2 min-w-40 rounded-xl shadow-xl border transition-all duration-300 ${
                    activeMenu === item.name ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}
                  style={{ 
                    backgroundColor: '#fff',
                    borderColor: 'rgba(25, 55, 109, 0.1)'
                  }}
                >
                  {item.children.map((child) => (
                    <a
                      key={child}
                      href="#"
                      className="block px-4 py-2.5 text-sm transition-all duration-200"
                      style={{ color: '#333' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(25, 55, 109, 0.06)';
                        e.currentTarget.style.color = '#19376D';
                        e.currentTarget.style.paddingLeft = '20px';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#333';
                        e.currentTarget.style.paddingLeft = '16px';
                      }}
                    >
                      {child}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* 搜索按钮 */}
            <button
              onClick={onSearchClick}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
              style={{ 
                backgroundColor: 'rgba(25, 55, 109, 0.08)',
                color: '#19376D'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#19376D';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(25, 55, 109, 0.08)';
                e.currentTarget.style.color = '#19376D';
              }}
            >
              <Search size={16} />
              <span className="hidden md:inline">搜索</span>
            </button>

            {/* 快捷链接 */}
            <div className="hidden md:flex items-center gap-3 text-sm" style={{ color: '#666' }}>
              <a href="#" className="hover:text-[#19376D] transition-colors duration-300">
                EN
              </a>
            </div>

            {/* 移动端菜单按钮 */}
            <button
              className="lg:hidden p-2 rounded-lg transition-colors duration-300"
              style={{ backgroundColor: 'rgba(25, 55, 109, 0.08)' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} style={{ color: '#19376D' }} /> : <Menu size={20} style={{ color: '#19376D' }} />}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      <div 
        className={`lg:hidden absolute top-full left-0 right-0 shadow-xl transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ backgroundColor: '#fff' }}
      >
        <div className="py-4 px-6 max-h-[70vh] overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.name} className="border-b" style={{ borderColor: 'rgba(25, 55, 109, 0.1)' }}>
              <button
                className="w-full py-4 flex justify-between items-center text-sm font-medium"
                style={{ color: '#333' }}
                onClick={() => setActiveMenu(activeMenu === item.name ? null : item.name)}
              >
                {item.name}
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-300 ${activeMenu === item.name ? 'rotate-180' : ''}`}
                  style={{ color: '#666' }}
                />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  activeMenu === item.name ? 'max-h-60 pb-4' : 'max-h-0'
                }`}
              >
                {item.children.map((child) => (
                  <a
                    key={child}
                    href="#"
                    className="block py-2 pl-4 text-sm transition-colors duration-200"
                    style={{ color: '#666' }}
                  >
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
