"use client"

import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Clock, Award, Video, Calendar, MessageCircle, ArrowLeft } from "lucide-react"
import { Navbar, Footer } from "@/src/components/landing"
import { Button } from "@/components/ui/button"
import { useEvivvoStore } from "@/src/lib/store"

interface ProfessionalPageProps {
  params: Promise<{ id: string }>
}

export default function ProfessionalPage({ params }: ProfessionalPageProps) {
  const { id } = use(params)
  const getProfessionalById = useEvivvoStore(state => state.getProfessionalById)
  const storeProfessional = getProfessionalById(id)

  if (!storeProfessional) {
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

  // Adaptar datos del store al formato de visualización
  const professional = {
    id: storeProfessional.id,
    name: `${storeProfessional.nombre} ${storeProfessional.apellido}`,
    title: storeProfessional.tipo === 'psicologo' ? 'Psicólogo/a' 
      : storeProfessional.tipo === 'coach' ? 'Coach de Vida'
      : storeProfessional.tipo === 'psiquiatra' ? 'Médico Psiquiatra'
      : 'Terapeuta',
    image: storeProfessional.foto,
    price: storeProfessional.precio,
    rating: storeProfessional.rating,
    reviews: storeProfessional.reviewCount,
    specialties: storeProfessional.especialidades,
    availableNow: storeProfessional.estadoOnline,
    description: storeProfessional.descripcion,
    yearsExperience: Math.floor(Math.random() * 10) + 5, // Simulated
    nextAvailable: storeProfessional.estadoOnline ? "Disponible ahora" : "Mañana 9:00",
    certification: `${storeProfessional.tipo === 'psicologo' ? 'Licenciatura en Psicología' : storeProfessional.tipo === 'psiquiatra' ? 'Doctorado en Medicina, Especialidad en Psiquiatría' : 'Certificación profesional'} - Universidad de Buenos Aires`,
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          {/* Back button */}
          <Link
            href="/profesionales"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a profesionales
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="mb-8 flex flex-col gap-6 rounded-2xl border border-border bg-background p-6 md:flex-row md:items-start">
                <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src={professional.image}
                    alt={professional.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  {professional.availableNow && (
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-2 py-1 text-xs font-medium text-white">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                      </span>
                      Disponible
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-foreground">
                        {professional.rating}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      ({professional.reviews} opiniones)
                    </span>
                  </div>

                  <h1 className="mb-1 text-2xl font-bold text-foreground md:text-3xl">
                    {professional.name}
                  </h1>
                  <p className="mb-4 text-lg text-muted-foreground">
                    {professional.title}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {professional.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground capitalize"
                      >
                        {specialty.replace("-", " ")}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-primary" />
                      <span>{professional.yearsExperience} años de experiencia</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{professional.nextAvailable}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="mb-8 rounded-2xl border border-border bg-background p-6">
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  Sobre mí
                </h2>
                <p className="whitespace-pre-line text-muted-foreground">
                  {professional.description}
                </p>
              </div>

              {/* Certification */}
              <div className="mb-8 rounded-2xl border border-border bg-background p-6">
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  Formación y certificaciones
                </h2>
                <p className="text-muted-foreground">{professional.certification}</p>
              </div>

              {/* Video presentation (simulated) */}
              <div className="mb-8 rounded-2xl border border-border bg-background p-6">
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  Video de presentación
                </h2>
                <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={professional.image}
                    alt={`Video de presentación de ${professional.name}`}
                    fill
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                    <button className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110">
                      <Video className="h-8 w-8" />
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Conoce más sobre mi enfoque y cómo puedo ayudarte.
                </p>
              </div>
            </div>

            {/* Sidebar - Booking card */}
            <div className="lg:col-span-1">
              <div
                id="reservar"
                className="sticky top-24 rounded-2xl border border-border bg-background p-6 shadow-lg"
              >
                <div className="mb-4 text-center">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(professional.price)}
                  </span>
                  <span className="text-muted-foreground"> / sesión</span>
                </div>

                <p className="mb-6 text-center text-sm text-muted-foreground">
                  Sesión de 40 minutos por videollamada
                </p>

                <div className="space-y-3">
                  {professional.availableNow && (
                    <Link href={`/agendar/${professional.id}?modo=ahora`}>
                      <Button size="lg" className="w-full gap-2 bg-emerald-500 hover:bg-emerald-600">
                        <Video className="h-5 w-5" />
                        Conectar ahora
                      </Button>
                    </Link>
                  )}
                  <Link href={`/agendar/${professional.id}`}>
                    <Button
                      size="lg"
                      variant={professional.availableNow ? "outline" : "default"}
                      className="w-full gap-2"
                    >
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
                    <span>Duración de 40 minutos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <MessageCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span>Chat de seguimiento incluido</span>
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
