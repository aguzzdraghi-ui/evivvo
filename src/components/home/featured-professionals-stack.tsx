"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFeaturedProfessionals } from "@/src/hooks/use-featured-professionals"
import { FeaturedMiniCard } from "./featured-mini-card"

/**
 * Desktop hero visual: real destacado professionals only (admin "Destacar",
 * estado=activo, visible=true — see public.get_featured_professionals).
 * 1 → centered card. 2 → two staggered cards. 3+ → up to three, offset.
 * No eligible destacados → clean empty state, never mock professionals.
 */
export function FeaturedProfessionalsStack() {
  const state = useFeaturedProfessionals(3)

  if (state.status === "loading") {
    return (
      <div className="hidden lg:flex lg:items-center lg:justify-center">
        <div className="h-72 w-52 animate-pulse rounded-2xl bg-muted" />
      </div>
    )
  }

  if (state.status === "error" || state.status === "empty") {
    return (
      <div className="hidden lg:flex lg:items-center lg:justify-center">
        <div className="w-72 rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center">
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-primary/60" />
          <p className="mb-4 text-sm text-muted-foreground">
            Todavía no hay profesionales destacados para mostrar acá.
          </p>
          <Button asChild variant="outline" size="sm" className="rounded-xl">
            <Link href="/profesionales">Explorar profesionales</Link>
          </Button>
        </div>
      </div>
    )
  }

  const { professionals } = state

  return (
    <div className="relative hidden h-80 w-full items-center justify-center lg:flex">
      {professionals[2] && (
        <FeaturedMiniCard
          professional={professionals[2]}
          className="absolute z-10 -rotate-6 opacity-90"
          style={{ transform: "translate(-120px, 10px) rotate(-6deg)" }}
        />
      )}
      {professionals[1] && (
        <FeaturedMiniCard
          professional={professionals[1]}
          className="absolute z-20 rotate-3 opacity-95"
          style={{ transform: "translate(110px, -6px) rotate(6deg)" }}
        />
      )}
      <FeaturedMiniCard professional={professionals[0]} className="relative z-30" />
    </div>
  )
}
