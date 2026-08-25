// Historial médico y emocional inteligente de Evivvo

export interface EmotionalSummary {
  id: string
  patientId: string
  generatedAt: string
  
  // Resumen generado por IA
  overallStatus: 'improving' | 'stable' | 'declining' | 'critical'
  summary: string
  keyInsights: string[]
  
  // Evolución
  emotionalTrend: EmotionalTrendPoint[]
  
  // Patrones detectados
  detectedPatterns: DetectedPattern[]
  
  // Recomendaciones automáticas
  recommendations: AIRecommendation[]
}

export interface EmotionalTrendPoint {
  date: string
  score: number // 1-10
  dominantEmotion: string
  sessionId?: string
}

export interface DetectedPattern {
  id: string
  type: 'positive' | 'concern' | 'neutral'
  pattern: string
  frequency: string
  firstDetected: string
  lastOccurrence: string
}

export interface AIRecommendation {
  id: string
  type: 'session' | 'professional' | 'resource' | 'action'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  actionUrl?: string
}

export interface MedicalHistory {
  id: string
  patientId: string
  
  // Resumen emocional IA
  emotionalSummary: EmotionalSummary
  
  // Profesionales consultados
  consultedProfessionals: ConsultedProfessional[]
  
  // Derivaciones sugeridas
  referrals: string[] // IDs de referrals
  
  // Historial de recetas
  prescriptions: string[] // IDs de prescriptions
  
  // Seguimiento psiquiátrico
  psychiatricFollowUp?: PsychiatricFollowUp
  
  // Sesiones completadas
  completedSessions: number
  totalHours: number
  
  // Cambios importantes detectados
  significantChanges: SignificantChange[]
  
  // Fechas
  createdAt: string
  updatedAt: string
}

export interface ConsultedProfessional {
  professionalId: string
  professionalName: string
  professionalType: 'psychologist' | 'coach' | 'psychiatrist'
  professionalImage: string
  sessionsCount: number
  firstSession: string
  lastSession: string
  status: 'active' | 'paused' | 'completed'
}

export interface PsychiatricFollowUp {
  psychiatristId: string
  psychiatristName: string
  currentMedications: string[]
  lastEvaluation: string
  nextEvaluation?: string
  treatmentStatus: 'starting' | 'adjusting' | 'stable' | 'tapering' | 'completed'
  notes: string
}

export interface SignificantChange {
  id: string
  date: string
  type: 'improvement' | 'setback' | 'milestone' | 'concern'
  title: string
  description: string
  detectedBy: 'ai' | 'professional' | 'self-report'
  relatedSessionId?: string
}

// Estados emocionales para el selector
export const emotionalStates = [
  { id: 'anxious', label: 'Ansioso/a', color: 'orange' },
  { id: 'sad', label: 'Triste', color: 'blue' },
  { id: 'angry', label: 'Enojado/a', color: 'red' },
  { id: 'stressed', label: 'Estresado/a', color: 'yellow' },
  { id: 'calm', label: 'Tranquilo/a', color: 'green' },
  { id: 'happy', label: 'Feliz', color: 'emerald' },
  { id: 'confused', label: 'Confundido/a', color: 'purple' },
  { id: 'hopeful', label: 'Esperanzado/a', color: 'cyan' },
  { id: 'overwhelmed', label: 'Abrumado/a', color: 'slate' },
  { id: 'lonely', label: 'Solo/a', color: 'indigo' },
] as const
