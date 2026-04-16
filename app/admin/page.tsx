import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "管理系统 | 江苏省丹阳高级中学",
}

export default function AdminEntryPage() {
  return (
    <>
      <Header />
      <SubPageLayout title="管理系统" subtitle="Admin" breadcrumbs={[{ label: "管理系统" }]}>
        <div className="rounded-xl border border-[#E8DCC8] bg-[#FDFBF7] p-6">
          <div className="mb-4 text-[#333]">这是管理系统入口页面。</div>
          <Button asChild>
            <Link href="#">进入管理系统</Link>
          </Button>
        </div>
      </SubPageLayout>
      <Footer />
    </>
  )
}
