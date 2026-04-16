'use client';

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
    <header
      className="fixed top-0 left-0 right-0 z-40 shadow-sm"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        {/* 左侧品牌区 */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* 校徽 */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{
              background: 'linear-gradient(135deg, #19376D 0%, #2C5AA0 100%)',
            }}
          >
            丹
          </div>

          <div>
            <h2
              className="font-serif font-bold text-lg"
              style={{ color: '#121212' }}
            >
              江苏省丹阳高级中学
            </h2>
            <p className="text-xs" style={{ color: '#666666' }}>
              JIANGSU DANYANG SENIOR HIGH SCHOOL
            </p>
          </div>
        </div>

        {/* 中间导航区 */}
        <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium transition-colors duration-300"
              style={{ color: '#333333' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#19376D';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#333333';
              }}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* 右侧快捷链接 */}
        <div className="flex items-center gap-4 text-sm flex-shrink-0" style={{ color: '#333333' }}>
          <a
            href="#"
            className="transition-colors duration-300"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#19376D';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#333333';
            }}
          >
            学校主页
          </a>
          <span style={{ color: '#E5E7EB' }}>|</span>
          <a
            href="#"
            className="transition-colors duration-300"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#19376D';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#333333';
            }}
          >
            EN
          </a>
        </div>
      </div>
    </header>
  );
}
