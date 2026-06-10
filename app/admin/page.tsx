import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubPageLayout } from "@/components/sub-page-layout"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "智慧丹中 | 江苏省丹阳高级中学",
}

export default function AdminEntryPage() {
  return (
    <>
      <Header />
      <SubPageLayout title="智慧丹中" subtitle="Admin" breadcrumbs={[{ label: "智慧丹中" }]}>
        <div className="rounded-xl border border-[#E8DCC8] bg-[#FDFBF7] p-6">
          <div className="mb-4 text-[#333]">这是智慧丹中入口页面。</div>
          <Button asChild>
            <Link href="/manage">进入智慧丹中</Link>
          </Button>
        </div>
      </SubPageLayout>
      <Footer />
    </>
  )
}
