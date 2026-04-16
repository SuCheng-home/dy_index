import Image from "next/image"
import { Quote } from "lucide-react"

export function PrincipalMessage() {
  return (
    <section className="bg-gradient-to-b from-[#FDFBF7] to-[#F5F0E8] py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-4xl">
          <div className="relative rounded-2xl bg-[#FDFBF7] p-8 shadow-xl md:p-12">
            {/* 装饰引号 */}
            <Quote className="absolute -left-3 -top-3 h-16 w-16 text-[#D4AF37]/20 md:-left-6 md:-top-6 md:h-24 md:w-24" />
            
            <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
              {/* 校长照片 */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="h-40 w-40 overflow-hidden rounded-full border-4 border-[#D4AF37] shadow-lg">
                    <Image
                      src="/placeholder-user.jpg"
                      alt="校长"
                      width={160}
                      height={160}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {/* 装饰环 */}
                  <div className="absolute -inset-2 -z-10 rounded-full border border-[#D4AF37]/30" />
                </div>
                <div className="mt-4 text-center">
                  <div className="font-serif text-lg font-bold text-[#2A0A0A]">张明远</div>
                  <div className="text-sm text-[#8B1A1A]">校长 · 特级教师</div>
                </div>
              </div>

              {/* 致辞内容 */}
              <div className="flex-1 space-y-4">
                <h3 className="font-serif text-2xl font-bold text-[#2A0A0A] md:text-3xl">
                  校长致辞
                </h3>
                <div className="space-y-3 text-[#444] leading-relaxed">
                  <p>
                    欢迎来到江苏省丹阳高级中学！作为一所承载着八十余年历史底蕴的百年名校，
                    我们始终秉承「大成教育」理念，以立德树人为根本，以培养全面发展的时代英才为使命。
                  </p>
                  <p>
                    教育是点燃火焰，而非填满容器。我们相信每一位学生都有无限的潜能，
                    在这里，你将遇到优秀的老师、志同道合的伙伴，收获知识、友谊和成长。
                  </p>
                  <p className="font-medium text-[#8B1A1A]">
                    愿每一位丹中学子，都能在这里找到属于自己的舞台，书写精彩的青春篇章！
                  </p>
                </div>
              </div>
            </div>

            {/* 底部装饰 */}
            <div className="mt-8 flex items-center justify-end">
              <div className="flex items-center gap-3">
                <div className="h-px w-20 bg-gradient-to-l from-[#D4AF37] to-transparent" />
                <span className="font-serif text-sm text-[#D4AF37]">大成教育 · 成就未来</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
