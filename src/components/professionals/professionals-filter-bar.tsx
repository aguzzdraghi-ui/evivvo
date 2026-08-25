"use client"

import { User } from "lucide-react"
import { EXPLORER_FILTERS, type ExplorerFilterId } from "@/src/lib/professionals/taxonomy"

interface ProfessionalsFilterBarProps {
  active: ExplorerFilterId | "para-vos" | null
  onSelect: (id: ExplorerFilterId | "para-vos" | null) => void
  /** Only shown when there is a real match signal from EVA — never a fake "for you" claim. */
  showParaVos: boolean
}

export function ProfessionalsFilterBar({ active, onSelect, showParaVos }: ProfessionalsFilterBarProps) {
  const pillClass = (isActive: boolean) =>
    `inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
    }`

  return (
    <div className="flex flex-wrap gap-2">
      {showParaVos && (
        <button type="button" className={pillClass(active === "para-vos")} onClick={() => onSelect(active === "para-vos" ? null : "para-vos")}>
          <User className="h-3.5 w-3.5" />
          Para vos
        </button>
      )}
      {EXPLORER_FILTERS.map((filter) => {
        const isActive = active === filter.id
        return (
          <button
            key={filter.id}
            type="button"
            className={pillClass(isActive)}
            onClick={() => onSelect(isActive ? null : filter.id)}
          >
            {isActive && filter.disponibleAhora && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}
