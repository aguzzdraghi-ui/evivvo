import { createClient } from "@/src/lib/supabase/server"
import { detectaCrisis } from "@/app/api/analisis-emocional/route"
import { QUESTION_TEXT } from "@/src/lib/plus/checkin-questions"

const MOOD_LABELS = ["", "muy difícil", "difícil", "neutral", "bien", "muy bien"]
const SLEEP_LABELS = ["", "muy mal", "mal", "regular", "bien", "muy bien"]
const ENERGY_LABELS = ["", "muy bajo", "bajo", "medio", "bueno", "muy alto"]

/**
 * Runs once per completed check-in session (guarded by the caller only
 * invoking this after a real state transition to "completed"). Does not
 * generate a clinical diagnosis — it reflects the user's own five answers
 * back to them and flags real crisis-keyword hits using the same detector
 * as the EVA conversation, so risk situations still surface consistently.
 */
export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json()
    if (!sessionId || typeof sessionId !== "string") {
      return Response.json({ error: "sessionId requerido" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: "No autenticado" }, { status: 401 })

    const { data: session } = await supabase
      .from("emotional_checkin_sessions")
      .select("id, patient_id, assessment_id, status")
      .eq("id", sessionId)
      .eq("patient_id", user.id)
      .single()

    if (!session) return Response.json({ error: "Sesión no encontrada" }, { status: 404 })
    if (session.assessment_id) return Response.json({ ok: true, alreadyAnalyzed: true })

    const { data: answers } = await supabase
      .from("emotional_checkins")
      .select("question_key, mood_score, answer_text, answer_json")
      .eq("session_id", sessionId)

    const byKey = new Map((answers ?? []).map((a) => [a.question_key, a]))
    const animo = byKey.get("animo")
    const emocion = byKey.get("emocion")
    const sueno = byKey.get("sueno")
    const energia = byKey.get("energia")
    const reflexion = byKey.get("reflexion")

    const emotions = (emocion?.answer_json as { emotions?: string[] } | null)?.emotions ?? []
    const otherEmotion = (emocion?.answer_json as { other?: string } | null)?.other
    const factors = (reflexion?.answer_json as { factors?: string[] } | null)?.factors ?? []
    const note = (reflexion?.answer_json as { note?: string } | null)?.note ?? ""

    const freeText = [otherEmotion, note].filter(Boolean).join(" ")
    const isCrisis = freeText ? detectaCrisis(freeText) : false

    const summaryParts = [
      animo?.mood_score ? `Hoy tu día estuvo ${MOOD_LABELS[animo.mood_score]}.` : null,
      emotions.length ? `La emoción que más predominó fue ${emotions.join(", ").toLowerCase()}.` : null,
      sueno?.mood_score ? `Dormiste ${SLEEP_LABELS[sueno.mood_score]}.` : null,
      energia?.mood_score ? `Tu energía estuvo en un nivel ${ENERGY_LABELS[energia.mood_score]}.` : null,
      factors.length ? `Lo que más influyó fue: ${factors.join(", ").toLowerCase()}.` : null,
    ].filter(Boolean)

    const inputText = Object.values(QUESTION_TEXT)
      .map((q, i) => `${q} ${[animo, emocion, sueno, energia, reflexion][i]?.answer_text ?? ""}`)
      .join(" | ")
      .slice(0, 12000)

    const { data: assessment, error } = await supabase
      .from("emotional_assessments")
      .insert({
        patient_id: user.id,
        input_text: inputText || "Chequeo diario de Evivvo Plus",
        summary: summaryParts.join(" ") || "Completaste tu chequeo diario.",
        emotions,
        urgency: isCrisis ? "crisis" : "bajo",
        recommended_specialties: [],
        professional_type: null,
        recommended_modality: null,
        professional_context: "Chequeo diario de 5 preguntas (Evivvo Plus).",
        provider: "rule_based",
        model: "checkin_reflection_v1",
      })
      .select("id")
      .single()

    if (error) throw error

    await supabase.from("emotional_checkin_sessions").update({ assessment_id: assessment.id }).eq("id", sessionId)

    return Response.json({ ok: true, assessmentId: assessment.id, crisis: isCrisis })
  } catch {
    // Las cinco respuestas ya están persistidas antes de llegar acá — un
    // fallo del analizador nunca las pierde.
    return Response.json({ ok: false }, { status: 200 })
  }
}
