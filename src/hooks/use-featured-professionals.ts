"use client"

import { useEffect, useState } from "react"
import { getFeaturedProfessionals } from "@/src/lib/professionals/public-queries"
import type { FeaturedProfessional } from "@/src/lib/professionals/public-types"

export type FeaturedProfessionalsState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "empty" }
  | { status: "ready"; professionals: FeaturedProfessional[] }

/**
 * Single source of truth for "profesionales destacados", shared by desktop
 * home, mobile home and anywhere else that needs the exact same list — so
 * desktop and mobile can never drift from each other.
 */
export function useFeaturedProfessionals(limit = 6): FeaturedProfessionalsState {
  const [state, setState] = useState<FeaturedProfessionalsState>({ status: "loading" })

  useEffect(() => {
    let cancelled = false

    async function load() {
      setState({ status: "loading" })
      try {
        const professionals = await getFeaturedProfessionals(limit)
        if (cancelled) return
        setState(professionals.length > 0 ? { status: "ready", professionals } : { status: "empty" })
      } catch {
        if (!cancelled) setState({ status: "error" })
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [limit])

  return state
}
