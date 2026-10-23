"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [footerProgress, setFooterProgress] = useState(0)

  useEffect(() => {
    const footer = document.getElementById("site-footer")
    if (!footer) return

    const updateProgress = () => {
      const rect = footer.getBoundingClientRect()
      const revealDistance = window.innerHeight - rect.top
      const fullDistance = Math.max(rect.height * 0.5, 1)
      const progress = Math.min(Math.max(revealDistance / fullDistance, 0), 1)
      setFooterProgress(progress)
    }

    updateProgress()
    window.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("resize", updateProgress)
    return () => {
      window.removeEventListener("scroll", updateProgress)
      window.removeEventListener("resize", updateProgress)
    }
  }, [])

  const mix = (from: number, to: number) => Math.round(from + (to - from) * footerProgress)
  const textColor = `rgb(${mix(24, 255)}, ${mix(24, 255)}, ${mix(28, 255)})`
  const mutedColor = `rgb(${mix(107, 215)}, ${mix(114, 225)}, ${mix(128, 235)})`
  const headerBg = `rgba(${mix(255, 0)}, ${mix(255, 0)}, ${mix(255, 0)}, 0.8)`
  const headerBorder = `rgba(${mix(220, 255)}, ${mix(220, 255)}, ${mix(226, 255)}, ${0.45 - footerProgress * 0.3})`

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-md transition-[background-color,border-color] duration-200"
      style={{ backgroundColor: headerBg, borderColor: headerBorder, color: textColor }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-medium tracking-tight transition-colors" style={{ color: textColor }}>
          <span className="pr-2 font-serif font-semibold italic">RIN 's</span>
          <span className="ml-1 text-xs font-serif italic transition-colors" style={{ color: mutedColor }}>
            PORTFOLIO
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="font-serif text-sm opacity-85 transition-opacity hover:opacity-100"
                style={{ color: mutedColor }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          style={{ color: textColor }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "关闭菜单" : "打开菜单"}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      {isOpen && (
        <div
          className="border-b transition-[background-color,border-color] duration-200 md:hidden"
          style={{
            backgroundColor: `rgba(${mix(255, 0)}, ${mix(255, 0)}, ${mix(255, 0)}, 0.95)`,
            borderColor: headerBorder,
          }}
        >
          <ul className="flex flex-col gap-4 px-6 py-4">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm opacity-85 transition-opacity hover:opacity-100"
                  style={{ color: mutedColor }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
