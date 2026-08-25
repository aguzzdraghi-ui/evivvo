"use client"

import { useState, useEffect } from "react"
import { 
  Settings, 
  UserCog,
  Crown,
  FileText,
  DollarSign,
  Save,
  Check,
  Star,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Shield,
  Award
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useEvivvoStore, type Professional } from "@/src/lib/store"

const badgeOptions = [
  { value: "ninguno", label: "Sin badge" },
  { value: "verificado", label: "Verificado" },
  { value: "destacado", label: "Destacado" },
  { value: "premium", label: "Premium" },
  { value: "top", label: "Top Profesional" },
]

const badgeColors: Record<string, string> = {
  verificado: "bg-gradient-to-r from-amber-400 to-amber-600 text-white",
  destacado: "bg-gradient-to-r from-purple-400 to-purple-600 text-white",
  premium: "bg-gradient-to-r from-slate-400 to-slate-600 text-white",
  top: "bg-gradient-to-r from-emerald-400 to-emerald-600 text-white",
}

export default function AdminConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<"profesionales" | "suscripciones" | "terminos" | "general">("profesionales")
  const [saved, setSaved] = useState(false)
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [showProfessionalModal, setShowProfessionalModal] = useState(false)

  // Usar store centralizado
  const professionals = useEvivvoStore(state => state.getProfessionals())
  const updateProfessional = useEvivvoStore(state => state.updateProfessional)
  const plans = useEvivvoStore(state => state.getPlans())
  const updatePlan = useEvivvoStore(state => state.updatePlan)
  const terms = useEvivvoStore(state => state.getTerms())
  const updateTerms = useEvivvoStore(state => state.updateTerms)
  const config = useEvivvoStore(state => state.getConfig())
  const updateConfig = useEvivvoStore(state => state.updateConfig)

  // Estado local para edición
  const [termsContent, setTermsContent] = useState("")
  const [plusPlan, setPlusPlan] = useState({
    precio: 0,
    descuento: 0,
    beneficios: [] as string[],
  })
  const [generalConfig, setGeneralConfig] = useState({
    comisionPlataforma: 0,
    tiemposCancelacion: 0,
    notificacionesEmail: true,
    notificacionesPush: true,
  })

  // Cargar datos al montar
  useEffect(() => {
    setTermsContent(terms.contenido)
    
    const plus = plans.find(p => p.id === 'plan-plus')
    if (plus) {
      setPlusPlan({
        precio: plus.precio,
        descuento: plus.descuento || 0,
        beneficios: plus.beneficios,
      })
    }

    setGeneralConfig({
      comisionPlataforma: config.comisionPlataforma,
      tiemposCancelacion: config.tiemposCancelacion,
      notificacionesEmail: config.notificacionesEmail,
      notificacionesPush: config.notificacionesPush,
    })
  }, [terms, plans, config])

  const showSavedFeedback = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleUpdateProfessional = (id: string, updates: Partial<Professional>) => {
    updateProfessional(id, updates)
    showSavedFeedback()
  }

  const handleMoveRanking = (id: string, direction: "up" | "down") => {
    const sorted = [...professionals].sort((a, b) => a.ranking - b.ranking)
    const index = sorted.findIndex(p => p.id === id)
    
    if (direction === "up" && index > 0) {
      const prevRanking = sorted[index - 1].ranking
      const currentRanking = sorted[index].ranking
      updateProfessional(sorted[index].id, { ranking: prevRanking })
      updateProfessional(sorted[index - 1].id, { ranking: currentRanking })
    } else if (direction === "down" && index < sorted.length - 1) {
      const nextRanking = sorted[index + 1].ranking
      const currentRanking = sorted[index].ranking
      updateProfessional(sorted[index].id, { ranking: nextRanking })
      updateProfessional(sorted[index + 1].id, { ranking: currentRanking })
    }
    showSavedFeedback()
  }

  const handleSaveSubscription = () => {
    updatePlan('plan-plus', {
      precio: plusPlan.precio,
      descuento: plusPlan.descuento,
      precioOriginal: Math.round(plusPlan.precio / (1 - plusPlan.descuento / 100)),
      beneficios: plusPlan.beneficios,
    })
    showSavedFeedback()
  }

  const handleSaveTerms = () => {
    updateTerms(termsContent)
    showSavedFeedback()
  }

  const handleSaveGeneral = () => {
    updateConfig(generalConfig)
    showSavedFeedback()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const sortedProfessionals = [...professionals].sort((a, b) => a.ranking - b.ranking)

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
            Configuración
          </h1>
          <p className="text-muted-foreground">
            Administra la configuración de Evivvo. Los cambios se reflejan en tiempo real.
          </p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-100 px-4 py-2 text-emerald-700">
            <Check className="h-4 w-4" />
            Guardado
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "profesionales", label: "Profesionales", icon: UserCog },
          { id: "suscripciones", label: "Suscripciones", icon: Crown },
          { id: "terminos", label: "Términos", icon: FileText },
          { id: "general", label: "General", icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content - Profesionales */}
      {activeTab === "profesionales" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de profesionales</CardTitle>
              <CardDescription>
                Los cambios aquí se reflejan inmediatamente en la web pública (/profesionales)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Ranking</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Profesional</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Badge</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Estado</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Visible</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sortedProfessionals.map((prof, index) => (
                      <tr key={prof.id} className="hover:bg-muted/30">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-lg font-bold text-muted-foreground">#{prof.ranking}</span>
                            <div className="flex flex-col">
                              <button
                                onClick={() => handleMoveRanking(prof.id, "up")}
                                disabled={index === 0}
                                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleMoveRanking(prof.id, "down")}
                                disabled={index === sortedProfessionals.length - 1}
                                className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <UserCog className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{prof.nombre} {prof.apellido}</p>
                                {prof.destacado && <Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
                              </div>
                              <p className="text-sm text-muted-foreground">{prof.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {prof.badge && prof.badge !== 'ninguno' ? (
                            <Badge className={badgeColors[prof.badge] || "bg-slate-200"}>
                              <Award className="mr-1 h-3 w-3" />
                              {badgeOptions.find(b => b.value === prof.badge)?.label}
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">Sin badge</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${prof.estadoOnline ? "bg-emerald-500" : "bg-slate-300"}`} />
                            <span className="text-sm">{prof.estadoOnline ? "Online" : "Offline"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleUpdateProfessional(prof.id, { visiblePublicamente: !prof.visiblePublicamente })}
                            className={`flex items-center gap-1 rounded px-2 py-1 text-sm ${
                              prof.visiblePublicamente ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {prof.visiblePublicamente ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            {prof.visiblePublicamente ? "Visible" : "Oculto"}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setSelectedProfessional(prof); setShowProfessionalModal(true) }}
                          >
                            Editar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab Content - Suscripciones */}
      {activeTab === "suscripciones" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Evivvo Plus</CardTitle>
              <CardDescription>
                Los cambios aquí se reflejan en la página de planes (/planes)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Precio mensual (ARS)</Label>
                  <Input
                    type="number"
                    value={plusPlan.precio}
                    onChange={(e) => setPlusPlan({ ...plusPlan, precio: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Descuento (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={plusPlan.descuento}
                    onChange={(e) => setPlusPlan({ ...plusPlan, descuento: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label>Beneficios (uno por línea)</Label>
                <Textarea
                  rows={6}
                  value={plusPlan.beneficios.join("\n")}
                  onChange={(e) => setPlusPlan({ ...plusPlan, beneficios: e.target.value.split("\n").filter(b => b.trim()) })}
                />
              </div>

              <div className="rounded-lg bg-primary/5 p-4">
                <h4 className="font-medium mb-2">Vista previa</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{formatPrice(plusPlan.precio)}</span>
                  {plusPlan.descuento > 0 && (
                    <>
                      <span className="text-muted-foreground line-through">
                        {formatPrice(Math.round(plusPlan.precio / (1 - plusPlan.descuento / 100)))}
                      </span>
                      <Badge className="bg-emerald-100 text-emerald-700">{plusPlan.descuento}% OFF</Badge>
                    </>
                  )}
                </div>
              </div>

              <Button onClick={handleSaveSubscription}>
                <Save className="mr-2 h-4 w-4" />
                Guardar cambios
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab Content - Términos */}
      {activeTab === "terminos" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Términos y condiciones</CardTitle>
              <CardDescription>
                Última modificación: {new Date(terms.ultimaActualizacion).toLocaleString("es-AR")} - Versión {terms.version}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Usa formato Markdown. Los cambios se reflejan en /terminos-y-condiciones
              </p>
              <Textarea
                rows={20}
                value={termsContent}
                onChange={(e) => setTermsContent(e.target.value)}
                placeholder="# Términos y Condiciones&#10;&#10;## 1. Uso de la plataforma..."
                className="font-mono text-sm"
              />
              <div className="flex gap-3">
                <Button onClick={handleSaveTerms}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar y publicar
                </Button>
                <Button variant="outline" asChild>
                  <a href="/terminos-y-condiciones" target="_blank">
                    <Eye className="mr-2 h-4 w-4" />
                    Ver página pública
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab Content - General */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración general</CardTitle>
              <CardDescription>Parámetros generales de la plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Comisión plataforma (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={generalConfig.comisionPlataforma}
                    onChange={(e) => setGeneralConfig({ ...generalConfig, comisionPlataforma: Number(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    No se muestra a usuarios finales
                  </p>
                </div>
                <div>
                  <Label>Tiempo mínimo cancelación (horas)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={generalConfig.tiemposCancelacion}
                    onChange={(e) => setGeneralConfig({ ...generalConfig, tiemposCancelacion: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Notificaciones</Label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={generalConfig.notificacionesEmail}
                      onChange={(e) => setGeneralConfig({ ...generalConfig, notificacionesEmail: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Email</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={generalConfig.notificacionesPush}
                      onChange={(e) => setGeneralConfig({ ...generalConfig, notificacionesPush: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm">Push</span>
                  </label>
                </div>
              </div>

              <Button onClick={handleSaveGeneral}>
                <Save className="mr-2 h-4 w-4" />
                Guardar cambios
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal editar profesional */}
      <Dialog open={showProfessionalModal} onOpenChange={setShowProfessionalModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar profesional</DialogTitle>
            <DialogDescription>
              {selectedProfessional?.nombre} {selectedProfessional?.apellido}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProfessional && (
            <div className="space-y-4">
              <div>
                <Label>Badge</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={selectedProfessional.badge}
                  onChange={(e) => setSelectedProfessional({ ...selectedProfessional, badge: e.target.value as Professional['badge'] })}
                >
                  {badgeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Precio por sesión (ARS)</Label>
                <Input
                  type="number"
                  value={selectedProfessional.precio}
                  onChange={(e) => setSelectedProfessional({ ...selectedProfessional, precio: Number(e.target.value) })}
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedProfessional.destacado}
                    onChange={(e) => setSelectedProfessional({ ...selectedProfessional, destacado: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Destacado</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedProfessional.estadoOnline}
                    onChange={(e) => setSelectedProfessional({ ...selectedProfessional, estadoOnline: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Online</span>
                </label>
              </div>

              <div>
                <Label>Estado en plataforma</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={selectedProfessional.estadoAdmin}
                  onChange={(e) => setSelectedProfessional({ ...selectedProfessional, estadoAdmin: e.target.value as Professional['estadoAdmin'] })}
                >
                  <option value="activo">Activo</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="suspendido">Suspendido</option>
                  <option value="rechazado">Rechazado</option>
                </select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProfessionalModal(false)}>
              Cancelar
            </Button>
            <Button onClick={() => {
              if (selectedProfessional) {
                handleUpdateProfessional(selectedProfessional.id, {
                  badge: selectedProfessional.badge,
                  precio: selectedProfessional.precio,
                  destacado: selectedProfessional.destacado,
                  estadoOnline: selectedProfessional.estadoOnline,
                  estadoAdmin: selectedProfessional.estadoAdmin,
                })
                setShowProfessionalModal(false)
              }
            }}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
