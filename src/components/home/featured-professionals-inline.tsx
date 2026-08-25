"use client"

import Link from "next/link"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { useFeaturedProfessionals } from "@/src/hooks/use-featured-professionals"
import { ProfessionalsCarousel } from "@/src/components/professionals/professionals-carousel"

interface AvailabilityHeadlineProps {
  count: number
}

function AvailabilityHeadline({ count }: AvailabilityHeadlineProps) {
  if (count === 0) return <span>Explorá profesionales</span>
  if (count === 1) return <span>1 profesional disponible ahora</span>
  return <span>{count} profesionales disponibles ahora</span>
}

/**
 * Featured section below the hero — same destacado data source as the
 * desktop stack, rendered as a real, testable carousel on every viewport
 * (used directly on mobile; desktop keeps the FeaturedProfessionalsStack
 * peek visual up top and this section underneath for the full list).
 */
export function FeaturedProfessionalsInline() {
  const state = useFeaturedProfessionals(6)

  if (state.status === "loading") {
    return (
      <section className="container mx-auto px-4 py-10 md:px-6">
        <div className="mb-4 h-6 w-56 animate-pulse rounded bg-muted" />
        <div className="flex gap-4 overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-80 w-[280px] shrink-0 animate-pulse rounded-[20px] bg-muted" />
          ))}
        </div>
      </section>
    )
  }

  if (state.status === "error") {
    return (
      <section className="container mx-auto px-4 py-10 text-center md:px-6">
        <p className="text-sm text-muted-foreground">No pudimos cargar los profesionales destacados. Probá de nuevo en unos minutos.</p>
      </section>
    )
  }

  const availableCount = state.status === "ready" ? state.professionals.filter((p) => p.disponible_ahora).length : 0

  return (
    <section className="container mx-auto px-4 py-10 md:px-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            {availableCount > 0 && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            )}
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${availableCount > 0 ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
          </span>
          <h2 className="text-lg font-bold text-foreground md:text-xl">
            <AvailabilityHeadline count={availableCount} />
          </h2>
        </div>
        <Link href="/profesionales" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          Ver todos
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {state.status === "empty" ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <p className="mb-4 text-sm text-muted-foreground">Todavía no hay profesionales destacados. Explorá el listado completo.</p>
          <Link href="/profesionales" className="text-sm font-medium text-primary hover:underline">
            Explorar profesionales
          </Link>
        </div>
      ) : (
        <>
          <ProfessionalsCarousel professionals={state.professionals} className="lg:hidden" showArrows={false} />
          <div className="hidden lg:block">
            <ProfessionalsCarousel professionals={state.professionals} />
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground lg:hidden">
            <ArrowLeft className="h-3.5 w-3.5" />
            Deslizá para ver más profesionales
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </>
      )}
    </section>
  )
}
