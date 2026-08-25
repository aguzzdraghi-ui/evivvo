"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar, Footer } from "@/src/components/landing"
import { PublicProfessionalCard } from "@/src/components/professionals/public-professional-card"
import { ProfessionalsFilterBar } from "@/src/components/professionals/professionals-filter-bar"
import { EvaEntryCard } from "@/src/components/eva/eva-entry-card"
import { TrustChips } from "@/src/components/shared/trust-chips"
import { PlusPromoCard } from "@/src/components/plus"
import { getPublicProfessionals } from "@/src/lib/professionals/public-queries"
import type { PublicProfessionalListItem } from "@/src/lib/professionals/public-types"
import { EXPLORER_FILTERS, type ExplorerFilterId } from "@/src/lib/professionals/taxonomy"
import { Sparkles, ShieldCheck, Lock, Video, X } from "lucide-react"
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

function ProfessionalsContent() {
  const searchParams = useSearchParams()
  const initialSpecialty = searchParams.get("specialty")
  const isMatch = searchParams.get("match") === "true"
  const disponibleParam = searchParams.get("disponible") === "true"

  const [professionals, setProfessionals] = useState<PublicProfessionalListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [evaSummary, setEvaSummary] = useState<EvaSummary | null>(null)
  const [showSummary, setShowSummary] = useState(true)

  const [activeFilter, setActiveFilter] = useState<ExplorerFilterId | "para-vos" | null>(() => {
    if (disponibleParam) return "disponibles"
    if (initialSpecialty === "ansiedad") return "ansiedad"
    if (initialSpecialty === "pareja") return "parejas"
    return null
  })

  useEffect(() => {
    if (isMatch) {
      const saved = localStorage.getItem("evivvo_eva_summary")
      if (saved) {
        try {
          setEvaSummary(JSON.parse(saved))
          setActiveFilter("para-vos")
        } catch {
          // ignore malformed local data
        }
      }
    }
  }, [isMatch])

  const filterDef = useMemo(() => {
    if (activeFilter === "para-vos") {
      return {
        tipo: null as string | null,
        specialty: evaSummary?.especialidadesRecomendadas?.[0] ?? null,
        disponibleAhora: null as boolean | null,
      }
    }
    const match = EXPLORER_FILTERS.find((f) => f.id === activeFilter)
    return {
      tipo: match?.tipo ?? null,
      specialty: match?.specialty ?? null,
      disponibleAhora: match?.disponibleAhora ?? null,
    }
  }, [activeFilter, evaSummary])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getPublicProfessionals({
          tipo: filterDef.tipo,
          specialty: filterDef.specialty,
          disponibleAhora: filterDef.disponibleAhora,
        })
        if (!cancelled) setProfessionals(data)
      } catch {
        if (!cancelled) setError("No pudimos cargar los profesionales. Probá de nuevo en unos minutos.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [filterDef])

  const availableNowCount = professionals.filter((p) => p.disponible_ahora).length
  const hasEvaSignal = isMatch && !!evaSummary

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Profesionales para vos
              </div>
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                Encontrá a la{" "}
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  persona indicada
                </span>
              </h1>
              <p className="mt-2 max-w-xl text-muted-foreground">
                Explorá perfiles verificados, conocé su forma de trabajar y reservá online.
              </p>
            </div>

            {!loading && professionals.length > 0 && (
              <div className="flex items-center gap-2 self-start rounded-full border border-border bg-background px-4 py-2 text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  {availableNowCount > 0 && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span className={`relative inline-flex h-2 w-2 rounded-full ${availableNowCount > 0 ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
                </span>
                {availableNowCount} disponibles ahora
              </div>
            )}
          </div>

          {isMatch && evaSummary && showSummary && (
            <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-medium">EVA entendió tu situación</p>
                      <p className="text-sm text-muted-foreground">{evaSummary.resumenSituacion}</p>
                      {evaSummary.emocionesDetectadas?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {evaSummary.emocionesDetectadas.map((emocion) => (
                            <Badge key={emocion} variant="secondary" className="text-xs">
                              {emocion}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setShowSummary(false)} className="p-1 text-muted-foreground hover:text-foreground" aria-label="Cerrar">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {isMatch && (
            <div className="mb-8">
              <PlusPromoCard variant="banner" />
            </div>
          )}

          <div className="mb-8 grid gap-6 lg:grid-cols-[280px_1fr]">
            <div className="hidden lg:block">
              <EvaEntryCard
                title="¿No sabés a quién elegir?"
                description="Contale a EVA qué necesitás y te recomienda el perfil ideal."
                placeholder="¿Qué estás buscando?"
                submitLabel="Hablar con EVA"
                variant="button"
              />
            </div>

            <div>
              <div className="mb-6">
                <ProfessionalsFilterBar active={activeFilter} onSelect={setActiveFilter} showParaVos={hasEvaSignal} />
              </div>

              {loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-96 animate-pulse rounded-[20px] bg-muted" />
                  ))}
                </div>
              ) : error ? (
                <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              ) : professionals.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No encontramos profesionales para este filtro. Probá con otro criterio.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {professionals.map((p) => (
                    <PublicProfessionalCard key={p.id} professional={p} />
                  ))}
                </div>
              )}

              <div className="mt-6 lg:hidden">
                <EvaEntryCard
                  title="¿No sabés a quién elegir?"
                  description="Contale a EVA qué necesitás y te recomienda el perfil ideal."
                  placeholder="¿Qué estás buscando?"
                  submitLabel="Hablar con EVA"
                  variant="button"
                />
              </div>
            </div>
          </div>

          <TrustChips
            items={[
              // "Perfiles verificados" only claims what is actually true for at least one loaded profile.
              ...(professionals.some((p) => p.verificacion !== "ninguno")
                ? [{ icon: ShieldCheck, label: "Perfiles verificados" }]
                : []),
              { icon: Lock, label: "Pago protegido" },
              { icon: Video, label: "Videollamada privada" },
            ]}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function ProfessionalsPage() {
  return (
    <Suspense fallback={null}>
      <ProfessionalsContent />
    </Suspense>
  )
}
