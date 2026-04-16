'use client';

import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin } from 'lucide-react';

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
        {/* 导航链接 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-10 pb-10 border-b border-white/10">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm text-white/70 hover:text-[#B8860B] transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </div>

        {/* 中间内容 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 pb-10 border-b border-white/10">
          {/* 左侧：品牌标识 */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B8860B] to-[#8B6914] flex items-center justify-center text-white font-bold text-lg">
                丹
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-white">
                  江苏省丹阳高级中学
                </h3>
                <p className="text-xs text-white/50">JIANGSU DANYANG SENIOR HIGH SCHOOL</p>
              </div>
            </div>
          </div>

          {/* 中间：联系信息 */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#B8860B] mb-3">联系我们</h4>
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                <p>江苏省丹阳市开发区横塘路168号</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:0511-XXXX-XXXX" className="hover:text-[#B8860B] transition-colors">
                  0511-XXXX-XXXX
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:info@dyhs.com" className="hover:text-[#B8860B] transition-colors">
                  info@dyhs.com
                </a>
              </div>
            </div>
          </div>

          {/* 右侧：新媒体 */}
          <div>
            <h4 className="font-serif font-bold text-sm text-[#B8860B] mb-3">新媒体矩阵</h4>
            <div className="flex items-center gap-4">
              <a href="#" className="text-white/70 hover:text-[#B8860B] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-[#B8860B] transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-[#B8860B] transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="text-center text-xs text-white/50">
          <p>
            © 2024 江苏省丹阳高级中学 | 苏ICP备XXXXXXXX号 | 苏公网安备 32118XXXXX
          </p>
        </div>
      </div>
    </footer>
  );
}
