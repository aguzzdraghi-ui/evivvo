"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  FileText,
  Search,
  Pill,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Eye,
  Download,
  AlertTriangle,
  History
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { prescriptions } from "@/src/data/prescriptions"
import type { Prescription, PrescriptionStatus } from "@/src/types/prescription"

const statusConfig: Record<PrescriptionStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  activa: { label: 'Activa', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  vencida: { label: 'Vencida', color: 'bg-slate-100 text-slate-700', icon: Clock },
  suspendida: { label: 'Suspendida', color: 'bg-red-100 text-red-700', icon: XCircle },
  renovada: { label: 'Renovada', color: 'bg-blue-100 text-blue-700', icon: RefreshCw },
}

// Generar logs de auditoría mock
const auditLogs = prescriptions.flatMap(p => 
  p.history.map(h => ({
    ...h,
    prescriptionId: p.id,
    patientName: p.patientName,
    psychiatristName: p.psychiatristName,
  }))
).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

export default function AdminPrescriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)

  const stats = {
    total: prescriptions.length,
    activas: prescriptions.filter(p => p.status === 'activa').length,
    vencidas: prescriptions.filter(p => p.status === 'vencida').length,
    suspendidas: prescriptions.filter(p => p.status === 'suspendida').length,
  }

  const filteredPrescriptions = prescriptions.filter(p => {
    const matchesSearch = 
      p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.psychiatristName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.medications.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "all" || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleExport = () => {
    alert('Exportando datos de recetas...')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Gestión de Recetas Médicas</h1>
                <p className="text-sm text-muted-foreground">Panel Evivvo Manager</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Advertencia */}
        <Card className="mb-6 border-amber-200 bg-amber-50/50">
          <CardContent className="py-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Información sensible</p>
                <p>Este panel contiene información médica protegida. El acceso y uso está sujeto a las normativas de protección de datos de salud aplicables.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total recetas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-100 p-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activas}</p>
                  <p className="text-xs text-muted-foreground">Activas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-slate-100 p-2">
                  <Clock className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.vencidas}</p>
                  <p className="text-xs text-muted-foreground">Vencidas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-red-100 p-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.suspendidas}</p>
                  <p className="text-xs text-muted-foreground">Suspendidas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="recetas" className="space-y-6">
          <TabsList>
            <TabsTrigger value="recetas" className="gap-2">
              <FileText className="h-4 w-4" />
              Recetas
            </TabsTrigger>
            <TabsTrigger value="auditoria" className="gap-2">
              <History className="h-4 w-4" />
              Auditoría
            </TabsTrigger>
          </TabsList>

          {/* Recetas Tab */}
          <TabsContent value="recetas" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por paciente, psiquiatra o medicamento..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="activa">Activa</SelectItem>
                      <SelectItem value="vencida">Vencida</SelectItem>
                      <SelectItem value="suspendida">Suspendida</SelectItem>
                      <SelectItem value="renovada">Renovada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card>
              <CardHeader>
                <CardTitle>Listado de recetas</CardTitle>
                <CardDescription>
                  {filteredPrescriptions.length} recetas encontradas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Fecha emisión</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Psiquiatra</TableHead>
                      <TableHead>Medicamentos</TableHead>
                      <TableHead>Vencimiento</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrescriptions.map((prescription) => {
                      const status = statusConfig[prescription.status]

                      return (
                        <TableRow key={prescription.id}>
                          <TableCell className="font-mono text-xs">{prescription.id}</TableCell>
                          <TableCell className="text-sm">
                            {new Date(prescription.issueDate).toLocaleDateString('es-AR')}
                          </TableCell>
                          <TableCell className="font-medium">{prescription.patientName}</TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{prescription.psychiatristName}</p>
                              <p className="text-xs text-muted-foreground">{prescription.psychiatristLicense}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {prescription.medications.map((med) => (
                                <Badge key={med.id} variant="secondary" className="text-xs">
                                  {med.name}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(prescription.expirationDate).toLocaleDateString('es-AR')}
                          </TableCell>
                          <TableCell>
                            <Badge className={status.color}>{status.label}</Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedPrescription(prescription)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Auditoría Tab */}
          <TabsContent value="auditoria" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Log de auditoría</CardTitle>
                <CardDescription>
                  Registro de todas las acciones sobre recetas médicas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha/Hora</TableHead>
                      <TableHead>Acción</TableHead>
                      <TableHead>Receta</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Realizado por</TableHead>
                      <TableHead>Detalles</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => {
                      const actionColors: Record<string, string> = {
                        created: 'bg-emerald-100 text-emerald-700',
                        modified: 'bg-blue-100 text-blue-700',
                        renewed: 'bg-primary/10 text-primary',
                        suspended: 'bg-red-100 text-red-700',
                        expired: 'bg-slate-100 text-slate-700',
                      }
                      const actionLabels: Record<string, string> = {
                        created: 'Creada',
                        modified: 'Modificada',
                        renewed: 'Renovada',
                        suspended: 'Suspendida',
                        expired: 'Vencida',
                      }

                      return (
                        <TableRow key={log.id}>
                          <TableCell className="text-sm">
                            {new Date(log.timestamp).toLocaleString('es-AR')}
                          </TableCell>
                          <TableCell>
                            <Badge className={actionColors[log.action]}>
                              {actionLabels[log.action]}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{log.prescriptionId}</TableCell>
                          <TableCell className="font-medium">{log.patientName}</TableCell>
                          <TableCell className="text-sm">{log.performedBy}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{log.details}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Detail Dialog */}
      <Dialog open={!!selectedPrescription} onOpenChange={() => setSelectedPrescription(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedPrescription && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Detalle de Receta
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">ID</p>
                    <p className="font-mono">{selectedPrescription.id}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <Badge className={statusConfig[selectedPrescription.status].color}>
                      {statusConfig[selectedPrescription.status].label}
                    </Badge>
                  </div>
                </div>

                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Psiquiatra emisor</p>
                  <p className="font-medium">{selectedPrescription.psychiatristName}</p>
                  <p className="text-sm">{selectedPrescription.psychiatristLicense}</p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Paciente</p>
                  <p className="font-medium">{selectedPrescription.patientName}</p>
                  <p className="text-sm">{selectedPrescription.patientEmail}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Diagnóstico</p>
                  <p className="text-sm">{selectedPrescription.diagnosis}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Medicamentos</p>
                  <div className="space-y-2">
                    {selectedPrescription.medications.map((med) => (
                      <div key={med.id} className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4 text-primary" />
                          <span className="font-medium">{med.name}</span>
                          <Badge variant="secondary">{med.dosage}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {med.frequency} - {med.duration}
                        </p>
                        {med.instructions && (
                          <p className="text-sm italic mt-1">{med.instructions}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Fecha emisión</p>
                    <p className="font-medium">{new Date(selectedPrescription.issueDate).toLocaleDateString('es-AR')}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Vencimiento</p>
                    <p className="font-medium">{new Date(selectedPrescription.expirationDate).toLocaleDateString('es-AR')}</p>
                  </div>
                </div>

                {selectedPrescription.suspendedReason && (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Motivo de suspensión</p>
                    <p className="text-sm">{selectedPrescription.suspendedReason}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium mb-2">Historial de cambios</p>
                  <div className="space-y-2">
                    {selectedPrescription.history.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between text-sm p-2 border rounded">
                        <span>{entry.details}</span>
                        <span className="text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleString('es-AR')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
