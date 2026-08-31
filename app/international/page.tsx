"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarDays, Globe2, Languages, Map, Newspaper, Users } from "lucide-react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

type Locale = "zh" | "en"
type InternationalSection = {
  id: string
  label: string
  englishLabel: string
  eyebrow: string
  title: string
  summary: string
  image: string
  icon: typeof Globe2
  highlights: string[]
  englishHighlights: string[]
  news: {
    title: string
    date: string
    summary: string
    image: string
  }[]
}

const brochureBase = "/school_view/（提取图片）9.24省丹中画册-定稿"

const sections: InternationalSection[] = [
  {
    id: "admission",
    label: "招生",
    englishLabel: "Admission",
    eyebrow: "International Admission",
    title: "面向有国际升学规划的学生开放成长通道",
    summary:
      "国际教育项目围绕语言能力、学术基础、综合素养和升学规划建立一体化培养体系，帮助学生更早理解海外学习路径，稳步完成从高中课堂到国际大学申请的衔接。",
    image: `${brochureBase}/第24页-188.PNG`,
    icon: Newspaper,
    highlights: ["入学评估", "语言支持", "升学规划"],
    englishHighlights: ["Assessment", "Language Support", "Pathway Planning"],
    news: [
      {
        title: "2026级国际教育项目招生说明会举行",
        date: "2026-04-18",
        summary:
          "学校面向初三学生和家长介绍国际教育项目课程结构、培养路径和升学支持，现场设置课程咨询与一对一答疑。",
        image: `${brochureBase}/第24页-188.PNG`,
      },
      {
        title: "国际课程体验日开放报名",
        date: "2026-04-11",
        summary:
          "体验日将开放英语学术写作、跨文化表达和项目制学习课堂，让学生提前感受国际教育项目的学习节奏。",
        image: `${brochureBase}/第25页-196.PNG`,
      },
    ],
  },
  {
    id: "about",
    label: "关于我们",
    englishLabel: "About Us",
    eyebrow: "About Program",
    title: "以丹中底蕴承载国际视野",
    summary:
      "项目坚持学校大成教育传统，将扎实的国家课程基础与国际理解教育结合，关注学生的学术表达、独立研究、公共沟通和社会责任。",
    image: `${brochureBase}/第20页-145.PNG`,
    icon: Globe2,
    highlights: ["国家课程基础", "双语学习场景", "跨文化素养"],
    englishHighlights: ["National Curriculum", "Bilingual Learning", "Global Literacy"],
    news: [
      {
        title: "国际教育中心发布新学期课程图谱",
        date: "2026-04-09",
        summary:
          "课程图谱覆盖学术英语、全球议题探究、实验科学拓展和升学作品集指导，进一步提升项目培养的连贯性。",
        image: `${brochureBase}/第20页-145.PNG`,
      },
      {
        title: "学生跨文化表达工作坊顺利开展",
        date: "2026-03-30",
        summary:
          "工作坊通过演讲、辩论和小组展示训练学生的观点组织能力，帮助学生在真实交流中建立自信。",
        image: `${brochureBase}/第30页-219.PNG`,
      },
    ],
  },
  {
    id: "exchange",
    label: "国际交流",
    englishLabel: "Exchange",
    eyebrow: "Global Exchange",
    title: "在真实交流中理解不同文化与世界",
    summary:
      "学校持续推进友好学校互访、线上联合课堂和国际主题活动，让学生在对话、协作和展示中拓展视野，建立尊重差异的全球意识。",
    image: `${brochureBase}/第38页-376.PNG`,
    icon: Users,
    highlights: ["友好学校", "师生互访", "联合课堂"],
    englishHighlights: ["Partner Schools", "Mutual Visits", "Joint Classes"],
    news: [
      {
        title: "友好学校线上联合课堂聚焦城市可持续发展",
        date: "2026-04-16",
        summary:
          "中外学生围绕校园节能、城市交通和公共空间进行资料调研，并以英文完成小组成果展示。",
        image: `${brochureBase}/第38页-376.PNG`,
      },
      {
        title: "国际文化周策划会启动",
        date: "2026-04-02",
        summary:
          "学生团队将围绕语言、艺术、科学和公益四个主题策划活动，推动国际理解教育融入校园生活。",
        image: `${brochureBase}/第41页-424.PNG`,
      },
    ],
  },
  {
    id: "study",
    label: "海外研学",
    englishLabel: "Study Tours",
    eyebrow: "Overseas Study",
    title: "从校园走向世界课堂",
    summary:
      "海外研学项目重视行前研究、现场体验和返校复盘，引导学生把旅行转化为可表达、可沉淀、可延展的学习成果。",
    image: `${brochureBase}/第25页-196.PNG`,
    icon: Map,
    highlights: ["行前研究", "海外课堂", "成果汇报"],
    englishHighlights: ["Pre-trip Research", "Overseas Classes", "Presentations"],
    news: [
      {
        title: "暑期海外研学项目完成路线初审",
        date: "2026-04-13",
        summary:
          "项目路线覆盖大学课堂体验、博物馆学习和城市文化调研，学生将以小组课题形式完成研学任务。",
        image: `${brochureBase}/第25页-196.PNG`,
      },
      {
        title: "研学成果分享会展示学生研究报告",
        date: "2026-03-22",
        summary:
          "学生从公共艺术、科学教育和城市治理等角度分享研学观察，呈现了跨学科思考和英文表达成果。",
        image: `${brochureBase}/第30页-218.PNG`,
      },
    ],
  },
  {
    id: "projects",
    label: "合作项目",
    englishLabel: "Programs",
    eyebrow: "Partnerships",
    title: "以合作项目拓宽学生未来选择",
    summary:
      "学校与海外教育机构开展课程共建、学术竞赛指导和升学资源对接，为不同发展方向的学生提供更有弹性的成长路径。",
    image: `${brochureBase}/第30页-219.PNG`,
    icon: Languages,
    highlights: ["课程共建", "学术拓展", "升学指导"],
    englishHighlights: ["Co-built Courses", "Academic Extension", "Counseling"],
    news: [
      {
        title: "国际合作项目学生完成阶段性学术展示",
        date: "2026-04-07",
        summary:
          "学生围绕人工智能伦理、环境科学和全球经济议题展示研究成果，教师团队从研究方法和表达逻辑进行点评。",
        image: `${brochureBase}/第30页-219.PNG`,
      },
      {
        title: "升学指导工作坊聚焦申请材料准备",
        date: "2026-03-19",
        summary:
          "工作坊帮助学生梳理个人经历、学术兴趣和活动成果，为后续文书写作和面试准备打好基础。",
        image: `${brochureBase}/第36页-320.PNG`,
      },
    ],
  },
  {
    id: "teachers",
    label: "外教风采",
    englishLabel: "Faculty",
    eyebrow: "Foreign Faculty",
    title: "外教课堂让语言学习进入真实语境",
    summary:
      "外教团队参与口语表达、文化主题课程和项目展示辅导，帮助学生在交流中提升语言准确度、表达自信和文化理解力。",
    image: `${brochureBase}/第41页-424.PNG`,
    icon: Users,
    highlights: ["口语课堂", "文化课程", "展示辅导"],
    englishHighlights: ["Speaking Classes", "Culture Courses", "Presentation Coaching"],
    news: [
      {
        title: "外教主题课堂开展全球节日文化探究",
        date: "2026-04-05",
        summary:
          "课堂通过资料阅读、情境讨论和小组展示，引导学生比较不同文化中的节日传统与价值表达。",
        image: `${brochureBase}/第41页-424.PNG`,
      },
      {
        title: "英语角活动聚焦公共演讲表达",
        date: "2026-03-27",
        summary:
          "外教带领学生练习观点陈述、即兴回应和舞台表达，帮助学生在轻松互动中提升英语输出能力。",
        image: `${brochureBase}/第38页-377.PNG`,
      },
    ],
  },
]

