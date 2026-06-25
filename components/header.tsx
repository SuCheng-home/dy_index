"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { RootNavItem, RootSiteConfig } from "@/lib/root-site-config"

function GinkgoLeaf({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-hidden="true">
      <path d="M12 2C8 2 4 6 4 12c0 4 2 7 4 9l1-1c2 1 3 2 3 2s1-1 3-2l1 1c2-2 4-5 4-9 0-6-4-10-8-10zm0 2c3 0 6 3 6 8 0 3-1.5 5.5-3 7-1-.5-2-1-3-1s-2 .5-3 1c-1.5-1.5-3-4-3-7 0-5 3-8 6-8z" />
      <path d="M12 6c-2.5 0-4 2-4 5s1.5 5 4 7c2.5-2 4-4 4-7s-1.5-5-4-5z" opacity="0.6" />
    </svg>
  )
}

export function Header({ variant = "default", config }: { variant?: "default" | "home"; config?: RootSiteConfig }) {
  const [liveNavItems, setLiveNavItems] = useState<RootNavItem[]>(config?.navigation ?? [])
  const navItems = liveNavItems
  const site = config?.site
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isOverlay = variant === "home"
  const isTop = isOverlay && !isScrolled
  const currentNavItem = navItems.find((item) => item.label === activeDropdown) ?? null
  const visibleSubMenus = currentNavItem?.subMenus.slice(0, 12) ?? []

  useEffect(() => {
    if (!isOverlay) {
      setIsScrolled(false)
      return
    }

    let frame: number | null = null
    let lastScrolled = window.scrollY > 10
    const documentScrollOptions = { capture: true, passive: true }
    const getScrollTop = () => window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
    const update = () => {
      const nextScrolled = getScrollTop() > 10
      if (nextScrolled !== lastScrolled) {
        lastScrolled = nextScrolled
        setIsScrolled(nextScrolled)
      }
    }
    const scheduleUpdate = () => {
      if (frame !== null) window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        frame = null
        update()
      })
    }

    setIsScrolled(lastScrolled)
    const interval = window.setInterval(update, 250)
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    document.addEventListener("scroll", scheduleUpdate, documentScrollOptions)
    window.addEventListener("wheel", scheduleUpdate, { passive: true })
    window.addEventListener("touchmove", scheduleUpdate, { passive: true })
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame)
      window.clearInterval(interval)
      window.removeEventListener("scroll", scheduleUpdate)
      document.removeEventListener("scroll", scheduleUpdate, documentScrollOptions)
      window.removeEventListener("wheel", scheduleUpdate)
      window.removeEventListener("touchmove", scheduleUpdate)
    }
  }, [isOverlay])

  useEffect(() => {
    setMobileMenuOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  useEffect(() => {
    setLiveNavItems(config?.navigation ?? [])
  }, [config?.navigation])

  useEffect(() => {
    let alive = true
    const domain = window.location.hostname
    const url = domain ? `/api/public/navigation?domain=${encodeURIComponent(domain)}` : "/api/public/navigation"
    fetch(url, { cache: "no-store" })
      .then((response) => response.json())
      .then((json) => {
        if (!alive) return
        const navigation = json?.data?.navigation
        setLiveNavItems(Array.isArray(navigation) ? navigation : [])
      })
      .catch(() => {
        if (alive) setLiveNavItems([])
      })
    return () => {
      alive = false
    }
  }, [])

  const handleNavEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
    setActiveDropdown(label)
  }

  const handleNavLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 160)
  }

  function handleManageClick() {
    window.location.href = "/app"
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 pointer-events-none transition-opacity duration-500"
        style={{ opacity: activeDropdown ? 1 : 0 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: activeDropdown
              ? "linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 42%, rgba(0,0,0,0.18) 72%, transparent 100%)"
              : "transparent",
          }}
        />
      </div>

      <header className={`${isOverlay ? "fixed" : "sticky"} top-0 z-50 w-full`}>
        <div
          className={`transition-all duration-500 ${
            isTop && !activeDropdown
              ? "bg-transparent"
              : "border-b border-[#E8DCC8] bg-white/95 shadow-sm backdrop-blur"
          }`}
        >
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-2 px-3 py-3 xl:px-4">
            <Link href="/" className="flex shrink-0 items-center lg:mr-2 xl:mr-4 2xl:mr-8">
              <img
                src="/logo.png"
                alt={site?.name ?? "江苏省丹阳高级中学"}
                width={350}
                height={75}
                decoding="async"
                data-nimg="1"
                suppressHydrationWarning
                style={{ color: "transparent" }}
                className="h-11 w-auto transition-all duration-300 xl:h-12 2xl:h-14"
              />
            </Link>

            <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0 lg:flex xl:gap-1 2xl:gap-2">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="group relative shrink-0"
                  onMouseEnter={() => handleNavEnter(item.label)}
                  onMouseLeave={handleNavLeave}
                >
                  <Link
                    href={item.href}
                    className={`relative flex items-center whitespace-nowrap px-1.5 py-2 text-[20px] font-semibold tracking-normal transition-all duration-300 xl:px-2 ${
                      isTop && !activeDropdown
                        ? "text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:text-white"
                        : activeDropdown === item.label
                        ? "text-[#8B1A1A]"
                        : "text-[#333] hover:text-[#8B1A1A]"
                    }`}
                    style={isTop && !activeDropdown ? { textShadow: "0 2px 8px rgba(0,0,0,0.6)" } : undefined}
                  >
                    {item.label}
                    <span
                      className="absolute bottom-0 left-1.5 right-1.5 h-[2px] bg-[#8B1A1A] transition-transform duration-300 xl:left-2 xl:right-2"
                      style={{
                        transform: activeDropdown === item.label ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: "center",
                      }}
                    />
                  </Link>
                </div>
              ))}
            </nav>

            <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-2 lg:gap-2 xl:ml-3 2xl:gap-4">
              <button
                type="button"
                onClick={handleManageClick}
                className={`group relative flex h-11 items-center justify-center gap-1.5 px-0 pb-1 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/70 focus-visible:ring-offset-2 xl:text-[15px] ${
                  isTop && !activeDropdown
                    ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.65)] hover:text-[#F7E8B6] focus-visible:ring-offset-transparent"
                    : "text-[#8B1A1A] hover:text-[#6B1010] focus-visible:ring-offset-white"
                }`}
              >
                <GinkgoLeaf
                  className={`h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-12 ${
                    isTop && !activeDropdown ? "text-[#D4AF37]" : "text-[#8B1A1A]"
                  }`}
                />
                <span className="relative z-10 whitespace-nowrap tracking-normal">智慧丹中入口</span>
                <span
                  className={`pointer-events-none absolute bottom-1.5 left-0 right-0 h-[2px] rounded-full transition-colors duration-300 ${
                    isTop && !activeDropdown ? "bg-[#D4AF37]" : "bg-[#8B1A1A]"
                  }`}
                />
              </button>
              <Button
                variant="ghost"
                size="icon"
                className={`lg:hidden ${
                  isTop && !activeDropdown
                    ? "text-white hover:bg-white/10"
                    : "text-[#666] hover:bg-[#8B1A1A]/5 hover:text-[#8B1A1A]"
                }`}
                onClick={() => setMobileMenuOpen((current) => !current)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        <div
          className="h-[3px] transition-opacity duration-300"
          style={{ backgroundColor: "#8B1A1A", opacity: activeDropdown || isScrolled ? 1 : 0 }}
        />

        <div
          className="absolute left-0 right-0 top-full hidden overflow-hidden transition-all duration-400 lg:block"
          style={{
            maxHeight: activeDropdown ? "380px" : "0px",
            opacity: activeDropdown ? 1 : 0,
            boxShadow: activeDropdown ? "0 12px 40px rgba(0,0,0,0.1)" : "none",
          }}
          onMouseEnter={() => {
            if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
          }}
          onMouseLeave={handleNavLeave}
        >
          <div className="border-t border-[#E8DCC8] bg-[#FDFBF7]">
            <div className="mx-auto flex max-w-[1400px]" style={{ minHeight: "380px" }}>
              <div className="relative w-[36%] max-w-[520px] shrink-0 overflow-hidden">
                {currentNavItem ? (
                  <Image
                    src={currentNavItem.image || "https://cdnfile-10043692.file.myqcloud.com/productVersion/common/danyang/省丹中画册/view3.jpg"}
                    alt={currentNavItem.label}
                    fill
                    className="object-cover transition-transform duration-700"
                    style={{ transform: "scale(1.02)" }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(253,251,247,0.14)_58%,rgba(253,251,247,0.96)_100%)]" />
              </div>

              <div className="flex flex-1 items-center px-8 py-9 xl:px-12">
                <div className="flex h-[266px] w-full flex-col">
                  <div className="flex h-[92px] shrink-0 items-start justify-between gap-6">
                    <div className="pt-1">
                      <p className="text-xs font-semibold tracking-[0.2em] text-[#B8860B]">栏目导航</p>
                      <h3 className="mt-2 font-serif text-3xl font-bold text-[#3B1D1D]">{currentNavItem?.label}</h3>
                    </div>
                  </div>

                  <div className="grid min-h-[174px] grid-cols-2 content-start border-t border-[#E8DCC8]">
                    {visibleSubMenus.map((sub, index) => (
                      <Link
                        key={sub.label}
                        href={sub.href || currentNavItem?.href || "/"}
                        className={`group relative flex min-h-[58px] items-center gap-4 border-b border-[#E8DCC8] px-1 py-3 transition-colors duration-300 hover:bg-white ${
                          index % 2 === 0 ? "pr-7" : "pl-7"
                        }`}
                      >
                        <span className="w-9 shrink-0 font-serif text-lg font-bold text-[#D4AF37] transition-colors group-hover:text-[#8B1A1A]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[16px] font-semibold text-[#332927] transition-colors group-hover:text-[#8B1A1A]">
                            {sub.label}
                          </span>
                          {sub.children.length > 0 ? (
                            <span className="mt-1 block truncate text-xs text-[#9A8D83]">
                              {sub.children.slice(0, 3).join(" / ")}
                            </span>
                          ) : null}
                        </span>
                        <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#8B1A1A] transition-all duration-300 group-hover:w-16" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="animate-in slide-in-from-top-2 max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-[#E8DCC8] bg-white lg:hidden">
            <nav className="mx-auto max-w-7xl px-4 py-4">
              {navItems.map((item) => (
                <div key={item.label} className="border-b border-[#E8DCC8] last:border-b-0">
                  <button
                    className="flex w-full items-center justify-between py-3 text-left font-medium text-[#333]"
                    onClick={() => setActiveDropdown((current) => (current === item.label ? null : item.label))}
                  >
                    {item.label}
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${activeDropdown === item.label ? "max-h-96 pb-3" : "max-h-0"}`}>
                    <div className="space-y-1 pl-4">
                      {item.subMenus.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href || item.href}
                          className="block py-2 text-sm text-[#666] transition-colors hover:text-[#8B1A1A]"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
