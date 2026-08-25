import type { Referral, EvivvoRecommendation } from '@/src/types/referral'

// Datos mock de derivaciones internas
export const referrals: Referral[] = [
  {
    id: 'ref-001',
    patientId: 'patient-001',
    patientName: 'María García',
    suggestingProfessionalId: 'prof-001',
    suggestingProfessionalName: 'Dra. María González',
    suggestingProfessionalType: 'psychologist',
    recommendedType: 'psychiatrist',
    reason: 'psychiatric_evaluation',
    reasonDescription: 'Paciente presenta síntomas de ansiedad que podrían beneficiarse de evaluación médica para considerar apoyo farmacológico.',
    emotionalContext: 'Ansiedad persistente, dificultad para dormir, preocupación excesiva que interfiere con actividades diarias.',
    urgencyLevel: 'medium',
    evivvoRecommendations: [
      {
        professionalId: 'psiq-001',
        professionalName: 'Dr. Roberto Sánchez',
        professionalType: 'psychiatrist',
        professionalImage: '/images/professionals/psicologo-2.jpg',
        rating: 4.9,
        reviews: 156,
        matchScore: 95,
        matchReasons: [
          'Especialista en trastornos de ansiedad',
          'Alta disponibilidad esta semana',
          'Excelentes reseñas de pacientes similares',
        ],
        availableNow: false,
        nextAvailable: 'Mañana 10:00',
        price: 28000,
      },
      {
        professionalId: 'psiq-002',
        professionalName: 'Dra. Ana Martínez',
        professionalType: 'psychiatrist',
        professionalImage: '/images/professionals/psicologa-1.jpg',
        rating: 4.8,
        reviews: 98,
        matchScore: 88,
        matchReasons: [
          'Experiencia en ansiedad generalizada',
          'Enfoque integrativo',
        ],
        availableNow: true,
        nextAvailable: 'Disponible ahora',
        price: 25000,
      },
    ],
    status: 'shown',
    createdAt: '2026-05-01T14:30:00Z',
    shownToPatientAt: '2026-05-01T18:00:00Z',
    expiresAt: '2026-05-08T14:30:00Z',
    history: [
      {
        id: 'hist-001',
        action: 'created',
        timestamp: '2026-05-01T14:30:00Z',
        details: 'Sugerencia de derivación registrada en el sistema',
      },
      {
        id: 'hist-002',
        action: 'shown',
        timestamp: '2026-05-01T18:00:00Z',
        details: 'Recomendaciones mostradas al paciente',
      },
    ],
  },
  {
    id: 'ref-002',
    patientId: 'patient-002',
    patientName: 'Juan Pérez',
    suggestingProfessionalId: 'coach-001',
    suggestingProfessionalName: 'Valentina Torres',
    suggestingProfessionalType: 'coach',
    recommendedType: 'psychologist',
    reason: 'deep_therapy',
    reasonDescription: 'El paciente menciona situaciones del pasado que requieren trabajo terapéutico más profundo.',
    emotionalContext: 'Dificultades relacionales recurrentes, patrones de comportamiento que desea cambiar.',
    urgencyLevel: 'low',
    evivvoRecommendations: [
      {
        professionalId: 'prof-002',
        professionalName: 'Dr. Carlos Mendoza',
        professionalType: 'psychologist',
        professionalImage: '/images/professionals/psicologo-2.jpg',
        rating: 4.8,
        reviews: 98,
        matchScore: 92,
        matchReasons: [
          'Especialista en relaciones interpersonales',
          'Enfoque psicodinámico',
          'Experiencia con patrones conductuales',
        ],
        availableNow: false,
        nextAvailable: 'Hoy 18:00',
        price: 22000,
      },
    ],
    status: 'accepted',
    createdAt: '2026-04-28T10:00:00Z',
    shownToPatientAt: '2026-04-28T12:00:00Z',
    respondedAt: '2026-04-28T15:30:00Z',
    expiresAt: '2026-05-05T10:00:00Z',
    history: [
      {
        id: 'hist-003',
        action: 'created',
        timestamp: '2026-04-28T10:00:00Z',
        details: 'Sugerencia de derivación registrada en el sistema',
      },
      {
        id: 'hist-004',
        action: 'shown',
        timestamp: '2026-04-28T12:00:00Z',
        details: 'Recomendaciones mostradas al paciente',
      },
      {
        id: 'hist-005',
        action: 'accepted',
        timestamp: '2026-04-28T15:30:00Z',
        details: 'Paciente aceptó ver profesionales recomendados',
      },
    ],
  },
  {
    id: 'ref-003',
    patientId: 'patient-003',
    patientName: 'Carolina López',
    suggestingProfessionalId: 'prof-003',
    suggestingProfessionalName: 'Lic. Ana Rodríguez',
    suggestingProfessionalType: 'psychologist',
    recommendedType: 'coach',
    reason: 'coaching_support',
    reasonDescription: 'Paciente ha resuelto conflictos principales y ahora busca desarrollo personal y profesional.',
    emotionalContext: 'Estabilidad emocional lograda, motivación para nuevos objetivos de vida.',
    urgencyLevel: 'low',
    evivvoRecommendations: [
      {
        professionalId: 'coach-001',
        professionalName: 'Valentina Torres',
        professionalType: 'coach',
        professionalImage: '/images/professionals/coach-1.jpg',
        rating: 4.7,
        reviews: 84,
        matchScore: 90,
        matchReasons: [
          'Especialista en desarrollo personal',
          'Enfoque en metas y productividad',
          'Excelente feedback de pacientes en transición',
        ],
        availableNow: true,
        nextAvailable: 'Disponible ahora',
        price: 14999,
      },
      {
        professionalId: 'coach-002',
        professionalName: 'Martín Herrera',
        professionalType: 'coach',
        professionalImage: '/images/professionals/coach-2.jpg',
        rating: 4.8,
        reviews: 76,
        matchScore: 85,
        matchReasons: [
          'Coach de alto rendimiento',
          'Experiencia en transiciones de carrera',
        ],
        availableNow: false,
        nextAvailable: 'Mañana 09:00',
        price: 17500,
      },
    ],
    status: 'scheduled',
    selectedProfessionalId: 'coach-001',
    scheduledSessionId: 'session-new-001',
    createdAt: '2026-04-20T16:00:00Z',
    shownToPatientAt: '2026-04-20T18:00:00Z',
    respondedAt: '2026-04-21T10:00:00Z',
    expiresAt: '2026-04-27T16:00:00Z',
    history: [
      {
        id: 'hist-006',
        action: 'created',
        timestamp: '2026-04-20T16:00:00Z',
        details: 'Sugerencia de derivación registrada en el sistema',
      },
      {
        id: 'hist-007',
        action: 'shown',
        timestamp: '2026-04-20T18:00:00Z',
        details: 'Recomendaciones mostradas al paciente',
      },
      {
        id: 'hist-008',
        action: 'scheduled',
        timestamp: '2026-04-21T10:00:00Z',
        details: 'Paciente agendó sesión con Valentina Torres',
      },
    ],
  },
  {
    id: 'ref-004',
    patientId: 'patient-004',
    patientName: 'Diego Fernández',
    suggestingProfessionalId: 'psiq-001',
    suggestingProfessionalName: 'Dr. Roberto Sánchez',
    suggestingProfessionalType: 'psychiatrist',
    recommendedType: 'psychologist',
    reason: 'complementary_support',
    reasonDescription: 'Paciente estabilizado farmacológicamente, se recomienda psicoterapia para trabajo complementario.',
    emotionalContext: 'Medicación estable, síntomas controlados, necesita herramientas de afrontamiento.',
    urgencyLevel: 'low',
    evivvoRecommendations: [
      {
        professionalId: 'prof-001',
        professionalName: 'Dra. María González',
        professionalType: 'psychologist',
        professionalImage: '/images/professionals/psicologa-1.jpg',
        rating: 4.9,
        reviews: 127,
        matchScore: 94,
        matchReasons: [
          'Especialista en TCC',
          'Experiencia con pacientes en tratamiento psiquiátrico',
          'Enfoque en herramientas prácticas',
        ],
        availableNow: true,
        nextAvailable: 'Disponible ahora',
        price: 18500,
      },
    ],
    status: 'pending',
    createdAt: '2026-05-05T11:00:00Z',
    expiresAt: '2026-05-12T11:00:00Z',
    history: [
      {
        id: 'hist-009',
        action: 'created',
        timestamp: '2026-05-05T11:00:00Z',
        details: 'Sugerencia de derivación registrada en el sistema',
      },
    ],
  },
]

