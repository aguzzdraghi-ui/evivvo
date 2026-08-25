"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  UserCog,
  Search,
  Eye,
  Check,
  X,
  Moon,
  Mail,
  Phone,
  DollarSign,
  MoreHorizontal,
  Star,
  StarOff,
  ExternalLink,
  Loader2,
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
import {
  getAdminProfessionals,
  isEligibleForHome,
  setDestacado,
  setEstado,
  type AdminProfessionalRow,
} from "@/src/lib/professionals/admin-queries"

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
  const [professionals, setProfessionals] = useState<AdminProfessionalRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const [actionFeedback, setActionFeedback] = useState<{ id: string; message: string; ok: boolean } | null>(null)

  const [filtroEstado, setFiltroEstado] = useState<string>("todos")
  const [filtroTipo, setFiltroTipo] = useState<string>("todos")
  const [busqueda, setBusqueda] = useState("")
  const [selectedProf, setSelectedProf] = useState<AdminProfessionalRow | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showSuspendModal, setShowSuspendModal] = useState(false)

  async function reload() {
    setLoading(true)
    setError(null)
    try {
      const data = await getAdminProfessionals()
      setProfessionals(data)
    } catch {
      setError("No pudimos cargar los profesionales. Verificá tu sesión de administrador.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  async function runAction(id: string, action: () => Promise<void>, successMessage: string) {
    setPendingAction(id)
    setActionFeedback(null)
    try {
      await action()
      await reload()
      setActionFeedback({ id, message: successMessage, ok: true })
    } catch (e) {
      setActionFeedback({ id, message: e instanceof Error ? e.message : "Ocurrió un error", ok: false })
    } finally {
      setPendingAction(null)
      setShowDetailModal(false)
      setShowSuspendModal(false)
    }
  }

  const handleToggleDestacado = (prof: AdminProfessionalRow) =>
    runAction(
      prof.id,
      () => setDestacado(prof.id, !prof.destacado),
      prof.destacado ? "Quitado de destacados" : "Destacado en portada"
    )

  const handleAprobar = (id: string) => runAction(id, () => setEstado(id, "activo"), "Profesional aprobado")
  const handleRechazar = (id: string) => runAction(id, () => setEstado(id, "rechazado"), "Profesional rechazado")
  const handleSuspender = (id: string) => runAction(id, () => setEstado(id, "suspendido"), "Profesional suspendido")
  const handleActivar = (id: string) => runAction(id, () => setEstado(id, "activo"), "Profesional activado")

  const filteredProfessionals = professionals.filter((prof) => {
    const matchEstado = filtroEstado === "todos" || prof.estado === filtroEstado
    const matchTipo = filtroTipo === "todos" || prof.tipo === filtroTipo
    const matchBusqueda =
      busqueda === "" || `${prof.nombre} ${prof.apellido} ${prof.email}`.toLowerCase().includes(busqueda.toLowerCase())
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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(price)

  function eligibilityReason(prof: AdminProfessionalRow): string | null {
    if (prof.estado !== "activo") return `No aparece: estado "${estadoLabels[prof.estado]}"`
    if (!prof.visible) return "No aparece: perfil no visible"
    return null
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Gestión de Profesionales</h1>
        <p className="text-muted-foreground">
          Administra todos los profesionales de la plataforma. Los cambios se sincronizan con la web pública en
          tiempo real (Supabase).
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative max-w-md flex-1">
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

      <div className="mb-6 grid gap-4 sm:grid-cols-5">
        {[
          { label: "Pendientes", count: professionals.filter((a) => a.estado === "pendiente").length, color: "text-amber-600" },
          { label: "Activos", count: professionals.filter((a) => a.estado === "activo").length, color: "text-emerald-600" },
          { label: "Rechazados", count: professionals.filter((a) => a.estado === "rechazado").length, color: "text-red-600" },
          { label: "Suspendidos", count: professionals.filter((a) => a.estado === "suspendido").length, color: "text-purple-600" },
          { label: "Destacados", count: professionals.filter((a) => a.destacado).length, color: "text-primary" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-background p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Profesional</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tipo</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Precio</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Rating</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Destacado en portada</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  </td>
                </tr>
              ) : filteredProfessionals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <UserCog className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 font-medium text-foreground">No hay profesionales</p>
                    <p className="text-sm text-muted-foreground">No se encontraron profesionales con los filtros aplicados</p>
                  </td>
                </tr>
              ) : (
                filteredProfessionals.map((prof) => {
                  const reason = eligibilityReason(prof)
                  const isBusy = pendingAction === prof.id
                  return (
                    <tr key={prof.id} className="hover:bg-muted/30">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <UserCog className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {prof.nombre} {prof.apellido}
                            </p>
                            <p className="text-sm text-muted-foreground">{prof.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm">{tipoProfesionalLabels[prof.tipo] ?? prof.tipo}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium">{formatPrice(prof.precio)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          {prof.total_resenas > 0 ? (
                            <>
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span className="text-sm">{prof.rating.toFixed(1)}</span>
                              <span className="text-xs text-muted-foreground">({prof.total_resenas})</span>
                            </>
                          ) : (
                            <span className="text-xs text-muted-foreground">Sin reseñas</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={estadoColors[prof.estado]}>{estadoLabels[prof.estado]}</Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant={prof.destacado ? "default" : "outline"}
                            disabled={isBusy}
                            onClick={() => handleToggleDestacado(prof)}
                            className="gap-1.5"
                          >
                            {isBusy ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : prof.destacado ? (
                              <StarOff className="h-3.5 w-3.5" />
                            ) : (
                              <Star className="h-3.5 w-3.5" />
                            )}
                            {prof.destacado ? "Quitar" : "Destacar"}
                          </Button>
                          {prof.destacado && reason && (
                            <span className="text-xs text-amber-600" title={reason}>
                              ⚠ {reason}
                            </span>
                          )}
                        </div>
                        {actionFeedback?.id === prof.id && (
                          <p className={`mt-1 text-xs ${actionFeedback.ok ? "text-emerald-600" : "text-red-600"}`}>
                            {actionFeedback.message}
                          </p>
                        )}
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
                            <DropdownMenuItem asChild>
                              <Link href={`/profesionales/${prof.id}`} target="_blank">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Ver perfil público
                              </Link>
                            </DropdownMenuItem>
                            {prof.estado === "pendiente" && (
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
                            {prof.estado === "activo" && (
                              <DropdownMenuItem onClick={() => { setSelectedProf(prof); setShowSuspendModal(true) }}>
                                <Moon className="mr-2 h-4 w-4 text-purple-600" />
                                Suspender
                              </DropdownMenuItem>
                            )}
                            {(prof.estado === "suspendido" || prof.estado === "rechazado") && (
                              <DropdownMenuItem onClick={() => handleActivar(prof.id)}>
                                <Check className="mr-2 h-4 w-4 text-emerald-600" />
                                Reactivar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalle del Profesional</DialogTitle>
            <DialogDescription>Información completa desde Supabase</DialogDescription>
          </DialogHeader>
          {selectedProf && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <UserCog className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedProf.nombre} {selectedProf.apellido}
                  </h3>
                  <p className="text-muted-foreground">{tipoProfesionalLabels[selectedProf.tipo] ?? selectedProf.tipo}</p>
                  <Badge className={estadoColors[selectedProf.estado]}>{estadoLabels[selectedProf.estado]}</Badge>
                </div>
              </div>

              <div className="grid gap-3 rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedProf.email}</span>
                </div>
                {selectedProf.telefono && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedProf.telefono}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Precio: {formatPrice(selectedProf.precio)}</span>
                </div>
                {eligibilityReason(selectedProf) && (
                  <p className="text-sm text-amber-600">⚠ {eligibilityReason(selectedProf)}</p>
                )}
              </div>

              {selectedProf.especialidades.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium">Especialidades:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProf.especialidades.map((esp) => (
                      <Badge key={esp} variant="secondary">{esp}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedProf.descripcion && (
                <div>
                  <p className="mb-2 text-sm font-medium">Descripción:</p>
                  <p className="text-sm text-muted-foreground">{selectedProf.descripcion}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            {selectedProf?.estado === "pendiente" && (
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
            {selectedProf?.estado === "activo" && (
              <Button variant="outline" onClick={() => setShowSuspendModal(true)}>
                <Moon className="mr-2 h-4 w-4" />
                Suspender
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuspendModal} onOpenChange={setShowSuspendModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspender Profesional</DialogTitle>
            <DialogDescription>El profesional dejará de aparecer en la web pública (y de la portada si estaba destacado).</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            ¿Estás seguro de que querés suspender a <strong>{selectedProf?.nombre} {selectedProf?.apellido}</strong>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuspendModal(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => selectedProf && handleSuspender(selectedProf.id)}>
              Suspender
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
