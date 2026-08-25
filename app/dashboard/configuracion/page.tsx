"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/src/lib/auth-context"
import { useEvivvoStore } from "@/src/lib/store"
import { Button } from "@/components/ui/button"
import { 
  Clock, 
  DollarSign, 
  Video, 
  Calendar, 
  Check,
  Save,
  User,
  FileText
} from "lucide-react"

const specialtiesList = [
  "Ansiedad",
  "Depresión",
  "Estrés",
  "Rupturas amorosas",
  "Duelo",
  "Soledad",
  "Terapia de pareja",
  "Autoestima",
  "Crecimiento personal",
  "Insomnio",
  "Trastornos alimenticios",
  "Adicciones",
  "Fobias",
  "Trauma",
  "Relaciones",
  "Comunicación",
  "Desarrollo personal",
  "Liderazgo",
  "Gestión del estrés",
  "Mindfulness",
  "Meditación",
  "Bienestar",
]

export default function ConfiguracionPage() {
  const { user } = useAuth()
  const updateProfessional = useEvivvoStore(state => state.updateProfessional)
  const getProfessionalById = useEvivvoStore(state => state.getProfessionalById)
  
  // Obtener datos del profesional logueado del store
  const professionalId = user?.id || "prof-3"
  const professional = getProfessionalById(professionalId)
  
  // Estados locales sincronizados con el store
  const [duration, setDuration] = useState(40)
  const [price, setPrice] = useState(15000)
  const [sessionTypes, setSessionTypes] = useState({
    programada: true,
    enVivo: true,
  })
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [descripcion, setDescripcion] = useState("")
  const [estadoOnline, setEstadoOnline] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  // Cargar datos del profesional al montar
  useEffect(() => {
    if (professional) {
      setPrice(professional.precio)
      setSelectedSpecialties(professional.especialidades)
      setDescripcion(professional.descripcion)
      setEstadoOnline(professional.estadoOnline)
    }
  }, [professional])

  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    )
  }

  const handleSave = () => {
    setSaving(true)
    
    // Actualizar en el store centralizado
    updateProfessional(professionalId, {
      precio: price,
      especialidades: selectedSpecialties,
      descripcion,
      estadoOnline,
    })
    
    // Feedback visual
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 500)
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(value)
  }

  if (!professional) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">No se encontró el perfil del profesional</p>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          Configuración de sesiones
        </h1>
        <p className="text-muted-foreground">
          Editando perfil de <strong>{professional.nombre} {professional.apellido}</strong>
        </p>
        <p className="mt-1 text-sm text-primary">
          Los cambios se reflejan automáticamente en tu perfil público
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Online Status */}
        <div className="rounded-xl border border-border bg-background p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                estadoOnline ? "bg-emerald-500/10" : "bg-muted"
              }`}>
                <Video className={`h-6 w-6 ${estadoOnline ? "text-emerald-600" : "text-muted-foreground"}`} />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Estado de disponibilidad</h2>
                <p className="text-sm text-muted-foreground">
                  {estadoOnline 
                    ? "Estás visible para sesiones inmediatas" 
                    : "No apareces disponible para atención inmediata"
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => setEstadoOnline(!estadoOnline)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                estadoOnline ? "bg-emerald-500" : "bg-muted"
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                estadoOnline ? "translate-x-8" : "translate-x-1"
              }`} />
            </button>
          </div>
        </div>

        {/* Duration Slider */}
        <div className="rounded-xl border border-border bg-background p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Duración de sesión</h2>
              <p className="text-sm text-muted-foreground">
                Elige cuánto dura cada sesión
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">25 min</span>
              <span className="text-2xl font-bold text-primary">{duration} minutos</span>
              <span className="text-sm text-muted-foreground">50 min</span>
            </div>

            <input
              type="range"
              min={25}
              max={50}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
            />
          </div>
        </div>

        {/* Price Slider */}
        <div className="rounded-xl border border-border bg-background p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Precio por sesión</h2>
              <p className="text-sm text-muted-foreground">
                Define tu tarifa profesional
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">$10.000</span>
              <span className="text-2xl font-bold text-emerald-600">
                {formatPrice(price)}
              </span>
              <span className="text-sm text-muted-foreground">$35.000</span>
            </div>

            <input
              type="range"
              min={10000}
              max={35000}
              step={500}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full h-3 bg-muted rounded-full appearance-none cursor-pointer accent-emerald-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
            />
          </div>

          <div className="mt-6 rounded-lg bg-emerald-500/10 p-4">
            <p className="text-sm text-emerald-700">
              Recibirás {formatPrice(price * 0.85)} por sesión (15% comisión plataforma)
            </p>
          </div>
        </div>

        {/* Session Types */}
        <div className="rounded-xl border border-border bg-background p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/10">
              <Video className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Tipo de atención</h2>
              <p className="text-sm text-muted-foreground">
                Selecciona cómo deseas atender
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label
              className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${
                sessionTypes.programada
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input
                type="checkbox"
                checked={sessionTypes.programada}
                onChange={(e) =>
                  setSessionTypes({ ...sessionTypes, programada: e.target.checked })
                }
                className="sr-only"
              />
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors ${
                  sessionTypes.programada
                    ? "border-primary bg-primary"
                    : "border-muted-foreground"
                }`}
              >
                {sessionTypes.programada && <Check className="h-4 w-4 text-white" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Sesión programada</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Los pacientes agendan con anticipación
                </p>
              </div>
            </label>

            <label
              className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${
                sessionTypes.enVivo
                  ? "border-emerald-500 bg-emerald-500/5"
                  : "border-border hover:border-emerald-500/50"
              }`}
            >
              <input
                type="checkbox"
                checked={sessionTypes.enVivo}
                onChange={(e) =>
                  setSessionTypes({ ...sessionTypes, enVivo: e.target.checked })
                }
                className="sr-only"
              />
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors ${
                  sessionTypes.enVivo
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-muted-foreground"
                }`}
              >
                {sessionTypes.enVivo && <Check className="h-4 w-4 text-white" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium text-foreground">Sesión en vivo</span>
                  <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs text-white">
                    Recomendado
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Atención inmediata cuando estás en línea
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-xl border border-border bg-background p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Descripción profesional</h2>
              <p className="text-sm text-muted-foreground">
                Preséntate a tus potenciales pacientes
              </p>
            </div>
          </div>

          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Escribe una breve descripción sobre ti y tu enfoque terapéutico..."
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {descripcion.length}/500 caracteres
          </p>
        </div>

        {/* Specialties */}
        <div className="rounded-xl border border-border bg-background p-6 lg:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
              <User className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Especialidades</h2>
              <p className="text-sm text-muted-foreground">
                Selecciona las áreas en las que te especializas
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {specialtiesList.map((specialty) => (
              <button
                key={specialty}
                onClick={() => handleSpecialtyToggle(specialty)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedSpecialties.includes(specialty)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {selectedSpecialties.includes(specialty) && (
                  <Check className="mr-1 inline h-3 w-3" />
                )}
                {specialty}
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            {selectedSpecialties.length} especialidad(es) seleccionada(s)
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSave}
          size="lg"
          disabled={saving}
          className={`gap-2 transition-all ${
            saved ? "bg-emerald-500 hover:bg-emerald-600" : ""
          }`}
        >
          {saving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Guardando...
            </>
          ) : saved ? (
            <>
              <Check className="h-5 w-5" />
              Cambios guardados
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Guardar cambios
            </>
          )}
        </Button>
      </div>

      {/* Summary */}
      <div className="mt-8 rounded-xl bg-muted/50 p-6">
        <h3 className="mb-4 font-semibold text-foreground">Vista previa del perfil público</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <p className="text-sm text-muted-foreground">Nombre</p>
            <p className="font-semibold text-foreground">{professional.nombre} {professional.apellido}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Precio</p>
            <p className="text-lg font-semibold text-emerald-600">{formatPrice(price)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Duración</p>
            <p className="font-semibold text-foreground">{duration} min</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Estado</p>
            <p className={`font-semibold ${estadoOnline ? "text-emerald-600" : "text-muted-foreground"}`}>
              {estadoOnline ? "En línea" : "Fuera de línea"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Especialidades</p>
            <p className="font-semibold text-foreground">{selectedSpecialties.length} áreas</p>
          </div>
        </div>
      </div>
    </div>
  )
}
