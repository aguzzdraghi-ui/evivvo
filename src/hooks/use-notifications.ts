"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/src/lib/supabase/client"

export interface AppNotification {
  id: string
  kind: string
  title: string
  body: string
  action_url: string | null
  read_at: string | null
  created_at: string
}

/** Real notifications for the current user — no invented counts or badges. */
export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!userId) return
    const supabase = createClient()
    const { data } = await supabase
      .from("notifications")
      .select("id, kind, title, body, action_url, read_at, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20)
    setNotifications(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => {
    load()
  }, [load])

  const markRead = useCallback(
    async (id: string) => {
      const supabase = createClient()
      await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)))
    },
    []
  )

  const unreadCount = notifications.filter((n) => !n.read_at).length

  return { notifications, unreadCount, loading, markRead, reload: load }
}
