"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Calendar, MessageCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/",
    label: "Inicio",
    icon: Home,
  },
  {
    href: "/profesionales",
    label: "Buscar",
    icon: Search,
  },
  {
    href: "/mi-cuenta/sesiones",
    label: "Sesiones",
    icon: Calendar,
  },
  {
    href: "/mi-cuenta/historial",
    label: "Historial",
    icon: MessageCircle,
  },
  {
    href: "/mi-cuenta",
    label: "Perfil",
    icon: User,
  },
]

export function BottomNavigation() {
  const pathname = usePathname()

  // Don't show on dashboard, admin, or auth pages
  const hiddenPaths = ['/dashboard', '/admin', '/login', '/profesionales/registro']
  const shouldHide = hiddenPaths.some(path => pathname.startsWith(path))
  
  if (shouldHide) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Background with blur */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-border/50" />
      
      {/* Safe area padding for iPhone */}
      <div className="relative flex items-center justify-around px-2 pt-2 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-300",
                "min-w-[60px] active:scale-95",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "relative p-1.5 rounded-xl transition-all duration-300",
                isActive && "bg-primary/10"
              )}>
                <item.icon className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive && "scale-110"
                )} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary animate-pulse" />
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-all duration-300",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
