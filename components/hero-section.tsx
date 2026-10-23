"use client"

import { useEffect, useState, useRef, type CSSProperties, type PointerEvent } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import Link from "next/link"

const heroWords = [
  "Systematically",
  "Empathetically",
  "Efficiently",
]

export function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(1)
  const [isDeleting, setIsDeleting] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePos = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const currentWord = heroWords[wordIndex]
    let delay = 80

    if (!isDeleting && subIndex === currentWord.length) {
      delay = 1200
      const finishTimer = window.setTimeout(() => setIsDeleting(true), delay)
      return () => window.clearTimeout(finishTimer)
    }

    if (isDeleting && subIndex === 0) {
      const switchTimer = window.setTimeout(() => {
        setIsDeleting(false)
        setWordIndex((prev) => (prev + 1) % heroWords.length)
        setSubIndex(1)
      }, 350)
      return () => window.clearTimeout(switchTimer)
    }

    const typeTimer = window.setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1))
    }, delay)

    return () => window.clearTimeout(typeTimer)
  }, [subIndex, isDeleting, wordIndex])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const parent = canvas.parentElement
    if (!parent) return

    const resizeCanvas = () => {
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const time = performance.now() * 0.00028
      const mouseX = mousePos.current.x
      const mouseY = mousePos.current.y

      // 角落低饱和光晕（缓慢旋转流动）
      const glowCenters = [
        {
          x: canvas.width * 0.14 + Math.cos(time) * 32,
          y: canvas.height * 0.86 + Math.sin(time * 0.85) * 24,
          color: "rgba(172, 158, 190, 0.14)",
          radius: Math.max(canvas.width, canvas.height) * 0.42,
        },
        {
          x: canvas.width * 0.92 + Math.cos(time * 0.72 + 1.2) * 38,
          y: canvas.height * 0.14 + Math.sin(time * 0.92 + 0.7) * 26,
          color: "rgba(88, 122, 128, 0.13)",
          radius: Math.max(canvas.width, canvas.height) * 0.48,
        },
        {
          x: canvas.width * 0.52 + Math.cos(time * 0.55 + 2.4) * 22,
          y: canvas.height * 0.08 + Math.sin(time * 0.65 + 1.6) * 16,
          color: "rgba(124, 112, 142, 0.08)",
          radius: Math.max(canvas.width, canvas.height) * 0.36,
        },
      ]

      glowCenters.forEach((glow) => {
        const gradient = ctx.createRadialGradient(glow.x, glow.y, 8, glow.x, glow.y, glow.radius)
        gradient.addColorStop(0, glow.color)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      // 透视网格层，呼应鼠标排斥方向
      const centerX = canvas.width * 0.5
      const centerY = canvas.height * 0.5
      const gridOffsetY = -canvas.height * 0.38
      const mouseOffsetX = Number.isFinite(mouseX) ? mouseX - centerX : 0
      const mouseOffsetY = Number.isFinite(mouseY) ? mouseY - centerY : 0
      const horizonY = canvas.height * 0.28 + gridOffsetY + Math.sin(time * 1.2) * 8 - mouseOffsetY * 0.012
      const vanishingX = centerX + Math.sin(time * 0.9) * (canvas.width * 0.045) - mouseOffsetX * 0.02

      ctx.lineWidth = 1

      const verticalCount = 18
      for (let i = 0; i <= verticalCount; i++) {
        const ratio = i / verticalCount
        const bottomX = ratio * canvas.width
        const alpha = 0.014 + ratio * 0.085
        ctx.strokeStyle = `rgba(96, 108, 128, ${alpha})`
        ctx.beginPath()
        ctx.moveTo(bottomX, canvas.height + 20 + gridOffsetY)
        ctx.lineTo(vanishingX, horizonY)
        ctx.stroke()
      }

      const horizontalCount = 10
      for (let i = 1; i <= horizontalCount; i++) {
        const t = i / horizontalCount
        const curve = 1 - Math.pow(1 - t, 2)
        const y = horizonY + (canvas.height - horizonY + 20) * curve
        const inset = t * canvas.width * 0.12
        const alpha = 0.012 + t * 0.08
        ctx.strokeStyle = `rgba(96, 108, 128, ${alpha})`
        ctx.beginPath()
        ctx.moveTo(-20 + inset, y)
        ctx.lineTo(canvas.width + 20 - inset, y)
        ctx.stroke()
      }

      // 让汇聚点区域进一步隐去，避免顶部“重心过强”
      ctx.save()
      ctx.globalCompositeOperation = "destination-out"
      const vanishMask = ctx.createRadialGradient(vanishingX, horizonY, 0, vanishingX, horizonY, 170)
      vanishMask.addColorStop(0, "rgba(0, 0, 0, 0.95)")
      vanishMask.addColorStop(0.55, "rgba(0, 0, 0, 0.5)")
      vanishMask.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = vanishMask
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.restore()

      // 细腻的 Dot Grid 背景，鼠标靠近时产生轻微吸引
      const gridGap = 30
      const dotRadius = 0.9
      const influenceRadius = 220
      const maxOffset = 15
      const darkenRadius = 220

      for (let y = gridGap; y < canvas.height - gridOffsetY; y += gridGap) {
        for (let x = gridGap; x < canvas.width; x += gridGap) {
          const baseY = y + gridOffsetY
          let drawX = x
          let drawY = baseY

          const dx = x - mouseX
          const dy = baseY - mouseY
          const distance = Math.hypot(dx, dy)

          if (distance < influenceRadius) {
            const t = 1 - distance / influenceRadius
            const force = maxOffset * t * t
            const ux = distance === 0 ? 0 : dx / distance
            const uy = distance === 0 ? 0 : dy / distance
            drawX -= ux * force
            drawY -= uy * force
          }

          const verticalFade = Math.min(1, Math.max(0, (drawY - horizonY) / (canvas.height - horizonY)))
          const interactionFade = distance < darkenRadius ? Math.pow(1 - distance / darkenRadius, 1.6) : 0
          const dotAlpha = 0.018 + verticalFade * 0.12 + interactionFade * 0.24
          const dotR = Math.round(84 - interactionFade * 44)
          const dotG = Math.round(89 - interactionFade * 44)
          const dotB = Math.round(104 - interactionFade * 34)
          ctx.fillStyle = `rgba(${dotR}, ${dotG}, ${dotB}, ${dotAlpha})`
          ctx.beginPath()
          ctx.arc(drawX, drawY, dotRadius, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    mousePos.current = { x, y }
  }

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 pt-10 overflow-hidden bg-background"
      onPointerMove={handlePointerMove}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
      <div className="max-w-6xl mx-auto w-full relative z-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-relaxed max-w-[28rem] sm:max-w-[34rem] md:max-w-2xl text-balance font-serif mb-6 flex flex-col">
          <span>Designing <span key={wordIndex} className="hero-typed-word hero-typed-cursor">{heroWords[wordIndex].slice(0, subIndex)}</span>,</span>
          <span>Not Just Screens.</span>
        </h1>

        <p className="w-full max-w-none sm:max-w-[26rem] md:max-w-xl text-md text-muted-foreground mb-4 font-serif">
          A multidisciplinary designer who speaks both design and code. Focused on building scalable design systems and logic-heavy interfaces.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button asChild className="px-6">
            <Link href="#portfolio">View Portfolio</Link>
          </Button>
          <Button asChild variant="outline" className="px-6">
            <Link href="#contact">Contact Me</Link>
          </Button>
        </div>

        <div className="mt-20 flex items-center gap-2 text-sm text-gray-400">
          <ArrowDown className="h-4 w-4 animate-bounce mt-1" />
          <span className="font-serif">Scroll Down</span>
        </div>
      </div>
    </section>
  )
}
