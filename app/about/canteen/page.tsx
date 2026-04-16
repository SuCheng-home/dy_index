"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { UtensilsCrossed, ChevronLeft, ChevronRight } from "lucide-react"

const sidebarItems = [
  { label: "学校概况", href: "/about" },
  { label: "校史沿革", href: "/about/history" },
  { label: "校园风光", href: "/about/campus" },
  { label: "组织机构", href: "/about/organization" },
  { label: "领导班子", href: "/about/leadership" },
  { label: "食堂菜谱", href: "/about/canteen" },
]

const weeksData = [
  {
    weekName: "2026年春季学期 第8周",
    dateRange: "2026.4.6 - 2026.4.11",
    dates: ["2026.4.6", "2026.4.7", "2026.4.8", "2026.4.9", "2026.4.10", "2026.4.11"],
    menu: {
      lunch: {
        noodle: ["麻椒鸡/米线, 酱骨面/米线, 海苔拌饭", "白斩鸡面/米线, 红烧牛肉面/米线, 番茄牛肉焗饭", "红烧牛肉面/米线, 鸡腿面/米线, 红烧牛肉面", "酸菜牛肉面/米线, 红烧大肉面/米线, 牛肉拌饭", "红烧大排面/米线, 卤肉面/米线, 意面", "红烧猪脚面/米线, 牛肉面/米线, 意面"],
        bigMeat: ["糖醋排骨, 肉沫蒸蛋, 香炸鸡腿, 面筋塞肉", "百叶结烧肉, 口水鸡, 红烧肉圆, 咕咾肉", "农家小炒肉, 香酥鸭, 土豆烧肉, 红烧鸡腿", "麻辣鸡块, 盐水鸭, 香炸鸡排, 糖醋排骨", "千张结烧肉, 麻辣鸡块, 香辣鸡排, 红烧鱼块", "回锅肉, 口水鸡, 咕咾肉, 红烧肉圆"],
        smallMeat: ["大蒜平菇鸡蛋, 肉沫粉条, 莴笋炒肉", "肉沫蒸鸡蛋, 蒜苔香干肉丝, 肉沫粉丝", "肉沫茄子, 芹菜白干肉丝, 平菇炒鸡蛋", "葱油蒸水蛋, 青椒百叶肉丝, 花菜肉片", "蒜黄炒鸡蛋, 西兰花火腿, 青椒土豆肉丝", "青椒炒鸡蛋, 肉沫金针菇, 鱼香茄子"],
        veg: ["上汤娃娃菜", "干锅包菜", "白菜面筋", "蒜泥生菜", "白菜面筋", "蒜泥菠菜"],
        special: ["麻辣香锅, 椒盐羊排, 孜然肉片, 排骨焖饭, 鸡扒饭", "香炸鸡腿, 酸汤肥牛, 农家小炒肉, 滑蛋牛肉盖饭, 香菇卤肉饭", "糖醋排骨, 土豆丝牛腩, 烧汁鸡排, 香酥焖饭, 菲力牛排盖饭", "韩式拌饭, 黄焖鸡饭, 黑椒牛仔骨, 京酱肉丝盖饭, 小炒黄牛肉焖饭", "香炸鸡腿, 黑椒牛柳饭, 猪脚饭, 双拼煲仔饭, 红烧牛腩盖饭", "韩式拌饭, 双味酸菜鱼饭, 爆汁鸡排饭, 日照肥牛煲, 香菇滑鸡盖饭"]
      },
      dinner: {
        noodle: ["鸡腿面/米线, 排骨面/米线, 三鲜小馄饨", "红烧大排面/米线, 椒麻鸡面/米线, 皮蛋瘦肉粥", "酸菜鸡块面/米线, 杂酱面/米线, 小米粥", "肉圆面/米线, 香酥鸡腿面/米线, 青菜咸肉粥", "白斩鸡面/米线, 红烧羊肉面/米线, 黑米粥", "大排面/米线, 酱香鸡面/米线, 黑米粥"],
        bigMeat: ["水煮肉片, 麻辣鸡块, 红枣烧肉, 香炸鸡翅", "酱汁肉, 山城辣子鸡, 宫保鸡丁, 酸菜鱼", "红烧鸡腿, 红烧大肉, 肉饼太阳蛋, 剁椒鱼块", "口水鸡, 红烧肉圆, 剁椒鱼块, 黄豆猪手", "宫保鸡丁, 红烧肉, 红烧肉圆, 黄豆鸭块", "香酥鸭腿, 红烧肉, 剁椒鱼块, 土豆鸡块"],
        smallMeat: ["韭菜炒鸡蛋, 嫩藕肉片, 干锅花菜", "莴笋炒鸡蛋, 干锅包菜, 豆腐烧肉", "干锅花菜, 素鸡肉片, 西红柿炒鸡蛋", "平菇炒鸡蛋, 芹菜白干肉丝, 干锅花菜", "葱花炖鸡蛋, 莴笋炒肉片, 蒜泥白肉", "西红柿炒鸡蛋, 芹菜香干肉丝, 蒜泥白肉"]
      }
    }
  },
  {
    weekName: "2026年春季学期 第7周",
    dateRange: "2026.3.30 - 2026.4.4",
    dates: ["2026.3.30", "2026.3.31", "2026.4.1", "2026.4.2", "2026.4.3", "2026.4.4"],
    menu: {
      lunch: {
        noodle: ["红烧大肉面/米线, 牛肉拌饭, 海苔拌饭", "卤肉面/米线, 意面, 番茄牛肉焗饭", "麻椒鸡/米线, 酱骨面/米线, 红烧牛肉面", "白斩鸡面/米线, 红烧牛肉面/米线, 牛肉拌饭", "红烧牛肉面/米线, 鸡腿面/米线, 意面", "酸菜牛肉面/米线, 红烧大肉面/米线, 意面"],
        bigMeat: ["千张结烧肉, 麻辣鸡块, 香辣鸡排, 面筋塞肉", "回锅肉, 口水鸡, 咕咾肉, 咕咾肉", "糖醋排骨, 肉沫蒸蛋, 香炸鸡腿, 红烧鸡腿", "百叶结烧肉, 口水鸡, 红烧肉圆, 糖醋排骨", "农家小炒肉, 香酥鸭, 土豆烧肉, 红烧鱼块", "麻辣鸡块, 盐水鸭, 香炸鸡排, 红烧肉圆"],
        smallMeat: ["蒜黄炒鸡蛋, 西兰花火腿, 莴笋炒肉", "青椒炒鸡蛋, 肉沫金针菇, 肉沫粉丝", "大蒜平菇鸡蛋, 肉沫粉条, 平菇炒鸡蛋", "肉沫蒸鸡蛋, 蒜苔香干肉丝, 花菜肉片", "肉沫茄子, 芹菜白干肉丝, 青椒土豆肉丝", "葱油蒸水蛋, 青椒百叶肉丝, 鱼香茄子"],
        veg: ["白菜面筋", "蒜泥菠菜", "上汤娃娃菜", "干锅包菜", "白菜面筋", "蒜泥生菜"],
        special: ["香炸鸡腿, 黑椒牛柳饭, 猪脚饭, 排骨焖饭, 鸡扒饭", "韩式拌饭, 双味酸菜鱼饭, 爆汁鸡排饭, 滑蛋牛肉盖饭, 香菇卤肉饭", "麻辣香锅, 椒盐羊排, 孜然肉片, 香酥焖饭, 菲力牛排盖饭", "香炸鸡腿, 酸汤肥牛, 农家小炒肉, 京酱肉丝盖饭, 小炒黄牛肉焖饭", "糖醋排骨, 土豆丝牛腩, 烧汁鸡排, 双拼煲仔饭, 红烧牛腩盖饭", "韩式拌饭, 黄焖鸡饭, 黑椒牛仔骨, 日照肥牛煲, 香菇滑鸡盖饭"]
      },
      dinner: {
        noodle: ["白斩鸡面/米线, 红烧羊肉面/米线, 三鲜小馄饨", "大排面/米线, 酱香鸡面/米线, 皮蛋瘦肉粥", "鸡腿面/米线, 排骨面/米线, 小米粥", "红烧大排面/米线, 椒麻鸡面/米线, 青菜咸肉粥", "酸菜鸡块面/米线, 杂酱面/米线, 黑米粥", "肉圆面/米线, 香酥鸡腿面/米线, 黑米粥"],
        bigMeat: ["宫保鸡丁, 红烧肉, 红烧肉圆, 香炸鸡翅", "香酥鸭腿, 红烧肉, 剁椒鱼块, 酸菜鱼", "水煮肉片, 麻辣鸡块, 红枣烧肉, 剁椒鱼块", "酱汁肉, 山城辣子鸡, 宫保鸡丁, 黄豆猪手", "红烧鸡腿, 红烧大肉, 肉饼太阳蛋, 黄豆鸭块", "口水鸡, 红烧肉圆, 剁椒鱼块, 土豆鸡块"],
        smallMeat: ["葱花炖鸡蛋, 莴笋炒肉片, 干锅花菜", "西红柿炒鸡蛋, 芹菜香干肉丝, 豆腐烧肉", "韭菜炒鸡蛋, 嫩藕肉片, 西红柿炒鸡蛋", "莴笋炒鸡蛋, 干锅包菜, 干锅花菜", "干锅花菜, 素鸡肉片, 蒜泥白肉", "平菇炒鸡蛋, 芹菜白干肉丝, 蒜泥白肉"]
      }
    }
  }
]

