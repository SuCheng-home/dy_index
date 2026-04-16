'use client';

import { Search, Mail, Menu, MessageCircle } from 'lucide-react';

export function QhAside() {
  return (
    <aside
      className="fixed right-0 top-0 h-screen w-16 z-50 flex flex-col justify-center items-center gap-10 text-white"
      style={{ backgroundColor: '#19376D' }}
    >
      {/* 搜索图标 */}
      <button className="opacity-75 transition-opacity duration-300 hover:opacity-100">
        <Search size={22} />
      </button>

      {/* 意见建议箱 */}
      <button className="flex flex-col items-center gap-2 opacity-75 transition-opacity duration-300 hover:opacity-100">
        <Mail size={22} />
        <div className="vertical-text text-xs font-medium">意见建议箱</div>
      </button>

      {/* 校名竖排 */}
      <div className="flex flex-col items-center justify-center">
        <div className="vertical-text text-xs font-serif font-medium tracking-wider text-center">
          江苏省丹阳高级中学
        </div>
      </div>

      {/* 菜单图标 */}
      <button className="opacity-75 transition-opacity duration-300 hover:opacity-100">
        <Menu size={22} />
      </button>

      {/* 微信图标 */}
      <button className="opacity-75 transition-opacity duration-300 hover:opacity-100">
        <MessageCircle size={22} />
      </button>
    </aside>
  );
}
