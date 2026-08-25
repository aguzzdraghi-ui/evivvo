"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar, Footer } from "@/src/components/landing"
import { ProfessionalCard, ProfessionalsFilters } from "@/src/components/professionals"
import { createClient } from "@/src/lib/supabase/client"
import { PlusPromoCard } from "@/src/components/plus"
import { Sparkles, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EvaSummary {
  resumenSituacion: string
  emocionesDetectadas: string[]
  nivelUrgencia: string
  especialidadesRecomendadas: string[]
  tipoProfesional: string
  fecha: string
}

interface SupabaseProfessional {
  id: string
  tipo: string
  especialidades: string[]
  precio: number
  duracion: number
  online: boolean
  visible: boolean
  estado: string
  verificacion: string
  descripcion: string
  experiencia: number
  rating: number
  profiles: {
    nombre: string
    apellido: string
    foto_url: string | null
  }
}

function ProfessionalsContent() {
  const searchParams = useSearchParams()
  const initialSpecialty = searchParams.get("specialty")
  const isMatch = searchParams.get("match") === "true"
  const disponibleParam = searchParams.get("disponible") === "true"

  const [professionals, setProfessionals] = useState<SupabaseProfessional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
    initialSpecialty ? [initialSpecialty] : []
  )
  const [availableNow, setAvailableNow] = useState(disponibleParam)
  const [evaSummary, setEvaSummary] = useState<EvaSummary | null>(null)
  const [showSummary, setShowSummary] = useState(true)

  // Cargar profesionales desde Supabase
  useEffect(() => {
    async function fetchProfessionals() {
      setLoading(true)
      setError(null)
      
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from('professionals')
        .select(`
          id,
          tipo,
          especialidades,
          precio,
          duracion,
          online,
          visible,
          estado,
          verificacion,
          descripcion,
          experiencia,
          rating,
          profiles (
            nombre,
            apellido,
            foto_url
          )
        `)
        .eq('estado', 'activo')
        .eq('visible', true)
      
      if (fetchError) {
        console.error('[v0] Error fetching professionals:', fetchError)
        setError('Error al cargar profesionales')
        setLoading(false)
        return
      }
      
      setProfessionals(data || [])
      setLoading(false)
    }
    
    fetchProfessionals()
  }, [])

  // Cargar resumen de EVA si es match
  useEffect(() => {
    if (isMatch) {
      const saved = localStorage.getItem('evivvo_eva_summary')
      if (saved) {
        setEvaSummary(JSON.parse(saved))
      }
    }
  }, [isMatch])

  useEffect(() => {
    const specialty = searchParams.get("specialty")
    if (specialty && !selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties([specialty])
    }
  }, [searchParams, selectedSpecialties])

  // Mapear profesionales de Supabase al formato del componente
  const mappedProfessionals = useMemo(() => {
    return professionals.map(p => ({
      id: p.id,
      name: p.profiles ? `${p.profiles.nombre} ${p.profiles.apellido}` : 'Profesional',
      title: p.tipo || 'Terapeuta',
      image: p.profiles?.foto_url || '/images/professionals/default.jpg',
      rating: p.rating || 0,
      reviews: Math.floor((p.experiencia || 1) * 10),
      price: p.precio || 0,
      specialties: p.especialidades || [],
      description: p.descripcion || '',
      availableNow: p.online || false,
      badge: p.verificacion !== 'none' ? p.verificacion : undefined,
      featured: p.verificacion === 'platinum',
    }))
  }, [professionals])

  // Aplicar filtros de especialidad y disponibilidad
  const filteredProfessionals = useMemo(() => {
    let result = mappedProfessionals

    if (selectedSpecialties.length > 0) {
      result = result.filter(p => 
        p.specialties.some(s => selectedSpecialties.includes(s))
      )
    }

    if (availableNow) {
      result = result.filter(p => p.availableNow)
    }

    return result
  }, [mappedProfessionals, selectedSpecialties, availableNow])

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    )
  }

  const handleClearFilters = () => {
    setSelectedSpecialties([])
    setAvailableNow(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              {isMatch ? "Profesionales recomendados para ti" : "Nuestros profesionales"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isMatch 
                ? "Basado en tu conversación con EVA, estos profesionales son ideales para tu situación"
                : "Encuentra al profesional ideal para acompañarte en tu proceso de bienestar"
              }
            </p>
          </div>

          {/* EVA Summary para match */}
          {isMatch && evaSummary && showSummary && (
            <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shrink-0">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-1">EVA entendió tu situación</p>
                      <p className="text-sm text-muted-foreground">{evaSummary.resumenSituacion}</p>
                      {evaSummary.emocionesDetectadas?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {evaSummary.emocionesDetectadas.map((emocion) => (
                            <Badge key={emocion} variant="secondary" className="text-xs">
                              {emocion}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowSummary(false)}
                    className="text-muted-foreground hover:text-foreground p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Plus Banner para match */}
          {isMatch && (
            <div className="mb-8">
              <PlusPromoCard variant="banner" />
            </div>
          )}

          <div className="mb-8 rounded-2xl border border-border bg-background p-4 md:p-6">
            <ProfessionalsFilters
              selectedSpecialties={selectedSpecialties}
              availableNow={availableNow}
              onSpecialtyChange={handleSpecialtyChange}
              onAvailableNowChange={setAvailableNow}
              onClearFilters={handleClearFilters}
            />
          </div>

          {loading ? (
            <div className="rounded-2xl border border-border bg-muted/30 p-12 text-center">
              <p className="text-lg font-medium text-foreground">
                Cargando profesionales...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-12 text-center">
              <p className="text-lg font-medium text-red-700">
                {error}
              </p>
              <p className="mt-2 text-red-600">
                Por favor, intenta de nuevo más tarde
              </p>
            </div>
          ) : mappedProfessionals.length === 0 ? (
            <div className="rounded-2xl border border-border bg-muted/30 p-12 text-center">
              <p className="text-lg font-medium text-foreground">
                No hay profesionales cargados
              </p>
              <p className="mt-2 text-muted-foreground">
                Pronto tendremos profesionales disponibles para ti
              </p>
            </div>
          ) : filteredProfessionals.length === 0 ? (
            <div className="rounded-2xl border border-border bg-muted/30 p-12 text-center">
              <p className="text-lg font-medium text-foreground">
                No encontramos profesionales con esos filtros
              </p>
              <p className="mt-2 text-muted-foreground">
                Intenta ajustar los filtros para ver más opciones
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                {filteredProfessionals.length === mappedProfessionals.length
                  ? `${mappedProfessionals.length} profesionales disponibles`
                  : `${filteredProfessionals.length} de ${mappedProfessionals.length} profesionales`}
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProfessionals.map((professional, index) => (
                  <ProfessionalCard key={professional.id} professional={professional} index={index} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function ProfessionalsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                Nuestros profesionales
              </h1>
              <p className="mt-2 text-muted-foreground">
                Cargando profesionales...
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <ProfessionalsContent />
    </Suspense>
  )
}
