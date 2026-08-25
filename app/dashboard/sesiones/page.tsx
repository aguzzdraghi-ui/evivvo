"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  Calendar, 
  Clock, 
  Video, 
  MessageSquare, 
  Check,
  X,
  ExternalLink,
  AlertCircle,
  ChevronRight,
  DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/src/lib/auth-context"
import { useEvivvoStore } from "@/src/lib/store"
import { 
  sessionStatusLabels, 
  sessionStatusColors, 
  modificationReasonLabels 
} from "@/src/types/session"
import type { SessionWithDetails } from "@/src/types/session"

export default function SesionesProfesionalPage() {
  const { user } = useAuth()
  const professionalId = user?.id || "prof-3"
  const [activeTab, setActiveTab] = useState<'upcoming' | 'modifications' | 'history'>('upcoming')
  const [processingId, setProcessingId] = useState<string | null>(null)
  
  // Usar store centralizado
  const sessions = useEvivvoStore(state => state.getSessions())
  const patients = useEvivvoStore(state => state.getPatients())
  
  const now = new Date()
  
  const upcomingSessions = useMemo(() => {
    return sessions
      .filter(s => {
        if (s.profesionalId !== professionalId) return false
        const sessionDate = new Date(`${s.fecha}T${s.hora}`)
        return sessionDate > now && ['pendiente', 'confirmada'].includes(s.estado)
      })
      .map(s => {
        const patient = patients.find(p => p.id === s.pacienteId)
        return {
          id: s.id,
          professionalId: s.profesionalId,
          patientId: s.pacienteId,
          date: s.fecha,
          time: s.hora,
          duration: s.duracion,
          modality: s.modalidad,
          status: s.estado,
          price: s.precio,
          paymentStatus: s.estadoPago,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          professionalName: 'Yo',
          professionalImage: '/images/professionals/default.jpg',
          professionalTitle: 'Profesional',
          patientName: patient ? `${patient.nombre} ${patient.apellido}` : 'Paciente',
          patientEmail: patient?.email || 'sin email',
        } as SessionWithDetails
      })
  }, [sessions, patients, professionalId, now])
  
  const pastSessions = useMemo(() => {
    return sessions
      .filter(s => {
        if (s.profesionalId !== professionalId) return false
        const sessionDate = new Date(`${s.fecha}T${s.hora}`)
        return sessionDate <= now || s.estado === 'completada' || s.estado === 'cancelada'
      })
      .map(s => {
        const patient = patients.find(p => p.id === s.pacienteId)
        return {
          id: s.id,
          professionalId: s.profesionalId,
          patientId: s.pacienteId,
          date: s.fecha,
          time: s.hora,
          duration: s.duracion,
          modality: s.modalidad,
          status: s.estado,
          price: s.precio,
          paymentStatus: s.estadoPago,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          professionalName: 'Yo',
          professionalImage: '/images/professionals/default.jpg',
          professionalTitle: 'Profesional',
          patientName: patient ? `${patient.nombre} ${patient.apellido}` : 'Paciente',
          patientEmail: patient?.email || 'sin email',
        } as SessionWithDetails
      })
  }, [sessions, patients, professionalId, now])
  
  const pendingModifications: SessionWithDetails[] = [] // TODO: implementar solicitudes de modificación
  
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
  
  const handleAcceptModification = (sessionId: string) => {
    setProcessingId(sessionId)
    // Aquí se procesaría la aceptación
    console.log('[v0] Aceptando modificación para sesión:', sessionId)
    setTimeout(() => setProcessingId(null), 1000)
  }
  
  const handleRejectModification = (sessionId: string) => {
    setProcessingId(sessionId)
    // Aquí se procesaría el rechazo
    console.log('[v0] Rechazando modificación para sesión:', sessionId)
    setTimeout(() => setProcessingId(null), 1000)
  }
  
  const SessionCard = ({ session, showPayment = false }: { session: SessionWithDetails; showPayment?: boolean }) => (
    <Card className="glass-card overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Info del paciente */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
              {session.patientName.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{session.patientName}</h3>
              <p className="text-sm text-muted-foreground">{session.patientEmail}</p>
            </div>
          </div>
          
          <span className={`self-start rounded-full border px-2.5 py-0.5 text-xs font-medium ${sessionStatusColors[session.status]}`}>
            {sessionStatusLabels[session.status]}
          </span>
        </div>
        
        {/* Detalles */}
        <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-accent/50 p-3 text-sm sm:grid-cols-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(session.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{session.time} hs ({session.duration} min)</span>
          </div>
          <div className="flex items-center gap-2">
            {session.modality === 'videollamada' ? (
              <Video className="h-4 w-4 text-muted-foreground" />
            ) : (
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="capitalize">{session.modality}</span>
          </div>
          {showPayment && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className={session.paymentStatus === 'pagado' ? 'text-emerald-600' : 'text-amber-600'}>
                {session.paymentStatus === 'pagado' ? formatPrice(session.price) : 'Pendiente'}
              </span>
            </div>
          )}
        </div>
        
        {/* Solicitud de modificación */}
        {session.modificationRequest && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="mb-3">
              <p className="font-medium text-amber-800">Solicitud de modificación</p>
              <p className="text-sm text-amber-700">
                {modificationReasonLabels[session.modificationRequest.reason]}
                {session.modificationRequest.reasonNote && `: "${session.modificationRequest.reasonNote}"`}
              </p>
            </div>
            <div className="mb-3 rounded bg-white/50 p-2 text-sm">
              <p className="text-muted-foreground">Nueva fecha propuesta:</p>
              <p className="font-medium">
                {formatDate(session.modificationRequest.proposedDate)} a las {session.modificationRequest.proposedTime} hs
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleAcceptModification(session.id)}
                disabled={processingId === session.id}
              >
                <Check className="mr-1 h-4 w-4" />
                Aceptar cambio
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => handleRejectModification(session.id)}
                disabled={processingId === session.id}
              >
                <X className="mr-1 h-4 w-4" />
                Rechazar
              </Button>
            </div>
          </div>
        )}
        
        {/* Acciones para sesiones confirmadas */}
        {session.status === 'confirmada' && (
          <div className="mt-4 flex gap-2">
            {session.modality === 'videollamada' ? (
              <a href={`/sesion/${session.id}`}>
                <Button size="sm" className="bg-primary">
                  <Video className="mr-1.5 h-4 w-4" />
                  Iniciar videollamada
                </Button>
              </a>
            ) : (
              <a href={`/sesion/${session.id}?mode=chat`}>
                <Button size="sm" className="bg-primary">
                  <MessageSquare className="mr-1.5 h-4 w-4" />
                  Abrir chat
                </Button>
              </a>
            )}
          </div>
        )}
        
        {/* Notas para sesiones completadas */}
        {session.notes && (
          <div className="mt-4 rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">Notas de sesión</p>
            <p className="text-sm">{session.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mis sesiones</h1>
        <p className="text-muted-foreground">Gestioná tus sesiones programadas y solicitudes de modificación</p>
      </div>
      
      {/* Stats rápidos */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="glass-card">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{upcomingSessions.length}</p>
              <p className="text-sm text-muted-foreground">Próximas sesiones</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingModifications.length}</p>
              <p className="text-sm text-muted-foreground">Modificaciones pendientes</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pastSessions.filter(s => s.status === 'completada').length}</p>
              <p className="text-sm text-muted-foreground">Sesiones completadas</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'upcoming'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Próximas ({upcomingSessions.length})
        </button>
        <button
          onClick={() => setActiveTab('modifications')}
          className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeTab === 'modifications'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Modificaciones ({pendingModifications.length})
          {pendingModifications.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs text-white">
              {pendingModifications.length}
            </span>
          )}
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
        {activeTab === 'upcoming' && (
          upcomingSessions.length > 0 ? (
            upcomingSessions.map(session => (
              <SessionCard key={session.id} session={session} />
            ))
          ) : (
            <Card className="glass-card">
              <CardContent className="flex flex-col items-center py-12 text-center">
                <Calendar className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="mb-2 text-lg font-semibold">No tenés sesiones programadas</h3>
                <p className="text-muted-foreground">
                  Las nuevas reservas de pacientes aparecerán aquí.
                </p>
              </CardContent>
            </Card>
          )
        )}
        
        {activeTab === 'modifications' && (
          pendingModifications.length > 0 ? (
            pendingModifications.map(session => (
              <SessionCard key={session.id} session={session} />
            ))
          ) : (
            <Card className="glass-card">
              <CardContent className="flex flex-col items-center py-12 text-center">
                <Check className="mb-4 h-12 w-12 text-emerald-500/50" />
                <h3 className="mb-2 text-lg font-semibold">No hay modificaciones pendientes</h3>
                <p className="text-muted-foreground">
                  Todas las solicitudes han sido procesadas.
                </p>
              </CardContent>
            </Card>
          )
        )}
        
        {activeTab === 'history' && (
          pastSessions.length > 0 ? (
            pastSessions.map(session => (
              <SessionCard key={session.id} session={session} showPayment />
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
    </div>
  )
}
