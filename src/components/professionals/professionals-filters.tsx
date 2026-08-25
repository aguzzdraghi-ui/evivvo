"use client"

import { specialtyFilters } from "@/src/data/professionals"
import { Button } from "@/components/ui/button"
import { Check, Clock } from "lucide-react"

interface ProfessionalsFiltersProps {
  selectedSpecialties: string[]
  availableNow: boolean
  onSpecialtyChange: (specialty: string) => void
  onAvailableNowChange: (available: boolean) => void
  onClearFilters: () => void
}

export function ProfessionalsFilters({
  selectedSpecialties,
  availableNow,
  onSpecialtyChange,
  onAvailableNowChange,
  onClearFilters,
}: ProfessionalsFiltersProps) {
  const hasFilters = selectedSpecialties.length > 0 || availableNow

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-foreground">Filtrar por:</span>
        {specialtyFilters.map((filter) => {
          const isSelected = selectedSpecialties.includes(filter.id)
          return (
            <button
              key={filter.id}
              onClick={() => onSpecialtyChange(filter.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {isSelected && <Check className="h-3.5 w-3.5" />}
              {filter.label}
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={() => onAvailableNowChange(!availableNow)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            availableNow
              ? "bg-emerald-500 text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Clock className="h-4 w-4" />
          Disponibilidad inmediata
        </button>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  )
}
