"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, Loader2, Lock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDailyCheckin } from "@/src/hooks/use-daily-checkin"
import { CheckinStepper } from "./checkin-stepper"
import { GradedAnswerGrid } from "./graded-answer-grid"
import { EmotionAnswerGrid } from "./emotion-answer-grid"
import { ReflectionAnswer } from "./reflection-answer"
import {
  ENERGY_OPTIONS,
  MOOD_OPTIONS,
  QUESTION_TEXT,
  SLEEP_OPTIONS,
  type EmotionAnswer,
  type ReflectionAnswer as ReflectionAnswerType,
} from "@/src/lib/plus/checkin-questions"

interface DailyCheckinCardProps {
  userId: string
}

export function DailyCheckinCard({ userId }: DailyCheckinCardProps) {
  const { loading, error, answers, step, currentQuestion, saveState, isCompleted, goBack, submitAnswer, finish } =
    useDailyCheckin(userId)

  const [moodScore, setMoodScore] = useState<number | null>(null)
  const [sleepScore, setSleepScore] = useState<number | null>(null)
  const [energyScore, setEnergyScore] = useState<number | null>(null)
  const [emotions, setEmotions] = useState<string[]>([])
  const [otherEmotion, setOtherEmotion] = useState("")
  const [factors, setFactors] = useState<string[]>([])
  const [note, setNote] = useState("")
  const [finishing, setFinishing] = useState(false)

  // Recover the persisted answer for the active step (powers "Atrás").
  useEffect(() => {
    const saved = answers[currentQuestion]
    if (currentQuestion === "animo") setMoodScore(saved?.mood_score ?? null)
    if (currentQuestion === "sueno") setSleepScore(saved?.mood_score ?? null)
    if (currentQuestion === "energia") setEnergyScore(saved?.mood_score ?? null)
    if (currentQuestion === "emocion") {
      const j = saved?.answer_json as EmotionAnswer | null
      setEmotions(j?.emotions ?? [])
      setOtherEmotion(j?.other ?? "")
    }
    if (currentQuestion === "reflexion") {
      const j = saved?.answer_json as ReflectionAnswerType | null
      setFactors(j?.factors ?? [])
      setNote(j?.note ?? "")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, step])

  if (loading) {
    return (
      <div className="animate-pulse rounded-[22px] border border-border bg-card p-6">
        <div className="mb-4 h-4 w-40 rounded bg-muted" />
        <div className="mb-6 h-7 w-72 rounded bg-muted" />
        <div className="h-24 rounded-2xl bg-muted" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-[22px] border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive-foreground">
        {error}
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="rounded-[22px] border border-border bg-card p-6 text-center sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
          <Check className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Ya completaste tu chequeo de hoy</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Gracias por tomarte estos minutos para vos. Mañana vas a poder hacer el próximo.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/profesionales">Buscar profesional</Link>
          </Button>
          <Button asChild className="rounded-xl bg-gradient-to-r from-primary to-purple-600">
            <a href="#eva-quick">Hablar con EVA</a>
          </Button>
        </div>
      </div>
    )
  }

  const canSubmit =
    (currentQuestion === "animo" && moodScore !== null) ||
    (currentQuestion === "sueno" && sleepScore !== null) ||
    (currentQuestion === "energia" && energyScore !== null) ||
    (currentQuestion === "emocion" && emotions.length > 0) ||
    (currentQuestion === "reflexion" && factors.length > 0)

  async function handleContinue() {
    if (currentQuestion === "animo") await submitAnswer({ moodScore: moodScore! })
    else if (currentQuestion === "sueno") await submitAnswer({ moodScore: sleepScore! })
    else if (currentQuestion === "energia") await submitAnswer({ moodScore: energyScore! })
    else if (currentQuestion === "emocion")
      await submitAnswer({ answerJson: { emotions, other: otherEmotion || undefined } })
    else if (currentQuestion === "reflexion") {
      await submitAnswer({ answerJson: { factors, note: note || undefined } })
      setFinishing(true)
      await finish()
      setFinishing(false)
    }
  }

  return (
    <div className="rounded-[22px] border border-border bg-card p-6 shadow-lg shadow-black/10 sm:p-8">
      <div className="mb-1 flex items-center gap-2 text-xs font-medium text-primary">
        <Sparkles className="h-3.5 w-3.5" />
        Chequeo diario · menos de 2 minutos
      </div>
      <h2 className="text-xl font-bold text-foreground sm:text-2xl">¿Cómo estás hoy, de verdad?</h2>
      <p className="mt-1 text-sm text-muted-foreground">No hay respuestas correctas.</p>

      <div className="mt-6 mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground" aria-live="polite">
          Pregunta {step} de 5
        </span>
        {saveState === "saving" && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" /> Guardando...
          </span>
        )}
        {saveState === "saved" && <span className="text-xs text-primary">Guardado</span>}
      </div>
      <CheckinStepper currentStep={step} />

      <div className="mt-6">
        <h3 className="mb-4 text-base font-semibold text-foreground sm:text-lg">{QUESTION_TEXT[currentQuestion]}</h3>

        {currentQuestion === "animo" && (
          <GradedAnswerGrid legend={QUESTION_TEXT.animo} options={MOOD_OPTIONS} selected={moodScore} onSelect={setMoodScore} />
        )}
        {currentQuestion === "sueno" && (
          <GradedAnswerGrid legend={QUESTION_TEXT.sueno} options={SLEEP_OPTIONS} selected={sleepScore} onSelect={setSleepScore} />
        )}
        {currentQuestion === "energia" && (
          <GradedAnswerGrid legend={QUESTION_TEXT.energia} options={ENERGY_OPTIONS} selected={energyScore} onSelect={setEnergyScore} />
        )}
        {currentQuestion === "emocion" && (
          <EmotionAnswerGrid
            selected={emotions}
            other={otherEmotion}
            onToggle={(e) => setEmotions((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]))}
            onOtherChange={setOtherEmotion}
          />
        )}
        {currentQuestion === "reflexion" && (
          <ReflectionAnswer
            selected={factors}
            note={note}
            onToggle={(f) => setFactors((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]))}
            onNoteChange={setNote}
          />
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Button type="button" variant="ghost" onClick={goBack} disabled={step === 1} className="rounded-xl">
          Atrás
        </Button>
        <Button
          type="button"
          onClick={handleContinue}
          disabled={!canSubmit || saveState === "saving" || finishing}
          className="gap-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 px-6"
        >
          {finishing ? <Loader2 className="h-4 w-4 animate-spin" /> : step === 5 ? "Finalizar" : "Guardar y continuar"}
          {!finishing && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="h-3.5 w-3.5" />
        Tus respuestas son privadas. Podés continuar más tarde.
      </p>
    </div>
  )
}
