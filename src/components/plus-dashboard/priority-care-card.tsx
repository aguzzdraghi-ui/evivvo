import Link from "next/link"
import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PriorityCareCard() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15">
        <Zap className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">Atención prioritaria</p>
        <p className="text-xs text-muted-foreground">Encontrá un profesional disponible ahora</p>
      </div>
      <Button asChild size="sm" className="shrink-0 rounded-xl bg-gradient-to-r from-primary to-purple-600">
        <Link href="/profesionales?disponible=true">Buscar atención</Link>
      </Button>
    </div>
  )
}
