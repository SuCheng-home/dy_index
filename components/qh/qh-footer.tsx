'use client';

import { MapPin, Phone, Mail } from 'lucide-react';

export function QhFooter() {
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
    <footer className="w-full text-white py-16" style={{ backgroundColor: '#121212' }}>
      <div className="max-w-7xl mx-auto px-8">
        {/* 上半部分 - 导航链接 */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-10 pb-10 border-b border-white/10">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm transition-colors duration-300"
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#B8860B';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
              }}
            >
              {item}
            </a>
          ))}
        </div>

        {/* 中间部分 - 三栏信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 pb-10 border-b border-white/10">
          {/* 左侧：品牌标识 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{
                  background: 'linear-gradient(135deg, #B8860B 0%, #8B6914 100%)',
                }}
              >
                丹
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-white">
                  江苏省丹阳高级中学
                </h3>
                <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  JIANGSU DANYANG SENIOR HIGH SCHOOL
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              江苏省四星级公办重点中学，秉承"立德树人、笃学创新"的办学理念，致力于培养德智体美劳全面发展的社会主义建设者和接班人。
            </p>
          </div>

          {/* 中间：联系信息 */}
          <div>
            <h4 className="font-serif font-bold text-sm mb-4" style={{ color: '#B8860B' }}>
              联系我们
            </h4>
            <div className="flex flex-col gap-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                <p>江苏省丹阳市开发区横塘路168号</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <a
                  href="tel:0511-XXXX-XXXX"
                  className="transition-colors duration-300"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#B8860B';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}
                >
                  0511-XXXX-XXXX
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a
                  href="mailto:info@dyhs.com"
                  className="transition-colors duration-300"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#B8860B';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}
                >
                  info@dyhs.com
                </a>
              </div>
            </div>
          </div>

          {/* 右侧：新媒体矩阵 */}
          <div>
            <h4 className="font-serif font-bold text-sm mb-4" style={{ color: '#B8860B' }}>
              新媒体矩阵
            </h4>
            <div className="flex flex-col gap-3 text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              <p>关注我们的官方账号，获取最新校园资讯</p>
              <div className="flex items-center gap-4 mt-2">
                {/* 微信 */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-medium transition-colors duration-300 cursor-pointer"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  微信
                </div>
                {/* 微博 */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-medium transition-colors duration-300 cursor-pointer"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  微博
                </div>
                {/* 抖音 */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-medium transition-colors duration-300 cursor-pointer"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  抖音
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 最底部 - 版权信息 */}
        <div className="text-center text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          <p>
            {'© 2024 江苏省丹阳高级中学 | 苏ICP备XXXXXXXX号 | 苏公网安备 32118XXXXX'}
          </p>
        </div>
      </div>
    </footer>
  );
}
