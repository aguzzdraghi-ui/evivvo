"use client"

import { useEffect, useState } from "react"
import { Send, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/src/lib/supabase/client"

interface ConversationRow {
  id: string
  status: string
  professional_id: string
  professional_nombre: string | null
  professional_apellido: string | null
  last_message: string | null
  last_message_at: string | null
}

interface MessageRow {
  id: string
  sender_id: string
  content: string
  created_at: string
}

export function MensajesClient({ userId }: { userId: string }) {
  const [conversations, setConversations] = useState<ConversationRow[] | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageRow[]>([])
  const [draft, setDraft] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from("conversations")
        .select("id, status, professional_id, profiles:professional_id ( nombre, apellido )")
        .eq("patient_id", userId)
        .order("updated_at", { ascending: false })

      if (cancelled || !data) return

      const rows: ConversationRow[] = data.map((c: any) => {
        const p = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles
        return {
          id: c.id,
          status: c.status,
          professional_id: c.professional_id,
          professional_nombre: p?.nombre ?? null,
          professional_apellido: p?.apellido ?? null,
          last_message: null,
          last_message_at: null,
        }
      })
      setConversations(rows)
      if (rows.length > 0) setActiveId(rows[0].id)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [userId])

  useEffect(() => {
    if (!activeId) return
    let cancelled = false
    async function loadMessages() {
      const supabase = createClient()
      const { data } = await supabase
        .from("messages")
        .select("id, sender_id, content, created_at")
        .eq("conversation_id", activeId)
        .order("created_at", { ascending: true })
      if (!cancelled) setMessages(data ?? [])
    }
    loadMessages()
    return () => {
      cancelled = true
    }
  }, [activeId])

  async function handleSend() {
    if (!draft.trim() || !activeId || sending) return
    setSending(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from("messages")
      .insert({ conversation_id: activeId, sender_id: userId, content: draft.trim() })
      .select("id, sender_id, content, created_at")
      .single()
    setSending(false)
    if (!error && data) {
      setMessages((prev) => [...prev, data])
      setDraft("")
    }
  }

  if (conversations === null) {
    return <div className="h-64 animate-pulse rounded-2xl bg-muted" />
  }

  if (conversations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
        <MessageSquare className="mx-auto mb-3 h-8 w-8 text-muted-foreground/60" />
        <p className="font-medium text-foreground">Todavía no tenés conversaciones</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Cuando reserves una sesión, vas a poder escribirle a tu profesional acá.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-[240px_1fr]">
      <div className="divide-y divide-border border-border md:border-r">
        {conversations.map((c) => {
          const name = [c.professional_nombre, c.professional_apellido].filter(Boolean).join(" ") || "Profesional"
          return (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`block w-full px-4 py-3 text-left text-sm ${
                activeId === c.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50"
              }`}
            >
              {name}
            </button>
          )
        })}
      </div>

      <div className="flex h-[420px] flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay mensajes todavía. Escribí el primero.</p>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender_id === userId ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                    m.sender_id === userId ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex items-center gap-2 border-t border-border p-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribí un mensaje..."
            className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none"
          />
          <Button size="sm" onClick={handleSend} disabled={!draft.trim() || sending} className="rounded-xl">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
