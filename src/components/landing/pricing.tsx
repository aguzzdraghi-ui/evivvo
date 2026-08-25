import Link from "next/link"
import { Check, Calendar, Zap, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Pricing() {
  return (
    <section id="planes" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            Planes simples y transparentes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Sin compromisos, sin letras chicas. Elegí lo que mejor se adapte a vos.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
          {/* Plan Gratis */}
          <div className="flex flex-col rounded-2xl border border-border bg-background p-8">
            <div className="mb-6">
              <div className="mb-2 inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm font-medium">
                <Calendar className="mr-2 h-4 w-4" />
                Gratis
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">/ siempre</span>
              </div>
              <p className="mt-2 text-muted-foreground">
                Agenda sesiones con profesionales y pagá solo lo que uses
              </p>
            </div>

            <ul className="mb-8 flex-1 space-y-4">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">Agendar sesiones con profesionales</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">Explorar perfiles con video</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">Filtrar por especialidad</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">Pagás solo la sesión al profesional</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">Sin suscripción ni compromiso</span>
              </li>
            </ul>

            <Button variant="outline" size="lg" asChild className="w-full">
              <Link href="/profesionales">Explorar profesionales</Link>
            </Button>
          </div>

          {/* Plan Plus */}
          <div className="relative flex flex-col rounded-2xl border-2 border-primary bg-primary/5 p-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
              Más popular
            </div>
            
            <div className="mb-6">
              <div className="mb-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Star className="mr-2 h-4 w-4" />
                Plan Plus
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">$4.990</span>
                <span className="text-muted-foreground">ARS / mes</span>
              </div>
              <p className="mt-2 text-muted-foreground">
                Conectate con profesionales en menos de 5 minutos
              </p>
            </div>

            <ul className="mb-8 flex-1 space-y-4">
              <li className="flex items-center gap-3">
                <Zap className="h-5 w-5 shrink-0 text-primary" />
                <span className="font-medium text-foreground">Conexión inmediata (menos de 5 min)</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">Prioridad en la atención</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">Profesionales disponibles en vivo</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">Chat de seguimiento</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">Todo lo del plan gratis incluido</span>
              </li>
            </ul>

            <Button size="lg" asChild className="w-full animate-pulse-blue">
              <Link href="/profesionales?disponible=true">
                <Zap className="mr-2 h-5 w-5" />
                Hablar ahora
              </Link>
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Podés cancelar en cualquier momento
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          El precio de las sesiones lo define cada profesional. Evivvo cobra una comisión del servicio.
        </p>
      </div>
    </section>
  )
}
