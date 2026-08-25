"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Clock, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Calendar,
  Pill,
  User,
  RefreshCw,
  Eye,
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { prescriptions } from "@/src/data/prescriptions"
import type { Prescription, PrescriptionStatus } from "@/src/types/prescription"

// Mock: filtrar por paciente actual
const patientPrescriptions = prescriptions.filter(p => p.patientId === 'patient-001')

const statusConfig: Record<PrescriptionStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  activa: { label: 'Activa', color: 'bg-emerald-500', icon: CheckCircle },
  vencida: { label: 'Vencida', color: 'bg-slate-400', icon: Clock },
  suspendida: { label: 'Suspendida', color: 'bg-red-500', icon: XCircle },
  renovada: { label: 'Renovada', color: 'bg-blue-500', icon: RefreshCw },
}

export default function PatientPrescriptionsPage() {
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  
  const activePrescriptions = patientPrescriptions.filter(p => p.status === 'activa')
  const historyPrescriptions = patientPrescriptions.filter(p => p.status !== 'activa')

  const handleDownloadPDF = (prescription: Prescription) => {
    // Mock: en producción generaría PDF real
    alert(`Descargando receta ${prescription.id}...`)
  }

  const handleRequestReview = () => {
    setShowReviewDialog(true)
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
              <h1 className="text-xl font-bold">Mis Recetas Médicas</h1>
              <p className="text-sm text-muted-foreground">Gestiona tus tratamientos farmacológicos</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="border-emerald-200 bg-emerald-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-emerald-500 p-3">
                  <Pill className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-700">{activePrescriptions.length}</p>
                  <p className="text-sm text-emerald-600">Recetas activas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activePrescriptions[0]?.nextFollowUp ? new Date(activePrescriptions[0].nextFollowUp).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }) : '-'}</p>
                  <p className="text-sm text-muted-foreground">Próximo control</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-slate-100 p-3">
                  <FileText className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{patientPrescriptions.length}</p>
                  <p className="text-sm text-muted-foreground">Total histórico</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="active" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Recetas Activas
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="h-4 w-4" />
              Historial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activePrescriptions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Sin recetas activas</h3>
                  <p className="text-muted-foreground">No tenés recetas médicas activas en este momento.</p>
                </CardContent>
              </Card>
            ) : (
              activePrescriptions.map((prescription) => (
                <PrescriptionCard
                  key={prescription.id}
                  prescription={prescription}
                  onView={() => setSelectedPrescription(prescription)}
                  onDownload={() => handleDownloadPDF(prescription)}
                  onRequestReview={handleRequestReview}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {historyPrescriptions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Sin historial</h3>
                  <p className="text-muted-foreground">No hay recetas anteriores en tu historial.</p>
                </CardContent>
              </Card>
            ) : (
              historyPrescriptions.map((prescription) => (
                <PrescriptionCard
                  key={prescription.id}
                  prescription={prescription}
                  onView={() => setSelectedPrescription(prescription)}
                  onDownload={() => handleDownloadPDF(prescription)}
                  isHistory
                />
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Disclaimer */}
        <Card className="mt-8 border-amber-200 bg-amber-50/50">
          <CardContent className="py-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Información importante</p>
                <p>Las recetas médicas mostradas son emitidas por profesionales matriculados. Ante cualquier duda sobre tu tratamiento, consultá directamente con tu psiquiatra. Evivvo actúa únicamente como plataforma tecnológica.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Detail Dialog */}
      <Dialog open={!!selectedPrescription} onOpenChange={() => setSelectedPrescription(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedPrescription && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Receta Médica
                  </DialogTitle>
                  <Badge className={statusConfig[selectedPrescription.status].color}>
                    {statusConfig[selectedPrescription.status].label}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Profesional */}
                <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                  <div className="rounded-full bg-red-500 p-2">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedPrescription.psychiatristName}</p>
                    <p className="text-sm text-muted-foreground">Médico Psiquiatra - {selectedPrescription.psychiatristLicense}</p>
                  </div>
                  <Badge variant="outline" className="ml-auto border-red-300 text-red-700">
                    Psiquiatría
                  </Badge>
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Fecha de emisión</p>
                    <p className="font-semibold">{new Date(selectedPrescription.issueDate).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Válida hasta</p>
                    <p className="font-semibold">{new Date(selectedPrescription.expirationDate).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>

                {/* Diagnóstico */}
                <div>
                  <h4 className="font-semibold mb-2">Diagnóstico</h4>
                  <p className="text-muted-foreground">{selectedPrescription.diagnosis}</p>
                </div>

                {/* Medicamentos */}
                <div>
                  <h4 className="font-semibold mb-3">Medicamentos</h4>
                  <div className="space-y-3">
                    {selectedPrescription.medications.map((med) => (
                      <div key={med.id} className="p-4 border rounded-xl bg-background">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Pill className="h-4 w-4 text-primary" />
                            <span className="font-semibold">{med.name}</span>
                          </div>
                          <Badge variant="secondary">{med.dosage}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <p>Frecuencia: {med.frequency}</p>
                          <p>Duración: {med.duration}</p>
                        </div>
                        {med.instructions && (
                          <p className="mt-2 text-sm italic text-muted-foreground">{med.instructions}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Indicaciones */}
                <div>
                  <h4 className="font-semibold mb-2">Indicaciones generales</h4>
                  <p className="text-muted-foreground">{selectedPrescription.generalIndications}</p>
                </div>

                {/* Observaciones */}
                {selectedPrescription.observations && (
                  <div>
                    <h4 className="font-semibold mb-2">Observaciones</h4>
                    <p className="text-muted-foreground">{selectedPrescription.observations}</p>
                  </div>
                )}

                {/* Próximo seguimiento */}
                {selectedPrescription.nextFollowUp && (
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-primary">Próximo control</span>
                    </div>
                    <p className="text-muted-foreground">
                      {new Date(selectedPrescription.nextFollowUp).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    {selectedPrescription.followUpNotes && (
                      <p className="text-sm text-muted-foreground mt-1">{selectedPrescription.followUpNotes}</p>
                    )}
                  </div>
                )}

                {/* Suspendida */}
                {selectedPrescription.status === 'suspendida' && selectedPrescription.suspendedReason && (
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="font-semibold text-red-700">Motivo de suspensión</span>
                    </div>
                    <p className="text-red-700">{selectedPrescription.suspendedReason}</p>
                  </div>
                )}

                {/* Botones */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button onClick={() => handleDownloadPDF(selectedPrescription)} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </Button>
                  {selectedPrescription.status === 'activa' && (
                    <Button variant="outline" onClick={handleRequestReview}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Solicitar revisión
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Request Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar revisión de receta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Tu solicitud será enviada al psiquiatra que emitió la receta. Describí brevemente el motivo de la revisión.
            </p>
            <textarea
              className="w-full p-3 border rounded-lg resize-none"
              rows={4}
              placeholder="Ej: Estoy experimentando efectos secundarios..."
            />
            <div className="flex gap-3">
              <Button onClick={() => setShowReviewDialog(false)} variant="outline" className="flex-1">
                Cancelar
              </Button>
              <Button 
                onClick={() => {
                  alert('Solicitud enviada correctamente')
                  setShowReviewDialog(false)
                }}
                className="flex-1"
              >
                Enviar solicitud
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente de tarjeta de receta
function PrescriptionCard({
  prescription,
  onView,
  onDownload,
  onRequestReview,
  isHistory = false,
}: {
  prescription: Prescription
  onView: () => void
  onDownload: () => void
  onRequestReview?: () => void
  isHistory?: boolean
}) {
  const status = statusConfig[prescription.status]
  const StatusIcon = status.icon

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Badge lateral */}
          <div className={`${status.color} text-white p-4 md:w-48 flex flex-col justify-center items-center text-center`}>
            <StatusIcon className="h-8 w-8 mb-2" />
            <p className="font-semibold">{status.label}</p>
            <p className="text-xs opacity-90">
              {prescription.status === 'activa' 
                ? `Vence ${new Date(prescription.expirationDate).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}`
                : new Date(prescription.issueDate).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
              }
            </p>
          </div>

          {/* Contenido */}
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="border-red-300 text-red-700 text-xs">
                    Psiquiatría
                  </Badge>
                </div>
                <p className="font-semibold">{prescription.psychiatristName}</p>
                <p className="text-sm text-muted-foreground">{prescription.psychiatristLicense}</p>
              </div>
            </div>

            {/* Medicamentos */}
            <div className="flex flex-wrap gap-2 mb-3">
              {prescription.medications.map((med) => (
                <Badge key={med.id} variant="secondary" className="gap-1">
                  <Pill className="h-3 w-3" />
                  {med.name} {med.dosage}
                </Badge>
              ))}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {prescription.diagnosis}
            </p>

            {/* Acciones */}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={onView}>
                <Eye className="h-4 w-4 mr-1" />
                Ver receta
              </Button>
              <Button size="sm" variant="outline" onClick={onDownload}>
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
              {!isHistory && onRequestReview && (
                <Button size="sm" variant="ghost" onClick={onRequestReview}>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Revisión
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
