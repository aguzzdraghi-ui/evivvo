import { Search, CalendarCheck, Video, Heart } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Explora profesionales",
    description: "Navega por nuestro catálogo de psicólogos y coaches certificados. Filtra por especialidad y disponibilidad.",
  },
  {
    icon: CalendarCheck,
    title: "Reserva tu sesión",
    description: "Elige el horario que mejor se adapte a ti. Puedes reservar una sesión inmediata o programarla para más tarde.",
  },
  {
    icon: Video,
    title: "Conéctate por video",
    description: "Únete a tu sesión desde cualquier dispositivo. Solo necesitas conexión a internet y un espacio privado.",
  },
  {
    icon: Heart,
    title: "Transforma tu vida",
    description: "Trabaja de la mano con tu profesional para alcanzar tus objetivos de bienestar emocional.",
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            Cómo funciona Evivvo
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            En cuatro simples pasos, estarás conectado con el profesional ideal para ti
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center rounded-2xl bg-background p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {index + 1}
              </div>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <step.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
