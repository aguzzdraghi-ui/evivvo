"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { Crown, Lock, Sparkles, TrendingUp, BarChart3, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/src/lib/auth-context"

interface PlusGateProps {
  children: ReactNode
  feature?: string
  showPreview?: boolean
}

// Componente que bloquea contenido para usuarios sin Plus
export function PlusGate({ children, feature, showPreview = true }: PlusGateProps) {
  const { user } = useAuth()
  const isPlus = user?.isPlus === true

  if (isPlus) {
    return <>{children}</>
  }

  if (!showPreview) {
    return null
  }

  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-background/60 z-10" />
      
      {/* Locked content preview */}
      <div className="opacity-30 pointer-events-none">
        {children}
      </div>
      
      {/* Unlock CTA */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-amber-500/20 border border-primary/30">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          
          <h3 className="text-xl font-bold text-foreground mb-2">
            Desbloqueá tu evolución emocional con Evivvo Plus
          </h3>
          
          <p className="text-muted-foreground mb-4">
            Accedé a tu seguimiento emocional avanzado, historial inteligente, 
            progreso por sesión y recomendaciones personalizadas.
          </p>
          
          {feature && (
            <p className="text-sm text-muted-foreground mb-4">
              <span className="font-medium text-primary">{feature}</span> es una función exclusiva de Evivvo Plus.
            </p>
          )}
          
          <div className="flex flex-col gap-2 items-center">
            <Link href="/checkout/plus">
              <Button className="gap-2 bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90">
                <Crown className="h-4 w-4" />
                Activar Evivvo Plus
              </Button>
            </Link>
            <Badge variant="outline" className="border-amber-500/50 text-amber-600">
              35% OFF el primer mes
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  )
}

// Versión más compacta para secciones pequeñas
export function PlusGateCompact({ children, feature }: { children: ReactNode; feature?: string }) {
  const { user } = useAuth()
  const isPlus = user?.isPlus === true

  if (isPlus) {
    return <>{children}</>
  }

  return (
    <div className="relative rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-background p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Crown className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground text-sm">
            {feature || "Función exclusiva Plus"}
          </p>
          <p className="text-xs text-muted-foreground">
            Activá Evivvo Plus para acceder
          </p>
        </div>
        <Link href="/checkout/plus">
          <Button size="sm" variant="outline" className="gap-1.5 border-primary/30 hover:bg-primary/10">
            <Sparkles className="h-3.5 w-3.5" />
            Activar
          </Button>
        </Link>
      </div>
    </div>
  )
}

// Lista de beneficios Plus
export function PlusBenefitsList() {
  const benefits = [
    { icon: TrendingUp, text: "Evolución emocional detallada" },
    { icon: BarChart3, text: "Gráfico de bienestar por sesión" },
    { icon: Brain, text: "Seguimiento inteligente EVA" },
    { icon: Sparkles, text: "Recomendaciones avanzadas" },
  ]

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {benefits.map(({ icon: Icon, text }) => (
        <div key={text} className="flex items-center gap-2 text-sm">
          <Icon className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">{text}</span>
        </div>
      ))}
    </div>
  )
}
