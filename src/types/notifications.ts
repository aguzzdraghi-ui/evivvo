// Tipos para el sistema de notificaciones de Evivvo

import type { SessionWithDetails, ModificationRequest } from './session'

export type NotificationType = 
  | 'confirmacion_sesion'
  | 'recordatorio_1h'
  | 'solicitud_modificacion'
  | 'confirmacion_modificacion'
  | 'cancelacion_sesion'
  | 'sesion_completada'

export interface EmailTemplate {
  type: NotificationType
  to: string
  subject: string
  preheader: string
  body: EmailBody
}

export interface EmailBody {
  greeting: string
  mainContent: string
  sessionDetails?: SessionEmailDetails
  ctaButtons?: EmailCTA[]
  footer: string
}

export interface SessionEmailDetails {
  professionalName: string
  patientName: string
  date: string
  time: string
  duration: number
  modality: string
  meetingLink?: string
}

export interface EmailCTA {
  text: string
  url: string
  variant: 'primary' | 'secondary'
}

// Templates de email (para futura integración con Resend/SendGrid)
export function generateConfirmationEmail(session: SessionWithDetails, recipientType: 'paciente' | 'profesional'): EmailTemplate {
  const isPaciente = recipientType === 'paciente'
  const otherPartyName = isPaciente ? session.professionalName : session.patientName
  
  return {
    type: 'confirmacion_sesion',
    to: isPaciente ? session.patientEmail : '', // Se completaría con email del profesional
    subject: 'Tu sesión en Evivvo fue confirmada',
    preheader: `Tu sesión con ${otherPartyName} está programada para el ${formatDate(session.date)} a las ${session.time}`,
    body: {
      greeting: `Hola ${isPaciente ? session.patientName : session.professionalName}`,
      mainContent: `Tu sesión ha sido confirmada exitosamente. A continuación encontrarás los detalles:`,
      sessionDetails: {
        professionalName: session.professionalName,
        patientName: session.patientName,
        date: formatDate(session.date),
        time: session.time,
        duration: session.duration,
        modality: session.modality === 'videollamada' ? 'Videollamada' : 'Chat',
        meetingLink: session.meetingLink,
      },
      ctaButtons: [
        {
          text: 'Agregar a Google Calendar',
          url: '#', // Se generaría con generateGoogleCalendarLink
          variant: 'primary',
        },
        {
          text: 'Ver detalles de la sesión',
          url: `/mi-cuenta/sesiones/${session.id}`,
          variant: 'secondary',
        },
      ],
      footer: 'Recordá que las modificaciones deben solicitarse con al menos 12 horas de anticipación según la política de Evivvo.',
    },
  }
}

export function generateReminderEmail(session: SessionWithDetails, recipientType: 'paciente' | 'profesional'): EmailTemplate {
  const isPaciente = recipientType === 'paciente'
  const otherPartyName = isPaciente ? session.professionalName : session.patientName
  
  return {
    type: 'recordatorio_1h',
    to: isPaciente ? session.patientEmail : '',
    subject: 'Tu sesión en Evivvo comienza en 1 hora',
    preheader: `Prepárate para tu sesión con ${otherPartyName}`,
    body: {
      greeting: `Hola ${isPaciente ? session.patientName : session.professionalName}`,
      mainContent: `Tu sesión comienza en 1 hora. Asegurate de estar en un lugar tranquilo y con buena conexión a internet.`,
      sessionDetails: {
        professionalName: session.professionalName,
        patientName: session.patientName,
        date: formatDate(session.date),
        time: session.time,
        duration: session.duration,
        modality: session.modality === 'videollamada' ? 'Videollamada' : 'Chat',
        meetingLink: session.meetingLink,
      },
      ctaButtons: [
        {
          text: 'Ingresar a la sesión',
          url: session.meetingLink || '#',
          variant: 'primary',
        },
      ],
      footer: 'Tu privacidad es importante. Toda la información compartida en la sesión es confidencial.',
    },
  }
}

export function generateModificationRequestEmail(
  session: SessionWithDetails, 
  modification: ModificationRequest,
  recipientType: 'paciente' | 'profesional'
): EmailTemplate {
  return {
    type: 'solicitud_modificacion',
    to: '',
    subject: 'Solicitud de modificación de sesión',
    preheader: `Se ha solicitado modificar tu sesión del ${formatDate(session.date)}`,
    body: {
      greeting: `Hola`,
      mainContent: `Se ha solicitado modificar la sesión programada. Nueva fecha propuesta: ${formatDate(modification.proposedDate)} a las ${modification.proposedTime}.`,
      sessionDetails: {
        professionalName: session.professionalName,
        patientName: session.patientName,
        date: formatDate(modification.proposedDate),
        time: modification.proposedTime,
        duration: session.duration,
        modality: session.modality === 'videollamada' ? 'Videollamada' : 'Chat',
      },
      ctaButtons: [
        {
          text: 'Aceptar cambio',
          url: `/mi-cuenta/sesiones/${session.id}/modificacion/aceptar`,
          variant: 'primary',
        },
        {
          text: 'Rechazar cambio',
          url: `/mi-cuenta/sesiones/${session.id}/modificacion/rechazar`,
          variant: 'secondary',
        },
      ],
      footer: 'Si no respondés en 24 horas, la sesión original se mantendrá sin cambios.',
    },
  }
}

// Helper para formatear fecha
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
