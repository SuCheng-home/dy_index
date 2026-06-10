"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { type RootSiteConfig } from "@/lib/root-site-config"

type FeaturesSectionConfig = RootSiteConfig["features"]
export function FeaturesSection({ config }: { config: FeaturesSectionConfig }) {
  const features = config.items
  const { ref, isRevealed } = useScrollReveal()

  if (features.length === 0) {
    return null
  }
  
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
            {config.eyebrow}
          </span>
          <h2 className="mb-4 font-serif text-3xl font-bold text-[#F5E6D3] md:text-4xl">
            {config.title}
          </h2>
          <div className="mx-auto h-1 w-20 bg-gradient-to-r from-[#D4AF37] to-[#8B1A1A]" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative rounded-lg bg-gradient-to-b from-[#3A1A1A] to-[#2A0A0A] p-6 transition-all duration-700"
              style={{
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? "translateY(0)" : "translateY(40px)",
                transitionDelay: `${0.15 + index * 0.1}s`,
              }}
            >
              <div className={`absolute left-0 top-0 h-1 w-full rounded-t-lg bg-gradient-to-r ${feature.color}`} />

              <h3 className="mb-1 font-serif text-xl font-bold text-[#F5E6D3]">
                {feature.title}
              </h3>
              <p className="mb-3 text-sm text-[#D4AF37]">{feature.subtitle}</p>
              <p className="text-sm leading-relaxed text-[#F5E6D3]/70">
                {feature.description}
              </p>

              <div className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-[#D4AF37]/5 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
