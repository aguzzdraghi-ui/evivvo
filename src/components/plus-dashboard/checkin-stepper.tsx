import { QUESTION_KEYS, STEP_LABELS } from "@/src/lib/plus/checkin-questions"

interface CheckinStepperProps {
  currentStep: number
}

export function CheckinStepper({ currentStep }: CheckinStepperProps) {
  return (
    <ol className="flex items-center gap-1.5 sm:gap-3" aria-label="Progreso del chequeo diario">
      {QUESTION_KEYS.map((key, i) => {
        const stepNumber = i + 1
        const isActive = stepNumber === currentStep
        const isDone = stepNumber < currentStep
        return (
          <li key={key} className="flex flex-1 items-center gap-1.5 sm:gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <span
                aria-current={isActive ? "step" : undefined}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isDone
                      ? "bg-primary/25 text-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {stepNumber}
              </span>
              <span className="hidden text-[11px] text-muted-foreground sm:block">{STEP_LABELS[key]}</span>
            </div>
            {stepNumber < 5 && <div className={`h-px flex-1 ${isDone ? "bg-primary/40" : "bg-border"}`} />}
          </li>
        )
      })}
    </ol>
  )
}
