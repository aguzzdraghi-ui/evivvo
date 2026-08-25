"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Sparkles, Calendar, MessageSquare, User } from "lucide-react"

const NAV_ITEMS = [
  { href: "/plus", label: "Inicio", icon: Home },
  { href: "/plus#eva-quick", label: "EVA", icon: Sparkles },
  { href: "/mi-cuenta/sesiones", label: "Sesiones", icon: Calendar },
  { href: "/plus/mensajes", label: "Mensajes", icon: MessageSquare },
  { href: "/mi-cuenta", label: "Perfil", icon: User },
]

/** Bottom nav used only inside the Plus dashboard — scoped separately from the
 *  site-wide BottomNavigation so free-account navigation is unaffected. */
export function PlusMobileNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur lg:hidden">
      <div className="flex items-center justify-around px-2 pb-safe pt-2">
        {NAV_ITEMS.map((item) => {
          const target = item.href.split("#")[0]
          const isActive = pathname === target
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-w-[56px] flex-col items-center gap-1 rounded-xl px-2 py-1.5 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
