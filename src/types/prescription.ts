// Tipos para el sistema de recetas médicas de Evivvo
// Solo psiquiatras pueden emitir recetas

export type PrescriptionStatus = 'activa' | 'vencida' | 'suspendida' | 'renovada'

export interface Medication {
  id: string
  name: string
  dosage: string // ej: "10mg"
  frequency: string // ej: "1 vez al día"
  duration: string // ej: "30 días"
  instructions: string // ej: "Tomar con alimentos"
}

export interface Prescription {
  id: string
  patientId: string
  patientName: string
  patientEmail: string
  psychiatristId: string
  psychiatristName: string
  psychiatristLicense: string // Matrícula profesional
  
  // Medicamentos
  medications: Medication[]
  
  // Diagnóstico y observaciones
  diagnosis: string
  generalIndications: string
  observations?: string
  
  // Fechas
  issueDate: string // ISO date
  expirationDate: string // ISO date
  treatmentDuration: string // ej: "3 meses"
  
  // Estado
  status: PrescriptionStatus
  
  // Seguimiento
  nextFollowUp?: string // ISO date
  followUpNotes?: string
  
  // Auditoría
  createdAt: string
  updatedAt: string
  renewedFrom?: string // ID de receta anterior si es renovación
  suspendedReason?: string
  
  // Historial de cambios
  history: PrescriptionHistoryEntry[]
}

export interface PrescriptionHistoryEntry {
  id: string
  action: 'created' | 'modified' | 'renewed' | 'suspended' | 'expired'
  timestamp: string
  performedBy: string
  details: string
}

// Para crear una nueva receta
export interface CreatePrescriptionInput {
  patientId: string
  medications: Omit<Medication, 'id'>[]
  diagnosis: string
  generalIndications: string
  observations?: string
  treatmentDuration: string
  nextFollowUp?: string
}

// Para el formulario del psiquiatra
export const commonMedications = [
  { name: 'Sertralina', dosages: ['25mg', '50mg', '100mg'] },
  { name: 'Escitalopram', dosages: ['5mg', '10mg', '20mg'] },
  { name: 'Fluoxetina', dosages: ['10mg', '20mg', '40mg'] },
  { name: 'Clonazepam', dosages: ['0.25mg', '0.5mg', '1mg', '2mg'] },
  { name: 'Alprazolam', dosages: ['0.25mg', '0.5mg', '1mg'] },
  { name: 'Quetiapina', dosages: ['25mg', '50mg', '100mg', '200mg'] },
  { name: 'Risperidona', dosages: ['0.5mg', '1mg', '2mg'] },
  { name: 'Lamotrigina', dosages: ['25mg', '50mg', '100mg', '200mg'] },
  { name: 'Valproato', dosages: ['250mg', '500mg'] },
  { name: 'Litio', dosages: ['300mg', '450mg'] },
  { name: 'Bupropion', dosages: ['150mg', '300mg'] },
  { name: 'Venlafaxina', dosages: ['37.5mg', '75mg', '150mg'] },
  { name: 'Duloxetina', dosages: ['30mg', '60mg'] },
  { name: 'Mirtazapina', dosages: ['15mg', '30mg', '45mg'] },
  { name: 'Trazodona', dosages: ['50mg', '100mg', '150mg'] },
] as const

export const frequencyOptions = [
  '1 vez al día',
  '2 veces al día',
  '3 veces al día',
  'Cada 8 horas',
  'Cada 12 horas',
  'Antes de dormir',
  'En ayunas',
  'Según necesidad',
] as const

export const durationOptions = [
  '7 días',
  '14 días',
  '30 días',
  '60 días',
  '90 días',
  '6 meses',
  'Tratamiento continuo',
] as const
