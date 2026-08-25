"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Shield, Video, Clock, Heart, Loader2, X, AlertTriangle, Crown, Send } from "lucide-react"
import { PlusPromoCard } from "@/src/components/plus"

interface EvaResponse {
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

interface HistorialItem {
  rol: "user" | "assistant"
  texto: string
}

export function Hero() {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [evaResponse, setEvaResponse] = useState<EvaResponse | null>(null)
  const [historial, setHistorial] = useState<HistorialItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [conversationStarted, setConversationStarted] = useState(false)

  const handleSubmit = async (e: React.FormEvent | null, quickResponse?: string) => {
    if (e) e.preventDefault()
    const currentMessage = quickResponse || message
    if (!currentMessage.trim() || isLoading) return

    setIsLoading(true)
    setError(null)
    setConversationStarted(true)
    setEvaResponse(null) // Reset response while loading

    // Agregar mensaje del usuario al historial
    const nuevoHistorial: HistorialItem[] = [...historial, { rol: "user", texto: currentMessage }]
    setHistorial(nuevoHistorial)
    setMessage("")

    try {
      const response = await fetch("/api/analisis-emocional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          mensaje: currentMessage,
          historial: historial 
        }),
      })

      if (!response.ok) {
        throw new Error("Error al procesar el mensaje")
      }

      const data = await response.json()

      // Agregar respuesta de EVA al historial si es pregunta
      if (data.tipo === "pregunta" && data.pregunta) {
        setHistorial([...nuevoHistorial, { 
          rol: "assistant", 
          texto: `${data.mensajeEmpatico || ""} ${data.pregunta}`.trim() 
        }])
      }

