"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/src/lib/auth-context"
import { useEvivvoStore } from "@/src/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Calendar, 
  Clock, 
  Settings2, 
  Video, 
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Ban,
  Trash2,
  Save
} from "lucide-react"

interface TimeSlot {
  start: string
  end: string
}

interface DayAvailability {
  day: string
  enabled: boolean
  slots: TimeSlot[]
}

interface BlockedDate {
  date: string
  reason: string
  note: string
}

interface CalendarConfig {
  professionalId: string
  weeklyAvailability: DayAvailability[]
  blockedDates: BlockedDate[]
  sessionDuration: number
  bufferTime: number
  minNoticeHours: number
  inmediataDisponible: boolean
}

const DAYS_OF_WEEK = [
  { id: 'lunes', label: 'Lunes' },
  { id: 'martes', label: 'Martes' },
  { id: 'miercoles', label: 'Miércoles' },
  { id: 'jueves', label: 'Jueves' },
  { id: 'viernes', label: 'Viernes' },
  { id: 'sabado', label: 'Sábado' },
  { id: 'domingo', label: 'Domingo' },
]

// Generar opciones de hora cada 30 minutos (00:00 a 23:30)
const generateTimeOptions = () => {
  const options = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, '0')
      const minute = m.toString().padStart(2, '0')
      options.push(`${hour}:${minute}`)
    }
  }
  return options
}

const TIME_OPTIONS = generateTimeOptions()

const getDefaultConfig = (professionalId: string): CalendarConfig => ({
  professionalId,
  weeklyAvailability: DAYS_OF_WEEK.map(d => ({
    day: d.id,
    enabled: !['sabado', 'domingo'].includes(d.id),
    slots: [{ start: '09:00', end: '18:00' }]
  })),
  blockedDates: [],
  sessionDuration: 40,
  bufferTime: 10,
  minNoticeHours: 3,
  inmediataDisponible: true,
})

