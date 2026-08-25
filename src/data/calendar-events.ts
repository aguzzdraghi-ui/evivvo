// Datos mock de configuración de calendario para profesionales

import type { ProfessionalCalendarConfig, DayAvailability, BlockedDate } from '@/src/types/calendar'

// Disponibilidad semanal por defecto
const defaultWeeklyAvailability: DayAvailability[] = [
  { dayOfWeek: 'lunes', enabled: true, slots: [{ start: '09:00', end: '13:00' }, { start: '15:00', end: '19:00' }] },
  { dayOfWeek: 'martes', enabled: true, slots: [{ start: '09:00', end: '13:00' }, { start: '15:00', end: '19:00' }] },
  { dayOfWeek: 'miercoles', enabled: true, slots: [{ start: '09:00', end: '13:00' }, { start: '15:00', end: '19:00' }] },
  { dayOfWeek: 'jueves', enabled: true, slots: [{ start: '09:00', end: '13:00' }, { start: '15:00', end: '19:00' }] },
  { dayOfWeek: 'viernes', enabled: true, slots: [{ start: '09:00', end: '13:00' }] },
  { dayOfWeek: 'sabado', enabled: false, slots: [] },
  { dayOfWeek: 'domingo', enabled: false, slots: [] },
]

// Configuraciones de calendario por profesional
export const calendarConfigs: ProfessionalCalendarConfig[] = [
  {
    professionalId: '1',
    timezone: 'America/Argentina/Buenos_Aires',
    sessionDuration: 45,
    bufferTime: 15,
    minNoticeHours: 12,
    modality: 'videollamada',
    weeklyAvailability: defaultWeeklyAvailability,
    blockedDates: [
      {
        id: 'b1',
        date: '2026-05-25',
        reason: 'feriado',
        note: 'Día de la Revolución de Mayo',
        createdAt: '2026-01-01T00:00:00Z',
        createdBy: 'admin',
      },
      {
        id: 'b2',
        date: '2026-05-15',
        reason: 'personal',
        note: 'Día personal',
        createdAt: '2026-05-01T10:00:00Z',
        createdBy: 'professional',
      },
    ],
    immediateAvailability: true,
    updatedAt: '2026-05-01T10:00:00Z',
  },
  {
    professionalId: '2',
    timezone: 'America/Argentina/Buenos_Aires',
    sessionDuration: 60,
    bufferTime: 15,
    minNoticeHours: 24,
    modality: 'videollamada',
    weeklyAvailability: [
      { dayOfWeek: 'lunes', enabled: true, slots: [{ start: '10:00', end: '14:00' }, { start: '16:00', end: '20:00' }] },
      { dayOfWeek: 'martes', enabled: true, slots: [{ start: '10:00', end: '14:00' }, { start: '16:00', end: '20:00' }] },
      { dayOfWeek: 'miercoles', enabled: true, slots: [{ start: '10:00', end: '14:00' }] },
      { dayOfWeek: 'jueves', enabled: true, slots: [{ start: '10:00', end: '14:00' }, { start: '16:00', end: '20:00' }] },
      { dayOfWeek: 'viernes', enabled: false, slots: [] },
      { dayOfWeek: 'sabado', enabled: true, slots: [{ start: '09:00', end: '12:00' }] },
      { dayOfWeek: 'domingo', enabled: false, slots: [] },
    ],
    blockedDates: [],
    immediateAvailability: false,
    updatedAt: '2026-04-28T14:00:00Z',
  },
  {
    professionalId: '3',
    timezone: 'America/Argentina/Buenos_Aires',
    sessionDuration: 45,
    bufferTime: 10,
    minNoticeHours: 6,
    modality: 'ambas',
    weeklyAvailability: defaultWeeklyAvailability,
    blockedDates: [],
    immediateAvailability: true,
    updatedAt: '2026-05-02T09:00:00Z',
  },
  {
    professionalId: '4',
    timezone: 'America/Argentina/Buenos_Aires',
    sessionDuration: 30,
    bufferTime: 10,
    minNoticeHours: 3,
    modality: 'videollamada',
    weeklyAvailability: [
      { dayOfWeek: 'lunes', enabled: true, slots: [{ start: '08:00', end: '12:00' }] },
      { dayOfWeek: 'martes', enabled: true, slots: [{ start: '08:00', end: '12:00' }] },
      { dayOfWeek: 'miercoles', enabled: true, slots: [{ start: '08:00', end: '12:00' }] },
      { dayOfWeek: 'jueves', enabled: true, slots: [{ start: '08:00', end: '12:00' }] },
      { dayOfWeek: 'viernes', enabled: true, slots: [{ start: '08:00', end: '12:00' }] },
      { dayOfWeek: 'sabado', enabled: false, slots: [] },
      { dayOfWeek: 'domingo', enabled: false, slots: [] },
    ],
    blockedDates: [],
    immediateAvailability: true,
    updatedAt: '2026-05-03T11:00:00Z',
  },
]

