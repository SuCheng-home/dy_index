export type RootNewsArticle = {
  id: number
  category: string
  title: string
  summary: string
  date: string
  views: number
  image: string
  isTop?: boolean
  content?: string
  author?: string
}

export type RootNavSubMenu = {
  label: string
  href: string
  children: string[]
}

export type RootNavItem = {
  label: string
  href: string
  image: string
  subMenus: RootNavSubMenu[]
}

export type RootSiteConfig = {
  site: {
    name: string
    englishName: string
    logo: string
    manageUrl: string
    seoTitle: string
    seoDescription: string
  }
  navigation: RootNavItem[]
  hero: {
    autoplayInterval: number
    images: { src: string; alt: string }[]
  }
  news: {
    title: string
    categories: string[]
    newsTitle: string
    announcementTitle: string
    announcementHref: string
    moreHref: string
    items: RootNewsArticle[]
  }
  book: {
    title: string
    subtitle: string
    videoImage: string
    videoMoreText: string
    videoMoreHref: string
    historyText: string
    brochureImage: string
    brochureText: string
    brochureHref: string
  }
  features: {
    eyebrow: string
    title: string
    items: { title: string; subtitle: string; description: string; color: string; href: string }[]
  }
  stats: {
    items: { value: number; suffix: string; label: string; description: string }[]
  }
  gallery: {
    eyebrow: string
    title: string
    categories: string[]
    moreHref: string
    items: {
      id: number
      category: string
      title: string
      image: string
      type: "image" | "video"
      albumId?: number
      albumName?: string
      description?: string
      photoCount?: number
      date?: string
    }[]
  }
  principal: {
    title: string
    image: string
    name: string
    role: string
    paragraphs: string[]
    signature: string
  }
  footer: {
    address: string
    phone: string
    email: string
    hours: string
    quickLinks: { title: string; links: { label: string; href: string }[] }[]
    socialLinks: { name: string; icon: "wechat" | "weibo" | "app"; href: string }[]
    copyright: string
    icp: string
    police: string
    bottomLinks: { label: string; href: string }[]
  }
}
