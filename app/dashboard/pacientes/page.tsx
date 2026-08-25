"use client"

import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/src/lib/auth-context"
import { useEvivvoStore, type PatientProfessionalNote } from "@/src/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Video,
  Clock,
  ChevronRight,
  Heart,
  User,
  Star,
  FileText
} from "lucide-react"

export default function PacientesPage() {
  const { user } = useAuth()
  const sessions = useEvivvoStore(state => state.getSessions())
  const patients = useEvivvoStore(state => state.getPatients())
  const [patientNotes, setPatientNotes] = useState<PatientProfessionalNote[]>([])
  
  const professionalId = user?.id || "prof-3"
  
  // Cargar valoraciones privadas
  useEffect(() => {
    const saved = localStorage.getItem('evivvo_patient_professional_notes')
    if (saved) {
      setPatientNotes(JSON.parse(saved))
    }
  }, [])

  // Obtener pacientes únicos vinculados al profesional
  const myPatients = useMemo(() => {
    const professionalSessions = sessions.filter(s => s.profesionalId === professionalId)
    const patientIds = [...new Set(professionalSessions.map(s => s.pacienteId))]
    
    return patientIds.map(patientId => {
      const patient = patients.find(p => p.id === patientId)
      const patientSessions = professionalSessions.filter(s => s.pacienteId === patientId)
      
      const completedSessions = patientSessions.filter(s => s.estado === 'completada')
      const upcomingSessions = patientSessions.filter(s => 
        s.estado === 'pendiente' || s.estado === 'confirmada'
      ).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      
      const lastSession = completedSessions.sort((a, b) => 
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      )[0]

      // Estado del paciente
      let status: 'activo' | 'sin_sesiones' | 'finalizado' = 'activo'
      if (upcomingSessions.length === 0 && completedSessions.length === 0) {
        status = 'sin_sesiones'
      } else if (upcomingSessions.length === 0 && completedSessions.length > 0) {
        // Si la última sesión fue hace más de 30 días, considerarlo finalizado
        const daysSinceLastSession = lastSession 
          ? Math.floor((Date.now() - new Date(lastSession.fecha).getTime()) / (1000 * 60 * 60 * 24))
          : 999
        if (daysSinceLastSession > 30) {
          status = 'finalizado'
        }
      }

      // Obtener notas privadas del paciente
      const notes = patientNotes.filter(n => n.pacienteId === patientId && n.profesionalId === professionalId)
      const avgScore = notes.length > 0 
        ? notes.reduce((acc, n) => acc + n.puntuacionInterna, 0) / notes.length 
        : null
      
      // Obtener promedio de bienestar de sesiones completadas
      const bienestarSessions = completedSessions.filter(s => s.bienestarFin !== undefined)
      const avgBienestar = bienestarSessions.length > 0
        ? bienestarSessions.reduce((acc, s) => acc + (s.bienestarFin || 0), 0) / bienestarSessions.length
        : null

      return {
        id: patientId,
        nombre: patient?.nombre || 'Paciente',
        apellido: patient?.apellido || '',
        email: patient?.email || 'sin email',
        foto: patient?.foto,
        totalSessions: patientSessions.length,
        completedSessions: completedSessions.length,
        upcomingSessions,
        nextSession: upcomingSessions[0],
        lastSession,
        status,
        evaHistory: patient?.evaHistory || [],
        lastEmotion: patient?.evaHistory?.length 
          ? patient.evaHistory[patient.evaHistory.length - 1].emociones[0]
          : null,
        avgInternalScore: avgScore,
        avgBienestar,
        notesCount: notes.length,
      }
    }).filter(p => p.totalSessions > 0) // Solo mostrar pacientes con al menos una sesión
  }, [sessions, patients, professionalId, patientNotes])

  const activePatients = myPatients.filter(p => p.status === 'activo')
  const inactivePatients = myPatients.filter(p => p.status !== 'activo')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'activo':
        return <Badge className="bg-emerald-100 text-emerald-700">Activo</Badge>
      case 'sin_sesiones':
        return <Badge variant="outline" className="text-muted-foreground">Sin sesiones</Badge>
      case 'finalizado':
        return <Badge variant="outline" className="text-amber-600">Finalizado</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mis pacientes</h1>
        <p className="text-muted-foreground">
          Gestiona tu cartera de pacientes y revisa su historial
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{myPatients.length}</p>
              <p className="text-sm text-muted-foreground">Total pacientes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <Heart className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activePatients.length}</p>
              <p className="text-sm text-muted-foreground">Pacientes activos</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {myPatients.reduce((acc, p) => acc + p.upcomingSessions.length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Próximas sesiones</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty state */}
      {myPatients.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Aún no tenés pacientes asignados</h3>
            <p className="mb-6 text-muted-foreground">
              Cuando recibas reservas o sesiones, aparecerán aquí.
            </p>
            <Link href="/profesionales">
              <Button>Ver mi perfil público</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Active Patients */}
      {activePatients.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Pacientes activos</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activePatients.map(patient => (
              <Card key={patient.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">
                          {patient.nombre} {patient.apellido}
                        </h3>
                        {getStatusBadge(patient.status)}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{patient.email}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-muted/50 p-2 text-center">
                      <p className="font-semibold">{patient.completedSessions}</p>
                      <p className="text-xs text-muted-foreground">Sesiones</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2 text-center">
                      <p className="font-semibold">{patient.evaHistory.length}</p>
                      <p className="text-xs text-muted-foreground">Chats EVA</p>
                    </div>
                  </div>

                  {/* Next session */}
                  {patient.nextSession && (
                    <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium">Próxima sesión</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(patient.nextSession.fecha).toLocaleDateString('es-AR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'short'
                        })} a las {patient.nextSession.hora}
                      </p>
                    </div>
                  )}

                  {/* Last emotion */}
                  {patient.lastEmotion && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>Última emoción: <span className="capitalize">{patient.lastEmotion}</span></span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex gap-2">
                    {patient.nextSession && (
                      <Link href={`/sesion/${patient.nextSession.id}`} className="flex-1">
                        <Button size="sm" className="w-full gap-1">
                          <Video className="h-4 w-4" />
                          Unirse
                        </Button>
                      </Link>
                    )}
                    <Button size="sm" variant="outline" className="gap-1">
                      <ChevronRight className="h-4 w-4" />
                      Ver historial
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Inactive Patients */}
      {inactivePatients.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-muted-foreground">
            Pacientes sin actividad reciente
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inactivePatients.map(patient => (
              <Card key={patient.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium truncate">
                          {patient.nombre} {patient.apellido}
                        </h3>
                        {getStatusBadge(patient.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{patient.completedSessions} sesiones</p>
                    </div>
                  </div>

                  {patient.lastSession && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Última sesión: {new Date(patient.lastSession.fecha).toLocaleDateString('es-AR')}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
