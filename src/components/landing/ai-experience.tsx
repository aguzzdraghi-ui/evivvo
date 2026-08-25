"use client"

import { Brain, TrendingUp, Calendar, Sparkles, Heart, LineChart } from "lucide-react"

export function AIExperience() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/20 to-background" />
        <div className="absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-purple-400/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            Inteligencia Artificial
          </div>
          <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Evivvo entiende{" "}
            <span className="text-gradient">cómo te sientes</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Nuestra IA analiza tu situación emocional y te conecta con el profesional 
            perfecto para ti. Sin búsquedas, sin dudas.
          </p>
        </div>

        {/* AI Dashboard Mock */}
        <div className="mx-auto max-w-5xl">
          <div className="card-premium rounded-3xl p-2">
            <div className="rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 p-6 md:p-8">
              {/* Dashboard Header */}
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bienvenido/a</p>
                  <h3 className="text-xl font-bold text-foreground">Tu bienestar emocional</h3>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-emerald-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">+15% esta semana</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="mb-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-background/80 p-5 backdrop-blur">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">Tranquilo</p>
                  <p className="text-sm text-muted-foreground">Estado actual detectado</p>
                </div>
                <div className="rounded-2xl bg-background/80 p-5 backdrop-blur">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                    <Calendar className="h-5 w-5 text-purple-500" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">8</p>
                  <p className="text-sm text-muted-foreground">Sesiones completadas</p>
                </div>
                <div className="rounded-2xl bg-background/80 p-5 backdrop-blur">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10">
                    <Heart className="h-5 w-5 text-pink-500" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">92%</p>
                  <p className="text-sm text-muted-foreground">Compatibilidad con tu terapeuta</p>
                </div>
              </div>

              {/* Emotional Evolution Chart Mock */}
              <div className="rounded-2xl bg-background/80 p-5 backdrop-blur">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-foreground">Tu evolución emocional</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Últimos 30 días</span>
                </div>
                
                {/* Chart visualization */}
                <div className="flex h-40 items-end gap-1 md:gap-2">
                  {[40, 35, 50, 45, 60, 55, 70, 65, 75, 80, 70, 85, 80, 90].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-lg bg-gradient-to-t from-primary/80 to-primary/40 transition-all hover:from-primary hover:to-primary/60"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                  <span>Hace 30 días</span>
                  <span>Hoy</span>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="mt-6 rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-500">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="mb-1 font-semibold text-foreground">Recomendación de Evivvo IA</p>
                    <p className="text-sm text-muted-foreground">
                      Basado en tu progreso, te sugerimos continuar con sesiones semanales. 
                      Tu siguiente sesión ideal: Martes a las 18:00 con la Dra. Martínez.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
