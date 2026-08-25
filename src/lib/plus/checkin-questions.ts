export type QuestionKey = "animo" | "emocion" | "sueno" | "energia" | "reflexion"

export const QUESTION_KEYS: QuestionKey[] = ["animo", "emocion", "sueno", "energia", "reflexion"]

export const STEP_LABELS: Record<QuestionKey, string> = {
  animo: "Ánimo",
  emocion: "Emoción",
  sueno: "Sueño",
  energia: "Energía",
  reflexion: "Reflexión",
}

export const MOOD_OPTIONS = [
  { value: 1, label: "Muy difícil", emoji: "😞" },
  { value: 2, label: "Difícil", emoji: "🙁" },
  { value: 3, label: "Neutral", emoji: "😐" },
  { value: 4, label: "Bien", emoji: "🙂" },
  { value: 5, label: "Muy bien", emoji: "😄" },
] as const

export const SLEEP_OPTIONS = [
  { value: 1, label: "Muy mal" },
  { value: 2, label: "Mal" },
  { value: 3, label: "Regular" },
  { value: 4, label: "Bien" },
  { value: 5, label: "Muy bien" },
] as const

export const ENERGY_OPTIONS = [
  { value: 1, label: "Muy bajo" },
  { value: 2, label: "Bajo" },
  { value: 3, label: "Medio" },
  { value: 4, label: "Bueno" },
  { value: 5, label: "Muy alto" },
] as const

export const EMOTION_OPTIONS = ["Ansiedad", "Tristeza", "Enojo", "Calma", "Alegría", "Agotamiento", "Otra"] as const

export const REFLECTION_OPTIONS = ["Trabajo", "Sueño", "Relaciones", "Salud", "Dinero", "Estudio", "Otro"] as const

export interface MoodAnswer {
  score: number
}
export interface EmotionAnswer {
  emotions: string[]
  other?: string
}
export interface SleepAnswer {
  score: number
  hours?: number
}
export interface EnergyAnswer {
  score: number
}
export interface ReflectionAnswer {
  factors: string[]
  note?: string
}

export const QUESTION_TEXT: Record<QuestionKey, string> = {
  animo: "¿Cómo estuvo tu día?",
  emocion: "¿Qué emoción predominó hoy?",
  sueno: "¿Cómo dormiste?",
  energia: "¿Cómo estuvo tu nivel de energía hoy?",
  reflexion: "¿Qué influyó más en cómo te sentiste hoy?",
}
