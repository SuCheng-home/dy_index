import { GraduationCap, Users, BookOpen, Calendar, Award, FileText } from "lucide-react"
import Link from "next/link"

const quickLinks = [
  { icon: GraduationCap, label: "招生信息", href: "#", color: "from-blue-500 to-blue-600" },
  { icon: Users, label: "师资队伍", href: "#", color: "from-sky-500 to-sky-600" },
  { icon: BookOpen, label: "教学成果", href: "#", color: "from-cyan-500 to-cyan-600" },
  { icon: Calendar, label: "校历安排", href: "#", color: "from-blue-400 to-blue-500" },
  { icon: Award, label: "荣誉展示", href: "#", color: "from-indigo-500 to-indigo-600" },
  { icon: FileText, label: "资料下载", href: "#", color: "from-blue-600 to-blue-700" },
]

export function QuickLinks() {
  return (
    <section className="relative -mt-16 z-20 mx-auto max-w-7xl px-4">
      <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
        {quickLinks.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group flex flex-col items-center gap-3 rounded-xl bg-card p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white transition-transform group-hover:scale-110`}>
              <item.icon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-foreground">{item.label}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
