"use client"

import Link from "next/link"
import { Crown, Sparkles, Zap, Clock, Brain, Shield, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PlusPromoCardProps {
  variant?: "floating" | "banner" | "card" | "inline" | "sticky"
  className?: string
}

export function PlusPromoCard({ variant = "card", className = "" }: PlusPromoCardProps) {
  const benefits = [
    { icon: Zap, text: "Atención prioritaria" },
    { icon: Clock, text: "Profesionales más rápido" },
    { icon: Brain, text: "Match emocional IA" },
    { icon: Shield, text: "Historial inteligente" },
  ]

  if (variant === "floating") {
    return (
      <div className={`group relative overflow-hidden rounded-2xl ${className}`}>
        {/* Glow effect */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-30 blur-lg group-hover:opacity-50 transition-opacity" />
        
        <div className="relative glass rounded-2xl p-4 border border-white/20 animate-float">
          {/* Badge */}
          <div className="absolute -top-1 -right-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg">
            35% OFF
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Evivvo Plus</p>
              <p className="text-xs text-muted-foreground">Desbloqueá todo</p>
            </div>
          </div>
          
          <Link href="/planes" className="mt-3 block">
            <Button size="sm" className="w-full gap-1 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-xs">
              Suscribirme
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (variant === "banner") {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border border-primary/20 p-4 ${className}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Los usuarios <span className="font-semibold text-primary">Plus</span> reciben prioridad y acceso más rápido
              </p>
            </div>
          </div>
          <Link href="/planes">
            <Button size="sm" variant="outline" className="gap-1 rounded-xl border-primary/30 text-primary hover:bg-primary hover:text-white">
              Activar Plus
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (variant === "inline") {
    return (
      <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 border border-primary/10 p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Evivvo Plus puede ayudarte a tener:
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary" />
                Atención prioritaria
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary" />
                Profesionales disponibles más rápido
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary" />
                Seguimiento emocional inteligente
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary" />
                Historial emocional avanzado
              </li>
            </ul>
            <Link href="/planes" className="inline-block mt-3">
              <Button size="sm" className="gap-1 rounded-lg bg-gradient-to-r from-primary to-purple-600 text-xs">
                Desbloquear Plus — 35% OFF
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (variant === "sticky") {
    return (
      <div className={`fixed bottom-20 left-4 right-4 z-40 md:hidden ${className}`}>
        <div className="relative overflow-hidden rounded-2xl glass border border-primary/20 p-3 shadow-xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600">
                <Crown className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-foreground">Desbloqueá Evivvo Plus</span>
            </div>
            <Link href="/planes">
              <Button size="sm" className="rounded-xl bg-gradient-to-r from-primary to-purple-600 text-xs px-4">
                Suscribirme
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Default: card variant
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* Background glow */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-20 blur-xl" />
      
      <div className="relative glass rounded-2xl p-6 border border-primary/20">
        {/* Badge */}
        <div className="absolute -top-2 right-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
          35% OFF primer mes
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/25">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Evivvo Plus</h3>
            <p className="text-sm text-muted-foreground">Tu bienestar merece más</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Suscribite ahora y desbloqueá todo el potencial de Evivvo
        </p>

        <ul className="space-y-2 mb-6">
          {benefits.map((benefit) => (
            <li key={benefit.text} className="flex items-center gap-2 text-sm text-foreground">
              <benefit.icon className="h-4 w-4 text-primary" />
              {benefit.text}
            </li>
          ))}
        </ul>

        <Link href="/planes" className="block">
          <Button className="w-full gap-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30">
            <Star className="h-4 w-4" />
            Suscribirme ahora
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>

        <p className="text-center text-xs text-muted-foreground mt-3">
          Cancelá cuando quieras
        </p>
      </div>
    </div>
  )
}
