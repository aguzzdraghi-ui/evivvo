import { createClient } from "@/src/lib/supabase/client"
import { QUESTION_KEYS, type QuestionKey } from "./checkin-questions"

export interface CheckinSession {
  id: string
  checkin_date: string
  status: "draft" | "completed"
  current_step: number
  started_at: string
  completed_at: string | null
  assessment_id: string | null
}

export interface CheckinAnswerRow {
  question_key: QuestionKey | "legacy"
  mood_score: number | null
  answer_text: string | null
  answer_json: Record<string, unknown> | null
}

function localDateString(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function localTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return "America/Argentina/Buenos_Aires"
  }
}

/**
 * Finds today's (user-local date) check-in session, creating it if it does
 * not exist yet. Idempotent: relies on the DB's unique(patient_id,
 * checkin_date) constraint, so a double click or two tabs both land on the
 * same row instead of creating duplicates.
 */
export async function getOrCreateTodaySession(userId: string): Promise<CheckinSession> {
  const supabase = createClient()
  const today = localDateString()

  const { data: existing } = await supabase
    .from("emotional_checkin_sessions")
    .select("id, checkin_date, status, current_step, started_at, completed_at, assessment_id")
    .eq("patient_id", userId)
    .eq("checkin_date", today)
    .maybeSingle()

  if (existing) return existing as CheckinSession

  const { data: created, error } = await supabase
    .from("emotional_checkin_sessions")
    .upsert(
      { patient_id: userId, checkin_date: today, timezone: localTimezone(), status: "draft", current_step: 1 },
      { onConflict: "patient_id,checkin_date" }
    )
    .select("id, checkin_date, status, current_step, started_at, completed_at, assessment_id")
    .single()

  if (error) throw error
  return created as CheckinSession
}

export async function getSessionAnswers(sessionId: string): Promise<Partial<Record<QuestionKey, CheckinAnswerRow>>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("emotional_checkins")
    .select("question_key, mood_score, answer_text, answer_json")
    .eq("session_id", sessionId)

  if (error) throw error

  const byKey: Partial<Record<QuestionKey, CheckinAnswerRow>> = {}
  for (const row of data ?? []) {
    if (QUESTION_KEYS.includes(row.question_key as QuestionKey)) {
      byKey[row.question_key as QuestionKey] = row as CheckinAnswerRow
    }
  }
  return byKey
}

interface SaveAnswerInput {
  sessionId: string
  patientId: string
  questionKey: QuestionKey
  questionText: string
  moodScore?: number | null
  answerText?: string | null
  answerJson?: Record<string, unknown> | null
  nextStep: number
}

/** Upserts one question's answer and advances the session's current_step. Idempotent per (session_id, question_key). */
export async function saveAnswer(input: SaveAnswerInput) {
  const supabase = createClient()

  const { error: answerError } = await supabase.from("emotional_checkins").upsert(
    {
      patient_id: input.patientId,
      session_id: input.sessionId,
      question_key: input.questionKey,
      question: input.questionText,
      mood_score: input.moodScore ?? 3,
      answer_text: input.answerText ?? null,
      answer_json: input.answerJson ?? null,
      source: "fixed",
      checkin_date: localDateString(),
    },
    { onConflict: "session_id,question_key" }
  )
  if (answerError) throw answerError

  const { error: stepError } = await supabase
    .from("emotional_checkin_sessions")
    .update({ current_step: input.nextStep })
    .eq("id", input.sessionId)
  if (stepError) throw stepError
}

/** Atomically marks the session completed. Idempotent — a second call is a no-op (guarded by the draft-status filter). */
export async function completeSession(sessionId: string): Promise<boolean> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("emotional_checkin_sessions")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", sessionId)
    .eq("status", "draft")
    .select("id")

  if (error) throw error
  return (data?.length ?? 0) > 0
}

export async function linkAssessment(sessionId: string, assessmentId: string) {
  const supabase = createClient()
  await supabase.from("emotional_checkin_sessions").update({ assessment_id: assessmentId }).eq("id", sessionId)
}

export interface WeekDay {
  date: string
  completed: boolean
  moodAverage: number | null
}

/** Real last-7-days completion state for the "Tu semana" strip — never fabricated. */
export async function getWeekHistory(userId: string): Promise<WeekDay[]> {
  const supabase = createClient()
  const today = new Date()
  const days: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push(localDateString(d))
  }

  const { data } = await supabase
    .from("emotional_checkin_sessions")
    .select("checkin_date, status, id")
    .eq("patient_id", userId)
    .in("checkin_date", days)

  const weekSessions = (data ?? []) as { checkin_date: string; status: string; id: string }[]
  const sessionsByDate = new Map(weekSessions.map((s) => [s.checkin_date, s]))

  const { data: moodRows } = await supabase
    .from("emotional_checkins")
    .select("session_id, mood_score, question_key")
    .in(
      "session_id",
      weekSessions.map((s) => s.id)
    )

  const moodBySession = new Map<string, number[]>()
  for (const row of moodRows ?? []) {
    if (row.question_key === "animo" || row.question_key === "legacy") {
      const arr = moodBySession.get(row.session_id) ?? []
      arr.push(row.mood_score)
      moodBySession.set(row.session_id, arr)
    }
  }

  return days.map((date) => {
    const session = sessionsByDate.get(date)
    const scores = session ? moodBySession.get(session.id) : undefined
    const avg = scores && scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null
    return { date, completed: session?.status === "completed", moodAverage: avg }
  })
}
