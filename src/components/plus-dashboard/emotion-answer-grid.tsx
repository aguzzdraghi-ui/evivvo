"use client"

import { EMOTION_OPTIONS } from "@/src/lib/plus/checkin-questions"

interface EmotionAnswerGridProps {
  selected: string[]
  other: string
  onToggle: (emotion: string) => void
  onOtherChange: (value: string) => void
}

export function EmotionAnswerGrid({ selected, other, onToggle, onOtherChange }: EmotionAnswerGridProps) {
  const otraSelected = selected.includes("Otra")

  return (
    <fieldset>
      <legend className="sr-only">¿Qué emoción predominó hoy?</legend>
      <div className="flex flex-wrap gap-2">
        {EMOTION_OPTIONS.map((emotion) => {
          const isSelected = selected.includes(emotion)
          return (
            <button
              key={emotion}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(emotion)}
              className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
                isSelected
                  ? "border-primary bg-primary/15 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40"
              }`}
            >
              {emotion}
            </button>
          )
        })}
      </div>

      {otraSelected && (
        <input
          type="text"
          value={other}
          onChange={(e) => onOtherChange(e.target.value)}
          placeholder="Contame cuál (opcional)"
          className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      )}
    </fieldset>
  )
}
