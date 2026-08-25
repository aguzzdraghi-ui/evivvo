"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowLeft, 
  Sparkles,
  Star,
  Clock,
  Video,
  Calendar,
  CheckCircle,
  X,
  Brain,
  Heart,
  Zap,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { referrals } from "@/src/data/referrals"
import { patientMessages, type ReferralType } from "@/src/types/referral"

// Mock: recomendaciones para el paciente actual
const patientReferrals = referrals.filter(r => 
  r.patientId === 'patient-001' && 
  (r.status === 'shown' || r.status === 'pending')
)

const typeConfig: Record<ReferralType, { icon: typeof Brain; color: string; bgGradient: string }> = {
  psychiatrist: { 
    icon: Brain, 
    color: 'text-red-600',
    bgGradient: 'from-red-500/10 to-red-500/5'
  },
  psychologist: { 
    icon: Heart, 
    color: 'text-primary',
    bgGradient: 'from-primary/10 to-primary/5'
  },
  coach: { 
    icon: Zap, 
    color: 'text-emerald-600',
    bgGradient: 'from-emerald-500/10 to-emerald-500/5'
  },
}

export default function PatientRecommendationsPage() {
  const [dismissedIds, setDismissedIds] = useState<string[]>([])

  const activeReferrals = patientReferrals.filter(r => !dismissedIds.includes(r.id))

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => [...prev, id])
  }

  const handleAccept = (referralId: string) => {
    // Mock: marcar como aceptada
    alert('Gracias por tu respuesta. Te mostraremos profesionales recomendados.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/mi-cuenta">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Recomendaciones para Vos</h1>
              <p className="text-sm text-muted-foreground">Profesionales sugeridos por Evivvo</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Intro */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/20 p-3">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg mb-1">Evivvo te acompaña</h2>
                <p className="text-muted-foreground">
                  Basándonos en tu evolución emocional, identificamos profesionales que podrían 
                  ayudarte en esta etapa de tu proceso. Estas recomendaciones son personalizadas para vos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recomendaciones */}
        {activeReferrals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Todo en orden</h3>
              <p className="text-muted-foreground">
                No tenés recomendaciones pendientes en este momento. Seguí con tu proceso y te avisaremos si identificamos algo que pueda ayudarte.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {activeReferrals.map((referral) => {
              const config = typeConfig[referral.recommendedType]
              const Icon = config.icon
              const message = patientMessages[referral.recommendedType]

              return (
                <Card key={referral.id} className="overflow-hidden">
                  <div className={`bg-gradient-to-r ${config.bgGradient} p-6`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full bg-white p-2 shadow-sm`}>
                          <Icon className={`h-6 w-6 ${config.color}`} />
                        </div>
                        <div>
                          <Badge variant="secondary" className="mb-1">
                            {referral.urgencyLevel === 'high' || referral.urgencyLevel === 'critical' 
                              ? 'Recomendado' 
                              : 'Sugerencia'}
                          </Badge>
                          <h3 className="font-semibold text-lg">{message}</h3>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleDismiss(referral.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-6">
                      Evivvo encontró profesionales recomendados para esta etapa de tu proceso.
                    </p>

                    {/* Profesionales recomendados */}
                    <div className="space-y-3 mb-6">
                      {referral.evivvoRecommendations.map((rec, index) => (
                        <div 
                          key={rec.professionalId}
                          className="flex items-center gap-4 p-4 border rounded-xl hover:bg-muted/50 transition-colors"
                        >
                          <div className="relative">
                            <Image
                              src={rec.professionalImage}
                              alt={rec.professionalName}
                              width={56}
                              height={56}
                              className="rounded-full object-cover"
                            />
                            {rec.availableNow && (
                              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{rec.professionalName}</p>
                              {index === 0 && (
                                <Badge className="bg-primary/10 text-primary text-xs">
                                  Mejor match
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                {rec.rating}
                              </span>
                              <span>{rec.reviews} opiniones</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <Clock className="h-3 w-3" />
                              {rec.availableNow ? (
                                <span className="text-emerald-600 font-medium">Disponible ahora</span>
                              ) : (
                                <span>{rec.nextAvailable}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${rec.price.toLocaleString('es-AR')}</p>
                            <p className="text-xs text-muted-foreground">por sesión</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      ))}
                    </div>

                    {/* Match reasons */}
                    <div className="bg-muted/50 rounded-lg p-4 mb-6">
                      <p className="text-sm font-medium mb-2">Por qué Evivvo los recomienda:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {referral.evivvoRecommendations[0]?.matchReasons.map((reason, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-emerald-500" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleDismiss(referral.id)}
                      >
                        Ahora no
                      </Button>
                      <Link href="/profesionales" className="flex-1">
                        <Button className="w-full gap-2">
                          <Calendar className="h-4 w-4" />
                          Ver profesionales
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Info */}
        <Card className="mt-8 border-muted">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground text-center">
              Estas recomendaciones son generadas por el sistema inteligente de Evivvo basándose en tu 
              evolución emocional. Podés aceptarlas, ignorarlas o consultarnos si tenés dudas.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
