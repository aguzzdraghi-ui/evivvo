"use client"

import { useState } from "react"
import { 
  UserCog, 
  Search, 
  Eye,
  Check,
  X,
  Moon,
  Trash2,
  RotateCcw,
  Mail,
  Phone,
  FileText,
  Calendar,
  MoreHorizontal,
  Star,
  DollarSign
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
import { useEvivvoStore, type Professional } from "@/src/lib/store"

const estadoLabels: Record<string, string> = {
  pendiente: "Pendiente",
  activo: "Activo",
  rechazado: "Rechazado",
  suspendido: "Suspendido",
  eliminado: "Eliminado",
}

const estadoColors: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  activo: "bg-emerald-100 text-emerald-700",
  rechazado: "bg-red-100 text-red-700",
  suspendido: "bg-purple-100 text-purple-700",
  eliminado: "bg-slate-100 text-slate-700",
}

const tipoProfesionalLabels: Record<string, string> = {
  psicologo: "Psicólogo/a",
  coach: "Coach",
  terapeuta: "Terapeuta",
  psiquiatra: "Psiquiatra",
}

export default function AdminProfesionalesPage() {
  // Acceder directamente al estado del store (no usar getters que crean nuevos arrays)
  const professionals = useEvivvoStore(state => state.professionals)
  const updateProfessional = useEvivvoStore(state => state.updateProfessional)
  const approveProfessional = useEvivvoStore(state => state.approveProfessional)
  const suspendProfessional = useEvivvoStore(state => state.suspendProfessional)
  const rejectProfessional = useEvivvoStore(state => state.rejectProfessional)
  const deleteProfessional = useEvivvoStore(state => state.deleteProfessional)

  const [filtroEstado, setFiltroEstado] = useState<string>("todos")
  const [filtroTipo, setFiltroTipo] = useState<string>("todos")
  const [busqueda, setBusqueda] = useState("")
  const [selectedProf, setSelectedProf] = useState<Professional | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showSuspendModal, setShowSuspendModal] = useState(false)

  const handleAprobar = (id: string) => {
    approveProfessional(id)
    updateProfessional(id, { visiblePublicamente: true })
    setShowDetailModal(false)
  }

  const handleRechazar = (id: string) => {
    rejectProfessional(id)
    setShowDetailModal(false)
  }

  const handleSuspender = (id: string) => {
    suspendProfessional(id)
    setShowSuspendModal(false)
    setShowDetailModal(false)
  }

  const handleEliminar = (id: string) => {
    deleteProfessional(id)
    setShowDetailModal(false)
  }

  const handleActivar = (id: string) => {
    approveProfessional(id)
    updateProfessional(id, { visiblePublicamente: true })
    setShowDetailModal(false)
  }

  const filteredProfessionals = professionals.filter(prof => {
    const matchEstado = filtroEstado === "todos" || prof.estadoAdmin === filtroEstado
    const matchTipo = filtroTipo === "todos" || prof.tipo === filtroTipo
    const matchBusqueda = busqueda === "" || 
      `${prof.nombre} ${prof.apellido} ${prof.email}`.toLowerCase().includes(busqueda.toLowerCase())
    return matchEstado && matchTipo && matchBusqueda
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          Gestión de Profesionales
        </h1>
        <p className="text-muted-foreground">
          Administra todos los profesionales de la plataforma. Los cambios se sincronizan con la web pública.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="activo">Activos</option>
            <option value="rechazado">Rechazados</option>
            <option value="suspendido">Suspendidos</option>
            <option value="eliminado">Eliminados</option>
          </select>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="todos">Todos los tipos</option>
            <option value="psicologo">Psicólogos</option>
            <option value="coach">Coaches</option>
            <option value="terapeuta">Terapeutas</option>
            <option value="psiquiatra">Psiquiatras</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-5">
        {[
          { label: "Pendientes", count: professionals.filter(a => a.estadoAdmin === "pendiente").length, color: "text-amber-600" },
          { label: "Activos", count: professionals.filter(a => a.estadoAdmin === "activo").length, color: "text-emerald-600" },
          { label: "Rechazados", count: professionals.filter(a => a.estadoAdmin === "rechazado").length, color: "text-red-600" },
          { label: "Suspendidos", count: professionals.filter(a => a.estadoAdmin === "suspendido").length, color: "text-purple-600" },
          { label: "Eliminados", count: professionals.filter(a => a.estadoAdmin === "eliminado").length, color: "text-slate-600" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-background p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Profesional</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tipo</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Precio</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Rating</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Visible</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProfessionals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <UserCog className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 font-medium text-foreground">No hay profesionales</p>
                    <p className="text-sm text-muted-foreground">
                      No se encontraron profesionales con los filtros aplicados
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProfessionals.map((prof) => (
                  <tr key={prof.id} className="hover:bg-muted/30">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <UserCog className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{prof.nombre} {prof.apellido}</p>
                            {prof.destacado && <Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{prof.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm">{tipoProfesionalLabels[prof.tipo]}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium">{formatPrice(prof.precio)}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm">{prof.rating}</span>
                        <span className="text-xs text-muted-foreground">({prof.reviewCount})</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={estadoColors[prof.estadoAdmin]}>
                        {estadoLabels[prof.estadoAdmin]}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={prof.visiblePublicamente ? "default" : "secondary"}>
                        {prof.visiblePublicamente ? "Sí" : "No"}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedProf(prof); setShowDetailModal(true) }}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalle
                          </DropdownMenuItem>
                          {prof.estadoAdmin === "pendiente" && (
                            <>
                              <DropdownMenuItem onClick={() => handleAprobar(prof.id)}>
                                <Check className="mr-2 h-4 w-4 text-emerald-600" />
                                Aprobar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleRechazar(prof.id)}>
                                <X className="mr-2 h-4 w-4 text-red-600" />
                                Rechazar
                              </DropdownMenuItem>
                            </>
                          )}
                          {prof.estadoAdmin === "activo" && (
                            <DropdownMenuItem onClick={() => { setSelectedProf(prof); setShowSuspendModal(true) }}>
                              <Moon className="mr-2 h-4 w-4 text-purple-600" />
                              Suspender
                            </DropdownMenuItem>
                          )}
                          {(prof.estadoAdmin === "suspendido" || prof.estadoAdmin === "rechazado") && (
                            <DropdownMenuItem onClick={() => handleActivar(prof.id)}>
                              <RotateCcw className="mr-2 h-4 w-4 text-emerald-600" />
                              Activar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEliminar(prof.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
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
            <DialogTitle>Detalle del Profesional</DialogTitle>
            <DialogDescription>
              Información completa - Los cambios se sincronizan en tiempo real
            </DialogDescription>
          </DialogHeader>
          {selectedProf && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <UserCog className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedProf.nombre} {selectedProf.apellido}</h3>
                  <p className="text-muted-foreground">{tipoProfesionalLabels[selectedProf.tipo]}</p>
                  <Badge className={estadoColors[selectedProf.estadoAdmin]}>
                    {estadoLabels[selectedProf.estadoAdmin]}
                  </Badge>
                </div>
              </div>
              
              <div className="grid gap-3 rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedProf.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedProf.telefono}</span>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Precio: {formatPrice(selectedProf.precio)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Rating: {selectedProf.rating} ({selectedProf.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Registrado: {formatDate(selectedProf.createdAt)}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Especialidades:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProf.especialidades.map(esp => (
                    <Badge key={esp} variant="secondary">{esp}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Descripción:</p>
                <p className="text-sm text-muted-foreground">{selectedProf.descripcion}</p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            {selectedProf?.estadoAdmin === "pendiente" && (
              <>
                <Button variant="outline" onClick={() => handleRechazar(selectedProf.id)}>
                  <X className="mr-2 h-4 w-4" />
                  Rechazar
                </Button>
                <Button onClick={() => handleAprobar(selectedProf.id)}>
                  <Check className="mr-2 h-4 w-4" />
                  Aprobar
                </Button>
              </>
            )}
            {selectedProf?.estadoAdmin === "activo" && (
              <Button variant="outline" onClick={() => setShowSuspendModal(true)}>
                <Moon className="mr-2 h-4 w-4" />
                Suspender
              </Button>
            )}
            {(selectedProf?.estadoAdmin === "suspendido" || selectedProf?.estadoAdmin === "rechazado") && (
              <Button onClick={() => handleActivar(selectedProf.id)}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Activar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Modal */}
      <Dialog open={showSuspendModal} onOpenChange={setShowSuspendModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspender Profesional</DialogTitle>
            <DialogDescription>
              El profesional dejará de aparecer en la web pública
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            ¿Estás seguro de que querés suspender a <strong>{selectedProf?.nombre} {selectedProf?.apellido}</strong>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuspendModal(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedProf && handleSuspender(selectedProf.id)}
            >
              Suspender
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
