"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const features = [
  {
    title: "大成教育",
    subtitle: "立德树人 · 全面发展",
    description: "以「成人、成才、成功」为育人目标，构建德智体美劳全面培养的教育体系，传承孔庙文脉，厚植家国情怀。",
    color: "from-[#8B1A1A] to-[#6B1010]",
    href: "/about",
  },
  {
    title: "创新培养",
    subtitle: "省首批试点学校",
    description: "作为江苏省首批创新人才培养试点学校，开设竞赛课程、研究性学习、STEM教育等特色项目。",
    color: "from-[#D4AF37] to-[#B8942E]",
    href: "/teaching/research",
  },
  {
    title: "双高合作",
    subtitle: "名校直通",
    description: "与清华大学、南京大学、东南大学等知名高校建立深度合作，搭建学生进入高水平大学的绿色通道。",
    color: "from-[#8B1A1A] to-[#6B1010]",
    href: "/teaching",
  },
  {
    title: "国际视野",
    subtitle: "多元发展平台",
    description: "开展国际交流项目，与海外名校建立合作关系，培养具有国际竞争力和跨文化交流能力的优秀人才。",
    color: "from-[#D4AF37] to-[#B8942E]",
    href: "/international",
  },
]

export function FeaturesSection() {
  const { ref, isRevealed } = useScrollReveal()
  
  return (
    <section ref={ref} className="relative overflow-hidden bg-[#2A0A0A] py-20">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div
          className="mb-16 text-center transition-all duration-1000"
          style={{
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <span className="mb-2 inline-block font-serif text-sm tracking-widest text-[#D4AF37]">
            FEATURES
          </span>
          <h2 className="mb-4 font-serif text-3xl font-bold text-[#F5E6D3] md:text-4xl">
            办学特色
          </h2>
          <div className="mx-auto h-1 w-20 bg-gradient-to-r from-[#D4AF37] to-[#8B1A1A]" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group relative rounded-lg bg-gradient-to-b from-[#3A1A1A] to-[#2A0A0A] p-6 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl"
              style={{
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? "translateY(0)" : "translateY(40px)",
                transitionDelay: `${0.15 + index * 0.1}s`,
              }}
            >
              <div className={`absolute left-0 top-0 h-1 w-full rounded-t-lg bg-gradient-to-r ${feature.color}`} />

              <div className="mb-4 font-serif text-5xl font-bold text-[#D4AF37]/20">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3 className="mb-1 font-serif text-xl font-bold text-[#F5E6D3]">
                {feature.title}
              </h3>
              <p className="mb-3 text-sm text-[#D4AF37]">{feature.subtitle}</p>
              <p className="text-sm leading-relaxed text-[#F5E6D3]/70">
                {feature.description}
              </p>

              <div className="mt-4 flex items-center gap-1 text-sm text-[#D4AF37] opacity-0 transition-opacity group-hover:opacity-100">
                了解详情
                <ArrowRight className="h-4 w-4" />
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-[#D4AF37]/5 to-transparent" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
