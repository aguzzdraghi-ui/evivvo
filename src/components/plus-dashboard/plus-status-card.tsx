"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/src/lib/supabase/client"

interface PlusStatusCardProps {
  userId: string
}

/** "Tu Plus hoy": real days since the user's Plus membership started — never a fabricated streak. */
export function PlusStatusCard({ userId }: PlusStatusCardProps) {
  const [days, setDays] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from("subscriptions")
        .select("starts_at")
        .eq("user_id", userId)
        .order("starts_at", { ascending: true })
        .limit(1)
        .maybeSingle()

      if (cancelled) return
      if (data?.starts_at) {
        const started = new Date(data.starts_at)
        const diffDays = Math.max(1, Math.floor((Date.now() - started.getTime()) / (1000 * 60 * 60 * 24)) + 1)
        setDays(diffDays)
      } else {
        setDays(null)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [userId])

  const progress = days !== null ? Math.min(100, (days / 30) * 100) : 0

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
      <div
        className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
        style={{ background: `conic-gradient(var(--primary) ${progress}%, var(--border) 0)` }}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-card text-sm font-bold text-foreground">
          {days ?? "–"}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">Tu Plus hoy</p>
        <p className="text-xs text-muted-foreground">
          {days !== null ? `${days} día${days === 1 ? "" : "s"} acompañándote` : "Bienvenido/a a Evivvo Plus"}
        </p>
      </div>
    </div>
  )
}
