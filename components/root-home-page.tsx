import { Header } from "@/components/header"
import { HeroBanner } from "@/components/hero-banner"
import { NewsSection } from "@/components/news-section"
import { BookSection } from "@/components/book-section"
import { NewCampusOverview } from "@/components/new-campus-overview"
import { FeaturesSection } from "@/components/features-section"
import { StatsSection } from "@/components/stats-section"
import { CampusGallery } from "@/components/campus-gallery"
// 校长致辞模块已暂时下线，如需恢复请取消注释
// import { PrincipalMessage } from "@/components/principal-message"
import { Footer } from "@/components/footer"
import { getPublicSiteSnapshot } from "@/lib/public-site-data"

export async function RootHomePage() {
  const { config } = await getPublicSiteSnapshot()

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Header variant="home" config={config} />
      <main>
        <HeroBanner config={config.hero} />
        <div id="today-danzhong">
          <NewsSection config={config.news} />
        </div>
        <BookSection config={config.book} />
        <NewCampusOverview />
        <FeaturesSection config={config.features} />
        <StatsSection config={config.stats} />
        <CampusGallery config={config.gallery} />
        {/* 校长致辞模块已暂时下线，如需恢复请取消注释 */}
        {/* <PrincipalMessage config={config.principal} /> */}
      </main>
      <Footer config={config} />
    </div>
  )
}
