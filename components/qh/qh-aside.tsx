'use client';

import { useState } from 'react';
import { Search, Mail, Menu, X, Phone, ArrowUp, QrCode } from 'lucide-react';

interface QhAsideProps {
  onSearchClick?: () => void;
  onFeedbackClick?: () => void;
}

export function QhAside({ onSearchClick, onFeedbackClick }: QhAsideProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: '学校主页', href: '#' },
    { name: '教务系统', href: '#' },
    { name: '学生服务', href: '#' },
    { name: '校园导览', href: '#' },
    { name: '联系我们', href: '#' },
  ];

  return (
    <>
      {/* 右侧固定导航栏 */}
      <aside
        className="fixed right-0 top-0 h-screen w-16 z-50 flex flex-col justify-center items-center gap-6"
        style={{ backgroundColor: '#5B2C6F' }}
      >
        {/* 搜索图标 */}
        <button 
          onClick={onSearchClick}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white/80 transition-all duration-300 hover:text-white hover:bg-white/10 hover:scale-110"
          title="搜索新闻"
        >
          <Search size={20} />
        </button>

        {/* 意见建议箱 */}
        <button 
          onClick={onFeedbackClick}
          className="flex flex-col items-center gap-2 py-3 px-2 rounded-xl text-white/80 transition-all duration-300 hover:text-white hover:bg-white/10 group"
          title="意见建议箱"
        >
          <Mail size={20} className="transition-transform duration-300 group-hover:scale-110" />
          <div className="vertical-text text-xs font-medium tracking-wider">意见建议箱</div>
        </button>

        {/* 分隔线 */}
        <div className="w-8 h-px bg-white/20" />

        {/* 校名竖排 */}
        <div className="flex flex-col items-center justify-center py-3">
          <div 
            className="vertical-text text-xs font-serif font-medium tracking-widest text-center text-white/60"
            style={{ letterSpacing: '6px' }}
          >
            江苏省丹阳高级中学
          </div>
        </div>

        {/* 分隔线 */}
        <div className="w-8 h-px bg-white/20" />

        {/* 快捷菜单 */}
        <button 
          onClick={() => setMenuOpen(true)}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white/80 transition-all duration-300 hover:text-white hover:bg-white/10 hover:scale-110"
          title="快捷菜单"
        >
          <Menu size={20} />
        </button>

        {/* 微信公众号 */}
        <div className="relative">
          <button 
            onMouseEnter={() => setQrVisible(true)}
            onMouseLeave={() => setQrVisible(false)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/80 transition-all duration-300 hover:text-white hover:bg-white/10 hover:scale-110"
            title="关注微信公众号"
          >
            <QrCode size={20} />
          </button>
          
          {/* 二维码弹出框 */}
          <div 
            className={`absolute right-full top-1/2 -translate-y-1/2 mr-4 p-4 rounded-2xl shadow-2xl transition-all duration-300 ${
              qrVisible ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible translate-x-4'
            }`}
            style={{ backgroundColor: '#fff' }}
          >
            <div className="w-32 h-32 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f5f5f5' }}>
              <span className="text-xs text-gray-400 text-center">微信公众号<br/>二维码</span>
            </div>
            <p className="mt-2 text-xs text-center" style={{ color: '#666' }}>扫码关注公众号</p>
            {/* 小箭头 */}
            <div 
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full"
              style={{
                width: 0,
                height: 0,
                borderTop: '8px solid transparent',
                borderBottom: '8px solid transparent',
                borderLeft: '8px solid #fff',
              }}
            />
          </div>
        </div>

        {/* 联系电话 */}
        <a 
          href="tel:0511-86522062"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white/80 transition-all duration-300 hover:text-white hover:bg-white/10 hover:scale-110"
          title="联系电话"
        >
          <Phone size={20} />
        </a>

        {/* 回到顶部 */}
        <button 
          onClick={scrollToTop}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white/80 transition-all duration-300 hover:text-white hover:bg-white/10 hover:scale-110"
          title="回到顶部"
        >
          <ArrowUp size={20} />
        </button>
      </aside>

      {/* 快捷菜单弹出层 */}
      <div 
        className={`fixed inset-0 z-[60] transition-all duration-300 ${
          menuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* 背景遮罩 */}
        <div 
          className={`absolute inset-0 transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setMenuOpen(false)}
        />

        {/* 菜单面板 */}
        <div 
          className={`absolute right-16 top-0 h-full w-80 shadow-2xl transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ backgroundColor: '#fff' }}
        >
          {/* 面板头部 */}
          <div 
            className="h-20 px-6 flex items-center justify-between"
            style={{ backgroundColor: '#5B2C6F' }}
          >
            <h3 className="text-white font-serif font-bold text-lg">快捷导航</h3>
            <button 
              onClick={() => setMenuOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              <X size={20} />
            </button>
          </div>

          {/* 快捷链接 */}
          <div className="p-6">
            <div className="flex flex-col gap-2">
              {quickLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300"
                  style={{ 
                    backgroundColor: 'rgba(91, 44, 111, 0.04)',
                    color: '#333',
                    animationDelay: `${index * 50}ms`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(91, 44, 111, 0.1)';
                    e.currentTarget.style.color = '#5B2C6F';
                    e.currentTarget.style.transform = 'translateX(8px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(91, 44, 111, 0.04)';
                    e.currentTarget.style.color = '#333';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: '#5B2C6F' }}
                  />
                  <span className="font-medium">{link.name}</span>
                </a>
              ))}
            </div>

            {/* 联系信息 */}
            <div className="mt-8 p-4 rounded-xl" style={{ backgroundColor: 'rgba(91, 44, 111, 0.04)' }}>
              <h4 className="font-medium mb-3" style={{ color: '#5B2C6F' }}>联系我们</h4>
              <div className="flex flex-col gap-2 text-sm" style={{ color: '#666' }}>
                <p>地址：江苏省丹阳市新民西路138号</p>
                <p>电话：0511-86522062</p>
                <p>邮编：212300</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
