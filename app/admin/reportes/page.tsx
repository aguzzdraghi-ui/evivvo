"use client"

import { useState, useEffect } from "react"
import { 
  AlertTriangle, 
  Search, 
  Eye,
  Check,
  Moon,
  Trash2,
  Clock,
  User,
  UserCog,
  MessageSquare,
  Calendar,
  MoreHorizontal,
  Mail,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Report {
  id: string
  denuncianteNombre: string
  denuncianteEmail: string
  denuncianteTipo: "paciente" | "profesional"
  denunciadoNombre: string
  denunciadoEmail: string
  denunciadoTipo: "paciente" | "profesional"
  motivo: "conducta_inapropiada" | "contenido_sensible" | "contacto_externo" | "problema_tecnico" | "incumplimiento" | "otro"
  descripcion: string
  fecha: string
  estado: "pendiente" | "en_revision" | "resuelto" | "cerrado"
  gravedad: "baja" | "media" | "alta" | "critica"
  evidencia?: string
  resolucion?: string
}

const motivoLabels: Record<string, string> = {
  conducta_inapropiada: "Conducta inapropiada",
  contenido_sensible: "Contenido sensible",
  contacto_externo: "Intento de contacto fuera de Evivvo",
  problema_tecnico: "Problema técnico",
  incumplimiento: "Incumplimiento profesional",
  otro: "Otro",
}

const estadoLabels: Record<string, string> = {
  pendiente: "Pendiente",
  en_revision: "En revisión",
  resuelto: "Resuelto",
  cerrado: "Cerrado",
}

const estadoColors: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  en_revision: "bg-blue-100 text-blue-700",
  resuelto: "bg-emerald-100 text-emerald-700",
  cerrado: "bg-slate-100 text-slate-700",
}

const gravedadColors: Record<string, string> = {
  baja: "bg-slate-100 text-slate-700",
  media: "bg-amber-100 text-amber-700",
  alta: "bg-orange-100 text-orange-700",
  critica: "bg-red-100 text-red-700",
}

// Datos mock iniciales
const initialReports: Report[] = [
  {
    id: "rep-001",
    denuncianteNombre: "Juan Pérez",
    denuncianteEmail: "juan.perez@email.com",
    denuncianteTipo: "paciente",
    denunciadoNombre: "Dr. Carlos López",
    denunciadoEmail: "carlos.lopez@email.com",
    denunciadoTipo: "profesional",
    motivo: "conducta_inapropiada",
    descripcion: "El profesional tuvo un comportamiento poco profesional durante la sesión, haciendo comentarios fuera de lugar.",
    fecha: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    estado: "pendiente",
    gravedad: "alta",
  },
  {
    id: "rep-002",
    denuncianteNombre: "Lic. Ana Rodríguez",
    denuncianteEmail: "ana.rodriguez@email.com",
    denuncianteTipo: "profesional",
    denunciadoNombre: "María García",
    denunciadoEmail: "maria.garcia@email.com",
    denunciadoTipo: "paciente",
    motivo: "contacto_externo",
    descripcion: "La paciente intentó contactarme por WhatsApp personal después de la sesión.",
    fecha: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    estado: "pendiente",
    gravedad: "media",
  },
  {
    id: "rep-003",
    denuncianteNombre: "Roberto Díaz",
    denuncianteEmail: "roberto.diaz@email.com",
    denuncianteTipo: "paciente",
    denunciadoNombre: "Coach Laura Fernández",
    denunciadoEmail: "laura.fernandez@email.com",
    denunciadoTipo: "profesional",
    motivo: "incumplimiento",
    descripcion: "La profesional canceló la sesión sin previo aviso y no respondió a mis mensajes.",
    fecha: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    estado: "en_revision",
    gravedad: "media",
  },
  {
    id: "rep-004",
    denuncianteNombre: "Sofía Martínez",
    denuncianteEmail: "sofia.martinez@email.com",
    denuncianteTipo: "paciente",
    denunciadoNombre: "Sistema Evivvo",
    denunciadoEmail: "sistema@evivvo.app",
    denunciadoTipo: "paciente",
    motivo: "problema_tecnico",
    descripcion: "La videollamada se cortó varias veces durante la sesión.",
    fecha: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    estado: "resuelto",
    gravedad: "baja",
    resolucion: "Se identificó un problema de red del lado del usuario. Se le brindó asistencia técnica.",
  },
]

