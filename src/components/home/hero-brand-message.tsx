import { Sparkles } from "lucide-react"

export function HeroBrandMessage() {
  return (
    <div>
      <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
        <Sparkles className="h-4 w-4" />
        Tu bienestar empieza acá
      </div>

      <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl">
        Volvé a vos.
        <br />
        <span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-600 bg-clip-text text-transparent">
          Viví mejor.
        </span>
      </h1>

      <p className="mt-4 text-base text-muted-foreground md:text-lg">
        <span className="font-semibold text-foreground">EVIVVO:</span> Espacio Virtual Integral de Vida, Vínculos y
        Orientación.
      </p>

      <p className="mt-2 text-base text-muted-foreground md:text-lg">Elegí cómo querés empezar hoy.</p>
    </div>
  )
}
