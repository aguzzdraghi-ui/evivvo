import { createClient } from "@/src/lib/supabase/client"

export interface AdminProfessionalRow {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono: string | null
  foto_url: string | null
  tipo: string
  especialidades: string[]
  precio: number
  rating: number
  total_resenas: number
  estado: "pendiente" | "activo" | "suspendido" | "rechazado" | "eliminado"
  visible: boolean
  verificacion: string
  destacado: boolean
  ranking: number
  descripcion: string | null
  motivo_estado: string | null
  documentos_completos: boolean
  created_at: string
}

/**
 * Full professionals list for the admin panel. Requires an authenticated
 * admin session — RLS ("Profesional o admin lee perfil profesional") only
 * returns every row when auth.uid() belongs to an admin.
 */
export async function getAdminProfessionals(): Promise<AdminProfessionalRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("professional_profiles")
    .select(
      `id, tipo, especialidades, precio, rating, total_resenas, estado, visible, verificacion,
       destacado, ranking, descripcion, motivo_estado, documentos_completos, created_at,
       profiles ( nombre, apellido, email, telefono, foto_url )`
    )
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[evivvo] Error fetching admin professionals:", error.message)
    throw error
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    nombre: row.profiles?.nombre ?? "",
    apellido: row.profiles?.apellido ?? "",
    email: row.profiles?.email ?? "",
    telefono: row.profiles?.telefono ?? null,
    foto_url: row.profiles?.foto_url ?? null,
    tipo: row.tipo,
    especialidades: row.especialidades ?? [],
    precio: Number(row.precio ?? 0),
    rating: Number(row.rating ?? 0),
    total_resenas: row.total_resenas ?? 0,
    estado: row.estado,
    visible: row.visible,
    verificacion: row.verificacion,
    destacado: row.destacado,
    ranking: row.ranking,
    descripcion: row.descripcion,
    motivo_estado: row.motivo_estado,
    documentos_completos: row.documentos_completos,
    created_at: row.created_at,
  }))
}

/** Eligibility for the home page's featured section — mirrors the RPC's WHERE clause. */
export function isEligibleForHome(row: Pick<AdminProfessionalRow, "estado" | "visible">) {
  return row.estado === "activo" && row.visible
}

/**
 * Toggle destacado. The DB trigger (protect_admin_only_professional_fields)
 * silently reverts this for non-admins, and log_destacado_change writes the
 * audit_logs row — this call just needs to be made as the admin's own
 * authenticated session (RLS already permits admin UPDATE).
 */
export async function setDestacado(id: string, destacado: boolean) {
  const supabase = createClient()
  const { error } = await supabase.from("professional_profiles").update({ destacado }).eq("id", id)
  if (error) throw error
}

export async function setEstado(id: string, estado: AdminProfessionalRow["estado"], motivo?: string) {
  const supabase = createClient()
  const patch: Record<string, unknown> = { estado }
  if (motivo !== undefined) patch.motivo_estado = motivo
  if (estado === "activo") {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    patch.aprobado_por = user?.id ?? null
    patch.aprobado_at = new Date().toISOString()
    patch.visible = true
  }
  const { error } = await supabase.from("professional_profiles").update(patch).eq("id", id)
  if (error) throw error
}
