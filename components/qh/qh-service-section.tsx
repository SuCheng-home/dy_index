'use client';

import {
  BookOpen,
  Users,
  MapPin,
  FileText,
  Phone,
  Wifi,
  Clock,
  Settings,
} from 'lucide-react';

export function QhServiceSection() {
  const services = [
    { icon: BookOpen, name: '教务系统', href: '#' },
    { icon: Users, name: '学生服务', href: '#' },
    { icon: MapPin, name: '校园导览', href: '#' },
    { icon: FileText, name: '文件下载', href: '#' },
    { icon: Phone, name: '联系我们', href: '#' },
    { icon: Wifi, name: '校园网络', href: '#' },
    { icon: Clock, name: '校历查询', href: '#' },
    { icon: Settings, name: '更多服务', href: '#' },
  ];

  return (
    <section className="max-w-7xl mx-auto py-20 px-8 relative">
      <div className="relative z-10">
        {/* 模块标题 */}
        <div className="flex items-center gap-3 mb-10">
          <Settings size={32} style={{ color: '#19376D' }} />
          <h3 className="font-serif text-3xl font-bold text-[#121212]">校园服务</h3>
          <span className="text-sm text-[#666666]">Service</span>
        </div>

        {/* 服务入口网格 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <a
                key={index}
                href={service.href}
                className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl hover:bg-[#19376D]/5 transition-all duration-300 group"
              >
                <div className="p-3 rounded-lg bg-[#19376D]/10 group-hover:bg-[#19376D] transition-colors duration-300">
                  <IconComponent
                    size={24}
                    className="text-[#19376D] group-hover:text-white transition-colors duration-300"
                  />
                </div>
                <p className="text-xs font-medium text-[#333333] text-center group-hover:text-[#19376D] transition-colors duration-300">
                  {service.name}
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
