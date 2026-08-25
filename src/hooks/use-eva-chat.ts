"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export interface EvaResponse {
  tipo: "pregunta" | "resumen" | "fuera_de_alcance"
  mensaje?: string
  mensajeEmpatico?: string | null
  pregunta?: string | null
  opcionesRapidas?: string[] | null
  resumenSituacion?: string | null
  emocionesDetectadas?: string[] | null
  nivelUrgencia?: "bajo" | "medio" | "alto" | "crisis" | null
  especialidadesRecomendadas?: string[] | null
  tipoProfesional?: "psicologo" | "psiquiatra" | "coach" | null
  modalidadRecomendada?: "ahora" | "agendar" | null
  contextoProfesional?: string | null
}

export interface EvaHistorialItem {
  rol: "user" | "assistant"
  texto: string
}

/**
 * Shared EVA conversation flow. Talks to the real /api/analisis-emocional
 * endpoint — no simulated responses. Used by every EVA entry point
 * (home hero, mobile home, professionals explorer) so the flow and its
 * state are identical everywhere.
 */
export function useEvaChat() {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [evaResponse, setEvaResponse] = useState<EvaResponse | null>(null)
  const [historial, setHistorial] = useState<EvaHistorialItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [conversationStarted, setConversationStarted] = useState(false)

  const handleSubmit = async (e: React.FormEvent | null, quickResponse?: string) => {
    if (e) e.preventDefault()
    const currentMessage = quickResponse || message
    if (!currentMessage.trim() || isLoading) return

    setIsLoading(true)
    setError(null)
    setConversationStarted(true)
    setEvaResponse(null)

    const nuevoHistorial: EvaHistorialItem[] = [...historial, { rol: "user", texto: currentMessage }]
    setHistorial(nuevoHistorial)
    setMessage("")

    try {
      const response = await fetch("/api/analisis-emocional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensaje: currentMessage,
          historial: historial,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al procesar el mensaje")
      }

      const data: EvaResponse = await response.json()

      if (data.tipo === "pregunta" && data.pregunta) {
        setHistorial([
          ...nuevoHistorial,
          { rol: "assistant", texto: `${data.mensajeEmpatico || ""} ${data.pregunta}`.trim() },
        ])
      }

      if (data.tipo === "resumen") {
        const evaSummary = {
          resumenSituacion: data.resumenSituacion,
          emocionesDetectadas: data.emocionesDetectadas,
          nivelUrgencia: data.nivelUrgencia,
          especialidadesRecomendadas: data.especialidadesRecomendadas,
          tipoProfesional: data.tipoProfesional,
          modalidadRecomendada: data.modalidadRecomendada,
          contextoProfesional: data.contextoProfesional,
          fecha: new Date().toISOString(),
          historial: nuevoHistorial,
        }
        localStorage.setItem("evivvo_eva_summary", JSON.stringify(evaSummary))
      }

      setIsLoading(false)
      setEvaResponse(data)
    } catch {
      setIsLoading(false)
      setError("Hubo un error procesando tu mensaje. Por favor intentá de nuevo.")
    }
  }

  const handleVerProfesionales = () => {
    if (evaResponse?.especialidadesRecomendadas?.length) {
      const especialidad = evaResponse.especialidadesRecomendadas[0]
      const modo = evaResponse.modalidadRecomendada === "ahora" ? "&disponible=true" : ""
      router.push(`/profesionales?specialty=${especialidad}${modo}&match=true`)
    } else {
      router.push("/profesionales?match=true")
    }
  }

  const resetConversation = () => {
    setEvaResponse(null)
    setHistorial([])
    setMessage("")
    setConversationStarted(false)
    setError(null)
  }

  return {
    message,
    setMessage,
    isLoading,
    evaResponse,
    error,
    conversationStarted,
    handleSubmit,
    handleVerProfesionales,
    resetConversation,
  }
}
