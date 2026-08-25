// Datos mock de sesiones para Evivvo

import type { Session, SessionWithDetails, ModificationRequest } from '@/src/types/session'
import { professionals } from './professionals'

// Pacientes mock
export const mockPatients = [
  { id: 'p1', name: 'Juan Pérez', email: 'juan.perez@email.com' },
  { id: 'p2', name: 'María García', email: 'maria.garcia@email.com' },
  { id: 'p3', name: 'Carlos López', email: 'carlos.lopez@email.com' },
  { id: 'p4', name: 'Ana Martínez', email: 'ana.martinez@email.com' },
]

// Sesiones mock
export const sessions: Session[] = [
  {
    id: 's1',
    professionalId: '1',
    patientId: 'p1',
    date: '2026-05-07',
    time: '10:00',
    duration: 45,
    modality: 'videollamada',
    status: 'confirmada',
    price: 18500,
    paymentStatus: 'pagado',
    meetingLink: 'https://meet.evivvo.com/session/s1',
    createdAt: '2026-05-04T14:30:00Z',
    updatedAt: '2026-05-04T14:30:00Z',
  },
  {
    id: 's2',
    professionalId: '1',
    patientId: 'p2',
    date: '2026-05-07',
    time: '11:00',
    duration: 45,
    modality: 'videollamada',
    status: 'confirmada',
    price: 18500,
    paymentStatus: 'pagado',
    meetingLink: 'https://meet.evivvo.com/session/s2',
    createdAt: '2026-05-03T10:00:00Z',
    updatedAt: '2026-05-03T10:00:00Z',
  },
  {
    id: 's3',
    professionalId: '2',
    patientId: 'p1',
    date: '2026-05-08',
    time: '15:00',
    duration: 60,
    modality: 'videollamada',
    status: 'modificacion_solicitada',
    price: 22000,
    paymentStatus: 'pagado',
    meetingLink: 'https://meet.evivvo.com/session/s3',
    createdAt: '2026-05-02T09:00:00Z',
    updatedAt: '2026-05-05T16:00:00Z',
  },
  {
    id: 's4',
    professionalId: '3',
    patientId: 'p3',
    date: '2026-05-06',
    time: '14:00',
    duration: 45,
    modality: 'chat',
    status: 'completada',
    price: 16500,
    paymentStatus: 'pagado',
    notes: 'Paciente mostró mejora en manejo de ansiedad.',
    createdAt: '2026-05-01T11:00:00Z',
    updatedAt: '2026-05-06T15:00:00Z',
  },
  {
    id: 's5',
    professionalId: '4',
    patientId: 'p4',
    date: '2026-05-09',
    time: '09:00',
    duration: 30,
    modality: 'videollamada',
    status: 'pendiente',
    price: 14999,
    paymentStatus: 'pendiente',
    createdAt: '2026-05-05T18:00:00Z',
    updatedAt: '2026-05-05T18:00:00Z',
  },
  {
    id: 's6',
    professionalId: '5',
    patientId: 'p1',
    date: '2026-05-05',
    time: '16:00',
    duration: 60,
    modality: 'videollamada',
    status: 'cancelada',
    price: 25000,
    paymentStatus: 'reembolsado',
    createdAt: '2026-04-28T12:00:00Z',
    updatedAt: '2026-05-04T10:00:00Z',
  },
  {
    id: 's7',
    professionalId: '1',
    patientId: 'p3',
    date: '2026-05-10',
    time: '12:00',
    duration: 45,
    modality: 'videollamada',
    status: 'confirmada',
    price: 18500,
    paymentStatus: 'pagado',
    meetingLink: 'https://meet.evivvo.com/session/s7',
    createdAt: '2026-05-05T20:00:00Z',
    updatedAt: '2026-05-05T20:00:00Z',
  },
]

// Solicitudes de modificación mock
export const modificationRequests: ModificationRequest[] = [
  {
    id: 'm1',
    sessionId: 's3',
    requestedBy: 'paciente',
    requestedById: 'p1',
    reason: 'no_puedo_asistir',
    reasonNote: 'Tengo una reunión de trabajo que no puedo mover.',
    proposedDate: '2026-05-09',
    proposedTime: '15:00',
    status: 'pendiente',
    createdAt: '2026-05-05T16:00:00Z',
  },
]

// Helpers
export function getSessionById(id: string): Session | undefined {
  return sessions.find(s => s.id === id)
}

export function getSessionWithDetails(id: string): SessionWithDetails | undefined {
  const session = getSessionById(id)
  if (!session) return undefined
  
  const professional = professionals.find(p => p.id === session.professionalId)
  const patient = mockPatients.find(p => p.id === session.patientId)
  const modRequest = modificationRequests.find(m => m.sessionId === id && m.status === 'pendiente')
  
  if (!professional || !patient) return undefined
  
  return {
    ...session,
    professionalName: professional.name,
    professionalImage: professional.image,
    professionalTitle: professional.title,
    patientName: patient.name,
    patientEmail: patient.email,
    modificationRequest: modRequest,
  }
}

export function getSessionsByProfessional(professionalId: string): SessionWithDetails[] {
  return sessions
    .filter(s => s.professionalId === professionalId)
    .map(s => getSessionWithDetails(s.id)!)
    .filter(Boolean)
}

export function getSessionsByPatient(patientId: string): SessionWithDetails[] {
  return sessions
    .filter(s => s.patientId === patientId)
    .map(s => getSessionWithDetails(s.id)!)
    .filter(Boolean)
}

export function getUpcomingSessions(userId: string, role: 'professional' | 'patient'): SessionWithDetails[] {
  const today = new Date().toISOString().split('T')[0]
  return sessions
    .filter(s => {
      const isOwner = role === 'professional' 
        ? s.professionalId === userId 
        : s.patientId === userId
      const isUpcoming = s.date >= today
      const isActive = ['pendiente', 'confirmada', 'modificacion_solicitada'].includes(s.status)
      return isOwner && isUpcoming && isActive
    })
    .map(s => getSessionWithDetails(s.id)!)
    .filter(Boolean)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
}

export function getPastSessions(userId: string, role: 'professional' | 'patient'): SessionWithDetails[] {
  const today = new Date().toISOString().split('T')[0]
  return sessions
    .filter(s => {
      const isOwner = role === 'professional' 
        ? s.professionalId === userId 
        : s.patientId === userId
      const isPast = s.date < today || s.status === 'completada'
      return isOwner && isPast
    })
    .map(s => getSessionWithDetails(s.id)!)
    .filter(Boolean)
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`))
}

export function getPendingModifications(professionalId: string): SessionWithDetails[] {
  return sessions
    .filter(s => s.professionalId === professionalId && s.status === 'modificacion_solicitada')
    .map(s => getSessionWithDetails(s.id)!)
    .filter(Boolean)
}
