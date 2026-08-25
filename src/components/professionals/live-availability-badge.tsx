import { Calendar } from "lucide-react"

interface LiveAvailabilityBadgeProps {
  disponibleAhora: boolean
  proximoTurno: string | null
  className?: string
}

function formatProximoTurno(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  const isTomorrow = date.toDateString() === tomorrow.toDateString()

  const time = date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })

  if (isToday) return `Hoy ${time}`
  if (isTomorrow) return `Mañana ${time}`
  return `${date.toLocaleDateString("es-AR", { day: "numeric", month: "short" })} ${time}`
}

/**
 * Real-time availability, never a decorative badge: "disponible ahora" only
 * renders when the backend confirms an active heartbeat, and the next-slot
 * badge only renders when a real free slot exists. No color-only signal —
 * every state also carries text.
 */
export function LiveAvailabilityBadge({ disponibleAhora, proximoTurno, className = "" }: LiveAvailabilityBadgeProps) {
  if (disponibleAhora) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 ${className}`}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </span>
        Disponible ahora
      </span>
    )
  }

  if (proximoTurno) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground ${className}`}
      >
        <Calendar className="h-3 w-3" />
        Próximo turno {formatProximoTurno(proximoTurno)}
      </span>
    )
  }

  return null
}
