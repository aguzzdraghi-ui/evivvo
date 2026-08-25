import { createClient } from "@/src/lib/supabase/client"
import type { FeaturedProfessional, PublicProfessionalDetail, PublicProfessionalListItem } from "./public-types"

/**
 * Professionals an admin has marked as "destacado", filtered server-side
 * (public.get_featured_professionals RPC) to only eligible, public-safe rows.
 */
export async function getFeaturedProfessionals(limit = 6): Promise<FeaturedProfessional[]> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc("get_featured_professionals", { p_limit: limit })

  if (error) {
    console.error("[evivvo] Error fetching featured professionals:", error.message)
    return []
  }

  return (data ?? []) as FeaturedProfessional[]
}

export interface PublicProfessionalsFilters {
  tipo?: string | null
  specialty?: string | null
  disponibleAhora?: boolean | null
  limit?: number
}

/**
 * General professionals explorer listing (public.get_public_professionals RPC),
 * eligible + public-safe rows only, destacados first.
 */
export async function getPublicProfessionals(
  filters: PublicProfessionalsFilters = {}
): Promise<PublicProfessionalListItem[]> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc("get_public_professionals", {
    p_tipo: filters.tipo ?? null,
    p_specialty: filters.specialty ?? null,
    p_disponible_ahora: filters.disponibleAhora ?? null,
    p_limit: filters.limit ?? 60,
  })

  if (error) {
    console.error("[evivvo] Error fetching professionals:", error.message)
    throw error
  }

  return (data ?? []) as PublicProfessionalListItem[]
}

/**
 * Single professional by id (public.get_public_professional_by_id RPC) —
 * used by the profile page and the booking flow. Returns null when the
 * professional does not exist or is not currently eligible/public.
 */
export async function getPublicProfessionalById(id: string): Promise<PublicProfessionalDetail | null> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc("get_public_professional_by_id", { p_id: id })

  if (error) {
    console.error("[evivvo] Error fetching professional by id:", error.message)
    return null
  }

  const row = Array.isArray(data) ? data[0] : data
  return (row as PublicProfessionalDetail) ?? null
}
