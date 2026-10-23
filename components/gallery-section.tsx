"use client"

import Image from "@/components/site-image"
import Link from "next/link"
import { useState } from "react"
import { ChevronRight, ChevronLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { galleryItems } from "@/lib/gallery"

const previewImages = galleryItems.slice(0, 8)

export function GallerySection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [previousIndex, setPreviousIndex] = useState<number | null>(null)
  const rowOne = previewImages.slice(0, 4)
  const rowTwo = previewImages.slice(4, 8)

  const openLightbox = (index: number) => {
    setPreviousIndex(null)
    setSelectedIndex(index)
  }

  const closeLightbox = () => {
    setSelectedIndex(null)
    setPreviousIndex(null)
  }

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setPreviousIndex(selectedIndex)
      setSelectedIndex(selectedIndex === 0 ? previewImages.length - 1 : selectedIndex - 1)
    }
  }

  const goToNext = () => {
    if (selectedIndex !== null) {
      setPreviousIndex(selectedIndex)
      setSelectedIndex(selectedIndex === previewImages.length - 1 ? 0 : selectedIndex + 1)
    }
  }

  return (
    <section id="gallery" className="overflow-hidden bg-muted/30 px-0 py-24">
      <div className="mx-auto mb-12 flex max-w-6xl flex-col gap-5 px-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-md font-serif italic text-muted-foreground">Creative Gallery</h2>
        </div>

        <Link
          href="/gallery"
          className="group inline-flex items-center justify-end gap-3 self-start rounded-full border border-black/10 bg-white/70 px-5 py-2.5 text-sm text-[#4d535e] transition-[color,border-color,background-color,transform] hover:border-black/20 hover:bg-white hover:text-[#17181c] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:self-auto"
          aria-label="View all gallery works"
        >
          <span className="tracking-[0.04em]">View All</span>
          <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="space-y-5">
        <div className="overflow-hidden">
          <div className="gallery-marquee-track gallery-marquee-left">
            {[...rowOne, ...rowOne].map((image, index) => {
              const imageIndex = previewImages.findIndex((item) => item.id === image.id)
              return (
                <button
                  key={`row-1-${image.id}-${index}`}
                  onClick={() => openLightbox(imageIndex)}
                  className="group relative aspect-[3/2] w-[45vw] shrink-0 overflow-hidden rounded-md bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:w-[34vw] md:w-[26vw] lg:w-[22vw]"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    loading={index < 2 ? "eager" : "lazy"}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/15 transition-colors duration-300 group-hover:bg-black/5" />
                </button>
              )
            })}
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="gallery-marquee-track gallery-marquee-right">
            {[...rowTwo, ...rowTwo].map((image, index) => {
              const imageIndex = previewImages.findIndex((item) => item.id === image.id)
              return (
                <button
                  key={`row-2-${image.id}-${index}`}
                  onClick={() => openLightbox(imageIndex)}
                  className="group relative aspect-[3/2] w-[45vw] shrink-0 overflow-hidden rounded-md bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:w-[34vw] md:w-[26vw] lg:w-[22vw]"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    loading={index < 2 ? "eager" : "lazy"}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/15 transition-colors duration-300 group-hover:bg-black/5" />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm animate-in fade-in-0 duration-300">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 animate-in slide-in-from-top-2 duration-300 delay-150"
            onClick={closeLightbox}
            aria-label="Close gallery preview"
          >
            <X className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-4 -translate-y-1/2 animate-in slide-in-from-left-4 duration-300 delay-300"
            onClick={goToPrevious}
            aria-label="Previous gallery image"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <div className="relative mx-16 aspect-video w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-500 delay-100">
            <div
              className={`relative h-full w-full transition-transform duration-300 ease-in-out ${
                previousIndex !== null && selectedIndex !== null
                  ? previousIndex < selectedIndex
                    ? "animate-in slide-in-from-right-4"
                    : "animate-in slide-in-from-left-4"
                  : ""
              }`}
              key={selectedIndex}
            >
              <Image
                src={previewImages[selectedIndex].src}
                alt={previewImages[selectedIndex].alt}
                fill
                className="object-contain"
              />
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-4 -translate-y-1/2 animate-in slide-in-from-right-4 duration-300 delay-300"
            onClick={goToNext}
            aria-label="Next gallery image"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-in slide-in-from-bottom-2 duration-300 delay-500 text-sm text-muted-foreground">
            {selectedIndex + 1} / {previewImages.length}
          </div>
        </div>
      )}
    </section>
  )
}
