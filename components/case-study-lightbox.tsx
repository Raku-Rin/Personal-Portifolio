"use client"

import Image from "@/components/site-image"
import { Expand } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type CaseStudyLightboxProps = {
  src: string
  alt: string
  caption: string
  className?: string
  priority?: boolean
}

export function CaseStudyLightbox({
  src,
  alt,
  caption,
  className,
  priority = false,
}: CaseStudyLightboxProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={`group relative block w-full overflow-hidden rounded-[10px] border border-black/10 bg-[#f5f1e8] text-left shadow-[0_18px_60px_rgba(16,18,22,0.08)] ${className ?? ""}`}
          aria-label={`Open enlarged image: ${caption}`}
        >
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/0" />
            <div className="absolute right-4 bottom-4 flex items-center gap-2 rounded-full border border-white/40 bg-black/55 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
              <Expand className="h-3.5 w-3.5" />
              点击放大
            </div>
          </div>
          <div className="border-t border-black/8 px-4 py-3 text-sm text-[#4d535e]">
            {caption}
          </div>
        </button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="max-w-6xl border-white/10 bg-[#111317] p-3 text-[#f5f1ea] shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
      >
        <DialogTitle className="sr-only">{caption}</DialogTitle>
        <DialogDescription className="sr-only">{alt}</DialogDescription>
        <div className="relative max-h-[85vh] overflow-hidden rounded-[12px] bg-black">
          <div className="relative aspect-[16/10] max-h-[75vh] w-full">
            <Image src={src} alt={alt} fill className="object-contain" />
          </div>
        </div>
        <div className="px-2 pb-2 text-sm text-[#c7c0b7]">{caption}</div>
      </DialogContent>
    </Dialog>
  )
}