export default function CanteenMenuPage() {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0)
  const currentData = weeksData[currentWeekIndex]

  const handlePrevWeek = () => {
    if (currentWeekIndex < weeksData.length - 1) {
      setCurrentWeekIndex(currentWeekIndex + 1)
    }
  }

  const handleNextWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1)
    }
  }

  const renderCellItems = (itemsString: string) => {
    return itemsString.split(', ').map((item, idx) => (
      <div key={idx} className="mb-1 last:mb-0">{item}</div>
    ))
  }

  return (
    <>
      <Header />
      <SubPageLayout
        title="食堂菜谱"
        subtitle="Canteen Menu"
        breadcrumbs={[{ label: "校园信息", href: "/about" }, { label: "食堂菜谱" }]}
        sidebarItems={sidebarItems}
        bannerImage="/view/view4.jpg"
      >
        <article className="prose prose-lg max-w-none">
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-4 bg-gradient-to-r from-[#8B1A1A] to-[#6B1010] rounded-xl p-3 shadow-lg text-white">
              <button 
                onClick={handlePrevWeek}
                disabled={currentWeekIndex === weeksData.length - 1}
                className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="上一周"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <div className="flex flex-col items-center min-w-[200px]">
                <span className="font-bold text-lg">{currentData.weekName}</span>
                <span className="text-sm text-white/80">{currentData.dateRange}</span>
              </div>
              <button 
                onClick={handleNextWeek}
                disabled={currentWeekIndex === 0}
                className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="下一周"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl shadow-md border border-[#E8DCC8]">
            <table className="w-full text-center text-sm text-[#444] min-w-[1000px] m-0 border-collapse">
              <thead className="bg-[#F8F4ED] text-[#8B1A1A]">
                <tr>
                  <th className="px-4 py-3 font-bold border border-[#E8DCC8] whitespace-nowrap w-[60px]" colSpan={2}>日期</th>
                  {currentData.dates.map((date, idx) => (
                    <th key={idx} className="px-2 py-3 font-bold border border-[#E8DCC8] w-[15%]">
                      {date}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {/* 午餐 - 面条 */}
                <tr>
                  <td className="px-2 py-4 font-bold border border-[#E8DCC8] whitespace-nowrap bg-[#FDFBF7]" rowSpan={5}>
                    <div className="vertical-text">午餐</div>
                  </td>
                  <td className="px-2 py-4 font-bold border border-[#E8DCC8] whitespace-nowrap text-gray-600 bg-[#FDFBF7]">面条</td>
                  {currentData.menu.lunch.noodle.map((item, idx) => (
                    <td key={idx} className="px-2 py-3 border border-[#E8DCC8] text-[13px] leading-snug align-top">
                      {renderCellItems(item)}
                    </td>
                  ))}
                </tr>
                {/* 午餐 - 自选大荤 */}
                <tr>
                  <td className="px-2 py-4 font-bold border border-[#E8DCC8] whitespace-nowrap text-gray-600 bg-[#FDFBF7]">
                    自选<br/><span className="text-xs font-normal">大荤</span>
                  </td>
                  {currentData.menu.lunch.bigMeat.map((item, idx) => (
                    <td key={idx} className="px-2 py-3 border border-[#E8DCC8] text-[13px] leading-snug align-top">
                      {renderCellItems(item)}
                    </td>
                  ))}
                </tr>
                {/* 午餐 - 自选小荤 */}
                <tr>
                  <td className="px-2 py-4 font-bold border border-[#E8DCC8] whitespace-nowrap text-gray-600 bg-[#FDFBF7]">
                    自选<br/><span className="text-xs font-normal">小荤</span>
                  </td>
                  {currentData.menu.lunch.smallMeat.map((item, idx) => (
                    <td key={idx} className="px-2 py-3 border border-[#E8DCC8] text-[13px] leading-snug align-top">
                      {renderCellItems(item)}
                    </td>
                  ))}
                </tr>
                {/* 午餐 - 素菜 */}
                <tr>
                  <td className="px-2 py-4 font-bold border border-[#E8DCC8] whitespace-nowrap text-gray-600 bg-[#FDFBF7]">素菜</td>
                  {currentData.menu.lunch.veg.map((item, idx) => (
                    <td key={idx} className="px-2 py-3 border border-[#E8DCC8] text-[13px] leading-snug align-top">
                      {renderCellItems(item)}
                    </td>
                  ))}
                </tr>
                {/* 午餐 - 特色餐 */}
                <tr>
                  <td className="px-2 py-4 font-bold border border-[#E8DCC8] whitespace-nowrap text-gray-600 bg-[#FDFBF7]">特色餐</td>
                  {currentData.menu.lunch.special.map((item, idx) => (
                    <td key={idx} className="px-2 py-3 border border-[#E8DCC8] text-[13px] leading-snug align-top">
                      {renderCellItems(item)}
                    </td>
                  ))}
                </tr>

                {/* 晚餐 - 面条 */}
                <tr>
                  <td className="px-2 py-4 font-bold border border-[#E8DCC8] whitespace-nowrap bg-[#FDFBF7]" rowSpan={3}>
                    <div className="vertical-text">晚餐</div>
                  </td>
                  <td className="px-2 py-4 font-bold border border-[#E8DCC8] whitespace-nowrap text-gray-600 bg-[#FDFBF7]">面条</td>
                  {currentData.menu.dinner.noodle.map((item, idx) => (
                    <td key={idx} className="px-2 py-3 border border-[#E8DCC8] text-[13px] leading-snug align-top">
                      {renderCellItems(item)}
                    </td>
                  ))}
                </tr>
                {/* 晚餐 - 自选大荤 */}
                <tr>
                  <td className="px-2 py-4 font-bold border border-[#E8DCC8] whitespace-nowrap text-gray-600 bg-[#FDFBF7]">
                    自选<br/><span className="text-xs font-normal">大荤</span>
                  </td>
                  {currentData.menu.dinner.bigMeat.map((item, idx) => (
                    <td key={idx} className="px-2 py-3 border border-[#E8DCC8] text-[13px] leading-snug align-top">
                      {renderCellItems(item)}
                    </td>
                  ))}
                </tr>
                {/* 晚餐 - 自选小荤 */}
                <tr>
                  <td className="px-2 py-4 font-bold border border-[#E8DCC8] whitespace-nowrap text-gray-600 bg-[#FDFBF7]">
                    自选<br/><span className="text-xs font-normal">小荤</span>
                  </td>
                  {currentData.menu.dinner.smallMeat.map((item, idx) => (
                    <td key={idx} className="px-2 py-3 border border-[#E8DCC8] text-[13px] leading-snug align-top">
                      {renderCellItems(item)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </SubPageLayout>
      <Footer />
    </>
  )
}
