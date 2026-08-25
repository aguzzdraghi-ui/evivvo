import Link from "next/link"
import { Brain, HeartCrack, Users, Cloud, Sparkles, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

const specialties = [
  {
    icon: Brain,
    title: "Ansiedad",
    description: "Aprende a manejar los pensamientos acelerados y las sensaciones físicas de la ansiedad.",
    color: "bg-blue-500/10 text-blue-600",
    filter: "ansiedad",
  },
  {
    icon: Cloud,
    title: "Estrés",
    description: "Desarrolla herramientas para reducir el estrés y recuperar el equilibrio en tu vida.",
    color: "bg-amber-500/10 text-amber-600",
    filter: "estres",
  },
  {
    icon: HeartCrack,
    title: "Rupturas",
    description: "Supera una separación o divorcio y reconstruye tu autoestima y bienestar.",
    color: "bg-rose-500/10 text-rose-600",
    filter: "rupturas",
  },
  {
    icon: Users,
    title: "Pareja",
    description: "Mejora tu comunicación, resuelve conflictos y fortalece tu relación.",
    color: "bg-emerald-500/10 text-emerald-600",
    filter: "pareja",
  },
  {
    icon: Heart,
    title: "Soledad",
    description: "Trabaja los sentimientos de aislamiento y construye conexiones significativas.",
    color: "bg-indigo-500/10 text-indigo-600",
    filter: "soledad",
  },
  {
    icon: Sparkles,
    title: "Crecimiento personal",
    description: "Descubre tu potencial, define tus metas y alcanza la mejor versión de ti mismo.",
    color: "bg-primary/10 text-primary",
    filter: "crecimiento-personal",
  },
]

export function Specialties() {
  return (
    <section id="especialidades" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            Especialidades
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Nuestros profesionales están capacitados para ayudarte en diferentes áreas de tu bienestar emocional
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {specialties.map((specialty) => (
            <Link
              key={specialty.filter}
              href={`/profesionales?specialty=${specialty.filter}`}
              className="group flex flex-col rounded-2xl border border-border bg-background p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${specialty.color}`}>
                <specialty.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary">
                {specialty.title}
              </h3>
              <p className="text-sm text-muted-foreground">{specialty.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link href="/profesionales">Ver todos los profesionales</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
