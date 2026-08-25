import { Brain, Sparkles, Stethoscope } from "lucide-react"

const roles = [
  {
    icon: Brain,
    title: "Psicólogos",
    description: "Terapia clínica para ansiedad, depresión, traumas y más. Profesionales matriculados con formación universitaria.",
    tags: ["Terapia individual", "Diagnóstico clínico", "Tratamiento de trastornos"],
  },
  {
    icon: Sparkles,
    title: "Coaches",
    description: "Acompañamiento personal y profesional. Te ayudan a alcanzar metas, mejorar relaciones y potenciar tu desarrollo.",
    tags: ["Desarrollo personal", "Coaching de vida", "Cambio de hábitos"],
  },
  {
    icon: Stethoscope,
    title: "Psiquiatras",
    description: "Evaluación y tratamiento médico cuando se requiere medicación. Próximamente disponible en la plataforma.",
    tags: ["Evaluación médica", "Medicación", "Próximamente"],
    comingSoon: true,
  },
]

export function Roles() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            Profesionales para cada necesidad
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            En Evivvo encontrás diferentes tipos de profesionales según lo que necesites
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <div
                key={role.title}
                className={`relative flex flex-col rounded-2xl border bg-background p-6 ${
                  role.comingSoon ? "border-dashed opacity-75" : "border-border"
                }`}
              >
                {role.comingSoon && (
                  <div className="absolute -top-3 right-4 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    Próximamente
                  </div>
                )}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">{role.title}</h3>
                <p className="mb-4 flex-1 text-sm text-muted-foreground">{role.description}</p>
                <div className="flex flex-wrap gap-2">
                  {role.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
