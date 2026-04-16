import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import Image from "next/image"

export const metadata = {
  title: "学校概况 | 江苏省丹阳高级中学",
  description: "了解江苏省丹阳高级中学的历史、办学理念和发展历程",
}

const sidebarItems = [
  { label: "学校概况", href: "/about" },
  { label: "校史沿革", href: "/about/history" },
  { label: "校园风光", href: "/about/campus" },
  { label: "组织机构", href: "/about/organization" },
  { label: "领导班子", href: "/about/leadership" },
  { label: "食堂菜谱", href: "/about/canteen" },
]

export default function AboutPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="学校概况"
        subtitle="School Overview"
        breadcrumbs={[{ label: "校园信息", href: "/about" }, { label: "学校概况" }]}
        sidebarItems={sidebarItems}
        bannerImage="/view/view4.jpg"
      >
        <article className="prose prose-lg max-w-none">
          <div className="mb-8 overflow-hidden rounded-xl">
            <Image
              src="/view/view5.jpg"
              alt="校园全景"
              width={1200}
              height={500}
              className="w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          <h2 className="border-l-4 border-[#8B1A1A] pl-4 text-2xl font-bold text-[#333]">
            百年名校 大成教育
          </h2>

          <p className="leading-relaxed text-[#555]">
            江苏省丹阳高级中学创建于1941年，坐落于历史文化名城丹阳市中心，占地面积280余亩。学校前身为始建于宋代的孔庙学宫，承继千年文脉，秉持"大成教育"办学理念，致力于培养具有家国情怀、国际视野、创新精神的时代英才。
          </p>

          <p className="leading-relaxed text-[#555]">
            学校是江苏省四星级普通高中、江苏省重点中学、江苏省模范学校、全国文明校园。建校八十余年来，学校始终坚持"立德树人"根本任务，秉承"厚德博学、求实创新"校训，形成了"严谨、勤奋、求实、创新"的优良校风。
          </p>

          <div className="my-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-gradient-to-br from-[#8B1A1A] to-[#6B1010] p-6 text-center text-white shadow-lg">
              <div className="mb-2 font-serif text-4xl font-bold text-[#D4AF37]">80+</div>
              <div className="text-sm opacity-90">建校历史</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-[#8B1A1A] to-[#6B1010] p-6 text-center text-white shadow-lg">
              <div className="mb-2 font-serif text-4xl font-bold text-[#D4AF37]">280</div>
              <div className="text-sm opacity-90">亩校园面积</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-[#8B1A1A] to-[#6B1010] p-6 text-center text-white shadow-lg">
              <div className="mb-2 font-serif text-4xl font-bold text-[#D4AF37]">98.5%</div>
              <div className="text-sm opacity-90">本科升学率</div>
            </div>
          </div>

          <h2 className="border-l-4 border-[#8B1A1A] pl-4 text-2xl font-bold text-[#333]">
            办学理念
          </h2>

          <p className="leading-relaxed text-[#555]">
            学校秉承"大成教育"理念，取自孔子"集大成者"之义，强调教育的完整性、整体性和发展性。我们坚信每一位学生都是独特的个体，都有成为"大成之人"的潜质。学校致力于为学生提供多元化、个性化的成长路径，帮助每一位学子实现自我价值，成就精彩人生。
          </p>

          <blockquote className="border-l-4 border-[#D4AF37] bg-[#F8F4ED] p-6 italic text-[#666]">
            "教育的本质是一棵树摇动另一棵树，一朵云推动另一朵云，一个灵魂唤醒另一个灵魂。"
            <footer className="mt-2 text-sm not-italic text-[#999]">——雅斯贝尔斯</footer>
          </blockquote>

          <h2 className="border-l-4 border-[#8B1A1A] pl-4 text-2xl font-bold text-[#333]">
            师资力量
          </h2>

          <p className="leading-relaxed text-[#555]">
            学校现有专任教师320余人，其中正高级教师8人，高级教师156人，特级教师12人，省"333工程"培养对象6人，镇江市学科带头人、骨干教师68人。近年来，学校教师在省级以上教学竞赛中获奖超过200人次，发表论文300余篇，承担省市级课题50余项。
          </p>
        </article>
      </SubPageLayout>
      <Footer />
    </>
  )
}
