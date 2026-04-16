export interface SubMenuItem {
  label: string
  children?: string[]
}

export interface NavItem {
  label: string
  href: string
  subMenus: SubMenuItem[]
  imageBd: string
  imageQh: string
}

export const mainNavItems: NavItem[] = [
  {
    label: '校园信息',
    href: '#',
    imageBd: '/bd/hero-1.jpg',
    imageQh: '/qh/nav-campus.jpg',
    subMenus: [
      { label: '学校简介', children: ['办学理念', '校史沿革'] },
      { label: '校长致辞' },
      { label: '领导班子' },
      { label: '组织架构' },
      { label: '校园风光', children: ['校园全景', '建筑掠影'] },
      { label: '校歌校训' },
      { label: '荣誉殿堂' },
    ],
  },
  {
    label: '党建工作',
    href: '#',
    imageBd: '/bd/hero-2.jpg',
    imageQh: '/qh/nav-party.jpg',
    subMenus: [
      { label: '党委办公室', children: ['党建动态', '文明建设'] },
      { label: '支部活动' },
      { label: '主题教育' },
      { label: '廉洁建设' },
      { label: '工会工作' },
      { label: '团委工作', children: ['团员活动', '志愿服务'] },
    ],
  },
  {
    label: '德育之窗',
    href: '#',
    imageBd: '/bd/news-1.jpg',
    imageQh: '/qh/nav-student.jpg',
    subMenus: [
      { label: '学生工作处', children: ['班主任工作', '心理健康'] },
      { label: '德育活动' },
      { label: '国旗下讲话' },
      { label: '主题班会' },
      { label: '学生表彰' },
      { label: '家校共育', children: ['家长学校', '家委会'] },
    ],
  },
  {
    label: '教学管理',
    href: '#',
    imageBd: '/bd/news-2.jpg',
    imageQh: '/qh/nav-teaching.jpg',
    subMenus: [
      { label: '科研教学处', children: ['教学动态', '课程安排'] },
      { label: '教研组建设' },
      { label: '课程改革' },
      { label: '考试管理' },
      { label: '教学成果' },
      { label: '招生毕业办公室' },
    ],
  },
  {
    label: '教师发展',
    href: '#teachers',
    imageBd: '/bd/teacher-1.jpg',
    imageQh: '/qh/nav-campus.jpg',
    subMenus: [
      { label: '教师培训', children: ['青蓝工程', '名师工作室'] },
      { label: '教学竞赛' },
      { label: '论文发表' },
      { label: '课题研究' },
      { label: '骨干教师' },
      { label: '师德建设' },
    ],
  },
  {
    label: '群团工作',
    href: '#',
    imageBd: '/bd/student-club.jpg',
    imageQh: '/qh/nav-student.jpg',
    subMenus: [
      { label: '工会群团', children: ['教工活动', '教工之家'] },
      { label: '团委' },
      { label: '学生会' },
      { label: '社团联合会' },
      { label: '青少年航校' },
    ],
  },
  {
    label: '校园服务',
    href: '#',
    imageBd: '/bd/campus-autumn.jpg',
    imageQh: '/qh/nav-campus.jpg',
    subMenus: [
      { label: '学校发展中心', children: ['规划发展', '对外交流'] },
      { label: '学校保障中心' },
      { label: '图书馆' },
      { label: '信息中心' },
      { label: '后勤服务' },
      { label: '校医室' },
    ],
  },
  {
    label: '国际教育',
    href: '#',
    imageBd: '/bd/student-academy.jpg',
    imageQh: '/qh/nav-teaching.jpg',
    subMenus: [
      { label: '国际课程', children: ['AP课程', 'A-Level课程'] },
      { label: '留学指导' },
      { label: '外教团队' },
      { label: '国际交流' },
      { label: '招生咨询' },
      { label: '升学成果' },
    ],
  },
]
