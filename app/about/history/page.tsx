import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"

export const metadata = {
  title: "校史沿革 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学的发展历程和重要里程碑",
}

const sidebarItems = [
  { label: "学校概况", href: "/about" },
  { label: "校史沿革", href: "/about/history" },
  { label: "校园风光", href: "/about/campus" },
  { label: "组织机构", href: "/about/organization" },
  { label: "领导班子", href: "/about/leadership" },
  { label: "食堂菜谱", href: "/about/canteen" },
]

const historyEvents = [
  { year: "1941", title: "建校初期", content: "丹阳县立初级中学创办，开启了丹中的教育历程。" },
  { year: "1952", title: "更名发展", content: "更名为丹阳县中学，成为当时丹阳地区最重要的中等教育机构。" },
  { year: "1980", title: "省重点中学", content: "被确定为江苏省首批重点中学，教育质量和办学规模显著提升。" },
  { year: "1993", title: "更名升格", content: "正式更名为江苏省丹阳高级中学，成为省级示范性高中。" },
  { year: "2004", title: "四星级高中", content: "通过江苏省四星级普通高中评估验收，跻身省内一流高中行列。" },
  { year: "2015", title: "新校区启用", content: "现代化新校区全面投入使用，办学条件大幅改善。" },
  { year: "2020", title: "全国文明校园", content: "荣获全国文明校园称号，学校进入高质量发展新阶段。" },
  { year: "2024", title: "大成教育", content: "深化大成教育理念，推进教育教学改革，开启学校发展新篇章。" },
]

export default function HistoryPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="校史沿革"
        subtitle="History"
        breadcrumbs={[
          { label: "校园信息", href: "/about" },
          { label: "校史沿革" },
        ]}
        sidebarItems={sidebarItems}
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            江苏省丹阳高级中学的历史可追溯至宋代孔庙学宫，承载着千年的文化底蕴。自1941年正式建校以来，学校历经风雨，砥砺前行，逐步发展成为江苏省知名的重点高中。
          </p>

          {/* 时间轴 */}
          <div className="relative ml-4 border-l-2 border-[#E8DCC8] pl-8">
            {historyEvents.map((event, index) => (
              <div
                key={event.year}
                className="animate-in fade-in slide-in-from-left-4 relative mb-10 last:mb-0"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* 时间点 */}
                <div className="absolute -left-[42px] flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#8B1A1A] to-[#6B1010] text-sm font-bold text-[#D4AF37] shadow-md">
                  <div className="absolute -left-1 -top-1 h-10 w-10 animate-ping rounded-full bg-[#8B1A1A]/20" style={{ animationDuration: '3s' }} />
                </div>
                
                {/* 内容卡片 */}
                <div className="rounded-xl bg-gradient-to-r from-[#FDFBF7] to-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="rounded-full bg-[#8B1A1A] px-4 py-1 font-serif text-lg font-bold text-[#D4AF37]">
                      {event.year}
                    </span>
                    <h3 className="text-xl font-bold text-[#333]">{event.title}</h3>
                  </div>
                  <p className="text-[#666]">{event.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SubPageLayout>
      <Footer />
    </>
  )
}
