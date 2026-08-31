import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { HydrationBeacon } from '@/components/hydration-beacon'
import './globals.css'

export const metadata: Metadata = {
  title: '江苏省丹阳高级中学',
  description: '江苏省丹阳高级中学创建于1941年，前身为私立正则中学，是一所具有深厚历史底蕴的江苏省四星级高中，致力于培养具有家国情怀、国际视野的时代英才。',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 360/QQ/搜狗等双核浏览器强制使用极速（Chromium）内核，避免落到 IE 兼容内核 */}
        <meta name="renderer" content="webkit" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        {/* 必须是普通 script 标签：next/script 的 beforeInteractive 靠 Next 自己的
            runtime 消费队列，旧内核上 runtime 解析失败时 polyfill 也就不会执行 */}
        <script src="/legacy-browser-polyfills.js" />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        <HydrationBeacon />
        {/* IE 内核兜底提示，必须是普通 script 标签，不能依赖 React 注入 */}
        <script src="/legacy-ie-notice.js" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
