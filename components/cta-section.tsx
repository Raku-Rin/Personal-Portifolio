import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section id="contact" className="py-40 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <p className="text-md font-serif text-muted-foreground mb-12 italic text-medium">Contact</p>
          
          <h2 className="text-2xl md:text-3xl font-semibold leading-relaxed mb-6 text-balance font-serif">
            Let's talk projects, or just say hi.
          </h2>

          <p className="text-muted-foreground mb-8 leading-relaxed font-serif">
            From creative collaborations to project consultations, I'm always eager to connect. Let's build something meaningful.
          </p>

          <Button asChild className="group font-serif">
            <Link href="mailto:rakurin522@gmail.com">
              Say Hi
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
