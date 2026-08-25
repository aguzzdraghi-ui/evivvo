"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Users } from "lucide-react"
import { useFeaturedProfessionals } from "@/src/hooks/use-featured-professionals"

/**
 * Second entry path on the home hero, equal weight to EvaEntryCard.
 * Avatars and the availability line are the real destacado data — never
 * hardcoded counts, and "Explorá profesionales" replaces the count line
 * whenever there is nothing real to report yet.
 */
export function ChooseProfessionalCard() {
  const state = useFeaturedProfessionals(3)
  const professionals = state.status === "ready" ? state.professionals : []
  const availableCount = professionals.filter((p) => p.disponible_ahora).length

  return (
    <Link
      href="/profesionales"
      className="flex flex-col gap-4 rounded-[20px] border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
          <Users className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Elegir un profesional</h3>
          <p className="text-sm text-muted-foreground">Explorá perfiles, deslizá y reservá una sesión.</p>
        </div>
      </div>

      {professionals.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-3">
            {professionals.map((p) => (
              <div key={p.id} className="h-10 w-10 overflow-hidden rounded-full border-2 border-card bg-muted">
                {p.foto_url ? (
                  <Image src={p.foto_url} alt="" width={40} height={40} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20 text-xs font-semibold text-primary">
                    {p.nombre?.[0]}
                  </div>
                )}
              </div>
            ))}
          </div>
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            {availableCount > 0 && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
            {availableCount > 0
              ? availableCount === 1
                ? "1 profesional disponible ahora"
                : `${availableCount} profesionales disponibles ahora`
              : "Explorá profesionales"}
          </span>
        </div>
      )}

      <span className="mt-auto flex items-center gap-1.5 text-sm font-medium text-primary">
        Ver profesionales
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  )
}
