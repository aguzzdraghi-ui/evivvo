// Sistema de derivaciones internas controladas por Evivvo
// Los profesionales NO pueden derivar directamente a perfiles específicos

export type ReferralType = 'coach' | 'psychologist' | 'psychiatrist'

export type ReferralStatus = 
  | 'pending' // Sugerencia pendiente de mostrar al paciente
  | 'shown' // Mostrada al paciente
  | 'accepted' // Paciente aceptó ver profesionales
  | 'scheduled' // Paciente agendó con un profesional recomendado
  | 'rejected' // Paciente rechazó la sugerencia
  | 'expired' // Expiró sin acción

export type ReferralReason =
  | 'psychiatric_evaluation' // Evaluación psiquiátrica
  | 'medication_management' // Manejo farmacológico
  | 'deep_therapy' // Terapia profunda
  | 'coaching_support' // Apoyo de coaching
  | 'crisis_intervention' // Intervención en crisis
  | 'specialized_treatment' // Tratamiento especializado
  | 'complementary_support' // Apoyo complementario

export interface Referral {
  id: string
  
  // Paciente
  patientId: string
  patientName: string
  
  // Profesional que sugiere (NO deriva directamente)
  suggestingProfessionalId: string
  suggestingProfessionalName: string
  suggestingProfessionalType: 'psychologist' | 'coach' | 'psychiatrist'
  
  // Tipo de apoyo sugerido
  recommendedType: ReferralType
  reason: ReferralReason
  reasonDescription: string // Descripción del profesional
  
  // Contexto emocional del paciente al momento
  emotionalContext: string
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical'
  
  // Profesionales recomendados por Evivvo (NO por el profesional que sugiere)
  evivvoRecommendations: EvivvoRecommendation[]
  
  // Estado y tracking
  status: ReferralStatus
  
  // Resultado
  selectedProfessionalId?: string // Si el paciente eligió uno
  scheduledSessionId?: string // Si se agendó sesión
  
  // Fechas
  createdAt: string
  shownToPatientAt?: string
  respondedAt?: string
  expiresAt: string // 7 días para actuar
  
  // Auditoría
  history: ReferralHistoryEntry[]
}

export interface EvivvoRecommendation {
  professionalId: string
  professionalName: string
  professionalType: ReferralType
  professionalImage: string
  rating: number
  reviews: number
  matchScore: number // 0-100, calculado por Evivvo
  matchReasons: string[] // Por qué Evivvo lo recomienda
  availableNow: boolean
  nextAvailable: string
  price: number
}

export interface ReferralHistoryEntry {
  id: string
  action: 'created' | 'shown' | 'accepted' | 'rejected' | 'scheduled' | 'expired'
  timestamp: string
  details: string
}

// Razones de derivación con descripciones
export const referralReasons: Record<ReferralReason, { label: string; description: string }> = {
  psychiatric_evaluation: {
    label: 'Evaluación psiquiátrica',
    description: 'Se recomienda una evaluación con profesional médico para valorar posible tratamiento farmacológico.',
  },
  medication_management: {
    label: 'Manejo farmacológico',
    description: 'El paciente podría beneficiarse de un seguimiento médico para ajuste o inicio de medicación.',
  },
  deep_therapy: {
    label: 'Terapia profunda',
    description: 'Se sugiere trabajo terapéutico más profundo con psicólogo especializado.',
  },
  coaching_support: {
    label: 'Apoyo de coaching',
    description: 'El paciente podría beneficiarse de acompañamiento para metas y desarrollo personal.',
  },
  crisis_intervention: {
    label: 'Intervención en crisis',
    description: 'Situación que requiere atención especializada urgente.',
  },
  specialized_treatment: {
    label: 'Tratamiento especializado',
    description: 'Se recomienda profesional con especialización específica.',
  },
  complementary_support: {
    label: 'Apoyo complementario',
    description: 'Apoyo adicional que complementaría el tratamiento actual.',
  },
}

// Mensajes que ve el paciente (NUNCA menciona al profesional que sugirió)
export const patientMessages = {
  recommendation: "Evivvo encontró profesionales recomendados para esta etapa de tu proceso.",
  psychiatrist: "Basándonos en tu evolución, te sugerimos una consulta con un profesional médico.",
  psychologist: "Hemos identificado que podrías beneficiarte de apoyo psicológico especializado.",
  coach: "Tu progreso indica que un coach podría ayudarte a alcanzar tus metas.",
}

// Reglas de protección contra conflictos de interés
export const conflictOfInterestRules = [
  "Los profesionales no pueden derivar pacientes directamente a perfiles específicos con fines comerciales o personales.",
  "Todas las recomendaciones son procesadas por el sistema inteligente de Evivvo.",
  "El intento de derivar pacientes fuera del flujo interno de Evivvo puede causar suspensión o expulsión de la plataforma.",
  "Evivvo registra y audita todas las sugerencias de derivación para garantizar la integridad del sistema.",
]
