import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "党员风采 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学优秀党员教师风采展示",
}

const sidebarItems = [
  { label: "党建动态", href: "/party" },
  { label: "党史学习", href: "/party/history" },
  { label: "主题教育", href: "/party/theme" },
  { label: "党员风采", href: "/party/members" },
]

const members = [
  {
    name: "周文斌",
    subject: "语文教研组",
    gender: "male",
    description:
      "从教28年，始终坚守教学一线，所带班级高考成绩多次名列前茅。积极参与课程改革，主编校本教材《经典诵读》，获评江苏省优秀共产党员。",
  },
  {
    name: "孙丽萍",
    subject: "数学教研组",
    gender: "female",
    description:
      "省级教学能手，潜心研究高中数学教学方法，指导学生在全国数学竞赛中多次获奖。热心帮扶青年教师成长，获评市级优秀党员教师。",
  },
  {
    name: "黄伟明",
    subject: "物理教研组",
    gender: "male",
    description:
      "中学正高级教师，主持省级课题3项，发表论文20余篇。创新实验教学模式，建设物理创新实验室，为学校科技教育发展做出突出贡献。",
  },
  {
    name: "林雪梅",
    subject: "英语教研组",
    gender: "female",
    description:
      "坚持以生为本的教学理念，注重培养学生英语综合应用能力。连续多年担任班主任，所带班级多次被评为市级优秀班集体，获评丹阳市优秀共产党员。",
  },
  {
    name: "吴建华",
    subject: "化学教研组",
    gender: "male",
    description:
      "扎根教育事业三十载，致力于化学学科核心素养培养。积极投身教育扶贫，多次赴偏远地区支教，以实际行动诠释党员教师的责任与担当。",
  },
  {
    name: "陈美玲",
    subject: "政治教研组",
    gender: "female",
    description:
      "思政课教学骨干，善于将时事热点融入课堂教学，让思政课堂“活”起来。积极参与社区志愿服务，获评江苏省师德模范和优秀党务工作者。",
  },
]

export default function PartyMembersPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="党员风采"
        subtitle="Party Members"
        breadcrumbs={[{ label: "党建工作", href: "/party" }, { label: "党员风采" }]}
        sidebarItems={sidebarItems}
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            江苏省丹阳高级中学拥有一支信念坚定、师德高尚、业务精湛的党员教师队伍。他们在各自岗位上发挥先锋模范作用，以实际行动践行共产党员的初心使命，为学校教育事业发展贡献力量。
          </p>

          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              优秀党员风采
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <div
                  key={member.name}
                  className="overflow-hidden rounded-xl bg-[#F8F4ED] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={
                        member.gender === "male"
                          ? "/placeholder-user.jpg"
                          : "/placeholder-user.jpg"
                      }
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-[#333]">{member.name}</h4>
                    <p className="mb-2 text-sm font-medium text-[#8B1A1A]">{member.subject}</p>
                    <p className="text-sm leading-relaxed text-[#666]">{member.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SubPageLayout>
      <Footer />
    </>
  )
}
