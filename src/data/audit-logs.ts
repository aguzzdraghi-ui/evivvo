// Datos mock de logs de auditoría para Evivvo

import type { AuditLog } from '@/src/types/audit'

export const auditLogs: AuditLog[] = [
  {
    id: 'a1',
    timestamp: '2026-05-06T10:30:00Z',
    userId: '1',
    userName: 'Dra. María González',
    userRole: 'profesional',
    action: 'horario_disponible',
    professionalId: '1',
    professionalName: 'Dra. María González',
    previousValue: 'No disponible',
    newValue: 'Disponible 09:00-13:00',
  },
  {
    id: 'a2',
    timestamp: '2026-05-06T09:15:00Z',
    userId: 'p1',
    userName: 'Juan Pérez',
    userRole: 'paciente',
    action: 'sesion_reservada',
    professionalId: '1',
    professionalName: 'Dra. María González',
    sessionId: 's1',
    newValue: '2026-05-07 10:00 - Videollamada 45min',
  },
  {
    id: 'a3',
    timestamp: '2026-05-05T16:00:00Z',
    userId: 'p1',
    userName: 'Juan Pérez',
    userRole: 'paciente',
    action: 'modificacion_solicitada',
    professionalId: '2',
    professionalName: 'Dr. Carlos Mendoza',
    sessionId: 's3',
    previousValue: '2026-05-08 15:00',
    newValue: '2026-05-09 15:00',
    reason: 'No puedo asistir en ese horario',
  },
  {
    id: 'a4',
    timestamp: '2026-05-05T14:30:00Z',
    userId: 'admin1',
    userName: 'Admin Evivvo',
    userRole: 'admin',
    action: 'admin_cerro_fecha',
    professionalId: '1',
    professionalName: 'Dra. María González',
    newValue: '2026-05-25 (Feriado)',
    reason: 'Día de la Revolución de Mayo - Feriado nacional',
  },
  {
    id: 'a5',
    timestamp: '2026-05-04T11:00:00Z',
    userId: '2',
    userName: 'Dr. Carlos Mendoza',
    userRole: 'profesional',
    action: 'config_actualizada',
    professionalId: '2',
    professionalName: 'Dr. Carlos Mendoza',
    previousValue: 'Preaviso: 12h',
    newValue: 'Preaviso: 24h',
  },
  {
    id: 'a6',
    timestamp: '2026-05-04T10:00:00Z',
    userId: 'p1',
    userName: 'Juan Pérez',
    userRole: 'paciente',
    action: 'sesion_cancelada',
    professionalId: '5',
    professionalName: 'Dra. Laura Martínez',
    sessionId: 's6',
    previousValue: 'Confirmada',
    newValue: 'Cancelada',
    reason: 'Emergencia personal',
  },
  {
    id: 'a7',
    timestamp: '2026-05-03T10:00:00Z',
    userId: 'p2',
    userName: 'María García',
    userRole: 'paciente',
    action: 'sesion_reservada',
    professionalId: '1',
    professionalName: 'Dra. María González',
    sessionId: 's2',
    newValue: '2026-05-07 11:00 - Videollamada 45min',
  },
  {
    id: 'a8',
    timestamp: '2026-05-02T15:00:00Z',
    userId: '3',
    userName: 'Lic. Ana Rodríguez',
    userRole: 'profesional',
    action: 'sesion_completada',
    professionalId: '3',
    professionalName: 'Lic. Ana Rodríguez',
    sessionId: 's4',
  },
  {
    id: 'a9',
    timestamp: '2026-05-01T10:00:00Z',
    userId: '1',
    userName: 'Dra. María González',
    userRole: 'profesional',
    action: 'horario_cerrado',
    professionalId: '1',
    professionalName: 'Dra. María González',
    newValue: '2026-05-15 (Personal)',
    reason: 'Día personal',
  },
  {
    id: 'a10',
    timestamp: '2026-04-30T09:00:00Z',
    userId: 'admin1',
    userName: 'Admin Evivvo',
    userRole: 'admin',
    action: 'admin_abrio_fecha',
    professionalId: '4',
    professionalName: 'Valentina Torres',
    previousValue: 'Bloqueado',
    newValue: 'Disponible',
    reason: 'Solicitud del profesional',
  },
]

// Helpers
export function getAuditLogs(filters?: {
  professionalId?: string
  action?: string
  userRole?: string
  dateFrom?: string
  dateTo?: string
}): AuditLog[] {
  let filtered = [...auditLogs]
  
  if (filters?.professionalId) {
    filtered = filtered.filter(l => l.professionalId === filters.professionalId)
  }
  
  if (filters?.action) {
    filtered = filtered.filter(l => l.action === filters.action)
  }
  
  if (filters?.userRole) {
    filtered = filtered.filter(l => l.userRole === filters.userRole)
  }
  
  if (filters?.dateFrom) {
    filtered = filtered.filter(l => l.timestamp >= filters.dateFrom!)
  }
  
  if (filters?.dateTo) {
    filtered = filtered.filter(l => l.timestamp <= filters.dateTo!)
  }
  
  return filtered.sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}

export function getRecentAuditLogs(limit: number = 10): AuditLog[] {
  return auditLogs
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, limit)
}

export function getAuditLogsBySession(sessionId: string): AuditLog[] {
  return auditLogs
    .filter(l => l.sessionId === sessionId)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
}
