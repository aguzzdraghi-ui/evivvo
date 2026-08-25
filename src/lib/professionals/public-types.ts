export interface PublicProfessional {
  id: string
  nombre: string
  apellido: string
  foto_url: string | null
  tipo: "psicologo" | "psiquiatra" | "coach" | "terapeuta"
  especialidades: string[]
  precio: number | null
  precio_min: number | null
  precio_max: number | null
  pricing_mode: "fijo" | "dinamico"
  duracion: number
  rating: number | null
  total_resenas: number
  matricula: string | null
  verificacion: "ninguno" | "verificado" | "destacado" | "premium" | "top" | "platinum"
  video_presentacion_url: string | null
  disponible_ahora: boolean
  proximo_turno: string | null
}

export interface FeaturedProfessional extends PublicProfessional {
  ranking: number
}

export interface PublicProfessionalListItem extends PublicProfessional {
  destacado: boolean
}

export interface PublicProfessionalDetail extends PublicProfessional {
  destacado: boolean
  descripcion: string | null
  experiencia: number | null
}

export const TIPO_LABELS: Record<PublicProfessional["tipo"], string> = {
  psicologo: "Psicólogo/a",
  psiquiatra: "Psiquiatra",
  coach: "Coach",
  terapeuta: "Terapeuta",
}

export function professionalFullName(p: Pick<PublicProfessional, "nombre" | "apellido">) {
  return `${p.nombre} ${p.apellido}`.trim()
}

export function hasRealRating(p: Pick<PublicProfessional, "total_resenas" | "rating">) {
  return p.total_resenas > 0 && p.rating !== null && p.rating > 0
}
