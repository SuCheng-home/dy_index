"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, ChevronLeft, ChevronRight, Eye, Search } from "lucide-react"

import { toMessageHref, type SchoolWebMessage } from "@/lib/school-web-two"

const PAGE_SIZE = 10

type ModuleMessageListProps = {
  messages: SchoolWebMessage[]
  moduleType: number
  badgeLabel?: string
}

export function ModuleMessageList({ messages, moduleType, badgeLabel }: ModuleMessageListProps) {
  const [keyword, setKeyword] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    if (!kw) return messages
    return messages.filter(
      (item) =>
        item.title.toLowerCase().includes(kw) ||
        (item.titleMark ?? "").toLowerCase().includes(kw),
    )
  }, [keyword, messages])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const shouldShowReadCount = pageItems.some((item) => Number(item.readCount) > 0)

  const handleSearch = (value: string) => {
    setKeyword(value)
    setPage(1)
  }

  return (
    <div className="min-w-0 space-y-6 sm:space-y-8">
      {/* 站内搜索（前端过滤，无需再次请求接口） */}
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
        <input
          type="text"
          value={keyword}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="搜索本栏目标题…"
          className="w-full rounded-full border border-[#E8DCC8] bg-white py-2.5 pl-11 pr-4 text-sm text-[#333] outline-none transition-colors focus:border-[#8B1A1A]"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[#E8DCC8] bg-[#F8F4ED] p-6 text-center text-[#666] sm:p-10">
          {keyword.trim() ? `未找到与“${keyword.trim()}”相关的内容。` : "暂无内容。"}
        </div>
      ) : moduleType === 3 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {pageItems.map((item) => (
            <Link
              key={item.id}
              href={toMessageHref(item.id)}
              className="group overflow-hidden rounded-xl bg-[#F8F4ED] shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              {item.logoUrl ? (
                <div className="relative h-48 sm:h-56">
                  <Image src={item.logoUrl} alt={item.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
              ) : null}
              <div className="p-4 sm:p-5">
                <h3 className="break-words text-base font-bold text-[#333] sm:text-lg">{item.title}</h3>
                {item.titleMark ? <p className="mt-2 text-sm text-[#666]">{item.titleMark}</p> : null}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid gap-6">
          {pageItems.map((item) => (
            <Link
              key={item.id}
              href={toMessageHref(item.id)}
              className="group flex min-w-0 flex-col gap-4 rounded-xl bg-[#F8F4ED] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:flex-row sm:gap-5 sm:p-5"
            >
              {item.logoUrl ? (
                <div className="relative h-44 w-full overflow-hidden rounded-lg sm:h-32 sm:w-48 shrink-0">
                  <Image
                    src={item.logoUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  {badgeLabel ? (
                    <div className="mb-2 flex items-center gap-3">
                      <span className="rounded bg-[#D4AF37]/20 px-2 py-0.5 text-xs font-medium text-[#8B1A1A]">
                        {badgeLabel}
                      </span>
                    </div>
                  ) : null}
                  <h3 className="break-words text-base font-bold text-[#333] transition-colors group-hover:text-[#8B1A1A] sm:text-lg">{item.title}</h3>
                  {item.titleMark ? <p className="mt-2 text-sm leading-6 text-[#666]">{item.titleMark}</p> : null}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#999] sm:gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {item.createTime.slice(0, 10)}
                  </span>
                  {shouldShowReadCount ? (
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {Number(item.readCount) || 0}
                    </span>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <Pagination currentPage={currentPage} totalPages={totalPages} onChange={setPage} />
      ) : null}
    </div>
  )
}

function Pagination({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number
  totalPages: number
  onChange: (page: number) => void
}) {
  const pages = buildPageList(currentPage, totalPages)

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
      <button
        type="button"
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex h-11 items-center gap-1 rounded-lg border border-[#E8DCC8] bg-white px-3 text-sm text-[#666] transition-colors hover:border-[#8B1A1A] hover:text-[#8B1A1A] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E8DCC8] disabled:hover:text-[#666]"
      >
        <ChevronLeft className="h-4 w-4" />
        上一页
      </button>

      {pages.map((item, index) =>
        item === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2 text-sm text-[#999]">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`h-11 min-w-11 rounded-lg border px-3 text-sm transition-colors ${
              item === currentPage
                ? "border-[#8B1A1A] bg-[#8B1A1A] text-white"
                : "border-[#E8DCC8] bg-white text-[#666] hover:border-[#8B1A1A] hover:text-[#8B1A1A]"
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex h-11 items-center gap-1 rounded-lg border border-[#E8DCC8] bg-white px-3 text-sm text-[#666] transition-colors hover:border-[#8B1A1A] hover:text-[#8B1A1A] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#E8DCC8] disabled:hover:text-[#666]"
      >
        下一页
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

function buildPageList(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages: (number | "...")[] = [1]
  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  if (start > 2) pages.push("...")
  for (let page = start; page <= end; page += 1) pages.push(page)
  if (end < totalPages - 1) pages.push("...")

  pages.push(totalPages)
  return pages
}
