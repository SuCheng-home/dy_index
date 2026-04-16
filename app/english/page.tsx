import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export const metadata = {
  title: "English | Jiangsu Danyang High School",
  description: "English information page of Jiangsu Danyang High School",
}

export default function EnglishPage() {
  return (
    <>
      <Header />
      <main className="min-h-[70vh] bg-[#FDFBF7]">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <h1 className="mb-4 font-serif text-4xl font-bold text-[#8B1A1A]">English</h1>
          <p className="mb-10 text-[#555]">
            Welcome to Jiangsu Danyang High School. This English section is under continuous update.
          </p>
          <div className="rounded-xl border border-[#E8DCC8] bg-white p-6">
            <h2 className="mb-3 text-xl font-semibold text-[#333]">Quick Links</h2>
            <ul className="space-y-2 text-[#8B1A1A]">
              <li>
                <Link href="/about" className="hover:underline">
                  School Overview
                </Link>
              </li>
              <li>
                <Link href="/international" className="hover:underline">
                  International Education
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:underline">
                  News Center
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
