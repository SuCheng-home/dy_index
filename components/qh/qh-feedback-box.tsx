'use client';

import { useState } from 'react';
import { X, Send, CheckCircle, User, Mail, Phone, FileText, AlertCircle } from 'lucide-react';

interface QhFeedbackBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackType = '意见建议' | '问题咨询' | '投诉举报' | '其他';

export function QhFeedbackBox({ isOpen, onClose }: QhFeedbackBoxProps) {
  const [formData, setFormData] = useState({
    type: '意见建议' as FeedbackType,
    name: '',
    phone: '',
    email: '',
    title: '',
    content: '',
    anonymous: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const feedbackTypes: FeedbackType[] = ['意见建议', '问题咨询', '投诉举报', '其他'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.anonymous && !formData.name.trim()) {
      newErrors.name = '请输入姓名';
    }
    if (!formData.title.trim()) {
      newErrors.title = '请输入标题';
    }
    if (!formData.content.trim()) {
      newErrors.content = '请输入内容';
    }
    if (formData.content.trim().length < 10) {
      newErrors.content = '内容至少10个字符';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }
    if (formData.phone && !/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '手机号格式不正确';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setFormData({
      type: '意见建议',
      name: '',
      phone: '',
      email: '',
      title: '',
      content: '',
      anonymous: false,
    });
    setErrors({});
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        onClick={handleClose}
      />

      {/* 弹窗面板 */}
      <div 
        className="relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        style={{ backgroundColor: '#fff' }}
      >
        {/* 头部 */}
        <div 
          className="relative px-6 py-5"
          style={{ backgroundColor: '#19376D' }}
        >
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <Mail size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-serif font-bold text-xl">意见建议箱</h2>
              <p className="text-white/70 text-sm">我们重视您的每一条反馈</p>
            </div>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {isSubmitted ? (
            /* 提交成功 */
            <div className="flex flex-col items-center justify-center py-12">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
              >
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#121212' }}>提交成功</h3>
              <p className="text-center mb-6" style={{ color: '#666' }}>
                感谢您的宝贵意见，我们会认真阅读并尽快处理。
              </p>
              <button
                onClick={handleClose}
                className="px-8 py-3 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg"
                style={{ backgroundColor: '#19376D' }}
              >
                关闭
              </button>
            </div>
          ) : (
            /* 表单 */
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* 反馈类型 */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#333' }}>
                  反馈类型
                </label>
                <div className="flex flex-wrap gap-2">
                  {feedbackTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, type })}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        formData.type === type
                          ? 'text-white shadow-md'
                          : 'hover:shadow-sm'
                      }`}
                      style={{
                        backgroundColor: formData.type === type ? '#19376D' : 'rgba(25, 55, 109, 0.06)',
                        color: formData.type === type ? '#fff' : '#333',
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* 匿名选项 */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.anonymous}
                  onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#19376D] focus:ring-[#19376D]"
                />
                <span className="text-sm" style={{ color: '#666' }}>匿名提交</span>
              </label>

              {/* 姓名 */}
              {!formData.anonymous && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#333' }}>
                    <User size={14} className="inline mr-1" />
                    姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="请输入您的姓名"
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 ${
                      errors.name ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#19376D]'
                    }`}
                    style={{ backgroundColor: 'rgba(25, 55, 109, 0.04)' }}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              {/* 联系方式 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#333' }}>
                    <Phone size={14} className="inline mr-1" />
                    手机号
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="选填"
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 ${
                      errors.phone ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#19376D]'
                    }`}
                    style={{ backgroundColor: 'rgba(25, 55, 109, 0.04)' }}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#333' }}>
                    <Mail size={14} className="inline mr-1" />
                    邮箱
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="选填"
                    className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 ${
                      errors.email ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#19376D]'
                    }`}
                    style={{ backgroundColor: 'rgba(25, 55, 109, 0.04)' }}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* 标题 */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#333' }}>
                  <FileText size={14} className="inline mr-1" />
                  标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="请简要概括您的反馈"
                  className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 ${
                    errors.title ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#19376D]'
                  }`}
                  style={{ backgroundColor: 'rgba(25, 55, 109, 0.04)' }}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* 内容 */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#333' }}>
                  详细内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="请详细描述您的意见或建议..."
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all duration-300 ${
                    errors.content ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-[#19376D]'
                  }`}
                  style={{ backgroundColor: 'rgba(25, 55, 109, 0.04)' }}
                />
                <div className="flex justify-between mt-1">
                  {errors.content ? (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.content}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs" style={{ color: '#999' }}>
                    {formData.content.length} / 500
                  </span>
                </div>
              </div>

              {/* 提交按钮 */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-medium text-white transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#19376D' }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    提交中...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    提交反馈
                  </>
                )}
              </button>

              {/* 提示 */}
              <p className="text-xs text-center" style={{ color: '#999' }}>
                您的反馈将被严格保密，我们会在3个工作日内处理
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
