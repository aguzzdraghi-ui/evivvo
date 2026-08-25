"use client"

// ============================================
// EVIVVO GLOBAL STORE - FUENTE ÚNICA DE DATOS
// ============================================
// Todos los componentes deben leer/escribir desde aquí
// Los cambios en admin se reflejan automáticamente en la web pública

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ============================================
// TIPOS
// ============================================

export interface Professional {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  foto: string
  tipo: 'psicologo' | 'coach' | 'terapeuta' | 'psiquiatra'
  especialidades: string[]
  precio: number
  rating: number
  reviewCount: number
  estadoOnline: boolean
  estadoAdmin: 'pendiente' | 'activo' | 'suspendido' | 'rechazado' | 'eliminado'
  badge: 'ninguno' | 'verificado' | 'destacado' | 'premium' | 'top'
  ranking: number
  descripcion: string
  visiblePublicamente: boolean
  destacado: boolean
  videoPresentacion?: string
  disponibilidad: {
    dias: string[]
    horarioInicio: string
    horarioFin: string
  }
  createdAt: string
  updatedAt: string
}

export interface Patient {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono?: string
  foto?: string
  fechaNacimiento?: string
  genero?: string
  estadoEmocional?: string
  profesionalActual?: string
  planActual?: 'gratuito' | 'plus' | 'premium'
  evaHistory: EvaEntry[]
  createdAt: string
  updatedAt: string
}

export interface Session {
  id: string
  pacienteId: string
  profesionalId: string
  fecha: string
  hora: string
  duracion: 25 | 40 | 50
  modalidad: 'videollamada' | 'chat'
  estado: 'pendiente' | 'confirmada' | 'en_curso' | 'completada' | 'cancelada'
  estadoPago: 'pendiente' | 'pagado' | 'reembolsado'
  precio: number
  notas?: string
  dailyRoomUrl?: string
  // Bienestar del paciente
  bienestarInicio?: number // 1-10
  bienestarFin?: number // 1-10
  observacionBienestar?: string
  recomendacionProxima?: string
  createdAt: string
  updatedAt: string
}

// Valoración privada del profesional sobre el paciente
export interface PatientProfessionalNote {
  id: string
  pacienteId: string
  profesionalId: string
  sessionId: string
  actitud: 'excelente' | 'buena' | 'regular' | 'mala'
  puntualidad: 'puntual' | 'leve_retraso' | 'tarde' | 'no_asistio'
  compromiso: 1 | 2 | 3 | 4 | 5
  observaciones: string
  puntuacionInterna: 1 | 2 | 3 | 4 | 5
  createdAt: string
}

export interface EvaEntry {
  id: string
  fecha: string
  mensaje: string
  respuesta: string
  emociones: string[]
  intensidad: number
  recomendaciones: string[]
}

export interface SubscriptionPlan {
  id: string
  nombre: string
  precio: number
  precioOriginal?: number
  descuento?: number
  periodo: 'mensual' | 'anual'
  beneficios: string[]
  destacado: boolean
  badge?: string
  cta: string
  activo: boolean
}

export interface TermsConfig {
  contenido: string
  ultimaActualizacion: string
  version: string
}

export interface PlatformConfig {
  comisionPlataforma: number
  sesionMinima: number
  sesionMaxima: number
  tiemposCancelacion: number
  notificacionesEmail: boolean
  notificacionesPush: boolean
  mantenimiento: boolean
  mensajeMantenimiento: string
}

// ============================================
// DATOS INICIALES - 8 PROFESIONALES BASE
// ============================================

