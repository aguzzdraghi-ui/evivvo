import { cache } from "react"
import { createClient } from "@/src/lib/supabase/server"

export interface PlusEntitlement {
  authenticated: boolean
  isPlus: boolean
  userId: string | null
  nombre: string | null
  fotoUrl: string | null
}

/**
 * Server-verified Plus entitlement. Reads profiles.is_plus/plan_active from
 * Supabase using the request's own auth cookies — never a client-supplied
 * boolean. profiles.is_plus/plan/plan_active are themselves protected by a
 * DB trigger (protect_profile_authorization_fields) that blocks a user from
 * setting these on their own row, so this reflects real, admin/payment-
 * confirmed entitlement, not something the browser can fake.
 */
export const getPlusEntitlement = cache(async (): Promise<PlusEntitlement> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { authenticated: false, isPlus: false, userId: null, nombre: null, fotoUrl: null }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nombre, foto_url, is_plus, plan, plan_active")
    .eq("id", user.id)
    .single()

  const isPlus = !!profile?.is_plus && !!profile?.plan_active && profile?.plan === "plus"

  return {
    authenticated: true,
    isPlus,
    userId: user.id,
    nombre: profile?.nombre ?? null,
    fotoUrl: profile?.foto_url ?? null,
  }
})
