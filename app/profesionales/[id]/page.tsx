"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Clock, Award, Video, Calendar, MessageCircle, ArrowLeft, ShieldCheck, PlayCircle } from "lucide-react"
import { Navbar, Footer } from "@/src/components/landing"
import { Button } from "@/components/ui/button"
import { getPublicProfessionalById } from "@/src/lib/professionals/public-queries"
import { TIPO_LABELS, hasRealRating, professionalFullName, type PublicProfessionalDetail } from "@/src/lib/professionals/public-types"

interface ProfessionalPageProps {
  params: Promise<{ id: string }>
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(price)
}

export default function ProfessionalPage({ params }: ProfessionalPageProps) {
  const { id } = use(params)
  const [professional, setProfessional] = useState<PublicProfessionalDetail | null | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    getPublicProfessionalById(id).then((data) => {
      if (!cancelled) setProfessional(data)
    })
    return () => {
      cancelled = true
    }
  }, [id])

  if (professional === undefined) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container mx-auto animate-pulse px-4 md:px-6">
            <div className="h-64 rounded-2xl bg-muted" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!professional) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-bold">Profesional no encontrado</h2>
            <p className="mb-4 text-muted-foreground">
              El profesional que buscás no existe o ya no está disponible.
            </p>
            <Link href="/profesionales">
              <Button>Ver todos los profesionales</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const name = professionalFullName(professional)
  const price = professional.pricing_mode === "dinamico" ? null : professional.precio

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <Link
            href="/profesionales"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a profesionales
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-border bg-background p-6 md:flex-row md:items-start">
                <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl bg-muted">
                  {professional.foto_url ? (
                    <Image src={professional.foto_url} alt={name} fill className="object-cover" priority />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-purple-500/15">
                      <span className="text-4xl font-semibold text-primary">
                        {professional.nombre?.[0]}
                        {professional.apellido?.[0]}
                      </span>
                    </div>
                  )}
                  {professional.disponible_ahora && (
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-2 py-1 text-xs font-medium text-white">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                      </span>
                      Disponible
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    {hasRealRating(professional) ? (
                      <>
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-foreground">{professional.rating?.toFixed(1)}</span>
                        </div>
                        <span className="text-muted-foreground">({professional.total_resenas} opiniones)</span>
                      </>
                    ) : (
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">Nuevo en Evivvo</span>
                    )}
                    {professional.verificacion !== "ninguno" && (
                      <span className="flex items-center gap-1 text-xs font-medium text-primary">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Verificado
                      </span>
                    )}
                  </div>

                  <h1 className="mb-1 text-2xl font-bold text-foreground md:text-3xl">{name}</h1>
                  <p className="mb-4 text-lg text-muted-foreground">
                    {TIPO_LABELS[professional.tipo]}
                    {professional.matricula ? ` · MP ${professional.matricula}` : ""}
                  </p>

                  {professional.especialidades.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {professional.especialidades.map((specialty) => (
                        <span key={specialty} className="rounded-full bg-accent px-3 py-1 text-sm font-medium capitalize text-accent-foreground">
                          {specialty.replace("-", " ")}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {!!professional.experiencia && (
                      <div className="flex items-center gap-1.5">
                        <Award className="h-4 w-4 text-primary" />
                        <span>{professional.experiencia} años de experiencia</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>
                        {professional.disponible_ahora
                          ? "Disponible ahora"
                          : professional.proximo_turno
                            ? `Próximo turno: ${new Date(professional.proximo_turno).toLocaleString("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`
                            : "Sin turnos publicados"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {professional.descripcion && (
                <div className="mb-8 rounded-2xl border border-border bg-background p-6">
                  <h2 className="mb-4 text-xl font-semibold text-foreground">Sobre mí</h2>
                  <p className="whitespace-pre-line text-muted-foreground">{professional.descripcion}</p>
                </div>
              )}

              {professional.video_presentacion_url && (
                <div className="mb-8 rounded-2xl border border-border bg-background p-6">
                  <h2 className="mb-4 text-xl font-semibold text-foreground">Video de presentación</h2>
                  <a
                    href={professional.video_presentacion_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-muted"
                  >
                    <PlayCircle className="h-16 w-16 text-primary transition-transform hover:scale-110" />
                  </a>
                  <p className="mt-4 text-sm text-muted-foreground">Conocé más sobre su enfoque y cómo puede ayudarte.</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div id="reservar" className="sticky top-24 rounded-2xl border border-border bg-background p-6 shadow-lg">
                <div className="mb-4 text-center">
                  {price ? (
                    <>
                      <span className="text-3xl font-bold text-primary">{formatPrice(price)}</span>
                      <span className="text-muted-foreground"> / sesión</span>
                    </>
                  ) : professional.precio_min && professional.precio_max ? (
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(professional.precio_min)} – {formatPrice(professional.precio_max)}
                    </span>
                  ) : (
                    <span className="text-lg font-medium text-muted-foreground">Consultar precio</span>
                  )}
                </div>

                <p className="mb-6 text-center text-sm text-muted-foreground">
                  Sesión de {professional.duracion} minutos por videollamada
                </p>

                <div className="space-y-3">
                  {professional.disponible_ahora && (
                    <Link href={`/agendar/${professional.id}?modo=ahora`}>
                      <Button size="lg" className="w-full gap-2 bg-emerald-500 hover:bg-emerald-600">
                        <Video className="h-5 w-5" />
                        Conectar ahora
                      </Button>
                    </Link>
                  )}
                  <Link href={`/agendar/${professional.id}`}>
                    <Button size="lg" variant={professional.disponible_ahora ? "outline" : "default"} className="w-full gap-2">
                      <Calendar className="h-5 w-5" />
                      Reservar sesión
                    </Button>
                  </Link>
                  <Link href="/contacto">
                    <Button size="lg" variant="ghost" className="w-full gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Enviar mensaje
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 space-y-3 border-t border-border pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Video className="h-4 w-4 text-primary" />
                    </div>
                    <span>Sesión por videollamada HD</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <span>Duración de {professional.duracion} minutos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
