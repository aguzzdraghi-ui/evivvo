"use client"

import { useState, useMemo } from "react"
import { 
  Video, 
  Search, 
  Eye,
  Check,
  X,
  Calendar,
  Clock,
  DollarSign,
  MoreHorizontal,
  MessageSquare,
  User,
  UserCog
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { useEvivvoStore } from "@/src/lib/store"

interface Session {
  id: string
  pacienteNombre: string
  pacienteEmail: string
  profesionalNombre: string
  profesionalId: string
  tipoSesion: "videollamada" | "chat"
  fecha: string
  hora: string
  duracion: number
  modalidad: "programada" | "inmediata"
  estado: "programada" | "en_curso" | "completada" | "cancelada" | "modificada" | "no_asistio_paciente" | "no_asistio_profesional"
  precio: number
  comisionEvivvo: number
}

const estadoLabels: Record<string, string> = {
  programada: "Programada",
  en_curso: "En curso",
  completada: "Completada",
  cancelada: "Cancelada",
  modificada: "Modificada",
  no_asistio_paciente: "No asistió paciente",
  no_asistio_profesional: "No asistió profesional",
}

const estadoColors: Record<string, string> = {
  programada: "bg-blue-100 text-blue-700",
  en_curso: "bg-amber-100 text-amber-700",
  completada: "bg-emerald-100 text-emerald-700",
  cancelada: "bg-red-100 text-red-700",
  modificada: "bg-purple-100 text-purple-700",
  no_asistio_paciente: "bg-orange-100 text-orange-700",
  no_asistio_profesional: "bg-rose-100 text-rose-700",
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(price)
}

// Datos mock iniciales
const initialSessions: Session[] = [
  {
    id: "ses-001",
    pacienteNombre: "Juan Pérez",
    pacienteEmail: "juan.perez@email.com",
    profesionalNombre: "Lic. Ana Rodríguez",
    profesionalId: "1",
    tipoSesion: "videollamada",
    fecha: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    hora: "10:00",
    duracion: 45,
    modalidad: "programada",
    estado: "programada",
    precio: 16500,
    comisionEvivvo: 2310,
  },
  {
    id: "ses-002",
    pacienteNombre: "María García",
    pacienteEmail: "maria.garcia@email.com",
    profesionalNombre: "Dr. Carlos López",
    profesionalId: "2",
    tipoSesion: "videollamada",
    fecha: new Date().toISOString().split("T")[0],
    hora: "15:30",
    duracion: 50,
    modalidad: "inmediata",
    estado: "en_curso",
    precio: 20000,
    comisionEvivvo: 1400,
  },
  {
    id: "ses-003",
    pacienteNombre: "Roberto Díaz",
    pacienteEmail: "roberto.diaz@email.com",
    profesionalNombre: "Coach Laura Fernández",
    profesionalId: "3",
    tipoSesion: "chat",
    fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    hora: "11:00",
    duracion: 30,
    modalidad: "programada",
    estado: "completada",
    precio: 12000,
    comisionEvivvo: 1680,
  },
  {
    id: "ses-004",
    pacienteNombre: "Sofía Martínez",
    pacienteEmail: "sofia.martinez@email.com",
    profesionalNombre: "Lic. Ana Rodríguez",
    profesionalId: "1",
    tipoSesion: "videollamada",
    fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    hora: "09:00",
    duracion: 45,
    modalidad: "programada",
    estado: "cancelada",
    precio: 16500,
    comisionEvivvo: 0,
  },
  {
    id: "ses-005",
    pacienteNombre: "Pablo González",
    pacienteEmail: "pablo.gonzalez@email.com",
    profesionalNombre: "Dr. Carlos López",
    profesionalId: "2",
    tipoSesion: "videollamada",
    fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    hora: "16:00",
    duracion: 50,
    modalidad: "programada",
    estado: "no_asistio_paciente",
    precio: 20000,
    comisionEvivvo: 2800,
  },
]

export default function AdminSesionesPage() {
  // Usar store centralizado
  const storeSessions = useEvivvoStore(state => state.getSessions())
  const getProfessionalById = useEvivvoStore(state => state.getProfessionalById)
  const patients = useEvivvoStore(state => state.getPatients())
  const updateSession = useEvivvoStore(state => state.updateSession)
  
  const [filtroEstado, setFiltroEstado] = useState<string>("todas")
  const [busqueda, setBusqueda] = useState("")
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Combinar sesiones del store con las mock iniciales
  const sessions = useMemo(() => {
    const fromStore = storeSessions.map(s => {
      const prof = getProfessionalById(s.profesionalId)
      const patient = patients.find(p => p.id === s.pacienteId)
      return {
        id: s.id,
        pacienteNombre: patient ? `${patient.nombre} ${patient.apellido}` : 'Paciente',
        pacienteEmail: patient?.email || 'sin email',
        profesionalNombre: prof ? `${prof.nombre} ${prof.apellido}` : 'Profesional',
        profesionalId: s.profesionalId,
        tipoSesion: s.modalidad as 'videollamada' | 'chat',
        fecha: s.fecha,
        hora: s.hora,
        duracion: s.duracion,
        modalidad: 'programada' as const,
        estado: s.estado === 'confirmada' ? 'programada' as const 
          : s.estado === 'completada' ? 'completada' as const
          : s.estado === 'cancelada' ? 'cancelada' as const
          : s.estado === 'en_curso' ? 'en_curso' as const
          : 'programada' as const,
        precio: s.precio,
        comisionEvivvo: Math.round(s.precio * 0.15),
      } as Session
    })
    
    // Si no hay sesiones del store, usar las mock iniciales
    if (fromStore.length === 0) {
      return initialSessions
    }
    return fromStore
  }, [storeSessions, getProfessionalById, patients])

  const handleMarcarCompletada = (id: string) => {
    updateSession(id, { estado: 'completada' })
    setShowDetailModal(false)
  }

  const handleCancelar = (id: string) => {
    updateSession(id, { estado: 'cancelada' })
    setShowDetailModal(false)
  }

  const filteredSessions = sessions.filter(session => {
    const matchEstado = filtroEstado === "todas" || session.estado === filtroEstado
    const matchBusqueda = busqueda === "" || 
      `${session.pacienteNombre} ${session.profesionalNombre} ${session.id}`.toLowerCase().includes(busqueda.toLowerCase())
    return matchEstado && matchBusqueda
  })

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00")
    return date.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" })
  }

  // Stats
  const totalIngresos = sessions.filter(s => s.estado === "completada").reduce((acc, s) => acc + s.precio, 0)
  const totalComisiones = sessions.filter(s => s.estado === "completada").reduce((acc, s) => acc + s.comisionEvivvo, 0)

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          Gestión de Sesiones
        </h1>
        <p className="text-muted-foreground">
          Administra todas las sesiones de la plataforma
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-background p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Video className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{sessions.length}</p>
              <p className="text-sm text-muted-foreground">Total sesiones</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <Check className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{sessions.filter(s => s.estado === "completada").length}</p>
              <p className="text-sm text-muted-foreground">Completadas</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatPrice(totalIngresos)}</p>
              <p className="text-sm text-muted-foreground">Ingresos totales</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <DollarSign className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatPrice(totalComisiones)}</p>
              <p className="text-sm text-muted-foreground">Comisiones Evivvo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, paciente o profesional..."
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
          <option value="todas">Todos los estados</option>
          <option value="programada">Programadas</option>
          <option value="en_curso">En curso</option>
          <option value="completada">Completadas</option>
          <option value="cancelada">Canceladas</option>
          <option value="modificada">Modificadas</option>
          <option value="no_asistio_paciente">No asistió paciente</option>
          <option value="no_asistio_profesional">No asistió profesional</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Paciente</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Profesional</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Fecha/Hora</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tipo</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Precio</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Comisión</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <Video className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 font-medium text-foreground">No hay sesiones</p>
                    <p className="text-sm text-muted-foreground">
                      No se encontraron sesiones con los filtros aplicados
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-muted/30">
                    <td className="px-4 py-4">
                      <span className="font-mono text-sm">{session.id}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{session.pacienteNombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <UserCog className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{session.profesionalNombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(session.fecha)}</span>
                        <span className="text-sm text-muted-foreground">{session.hora}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        {session.tipoSesion === "videollamada" ? (
                          <Video className="h-4 w-4 text-primary" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-primary" />
                        )}
                        <span className="text-sm capitalize">{session.tipoSesion}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={estadoColors[session.estado]}>
                        {estadoLabels[session.estado]}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-sm font-medium">{formatPrice(session.precio)}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-sm text-emerald-600">+{formatPrice(session.comisionEvivvo)}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedSession(session); setShowDetailModal(true) }}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalle
                          </DropdownMenuItem>
                          {(session.estado === "programada" || session.estado === "en_curso") && (
                            <>
                              <DropdownMenuItem onClick={() => handleMarcarCompletada(session.id)}>
                                <Check className="mr-2 h-4 w-4 text-emerald-600" />
                                Marcar completada
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleCancelar(session.id)} className="text-red-600">
                                <X className="mr-2 h-4 w-4" />
                                Cancelar
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle de Sesión</DialogTitle>
            <DialogDescription>
              Información completa de la sesión
            </DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-muted-foreground">{selectedSession.id}</span>
                <Badge className={estadoColors[selectedSession.estado]}>
                  {estadoLabels[selectedSession.estado]}
                </Badge>
              </div>
              
              <div className="grid gap-3 rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Paciente</span>
                  <span className="text-sm font-medium">{selectedSession.pacienteNombre}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email paciente</span>
                  <span className="text-sm">{selectedSession.pacienteEmail}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Profesional</span>
                  <span className="text-sm font-medium">{selectedSession.profesionalNombre}</span>
                </div>
                <hr className="border-border" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fecha</span>
                  <span className="text-sm">{formatDate(selectedSession.fecha)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Hora</span>
                  <span className="text-sm">{selectedSession.hora} hs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duración</span>
                  <span className="text-sm">{selectedSession.duracion} minutos</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Modalidad</span>
                  <span className="text-sm capitalize">{selectedSession.modalidad}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tipo</span>
                  <div className="flex items-center gap-1">
                    {selectedSession.tipoSesion === "videollamada" ? (
                      <Video className="h-4 w-4 text-primary" />
                    ) : (
                      <MessageSquare className="h-4 w-4 text-primary" />
                    )}
                    <span className="text-sm capitalize">{selectedSession.tipoSesion}</span>
                  </div>
                </div>
                <hr className="border-border" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Precio</span>
                  <span className="text-sm font-medium">{formatPrice(selectedSession.precio)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Comisión Evivvo</span>
                  <span className="text-sm font-medium text-emerald-600">+{formatPrice(selectedSession.comisionEvivvo)}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            {selectedSession && (selectedSession.estado === "programada" || selectedSession.estado === "en_curso") && (
              <>
                <Button variant="outline" onClick={() => handleCancelar(selectedSession.id)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button onClick={() => handleMarcarCompletada(selectedSession.id)}>
                  <Check className="mr-2 h-4 w-4" />
                  Marcar completada
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
