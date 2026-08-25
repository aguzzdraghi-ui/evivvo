import { Lock, Video, Calendar } from "lucide-react"
import { HeroBrandMessage } from "./hero-brand-message"
import { ChooseProfessionalCard } from "./choose-professional-card"
import { FeaturedProfessionalsStack } from "./featured-professionals-stack"
import { EvaEntryCard } from "@/src/components/eva/eva-entry-card"
import { TrustChips } from "@/src/components/shared/trust-chips"

export function HomeHero() {
  return (
    <section id="hablar-con-eva" className="relative overflow-hidden py-12 md:py-16 lg:py-20">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/20 to-background" />
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-purple-400/5 blur-3xl" />
      </div>

      <div className="container mx-auto grid gap-10 px-4 md:px-6 lg:grid-cols-2 lg:items-center lg:gap-6">
        <div>
          <HeroBrandMessage />

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <EvaEntryCard
              description="Contame qué estás viviendo. EVA te escucha y te orienta."
              placeholder="¿Cómo te sentís hoy?"
              submitLabel="Empezar"
            />
            <ChooseProfessionalCard />
          </div>

          <TrustChips
            className="mt-8 justify-start"
            items={[
              { icon: Lock, label: "Privado y seguro" },
              { icon: Video, label: "Videollamada" },
              { icon: Calendar, label: "Reserva online" },
            ]}
          />
        </div>

        <FeaturedProfessionalsStack />
      </div>
    </section>
  )
}
