import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
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
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
