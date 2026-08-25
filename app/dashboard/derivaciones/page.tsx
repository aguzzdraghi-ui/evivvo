"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Users, 
  AlertTriangle,
  UserPlus,
  Brain,
  Heart,
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Send
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { referrals, getReferralsBySuggestingProfessional } from "@/src/data/referrals"
import { referralReasons, conflictOfInterestRules, type ReferralType, type ReferralReason } from "@/src/types/referral"
import { psychiatristPatients } from "@/src/data/prescriptions"

// Mock: derivaciones del profesional actual
const myReferrals = referrals.slice(0, 3)

const referralTypeConfig: Record<ReferralType, { label: string; icon: typeof Brain; color: string; description: string }> = {
  psychiatrist: { 
    label: 'Médico Psiquiatra', 
    icon: Brain, 
    color: 'text-red-600 bg-red-100',
    description: 'Para evaluación médica y posible tratamiento farmacológico'
  },
  psychologist: { 
    label: 'Psicólogo', 
    icon: Heart, 
    color: 'text-primary bg-primary/10',
    description: 'Para terapia y trabajo psicológico profundo'
  },
  coach: { 
    label: 'Coach', 
    icon: Sparkles, 
    color: 'text-emerald-600 bg-emerald-100',
    description: 'Para desarrollo personal y alcance de metas'
  },
}