// Helpers
export function getCalendarConfig(professionalId: string): ProfessionalCalendarConfig | undefined {
  return calendarConfigs.find(c => c.professionalId === professionalId)
}

export function getDefaultCalendarConfig(professionalId: string): ProfessionalCalendarConfig {
  return {
    professionalId,
    timezone: 'America/Argentina/Buenos_Aires',
    sessionDuration: 45,
    bufferTime: 15,
    minNoticeHours: 12,
    modality: 'videollamada',
    weeklyAvailability: defaultWeeklyAvailability,
    blockedDates: [],
    immediateAvailability: false,
    updatedAt: new Date().toISOString(),
  }
}

// Generar slots disponibles para una fecha específica
export function getAvailableSlotsForDate(
  professionalId: string, 
  date: string,
  bookedSlots: { time: string }[] = []
): { time: string; available: boolean }[] {
  const config = getCalendarConfig(professionalId) || getDefaultCalendarConfig(professionalId)
  
  // Verificar si la fecha está bloqueada
  if (config.blockedDates.some(b => b.date === date)) {
    return []
  }
  
  // Obtener el día de la semana
  const dayDate = new Date(date + 'T00:00:00')
  const dayNames: Array<'domingo' | 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado'> = [
    'domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'
  ]
  const dayOfWeek = dayNames[dayDate.getDay()]
  
  const dayAvailability = config.weeklyAvailability.find(d => d.dayOfWeek === dayOfWeek)
  if (!dayAvailability || !dayAvailability.enabled) {
    return []
  }
  
  // Generar todos los slots posibles
  const allSlots: { time: string; available: boolean }[] = []
  
  for (const slot of dayAvailability.slots) {
    const [startHour, startMin] = slot.start.split(':').map(Number)
    const [endHour, endMin] = slot.end.split(':').map(Number)
    
    let currentMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    while (currentMinutes + config.sessionDuration <= endMinutes) {
      const time = `${String(Math.floor(currentMinutes / 60)).padStart(2, '0')}:${String(currentMinutes % 60).padStart(2, '0')}`
      const isBooked = bookedSlots.some(b => b.time === time)
      
      allSlots.push({ time, available: !isBooked })
      currentMinutes += config.sessionDuration + config.bufferTime
    }
  }
  
  // Filtrar por preaviso mínimo
  const now = new Date()
  const minNoticeTime = new Date(now.getTime() + config.minNoticeHours * 60 * 60 * 1000)
  
  return allSlots.map(slot => {
    const slotDateTime = new Date(`${date}T${slot.time}:00`)
    const meetsNotice = slotDateTime > minNoticeTime
    return {
      ...slot,
      available: slot.available && meetsNotice,
    }
  })
}

// Obtener próximas fechas disponibles
export function getNextAvailableDates(professionalId: string, count: number = 14): string[] {
  const config = getCalendarConfig(professionalId) || getDefaultCalendarConfig(professionalId)
  const dates: string[] = []
  const today = new Date()
  
  for (let i = 0; i < 60 && dates.length < count; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    
    // Verificar si no está bloqueada y tiene disponibilidad
    const isBlocked = config.blockedDates.some(b => b.date === dateStr)
    const slots = getAvailableSlotsForDate(professionalId, dateStr)
    
    if (!isBlocked && slots.some(s => s.available)) {
      dates.push(dateStr)
    }
  }
  
  return dates
}
