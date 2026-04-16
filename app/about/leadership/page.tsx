import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "领导班子 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学领导班子介绍，了解学校管理团队",
}

const sidebarItems = [
  { label: "学校概况", href: "/about" },
  { label: "校史沿革", href: "/about/history" },
  { label: "校园风光", href: "/about/campus" },
  { label: "组织机构", href: "/about/organization" },
  { label: "领导班子", href: "/about/leadership" },
  { label: "食堂菜谱", href: "/about/canteen" },
]

const leaders = [
  {
    name: "张建国",
    title: "党委书记、校长",
    gender: "male",
    description:
      "中学正高级教师，江苏省特级教师，教育学博士。长期从事高中物理教学与学校管理工作，曾获江苏省优秀教育工作者、丹阳市十佳校长等荣誉称号。致力于推动学校教育改革与高质量发展。",
  },
  {
    name: "李明华",
    title: "党委副书记、副校长",
    gender: "male",
    description:
      "中学高级教师，分管学校德育工作与党务工作。注重学生全面发展与思想政治教育，积极推进校园文化建设，曾获江苏省优秀党务工作者称号。",
  },
  {
    name: "王秀芳",
    title: "副校长",
    gender: "female",
    description:
      "中学高级教师，江苏省教学名师，分管教学工作。深耕高中英语教学二十余年，主持多项省级教育科研课题，推动课堂教学改革与教师专业发展。",
  },
  {
    name: "陈志强",
    title: "副校长",
    gender: "male",
    description:
      "中学高级教师，分管后勤保障与信息化建设。具有丰富的学校管理经验，积极推动智慧校园建设，提升学校后勤服务保障水平。",
  },
  {
    name: "刘晓红",
    title: "工会主席",
    gender: "female",
    description:
      "中学高级教师，分管教职工权益保障与工会工作。关心教职工身心健康，组织丰富多彩的文体活动，营造和谐温馨的校园氛围。",
  },
  {
    name: "赵德明",
    title: "副校长",
    gender: "male",
    description:
      "中学高级教师，分管安全工作与招生工作。注重校园安全体系建设，统筹做好学校招生宣传与考试组织工作，曾获丹阳市优秀管理干部称号。",
  },
]

export default function LeadershipPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="领导班子"
        subtitle="Leadership"
        breadcrumbs={[{ label: "校园信息", href: "/about" }, { label: "领导班子" }]}
        sidebarItems={sidebarItems}
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            江苏省丹阳高级中学拥有一支政治素质高、业务能力强、管理经验丰富的领导班子。班子成员团结协作、锐意进取，始终坚持立德树人根本任务，带领全校师生不断开创学校发展新局面。
          </p>

          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              现任领导
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {leaders.map((leader) => (
                <div
                  key={leader.name}
                  className="overflow-hidden rounded-xl bg-[#F8F4ED] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={
                        leader.gender === "male"
                          ? "/view/view1.jpg"
                          : "/view/view8.jpg"
                      }
                      alt={leader.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="text-lg font-bold text-[#333]">{leader.name}</h4>
                    <p className="mb-2 text-sm font-medium text-[#8B1A1A]">{leader.title}</p>
                    <p className="text-sm leading-relaxed text-[#666]">{leader.description}</p>
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
