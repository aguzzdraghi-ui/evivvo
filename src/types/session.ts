// Tipos para el sistema de sesiones de Evivvo

import type { SessionModality, SessionDuration } from './calendar'

export type SessionStatus = 
  | 'pendiente'
  | 'confirmada'
  | 'modificacion_solicitada'
  | 'modificada'
  | 'cancelada'
  | 'completada'
  | 'no_asistio_paciente'
  | 'no_asistio_profesional'

export type ModificationReason = 
  | 'no_puedo_asistir'
  | 'cambio_modalidad'
  | 'emergencia_personal'
  | 'otro'

export interface Session {
  id: string
  professionalId: string
  patientId: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  duration: SessionDuration
  modality: SessionModality
  status: SessionStatus
  price: number
  paymentStatus: 'pendiente' | 'pagado' | 'reembolsado'
  meetingLink?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ModificationRequest {
  id: string
  sessionId: string
  requestedBy: 'paciente' | 'profesional'
  requestedById: string
  reason: ModificationReason
  reasonNote?: string
  proposedDate: string
  proposedTime: string
  status: 'pendiente' | 'aceptada' | 'rechazada'
  createdAt: string
  respondedAt?: string
  respondedNote?: string
}

export interface SessionWithDetails extends Session {
  professionalName: string
  professionalImage: string
  professionalTitle: string
  patientName: string
  patientEmail: string
  modificationRequest?: ModificationRequest
}

// Helpers
export const sessionStatusLabels: Record<SessionStatus, string> = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  modificacion_solicitada: 'Modificación solicitada',
  modificada: 'Modificada',
  cancelada: 'Cancelada',
  completada: 'Completada',
  no_asistio_paciente: 'No asistió paciente',
  no_asistio_profesional: 'No asistió profesional',
}

export const sessionStatusColors: Record<SessionStatus, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmada: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  modificacion_solicitada: 'bg-amber-100 text-amber-800 border-amber-200',
  modificada: 'bg-blue-100 text-blue-800 border-blue-200',
  cancelada: 'bg-red-100 text-red-800 border-red-200',
  completada: 'bg-gray-100 text-gray-800 border-gray-200',
  no_asistio_paciente: 'bg-red-100 text-red-800 border-red-200',
  no_asistio_profesional: 'bg-red-100 text-red-800 border-red-200',
}

export const modificationReasonLabels: Record<ModificationReason, string> = {
  no_puedo_asistir: 'No puedo asistir en ese horario',
  cambio_modalidad: 'Necesito cambiar la modalidad',
  emergencia_personal: 'Emergencia personal',
  otro: 'Otro motivo',
}

// Generar link de Google Calendar
export function generateGoogleCalendarLink(session: SessionWithDetails): string {
  const startDate = new Date(`${session.date}T${session.time}:00`)
  const endDate = new Date(startDate.getTime() + session.duration * 60000)
  
  const formatDate = (d: Date) => d.toISOString().replace(/-|:|\.\d{3}/g, '')
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Sesión Evivvo con ${session.professionalName}`,
    details: `Sesión confidencial de ${session.duration} minutos a través de Evivvo.\n\nModalidad: ${session.modality === 'videollamada' ? 'Videollamada' : 'Chat'}\n\nRecordá que las modificaciones deben solicitarse con al menos 12 horas de anticipación.`,
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
    ctz: 'America/Argentina/Buenos_Aires',
  })
  
  if (session.meetingLink) {
    params.set('location', session.meetingLink)
  }
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