// Funciones de utilidad
export function getReferralsByPatient(patientId: string): Referral[] {
  return referrals.filter(r => r.patientId === patientId)
}

export function getReferralsBySuggestingProfessional(professionalId: string): Referral[] {
  return referrals.filter(r => r.suggestingProfessionalId === professionalId)
}

export function getPendingReferrals(): Referral[] {
  return referrals.filter(r => r.status === 'pending' || r.status === 'shown')
}

export function getReferralById(id: string): Referral | undefined {
  return referrals.find(r => r.id === id)
}

// Estadísticas para admin
export function getReferralStats() {
  const total = referrals.length
  const byStatus = {
    pending: referrals.filter(r => r.status === 'pending').length,
    shown: referrals.filter(r => r.status === 'shown').length,
    accepted: referrals.filter(r => r.status === 'accepted').length,
    scheduled: referrals.filter(r => r.status === 'scheduled').length,
    rejected: referrals.filter(r => r.status === 'rejected').length,
    expired: referrals.filter(r => r.status === 'expired').length,
  }
  const byType = {
    psychiatrist: referrals.filter(r => r.recommendedType === 'psychiatrist').length,
    psychologist: referrals.filter(r => r.recommendedType === 'psychologist').length,
    coach: referrals.filter(r => r.recommendedType === 'coach').length,
  }
  const conversionRate = ((byStatus.scheduled / total) * 100).toFixed(1)
  
  return { total, byStatus, byType, conversionRate }
}
