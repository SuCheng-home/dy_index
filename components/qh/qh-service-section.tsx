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
  Mail,
  GraduationCap,
} from 'lucide-react';

interface QhServiceSectionProps {
  onFeedbackClick?: () => void;
}

export function QhServiceSection({ onFeedbackClick }: QhServiceSectionProps) {
  const services = [
    { icon: BookOpen, name: '教务系统', color: '#19376D' },
    { icon: Users, name: '学生服务', color: '#2C5AA0' },
    { icon: GraduationCap, name: '招生咨询', color: '#C8102E' },
    { icon: MapPin, name: '校园导览', color: '#19376D' },
    { icon: FileText, name: '文件下载', color: '#2C5AA0' },
    { icon: Phone, name: '联系我们', color: '#19376D' },
    { icon: Wifi, name: '校园网络', color: '#2C5AA0' },
    { icon: Clock, name: '校历查询', color: '#19376D' },
  ];

  return (
    <section className="max-w-7xl mx-auto py-20 px-6 lg:px-8">
      {/* 模块标题 */}
      <div className="flex items-center gap-3 mb-10">
        <Settings size={32} style={{ color: '#19376D' }} />
        <div>
          <h3 className="font-serif text-3xl font-bold" style={{ color: '#121212' }}>
            校园服务
          </h3>
          <span className="text-sm" style={{ color: '#666666' }}>
            Campus Services
          </span>
        </div>
      </div>

      {/* 服务入口网格 */}
      <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-4 md:gap-6">
        {services.map((service, index) => {
          const IconComponent = service.icon;
          return (
            <a
              key={index}
              href="#"
              className="flex flex-col items-center gap-3 p-4 md:p-5 rounded-2xl transition-all duration-300 group hover:shadow-lg hover:-translate-y-1"
              style={{ backgroundColor: 'rgba(25, 55, 109, 0.04)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(25, 55, 109, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(25, 55, 109, 0.04)';
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${service.color}15` }}
              >
                <IconComponent
                  size={24}
                  style={{ color: service.color }}
                />
              </div>
              <p
                className="text-xs md:text-sm font-medium text-center transition-colors duration-300 group-hover:text-[#19376D]"
                style={{ color: '#333333' }}
              >
                {service.name}
              </p>
            </a>
          );
        })}

        {/* 意见建议箱 - 特殊样式 */}
        <button
          onClick={onFeedbackClick}
          className="flex flex-col items-center gap-3 p-4 md:p-5 rounded-2xl transition-all duration-300 group hover:shadow-lg hover:-translate-y-1 relative overflow-hidden"
          style={{ backgroundColor: 'rgba(200, 16, 46, 0.06)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(200, 16, 46, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(200, 16, 46, 0.06)';
          }}
        >
          {/* 角标 */}
          <div 
            className="absolute top-0 right-0 px-1.5 py-0.5 text-[10px] font-bold text-white rounded-bl-lg"
            style={{ backgroundColor: '#C8102E' }}
          >
            NEW
          </div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ backgroundColor: 'rgba(200, 16, 46, 0.15)' }}
          >
            <Mail size={24} style={{ color: '#C8102E' }} />
          </div>
          <p
            className="text-xs md:text-sm font-medium text-center transition-colors duration-300 group-hover:text-[#C8102E]"
            style={{ color: '#333333' }}
          >
            意见箱
          </p>
        </button>
      </div>

      {/* 底部联系信息卡片 */}
      <div 
        className="mt-12 p-6 md:p-8 rounded-2xl border"
        style={{ 
          borderColor: 'rgba(25, 55, 109, 0.15)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)'
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 地址 */}
          <div className="flex items-start gap-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(25, 55, 109, 0.08)' }}
            >
              <MapPin size={20} style={{ color: '#19376D' }} />
            </div>
            <div>
              <h4 className="font-medium mb-1" style={{ color: '#121212' }}>学校地址</h4>
              <p className="text-sm" style={{ color: '#666' }}>江苏省丹阳市新民西路138号</p>
            </div>
          </div>

          {/* 电话 */}
          <div className="flex items-start gap-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(25, 55, 109, 0.08)' }}
            >
              <Phone size={20} style={{ color: '#19376D' }} />
            </div>
            <div>
              <h4 className="font-medium mb-1" style={{ color: '#121212' }}>联系电话</h4>
              <p className="text-sm" style={{ color: '#666' }}>0511-86522062</p>
            </div>
          </div>

          {/* 邮编 */}
          <div className="flex items-start gap-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(25, 55, 109, 0.08)' }}
            >
              <Mail size={20} style={{ color: '#19376D' }} />
            </div>
            <div>
              <h4 className="font-medium mb-1" style={{ color: '#121212' }}>邮政编码</h4>
              <p className="text-sm" style={{ color: '#666' }}>212300</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
