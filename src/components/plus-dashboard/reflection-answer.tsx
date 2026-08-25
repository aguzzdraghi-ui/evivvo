"use client"

import { REFLECTION_OPTIONS } from "@/src/lib/plus/checkin-questions"

interface ReflectionAnswerProps {
  selected: string[]
  note: string
  onToggle: (factor: string) => void
  onNoteChange: (value: string) => void
}

export function ReflectionAnswer({ selected, note, onToggle, onNoteChange }: ReflectionAnswerProps) {
  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="sr-only">¿Qué influyó más en cómo te sentiste hoy?</legend>
        <div className="flex flex-wrap gap-2">
          {REFLECTION_OPTIONS.map((factor) => {
            const isSelected = selected.includes(factor)
            return (
              <button
                key={factor}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onToggle(factor)}
                className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
                  isSelected
                    ? "border-primary bg-primary/15 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40"
                }`}
              >
                {factor}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="reflection-note" className="mb-1.5 block text-sm text-muted-foreground">
          Si querés, contame un poco más...
        </label>
        <textarea
          id="reflection-note"
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={3}
          placeholder="Opcional"
          className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  )
}
