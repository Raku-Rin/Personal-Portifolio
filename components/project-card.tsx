import Image from "@/components/site-image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ProjectCardProps {
  title: string
  description: string
  tags: string[]
  imageUrl: string
  href?: string
  isActive?: boolean
  compact?: boolean
  indicatorDirection?: "left" | "right"
}

export function ProjectCard({
  title,
  description,
  tags,
  imageUrl,
  href = "#",
  isActive = false,
  compact = false,
  indicatorDirection,
}: ProjectCardProps) {
  return (
    <Link href={href} className="group block h-full" aria-label={`查看 ${title} 项目详情`}>
      <article className={`relative w-full overflow-hidden bg-black shadow-none ${compact ? "h-[95px]" : "h-[285px]"} md:h-[420px] lg:h-[570px]`}>
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            loading="eager"
            className="object-cover transition-transform duration-[4000ms] ease-out group-hover:scale-105"
          />
          <div className={`absolute inset-0 transition-all duration-300 ${isActive ? "bg-black/10" : "bg-black/70"}`} />
        </div>

        <div className={`absolute inset-0 flex flex-col justify-end transition-all duration-300 ${isActive ? "opacity-100" : "opacity-0"}`}>
          <div className={`space-y-3 bg-gradient-to-t p-6 ${isActive ? "from-black/90 via-black/60 to-transparent" : "from-black/90 via-black/90 to-black/90"}`}>
            <h3 className="text-lg leading-tight font-semibold text-white md:text-xl">{title}</h3>
            <p className="line-clamp-2 text-sm leading-relaxed text-white/85">{description}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="border-white/30 bg-white/20 text-xs font-normal text-white transition-colors duration-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {indicatorDirection && (
          <div className="pointer-events-none absolute inset-0 z-20 hidden items-center justify-center md:flex">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-transparent shadow-[0_4px_16px_rgba(255,255,255,0.08)] backdrop-blur-sm transition-colors duration-300 group-hover:bg-white/10">
              {indicatorDirection === "left" ? (
                <ChevronLeft className="h-6 w-6 text-white/80" />
              ) : (
                <ChevronRight className="h-6 w-6 text-white/80" />
              )}
            </div>
          </div>
        )}
      </article>
    </Link>
  )
}
