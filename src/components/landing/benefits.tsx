import { Shield, Clock, Laptop, CreditCard, MessageCircle, Award } from "lucide-react"

const benefits = [
  {
    icon: Shield,
    title: "Confidencialidad total",
    description: "Tus conversaciones están protegidas con encriptación de extremo a extremo.",
  },
  {
    icon: Clock,
    title: "Flexibilidad horaria",
    description: "Sesiones disponibles de lunes a domingo, en horarios que se adaptan a ti.",
  },
  {
    icon: Laptop,
    title: "Desde cualquier lugar",
    description: "Accede a tu sesión desde tu computadora, tablet o celular.",
  },
  {
    icon: CreditCard,
    title: "Pagos seguros",
    description: "Múltiples métodos de pago con transacciones 100% seguras.",
  },
  {
    icon: MessageCircle,
    title: "Soporte continuo",
    description: "Chat de seguimiento entre sesiones para mantener tu progreso.",
  },
  {
    icon: Award,
    title: "Profesionales verificados",
    description: "Todos nuestros profesionales pasan por un riguroso proceso de selección.",
  },
]

export function Benefits() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            Por qué elegir Evivvo
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Nos comprometemos a brindarte la mejor experiencia en tu camino hacia el bienestar
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex gap-4 rounded-2xl bg-background p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
