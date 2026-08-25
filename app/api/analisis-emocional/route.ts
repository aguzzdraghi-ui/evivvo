import { generateObject } from "ai"
import { z } from "zod"

// Schema para respuesta de EVA
const evaResponseSchema = z.object({
  tipo: z.enum(["pregunta", "resumen"]).describe("Si EVA necesita más info = pregunta, si ya tiene suficiente = resumen"),
  mensajeEmpatico: z.string().nullable().describe("Mensaje empático breve validando al usuario"),
  pregunta: z.string().nullable().describe("Pregunta de seguimiento"),
  opcionesRapidas: z.array(z.string()).nullable().describe("3-4 opciones de respuesta rápida"),
  resumenSituacion: z.string().nullable().describe("Resumen de la situación"),
  emocionesDetectadas: z.array(z.string()).nullable().describe("Emociones detectadas"),
  nivelUrgencia: z.enum(["bajo", "medio", "alto", "crisis"]).nullable(),
  especialidadesRecomendadas: z.array(z.string()).nullable(),
  tipoProfesional: z.enum(["psicologo", "psiquiatra", "coach"]).nullable(),
  modalidadRecomendada: z.enum(["ahora", "agendar"]).nullable(),
  contextoProfesional: z.string().nullable(),
})

type EvaResponse = z.infer<typeof evaResponseSchema>

// Análisis mock basado en palabras clave cuando no hay API key
function mockAnalysis(mensaje: string, preguntasRealizadas: number): EvaResponse {
  const msgLower = mensaje.toLowerCase()
  
  // Detección de crisis
  const palabrasCrisis = ["suicidio", "morir", "matarme", "no quiero vivir", "hacerme daño", "autolesión"]
  if (palabrasCrisis.some(p => msgLower.includes(p))) {
    return {
      tipo: "resumen",
      mensajeEmpatico: "Gracias por confiar en mí con algo tan importante.",
      pregunta: null,
      opcionesRapidas: null,
      resumenSituacion: "Estás pasando por un momento muy difícil y es importante que recibas apoyo profesional urgente.",
      emocionesDetectadas: ["desesperanza", "angustia"],
      nivelUrgencia: "crisis",
      especialidadesRecomendadas: ["depresion"],
      tipoProfesional: "psiquiatra",
      modalidadRecomendada: "ahora",
      contextoProfesional: "Usuario expresó pensamientos de crisis. Requiere atención prioritaria."
    }
  }

  // Detección de emociones por palabras clave
  const detecciones: Record<string, string[]> = {
    ansiedad: ["ansiedad", "ansioso", "nervioso", "pánico", "preocupado", "intranquilo"],
    depresion: ["triste", "deprimido", "sin ganas", "vacío", "desesperanza"],
    estres: ["estrés", "estresado", "agotado", "abrumado", "presión", "cansado"],
    rupturas: ["ruptura", "separación", "ex", "terminamos", "me dejó", "divorcio"],
    duelo: ["perdí", "murió", "falleció", "duelo", "luto"],
    soledad: ["solo", "soledad", "aislado", "nadie me entiende"],
    pareja: ["pareja", "relación", "conflicto", "pelea", "discusión"],
    insomnio: ["dormir", "insomnio", "no puedo dormir", "desvelo"],
    autoestima: ["inseguro", "autoestima", "no valgo", "inútil"],
  }

  let especialidadDetectada = "ansiedad"
  let emocionesDetectadas: string[] = []

  for (const [esp, palabras] of Object.entries(detecciones)) {
    if (palabras.some(p => msgLower.includes(p))) {
      especialidadDetectada = esp
      emocionesDetectadas.push(esp === "rupturas" ? "tristeza" : esp === "pareja" ? "frustración" : esp)
      break
    }
  }

  if (emocionesDetectadas.length === 0) {
    emocionesDetectadas = ["malestar", "incertidumbre"]
  }

  // Si ya hay 2+ preguntas, generar resumen
  if (preguntasRealizadas >= 2) {
    return {
      tipo: "resumen",
      mensajeEmpatico: null,
      pregunta: null,
      opcionesRapidas: null,
      resumenSituacion: `Entiendo que estás pasando por un momento difícil relacionado con ${especialidadDetectada === "ansiedad" ? "ansiedad o nerviosismo" : especialidadDetectada}. Es muy valiente de tu parte buscar ayuda.`,
      emocionesDetectadas,
      nivelUrgencia: "medio",
      especialidadesRecomendadas: [especialidadDetectada],
      tipoProfesional: "psicologo",
      modalidadRecomendada: "agendar",
      contextoProfesional: `Usuario busca apoyo para ${especialidadDetectada}.`
    }
  }

  // Preguntas de seguimiento según etapa
  const preguntas = [
    {
      mensajeEmpatico: "Gracias por compartir eso conmigo. Entiendo que no es fácil.",
      pregunta: "¿Hace cuánto tiempo te sentís así?",
      opcionesRapidas: ["Hace unos días", "Hace semanas", "Hace meses", "Hace mucho tiempo"]
    },
    {
      mensajeEmpatico: "Te escucho. Es importante que hayas dado este paso.",
      pregunta: "¿Esto está afectando tu día a día, como el trabajo o tus relaciones?",
      opcionesRapidas: ["Sí, bastante", "Un poco", "No mucho aún", "No estoy seguro/a"]
    },
    {
      mensajeEmpatico: "Entiendo perfectamente.",
      pregunta: "¿Preferís hablar con alguien hoy mismo o preferís agendar una sesión para más adelante?",
      opcionesRapidas: ["Quiero hablar hoy", "Prefiero agendar", "No estoy seguro/a"]
    }
  ]

  const preguntaActual = preguntas[preguntasRealizadas] || preguntas[0]

  return {
    tipo: "pregunta",
    mensajeEmpatico: preguntaActual.mensajeEmpatico,
    pregunta: preguntaActual.pregunta,
    opcionesRapidas: preguntaActual.opcionesRapidas,
    resumenSituacion: null,
    emocionesDetectadas: null,
    nivelUrgencia: null,
    especialidadesRecomendadas: null,
    tipoProfesional: null,
    modalidadRecomendada: null,
    contextoProfesional: null
  }
}

