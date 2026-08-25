"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Calendar, 
  Clock, 
  Video, 
  MessageSquare, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  CreditCard,
  Lock,
  Loader2
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar, Footer } from "@/src/components/landing"
import { useEvivvoStore } from "@/src/lib/store"
import { createClient } from "@/src/lib/supabase/client"
import { getPublicProfessionalById } from "@/src/lib/professionals/public-queries"
import { TIPO_LABELS } from "@/src/lib/professionals/public-types"
import type { SessionWithDetails } from "@/src/types/session"
import { generateGoogleCalendarLink } from "@/src/types/session"

const WEEKDAY_NAMES = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']

interface WeeklyAvailabilityDay {
  day: string
  enabled: boolean
  slots: { start: string; end: string }[]
}

export default function AgendarPage({ params }: { params: Promise<{ professionalId: string }> }) {
  const { professionalId } = use(params)
  const router = useRouter()

  // Sesiones locales (agenda propia del usuario) — sin cambios, fuera de alcance.
  const sessions = useEvivvoStore(state => state.sessions)
  const addSession = useEvivvoStore(state => state.addSession)

  const [professional, setProfessional] = useState<{
    id: string
    name: string
    title: string
    image: string | null
    price: number
    rating: number
    reviews: number
    specialties: string[]
    availableNow: boolean
  } | null | undefined>(undefined)
  const [weeklyAvailability, setWeeklyAvailability] = useState<WeeklyAvailabilityDay[]>([])

  useEffect(() => {
    let cancelled = false

    async function load() {
      const data = await getPublicProfessionalById(professionalId)
      if (cancelled) return

      if (!data) {
        setProfessional(null)
        return
      }

      setProfessional({
        id: data.id,
        name: `${data.nombre} ${data.apellido}`,
        title: TIPO_LABELS[data.tipo],
        image: data.foto_url,
        price: data.precio ?? data.precio_min ?? 0,
        rating: data.rating ?? 0,
        reviews: data.total_resenas,
        specialties: data.especialidades,
        availableNow: data.disponible_ahora,
      })

      // Disponibilidad real desde professional_availability (pública para
      // profesionales activos+visibles vía RLS). Sin filas = sin horarios
      // publicados todavía: no se inventa un horario por defecto.
      const supabase = createClient()
      const { data: availabilityRows } = await supabase
        .from("professional_availability")
        .select("weekday, start_time, end_time, active")
        .eq("professional_id", professionalId)
        .eq("active", true)

      if (cancelled) return

      type AvailabilityRow = { weekday: number; start_time: string; end_time: string; active: boolean }
      const allRows = (availabilityRows ?? []) as AvailabilityRow[]

      const byDay: WeeklyAvailabilityDay[] = WEEKDAY_NAMES.map((day, weekday) => {
        const rows = allRows.filter((r) => r.weekday === weekday)
        return {
          day,
          enabled: rows.length > 0,
          slots: rows.map((r) => ({ start: r.start_time.slice(0, 5), end: r.end_time.slice(0, 5) })),
        }
      })
      setWeeklyAvailability(byDay)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [professionalId])

  // Configuración del calendario. El profesional puede sobreescribirla desde
  // su propio panel (localStorage) hasta que ese flujo también persista en
  // Supabase; si no hay override, se usa la disponibilidad real cargada arriba.
  const getCalendarConfig = () => {
    if (typeof window === 'undefined') return null
    const saved = localStorage.getItem(`evivvo_calendar_${professionalId}`)
    return saved ? JSON.parse(saved) : null
  }

  const config = getCalendarConfig() || {
    weeklyAvailability,
    blockedDates: [],
    sessionDuration: 40,
    minNoticeHours: 3,
  }

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedModality, setSelectedModality] = useState<'videollamada' | 'chat'>('videollamada')
  const [step, setStep] = useState<'select' | 'payment' | 'success'>('select')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [createdSessionId, setCreatedSessionId] = useState<string | null>(null)
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  })
  
  if (professional === undefined) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container mx-auto animate-pulse px-4 md:px-6">
            <div className="h-64 rounded-2xl bg-muted" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!professional) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <Card className="max-w-md text-center">
            <CardContent className="pt-6">
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
              <h2 className="mb-2 text-xl font-bold">Profesional no encontrado</h2>
              <p className="mb-4 text-muted-foreground">
                El profesional que buscás no existe o ya no está disponible.
              </p>
              <Link href="/profesionales">
                <Button>Ver todos los profesionales</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }
  
  // Generar fechas disponibles basadas en la config del profesional
  const getNextAvailableDates = () => {
    const dates: string[] = []
    const today = new Date()
    const minNotice = config.minNoticeHours || 3
    
    for (let i = 0; i < 60; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      const dayName = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][date.getDay()]
      
      const dayConfig = config.weeklyAvailability?.find((d: { day: string }) => d.day === dayName)
      const isBlocked = config.blockedDates?.some((b: { date: string }) => b.date === dateStr)
      const hasBookedSession = sessions.some(s => 
        s.profesionalId === professionalId && 
        s.fecha === dateStr && 
        ['confirmada', 'pendiente'].includes(s.estado)
      )
      
      if (dayConfig?.enabled && !isBlocked) {
        dates.push(dateStr)
      }
    }
    return dates
  }
  
  const availableDates = getNextAvailableDates()
  
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
  
  // Generar slots disponibles para una fecha
  const getAvailableSlotsForDate = (date: string) => {
    const dateObj = new Date(date + 'T12:00:00')
    const dayName = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][dateObj.getDay()]
    const dayConfig = config.weeklyAvailability?.find((d: { day: string }) => d.day === dayName)
    
    if (!dayConfig?.enabled || !dayConfig.slots) return []
    
    const slots: { time: string; available: boolean }[] = []
    const sessionDuration = config.sessionDuration || 40
    const bookedTimes = sessions
      .filter(s => s.profesionalId === professionalId && s.fecha === date && ['confirmada', 'pendiente'].includes(s.estado))
      .map(s => s.hora)
    
    for (const slot of dayConfig.slots) {
      const [startH, startM] = slot.start.split(':').map(Number)
      const [endH, endM] = slot.end.split(':').map(Number)
      const startMinutes = startH * 60 + startM
      const endMinutes = endH * 60 + endM
      
      for (let minutes = startMinutes; minutes + sessionDuration <= endMinutes; minutes += sessionDuration) {
        const hour = Math.floor(minutes / 60)
        const minute = minutes % 60
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        
        slots.push({
          time: timeStr,
          available: !bookedTimes.includes(timeStr)
        })
      }
    }
    
    return slots
  }
  
  const availableSlots = selectedDate 
    ? getAvailableSlotsForDate(selectedDate).filter(s => s.available)
    : []
  
  const handleGoToPayment = () => {
    setStep('payment')
  }

  const handleProcessPayment = async () => {
    setIsProcessingPayment(true)
    
    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Guardar sesión en el store centralizado
    const newSession = addSession({
      pacienteId: 'pac-1', // TODO: usar ID del usuario logueado
      profesionalId: professionalId,
      fecha: selectedDate!,
      hora: selectedTime!,
      duracion: (config.sessionDuration || 40) as 25 | 40 | 50,
      modalidad: selectedModality,
      estado: 'confirmada',
      estadoPago: 'pagado',
      precio: professional?.price || 0,
    })
    
    setCreatedSessionId(newSession.id)
    setIsProcessingPayment(false)
    setStep('success')
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price)
  }
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6">
          {/* Back button */}
          <Link 
            href={`/profesionales/${professionalId}`}
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al perfil
          </Link>
          
          {step === 'payment' ? (
            /* Pantalla de pago */
            <div className="mx-auto max-w-2xl">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Completá tu pago
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Resumen de la sesión */}
                  <div className="rounded-lg border border-border bg-accent/30 p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted">
                        {professional.image ? (
                          <Image src={professional.image} alt={professional.name} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-purple-500/15 text-sm font-semibold text-primary">
                            {professional.name?.[0]}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{professional.name}</h3>
                        <p className="text-sm text-muted-foreground">{professional.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-AR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                          })} - {selectedTime} hs
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{formatPrice(professional.price)}</p>
                        <p className="text-xs text-muted-foreground">{config.sessionDuration} min</p>
                      </div>
                    </div>
                  </div>

                  {/* Formulario de pago */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Número de tarjeta</Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentData.cardNumber}
                          onChange={(e) => setPaymentData({ 
                            ...paymentData, 
                            cardNumber: formatCardNumber(e.target.value) 
                          })}
                          maxLength={19}
                          className="pl-10"
                        />
                        <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                      <Input
                        id="cardName"
                        placeholder="JUAN PEREZ"
                        value={paymentData.cardName}
                        onChange={(e) => setPaymentData({ 
                          ...paymentData, 
                          cardName: e.target.value.toUpperCase() 
                        })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Vencimiento</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/AA"
                          value={paymentData.expiry}
                          onChange={(e) => setPaymentData({ 
                            ...paymentData, 
                            expiry: formatExpiry(e.target.value) 
                          })}
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <div className="relative">
                          <Input
                            id="cvv"
                            type="password"
                            placeholder="123"
                            value={paymentData.cvv}
                            onChange={(e) => setPaymentData({ 
                              ...paymentData, 
                              cvv: e.target.value.replace(/\D/g, '').substring(0, 4) 
                            })}
                            maxLength={4}
                            className="pl-10"
                          />
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seguridad */}
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
                    <Shield className="h-5 w-5 flex-shrink-0" />
                    <span>Tu pago está protegido con encriptación SSL de 256 bits</span>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setStep('select')}
                      disabled={isProcessingPayment}
                      className="flex-1"
                    >
                      Volver
                    </Button>
                    <Button
                      onClick={handleProcessPayment}
                      disabled={
                        isProcessingPayment ||
                        !paymentData.cardNumber ||
                        !paymentData.cardName ||
                        !paymentData.expiry ||
                        !paymentData.cvv
                      }
                      className="flex-1 bg-primary"
                    >
                      {isProcessingPayment ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Pagar {formatPrice(professional.price)}
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-center text-xs text-muted-foreground">
                    Al realizar el pago, aceptás los{' '}
                    <Link href="/terminos-y-condiciones" className="text-primary hover:underline">
                      términos y condiciones
                    </Link>{' '}
                    y la{' '}
                    <Link href="/privacidad" className="text-primary hover:underline">
                      política de privacidad
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : step === 'success' ? (
            /* Pantalla de éxito */
            <Card className="mx-auto max-w-lg text-center glass-card">
              <CardContent className="pt-8 pb-8">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle className="h-10 w-10 text-emerald-600" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-foreground">Sesión confirmada</h2>
                <p className="mb-6 text-muted-foreground">
                  Tu sesión con {professional.name} ha sido agendada exitosamente.
                </p>
                
                <Card className="mb-6 bg-accent/50">
                  <CardContent className="py-4">
                    <div className="grid gap-3 text-left text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Profesional</span>
                        <span className="font-medium">{professional.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha</span>
                        <span className="font-medium">
                          {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-AR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hora</span>
                        <span className="font-medium">{selectedTime} hs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duración</span>
                        <span className="font-medium">{config.sessionDuration} minutos</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Modalidad</span>
                        <span className="font-medium capitalize">{selectedModality}</span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-3">
                        <span className="font-medium">Total</span>
                        <span className="font-bold text-primary">{formatPrice(professional.price)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex flex-col gap-3">
                  {createdSessionId && selectedModality === 'videollamada' && (
                    <Link href={`/sesion/${createdSessionId}`} className="w-full">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                        <Video className="mr-2 h-4 w-4" />
                        Ingresar a la videollamada
                      </Button>
                    </Link>
                  )}
                  {createdSessionId && selectedModality === 'chat' && (
                    <Link href={`/sesion/${createdSessionId}?mode=chat`} className="w-full">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Abrir chat de la sesión
                      </Button>
                    </Link>
                  )}
                  <a
                    href={generateGoogleCalendarLink({
                      id: createdSessionId || 'new-session',
                      professionalId,
                      patientId: 'current-user',
                      date: selectedDate!,
                      time: selectedTime!,
                      duration: config.sessionDuration as 25 | 40 | 50,
                      modality: selectedModality,
                      status: 'confirmada',
                      price: professional.price,
                      paymentStatus: 'pagado',
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      professionalName: professional.name,
                      professionalImage: professional.image ?? "",
                      professionalTitle: professional.title,
                      patientName: 'Usuario',
                      patientEmail: 'usuario@email.com',
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      Agregar a Google Calendar
                    </Button>
                  </a>
                  <Link href="/mi-cuenta/sesiones" className="w-full">
                    <Button variant="ghost" className="w-full">
                      Ver mis sesiones
                    </Button>
                  </Link>
                </div>
                
                <p className="mt-6 text-xs text-muted-foreground">
                  Recibirás un email de confirmación con los detalles y el link de acceso.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Info del profesional */}
              <Card className="lg:row-span-2 glass-card">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full bg-muted ring-4 ring-primary/20">
                      {professional.image ? (
                        <Image src={professional.image} alt={professional.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 to-purple-500/15 text-lg font-semibold text-primary">
                          {professional.name?.[0]}
                        </div>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-foreground">{professional.name}</h2>
                    <p className="text-sm text-muted-foreground">{professional.title}</p>
                    
                    <div className="mt-2 flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{professional.rating}</span>
                      <span className="text-muted-foreground">({professional.reviews} opiniones)</span>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {professional.specialties.slice(0, 3).map(specialty => (
                        <span 
                          key={specialty}
                          className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <hr className="my-6 border-border" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{config.sessionDuration} minutos</p>
                        <p className="text-xs text-muted-foreground">Duración de sesión</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Video className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium capitalize">
                          {config.modality === 'ambas' ? 'Videollamada o Chat' : config.modality}
                        </p>
                        <p className="text-xs text-muted-foreground">Modalidad disponible</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{formatPrice(professional.price)}</p>
                        <p className="text-xs text-muted-foreground">Por sesión</p>
                      </div>
                    </div>
                  </div>
                  
                  <hr className="my-6 border-border" />
                  
                  <div className="rounded-lg bg-amber-50 p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Política de modificación</p>
                        <p className="text-xs text-amber-700">
                          Las modificaciones deben solicitarse con al menos 12 horas de anticipación 
                          según la política de Evivvo.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {config.minNoticeHours > 1 && (
                    <div className="mt-4 rounded-lg bg-blue-50 p-4">
                      <div className="flex gap-3">
                        <Clock className="h-5 w-5 flex-shrink-0 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">Preaviso de reserva</p>
                          <p className="text-xs text-blue-700">
                            Este profesional requiere reservar con al menos {config.minNoticeHours} horas de anticipación.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Selector de fecha */}
              <Card className="lg:col-span-2 glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Seleccioná una fecha
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-medium">
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
                  
                  {/* Días de la semana */}
                  <div className="mb-2 grid grid-cols-7 gap-1">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                      <div key={day} className="py-2 text-center text-xs font-medium text-muted-foreground">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Grid de días */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => {
                      const dateStr = day.date.toISOString().split('T')[0]
                      const isAvailable = availableDates.includes(dateStr)
                      const isPast = dateStr < today
                      const isSelected = selectedDate === dateStr
                      const isToday = dateStr === today
                      
                      return (
                        <button
                          key={index}
                          onClick={() => isAvailable && setSelectedDate(dateStr)}
                          disabled={!isAvailable || isPast || !day.isCurrentMonth}
                          className={`
                            flex h-10 items-center justify-center rounded-lg text-sm transition-all
                            ${!day.isCurrentMonth ? 'text-muted-foreground/30' : ''}
                            ${isPast ? 'cursor-not-allowed text-muted-foreground/50' : ''}
                            ${isAvailable && !isSelected ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : ''}
                            ${!isAvailable && day.isCurrentMonth && !isPast ? 'text-muted-foreground' : ''}
                            ${isSelected ? 'bg-primary text-primary-foreground' : ''}
                            ${isToday && !isSelected ? 'ring-2 ring-primary/50' : ''}
                          `}
                        >
                          {day.date.getDate()}
                        </button>
                      )
                    })}
                  </div>
                  
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded bg-emerald-100" />
                      <span>Disponible</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded bg-primary" />
                      <span>Seleccionado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Selector de hora y modalidad */}
              {selectedDate && (
                <Card className="lg:col-span-2 glass-card animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Seleccioná un horario para el{' '}
                      {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-AR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Horarios disponibles */}
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                        {availableSlots.map(slot => (
                          <button
                            key={slot.time}
                            onClick={() => setSelectedTime(slot.time)}
                            className={`
                              rounded-lg border px-3 py-2 text-sm font-medium transition-all
                              ${selectedTime === slot.time 
                                ? 'border-primary bg-primary text-primary-foreground' 
                                : 'border-border hover:border-primary hover:bg-accent'
                              }
                            `}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground">
                        No hay horarios disponibles para esta fecha.
                      </p>
                    )}
                    
                    {/* Modalidad */}
                    {config.modality === 'ambas' && selectedTime && (
                      <div>
                        <label className="mb-2 block text-sm font-medium">Modalidad</label>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setSelectedModality('videollamada')}
                            className={`
                              flex flex-1 items-center justify-center gap-2 rounded-lg border p-4 transition-all
                              ${selectedModality === 'videollamada' 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:border-primary'
                              }
                            `}
                          >
                            <Video className={`h-5 w-5 ${selectedModality === 'videollamada' ? 'text-primary' : ''}`} />
                            <span className="font-medium">Videollamada</span>
                          </button>
                          <button
                            onClick={() => setSelectedModality('chat')}
                            className={`
                              flex flex-1 items-center justify-center gap-2 rounded-lg border p-4 transition-all
                              ${selectedModality === 'chat' 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:border-primary'
                              }
                            `}
                          >
                            <MessageSquare className={`h-5 w-5 ${selectedModality === 'chat' ? 'text-primary' : ''}`} />
                            <span className="font-medium">Chat</span>
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Botón de confirmación */}
                    {selectedTime && (
                      <div className="flex flex-col gap-4 rounded-lg border border-primary/20 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-medium">Resumen de tu sesión</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-AR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long'
                            })} a las {selectedTime} hs - {config.sessionDuration} min - {formatPrice(professional.price)}
                          </p>
                        </div>
                        <Button 
                          onClick={handleGoToPayment}
                          className="bg-primary hover:bg-primary/90"
                          size="lg"
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Ir a pagar
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
