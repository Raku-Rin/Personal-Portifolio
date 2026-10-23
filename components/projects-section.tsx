"use client"

import { useEffect, useRef, useState } from "react"
import { ProjectCard } from "./project-card"
import { projects } from "@/lib/projects"

export function ProjectsSection() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [activeMobileIndex, setActiveMobileIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)")
    const updateIsMobile = () => setIsMobile(mediaQuery.matches)
    updateIsMobile()
    mediaQuery.addEventListener("change", updateIsMobile)
    return () => mediaQuery.removeEventListener("change", updateIsMobile)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute("data-index") || "0", 10)
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, index]))
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isMobile) return

    let ticking = false

    const updateActiveCard = () => {
      const viewportCenter = window.innerHeight / 2
      let nextIndex = activeMobileIndex
      let minDistance = Number.POSITIVE_INFINITY

      itemRefs.current.forEach((ref, index) => {
        if (!ref) return

        const rect = ref.getBoundingClientRect()
        const isVisible = rect.bottom > 0 && rect.top < window.innerHeight
        if (!isVisible) return

        const cardCenter = rect.top + rect.height / 2
        const distance = Math.abs(cardCenter - viewportCenter)

        if (distance < minDistance) {
          minDistance = distance
          nextIndex = index
        }
      })

      if (nextIndex !== activeMobileIndex) {
        setActiveMobileIndex(nextIndex)
      }
    }

    const onScrollOrResize = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        updateActiveCard()
        ticking = false
      })
    }

    updateActiveCard()
    window.addEventListener("scroll", onScrollOrResize, { passive: true })
    window.addEventListener("resize", onScrollOrResize)

    return () => {
      window.removeEventListener("scroll", onScrollOrResize)
      window.removeEventListener("resize", onScrollOrResize)
    }
  }, [isMobile, activeMobileIndex])

  return (
    <section id="projects" className="px-0 py-24">
      <div className="w-full">
        <div className="mb-12 w-full">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
            <h2 className="text-md font-serif italic text-muted-foreground">Featured Projects</h2>
          </div>
        </div>

        <div className="w-full">
          <div className="grid w-full grid-cols-1 gap-0 md:grid-cols-12">
            {projects.map((project, index) => {
              const activeDesktopIndex = hoveredIndex ?? 0
              const span = isMobile
                ? 1
                : hoveredIndex !== null
                  ? hoveredIndex === index
                    ? 10
                    : 1
                  : index === 0
                    ? 10
                    : 1
              const isActive = isMobile
                ? activeMobileIndex === index
                : hoveredIndex === null
                  ? index === 0
                  : hoveredIndex === index
              const indicatorDirection =
                !isMobile && !isActive
                  ? index === activeDesktopIndex - 1
                    ? "left"
                    : index === activeDesktopIndex + 1
                      ? "right"
                      : undefined
                  : undefined

              return (
                <div
                  key={project.slug}
                  ref={(el) => {
                    itemRefs.current[index] = el
                  }}
                  data-index={index}
                  className={`transition-all duration-500 ease-out ${
                    visibleItems.has(index)
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-8 scale-95"
                  }`}
                  style={isMobile ? undefined : { gridColumn: `span ${span}` }}
                  onMouseEnter={() => {
                    if (!isMobile) setHoveredIndex(index)
                  }}
                >
                  <ProjectCard
                    title={project.title}
                    description={project.description}
                    tags={project.tags}
                    imageUrl={project.imageUrl}
                    href={`/projects/${project.slug}`}
                    isActive={isActive}
                    compact={isMobile && !isActive}
                    indicatorDirection={indicatorDirection}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
