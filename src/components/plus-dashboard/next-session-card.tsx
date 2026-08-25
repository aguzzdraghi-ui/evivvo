"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, Video, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/src/lib/supabase/client"

interface NextSession {
  id: string
  scheduled_at: string
  modality: string
  status: string
  professional_id: string
  professional_nombre: string | null
  professional_apellido: string | null
}

interface NextSessionCardProps {
  userId: string
}

const ACTIVE_STATUSES = ["pendiente", "confirmada", "en_curso"]

export function NextSessionCard({ userId }: NextSessionCardProps) {
  const [session, setSession] = useState<NextSession | null | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from("sessions")
        .select("id, scheduled_at, modality, status, professional_id, profiles:professional_id ( nombre, apellido )")
        .eq("patient_id", userId)
        .in("status", ACTIVE_STATUSES)
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at", { ascending: true })
        .limit(1)
        .maybeSingle()

      if (cancelled) return
      if (!data) {
        setSession(null)
        return
      }
      const profile = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles
      setSession({
        id: data.id,
        scheduled_at: data.scheduled_at,
        modality: data.modality,
        status: data.status,
        professional_id: data.professional_id,
        professional_nombre: profile?.nombre ?? null,
        professional_apellido: profile?.apellido ?? null,
      })
    }
    load()
    return () => {
      cancelled = true
    }
  }, [userId])

  if (session === undefined) {
    return <div className="h-32 animate-pulse rounded-2xl bg-muted" />
  }

  if (!session) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center">
        <Calendar className="mx-auto mb-3 h-8 w-8 text-muted-foreground/60" />
        <p className="font-medium text-foreground">No tenés sesiones próximas</p>
        <p className="mt-1 text-sm text-muted-foreground">Cuando reserves, vas a ver tu próxima sesión aquí.</p>
        <Button asChild className="mt-4 rounded-xl bg-gradient-to-r from-primary to-purple-600">
          <Link href="/profesionales">Buscar profesional</Link>
        </Button>
      </div>
    )
  }

  const date = new Date(session.scheduled_at)
  const name = [session.professional_nombre, session.professional_apellido].filter(Boolean).join(" ") || "Profesional"

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="mb-3 text-sm font-semibold text-foreground">Próxima sesión</p>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-medium text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">
            {date.toLocaleDateString("es-AR", { day: "numeric", month: "short" })} ·{" "}
            {date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            {session.modality === "videollamada" ? <Video className="h-3.5 w-3.5" /> : <MessageSquare className="h-3.5 w-3.5" />}
            {session.modality === "videollamada" ? "Videollamada" : "Chat"}
          </p>
        </div>
        <Button asChild size="sm" className="shrink-0 rounded-xl">
          <Link href={`/sesion/${session.id}`}>Ver sesión</Link>
        </Button>
      </div>
    </div>
  )
}
