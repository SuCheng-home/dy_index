export type NewsArticle = {
  id: number
  category: string
  title: string
  summary: string
  date: string
  views: number
  image: string
  isTop: boolean
}

export const NEWS_CATEGORIES = ["全部", "校园新闻", "教学动态", "德育之窗", "科研成果", "媒体报道"]

export const NEWS_DATA: NewsArticle[] = [
  {
    id: 1,
    category: "校园新闻",
    title: "我校召开2026年春季学期教职工大会",
    summary: "会议总结了上学期工作成果，部署了新学期重点任务，强调了师德师风建设的重要性。全体教职工参加了本次大会。",
    date: "2026-04-08",
    views: 1256,
    image: "/view/view6.jpg",
    isTop: true,
  },
  {
    id: 2,
    category: "教学动态",
    title: "高三年级二模考试成绩分析会顺利召开",
    summary: "各学科备课组长深入分析了二模数据，制定了后期复习策略和提升方案，为高考冲刺做好充分准备。",
    date: "2026-04-07",
    views: 892,
    image: "/view/view8.jpg",
    isTop: true,
  },
  {
    id: 3,
    category: "德育之窗",
    title: "我校学生在省青少年科技创新大赛中斩获佳绩",
    summary: "我校代表队荣获一等奖2项、二等奖5项，充分展现了丹中学子的创新精神和实践能力。",
    date: "2026-04-06",
    views: 2341,
    image: "/view/view5.jpg",
    isTop: false,
  },
  {
    id: 4,
    category: "科研成果",
    title: "省级课题《大成教育理念下的学科融合研究》顺利开题",
    summary: "专家组对课题研究方向给予高度肯定，并提出了宝贵的指导意见，为课题研究指明了方向。",
    date: "2026-04-05",
    views: 567,
    image: "/view/view3.jpg",
    isTop: false,
  },
  {
    id: 5,
    category: "校园新闻",
    title: "志愿服务进社区 青春力量暖人心",
    summary: "我校青年志愿者走进丹凤社区，开展义务辅导、环境清洁等志愿服务活动，弘扬志愿精神。",
    date: "2026-04-04",
    views: 456,
    image: "/view/view3.jpg",
    isTop: false,
  },
  {
    id: 6,
    category: "媒体报道",
    title: "《教育日报》专题报道我校素质教育探索",
    summary: "我校在减负增效方面的创新做法获得广泛关注和肯定，为全省教育改革提供了有益借鉴。",
    date: "2026-04-03",
    views: 1893,
    image: "/view/view3.jpg",
    isTop: false,
  },
]