// Verificar si el mensaje es emocional
function esContenidoEmocional(mensaje: string, historialLength: number): boolean {
  const msgLower = mensaje.toLowerCase()
  const palabrasEmocionales = [
    "triste", "ansiedad", "ansioso", "deprimido", "solo", "soledad",
    "estrés", "estresado", "preocupado", "miedo", "angustia", "angustiado",
    "ruptura", "separación", "divorcio", "duelo", "perdida", "perdí",
    "pareja", "relación", "conflicto", "pelea", "discusión",
    "dormir", "insomnio", "autoestima", "inseguro", "inseguridad",
    "ayuda", "mal", "difícil", "momento", "pasando", "siento",
    "no puedo", "no sé", "confundido", "perdido", "agotado", "cansado",
    "familia", "trabajo", "presión", "abrumado", "lloro", "llorar",
    "feliz", "mejor", "crecer", "cambiar", "mejorar", "superar",
    "terapia", "psicólogo", "hablar", "desahogar", "nervioso",
    "crisis", "pánico", "ataque", "nervios", "suicidio", "mucha",
    // Frases completas de las sugerencias
    "siento mucha", "estoy pasando", "no puedo dormir", "me siento"
  ]

  // Si el historial ya tiene mensajes, siempre es emocional
  if (historialLength > 0) return true
  
  // Si contiene palabras emocionales
  if (palabrasEmocionales.some(p => msgLower.includes(p))) return true
  
  // Si es un mensaje largo (más de 15 caracteres), probablemente es emocional
  if (msgLower.length > 15) return true

  return false
}

export async function POST(req: Request) {
  try {
    const { mensaje, historial = [] } = await req.json()

    if (!mensaje || typeof mensaje !== "string") {
      return Response.json({ error: "El mensaje es requerido" }, { status: 400 })
    }

    // Verificar si es contenido emocional
    if (!esContenidoEmocional(mensaje, historial.length)) {
      return Response.json({
        tipo: "fuera_de_alcance",
        mensaje: "Entiendo que quieras conversar, pero mi propósito es ayudarte con tu bienestar emocional. Si estás pasando por un momento difícil, sentís ansiedad, estrés, tristeza, o cualquier otra situación emocional, estoy acá para escucharte. ¿Hay algo relacionado con cómo te sentís que quieras compartir?"
      })
    }

    const preguntasRealizadas = historial.filter((h: { rol: string }) => h.rol === "assistant").length

    // SIEMPRE usar modo mock por ahora - funciona sin API key
    const mockResponse = mockAnalysis(mensaje, preguntasRealizadas)
    return Response.json(mockResponse)

  } catch (error) {
    // Fallback final - nunca mostrar error al usuario
    return Response.json({
      tipo: "pregunta",
      mensajeEmpatico: "Gracias por compartir eso conmigo.",
      pregunta: "¿Podrías contarme un poco más sobre cómo te sentís?",
      opcionesRapidas: ["Me siento ansioso/a", "Estoy triste", "Estoy estresado/a", "Otra cosa"],
      resumenSituacion: null,
      emocionesDetectadas: null,
      nivelUrgencia: null,
      especialidadesRecomendadas: null,
      tipoProfesional: null,
      modalidadRecomendada: null,
      contextoProfesional: null
    })
  }
}
