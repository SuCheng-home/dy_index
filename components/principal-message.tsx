"use client"

import Image from "next/image"
import { Quote } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { type RootSiteConfig } from "@/lib/root-site-config"

type PrincipalMessageConfig = RootSiteConfig["principal"]

export function PrincipalMessage({ config }: { config: PrincipalMessageConfig }) {
  const { ref, isRevealed } = useScrollReveal()

  if (!config.title && !config.name && config.paragraphs.length === 0) {
    return null
  }
  
  return (
    <section ref={ref} className="bg-gradient-to-b from-[#FDFBF7] to-[#F5F0E8] py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-4xl">
          <div
            className="relative rounded-2xl bg-[#FDFBF7] p-8 shadow-xl md:p-12 transition-all duration-1000"
            style={{
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? "translateY(0)" : "translateY(40px)",
            }}
          >
            {/* 装饰引号 */}
            <Quote className="absolute -left-3 -top-3 h-16 w-16 text-[#D4AF37]/20 md:-left-6 md:-top-6 md:h-24 md:w-24" />
            
            <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
              {/* 校长照片 */}
              {config.image || config.name || config.role ? (
                <div className="flex-shrink-0">
                  <div className="relative">
                    {config.image ? (
                      <div className="h-40 w-40 overflow-hidden rounded-3xl border-4 border-[#D4AF37] bg-white shadow-lg">
                        <Image
                          src={config.image}
                          alt={config.name || config.title || "图片"}
                          width={160}
                          height={160}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : null}
                    {config.image ? <div className="absolute -inset-2 -z-10 rounded-[2rem] border border-[#D4AF37]/30" /> : null}
                  </div>
                  <div className="mt-4 text-center">
                    {config.name ? <div className="font-serif text-lg font-bold text-[#2A0A0A]">{config.name}</div> : null}
                    {config.role ? <div className="text-sm text-[#8B1A1A]">{config.role}</div> : null}
                  </div>
                </div>
              ) : null}

              {/* 致辞内容 */}
              <div className="flex-1 space-y-4">
                {config.title ? (
                  <h3 className="font-serif text-2xl font-bold text-[#2A0A0A] md:text-3xl">
                    {config.title}
                  </h3>
                ) : null}
                {config.paragraphs.length > 0 ? (
                  <div className="space-y-3 text-[#444] leading-relaxed">
                    {config.paragraphs.map((paragraph, index) => (
                      <p key={index} className={index === config.paragraphs.length - 1 ? "font-medium text-[#8B1A1A]" : undefined}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            {/* 底部装饰 */}
            {config.signature ? (
              <div className="mt-8 flex items-center justify-end">
                <div className="flex items-center gap-3">
                  <div className="h-px w-20 bg-gradient-to-l from-[#D4AF37] to-transparent" />
                  <span className="font-serif text-sm text-[#D4AF37]">{config.signature}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