export default function AdminReportesPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [filtroEstado, setFiltroEstado] = useState<string>("todos")
  const [busqueda, setBusqueda] = useState("")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [suspendDays, setSuspendDays] = useState(3)
  const [showEmailModal, setShowEmailModal] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("evivvo_reports")
    if (saved) {
      setReports(JSON.parse(saved))
    } else {
      setReports(initialReports)
      localStorage.setItem("evivvo_reports", JSON.stringify(initialReports))
    }
  }, [])

  const saveReports = (reps: Report[]) => {
    setReports(reps)
    localStorage.setItem("evivvo_reports", JSON.stringify(reps))
  }

  const handleMarcarEnRevision = (id: string) => {
    const updated = reports.map(r => 
      r.id === id ? { ...r, estado: "en_revision" as const } : r
    )
    saveReports(updated)
  }

  const handleResolver = (id: string) => {
    const updated = reports.map(r => 
      r.id === id ? { ...r, estado: "resuelto" as const, resolucion: "Reporte revisado y resuelto por el equipo de administración." } : r
    )
    saveReports(updated)
    setShowDetailModal(false)
  }

  const handleCerrar = (id: string) => {
    const updated = reports.map(r => 
      r.id === id ? { ...r, estado: "cerrado" as const } : r
    )
    saveReports(updated)
    setShowDetailModal(false)
  }

  const handleSuspender = () => {
    if (!selectedReport) return
    
    const suspendidoHasta = new Date(Date.now() + suspendDays * 24 * 60 * 60 * 1000)
    
    // Guardar evento de suspensión
    const suspensiones = JSON.parse(localStorage.getItem("evivvo_suspensions") || "[]")
    suspensiones.push({
      id: crypto.randomUUID(),
      usuarioEmail: selectedReport.denunciadoEmail,
      usuarioNombre: selectedReport.denunciadoNombre,
      usuarioTipo: selectedReport.denunciadoTipo,
      motivo: motivoLabels[selectedReport.motivo],
      dias: suspendDays,
      fechaInicio: new Date().toISOString(),
      fechaFin: suspendidoHasta.toISOString(),
      reporteId: selectedReport.id,
    })
    localStorage.setItem("evivvo_suspensions", JSON.stringify(suspensiones))
    
    // Actualizar reporte
    const updated = reports.map(r => 
      r.id === selectedReport.id ? { ...r, estado: "resuelto" as const, resolucion: `Usuario suspendido por ${suspendDays} días.` } : r
    )
    saveReports(updated)
    
    setShowSuspendModal(false)
    setShowDetailModal(false)
    setShowEmailModal(true)
  }

  const filteredReports = reports.filter(report => {
    const matchEstado = filtroEstado === "todos" || report.estado === filtroEstado
    const matchBusqueda = busqueda === "" || 
      `${report.denuncianteNombre} ${report.denunciadoNombre} ${report.id}`.toLowerCase().includes(busqueda.toLowerCase())
    return matchEstado && matchBusqueda
  })

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (hours < 1) return "Hace menos de 1 hora"
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? "s" : ""}`
    if (days < 7) return `Hace ${days} día${days > 1 ? "s" : ""}`
    return date.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          Gestión de Reportes
        </h1>
        <p className="text-muted-foreground">
          Administra las denuncias y reportes de usuarios
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Pendientes", count: reports.filter(r => r.estado === "pendiente").length, color: "text-amber-600", icon: Clock },
          { label: "En revisión", count: reports.filter(r => r.estado === "en_revision").length, color: "text-blue-600", icon: Eye },
          { label: "Resueltos", count: reports.filter(r => r.estado === "resuelto").length, color: "text-emerald-600", icon: Check },
          { label: "Críticos", count: reports.filter(r => r.gravedad === "critica").length, color: "text-red-600", icon: AlertTriangle },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-background p-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID o usuario..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="en_revision">En revisión</option>
          <option value="resuelto">Resueltos</option>
          <option value="cerrado">Cerrados</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Denunciante</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Denunciado</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Motivo</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Gravedad</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Fecha</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 font-medium text-foreground">No hay reportes</p>
                    <p className="text-sm text-muted-foreground">
                      No se encontraron reportes con los filtros aplicados
                    </p>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-muted/30">
                    <td className="px-4 py-4">
                      <span className="font-mono text-sm">{report.id}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {report.denuncianteTipo === "paciente" ? (
                          <User className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <UserCog className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{report.denuncianteNombre}</p>
                          <p className="text-xs text-muted-foreground capitalize">{report.denuncianteTipo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {report.denunciadoTipo === "paciente" ? (
                          <User className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <UserCog className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{report.denunciadoNombre}</p>
                          <p className="text-xs text-muted-foreground capitalize">{report.denunciadoTipo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm">{motivoLabels[report.motivo]}</span>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={gravedadColors[report.gravedad]}>
                        {report.gravedad.charAt(0).toUpperCase() + report.gravedad.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={estadoColors[report.estado]}>
                        {estadoLabels[report.estado]}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-muted-foreground">{formatDate(report.fecha)}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedReport(report); setShowDetailModal(true) }}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalle
                          </DropdownMenuItem>
                          {report.estado === "pendiente" && (
                            <DropdownMenuItem onClick={() => handleMarcarEnRevision(report.id)}>
                              <Clock className="mr-2 h-4 w-4 text-blue-600" />
                              Marcar en revisión
                            </DropdownMenuItem>
                          )}
                          {(report.estado === "pendiente" || report.estado === "en_revision") && (
                            <>
                              <DropdownMenuItem onClick={() => handleResolver(report.id)}>
                                <Check className="mr-2 h-4 w-4 text-emerald-600" />
                                Resolver
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelectedReport(report); setShowSuspendModal(true) }}>
                                <Moon className="mr-2 h-4 w-4 text-purple-600" />
                                Mandar a dormir
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleCerrar(report.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Cerrar reporte
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle del Reporte</DialogTitle>
            <DialogDescription>
              Información completa del reporte #{selectedReport?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Badge className={gravedadColors[selectedReport.gravedad]}>
                  Gravedad: {selectedReport.gravedad.charAt(0).toUpperCase() + selectedReport.gravedad.slice(1)}
                </Badge>
                <Badge className={estadoColors[selectedReport.estado]}>
                  {estadoLabels[selectedReport.estado]}
                </Badge>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Denunciante */}
                <div className="rounded-lg border border-border p-4">
                  <h4 className="mb-3 font-medium text-foreground">Denunciante</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {selectedReport.denuncianteTipo === "paciente" ? (
                        <User className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <UserCog className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm">{selectedReport.denuncianteNombre}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedReport.denuncianteEmail}</span>
                    </div>
                    <Badge variant="outline" className="capitalize">{selectedReport.denuncianteTipo}</Badge>
                  </div>
                </div>

                {/* Denunciado */}
                <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
                  <h4 className="mb-3 font-medium text-foreground">Denunciado</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {selectedReport.denunciadoTipo === "paciente" ? (
                        <User className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <UserCog className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm">{selectedReport.denunciadoNombre}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedReport.denunciadoEmail}</span>
                    </div>
                    <Badge variant="outline" className="capitalize">{selectedReport.denunciadoTipo}</Badge>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border p-4">
                <h4 className="mb-2 font-medium text-foreground">Motivo: {motivoLabels[selectedReport.motivo]}</h4>
                <p className="text-sm text-muted-foreground">{selectedReport.descripcion}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Reportado: {formatDate(selectedReport.fecha)}</span>
              </div>

              {selectedReport.resolucion && (
                <div className="rounded-lg bg-emerald-50 p-4">
                  <h4 className="mb-2 font-medium text-emerald-700">Resolución</h4>
                  <p className="text-sm text-emerald-600">{selectedReport.resolucion}</p>
                </div>
              )}

              {/* Mock: Historial de conversaciones */}
              <div className="rounded-lg border border-border p-4">
                <h4 className="mb-3 font-medium text-foreground">Historial de conversaciones</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 mt-0.5" />
                    <p>Última sesión: hace 2 días</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 mt-0.5" />
                    <p>Total de sesiones entre ambos: 3</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            {selectedReport && (selectedReport.estado === "pendiente" || selectedReport.estado === "en_revision") && (
              <>
                <Button variant="outline" onClick={() => handleCerrar(selectedReport.id)}>
                  Cerrar reporte
                </Button>
                <Button variant="outline" onClick={() => setShowSuspendModal(true)}>
                  <Moon className="mr-2 h-4 w-4" />
                  Suspender usuario
                </Button>
                <Button onClick={() => handleResolver(selectedReport.id)}>
                  <Check className="mr-2 h-4 w-4" />
                  Resolver
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Modal */}
      <Dialog open={showSuspendModal} onOpenChange={setShowSuspendModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-purple-600" />
              Mandar a dormir
            </DialogTitle>
            <DialogDescription>
              Suspender temporalmente a {selectedReport?.denunciadoNombre}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Duración de la suspensión</label>
              <select
                value={suspendDays}
                onChange={(e) => setSuspendDays(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
                  <option key={d} value={d}>{d} día{d > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
            <div className="rounded-lg bg-purple-50 p-4">
              <p className="text-sm text-purple-700">
                Esta cuenta será suspendida temporalmente por <strong>{suspendDays} días</strong>.
              </p>
              <p className="mt-2 text-sm text-purple-600">
                El usuario recibirá una notificación por email con los detalles de la suspensión.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuspendModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSuspender} className="bg-purple-600 hover:bg-purple-700">
              <Moon className="mr-2 h-4 w-4" />
              Confirmar suspensión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Simulation Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Email enviado (simulación)
            </DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="rounded-lg border border-border bg-muted/30 p-4 font-mono text-sm">
              <p className="font-bold">Asunto: Notificación de suspensión temporal en Evivvo</p>
              <hr className="my-3 border-border" />
              <p>Estimado/a {selectedReport.denunciadoNombre},</p>
              <br />
              <p>Le informamos que su cuenta en Evivvo ha sido suspendida temporalmente.</p>
              <br />
              <p><strong>Motivo:</strong> {motivoLabels[selectedReport.motivo]}</p>
              <p><strong>Duración:</strong> {suspendDays} días</p>
              <p><strong>Fecha de inicio:</strong> {new Date().toLocaleDateString("es-AR")}</p>
              <p><strong>Fecha de finalización:</strong> {new Date(Date.now() + suspendDays * 24 * 60 * 60 * 1000).toLocaleDateString("es-AR")}</p>
              <br />
              <p>Durante este período, no podrá acceder a la plataforma ni realizar sesiones.</p>
              <br />
              <p>Si cree que esta suspensión fue un error, puede contactarnos en: info@evivvo.app</p>
              <br />
              <p>Atentamente,</p>
              <p>Equipo de Evivvo</p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowEmailModal(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