const menuLabels = {
  zh: {
    language: "EN",
    latest: "栏目动态",
    readMore: "查看新闻",
    bannerTitle: "国际教育",
    bannerSubtitle: "International Education",
  },
  en: {
    language: "中文",
    latest: "栏目动态",
    readMore: "查看新闻",
    bannerTitle: "International Education",
    bannerSubtitle: "Global Vision, Dazhong Foundation",
  },
}

export default function InternationalPage() {
  const [locale, setLocale] = useState<Locale>("en")
  const [activeId, setActiveId] = useState(sections[0].id)
  const activeSection = useMemo(
    () => sections.find((section) => section.id === activeId) ?? sections[0],
    [activeId]
  )
  const labels = menuLabels[locale]
  const activeHighlights = locale === "zh" ? activeSection.highlights : activeSection.englishHighlights

  useEffect(() => {
    const syncFromHash = () => {
      const id = window.location.hash.replace("#section-", "")
      if (sections.some((section) => section.id === id)) {
        setActiveId(id)
        requestAnimationFrame(() => {
          document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
        })
      }
    }

    syncFromHash()
    window.addEventListener("hashchange", syncFromHash)
    return () => window.removeEventListener("hashchange", syncFromHash)
  }, [])

  const handleSelect = (id: string) => {
    setActiveId(id)
    window.history.replaceState(null, "", `#section-${id}`)
    requestAnimationFrame(() => {
      document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#333]">
      <Header />
      <main>
        <section className="relative min-h-[440px] overflow-hidden bg-[#8B1A1A] pt-16 text-white sm:min-h-[500px] sm:pt-20 lg:min-h-[620px]">
          <Image
            src={`${brochureBase}/第24页-188.PNG`}
            alt="国际教育栏目横幅"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(75,8,8,0.9)_0%,rgba(112,18,18,0.66)_42%,rgba(112,18,18,0.18)_100%)]" />
          <div className="relative mx-auto flex min-h-[420px] max-w-[1240px] flex-col justify-end px-4 pb-8 pt-24 sm:min-h-[480px] sm:px-8 sm:pb-10 sm:pt-28 lg:min-h-[600px] lg:pb-14">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex items-center gap-2 border-l-4 border-[#D8B15D] bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] backdrop-blur-md sm:mb-5 sm:px-4 sm:text-sm sm:tracking-[0.22em]">
                <Globe2 className="h-4 w-4" />
                {labels.bannerSubtitle}
              </p>
              <h1 className="font-serif text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl">
                {labels.bannerTitle}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/86 sm:mt-6 sm:text-lg sm:leading-8">
                以扎实学术根基连接世界课堂，让学生在真实交流、项目学习和国际升学规划中看见更开阔的未来。
              </p>
            </div>
          </div>
        </section>

        <section className="sticky top-[72px] z-30 border-y border-[#E0D4BF] bg-[#FDFBF7]/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1240px] items-center gap-3 overflow-x-auto overscroll-x-contain px-4 py-3 sm:px-8">
            <nav className="flex min-w-max flex-1 items-center gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => handleSelect(section.id)}
                  className={`h-10 rounded-full px-4 text-sm font-semibold transition-all ${
                    activeId === section.id
                      ? "bg-[#8B1A1A] text-white shadow-[0_10px_24px_rgba(139,26,26,0.22)]"
                      : "bg-transparent text-[#4A3A33] hover:bg-[#F8F4ED] hover:text-[#8B1A1A]"
                  }`}
                >
                  {locale === "zh" ? section.label : section.englishLabel}
                </button>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => setLocale((current) => (current === "zh" ? "en" : "zh"))}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#8B1A1A]/20 bg-white px-4 text-sm font-bold text-[#8B1A1A] shadow-sm transition-colors hover:bg-[#8B1A1A] hover:text-white"
            >
              <Languages className="h-4 w-4" />
              {labels.language}
            </button>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1240px] gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:py-16">
          <div id={`section-${activeSection.id}`} className="scroll-mt-36">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#B8860B]">
              {activeSection.eyebrow}
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-[#3B1D1D] sm:text-4xl">
              {activeSection.title}
            </h2>
            <p className="mt-5 text-base leading-8 text-[#5F514A]">{activeSection.summary}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              {activeHighlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#D8B15D]/40 bg-[#FFF8E8] px-4 py-2 text-sm font-semibold text-[#7A5B18]"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-9 overflow-hidden rounded-lg border border-[#E4D8C2] bg-white shadow-[0_18px_45px_rgba(30,45,38,0.10)]">
              <div className="relative aspect-[16/9]">
                <Image src={activeSection.image} alt={activeSection.title} fill className="object-cover" />
              </div>
            </div>
          </div>

          <div className="p-1">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#B8860B]">
                  News
                </p>
                <h3 className="mt-1 text-2xl font-bold text-[#3B1D1D]">{labels.latest}</h3>
              </div>
              <activeSection.icon className="h-9 w-9 rounded-full bg-[#F8F4ED] p-2 text-[#8B1A1A]" />
            </div>
            <div className="space-y-4">
              {activeSection.news.map((item) => (
                <Link
                  key={item.title}
                  href="/news"
                  className="group grid gap-4 rounded-lg border border-[#E4D8C2] bg-white p-4 shadow-[0_12px_30px_rgba(80,40,30,0.06)] transition-all hover:border-[#8B1A1A]/25 hover:shadow-[0_16px_36px_rgba(139,26,26,0.12)] md:grid-cols-[148px_1fr]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-md">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex min-w-0 flex-col justify-between py-1">
                    <div>
                      <h4 className="line-clamp-2 text-lg font-bold leading-snug text-[#333] transition-colors group-hover:text-[#8B1A1A]">
                        {item.title}
                      </h4>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6F625A]">{item.summary}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="inline-flex items-center gap-1.5 text-[#9A8D83]">
                        <CalendarDays className="h-4 w-4" />
                        {item.date}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-[#8B1A1A]">
                        {labels.readMore}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[#E0D4BF] bg-[#6B1010] px-5 py-12 text-white sm:px-8">
          <div className="mx-auto grid max-w-[1240px] gap-4 sm:grid-cols-3">
            {sections.slice(0, 3).map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => handleSelect(section.id)}
                className="group flex items-center justify-between rounded-lg border border-white/12 bg-white/8 px-5 py-4 text-left transition-all hover:bg-white hover:text-[#6B1010]"
              >
                <span>
                  <span className="block text-lg font-bold">
                    {locale === "zh" ? section.label : section.englishLabel}
                  </span>
                  <span className="mt-1 block text-sm text-white/68 group-hover:text-[#557163]">
                    {(locale === "zh" ? section.highlights : section.englishHighlights).join(" / ")}
                  </span>
                </span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
