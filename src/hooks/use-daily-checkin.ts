"use client"

import { useCallback, useEffect, useState } from "react"
import {
  QUESTION_KEYS,
  type QuestionKey,
} from "@/src/lib/plus/checkin-questions"
import {
  completeSession,
  getOrCreateTodaySession,
  getSessionAnswers,
  saveAnswer,
  type CheckinAnswerRow,
  type CheckinSession,
} from "@/src/lib/plus/checkin-queries"

export type SaveState = "idle" | "saving" | "saved" | "error"

interface UseDailyCheckinResult {
  loading: boolean
  error: string | null
  session: CheckinSession | null
  answers: Partial<Record<QuestionKey, CheckinAnswerRow>>
  step: number
  currentQuestion: QuestionKey
  saveState: SaveState
  isCompleted: boolean
  goBack: () => void
  submitAnswer: (payload: { moodScore?: number; answerText?: string; answerJson?: Record<string, unknown> }) => Promise<void>
  finish: () => Promise<void>
}

/**
 * Drives the 5-question daily check-in: loads/creates today's session,
 * saves each answer to Supabase before advancing (never localStorage as
 * source of truth), and reconciles the resumable step on load — closing the
 * tab and coming back later picks up on the first pending question.
 */
export function useDailyCheckin(userId: string | null): UseDailyCheckinResult {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<CheckinSession | null>(null)
  const [answers, setAnswers] = useState<Partial<Record<QuestionKey, CheckinAnswerRow>>>({})
  const [step, setStep] = useState(1)
  const [saveState, setSaveState] = useState<SaveState>("idle")

  useEffect(() => {
    if (!userId) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const s = await getOrCreateTodaySession(userId!)
        const a = await getSessionAnswers(s.id)
        if (cancelled) return
        setSession(s)
        setAnswers(a)
        setStep(s.status === "completed" ? 5 : s.current_step)
      } catch {
        if (!cancelled) setError("No pudimos cargar tu chequeo de hoy. Probá de nuevo en unos minutos.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [userId])

  const currentQuestion = QUESTION_KEYS[Math.min(step, 5) - 1]

  const goBack = useCallback(() => {
    setStep((s) => Math.max(1, s - 1))
  }, [])

  const submitAnswer = useCallback(
    async (payload: { moodScore?: number; answerText?: string; answerJson?: Record<string, unknown> }) => {
      if (!session || !userId) return
      setSaveState("saving")
      try {
        const nextStep = Math.min(step + 1, 5)
        await saveAnswer({
          sessionId: session.id,
          patientId: userId,
          questionKey: currentQuestion,
          questionText: currentQuestion,
          moodScore: payload.moodScore,
          answerText: payload.answerText,
          answerJson: payload.answerJson,
          nextStep,
        })
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion]: {
            question_key: currentQuestion,
            mood_score: payload.moodScore ?? null,
            answer_text: payload.answerText ?? null,
            answer_json: payload.answerJson ?? null,
          },
        }))
        setSaveState("saved")
        if (step < 5) setStep(step + 1)
      } catch {
        setSaveState("error")
      }
    },
    [session, userId, step, currentQuestion]
  )

  const finish = useCallback(async () => {
    if (!session) return
    const didComplete = await completeSession(session.id)
    setSession((prev) => (prev ? { ...prev, status: "completed", completed_at: new Date().toISOString() } : prev))
    if (didComplete) {
      // Fire-and-forget: run the real analyzer once. A failure here never
      // discards the five answers, which are already persisted.
      void fetch("/api/plus/checkin-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id }),
      }).catch(() => {})
    }
  }, [session])

  return {
    loading,
    error,
    session,
    answers,
    step,
    currentQuestion,
    saveState,
    isCompleted: session?.status === "completed",
    goBack,
    submitAnswer,
    finish,
  }
}