      // Guardar resumen en localStorage cuando se genera
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
          historial: nuevoHistorial
        }
        localStorage.setItem("evivvo_eva_summary", JSON.stringify(evaSummary))
      }

      // Set response AFTER all other state updates
      setIsLoading(false)
      setEvaResponse(data)
      
    } catch (err) {
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
  }

  const suggestions = [
    "Siento mucha ansiedad",
    "Estoy pasando por una ruptura",
    "No puedo dormir bien",
    "Me siento solo/a",
  ]

  const especialidadLabels: Record<string, string> = {
    "ansiedad": "Ansiedad",
    "depresion": "Depresión",
    "estres": "Estrés",
    "rupturas": "Rupturas amorosas",
    "duelo": "Duelo",
    "soledad": "Soledad",
    "pareja": "Terapia de pareja",
    "autoestima": "Autoestima",
    "crecimiento-personal": "Crecimiento personal",
    "insomnio": "Insomnio",
  }

  const tipoProfesionalLabels: Record<string, string> = {
    "psicologo": "Psicólogo/a",
    "psiquiatra": "Psiquiatra",
    "coach": "Coach",
  }

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/30 to-background" />
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-blob" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-purple-400/10 blur-3xl animate-blob animate-float-delayed" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-300/10 blur-3xl animate-float-slow" />
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <Link 
            href="/profesionales?disponible=true"
            className="group mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/20 hover:scale-105"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span>Profesionales disponibles ahora</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Main Title */}
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl xl:text-7xl">
            Cuéntanos{" "}
            <span className="text-gradient">qué estás viviendo</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
            EVA, nuestra IA, te hace algunas preguntas para entenderte mejor 
            y conectarte con el profesional ideal para vos.
          </p>

          {/* EVA Conversation Card */}
          {conversationStarted && (
            <div className="mx-auto mb-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative rounded-2xl glass p-6 text-left shadow-xl border border-primary/20">
                <button
                  onClick={resetConversation}
                  className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Header EVA */}
                <div className="flex items-center gap-3 mb-4">
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
                      <h3 className="font-semibold text-foreground mb-2">Un momento...</h3>
                      <p className="text-muted-foreground">{evaResponse.mensaje}</p>
                    </div>
                  </div>
                ) : evaResponse?.tipo === "pregunta" ? (
                  <div className="space-y-4">
                    {/* Mensaje empático */}
                    {evaResponse.mensajeEmpatico && (
                      <div className="rounded-xl bg-primary/5 p-4">
                        <p className="text-foreground leading-relaxed">{evaResponse.mensajeEmpatico}</p>
                      </div>
                    )}

                    {/* Pregunta */}
                    <p className="text-foreground font-medium">{evaResponse.pregunta}</p>

                    {/* Opciones rápidas */}
                    {evaResponse.opcionesRapidas && evaResponse.opcionesRapidas.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {evaResponse.opcionesRapidas.map((opcion) => (
                          <button
                            key={opcion}
                            onClick={() => handleSubmit(null, opcion)}
                            disabled={isLoading}
                            className="rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm text-primary transition-all hover:bg-primary/10 disabled:opacity-50"
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Input para respuesta personalizada */}
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Escribí tu respuesta..."
                        className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        disabled={isLoading}
                      />
                      <Button 
                        type="submit" 
                        size="sm" 
                        disabled={!message.trim() || isLoading}
                        className="rounded-xl"
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </form>
                  </div>
                ) : evaResponse?.tipo === "resumen" ? (
                  <div className="space-y-4">
                    {/* Crisis Alert */}
                    {evaResponse.nivelUrgencia === "crisis" && (
                      <div className="rounded-xl bg-red-50 border border-red-200 p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-800">Tu seguridad es lo más importante</p>
                            <p className="text-sm text-red-700 mt-1">
                              Si estás en peligro inmediato, contactá a una línea de crisis. 
                              En Argentina: Centro de Asistencia al Suicida <strong>135</strong> (24hs).
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Resumen */}
                    <div className="rounded-xl bg-primary/5 p-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Lo que entendí de tu situación:</h4>
                      <p className="text-foreground leading-relaxed">{evaResponse.resumenSituacion}</p>
                    </div>

                    {/* Emociones detectadas */}
                    {evaResponse.emocionesDetectadas && evaResponse.emocionesDetectadas.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Emociones detectadas:</h4>
                        <div className="flex flex-wrap gap-2">
                          {evaResponse.emocionesDetectadas.map((emocion) => (
                            <span
                              key={emocion}
                              className="rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground"
                            >
                              {emocion}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recomendación */}
                    <div className="rounded-xl border border-border bg-background p-4">
                      <h4 className="text-sm font-medium text-foreground mb-2">Mi recomendación:</h4>
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
                            {evaResponse.especialidadesRecomendadas.map(e => especialidadLabels[e] || e).join(", ")}
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

                    {/* Plus Promo */}
                    <PlusPromoCard variant="inline" />

                    {/* CTA */}
                    <div className="flex flex-col gap-3 pt-2">
                      <Button
                        onClick={handleVerProfesionales}
                        className="w-full gap-2 rounded-xl bg-gradient-to-r from-primary to-purple-600"
                      >
                        Ver profesionales recomendados
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => router.push("/registro")}
                        className="w-full rounded-xl"
                      >
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
            </div>
          )}

          {/* Initial Input - Solo si no hay conversación */}
          {!conversationStarted && (
            <>
              <form onSubmit={handleSubmit} className="mx-auto mb-8 max-w-2xl">
                <div 
                  className={`relative rounded-2xl transition-all duration-300 ${
                    isFocused 
                      ? "ring-2 ring-primary/50 shadow-lg shadow-primary/10" 
                      : "shadow-md"
                  }`}
                >
                  <div className="input-emotional flex items-start gap-4 rounded-2xl p-4">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-500">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Contame cómo te sentís... Estoy acá para escucharte."
                        className="min-h-[80px] w-full resize-none bg-transparent text-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                        rows={2}
                        disabled={isLoading}
                      />
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span>EVA te hace preguntas para entenderte mejor</span>
                        </div>
                        <Button 
                          type="submit"
                          size="lg"
                          disabled={!message.trim() || isLoading}
                          className="gap-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 px-6 transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Analizando...
                            </>
                          ) : (
                            <>
                              Comenzar
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              {/* Error message */}
              {error && (
                <div className="mx-auto mb-8 max-w-2xl rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">
                  {error}
                </div>
              )}

              {/* Suggestions - Al hacer click envían directamente */}
              <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
                <span className="text-sm text-muted-foreground">Prueba:</span>
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSubmit(null, suggestion)}
                    disabled={isLoading}
                    className="rounded-full border border-border bg-background/80 px-4 py-2 text-sm text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">100% Confidencial</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Video className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Videollamada HD</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Conexión en minutos</span>
            </div>
          </div>
        </div>

        {/* Floating Cards Preview - Solo en desktop lg+ */}
        {!conversationStarted && (
          <div className="mt-8 hidden lg:flex justify-center gap-6">
            {/* Card Dra. Ana */}
            <div className="w-44 animate-float rounded-2xl glass p-3 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20">
                  <Image
                    src="/images/hero-woman.jpg"
                    alt="Profesional"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Dra. Ana</p>
                  <p className="text-xs text-muted-foreground">Psicóloga</p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-emerald-600">Disponible</span>
              </div>
            </div>

            {/* Card Match Emocional */}
            <div className="w-48 animate-float-delayed rounded-2xl glass p-3 shadow-lg">
              <div className="mb-1 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary">Match Emocional</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Te conectamos con el profesional ideal
              </p>
            </div>

            {/* Plus Promo */}
            <div className="w-44">
              <PlusPromoCard variant="floating" />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
