"use client"

import Link from "next/link"
import { Navbar, Footer } from "@/src/components/landing"
import { Button } from "@/components/ui/button"
import { useEvivvoStore } from "@/src/lib/store"
import { 
  Crown, Check, Zap, Brain, Star, ArrowRight, 
  Video, History, Sparkles, HeartHandshake, MessageCircle
} from "lucide-react"

const plusBenefits = [
  {
    icon: Zap,
    title: "Atención Prioritaria",
    description: "Accedé a profesionales disponibles más rápido, sin esperas largas.",
  },
  {
    icon: Brain,
    title: "Match Emocional IA",
    description: "EVA analiza tu situación y te conecta con el profesional ideal para vos.",
  },
  {
    icon: History,
    title: "Historial Inteligente",
    description: "Visualizá tu evolución emocional con gráficos y patrones detectados por IA.",
  },
  {
    icon: HeartHandshake,
    title: "Seguimiento Personalizado",
    description: "Recibí recomendaciones personalizadas basadas en tu progreso.",
  },
  {
    icon: Video,
    title: "Sesiones Premium",
    description: "Acceso a profesionales certificados con alta calificación.",
  },
  {
    icon: MessageCircle,
    title: "Soporte Dedicado",
    description: "Atención al cliente prioritaria para cualquier consulta.",
  },
]

export default function PlanesPage() {
  // Leer planes del store centralizado
  const storePlans = useEvivvoStore(state => state.getActivePlans())

  // Transformar a formato de UI
  const plans = storePlans.map(plan => ({
    name: plan.nombre,
    price: plan.precio,
    priceOriginal: plan.precioOriginal,
    description: plan.id === 'plan-gratuito' 
      ? 'Empezá tu camino hacia el bienestar' 
      : plan.id === 'plan-plus'
      ? 'La experiencia completa de bienestar emocional'
      : 'Todo lo que necesitás para tu bienestar',
    popular: plan.destacado,
    badge: plan.descuento ? `${plan.descuento}% OFF` : plan.badge,
    features: plan.beneficios.map(b => ({ text: b, included: true })),
    cta: plan.cta,
    ctaLink: plan.precio === 0 ? '/profesionales' : `/checkout/${plan.id.replace('plan-', '')}`,
  }))

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-purple-500/5" />
            <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-purple-400/10 blur-3xl" />
          </div>

          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 px-4 py-2">
                <Crown className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Evivvo Plus</span>
              </div>
              
              <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Tu bienestar merece{" "}
                <span className="text-gradient">una experiencia completa</span>
              </h1>
              
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                Suscribite a Evivvo Plus y desbloqueá todo el potencial de nuestra plataforma. 
                Atención prioritaria, match emocional con IA y mucho más.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative overflow-hidden rounded-3xl ${
                    plan.popular
                      ? "border-2 border-primary shadow-xl shadow-primary/10"
                      : "border border-border"
                  } bg-card p-8`}
                >
                  {plan.badge && (
                    <div className="absolute -top-1 right-6 rounded-b-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                      {plan.badge}
                    </div>
                  )}
                  
                  {plan.popular && (
                    <div className="mb-4 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      <Star className="h-3 w-3" />
                      Más popular
                    </div>
                  )}

                  <h2 className="text-2xl font-bold text-foreground">{plan.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>

                  <div className="mt-6 flex items-baseline gap-2">
                    {plan.priceOriginal && (
                      <span className="text-lg text-muted-foreground line-through">
                        ${plan.priceOriginal.toLocaleString("es-AR")}
                      </span>
                    )}
                    <span className="text-4xl font-bold text-foreground">
                      ${plan.price.toLocaleString("es-AR")}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/mes</span>
                    )}
                  </div>

                  <ul className="mt-8 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature.text} className="flex items-start gap-3">
                        <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          feature.included 
                            ? "bg-primary/10 text-primary" 
                            : "bg-muted text-muted-foreground"
                        }`}>
                          <Check className="h-3 w-3" />
                        </div>
                        <span className={feature.included ? "text-foreground" : "text-muted-foreground"}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link href={plan.ctaLink} className="mt-8 block">
                    <Button
                      className={`w-full gap-2 rounded-xl py-6 text-base ${
                        plan.popular
                          ? "bg-gradient-to-r from-primary to-purple-600 shadow-lg shadow-primary/25"
                          : ""
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                    >
                      {plan.popular && <Crown className="h-5 w-5" />}
                      {plan.cta}
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">
                Todo lo que incluye Evivvo Plus
              </h2>
              <p className="text-lg text-muted-foreground">
                Diseñado para brindarte la mejor experiencia de bienestar emocional
              </p>
            </div>

            <div className="mx-auto max-w-5xl grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plusBenefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="rounded-2xl bg-card border border-border p-6 transition-all hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ / Trust */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl mb-6">
                Preguntas frecuentes
              </h2>
              
              <div className="space-y-4 text-left">
                <div className="rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-2">¿Puedo cancelar en cualquier momento?</h3>
                  <p className="text-sm text-muted-foreground">
                    Sí, podés cancelar tu suscripción cuando quieras desde tu cuenta. 
                    No hay contratos ni compromisos a largo plazo.
                  </p>
                </div>
                <div className="rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-2">¿Cómo funciona el match emocional con IA?</h3>
                  <p className="text-sm text-muted-foreground">
                    EVA, nuestra asistente de IA, analiza tu situación emocional y te conecta 
                    con profesionales que mejor se adaptan a tus necesidades específicas.
                  </p>
                </div>
                <div className="rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-2">¿El descuento del 35% es permanente?</h3>
                  <p className="text-sm text-muted-foreground">
                    El 35% de descuento aplica para tu primer mes. Después continuás con el precio regular, 
                    que aún así es una fracción del costo de una sesión tradicional.
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <Link href="/profesionales">
                  <Button size="lg" className="gap-2 rounded-xl bg-gradient-to-r from-primary to-purple-600">
                    <Sparkles className="h-5 w-5" />
                    Empezar ahora
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
