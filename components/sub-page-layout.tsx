"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { ChevronRight } from "lucide-react"

interface SubPageLayoutProps {
  title: string
  subtitle?: string
  breadcrumbs: { label: string; href?: string }[]
  sidebarItems?: { label: string; href: string }[]
  children: React.ReactNode
  bannerImage?: string
}

export function SubPageLayout({
  title,
  subtitle,
  breadcrumbs,
  sidebarItems,
  children,
  bannerImage = "/view/view5.jpg",
}: SubPageLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* 页面横幅 */}
      <div className="relative h-[40vh] min-h-[300px] max-h-[400px] w-full overflow-hidden bg-[#FDFBF7]">
        <Image src="/view/view4.jpg" alt="" fill priority className="object-cover object-center" />
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
                        pathname === item.href
                          ? "bg-[#8B1A1A] text-white shadow-md"
                          : "text-[#666] hover:bg-[#8B1A1A]/5 hover:text-[#8B1A1A]"
                      )}
                    >
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform",
                          pathname === item.href
                            ? "text-[#D4AF37]"
                            : "text-[#999] group-hover:translate-x-1 group-hover:text-[#8B1A1A]"
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