export default function CalendarioPage() {
  const { user } = useAuth()
  const updateProfessional = useEvivvoStore(state => state.updateProfessional)
  const getProfessionalById = useEvivvoStore(state => state.getProfessionalById)
  const sessions = useEvivvoStore(state => state.getSessions())
  
  const professionalId = user?.id || "prof-3"
  const professional = getProfessionalById(professionalId)

  // Estado del calendario
  const [config, setConfig] = useState<CalendarConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`evivvo_calendar_${professionalId}`)
      if (saved) return JSON.parse(saved)
    }
    return getDefaultConfig(professionalId)
  })
  
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [showSlotModal, setShowSlotModal] = useState(false)
  const [editingDay, setEditingDay] = useState<string | null>(null)
  const [newSlot, setNewSlot] = useState<TimeSlot>({ start: '09:00', end: '18:00' })
  const [blockReason, setBlockReason] = useState<'vacaciones' | 'personal' | 'otro'>('personal')
  const [blockNote, setBlockNote] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  // Guardar en localStorage cuando cambia el config
  useEffect(() => {
    localStorage.setItem(`evivvo_calendar_${professionalId}`, JSON.stringify(config))
  }, [config, professionalId])

  // Generar días del calendario
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPadding = (firstDay.getDay() + 6) % 7
    
    const days: { date: Date; isCurrentMonth: boolean }[] = []
    
    for (let i = startPadding - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month, -i), isCurrentMonth: false })
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true })
    }
    
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
    }
    
    return days
  }

  const calendarDays = generateCalendarDays()

  const getDateStatus = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const today = new Date().toISOString().split('T')[0]
    const dayName = DAYS_OF_WEEK[date.getDay() === 0 ? 6 : date.getDay() - 1].id
    
    const isBlocked = config.blockedDates.some(b => b.date === dateStr)
    const dayConfig = config.weeklyAvailability.find(d => d.day === dayName)
    const hasAvailability = dayConfig?.enabled && dayConfig.slots.length > 0
    const professionalSessions = sessions.filter(s => s.profesionalId === professionalId)
    const hasSession = professionalSessions.some(s => 
      s.fecha === dateStr && ['confirmada', 'pendiente'].includes(s.estado)
    )
    const sessionCount = professionalSessions.filter(s => s.fecha === dateStr).length
    
    return {
      isToday: dateStr === today,
      isPast: dateStr < today,
      isBlocked,
      hasSession,
      hasAvailability,
      sessionCount,
    }
  }

  const handleToggleDay = (dayId: string) => {
    setConfig(prev => ({
      ...prev,
      weeklyAvailability: prev.weeklyAvailability.map(d => 
        d.day === dayId ? { ...d, enabled: !d.enabled } : d
      ),
    }))
  }

  const handleAddSlot = (dayId: string) => {
    setEditingDay(dayId)
    setNewSlot({ start: '09:00', end: '18:00' })
    setShowSlotModal(true)
  }

  const handleSaveSlot = () => {
    if (!editingDay) return
    
    setConfig(prev => ({
      ...prev,
      weeklyAvailability: prev.weeklyAvailability.map(d => 
        d.day === editingDay 
          ? { ...d, slots: [...d.slots, newSlot], enabled: true }
          : d
      ),
    }))
    
    setShowSlotModal(false)
    setEditingDay(null)
  }

  const handleRemoveSlot = (dayId: string, slotIndex: number) => {
    setConfig(prev => ({
      ...prev,
      weeklyAvailability: prev.weeklyAvailability.map(d => 
        d.day === dayId 
          ? { ...d, slots: d.slots.filter((_, i) => i !== slotIndex) }
          : d
      ),
    }))
  }

  const handleBlockDate = () => {
    if (!selectedDate) return
    
    setConfig(prev => ({
      ...prev,
      blockedDates: [
        ...prev.blockedDates,
        { date: selectedDate, reason: blockReason, note: blockNote },
      ],
    }))
    
    setShowBlockModal(false)
    setBlockNote('')
    setSelectedDate(null)
  }

  const handleUnblockDate = (dateStr: string) => {
    setConfig(prev => ({
      ...prev,
      blockedDates: prev.blockedDates.filter(b => b.date !== dateStr),
    }))
  }

  const handleSave = () => {
    setSaving(true)
    
    // Actualizar disponibilidad en el store del profesional
    const dayMap: Record<string, string> = {
      lunes: 'lunes', martes: 'martes', miercoles: 'miercoles',
      jueves: 'jueves', viernes: 'viernes', sabado: 'sabado', domingo: 'domingo'
    }
    
    const enabledDays = config.weeklyAvailability
      .filter(d => d.enabled)
      .map(d => dayMap[d.day])
    
    const firstSlot = config.weeklyAvailability.find(d => d.enabled && d.slots.length > 0)
    
    updateProfessional(professionalId, {
      disponibilidad: {
        dias: enabledDays,
        horarioInicio: firstSlot?.slots[0]?.start || '09:00',
        horarioFin: firstSlot?.slots[0]?.end || '18:00',
      },
      estadoOnline: config.inmediataDisponible,
    })
    
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mi Calendario</h1>
          <p className="text-muted-foreground">
            Configurá tu disponibilidad horaria de 00:00 a 23:59
          </p>
        </div>
        <Button 
          onClick={handleSave}
          className="bg-primary hover:bg-primary/90"
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Guardando...
            </>
          ) : saved ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Guardado
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar cambios
            </>
          )}
        </Button>
      </div>

      {/* Disponibilidad inmediata toggle */}
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
              config.inmediataDisponible ? "bg-emerald-100" : "bg-muted"
            }`}>
              <Video className={`h-5 w-5 ${
                config.inmediataDisponible ? "text-emerald-600" : "text-muted-foreground"
              }`} />
            </div>
            <div>
              <p className="font-medium">Disponibilidad inmediata</p>
              <p className="text-sm text-muted-foreground">
                {config.inmediataDisponible 
                  ? "Apareces disponible para sesiones en vivo" 
                  : "Solo sesiones programadas"
                }
              </p>
            </div>
          </div>
          <button
            onClick={() => setConfig(prev => ({ ...prev, inmediataDisponible: !prev.inmediataDisponible }))}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
              config.inmediataDisponible ? "bg-emerald-500" : "bg-muted"
            }`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              config.inmediataDisponible ? "translate-x-8" : "translate-x-1"
            }`} />
          </button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendario visual */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Calendario</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-32 text-center font-medium capitalize">
                {currentMonth.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Header días */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {DAYS_OF_WEEK.map(day => (
                <div key={day.id} className="py-2 text-center text-xs font-medium text-muted-foreground">
                  {day.label.slice(0, 3)}
                </div>
              ))}
            </div>
            
            {/* Grid de días */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const status = getDateStatus(day.date)
                const dateStr = day.date.toISOString().split('T')[0]
                const isSelected = selectedDate === dateStr
                
                return (
                  <button
                    key={index}
                    onClick={() => !status.isPast && day.isCurrentMonth && setSelectedDate(dateStr)}
                    disabled={status.isPast || !day.isCurrentMonth}
                    className={`
                      relative flex h-12 flex-col items-center justify-center rounded-lg text-sm transition-all
                      ${!day.isCurrentMonth ? 'text-muted-foreground/30' : ''}
                      ${status.isPast ? 'cursor-not-allowed text-muted-foreground/50' : 'hover:bg-accent'}
                      ${status.isToday ? 'ring-2 ring-primary ring-offset-2' : ''}
                      ${status.isBlocked ? 'bg-red-100 text-red-700' : ''}
                      ${status.hasSession && !status.isBlocked ? 'bg-blue-100 text-blue-700' : ''}
                      ${status.hasAvailability && !status.hasSession && !status.isBlocked ? 'bg-emerald-50 text-emerald-700' : ''}
                      ${isSelected ? 'ring-2 ring-primary' : ''}
                    `}
                  >
                    <span className="font-medium">{day.date.getDate()}</span>
                    {status.sessionCount > 0 && (
                      <span className="absolute bottom-0.5 text-[9px]">
                        {status.sessionCount}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
            
            {/* Leyenda */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-emerald-100" />
                <span>Disponible</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-blue-100" />
                <span>Con sesiones</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-red-100" />
                <span>Bloqueado</span>
              </div>
            </div>
            
            {/* Acciones fecha seleccionada */}
            {selectedDate && (
              <div className="mt-4 rounded-lg border bg-accent/50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium capitalize">
                      {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-AR', { 
                        weekday: 'long', day: 'numeric', month: 'long' 
                      })}
                    </p>
                    {config.blockedDates.find(b => b.date === selectedDate) ? (
                      <p className="text-sm text-red-600">
                        Bloqueado: {config.blockedDates.find(b => b.date === selectedDate)?.note || 'Sin nota'}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Disponible</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {config.blockedDates.some(b => b.date === selectedDate) ? (
                      <Button size="sm" variant="outline" onClick={() => handleUnblockDate(selectedDate)}>
                        <Check className="mr-1 h-4 w-4" />
                        Desbloquear
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => setShowBlockModal(true)}
                      >
                        <Ban className="mr-1 h-4 w-4" />
                        Bloquear
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => setSelectedDate(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Configuración semanal */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-4 w-4 text-primary" />
                Disponibilidad semanal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {config.weeklyAvailability.map(day => {
                const dayInfo = DAYS_OF_WEEK.find(d => d.id === day.day)
                return (
                  <div
                    key={day.day}
                    className={`rounded-lg border p-3 transition-all ${
                      day.enabled 
                        ? 'border-emerald-200 bg-emerald-50/50' 
                        : 'border-border bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleToggleDay(day.day)}
                        className="flex items-center gap-2"
                      >
                        <div className={`h-4 w-4 rounded border-2 ${
                          day.enabled 
                            ? 'border-emerald-500 bg-emerald-500' 
                            : 'border-muted-foreground'
                        }`}>
                          {day.enabled && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className="font-medium">{dayInfo?.label}</span>
                      </button>
                      {day.enabled && (
                        <button
                          onClick={() => handleAddSlot(day.day)}
                          className="text-primary hover:text-primary/80"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    {day.enabled && day.slots.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {day.slots.map((slot, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {slot.start} - {slot.end}
                            </span>
                            <button
                              onClick={() => handleRemoveSlot(day.day, idx)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {day.enabled && day.slots.length === 0 && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Sin horarios configurados
                      </p>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Configuración sesiones */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings2 className="h-4 w-4 text-primary" />
                Configuración
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Duración de sesión</label>
                <div className="flex flex-wrap gap-2">
                  {[30, 40, 50, 60].map(d => (
                    <button
                      key={d}
                      onClick={() => setConfig(prev => ({ ...prev, sessionDuration: d }))}
                      className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                        config.sessionDuration === d 
                          ? 'border-primary bg-primary text-white' 
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {d} min
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium">Tiempo entre sesiones</label>
                <div className="flex flex-wrap gap-2">
                  {[0, 10, 15, 30].map(b => (
                    <button
                      key={b}
                      onClick={() => setConfig(prev => ({ ...prev, bufferTime: b }))}
                      className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                        config.bufferTime === b 
                          ? 'border-primary bg-primary text-white' 
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {b === 0 ? 'Sin pausa' : `${b} min`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Preaviso mínimo</label>
                <div className="flex flex-wrap gap-2">
                  {[1, 3, 6, 12, 24].map(h => (
                    <button
                      key={h}
                      onClick={() => setConfig(prev => ({ ...prev, minNoticeHours: h }))}
                      className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                        config.minNoticeHours === h 
                          ? 'border-primary bg-primary text-white' 
                          : 'border-border hover:border-primary'
                      }`}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal agregar slot */}
      <Dialog open={showSlotModal} onOpenChange={setShowSlotModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar bloque horario</DialogTitle>
            <DialogDescription>
              Seleccioná el horario de inicio y fin (formato 24 horas)
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Hora inicio</label>
                <select
                  value={newSlot.start}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full rounded-lg border border-border p-2 text-sm"
                >
                  {TIME_OPTIONS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Hora fin</label>
                <select
                  value={newSlot.end}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full rounded-lg border border-border p-2 text-sm"
                >
                  {TIME_OPTIONS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSlotModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveSlot}>
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal bloquear fecha */}
      <Dialog open={showBlockModal} onOpenChange={setShowBlockModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bloquear fecha</DialogTitle>
            <DialogDescription>
              Esta fecha no estará disponible para agendar sesiones
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Motivo</label>
              <div className="flex gap-2">
                {(['vacaciones', 'personal', 'otro'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setBlockReason(r)}
                    className={`rounded-lg border px-3 py-1.5 text-sm capitalize ${
                      blockReason === r 
                        ? 'border-primary bg-primary text-white' 
                        : 'border-border'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Nota (opcional)</label>
              <input
                type="text"
                value={blockNote}
                onChange={(e) => setBlockNote(e.target.value)}
                placeholder="Ej: Congreso de psicología"
                className="w-full rounded-lg border border-border p-2 text-sm"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlockModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleBlockDate} className="bg-red-500 hover:bg-red-600">
              Bloquear fecha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
