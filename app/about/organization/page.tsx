import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Calendar, ArrowRight } from "lucide-react"

export const metadata = {
  title: "组织机构 | 江苏省丹阳高级中学",
  description: "江苏省丹阳高级中学组织机构设置，了解学校各部门职能与分工",
}

const sidebarItems = [
  { label: "学校概况", href: "/about" },
  { label: "校史沿革", href: "/about/history" },
  { label: "校园风光", href: "/about/campus" },
  { label: "组织机构", href: "/about/organization" },
  { label: "领导班子", href: "/about/leadership" },
  { label: "食堂菜谱", href: "/about/canteen" },
]

const departments = [
  {
    name: "校办（办公室）",
    description: "负责学校行政事务协调、对外联络、文件管理、会议组织及校务公开等综合管理工作。",
  },
  {
    name: "教务处",
    description: "负责教学计划制定与执行、课程安排、考试管理、学籍管理及教学质量监控等工作。",
  },
  {
    name: "学生处（德育处）",
    description: "负责学生思想品德教育、日常行为规范管理、班主任队伍建设及心理健康教育等工作。",
  },
  {
    name: "教科室",
    description: "负责教育科研课题管理、教师专业发展培训、教学成果推广及学术交流活动组织等工作。",
  },
  {
    name: "总务处",
    description: "负责学校后勤保障、校园基础设施维护、财务管理、物资采购及食堂宿舍管理等工作。",
  },
  {
    name: "团委",
    description: "负责共青团组织建设、学生社团管理、志愿服务活动组织及校园文化活动策划等工作。",
  },
  {
    name: "安全保卫处",
    description: "负责校园安全管理、消防安全、治安防范、应急预案制定及安全教育宣传等工作。",
  },
  {
    name: "信息中心",
    description: "负责校园信息化建设、网络与设备维护、教育技术支持及数字化校园平台管理等工作。",
  },
]

const news = [
  {
    id: "org-1",
    title: "我校召开2025年度部门工作述职评议会议",
    summary: "为全面总结各部门年度工作成效，推动学校管理水平持续提升，我校于近日召开了2025年度部门工作述职评议会议，各部门负责人逐一汇报工作。",
    date: "2025-12-20",
    image: "/view/view1.jpg",
  },
  {
    id: "org-2",
    title: "学校组织机构优化调整方案正式实施",
    summary: "为进一步提升学校治理效能，优化资源配置，经校务委员会审议通过，学校组织机构优化调整方案于本学期正式实施，新增信息中心等部门。",
    date: "2025-09-15",
    image: "/view/view7.jpg",
  },
  {
    id: "org-3",
    title: "各部门协同开展校园安全大检查",
    summary: "为保障师生安全和校园稳定，学校组织校办、总务处、安全保卫处等多部门联合开展校园安全大检查，排查各类安全隐患。",
    date: "2025-11-08",
    image: "/view/view7.jpg",
  },
]

export default function OrganizationPage() {
  return (
    <>
      <Header />
      <SubPageLayout
        title="组织机构"
        subtitle="Organization"
        breadcrumbs={[{ label: "校园信息", href: "/about" }, { label: "组织机构" }]}
        sidebarItems={sidebarItems}
      >
        <div className="space-y-8">
          <p className="text-lg leading-relaxed text-[#555]">
            江苏省丹阳高级中学设有校办、教务处、学生处、教科室、总务处、团委等职能部门，各部门分工明确、协调配合，形成了科学高效的管理体系，为学校教育教学工作的顺利开展提供坚实的组织保障。
          </p>

          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              部门设置
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {departments.map((dept) => (
                <div
                  key={dept.name}
                  className="rounded-lg border-l-4 border-[#8B1A1A] bg-[#F8F4ED] p-5"
                >
                  <h4 className="mb-2 text-lg font-bold text-[#333]">{dept.name}</h4>
                  <p className="text-sm leading-relaxed text-[#666]">{dept.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-6 flex items-center gap-2 border-b-2 border-[#8B1A1A] pb-3 text-xl font-bold text-[#333]">
              <span className="h-6 w-1.5 rounded bg-[#8B1A1A]" />
              组织工作动态
            </h3>
            <div className="grid gap-6">
              {news.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="group flex flex-col gap-5 rounded-xl bg-[#F8F4ED] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:flex-row"
                >
                  <div className="relative h-48 w-full flex-shrink-0 overflow-hidden rounded-lg sm:h-36 sm:w-52">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h4 className="mb-2 text-lg font-bold text-[#333] transition-colors group-hover:text-[#8B1A1A]">
                        {item.title}
                      </h4>
                      <p className="line-clamp-2 text-sm text-[#666]">{item.summary}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-xs text-[#999]">
                        <Calendar className="h-3.5 w-3.5" />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-[#8B1A1A] opacity-0 transition-opacity group-hover:opacity-100">
                        阅读更多
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </SubPageLayout>
      <Footer />
    </>
  )
}
