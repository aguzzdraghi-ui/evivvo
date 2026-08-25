"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProfessionalCard } from "@/src/components/professionals/professional-card"
import { professionals } from "@/src/data/professionals"

export function FeaturedProfessionals() {
  // Get first 4 professionals for featured section
  const featuredProfessionals = professionals.slice(0, 4)

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 bottom-1/4 h-80 w-80 rounded-full bg-purple-400/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Profesionales recomendados para ti
            </div>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Conecta con los mejores
            </h2>
          </div>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/profesionales">
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Professionals Grid - Horizontal scroll on mobile, grid on desktop */}
        <div className="relative">
          {/* Gradient fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-background to-transparent md:hidden" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-background to-transparent md:hidden" />

          {/* Scrollable container */}
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-none md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-4">
            {featuredProfessionals.map((professional, index) => (
              <div 
                key={professional.id} 
                className="w-72 shrink-0 md:w-auto"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProfessionalCard professional={professional} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Match CTA */}
        <div className="mt-12 text-center">
          <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 p-8">
            <h3 className="mb-2 text-xl font-bold text-foreground">
              ¿No sabés cuál elegir?
            </h3>
            <p className="mb-4 text-muted-foreground">
              Dejá que nuestra IA analice tu situación y te recomiende el profesional ideal.
            </p>
            <Button asChild className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:shadow-lg hover:shadow-primary/25">
              <Link href="/#emotional-input">
                <Sparkles className="h-4 w-4" />
                Encontrar mi match
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
