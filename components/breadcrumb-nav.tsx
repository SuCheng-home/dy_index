import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link
        href="/"
        className="flex items-center gap-1 text-[#666] transition-colors hover:text-[#8B1A1A]"
      >
        <Home className="h-4 w-4" />
        <span>首页</span>
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-[#999]" />
          {item.href ? (
            <Link href={item.href} className="text-[#666] transition-colors hover:text-[#8B1A1A]">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-[#8B1A1A]">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
