"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Brain, Calendar, Heart, LineChart, TrendingUp, Clock, 
  Video, Star, Sparkles, ChevronRight, Bell, Settings,
  MessageCircle, FileText, ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar, Footer } from "@/src/components/landing"

// Mock emotional data
const emotionalHistory = [
  { date: "Hoy", mood: "Tranquilo", score: 85, color: "emerald" },
  { date: "Ayer", mood: "Ansioso", score: 60, color: "amber" },
  { date: "Hace 2 días", mood: "Esperanzado", score: 75, color: "primary" },
  { date: "Hace 3 días", mood: "Cansado", score: 55, color: "orange" },
  { date: "Hace 4 días", mood: "Motivado", score: 80, color: "emerald" },
]

const sessions = [
  {
    id: 1,
    professional: "Dra. María González",
    image: "/images/hero-woman.jpg",
    date: "Hoy, 18:00",
    type: "Videollamada",
    status: "upcoming",
  },
  {
    id: 2,
    professional: "Lic. Ana Martínez",
    image: "/images/hero-woman.jpg",
    date: "Ayer, 17:00",
    type: "Videollamada",
    duration: "45 min",
    status: "completed",
    notes: "Trabajamos técnicas de respiración y mindfulness.",
  },
  {
    id: 3,
    professional: "Lic. Ana Martínez",
    image: "/images/hero-woman.jpg",
    date: "Hace 1 semana",
    type: "Videollamada",
    duration: "40 min",
    status: "completed",
    notes: "Primera sesión. Evaluación inicial y objetivos.",
  },
]

const patterns = [
  { label: "Ansiedad matutina", frequency: "3 veces/semana", trend: "down" },
  { label: "Mejor descanso", frequency: "5 noches/semana", trend: "up" },
  { label: "Gestión del estrés", frequency: "Mejorando", trend: "up" },
]

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/20 to-background" />
          <div className="absolute left-0 top-1/3 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute right-0 bottom-1/3 h-80 w-80 rounded-full bg-purple-400/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mi espacio</h1>
              <p className="text-muted-foreground">Tu bienestar emocional en un solo lugar</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button asChild className="gap-2">
                <Link href="/profesionales">
                  <Video className="h-4 w-4" />
                  Nueva sesión
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <div className="card-premium rounded-2xl p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">Tranquilo</p>
              <p className="text-sm text-muted-foreground">Estado actual</p>
            </div>
            <div className="card-premium rounded-2xl p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-foreground">+18%</p>
              <p className="text-sm text-muted-foreground">Progreso semanal</p>
            </div>
            <div className="card-premium rounded-2xl p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                <Calendar className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-sm text-muted-foreground">Sesiones totales</p>
            </div>
            <div className="card-premium rounded-2xl p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10">
                <Heart className="h-5 w-5 text-pink-500" />
              </div>
              <p className="text-2xl font-bold text-foreground">92%</p>
              <p className="text-sm text-muted-foreground">Match con terapeuta</p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Emotional Evolution */}
              <div className="card-premium rounded-2xl p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Tu evolución emocional</h2>
                  </div>
                  <span className="text-sm text-muted-foreground">Últimos 30 días</span>
                </div>
                
                {/* Chart */}
                <div className="mb-6 flex h-48 items-end gap-1">
                  {[40, 35, 50, 45, 60, 55, 70, 65, 75, 80, 70, 85, 80, 90, 85, 88, 82, 90, 85, 92].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-lg bg-gradient-to-t from-primary/80 to-primary/40 transition-all hover:from-primary hover:to-primary/60"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>

                {/* Recent Moods */}
                <div className="space-y-3">
                  {emotionalHistory.slice(0, 3).map((entry, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full bg-${entry.color}-500`} />
                        <span className="font-medium text-foreground">{entry.mood}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500" 
                            style={{ width: `${entry.score}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{entry.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-500">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Resumen IA de Evivvo</h3>
                    <p className="text-sm text-muted-foreground">Basado en tus últimas sesiones</p>
                  </div>
                </div>
                <p className="mb-4 text-muted-foreground">
                  Has mostrado un progreso notable en el manejo de la ansiedad. Las técnicas de 
                  respiración están funcionando bien. Te recomendamos continuar con sesiones 
                  semanales y practicar mindfulness por las mañanas.
                </p>
                <div className="flex flex-wrap gap-2">
                  {patterns.map((pattern, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-full bg-background/80 px-3 py-1.5 text-sm">
                      <TrendingUp className={`h-4 w-4 ${pattern.trend === "up" ? "text-emerald-500" : "text-amber-500 rotate-180"}`} />
                      <span className="text-foreground">{pattern.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Session History */}
              <div className="card-premium rounded-2xl p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Historial de sesiones</h2>
                  <Button variant="ghost" size="sm" className="gap-1">
                    Ver todas
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="rounded-xl border border-border p-4 transition-all hover:border-primary/30 hover:shadow-md">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
                          <Image
                            src={session.image}
                            alt={session.professional}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-foreground">{session.professional}</p>
                              <p className="text-sm text-muted-foreground">{session.date}</p>
                            </div>
                            {session.status === "upcoming" ? (
                              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                Próxima
                              </span>
                            ) : (
                              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
                                Completada
                              </span>
                            )}
                          </div>
                          {session.notes && (
                            <p className="mt-2 text-sm text-muted-foreground">{session.notes}</p>
                          )}
                          {session.status === "upcoming" && (
                            <Button size="sm" className="mt-3 gap-1">
                              <Video className="h-4 w-4" />
                              Unirse
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* My Therapist */}
              <div className="card-premium rounded-2xl p-6">
                <h3 className="mb-4 font-semibold text-foreground">Mi terapeuta</h3>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full bg-muted">
                    <Image
                      src="/images/hero-woman.jpg"
                      alt="Terapeuta"
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Lic. Ana Martínez</p>
                    <p className="text-sm text-muted-foreground">Psicóloga clínica</p>
                    <div className="mt-1 flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">4.9</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <MessageCircle className="h-4 w-4" />
                    Mensaje
                  </Button>
                  <Button size="sm" className="flex-1 gap-1">
                    <Calendar className="h-4 w-4" />
                    Agendar
                  </Button>
                </div>
              </div>

              {/* Next Session */}
              <div className="rounded-2xl bg-gradient-to-br from-primary to-purple-600 p-6 text-white">
                <div className="mb-2 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm font-medium opacity-90">Próxima sesión</span>
                </div>
                <p className="text-2xl font-bold">Hoy, 18:00</p>
                <p className="mb-4 opacity-80">con Dra. María González</p>
                <Button className="w-full bg-white text-primary hover:bg-white/90">
                  <Video className="mr-2 h-4 w-4" />
                  Unirse ahora
                </Button>
              </div>

              {/* Resources */}
              <div className="card-premium rounded-2xl p-6">
                <h3 className="mb-4 font-semibold text-foreground">Recursos para ti</h3>
                <div className="space-y-3">
                  <Link href="#" className="flex items-center justify-between rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Ejercicios de respiración</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link href="#" className="flex items-center justify-between rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-purple-500" />
                      <span className="text-sm font-medium">Diario emocional</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link href="#" className="flex items-center justify-between rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-pink-500" />
                      <span className="text-sm font-medium">Meditación guiada</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