export default function ProfessionalReferralsPage() {
  const [showNewReferral, setShowNewReferral] = useState(false)
  const [newReferral, setNewReferral] = useState({
    patientId: '',
    recommendedType: '' as ReferralType | '',
    reason: '' as ReferralReason | '',
    reasonDescription: '',
    emotionalContext: '',
    urgencyLevel: 'medium' as 'low' | 'medium' | 'high' | 'critical',
  })

  const handleSubmitReferral = () => {
    // Mock: crear derivación
    alert('Sugerencia de derivación registrada. Evivvo procesará y mostrará profesionales recomendados al paciente.')
    setShowNewReferral(false)
    setNewReferral({
      patientId: '',
      recommendedType: '',
      reason: '',
      reasonDescription: '',
      emotionalContext: '',
      urgencyLevel: 'medium',
    })
  }

  const pendingCount = myReferrals.filter(r => r.status === 'pending' || r.status === 'shown').length
  const acceptedCount = myReferrals.filter(r => r.status === 'accepted' || r.status === 'scheduled').length

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Derivaciones Internas</h1>
                <p className="text-sm text-muted-foreground">Sugerir apoyo adicional para pacientes</p>
              </div>
            </div>
            <Button onClick={() => setShowNewReferral(true)} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Sugerir Derivación
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Reglas de conflicto de interés */}
        <Card className="mb-6 border-amber-200 bg-amber-50/50">
          <CardContent className="py-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-2">Política de derivaciones de Evivvo</p>
                <ul className="space-y-1 list-disc list-inside">
                  {conflictOfInterestRules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-amber-100 p-3">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-emerald-100 p-3">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{acceptedCount}</p>
                  <p className="text-sm text-muted-foreground">Aceptadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{myReferrals.length}</p>
                  <p className="text-sm text-muted-foreground">Total sugeridas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de derivaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Mis sugerencias de derivación</CardTitle>
            <CardDescription>
              Historial de pacientes para los que sugeriste apoyo adicional
            </CardDescription>
          </CardHeader>
          <CardContent>
            {myReferrals.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No tenés sugerencias de derivación registradas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myReferrals.map((referral) => {
                  const typeConfig = referralTypeConfig[referral.recommendedType]
                  const TypeIcon = typeConfig.icon
                  const statusColors = {
                    pending: 'bg-amber-100 text-amber-700',
                    shown: 'bg-blue-100 text-blue-700',
                    accepted: 'bg-emerald-100 text-emerald-700',
                    scheduled: 'bg-emerald-100 text-emerald-700',
                    rejected: 'bg-red-100 text-red-700',
                    expired: 'bg-slate-100 text-slate-700',
                  }
                  const statusLabels = {
                    pending: 'Pendiente',
                    shown: 'Mostrada',
                    accepted: 'Aceptada',
                    scheduled: 'Agendada',
                    rejected: 'Rechazada',
                    expired: 'Expirada',
                  }

                  return (
                    <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`rounded-full p-2 ${typeConfig.color}`}>
                          <TypeIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{referral.patientName}</p>
                          <p className="text-sm text-muted-foreground">
                            Sugerido: {typeConfig.label} - {referralReasons[referral.reason].label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(referral.createdAt).toLocaleDateString('es-AR')}
                          </p>
                        </div>
                      </div>
                      <Badge className={statusColors[referral.status]}>
                        {statusLabels[referral.status]}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info card */}
        <Card className="mt-6 border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex gap-3">
              <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-primary mb-1">Sistema inteligente de Evivvo</p>
                <p className="text-muted-foreground">
                  Cuando sugerís una derivación, Evivvo analiza el perfil emocional del paciente y recomienda 
                  automáticamente profesionales compatibles. El paciente nunca ve quién sugirió la derivación, 
                  solo ve: &quot;Evivvo encontró profesionales recomendados para esta etapa.&quot;
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* New Referral Dialog */}
      <Dialog open={showNewReferral} onOpenChange={setShowNewReferral}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Sugerir Derivación
            </DialogTitle>
            <DialogDescription>
              Sugerí un tipo de apoyo adicional para tu paciente. Evivvo se encargará de recomendar profesionales.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Paciente */}
            <div>
              <Label>Paciente *</Label>
              <Select
                value={newReferral.patientId}
                onValueChange={(value) => setNewReferral(prev => ({ ...prev, patientId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {psychiatristPatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de profesional */}
            <div>
              <Label className="mb-3 block">Tipo de apoyo sugerido *</Label>
              <div className="grid gap-3">
                {(Object.entries(referralTypeConfig) as [ReferralType, typeof referralTypeConfig[ReferralType]][]).map(([type, config]) => {
                  const Icon = config.icon
                  return (
                    <div
                      key={type}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        newReferral.recommendedType === type 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:border-muted-foreground/50'
                      }`}
                      onClick={() => setNewReferral(prev => ({ ...prev, recommendedType: type }))}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-2 ${config.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{config.label}</p>
                          <p className="text-sm text-muted-foreground">{config.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Motivo */}
            <div>
              <Label>Motivo de la sugerencia *</Label>
              <Select
                value={newReferral.reason}
                onValueChange={(value) => setNewReferral(prev => ({ ...prev, reason: value as ReferralReason }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar motivo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(referralReasons).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Descripción */}
            <div>
              <Label>Descripción para Evivvo *</Label>
              <Textarea
                value={newReferral.reasonDescription}
                onChange={(e) => setNewReferral(prev => ({ ...prev, reasonDescription: e.target.value }))}
                placeholder="Describí brevemente por qué sugerís este apoyo adicional..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Esta información es solo para el sistema de Evivvo, el paciente no la verá.
              </p>
            </div>

            {/* Contexto emocional */}
            <div>
              <Label>Contexto emocional actual del paciente *</Label>
              <Textarea
                value={newReferral.emotionalContext}
                onChange={(e) => setNewReferral(prev => ({ ...prev, emotionalContext: e.target.value }))}
                placeholder="Estado emocional, preocupaciones principales, etc..."
                rows={3}
              />
            </div>

            {/* Urgencia */}
            <div>
              <Label className="mb-3 block">Nivel de urgencia</Label>
              <RadioGroup
                value={newReferral.urgencyLevel}
                onValueChange={(value) => setNewReferral(prev => ({ ...prev, urgencyLevel: value as typeof newReferral.urgencyLevel }))}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low" className="cursor-pointer">Baja</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="cursor-pointer">Media</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high" className="cursor-pointer">Alta</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="critical" id="critical" />
                  <Label htmlFor="critical" className="cursor-pointer text-red-600">Crítica</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Advertencia */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="py-3">
                <p className="text-sm text-muted-foreground">
                  Al enviar esta sugerencia, Evivvo procesará la información y recomendará profesionales 
                  al paciente sin revelar que vos sugeriste la derivación.
                </p>
              </CardContent>
            </Card>

            {/* Botones */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowNewReferral(false)} className="flex-1">
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmitReferral} 
                className="flex-1"
                disabled={!newReferral.patientId || !newReferral.recommendedType || !newReferral.reason}
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Sugerencia
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
