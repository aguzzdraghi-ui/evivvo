import { redirect } from "next/navigation"
import { getPlusEntitlement } from "@/src/lib/plus/entitlement"
import { PlusHeader } from "@/src/components/plus-dashboard/plus-header"
import { PlusMobileNavigation } from "@/src/components/plus-dashboard/plus-mobile-navigation"

/**
 * Server-verified gate for the whole /plus area. Reads profiles.is_plus /
 * plan_active from Supabase using the request's own session — never a
 * client-supplied flag — so a free or expired account cannot reach the dark
 * dashboard by navigating here directly, and the light theme never leaks
 * into this subtree in the first place (no Plus CSS class is ever mounted
 * for them).
 */
export default async function PlusLayout({ children }: { children: React.ReactNode }) {
  const entitlement = await getPlusEntitlement()

  if (!entitlement.authenticated) {
    redirect("/login?next=/plus")
  }

  if (!entitlement.isPlus) {
    redirect("/planes?upgrade=plus")
  }

  return (
    <div className="plus-theme min-h-screen">
      <PlusHeader userId={entitlement.userId!} />
      <div className="pb-24 lg:pb-0">{children}</div>
      <PlusMobileNavigation />
    </div>
  )
}
