import Image from "next/image"
import Link from "next/link"
import { professionalFullName, TIPO_LABELS, type PublicProfessional } from "@/src/lib/professionals/public-types"
import { LiveAvailabilityBadge } from "@/src/components/professionals/live-availability-badge"

interface FeaturedMiniCardProps {
  professional: PublicProfessional
  style?: React.CSSProperties
  className?: string
}

/** Compact preview card used only in the home hero's stacked/peek visual. */
export function FeaturedMiniCard({ professional: p, style, className = "" }: FeaturedMiniCardProps) {
  const name = professionalFullName(p)

  return (
    <Link
      href={`/profesionales/${p.id}`}
      style={style}
      className={`block w-52 overflow-hidden rounded-2xl border border-border bg-card shadow-xl transition-transform hover:-translate-y-1 ${className}`}
    >
      <div className="relative aspect-[4/3] w-full bg-muted">
        {p.foto_url ? (
          <Image src={p.foto_url} alt={name} fill sizes="208px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-purple-500/15">
            <span className="text-xl font-semibold text-primary">
              {p.nombre?.[0]}
              {p.apellido?.[0]}
            </span>
          </div>
        )}
        <div className="absolute left-2 top-2">
          <LiveAvailabilityBadge disponibleAhora={p.disponible_ahora} proximoTurno={null} />
        </div>
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-semibold text-foreground">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{TIPO_LABELS[p.tipo]}</p>
      </div>
    </Link>
  )
}
