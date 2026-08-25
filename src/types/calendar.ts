// Tipos para el sistema de calendario de Evivvo

export type DayOfWeek = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo'

export type SessionModality = 'videollamada' | 'chat' | 'ambas'

export type SessionDuration = 25 | 30 | 40 | 45 | 50 | 60 | 90

export type BufferTime = 0 | 10 | 15 | 30

export type MinNoticeHours = 1 | 3 | 6 | 12 | 24

export interface TimeSlot {
  start: string // HH:mm format
  end: string // HH:mm format
}

export interface DayAvailability {
  dayOfWeek: DayOfWeek
  enabled: boolean
  slots: TimeSlot[]
}

export interface BlockedDate {
  id: string
  date: string // YYYY-MM-DD
  reason: 'vacaciones' | 'personal' | 'feriado' | 'otro'
  note?: string
  createdAt: string
  createdBy: 'professional' | 'admin'
}

export interface ProfessionalCalendarConfig {
  professionalId: string
  timezone: string
  sessionDuration: SessionDuration
  bufferTime: BufferTime
  minNoticeHours: MinNoticeHours
  modality: SessionModality
  weeklyAvailability: DayAvailability[]
  blockedDates: BlockedDate[]
  immediateAvailability: boolean
  updatedAt: string
}

export interface AvailableSlot {
  date: string // YYYY-MM-DD
  time: string // HH:mm
  duration: SessionDuration
  modality: SessionModality
  professionalId: string
}

// Función helper para generar slots disponibles
export function generateTimeSlots(start: string, end: string, duration: SessionDuration, buffer: BufferTime): TimeSlot[] {
  const slots: TimeSlot[] = []
  const [startHour, startMin] = start.split(':').map(Number)
  const [endHour, endMin] = end.split(':').map(Number)
  
  let currentMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin
  
  while (currentMinutes + duration <= endMinutes) {
    const slotStart = `${String(Math.floor(currentMinutes / 60)).padStart(2, '0')}:${String(currentMinutes % 60).padStart(2, '0')}`
    const slotEnd = `${String(Math.floor((currentMinutes + duration) / 60)).padStart(2, '0')}:${String((currentMinutes + duration) % 60).padStart(2, '0')}`
    
    slots.push({ start: slotStart, end: slotEnd })
    currentMinutes += duration + buffer
  }
  
  return slots
}
