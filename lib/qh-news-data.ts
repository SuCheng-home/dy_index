export type QhNewsKind = "news" | "notice"

export type QhNewsArticle = {
  id: string
  kind: QhNewsKind
  title: string
  date: string
  category: string
  image?: string
  excerpt: string
  content: string
  author: string
  views: number
}

export const QH_NEWS_ARTICLES: QhNewsArticle[] = [
  {
    id: "1",
    kind: "news",
    title: "学校入选全国党建工作示范校",
    date: "2026-04-15",
    category: "党建工作",
    image: "/qh/news-main.jpg",
    excerpt:
      "近日，我校被中共中央组织部、教育部党组联合评定为“全国中小学党建工作示范校”，这是对我校党建工作的充分肯定。",
    content: `<p>近日，我校被中共中央组织部、教育部党组联合评定为“全国中小学党建工作示范校”，这是对我校党建工作的充分肯定，也是全校师生共同努力的成果。</p>
    <p>学校党委始终坚持党对教育工作的全面领导，深入贯彻落实习近平新时代中国特色社会主义思想，扎实推进党建工作与教育教学深度融合。</p>
    <p>在党建引领下，学校形成了“支部建在年级上、党员亮相课堂中”的工作格局，充分发挥党组织的战斗堡垒作用和党员的先锋模范作用。</p>
    <p>学校将以此次获评为契机，继续深化党建品牌建设，推动学校各项事业高质量发展，为培养德智体美劳全面发展的社会主义建设者和接班人作出新的更大贡献。</p>`,
    author: "党政办公室",
    views: 1256,
  },
  {
    id: "2",
    kind: "news",
    title: "举行树立和践行正确政绩观学习教育领导班子专题读书班集中学习研讨",
    date: "2026-04-13",
    category: "党建工作",
    image: "/qh/news-exam.jpg",
    excerpt: "学校举行领导班子专题读书班，围绕正确政绩观开展集中学习研讨。",
    content: `<p>4月13日，学校举行树立和践行正确政绩观学习教育领导班子专题读书班集中学习研讨活动。</p>
    <p>会上，校党委书记带领全体班子成员深入学习了习近平总书记关于树立正确政绩观的重要论述，并结合学校实际工作进行了深入研讨。</p>
    <p>与会领导纷纷表示，要切实把学习成果转化为推动学校高质量发展的实际行动，真正做到为党育人、为国育才。</p>`,
    author: "党政办公室",
    views: 892,
  },
  {
    id: "3",
    kind: "news",
    title: "住宿部开展“螺钿生辉·匠心传美”主题活动",
    date: "2026-04-12",
    category: "学生活动",
    image: "/qh/news-competition.jpg",
    excerpt: "住宿部组织非遗体验活动，让同学们在实践中感受传统工艺之美。",
    content: `<p>为丰富住宿学生的课余生活，传承中华优秀传统文化，4月12日，住宿部开展了“螺钿生辉·匠心传美”非遗文化体验活动。</p>
    <p>活动邀请了非遗传承人为同学们讲解螺钿工艺的历史渊源和制作技艺，并指导同学们亲手体验螺钿镶嵌工艺。</p>
    <p>同学们在动手实践中感受到了传统工艺的魅力，纷纷表示要做中华优秀传统文化的传承者和弘扬者。</p>`,
    author: "住宿部",
    views: 567,
  },
  {
    id: "4",
    kind: "news",
    title: "每一拍，都是成长的节拍——“班超”羽毛球联赛收官",
    date: "2026-04-10",
    category: "学生活动",
    image: "/qh/campus-landmark.jpg",
    excerpt: "历时两周的“班超”羽毛球联赛圆满落幕，校园体育氛围持续升温。",
    content: `<p>历时两周的校园“班超”羽毛球联赛于4月10日圆满落幕。本次比赛共有32支队伍参赛，经过激烈角逐，最终评选出团体冠亚季军及最佳运动员等奖项。</p>
    <p>比赛中，同学们奋力拼搏、团结协作，展现了丹高学子良好的体育精神和竞技水平。</p>
    <p>学校将继续开展丰富多彩的体育活动，促进学生全面发展，打造健康活力校园。</p>`,
    author: "体育组",
    views: 723,
  },
  {
    id: "n1",
    kind: "notice",
    title: "假期开出国成绩通知说明",
    date: "2025-07-05",
    category: "通知公告",
    excerpt: "暑假期间可通过邮箱申请学生出国成绩单。",
    content: `<p>2025年7月7日—8月31日暑假期间，可通过邮箱申请学生出国成绩单。</p>
    <p>申请流程：</p>
    <ol>
      <li>发送邮件至 jysb@dygjzx.com</li>
      <li>邮件主题：出国成绩单申请+学生姓名+班级</li>
      <li>邮件正文请注明申请原因、联系方式</li>
      <li>收到确认回复后，按指定时间到校领取</li>
    </ol>
    <p>如有疑问，请致电：0511-86522062</p>`,
    author: "教务处",
    views: 456,
  },
  {
    id: "n2",
    kind: "notice",
    title: "“安全接送·文明交通”倡议书",
    date: "2025-07-04",
    category: "通知公告",
    excerpt: "倡导规范接送，共建安全、文明、和谐的校园交通环境。",
    content: `<p>尊敬的家长朋友们：</p>
    <p>为确保校园周边交通安全有序，营造良好的育人环境，现向全体家长发出如下倡议：</p>
    <ol>
      <li>请在指定区域停车，不占用消防通道</li>
      <li>接送时段请服从交警和保安指挥</li>
      <li>鼓励学生步行或乘坐公共交通</li>
      <li>以身作则，遵守交通法规</li>
    </ol>
    <p>让我们携手共建安全、文明、和谐的校园交通环境！</p>`,
    author: "安保处",
    views: 389,
  },
  {
    id: "n3",
    kind: "notice",
    title: "江苏省丹阳高级中学在读证明（出境/出国使用）填写及下载指南",
    date: "2025-01-16",
    category: "通知公告",
    excerpt: "在读证明线上申请、审核与下载流程说明。",
    content: `<p>为方便学生办理出境、出国相关手续，现将在读证明填写及下载流程说明如下：</p>
    <ol>
      <li>登录学校智校平台</li>
      <li>进入“学生服务”—“证明开具”</li>
      <li>选择“在读证明（出境/出国使用）”</li>
      <li>填写相关信息并提交</li>
      <li>等待审核通过后下载打印</li>
    </ol>
    <p>如需纸质盖章版本，请携带打印件到教务处办理。</p>`,
    author: "教务处",
    views: 678,
  },
  {
    id: "n4",
    kind: "notice",
    title: "关于申请出具毕业证英文翻译版的说明",
    date: "2024-09-01",
    category: "通知公告",
    excerpt: "毕业证英文翻译版开具流程与办理时间说明。",
    content: `<p>为方便校友办理出国留学、工作等手续，学校提供毕业证英文翻译版开具服务。</p>
    <p>办理流程：</p>
    <ol>
      <li>携带身份证原件及毕业证原件</li>
      <li>到学校档案室填写申请表</li>
      <li>缴纳翻译费用</li>
      <li>5个工作日后领取</li>
    </ol>
    <p>办公时间：周一至周五 8:30-11:30，14:00-17:00</p>
    <p>联系电话：0511-86522063</p>`,
    author: "档案室",
    views: 234,
  },
]

export function getQhNewsById(id: string) {
  return QH_NEWS_ARTICLES.find((item) => item.id === id)
}

export function getQhNewsByKind(kind: QhNewsKind) {
  return QH_NEWS_ARTICLES.filter((item) => item.kind === kind)
}

export function getQhRelatedNews(id: string, limit = 3) {
  const current = getQhNewsById(id)
  if (!current) return getQhNewsByKind("news").slice(0, limit)

  return getQhNewsByKind(current.kind)
    .filter((item) => item.id !== id)
    .slice(0, limit)
}
