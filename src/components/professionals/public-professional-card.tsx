import Image from "next/image"
import Link from "next/link"
import { ShieldCheck, Star, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LiveAvailabilityBadge } from "./live-availability-badge"
import { TIPO_LABELS, hasRealRating, professionalFullName, type PublicProfessional } from "@/src/lib/professionals/public-types"

interface PublicProfessionalCardProps {
  professional: PublicProfessional
  className?: string
}

export function PublicProfessionalCard({ professional: p, className = "" }: PublicProfessionalCardProps) {
  const name = professionalFullName(p)
  const verified = p.verificacion !== "ninguno"
  const price = p.pricing_mode === "dinamico" && p.precio_min && p.precio_max ? null : p.precio

  return (
    <div className={`flex w-full flex-col overflow-hidden rounded-[20px] border border-border bg-card shadow-sm ${className}`}>
      <div className="relative aspect-[4/3] w-full bg-muted">
        {p.foto_url ? (
          <Image src={p.foto_url} alt={name} fill sizes="320px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-purple-500/15">
            <span className="text-3xl font-semibold text-primary">
              {p.nombre?.[0]}
              {p.apellido?.[0]}
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3">
          <LiveAvailabilityBadge disponibleAhora={p.disponible_ahora} proximoTurno={null} />
        </div>
        {verified && (
          <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow">
            <ShieldCheck className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{name}</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {TIPO_LABELS[p.tipo]}
            {p.matricula ? ` · MP ${p.matricula}` : ""}
          </p>
        </div>

        {hasRealRating(p) ? (
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">{p.rating?.toFixed(1)}</span>
            <span className="text-muted-foreground">({p.total_resenas})</span>
          </div>
        ) : (
          <span className="w-fit rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Nuevo</span>
        )}

        {p.especialidades.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {p.especialidades.slice(0, 2).map((esp) => (
              <span key={esp} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                {esp}
              </span>
            ))}
          </div>
        )}

        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="font-semibold text-foreground">
            {price ? `$${price.toLocaleString("es-AR")}` : "Consultar precio"}
            <span className="ml-1 text-xs font-normal text-muted-foreground">/sesión</span>
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Video className="h-3.5 w-3.5" />
            Videollamada
          </span>
        </div>

        <LiveAvailabilityBadge disponibleAhora={false} proximoTurno={p.proximo_turno} className="w-fit" />

        <div className="mt-2 grid grid-cols-2 gap-2">
          <Button asChild variant="outline" size="sm" className="rounded-xl">
            <Link href={`/profesionales/${p.id}`}>Ver perfil</Link>
          </Button>
          <Button asChild size="sm" className="rounded-xl">
            <Link href={`/agendar/${p.id}`}>Reservar</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
