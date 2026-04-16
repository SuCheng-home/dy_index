import { Header } from "@/components/header"
import { HeroBanner } from "@/components/hero-banner"
import { TodayDanzhong } from "@/components/today-danzhong"
import { NewsSection } from "@/components/news-section"
import { FeaturesSection } from "@/components/features-section"
import { StatsSection } from "@/components/stats-section"
import { CampusGallery } from "@/components/campus-gallery"
import { PrincipalMessage } from "@/components/principal-message"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header variant="home" />
      <main>
        <HeroBanner />
        <div id="today-danzhong">
          <NewsSection />
        </div>
        <TodayDanzhong />
        <FeaturesSection />
        <StatsSection />
        <CampusGallery />
        <PrincipalMessage />
      </main>
      <Footer />
    </div>
  )
}
