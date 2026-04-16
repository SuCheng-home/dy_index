"use client"

import Image from "next/image"
import Link from "next/link"
import { BookOpen, Award, Users, Globe } from "lucide-react"

const features = [
  { icon: BookOpen, label: "大成教育", value: "理念引领" },
  { icon: Award, label: "省四星级", value: "高中" },
  { icon: Users, label: "名师荟萃", value: "200+" },
  { icon: Globe, label: "国际合作", value: "10+" },
]

export function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-[#FDFBF7] py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* 标题 */}
        <div className="mb-16 text-center">
          <span className="mb-2 inline-block font-serif text-sm tracking-widest text-[#D4AF37]">
            ABOUT US
          </span>
          <h2 className="mb-4 font-serif text-3xl font-bold text-[#2A0A0A] md:text-4xl">
            学校简介
          </h2>
          <div className="mx-auto h-1 w-20 bg-gradient-to-r from-[#D4AF37] to-[#8B1A1A]" />
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* 左侧图片 */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-2xl">
              <Image
                src="/view/view1.jpg"
                alt="校园风光"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A0A0A]/30 to-transparent" />
            </div>
            {/* 装饰框 */}
            <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-lg border-2 border-[#D4AF37]/30" />
          </div>

          {/* 右侧内容 */}
          <div className="space-y-6">
            <div className="space-y-4 text-[#444] leading-relaxed">
              <p className="text-lg">
                <span className="font-serif text-2xl font-bold text-[#8B1A1A]">江苏省丹阳高级中学</span>
                创建于1941年，前身为私立正则中学，坐落于古城丹阳孔庙、文庙旧址，传承千年文脉，积淀深厚底蕴。
              </p>
              <p>
                学校秉承<span className="font-medium text-[#8B1A1A]">「大成教育」</span>理念，
                以「成人、成才、成功」为育人目标，致力于培养具有家国情怀、国际视野、
                创新精神和实践能力的时代英才。
              </p>
              <p>
                作为<span className="font-medium text-[#8B1A1A]">江苏省四星级高中</span>、
                省首批创新人才培养试点学校，学校先后与清华大学、南京大学等知名高校建立
                「双高合作」机制，为学生搭建多元发展平台。
              </p>
            </div>

            {/* 特色数据 */}
            <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4">
              {features.map((item) => (
                <div
                  key={item.label}
                  className="group rounded-lg border border-[#E8DCC8] bg-[#FDFBF7] p-4 text-center transition-all hover:border-[#D4AF37] hover:shadow-md"
                >
                  <item.icon className="mx-auto mb-2 h-6 w-6 text-[#D4AF37] transition-transform group-hover:scale-110" />
                  <div className="text-xs text-[#666]">{item.label}</div>
                  <div className="font-serif font-bold text-[#8B1A1A]">{item.value}</div>
                </div>
              ))}
            </div>

            {/* 按钮 */}
            <div className="pt-4">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 rounded bg-[#8B1A1A] px-6 py-3 font-medium text-[#F5E6D3] shadow-md transition-all hover:bg-[#6B1010] hover:shadow-lg"
              >
                <span>了解更多</span>
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