const INITIAL_PROFESSIONALS: Professional[] = [
  {
    id: "prof-1",
    nombre: "Ana",
    apellido: "Rodríguez",
    email: "ana.rodriguez@evivvo.app",
    telefono: "+54 11 2345 6789",
    foto: "/images/professionals/ana.jpg",
    tipo: "psicologo",
    especialidades: ["Ansiedad", "Depresión", "Terapia cognitivo-conductual"],
    precio: 16500,
    rating: 4.9,
    reviewCount: 127,
    estadoOnline: true,
    estadoAdmin: "activo",
    badge: "verificado",
    ranking: 1,
    descripcion: "Psicóloga clínica con más de 10 años de experiencia. Especializada en trastornos de ansiedad y depresión con enfoque cognitivo-conductual.",
    visiblePublicamente: true,
    destacado: true,
    disponibilidad: { dias: ["lunes", "martes", "miercoles", "jueves", "viernes"], horarioInicio: "09:00", horarioFin: "18:00" },
    createdAt: "2024-01-01",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prof-2",
    nombre: "Carlos",
    apellido: "Méndez",
    email: "carlos.mendez@evivvo.app",
    telefono: "+54 11 3456 7890",
    foto: "/images/professionals/carlos.jpg",
    tipo: "coach",
    especialidades: ["Desarrollo personal", "Liderazgo", "Gestión del estrés"],
    precio: 14000,
    rating: 4.8,
    reviewCount: 89,
    estadoOnline: true,
    estadoAdmin: "activo",
    badge: "destacado",
    ranking: 2,
    descripcion: "Coach certificado ICF con especialización en desarrollo de liderazgo y gestión del estrés laboral.",
    visiblePublicamente: true,
    destacado: true,
    disponibilidad: { dias: ["lunes", "miercoles", "viernes"], horarioInicio: "10:00", horarioFin: "20:00" },
    createdAt: "2024-01-15",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prof-3",
    nombre: "María",
    apellido: "González",
    email: "maria.gonzalez@evivvo.app",
    telefono: "+54 11 4567 8901",
    foto: "/images/professionals/maria.jpg",
    tipo: "terapeuta",
    especialidades: ["Terapia de pareja", "Relaciones", "Comunicación"],
    precio: 15000,
    rating: 4.7,
    reviewCount: 65,
    estadoOnline: false,
    estadoAdmin: "activo",
    badge: "verificado",
    ranking: 3,
    descripcion: "Terapeuta de pareja y familia con enfoque sistémico. Ayudo a mejorar la comunicación y resolver conflictos.",
    visiblePublicamente: true,
    destacado: false,
    disponibilidad: { dias: ["martes", "jueves", "sabado"], horarioInicio: "14:00", horarioFin: "21:00" },
    createdAt: "2024-02-01",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prof-4",
    nombre: "Roberto",
    apellido: "Silva",
    email: "roberto.silva@evivvo.app",
    telefono: "+54 11 5678 9012",
    foto: "/images/professionals/roberto.jpg",
    tipo: "psiquiatra",
    especialidades: ["Psiquiatría", "Medicación", "Trastornos del ánimo"],
    precio: 22000,
    rating: 4.9,
    reviewCount: 156,
    estadoOnline: true,
    estadoAdmin: "activo",
    badge: "premium",
    ranking: 4,
    descripcion: "Médico psiquiatra con 15 años de experiencia. Tratamiento integral de trastornos del ánimo y ansiedad.",
    visiblePublicamente: true,
    destacado: true,
    disponibilidad: { dias: ["lunes", "martes", "miercoles", "jueves"], horarioInicio: "08:00", horarioFin: "16:00" },
    createdAt: "2024-01-10",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prof-5",
    nombre: "Laura",
    apellido: "Fernández",
    email: "laura.fernandez@evivvo.app",
    telefono: "+54 11 6789 0123",
    foto: "/images/professionals/laura.jpg",
    tipo: "psicologo",
    especialidades: ["Trauma", "EMDR", "Estrés postraumático"],
    precio: 18000,
    rating: 4.8,
    reviewCount: 94,
    estadoOnline: true,
    estadoAdmin: "activo",
    badge: "verificado",
    ranking: 5,
    descripcion: "Especialista en trauma y EMDR. Trabajo con personas que han vivido experiencias difíciles ayudándolas a sanar.",
    visiblePublicamente: true,
    destacado: false,
    disponibilidad: { dias: ["lunes", "miercoles", "viernes"], horarioInicio: "09:00", horarioFin: "17:00" },
    createdAt: "2024-02-15",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prof-6",
    nombre: "Diego",
    apellido: "Martínez",
    email: "diego.martinez@evivvo.app",
    telefono: "+54 11 7890 1234",
    foto: "/images/professionals/diego.jpg",
    tipo: "coach",
    especialidades: ["Mindfulness", "Meditación", "Bienestar"],
    precio: 12000,
    rating: 4.6,
    reviewCount: 72,
    estadoOnline: false,
    estadoAdmin: "activo",
    badge: "ninguno",
    ranking: 6,
    descripcion: "Coach de bienestar y mindfulness. Te ayudo a encontrar paz interior y equilibrio en tu vida diaria.",
    visiblePublicamente: true,
    destacado: false,
    disponibilidad: { dias: ["martes", "jueves", "sabado"], horarioInicio: "07:00", horarioFin: "15:00" },
    createdAt: "2024-03-01",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prof-7",
    nombre: "Sofía",
    apellido: "López",
    email: "sofia.lopez@evivvo.app",
    telefono: "+54 11 8901 2345",
    foto: "/images/professionals/sofia.jpg",
    tipo: "psicologo",
    especialidades: ["Adolescentes", "Familia", "Orientación vocacional"],
    precio: 14500,
    rating: 4.7,
    reviewCount: 58,
    estadoOnline: true,
    estadoAdmin: "activo",
    badge: "verificado",
    ranking: 7,
    descripcion: "Psicóloga especializada en adolescentes y orientación vocacional. Acompaño en la transición a la vida adulta.",
    visiblePublicamente: true,
    destacado: false,
    disponibilidad: { dias: ["lunes", "martes", "miercoles", "jueves", "viernes"], horarioInicio: "15:00", horarioFin: "21:00" },
    createdAt: "2024-03-15",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prof-8",
    nombre: "Martín",
    apellido: "García",
    email: "martin.garcia@evivvo.app",
    telefono: "+54 11 9012 3456",
    foto: "/images/professionals/martin.jpg",
    tipo: "terapeuta",
    especialidades: ["Adicciones", "Recuperación", "Grupos de apoyo"],
    precio: 16000,
    rating: 4.8,
    reviewCount: 103,
    estadoOnline: true,
    estadoAdmin: "activo",
    badge: "top",
    ranking: 8,
    descripcion: "Terapeuta especializado en adicciones y procesos de recuperación. Enfoque humanista y compasivo.",
    visiblePublicamente: true,
    destacado: true,
    disponibilidad: { dias: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"], horarioInicio: "10:00", horarioFin: "22:00" },
    createdAt: "2024-01-20",
    updatedAt: new Date().toISOString(),
  },
]

const INITIAL_PLANS: SubscriptionPlan[] = [
  {
    id: "plan-gratuito",
    nombre: "Gratuito",
    precio: 0,
    periodo: "mensual",
    beneficios: [
      "Acceso a EVA (asistente emocional)",
      "Búsqueda de profesionales",
      "1 sesión de prueba",
      "Chat de soporte básico",
    ],
    destacado: false,
    cta: "Comenzar gratis",
    activo: true,
  },
  {
    id: "plan-plus",
    nombre: "Plus",
    precio: 9990,
    precioOriginal: 14990,
    descuento: 33,
    periodo: "mensual",
    beneficios: [
      "Todo lo del plan Gratuito",
      "4 sesiones mensuales incluidas",
      "Descuento del 15% en sesiones adicionales",
      "Chat ilimitado con tu profesional",
      "Acceso a contenido exclusivo",
      "Prioridad en agendamiento",
    ],
    destacado: true,
    badge: "Más popular",
    cta: "Elegir Plus",
    activo: true,
  },
  {
    id: "plan-premium",
    nombre: "Premium",
    precio: 19990,
    precioOriginal: 29990,
    descuento: 33,
    periodo: "mensual",
    beneficios: [
      "Todo lo del plan Plus",
      "Sesiones ilimitadas",
      "Descuento del 25% en todas las sesiones",
      "Acceso a talleres grupales",
      "Seguimiento personalizado",
      "Línea directa 24/7",
      "Reportes de progreso mensuales",
    ],
    destacado: false,
    badge: "Todo incluido",
    cta: "Elegir Premium",
    activo: true,
  },
]

const INITIAL_TERMS: TermsConfig = {
  contenido: `# Términos y Condiciones de Evivvo

## 1. Aceptación de los Términos
Al acceder y utilizar la plataforma Evivvo, aceptás estos términos y condiciones en su totalidad.

## 2. Descripción del Servicio
Evivvo es una plataforma que conecta usuarios con profesionales de salud mental y bienestar emocional.

## 3. Registro y Cuenta
- Debés proporcionar información verdadera y actualizada
- Sos responsable de mantener la confidencialidad de tu cuenta
- Debés ser mayor de 18 años para usar el servicio

## 4. Sesiones y Pagos
- Los precios de las sesiones están establecidos por cada profesional
- Los pagos se procesan de forma segura a través de nuestra plataforma
- Podés cancelar una sesión hasta 24 horas antes sin cargo

## 5. Privacidad
- Toda la información compartida en las sesiones es confidencial
- Cumplimos con las leyes de protección de datos aplicables

## 6. Limitación de Responsabilidad
Evivvo es una plataforma de conexión y no se responsabiliza por el tratamiento brindado por los profesionales.

## 7. Contacto
Para consultas: info@evivvo.app`,
  ultimaActualizacion: new Date().toISOString(),
  version: "1.0",
}

const INITIAL_CONFIG: PlatformConfig = {
  comisionPlataforma: 15,
  sesionMinima: 25,
  sesionMaxima: 50,
  tiemposCancelacion: 24,
  notificacionesEmail: true,
  notificacionesPush: true,
  mantenimiento: false,
  mensajeMantenimiento: "",
}

// ============================================
// STORE PRINCIPAL
// ============================================

interface EvivvoStore {
  // Estado
  professionals: Professional[]
  patients: Patient[]
  sessions: Session[]
  plans: SubscriptionPlan[]
  terms: TermsConfig
  config: PlatformConfig
  currentUser: Patient | null
  isInitialized: boolean

  // Acciones - Profesionales
  getProfessionals: () => Professional[]
  getPublicProfessionals: () => Professional[]
  getProfessionalById: (id: string) => Professional | undefined
  addProfessional: (professional: Omit<Professional, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProfessional: (id: string, updates: Partial<Professional>) => void
  deleteProfessional: (id: string) => void
  approveProfessional: (id: string) => void
  suspendProfessional: (id: string) => void
  rejectProfessional: (id: string) => void

  // Acciones - Pacientes
  getPatients: () => Patient[]
  getPatientById: (id: string) => Patient | undefined
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'evaHistory'>) => Patient
  updatePatient: (id: string, updates: Partial<Patient>) => void
  setCurrentUser: (patient: Patient | null) => void

  // Acciones - Sesiones
  getSessions: () => Session[]
  getSessionById: (id: string) => Session | undefined
  getSessionsByPatient: (patientId: string) => Session[]
  getSessionsByProfessional: (professionalId: string) => Session[]
  addSession: (session: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => Session
  updateSession: (id: string, updates: Partial<Session>) => void
  cancelSession: (id: string) => void

  // Acciones - Planes
  getPlans: () => SubscriptionPlan[]
  getActivePlans: () => SubscriptionPlan[]
  updatePlan: (id: string, updates: Partial<SubscriptionPlan>) => void

  // Acciones - Términos
  getTerms: () => TermsConfig
  updateTerms: (content: string) => void

  // Acciones - Configuración
  getConfig: () => PlatformConfig
  updateConfig: (updates: Partial<PlatformConfig>) => void

  // Acciones - EVA
  addEvaEntry: (patientId: string, entry: Omit<EvaEntry, 'id' | 'fecha'>) => void
  getEvaHistory: (patientId: string) => EvaEntry[]

  // Inicialización
  initialize: () => void
}

export const useEvivvoStore = create<EvivvoStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      professionals: INITIAL_PROFESSIONALS,
      patients: [],
      sessions: [],
      plans: INITIAL_PLANS,
      terms: INITIAL_TERMS,
      config: INITIAL_CONFIG,
      currentUser: null,
      isInitialized: false,

      // Profesionales
      getProfessionals: () => get().professionals,
      
      getPublicProfessionals: () => 
        get().professionals.filter(p => 
          p.estadoAdmin === 'activo' && p.visiblePublicamente
        ).sort((a, b) => a.ranking - b.ranking),
      
      getProfessionalById: (id) => 
        get().professionals.find(p => p.id === id),
      
      addProfessional: (professional) => {
        const newProfessional: Professional = {
          ...professional,
          id: `prof-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set(state => ({
          professionals: [...state.professionals, newProfessional]
        }))
      },
      
      updateProfessional: (id, updates) => {
        set(state => ({
          professionals: state.professionals.map(p =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          )
        }))
      },
      
      deleteProfessional: (id) => {
        set(state => ({
          professionals: state.professionals.map(p =>
            p.id === id ? { ...p, estadoAdmin: 'eliminado', visiblePublicamente: false } : p
          )
        }))
      },
      
      approveProfessional: (id) => {
        set(state => ({
          professionals: state.professionals.map(p =>
            p.id === id ? { ...p, estadoAdmin: 'activo', updatedAt: new Date().toISOString() } : p
          )
        }))
      },
      
      suspendProfessional: (id) => {
        set(state => ({
          professionals: state.professionals.map(p =>
            p.id === id ? { ...p, estadoAdmin: 'suspendido', visiblePublicamente: false } : p
          )
        }))
      },
      
      rejectProfessional: (id) => {
        set(state => ({
          professionals: state.professionals.map(p =>
            p.id === id ? { ...p, estadoAdmin: 'rechazado', visiblePublicamente: false } : p
          )
        }))
      },

      // Pacientes
      getPatients: () => get().patients,
      
      getPatientById: (id) => get().patients.find(p => p.id === id),
      
      addPatient: (patient) => {
        const newPatient: Patient = {
          ...patient,
          id: `patient-${Date.now()}`,
          evaHistory: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set(state => ({
          patients: [...state.patients, newPatient]
        }))
        return newPatient
      },
      
      updatePatient: (id, updates) => {
        set(state => ({
          patients: state.patients.map(p =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          )
        }))
      },
      
      setCurrentUser: (patient) => set({ currentUser: patient }),

      // Sesiones
      getSessions: () => get().sessions,
      
      getSessionById: (id) => get().sessions.find(s => s.id === id),
      
      getSessionsByPatient: (patientId) => 
        get().sessions.filter(s => s.pacienteId === patientId),
      
      getSessionsByProfessional: (professionalId) => 
        get().sessions.filter(s => s.profesionalId === professionalId),
      
      addSession: (session) => {
        const newSession: Session = {
          ...session,
          id: `session-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set(state => ({
          sessions: [...state.sessions, newSession]
        }))
        return newSession
      },
      
      updateSession: (id, updates) => {
        set(state => ({
          sessions: state.sessions.map(s =>
            s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
          )
        }))
      },
      
      cancelSession: (id) => {
        set(state => ({
          sessions: state.sessions.map(s =>
            s.id === id ? { ...s, estado: 'cancelada', updatedAt: new Date().toISOString() } : s
          )
        }))
      },

      // Planes
      getPlans: () => get().plans,
      
      getActivePlans: () => get().plans.filter(p => p.activo),
      
      updatePlan: (id, updates) => {
        set(state => ({
          plans: state.plans.map(p =>
            p.id === id ? { ...p, ...updates } : p
          )
        }))
      },

      // Términos
      getTerms: () => get().terms,
      
      updateTerms: (content) => {
        set({
          terms: {
            contenido: content,
            ultimaActualizacion: new Date().toISOString(),
            version: (parseFloat(get().terms.version) + 0.1).toFixed(1),
          }
        })
      },

      // Configuración
      getConfig: () => get().config,
      
      updateConfig: (updates) => {
        set(state => ({
          config: { ...state.config, ...updates }
        }))
      },

      // EVA
      addEvaEntry: (patientId, entry) => {
        const newEntry: EvaEntry = {
          ...entry,
          id: `eva-${Date.now()}`,
          fecha: new Date().toISOString(),
        }
        set(state => ({
          patients: state.patients.map(p =>
            p.id === patientId 
              ? { ...p, evaHistory: [...p.evaHistory, newEntry] } 
              : p
          )
        }))
      },
      
      getEvaHistory: (patientId) => {
        const patient = get().patients.find(p => p.id === patientId)
        return patient?.evaHistory || []
      },

      // Inicialización
      initialize: () => {
        if (!get().isInitialized) {
          set({ isInitialized: true })
        }
      },
    }),
    {
      name: 'evivvo-store',
      partialize: (state) => ({
        professionals: state.professionals,
        patients: state.patients,
        sessions: state.sessions,
        plans: state.plans,
        terms: state.terms,
        config: state.config,
        currentUser: state.currentUser,
      }),
    }
  )
)

