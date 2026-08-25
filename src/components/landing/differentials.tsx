import Link from "next/link"
import { Check, Calendar, Zap, Video, MessageCircle, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Differentials() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            Elige cómo quieres conectar
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Evivvo te ofrece dos formas de acceder a profesionales de bienestar emocional
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
          {/* Plan Gratis */}
          <div className="flex flex-col rounded-2xl border border-border bg-background p-8">
            <div className="mb-6">
              <div className="mb-4 inline-flex items-center rounded-full bg-muted px-4 py-1.5 text-sm font-medium">
                <Calendar className="mr-2 h-4 w-4" />
                Gratis
              </div>
              <h3 className="text-2xl font-bold text-foreground">Agenda tu sesión</h3>
              <p className="mt-2 text-muted-foreground">
                Explora profesionales y agenda cuando te convenga
              </p>
            </div>

            <ul className="mb-8 flex-1 space-y-4">
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-foreground">Agendar sesiones con profesionales</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-foreground">Explorar perfiles completos</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-foreground">Ver videos de presentación</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-foreground">Filtrar por especialidad</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-foreground">Pagas solo la sesión al profesional</span>
              </li>
            </ul>

            <Button variant="outline" size="lg" asChild className="w-full">
              <Link href="/profesionales">
                <Calendar className="mr-2 h-5 w-5" />
                Explorar profesionales
              </Link>
            </Button>
          </div>

          {/* Plan Plus */}
          <div className="relative flex flex-col rounded-2xl border-2 border-primary bg-primary/5 p-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
              Conexión inmediata
            </div>
            
            <div className="mb-6">
              <div className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Zap className="mr-2 h-4 w-4" />
                Plan Plus
              </div>
              <h3 className="text-2xl font-bold text-foreground">Habla ahora mismo</h3>
              <p className="mt-2 text-muted-foreground">
                Conéctate con un profesional en menos de 5 minutos
              </p>
            </div>

            <ul className="mb-8 flex-1 space-y-4">
              <li className="flex items-start gap-3">
                <Zap className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-foreground font-medium">Conexión inmediata (menos de 5 min)</span>
              </li>
              <li className="flex items-start gap-3">
                <Star className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-foreground">Prioridad en la atención</span>
              </li>
              <li className="flex items-start gap-3">
                <Video className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-foreground">Profesionales disponibles en vivo</span>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-foreground">Chat de seguimiento</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-foreground">Todo lo del plan gratuito incluido</span>
              </li>
            </ul>

            <Button size="lg" asChild className="w-full animate-pulse-blue">
              <Link href="/profesionales?disponible=true">
                <Zap className="mr-2 h-5 w-5" />
                Hablar ahora
              </Link>
            </Button>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Suscripción mensual en pesos argentinos
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
