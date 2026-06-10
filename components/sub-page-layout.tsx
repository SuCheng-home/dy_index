"use client"

import type { CSSProperties } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"

function GinkgoLeaf({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-hidden="true">
      <path d="M12 2C8 2 4 6 4 12c0 4 2 7 4 9l1-1c2 1 3 2 3 2s1-1 3-2l1 1c2-2 4-5 4-9 0-6-4-10-8-10zm0 2c3 0 6 3 6 8 0 3-1.5 5.5-3 7-1-.5-2-1-3-1s-2 .5-3 1c-1.5-1.5-3-4-3-7 0-5 3-8 6-8z" />
      <path d="M12 6c-2.5 0-4 2-4 5s1.5 5 4 7c2.5-2 4-4 4-7s-1.5-5-4-5z" opacity="0.6" />
    </svg>
  )
}

interface SubPageLayoutProps {
  title: string
  subtitle?: string
  breadcrumbs: { label: string; href?: string }[]
  sidebarItems?: { label: string; href: string }[]
  children: React.ReactNode
  bannerImage?: string
  activePath?: string
}

export function SubPageLayout({
  title,
  subtitle,
  breadcrumbs,
  sidebarItems,
  children,
  bannerImage = "/school_view/（提取图片）9.24省丹中画册-定稿/第25页-196.PNG",
  activePath,
}: SubPageLayoutProps) {
  const pathname = usePathname()
  const hasPathMatch = sidebarItems?.some((item) => item.href === pathname) ?? false
  const currentPath = activePath ?? (hasPathMatch ? pathname : sidebarItems?.[0]?.href ?? pathname)

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* 页面横幅 */}
      <div className="relative h-[46vh] min-h-[360px] max-h-[500px] w-full overflow-hidden bg-[#FDFBF7]">
        <Image src={bannerImage} alt="" fill priority className="object-cover object-center" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />
      </div>

      {/* 面包屑导航 */}
      <div className="border-b border-[#E8DCC8] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <BreadcrumbNav items={breadcrumbs} />
        </div>
      </div>

      {/* 主内容区 */}
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* 侧边栏 */}
          {sidebarItems && sidebarItems.length > 0 && (
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="sticky top-24 rounded-xl bg-white p-6 shadow-md">
                <h3 className="mb-4 border-b-2 border-[#8B1A1A] pb-3 font-bold text-[#333]">
                  栏目导航
                </h3>
                <nav className="space-y-1">
                  {sidebarItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-2 rounded-lg px-4 py-3 text-sm transition-all duration-300",
                        currentPath === item.href
                          ? "bg-[#8B1A1A] text-white shadow-md"
                          : "text-[#666] hover:bg-[#8B1A1A]/5 hover:text-[#8B1A1A]"
                      )}
                    >
                      <GinkgoLeaf
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform",
                          currentPath === item.href
                            ? "text-[#D4AF37]"
                            : "text-[#8B1A1A] group-hover:-translate-y-0.5 group-hover:-rotate-12"
                        )}
                      />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* 内容区 */}
          <main
            className={cn(
              "animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 rounded-xl bg-white p-8 shadow-md",
              !sidebarItems && "max-w-4xl mx-auto"
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