// ============================================
// HOOKS DE CONVENIENCIA
// ============================================

export const useProfessionals = () => {
  const store = useEvivvoStore()
  return {
    all: store.getProfessionals(),
    public: store.getPublicProfessionals(),
    getById: store.getProfessionalById,
    add: store.addProfessional,
    update: store.updateProfessional,
    delete: store.deleteProfessional,
    approve: store.approveProfessional,
    suspend: store.suspendProfessional,
    reject: store.rejectProfessional,
  }
}

export const useSessions = () => {
  const store = useEvivvoStore()
  return {
    all: store.getSessions(),
    getById: store.getSessionById,
    byPatient: store.getSessionsByPatient,
    byProfessional: store.getSessionsByProfessional,
    add: store.addSession,
    update: store.updateSession,
    cancel: store.cancelSession,
  }
}

export const usePlans = () => {
  const store = useEvivvoStore()
  return {
    all: store.getPlans(),
    active: store.getActivePlans(),
    update: store.updatePlan,
  }
}

export const useTerms = () => {
  const store = useEvivvoStore()
  return {
    terms: store.getTerms(),
    update: store.updateTerms,
  }
}

export const useConfig = () => {
  const store = useEvivvoStore()
  return {
    config: store.getConfig(),
    update: store.updateConfig,
  }
}
