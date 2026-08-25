"use client"

import Link from "next/link"
import { Navbar, Footer } from "@/src/components/landing"
import { Button } from "@/components/ui/button"
import { PlusPromoCard } from "@/src/components/plus"
import { useAuth } from "@/src/lib/auth-context"
import { 
  Calendar, History, User, Settings, 
  ArrowRight, Clock, Video, MessageCircle, Heart,
  Star, ChevronRight, Pill
} from "lucide-react"

const menuItems = [
  {
    icon: Calendar,
    label: "Mis sesiones",
    description: "Próximas y pasadas",
    href: "/mi-cuenta/sesiones",
  },
  {
    icon: History,
    label: "Historial emocional",
    description: "Tu evolución y patrones",
    href: "/mi-cuenta/historial",
  },
  {
    icon: Pill,
    label: "Mis recetas",
    description: "Medicación activa e historial",
    href: "/mi-cuenta/recetas",
  },
  {
    icon: Star,
    label: "Recomendaciones",
    description: "Profesionales sugeridos",
    href: "/mi-cuenta/recomendaciones",
  },
  {
    icon: User,
    label: "Mi perfil",
    description: "Datos personales",
    href: "/mi-cuenta/perfil",
  },
  {
    icon: Settings,
    label: "Configuración",
    description: "Notificaciones y privacidad",
    href: "/mi-cuenta/configuracion",
  },
]

export default function MiCuentaPage() {
  // Usar auth context en lugar de store para evitar loops
  const { user, isLoading } = useAuth()
  
  // Nombre del usuario o generico
  const userName = user?.name || "Usuario"
  
  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }
  
  // Si no hay usuario, mostrar mensaje para iniciar sesion
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <User className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Inicia sesion para ver tu cuenta</h1>
            <p className="text-muted-foreground mb-6">
              Accede a tus sesiones, historial emocional y configuracion.
            </p>
            <Link href="/login">
              <Button className="rounded-xl">Iniciar sesion</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              Hola {userName}
            </h1>
            <p className="mt-2 text-muted-foreground">
              Aqui esta tu resumen de bienestar emocional.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Next Session Card */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">Proxima sesion</h2>
                  <Link href="/mi-cuenta/sesiones" className="text-sm text-primary hover:underline">
                    Ver todas
                  </Link>
                </div>
                
                <div className="text-center py-6">
                  <Video className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">No tenes sesiones programadas</p>
                  <Link href="/profesionales">
                    <Button variant="outline" className="mt-3">
                      Agendar sesion
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <div className="text-3xl font-bold text-primary">0</div>
                  <p className="text-sm text-muted-foreground">Sesiones totales</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <div className="text-3xl font-bold text-emerald-500">0</div>
                  <p className="text-sm text-muted-foreground">Proximas</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <div className="text-3xl font-bold text-amber-500">0</div>
                  <p className="text-sm text-muted-foreground">Chats con EVA</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                {menuItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${
                      index !== menuItems.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    {item.badge && (
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Plus Card */}
              <PlusPromoCard variant="card" />

              {/* Quick Actions */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-semibold text-foreground mb-4">Acciones rápidas</h3>
                <div className="space-y-3">
                  <Link href="/profesionales" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2 rounded-xl">
                      <Calendar className="h-4 w-4" />
                      Agendar nueva sesión
                    </Button>
                  </Link>
                  <Link href="/profesionales?disponible=true" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2 rounded-xl">
                      <Video className="h-4 w-4" />
                      Hablar ahora
                    </Button>
                  </Link>
                  <Link href="/" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2 rounded-xl">
                      <MessageCircle className="h-4 w-4" />
                      Hablar con EVA
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Wellness Tip */}
              <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-purple-500/5 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Tip de bienestar</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Recordá que el progreso no es lineal. Cada pequeño paso cuenta 
                  en tu camino hacia el bienestar emocional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
