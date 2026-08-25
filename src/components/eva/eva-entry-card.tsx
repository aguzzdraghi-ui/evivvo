"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEvaChat } from "@/src/hooks/use-eva-chat"
import { EvaConversationPanel } from "./eva-conversation-panel"

interface EvaEntryCardProps {
  title?: string
  description: string
  placeholder: string
  submitLabel?: string
  /** "input": textarea + button visible immediately (home hero, mobile).
   *  "button": collapsed "Hablar con EVA" button that reveals the input on click (professionals explorer). */
  variant?: "input" | "button"
  className?: string
}

export function EvaEntryCard({
  title = "Hablar con EVA",
  description,
  placeholder,
  submitLabel = "Empezar",
  variant = "input",
  className = "",
}: EvaEntryCardProps) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(variant === "input")
  const {
    message,
    setMessage,
    isLoading,
    evaResponse,
    error,
    conversationStarted,
    handleSubmit,
    handleVerProfesionales,
    resetConversation,
  } = useEvaChat()

  if (conversationStarted) {
    return (
      <div className={className}>
        <EvaConversationPanel
          evaResponse={evaResponse}
          isLoading={isLoading}
          message={message}
          setMessage={setMessage}
          onSubmit={handleSubmit}
          onReset={resetConversation}
          onVerProfesionales={handleVerProfesionales}
          onCrearCuenta={() => router.push("/registro")}
        />
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden rounded-[20px] border border-primary/15 bg-gradient-to-br from-primary/[0.06] via-purple-500/[0.05] to-transparent p-6 ${className}`}
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {expanded ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="gap-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 px-6 hover:shadow-lg hover:shadow-primary/25"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : submitLabel}
          </Button>
        </form>
      ) : (
        <Button
          type="button"
          onClick={() => setExpanded(true)}
          className="w-full gap-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:shadow-lg hover:shadow-primary/25"
        >
          {title}
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  )
}
