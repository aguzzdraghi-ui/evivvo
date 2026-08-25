interface GradedOption {
  value: number
  label: string
  emoji?: string
}

interface GradedAnswerGridProps {
  legend: string
  options: readonly GradedOption[]
  selected: number | null
  onSelect: (value: number) => void
}

/** Shared grid for the 1–5 graded questions (Ánimo, Sueño, Energía). */
export function GradedAnswerGrid({ legend, options, selected, onSelect }: GradedAnswerGridProps) {
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {options.map((opt) => {
          const isSelected = selected === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(opt.value)}
              className={`flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-2xl border p-3 text-center transition-colors ${
                isSelected
                  ? "border-primary bg-primary/15 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40"
              }`}
            >
              {opt.emoji && <span className="text-2xl" aria-hidden="true">{opt.emoji}</span>}
              <span className="text-sm font-medium">{opt.label}</span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
