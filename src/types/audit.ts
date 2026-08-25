// Tipos para el sistema de auditoría de Evivvo

export type AuditAction = 
  | 'horario_disponible'
  | 'horario_cerrado'
  | 'sesion_reservada'
  | 'sesion_confirmada'
  | 'modificacion_solicitada'
  | 'modificacion_aceptada'
  | 'modificacion_rechazada'
  | 'sesion_cancelada'
  | 'sesion_completada'
  | 'admin_abrio_fecha'
  | 'admin_cerro_fecha'
  | 'admin_bloqueo_horario'
  | 'admin_libero_horario'
  | 'config_actualizada'

export type AuditUserRole = 'paciente' | 'profesional' | 'admin'

export interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  userRole: AuditUserRole
  action: AuditAction
  professionalId?: string
  professionalName?: string
  sessionId?: string
  previousValue?: string
  newValue?: string
  reason?: string
  metadata?: Record<string, unknown>
}

export const auditActionLabels: Record<AuditAction, string> = {
  horario_disponible: 'Marcó horario disponible',
  horario_cerrado: 'Cerró horario',
  sesion_reservada: 'Reservó sesión',
  sesion_confirmada: 'Confirmó sesión',
  modificacion_solicitada: 'Solicitó modificación',
  modificacion_aceptada: 'Aceptó modificación',
  modificacion_rechazada: 'Rechazó modificación',
  sesion_cancelada: 'Canceló sesión',
  sesion_completada: 'Completó sesión',
  admin_abrio_fecha: 'Abrió fecha (Admin)',
  admin_cerro_fecha: 'Cerró fecha (Admin)',
  admin_bloqueo_horario: 'Bloqueó horario (Admin)',
  admin_libero_horario: 'Liberó horario (Admin)',
  config_actualizada: 'Actualizó configuración',
}

export const auditActionColors: Record<AuditAction, string> = {
  horario_disponible: 'bg-emerald-100 text-emerald-800',
  horario_cerrado: 'bg-gray-100 text-gray-800',
  sesion_reservada: 'bg-blue-100 text-blue-800',
  sesion_confirmada: 'bg-emerald-100 text-emerald-800',
  modificacion_solicitada: 'bg-amber-100 text-amber-800',
  modificacion_aceptada: 'bg-emerald-100 text-emerald-800',
  modificacion_rechazada: 'bg-red-100 text-red-800',
  sesion_cancelada: 'bg-red-100 text-red-800',
  sesion_completada: 'bg-gray-100 text-gray-800',
  admin_abrio_fecha: 'bg-purple-100 text-purple-800',
  admin_cerro_fecha: 'bg-purple-100 text-purple-800',
  admin_bloqueo_horario: 'bg-purple-100 text-purple-800',
  admin_libero_horario: 'bg-purple-100 text-purple-800',
  config_actualizada: 'bg-blue-100 text-blue-800',
}

export type AdminCalendarReason = 
  | 'solicitud_profesional'
  | 'incumplimiento_politica'
  | 'revision_interna'
  | 'error_disponibilidad'
  | 'otro'

export const adminReasonLabels: Record<AdminCalendarReason, string> = {
  solicitud_profesional: 'Solicitud del profesional',
  incumplimiento_politica: 'Incumplimiento de política',
  revision_interna: 'Revisión interna',
  error_disponibilidad: 'Error de disponibilidad',
  otro: 'Otro',
}
