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
    { icon: BookOpen, name: '教务系统' },
    { icon: Users, name: '学生服务' },
    { icon: MapPin, name: '校园导览' },
    { icon: FileText, name: '文件下载' },
    { icon: Phone, name: '联系我们' },
    { icon: Wifi, name: '校园网络' },
    { icon: Clock, name: '校历查询' },
    { icon: Settings, name: '更多服务' },
  ];

  return (
    <section className="max-w-7xl mx-auto py-20 px-8">
      {/* 模块标题 */}
      <div className="flex items-center gap-2 mb-10">
        <Settings size={32} style={{ color: '#19376D' }} />
        <h3 className="font-serif text-3xl font-bold" style={{ color: '#121212' }}>
          校园服务
        </h3>
        <span className="text-sm" style={{ color: '#666666' }}>
          Service
        </span>
      </div>

      {/* 服务入口网格 - 4列到8列 */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
        {services.map((service, index) => {
          const IconComponent = service.icon;
          return (
            <a
              key={index}
              href="#"
              className="flex flex-col items-center gap-3 p-6 rounded-xl transition-colors duration-300 group"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(25, 55, 109, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div
                className="p-3 rounded-lg transition-colors duration-300"
                style={{ backgroundColor: 'rgba(25, 55, 109, 0.1)' }}
              >
                <IconComponent
                  size={24}
                  style={{ color: '#19376D' }}
                  className="transition-colors duration-300"
                />
              </div>
              <p
                className="text-xs font-medium text-center transition-colors duration-300"
                style={{ color: '#333333' }}
              >
                {service.name}
              </p>
            </a>
          );
        })}
      </div>
    </section>
  );
}
