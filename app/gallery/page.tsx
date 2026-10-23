"use client"

import Image from "@/components/site-image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowLeft, X } from "lucide-react"
import { galleryFilters, galleryItems, type GalleryCategory } from "@/lib/gallery"

const aspectClasses = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
}

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<GalleryCategory>("All")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filteredItems = useMemo(() => {
    if (activeFilter === "All") return galleryItems
    return galleryItems.filter((item) => item.category === activeFilter)
  }, [activeFilter])

  const selectedItem = filteredItems.find((item) => item.id === selectedId) ?? null

  return (
    <main className="min-h-screen bg-[#fcfbf8] text-[#17181c]">
      <header className="sticky top-0 z-40 border-b border-black/8 bg-[rgba(252,251,248,0.88)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/#gallery"
            className="inline-flex items-center gap-2 text-sm text-[#4d535e] transition-colors hover:text-[#17181c]"
          >
            <ArrowLeft className="h-4 w-4" />
            返回画廊
          </Link>
          <span className="text-xs uppercase tracking-[0.22em] text-[#7f8794]">Gallery</span>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="space-y-5 border-b border-black/8 pb-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm text-[#4d535e]">
              2022-2025
            </span>
          </div>
          <p className="max-w-3xl text-base leading-8 text-[#4d535e]">
            品牌系统、视觉语言与平面设计作品集，展示审美判断力与多元媒介驾驭能力。
          </p>
          <div className="flex flex-wrap gap-3">
            {galleryFilters.map((filter) => {
              const isActive = filter === activeFilter
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    isActive
                      ? "border-[#17181c] bg-[#17181c] text-[#fcfbf8]"
                      : "border-black/10 bg-white text-[#4d535e] hover:border-black/20 hover:text-[#17181c]"
                  }`}
                  aria-pressed={isActive}
                >
                  {filter}
                </button>
              )
            })}
          </div>
        </div>

        <div className="columns-1 gap-5 pt-8 sm:columns-2">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className="mb-5 block w-full break-inside-avoid overflow-hidden rounded-[10px] border border-black/10 bg-white text-left shadow-[0_18px_60px_rgba(16,18,22,0.05)] transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label={`打开 ${item.title} 作品详情`}
            >
              <div className={`relative w-full overflow-hidden bg-[#f3f0ea] ${aspectClasses[item.aspect]}`}>
                <Image src={item.src} alt={item.alt} fill className="object-cover" />
              </div>
              <div className="space-y-1 border-t border-black/8 px-4 py-4">
                <h2 className="text-xl font-medium text-[#17181c]">{item.title}</h2>
                <p className="text-sm text-[#7f8794]">{item.meta}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="border-t border-black/8 pt-6 text-center text-sm text-[#7f8794]">
          点击任意图片可放大查看
        </p>
      </section>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(9,10,13,0.92)] p-4 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="关闭图片预览"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="w-full max-w-5xl overflow-hidden rounded-[18px] border border-white/10 bg-[#111317] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[12px] bg-black">
              <Image src={selectedItem.src} alt={selectedItem.alt} fill className="object-contain" />
            </div>
            <div className="px-2 pt-3 text-sm text-[#c7c0b7]">
              {selectedItem.title} / {selectedItem.meta}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
