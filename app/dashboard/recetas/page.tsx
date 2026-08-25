"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Search,
  Filter,
  Pill,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { prescriptions, psychiatristPatients, getPrescriptionsByPsychiatrist } from "@/src/data/prescriptions"
import { commonMedications, frequencyOptions, durationOptions } from "@/src/types/prescription"
import type { Prescription, PrescriptionStatus, Medication } from "@/src/types/prescription"

// Mock: recetas del psiquiatra actual
const myPrescriptions = prescriptions

export default function PsychiatristPrescriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewPrescription, setShowNewPrescription] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [showSuspendDialog, setShowSuspendDialog] = useState(false)
  const [prescriptionToSuspend, setPrescriptionToSuspend] = useState<Prescription | null>(null)
  
  // Formulario nueva receta
  const [newPrescription, setNewPrescription] = useState({
    patientId: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }] as Omit<Medication, 'id'>[],
    diagnosis: '',
    generalIndications: '',
    observations: '',
    treatmentDuration: '',
    nextFollowUp: '',
  })

  const activePrescriptions = myPrescriptions.filter(p => p.status === 'activa')
  const filteredPrescriptions = myPrescriptions.filter(p => 
    p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.medications.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleAddMedication = () => {
    setNewPrescription(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    }))
  }

  const handleRemoveMedication = (index: number) => {
    setNewPrescription(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }))
  }

  const handleMedicationChange = (index: number, field: keyof Omit<Medication, 'id'>, value: string) => {
    setNewPrescription(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }))
  }

  const handleCreatePrescription = () => {
    // Mock: crear receta
    alert('Receta creada correctamente')
    setShowNewPrescription(false)
    setNewPrescription({
      patientId: '',
      medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
      diagnosis: '',
      generalIndications: '',
      observations: '',
      treatmentDuration: '',
      nextFollowUp: '',
    })
  }

  const handleSuspendPrescription = (reason: string) => {
    if (prescriptionToSuspend) {
      alert(`Receta ${prescriptionToSuspend.id} suspendida. Motivo: ${reason}`)
      setShowSuspendDialog(false)
      setPrescriptionToSuspend(null)
    }
  }

  const handleRenewPrescription = (prescription: Prescription) => {
    setNewPrescription({
      patientId: prescription.patientId,
      medications: prescription.medications.map(m => ({
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration,
        instructions: m.instructions,
      })),
      diagnosis: prescription.diagnosis,
      generalIndications: prescription.generalIndications,
      observations: '',
      treatmentDuration: prescription.treatmentDuration,
      nextFollowUp: '',
    })
    setShowNewPrescription(true)
  }

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
                <h1 className="text-xl font-bold">Recetas Médicas</h1>
                <p className="text-sm text-muted-foreground">Gestión de prescripciones</p>
              </div>
            </div>
            <Button onClick={() => setShowNewPrescription(true)} className="gap-2 bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4" />
              Nueva Receta
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Advertencia legal */}
        <Card className="mb-6 border-amber-200 bg-amber-50/50">
          <CardContent className="py-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Aviso importante para profesionales</p>
                <p>Las recetas médicas deben emitirse conforme a las normativas legales y profesionales aplicables. Evivvo actúa únicamente como plataforma tecnológica y no asume responsabilidad sobre las prescripciones realizadas.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-emerald-100 p-3">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activePrescriptions.length}</p>
                  <p className="text-sm text-muted-foreground">Activas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-slate-100 p-3">
                  <Clock className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{myPrescriptions.filter(p => p.status === 'vencida').length}</p>
                  <p className="text-sm text-muted-foreground">Vencidas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-red-100 p-3">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{myPrescriptions.filter(p => p.status === 'suspendida').length}</p>
                  <p className="text-sm text-muted-foreground">Suspendidas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{psychiatristPatients.length}</p>
                  <p className="text-sm text-muted-foreground">Pacientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por paciente o medicamento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lista de recetas */}
        <div className="space-y-4">
          {filteredPrescriptions.map((prescription) => (
            <PrescriptionRow
              key={prescription.id}
              prescription={prescription}
              onView={() => setSelectedPrescription(prescription)}
              onRenew={() => handleRenewPrescription(prescription)}
              onSuspend={() => {
                setPrescriptionToSuspend(prescription)
                setShowSuspendDialog(true)
              }}
            />
          ))}
        </div>
      </main>

      {/* New Prescription Dialog */}
      <Dialog open={showNewPrescription} onOpenChange={setShowNewPrescription}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Nueva Receta Médica
            </DialogTitle>
            <DialogDescription>
              Complete todos los campos requeridos para emitir la receta.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Paciente */}
            <div>
              <Label>Paciente *</Label>
              <Select
                value={newPrescription.patientId}
                onValueChange={(value) => setNewPrescription(prev => ({ ...prev, patientId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {psychiatristPatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} - {patient.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Diagnóstico */}
            <div>
              <Label>Diagnóstico (CIE-10) *</Label>
              <Input
                value={newPrescription.diagnosis}
                onChange={(e) => setNewPrescription(prev => ({ ...prev, diagnosis: e.target.value }))}
                placeholder="Ej: Trastorno de ansiedad generalizada (F41.1)"
              />
            </div>

            {/* Medicamentos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Medicamentos *</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddMedication}>
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
              <div className="space-y-4">
                {newPrescription.medications.map((med, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium">Medicamento {index + 1}</span>
                      {newPrescription.medications.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMedication(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <Label className="text-xs">Nombre</Label>
                        <Select
                          value={med.name}
                          onValueChange={(value) => handleMedicationChange(index, 'name', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {commonMedications.map((m) => (
                              <SelectItem key={m.name} value={m.name}>{m.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Dosis</Label>
                        <Select
                          value={med.dosage}
                          onValueChange={(value) => handleMedicationChange(index, 'dosage', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {commonMedications.find(m => m.name === med.name)?.dosages.map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            )) || (
                              <SelectItem value="">Primero seleccione medicamento</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Frecuencia</Label>
                        <Select
                          value={med.frequency}
                          onValueChange={(value) => handleMedicationChange(index, 'frequency', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {frequencyOptions.map((f) => (
                              <SelectItem key={f} value={f}>{f}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Duración</Label>
                        <Select
                          value={med.duration}
                          onValueChange={(value) => handleMedicationChange(index, 'duration', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {durationOptions.map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-xs">Instrucciones especiales</Label>
                        <Input
                          value={med.instructions}
                          onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                          placeholder="Ej: Tomar con alimentos"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Indicaciones generales */}
            <div>
              <Label>Indicaciones generales *</Label>
              <Textarea
                value={newPrescription.generalIndications}
                onChange={(e) => setNewPrescription(prev => ({ ...prev, generalIndications: e.target.value }))}
                placeholder="Indicaciones de estilo de vida, cuidados, etc."
                rows={3}
              />
            </div>

            {/* Observaciones */}
            <div>
              <Label>Observaciones (opcional)</Label>
              <Textarea
                value={newPrescription.observations}
                onChange={(e) => setNewPrescription(prev => ({ ...prev, observations: e.target.value }))}
                placeholder="Notas adicionales para seguimiento"
                rows={2}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Duración tratamiento */}
              <div>
                <Label>Duración del tratamiento *</Label>
                <Select
                  value={newPrescription.treatmentDuration}
                  onValueChange={(value) => setNewPrescription(prev => ({ ...prev, treatmentDuration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 mes">1 mes</SelectItem>
                    <SelectItem value="2 meses">2 meses</SelectItem>
                    <SelectItem value="3 meses">3 meses</SelectItem>
                    <SelectItem value="6 meses">6 meses</SelectItem>
                    <SelectItem value="Indefinido">Indefinido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Próximo seguimiento */}
              <div>
                <Label>Próximo seguimiento</Label>
                <Input
                  type="date"
                  value={newPrescription.nextFollowUp}
                  onChange={(e) => setNewPrescription(prev => ({ ...prev, nextFollowUp: e.target.value }))}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowNewPrescription(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleCreatePrescription} className="flex-1 bg-red-600 hover:bg-red-700">
                <FileText className="h-4 w-4 mr-2" />
                Emitir Receta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Suspend Dialog */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspender Receta</DialogTitle>
            <DialogDescription>
              Indique el motivo de la suspensión. Esta acción quedará registrada en el historial.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Motivo de suspensión (obligatorio)..."
              rows={3}
              id="suspend-reason"
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowSuspendDialog(false)} className="flex-1">
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  const reason = (document.getElementById('suspend-reason') as HTMLTextAreaElement)?.value
                  if (reason) handleSuspendPrescription(reason)
                }}
                className="flex-1"
              >
                Confirmar Suspensión
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Row component
function PrescriptionRow({
  prescription,
  onView,
  onRenew,
  onSuspend,
}: {
  prescription: Prescription
  onView: () => void
  onRenew: () => void
  onSuspend: () => void
}) {
  const statusColors: Record<PrescriptionStatus, string> = {
    activa: 'bg-emerald-100 text-emerald-700',
    vencida: 'bg-slate-100 text-slate-700',
    suspendida: 'bg-red-100 text-red-700',
    renovada: 'bg-blue-100 text-blue-700',
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-red-100 p-2">
              <FileText className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{prescription.patientName}</p>
                <Badge className={statusColors[prescription.status]}>
                  {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(prescription.issueDate).toLocaleDateString('es-AR')}
                </span>
                <span className="flex items-center gap-1">
                  <Pill className="h-3 w-3" />
                  {prescription.medications.map(m => m.name).join(', ')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onView}>
              <Eye className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onView}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver detalle
                </DropdownMenuItem>
                {prescription.status === 'activa' && (
                  <>
                    <DropdownMenuItem onClick={onRenew}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Renovar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onSuspend} className="text-red-600">
                      <XCircle className="h-4 w-4 mr-2" />
                      Suspender
                    </DropdownMenuItem>
                  </>
                )}
                {prescription.status === 'vencida' && (
                  <DropdownMenuItem onClick={onRenew}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Renovar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
