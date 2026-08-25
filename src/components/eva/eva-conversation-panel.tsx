"use client"

import { AlertTriangle, ArrowRight, Loader2, Send, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PlusPromoCard } from "@/src/components/plus"
import type { EvaResponse } from "@/src/hooks/use-eva-chat"

const especialidadLabels: Record<string, string> = {
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

const tipoProfesionalLabels: Record<string, string> = {
  psicologo: "Psicólogo/a",
  psiquiatra: "Psiquiatra",
  coach: "Coach",
}

interface EvaConversationPanelProps {
  evaResponse: EvaResponse | null
  isLoading: boolean
  message: string
  setMessage: (value: string) => void
  onSubmit: (e: React.FormEvent | null, quickResponse?: string) => void
  onReset: () => void
  onVerProfesionales: () => void
  onCrearCuenta: () => void
}

export function EvaConversationPanel({
  evaResponse,
  isLoading,
  message,
  setMessage,
  onSubmit,
  onReset,
  onVerProfesionales,
  onCrearCuenta,
}: EvaConversationPanelProps) {
  return (
    <div className="relative rounded-[20px] border border-primary/15 bg-card p-6 text-left shadow-xl">
      <button
        type="button"
        onClick={onReset}
        aria-label="Cerrar conversación con EVA"
        className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-semibold text-foreground">EVA</p>
          <p className="text-xs text-muted-foreground">Asistente de bienestar emocional</p>
        </div>
      </div>

      {evaResponse?.tipo === "fuera_de_alcance" ? (
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-foreground">Un momento...</h3>
            <p className="text-muted-foreground">{evaResponse.mensaje}</p>
          </div>
        </div>
      ) : evaResponse?.tipo === "pregunta" ? (
        <div className="space-y-4">
          {evaResponse.mensajeEmpatico && (
            <div className="rounded-xl bg-primary/5 p-4">
              <p className="leading-relaxed text-foreground">{evaResponse.mensajeEmpatico}</p>
            </div>
          )}

          <p className="font-medium text-foreground">{evaResponse.pregunta}</p>

          {evaResponse.opcionesRapidas && evaResponse.opcionesRapidas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {evaResponse.opcionesRapidas.map((opcion) => (
                <button
                  key={opcion}
                  type="button"
                  onClick={() => onSubmit(null, opcion)}
                  disabled={isLoading}
                  className="rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm text-primary transition-all hover:bg-primary/10 disabled:opacity-50"
                >
                  {opcion}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={onSubmit} className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribí tu respuesta..."
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={isLoading}
            />
            <Button type="submit" size="sm" disabled={!message.trim() || isLoading} className="rounded-xl">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      ) : evaResponse?.tipo === "resumen" ? (
        <div className="space-y-4">
          {evaResponse.nivelUrgencia === "crisis" && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">Tu seguridad es lo más importante</p>
                  <p className="mt-1 text-sm text-red-700">
                    Si estás en peligro inmediato, contactá a una línea de crisis. En Argentina: Centro de
                    Asistencia al Suicida <strong>135</strong> (24hs).
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl bg-primary/5 p-4">
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">Lo que entendí de tu situación:</h4>
            <p className="leading-relaxed text-foreground">{evaResponse.resumenSituacion}</p>
          </div>

          {evaResponse.emocionesDetectadas && evaResponse.emocionesDetectadas.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Emociones detectadas:</h4>
              <div className="flex flex-wrap gap-2">
                {evaResponse.emocionesDetectadas.map((emocion) => (
                  <span key={emocion} className="rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground">
                    {emocion}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-border bg-background p-4">
            <h4 className="mb-2 text-sm font-medium text-foreground">Mi recomendación:</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              {evaResponse.tipoProfesional && (
                <p>
                  <span className="font-medium text-foreground">Profesional:</span>{" "}
                  {tipoProfesionalLabels[evaResponse.tipoProfesional]}
                </p>
              )}
              {evaResponse.especialidadesRecomendadas && evaResponse.especialidadesRecomendadas.length > 0 && (
                <p>
                  <span className="font-medium text-foreground">Especialidad:</span>{" "}
                  {evaResponse.especialidadesRecomendadas.map((e) => especialidadLabels[e] || e).join(", ")}
                </p>
              )}
              {evaResponse.modalidadRecomendada && (
                <p>
                  <span className="font-medium text-foreground">Modalidad:</span>{" "}
                  {evaResponse.modalidadRecomendada === "ahora" ? "Atención inmediata" : "Sesión programada"}
                </p>
              )}
            </div>
          </div>

          <PlusPromoCard variant="inline" />

          <div className="flex flex-col gap-3 pt-2">
            <Button onClick={onVerProfesionales} className="w-full gap-2 rounded-xl bg-gradient-to-r from-primary to-purple-600">
              Ver profesionales recomendados
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={onCrearCuenta} className="w-full rounded-xl">
              Crear cuenta para agendar
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">EVA está analizando...</span>
        </div>
      )}
    </div>
  )
}
