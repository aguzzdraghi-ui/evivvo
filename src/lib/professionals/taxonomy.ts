export const SPECIALTY_LABELS: Record<string, string> = {
  ansiedad: "Ansiedad",
  depresion: "Depresión",
  estres: "Estrés",
  rupturas: "Rupturas amorosas",
  duelo: "Duelo",
  soledad: "Soledad",
  pareja: "Terapia de pareja",
  autoestima: "Autoestima",
  "crecimiento-personal": "Crecimiento personal",
  insomnio: "Insomnio",
}

export type ExplorerFilterId =
  | "para-vos"
  | "disponibles"
  | "psicologia"
  | "psiquiatria"
  | "parejas"
  | "ansiedad"

export interface ExplorerFilterDef {
  id: ExplorerFilterId
  label: string
  tipo?: string
  specialty?: string
  disponibleAhora?: boolean
}

export const EXPLORER_FILTERS: ExplorerFilterDef[] = [
  { id: "disponibles", label: "Disponibles ahora", disponibleAhora: true },
  { id: "psicologia", label: "Psicología", tipo: "psicologo" },
  { id: "psiquiatria", label: "Psiquiatría", tipo: "psiquiatra" },
  { id: "parejas", label: "Parejas", specialty: "pareja" },
  { id: "ansiedad", label: "Ansiedad", specialty: "ansiedad" },
]
