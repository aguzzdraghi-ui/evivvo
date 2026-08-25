import type { Prescription } from '@/src/types/prescription'

// Datos mock de recetas médicas
export const prescriptions: Prescription[] = [
  {
    id: 'rx-001',
    patientId: 'patient-001',
    patientName: 'María García',
    patientEmail: 'maria.garcia@email.com',
    psychiatristId: 'psiq-001',
    psychiatristName: 'Dr. Roberto Sánchez',
    psychiatristLicense: 'M.N. 78432',
    medications: [
      {
        id: 'med-001',
        name: 'Sertralina',
        dosage: '50mg',
        frequency: '1 vez al día',
        duration: '90 días',
        instructions: 'Tomar por la mañana con alimentos',
      },
      {
        id: 'med-002',
        name: 'Clonazepam',
        dosage: '0.5mg',
        frequency: 'Antes de dormir',
        duration: '30 días',
        instructions: 'Solo si presenta dificultad para conciliar el sueño',
      },
    ],
    diagnosis: 'Trastorno de ansiedad generalizada (F41.1)',
    generalIndications: 'Mantener rutinas de sueño regulares. Evitar cafeína después de las 14hs. Realizar actividad física moderada. Continuar con psicoterapia.',
    observations: 'Paciente presenta buena evolución. Reducir clonazepam gradualmente en próxima consulta.',
    issueDate: '2026-04-15',
    expirationDate: '2026-07-15',
    treatmentDuration: '3 meses',
    status: 'activa',
    nextFollowUp: '2026-05-15',
    followUpNotes: 'Evaluar respuesta a ISRS y posible reducción de benzodiacepina',
    createdAt: '2026-04-15T10:30:00Z',
    updatedAt: '2026-04-15T10:30:00Z',
    history: [
      {
        id: 'hist-001',
        action: 'created',
        timestamp: '2026-04-15T10:30:00Z',
        performedBy: 'Dr. Roberto Sánchez',
        details: 'Receta inicial emitida',
      },
    ],
  },
  {
    id: 'rx-002',
    patientId: 'patient-001',
    patientName: 'María García',
    patientEmail: 'maria.garcia@email.com',
    psychiatristId: 'psiq-001',
    psychiatristName: 'Dr. Roberto Sánchez',
    psychiatristLicense: 'M.N. 78432',
    medications: [
      {
        id: 'med-003',
        name: 'Escitalopram',
        dosage: '10mg',
        frequency: '1 vez al día',
        duration: '60 días',
        instructions: 'Tomar por la mañana',
      },
    ],
    diagnosis: 'Episodio depresivo leve (F32.0)',
    generalIndications: 'Mantener actividades sociales. Exposición solar diaria. Continuar psicoterapia semanal.',
    issueDate: '2026-01-10',
    expirationDate: '2026-03-10',
    treatmentDuration: '2 meses',
    status: 'vencida',
    createdAt: '2026-01-10T14:00:00Z',
    updatedAt: '2026-03-10T00:00:00Z',
    history: [
      {
        id: 'hist-002',
        action: 'created',
        timestamp: '2026-01-10T14:00:00Z',
        performedBy: 'Dr. Roberto Sánchez',
        details: 'Receta inicial emitida',
      },
      {
        id: 'hist-003',
        action: 'expired',
        timestamp: '2026-03-10T00:00:00Z',
        performedBy: 'Sistema',
        details: 'Receta vencida automáticamente',
      },
    ],
  },
  {
    id: 'rx-003',
    patientId: 'patient-002',
    patientName: 'Juan Pérez',
    patientEmail: 'juan.perez@email.com',
    psychiatristId: 'psiq-002',
    psychiatristName: 'Dra. Ana Martínez',
    psychiatristLicense: 'M.N. 65219',
    medications: [
      {
        id: 'med-004',
        name: 'Quetiapina',
        dosage: '25mg',
        frequency: 'Antes de dormir',
        duration: '30 días',
        instructions: 'Puede aumentar somnolencia matutina los primeros días',
      },
    ],
    diagnosis: 'Insomnio no orgánico (F51.0)',
    generalIndications: 'Higiene del sueño estricta. No pantallas 2 horas antes de dormir. Técnicas de relajación.',
    issueDate: '2026-05-01',
    expirationDate: '2026-05-31',
    treatmentDuration: '1 mes',
    status: 'activa',
    nextFollowUp: '2026-05-20',
    createdAt: '2026-05-01T09:00:00Z',
    updatedAt: '2026-05-01T09:00:00Z',
    history: [
      {
        id: 'hist-004',
        action: 'created',
        timestamp: '2026-05-01T09:00:00Z',
        performedBy: 'Dra. Ana Martínez',
        details: 'Receta inicial emitida',
      },
    ],
  },
  {
    id: 'rx-004',
    patientId: 'patient-003',
    patientName: 'Carolina López',
    patientEmail: 'carolina.lopez@email.com',
    psychiatristId: 'psiq-001',
    psychiatristName: 'Dr. Roberto Sánchez',
    psychiatristLicense: 'M.N. 78432',
    medications: [
      {
        id: 'med-005',
        name: 'Fluoxetina',
        dosage: '20mg',
        frequency: '1 vez al día',
        duration: '90 días',
        instructions: 'Tomar por la mañana con o sin alimentos',
      },
    ],
    diagnosis: 'Trastorno de pánico (F41.0)',
    generalIndications: 'Evitar situaciones de estrés extremo. Practicar respiración diafragmática. Mantener seguimiento psicológico.',
    issueDate: '2026-04-01',
    expirationDate: '2026-07-01',
    treatmentDuration: '3 meses',
    status: 'suspendida',
    suspendedReason: 'Paciente reportó efectos adversos (náuseas persistentes). Se indicó suspensión y cambio de medicación.',
    createdAt: '2026-04-01T11:00:00Z',
    updatedAt: '2026-04-20T15:30:00Z',
    history: [
      {
        id: 'hist-005',
        action: 'created',
        timestamp: '2026-04-01T11:00:00Z',
        performedBy: 'Dr. Roberto Sánchez',
        details: 'Receta inicial emitida',
      },
      {
        id: 'hist-006',
        action: 'suspended',
        timestamp: '2026-04-20T15:30:00Z',
        performedBy: 'Dr. Roberto Sánchez',
        details: 'Suspendida por efectos adversos',
      },
    ],
  },
]

// Funciones de utilidad
export function getPrescriptionsByPatient(patientId: string): Prescription[] {
  return prescriptions.filter(p => p.patientId === patientId)
}

export function getPrescriptionsByPsychiatrist(psychiatristId: string): Prescription[] {
  return prescriptions.filter(p => p.psychiatristId === psychiatristId)
}

export function getActivePrescriptions(): Prescription[] {
  return prescriptions.filter(p => p.status === 'activa')
}

export function getPrescriptionById(id: string): Prescription | undefined {
  return prescriptions.find(p => p.id === id)
}

// Mock de pacientes del psiquiatra
export const psychiatristPatients = [
  { id: 'patient-001', name: 'María García', email: 'maria.garcia@email.com', lastSession: '2026-05-02' },
  { id: 'patient-002', name: 'Juan Pérez', email: 'juan.perez@email.com', lastSession: '2026-05-01' },
  { id: 'patient-003', name: 'Carolina López', email: 'carolina.lopez@email.com', lastSession: '2026-04-28' },
  { id: 'patient-004', name: 'Diego Fernández', email: 'diego.fernandez@email.com', lastSession: '2026-04-25' },
  { id: 'patient-005', name: 'Laura Martínez', email: 'laura.martinez@email.com', lastSession: '2026-04-20' },
]
