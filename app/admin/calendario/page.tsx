"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Calendar, 
  Clock, 
  Users,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Lock,
  Unlock,
  AlertTriangle,
  Eye,
  Shield,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useEvivvoStore } from "@/src/lib/store"
import { adminReasonLabels, type AdminCalendarReason } from "@/src/types/audit"

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export default function AdminCalendarioPage() {
  // Usar store centralizado
  const storeProfessionals = useEvivvoStore(state => state.getPublicProfessionals())
  const sessions = useEvivvoStore(state => state.getSessions())
  
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [blockReason, setBlockReason] = useState<AdminCalendarReason>('solicitud_profesional')
  const [blockNote, setBlockNote] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Adaptar profesionales del store al formato esperado
  const professionals = storeProfessionals.map(p => ({
    id: p.id,
    name: `${p.nombre} ${p.apellido}`,
    title: p.tipo === 'psicologo' ? 'Psicólogo/a' : p.tipo === 'coach' ? 'Coach' : 'Terapeuta',
    image: p.foto,
    availableNow: p.estadoOnline,
  }))
  
  const recentLogs: Array<{ id: string; action: string; date: string; user: string; target: string }> = []
  
  const filteredProfessionals = professionals.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Generar días del mes
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPadding = (firstDay.getDay() + 6) % 7
    
    const days: { date: Date; isCurrentMonth: boolean }[] = []
    
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month, -i)
      days.push({ date, isCurrentMonth: false })
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
  const today = new Date().toISOString().split('T')[0]
  
  const getDateStats = (dateStr: string) => {
    const daySessions = sessions.filter(s => s.fecha === dateStr)
    const activeCount = daySessions.filter(s => ['confirmada', 'pendiente'].includes(s.estado)).length
    const modificationCount = 0
    
    return { activeCount, modificationCount, total: daySessions.length }
  }
  
  const selectedProfessionalData = selectedProfessional 
    ? professionals.find(p => p.id === selectedProfessional)
    : null
    
  // Leer config del calendario desde localStorage
  const selectedConfig = selectedProfessional && typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem(`evivvo_calendar_${selectedProfessional}`) || 'null')
    : null
    
  const handleAdminAction = (action: 'block' | 'unblock') => {
    console.log('[v0] Admin action:', {
      action,
      professionalId: selectedProfessional,
      date: selectedDate,
      reason: blockReason,
      note: blockNote,
    })
    setShowBlockModal(false)
    setBlockNote('')
    setSelectedDate(null)
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Evivvo Manager</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Calendario</span>
          </div>
          <Link href="/admin/calendario/auditoria">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Ver auditoría
            </Button>
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 md:px-6">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Panel izquierdo - Lista de profesionales */}
          <div className="lg:col-span-1">
            <Card className="glass-card sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Profesionales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Buscador */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar profesional..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                
                {/* Lista */}
                <div className="max-h-96 space-y-1 overflow-y-auto">
                  <button
                    onClick={() => setSelectedProfessional(null)}
                    className={`w-full rounded-lg p-2 text-left text-sm transition-all ${
                      !selectedProfessional 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-accent'
                    }`}
                  >
                    Todos los profesionales
                  </button>
                  {filteredProfessionals.map(prof => (
                    <button
                      key={prof.id}
                      onClick={() => setSelectedProfessional(prof.id)}
                      className={`w-full rounded-lg p-2 text-left transition-all ${
                        selectedProfessional === prof.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-accent'
                      }`}
                    >
                      <p className="font-medium text-sm truncate">{prof.name}</p>
                      <p className={`text-xs ${selectedProfessional === prof.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {prof.title}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Panel central - Calendario */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">
                  {selectedProfessionalData 
                    ? `Calendario de ${selectedProfessionalData.name}`
                    : 'Calendario general'
                  }
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="min-w-32 text-center font-medium">
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
                {/* Días de la semana */}
                <div className="mb-2 grid grid-cols-7 gap-1">
                  {DAYS_OF_WEEK.map(day => (
                    <div key={day} className="py-2 text-center text-xs font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Grid de días */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const dateStr = day.date.toISOString().split('T')[0]
                    const stats = getDateStats(dateStr)
                    const isToday = dateStr === today
                    const isSelected = selectedDate === dateStr
                    const isBlocked = selectedConfig?.blockedDates?.some((b: { date: string }) => b.date === dateStr)
                    
                    return (
                      <button
                        key={index}
                        onClick={() => day.isCurrentMonth && setSelectedDate(dateStr)}
                        className={`
                          relative flex h-16 flex-col items-center justify-start rounded-lg p-1 text-sm transition-all
                          ${!day.isCurrentMonth ? 'text-muted-foreground/30' : 'hover:bg-accent'}
                          ${isToday ? 'ring-2 ring-primary ring-offset-1' : ''}
                          ${isSelected ? 'bg-primary/10 ring-2 ring-primary' : ''}
                          ${isBlocked ? 'bg-red-50' : ''}
                        `}
                      >
                        <span className={`font-medium ${isBlocked ? 'text-red-600' : ''}`}>
                          {day.date.getDate()}
                        </span>
                        {day.isCurrentMonth && stats.total > 0 && (
                          <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                            {stats.activeCount > 0 && (
                              <span className="rounded bg-blue-100 px-1 text-[10px] text-blue-700">
                                {stats.activeCount}
                              </span>
                            )}
                            {stats.modificationCount > 0 && (
                              <span className="rounded bg-amber-100 px-1 text-[10px] text-amber-700">
                                {stats.modificationCount}!
                              </span>
                            )}
                          </div>
                        )}
                        {isBlocked && (
                          <Lock className="absolute bottom-1 right-1 h-3 w-3 text-red-500" />
                        )}
                      </button>
                    )
                  })}
                </div>
                
                {/* Leyenda */}
                <div className="mt-4 flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-blue-700">n</span>
                    <span className="text-muted-foreground">Sesiones activas</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-700">n!</span>
                    <span className="text-muted-foreground">Modificaciones pendientes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Lock className="h-3 w-3 text-red-500" />
                    <span className="text-muted-foreground">Bloqueado</span>
                  </div>
                </div>
                
                {/* Panel de fecha seleccionada */}
                {selectedDate && selectedProfessional && (
                  <div className="mt-4 rounded-lg border border-border bg-accent/50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">
                          {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-AR', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedConfig?.blockedDates?.find((b: { date: string; note?: string }) => b.date === selectedDate)
                            ? `Bloqueado: ${selectedConfig.blockedDates.find((b: { date: string; note?: string }) => b.date === selectedDate)?.note || 'Sin nota'}`
                            : 'Slots disponibles'
                          }
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {selectedConfig?.blockedDates?.some((b: { date: string }) => b.date === selectedDate) ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowBlockModal(true)}
                          >
                            <Unlock className="mr-1 h-4 w-4" />
                            Desbloquear
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => setShowBlockModal(true)}
                          >
                            <Lock className="mr-1 h-4 w-4" />
                            Bloquear
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {/* Advertencia de auditoría */}
                    <div className="flex items-center gap-2 rounded bg-amber-50 p-2 text-xs text-amber-700">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                      <span>Esta acción será registrada en la auditoría interna de Evivvo.</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Panel derecho - Info y actividad */}
          <div className="space-y-6 lg:col-span-1">
            {/* Config del profesional seleccionado */}
            {selectedConfig && selectedProfessionalData && (
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Configuración</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duración</span>
                    <span className="font-medium">{selectedConfig.sessionDuration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Buffer</span>
                    <span className="font-medium">{selectedConfig.bufferTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preaviso</span>
                    <span className="font-medium">{selectedConfig.minNoticeHours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Modalidad</span>
                    <span className="font-medium capitalize">{selectedConfig.modality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Disponibilidad inmediata</span>
                    <span className={`font-medium ${selectedConfig.immediateAvailability ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                      {selectedConfig.immediateAvailability ? 'Sí' : 'No'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Actividad reciente */}
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Actividad reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentLogs.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sin actividad reciente</p>
                  ) : (
                    recentLogs.map(log => (
                      <div key={log.id} className="border-l-2 border-primary/20 pl-3 text-sm">
                        <p className="font-medium text-foreground">{log.user}</p>
                        <p className="text-xs text-muted-foreground">
                          {log.action.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.date).toLocaleDateString('es-AR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <Link href="/admin/calendario/auditoria" className="mt-4 block">
                  <Button variant="outline" size="sm" className="w-full">
                    Ver toda la auditoría
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Modal de bloqueo/desbloqueo */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>
                {selectedConfig?.blockedDates?.some((b: { date: string }) => b.date === selectedDate) 
                  ? 'Desbloquear fecha' 
                  : 'Bloquear fecha'
                }
              </CardTitle>
              <CardDescription>
                {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-AR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long',
                  year: 'numeric'
                })}
                {' - '}{selectedProfessionalData?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <span>Esta acción será registrada en la auditoría interna de Evivvo.</span>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium">Motivo (obligatorio)</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(adminReasonLabels) as [AdminCalendarReason, string][]).map(([id, label]) => (
                    <button
                      key={id}
                      onClick={() => setBlockReason(id)}
                      className={`
                        rounded-lg border px-3 py-2 text-xs transition-all
                        ${blockReason === id 
                          ? 'border-primary bg-primary text-primary-foreground' 
                          : 'border-border hover:border-primary'
                        }
                      `}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="mb-2 block text-sm font-medium">Nota adicional</label>
                <textarea
                  value={blockNote}
                  onChange={(e) => setBlockNote(e.target.value)}
                  placeholder="Describí el motivo de esta acción..."
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowBlockModal(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={() => handleAdminAction(
                    selectedConfig?.blockedDates?.some((b: { date: string }) => b.date === selectedDate) ? 'unblock' : 'block'
                  )}
                  className={selectedConfig?.blockedDates?.some((b: { date: string }) => b.date === selectedDate) 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-red-600 hover:bg-red-700'
                  }
                >
                  {selectedConfig?.blockedDates?.some((b: { date: string }) => b.date === selectedDate) 
                    ? 'Desbloquear fecha' 
                    : 'Bloquear fecha'
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
