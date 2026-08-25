"use client"

import Link from "next/link"
import { 
  Brain, 
  Heart, 
  CloudRain, 
  HeartCrack, 
  Moon, 
  Users, 
  Sparkles, 
  Zap,
  UserX,
  Flame
} from "lucide-react"

const categories = [
  {
    id: "ansiedad",
    label: "Ansiedad",
    icon: Brain,
    color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
  },
  {
    id: "depresion",
    label: "Depresión",
    icon: CloudRain,
    color: "bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20",
  },
  {
    id: "estres",
    label: "Estrés",
    icon: Zap,
    color: "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20",
  },
  {
    id: "rupturas",
    label: "Rupturas amorosas",
    icon: HeartCrack,
    color: "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20",
  },
  {
    id: "duelo",
    label: "Duelo",
    icon: Heart,
    color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20",
  },
  {
    id: "soledad",
    label: "Soledad",
    icon: UserX,
    color: "bg-slate-500/10 text-slate-600 hover:bg-slate-500/20",
  },
  {
    id: "pareja",
    label: "Terapia de pareja",
    icon: Users,
    color: "bg-pink-500/10 text-pink-600 hover:bg-pink-500/20",
  },
  {
    id: "autoestima",
    label: "Autoestima",
    icon: Sparkles,
    color: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20",
  },
  {
    id: "crecimiento-personal",
    label: "Crecimiento personal",
    icon: Flame,
    color: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20",
  },
  {
    id: "insomnio",
    label: "Insomnio",
    icon: Moon,
    color: "bg-violet-500/10 text-violet-600 hover:bg-violet-500/20",
  },
]

export function Matching() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            ¿Qué necesitas hoy?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Encuentra profesionales especializados en lo que estás atravesando
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.id}
                href={`/profesionales?especialidad=${category.id}`}
                className={`flex flex-col items-center gap-3 rounded-2xl p-6 text-center transition-all hover:scale-105 ${category.color}`}
              >
                <Icon className="h-8 w-8" />
                <span className="text-sm font-medium">{category.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/profesionales"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todos los profesionales
          </Link>
        </div>
      </div>
    </section>
  )
}
