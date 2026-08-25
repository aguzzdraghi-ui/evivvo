"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  Calendar, 
  Clock, 
  Video, 
  MessageSquare, 
  ExternalLink,
  Edit,
  ChevronRight,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar, Footer } from "@/src/components/landing"
import { useEvivvoStore } from "@/src/lib/store"
import { sessionStatusLabels, sessionStatusColors, generateGoogleCalendarLink } from "@/src/types/session"
import type { SessionWithDetails } from "@/src/types/session"

export default function MisSesionesPage() {
  const patientId = "pac-1"
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming')
  const [showModifyModal, setShowModifyModal] = useState<string | null>(null)
  
  // Usar store centralizado
  const sessions = useEvivvoStore(state => state.getSessions())
  const getProfessionalById = useEvivvoStore(state => state.getProfessionalById)
  
  // Filtrar sesiones del paciente
  const patientSessions = sessions.filter(s => s.pacienteId === patientId)
  const now = new Date()
  
  const upcomingSessions = patientSessions
    .filter(s => {
      const sessionDate = new Date(`${s.fecha}T${s.hora}`)
      return sessionDate > now && ['pendiente', 'confirmada'].includes(s.estado)
    })
    .map(s => {
      const prof = getProfessionalById(s.profesionalId)
      return {
        id: s.id,
        professionalId: s.profesionalId,
        patientId: s.pacienteId,
        date: s.fecha,
        time: s.hora,
        duration: s.duracion,
        modality: s.modalidad,
        status: s.estado as 'pendiente' | 'confirmada',
        price: s.precio,
        paymentStatus: s.estadoPago,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        professionalName: prof ? `${prof.nombre} ${prof.apellido}` : 'Profesional',
        professionalImage: prof?.foto || '/images/professionals/default.jpg',
        professionalTitle: prof?.tipo === 'psicologo' ? 'Psicólogo/a' : prof?.tipo === 'coach' ? 'Coach' : 'Terapeuta',
        patientName: 'Usuario',
        patientEmail: 'usuario@email.com',
      } as SessionWithDetails
    })
  
  const pastSessions = patientSessions
    .filter(s => {
      const sessionDate = new Date(`${s.fecha}T${s.hora}`)
      return sessionDate <= now || s.estado === 'completada' || s.estado === 'cancelada'
    })
    .map(s => {
      const prof = getProfessionalById(s.profesionalId)
      return {
        id: s.id,
        professionalId: s.profesionalId,
        patientId: s.pacienteId,
        date: s.fecha,
        time: s.hora,
        duration: s.duracion,
        modality: s.modalidad,
        status: s.estado as 'completada' | 'cancelada',
        price: s.precio,
        paymentStatus: s.estadoPago,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        professionalName: prof ? `${prof.nombre} ${prof.apellido}` : 'Profesional',
        professionalImage: prof?.foto || '/images/professionals/default.jpg',
        professionalTitle: prof?.tipo === 'psicologo' ? 'Psicólogo/a' : prof?.tipo === 'coach' ? 'Coach' : 'Terapeuta',
        patientName: 'Usuario',
        patientEmail: 'usuario@email.com',
      } as SessionWithDetails
    })
  
  // Usar directamente las sesiones del store
  const allUpcoming = upcomingSessions
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(price)
  }
  
  const canModify = (session: SessionWithDetails) => {
    const sessionDateTime = new Date(`${session.date}T${session.time}:00`)
    const now = new Date()
    const hoursUntil = (sessionDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursUntil >= 12 && session.status !== 'modificacion_solicitada'
  }
  
  const SessionCard = ({ session, showActions = true }: { session: SessionWithDetails; showActions?: boolean }) => (
    <Card className="glass-card overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Imagen del profesional */}
          <div className="relative h-32 w-full sm:h-auto sm:w-32 flex-shrink-0">
            <Image
              src={session.professionalImage}
              alt={session.professionalName}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="flex flex-1 flex-col p-4">
            {/* Header */}
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{session.professionalName}</h3>
                <p className="text-sm text-muted-foreground">{session.professionalTitle}</p>
              </div>
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${sessionStatusColors[session.status]}`}>
                {sessionStatusLabels[session.status]}
              </span>
            </div>
            
            {/* Detalles */}
            <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(session.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{session.time} hs ({session.duration} min)</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                {session.modality === 'videollamada' ? (
                  <Video className="h-4 w-4" />
                ) : (
                  <MessageSquare className="h-4 w-4" />
                )}
                <span className="capitalize">{session.modality}</span>
              </div>
              <div className="font-medium text-foreground">
                {formatPrice(session.price)}
              </div>
            </div>
            
            {/* Alerta de modificación pendiente */}
            {session.modificationRequest && (
              <div className="mb-3 rounded-lg bg-amber-50 p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">Modificación solicitada</p>
                    <p className="text-amber-700">
                      Nueva fecha propuesta: {formatDate(session.modificationRequest.proposedDate)} a las {session.modificationRequest.proposedTime} hs
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Acciones */}
            {showActions && session.status !== 'completada' && session.status !== 'cancelada' && (
              <div className="mt-auto flex flex-wrap gap-2">
                {session.modality === 'videollamada' && (
                  <Link href={`/sesion/${session.id}`}>
                    <Button size="sm" className="bg-primary">
                      <Video className="mr-1.5 h-4 w-4" />
                      Ingresar a sesión
                    </Button>
                  </Link>
                )}
                {session.modality === 'chat' && (
                  <Link href={`/sesion/${session.id}?mode=chat`}>
                    <Button size="sm" className="bg-primary">
                      <MessageSquare className="mr-1.5 h-4 w-4" />
                      Abrir chat
                    </Button>
                  </Link>
                )}
                <a href={generateGoogleCalendarLink(session)} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline">
                    <Calendar className="mr-1.5 h-4 w-4" />
                    Agregar a calendario
                  </Button>
                </a>
                {canModify(session) && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowModifyModal(session.id)}
                  >
                    <Edit className="mr-1.5 h-4 w-4" />
                    Solicitar modificación
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Mis sesiones</h1>
            <p className="text-muted-foreground">Gestioná tus sesiones programadas y revisá tu historial</p>
          </div>
          
          {/* Tabs */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Próximas ({allUpcoming.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Historial ({pastSessions.length})
            </button>
          </div>
          
          {/* Lista de sesiones */}
          <div className="space-y-4">
            {activeTab === 'upcoming' ? (
              allUpcoming.length > 0 ? (
                allUpcoming.map(session => (
                  <SessionCard key={session.id} session={session} />
                ))
              ) : (
                <Card className="glass-card">
                  <CardContent className="flex flex-col items-center py-12 text-center">
                    <Calendar className="mb-4 h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mb-2 text-lg font-semibold">No tenés sesiones programadas</h3>
                    <p className="mb-4 text-muted-foreground">
                      Explorá nuestros profesionales y agendá tu primera sesión.
                    </p>
                    <Link href="/profesionales">
                      <Button>
                        Ver profesionales
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            ) : (
              pastSessions.length > 0 ? (
                pastSessions.map(session => (
                  <SessionCard key={session.id} session={session} showActions={false} />
                ))
              ) : (
                <Card className="glass-card">
                  <CardContent className="flex flex-col items-center py-12 text-center">
                    <Clock className="mb-4 h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mb-2 text-lg font-semibold">Sin historial de sesiones</h3>
                    <p className="text-muted-foreground">
                      Tus sesiones completadas aparecerán aquí.
                    </p>
                  </CardContent>
                </Card>
              )
            )}
          </div>
          
          {/* Info sobre política de modificación */}
          <Card className="mt-8 border-amber-200 bg-amber-50">
            <CardContent className="flex gap-4 py-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Política de modificación de Evivvo</p>
                <p className="text-sm text-amber-700">
                  Las modificaciones de sesiones deben solicitarse con al menos 12 horas de anticipación. 
                  Para casos excepcionales, podés contactar a soporte.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
      
      {/* Modal de modificación (simplificado para MVP) */}
      {showModifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="mx-4 w-full max-w-md">
            <CardHeader>
              <CardTitle>Solicitar modificación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Esta funcionalidad estará disponible próximamente. Por ahora, contactá a soporte 
                para solicitar cambios en tu sesión.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowModifyModal(null)}>
                  Cerrar
                </Button>
                <Link href="/contacto">
                  <Button>Contactar soporte</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
