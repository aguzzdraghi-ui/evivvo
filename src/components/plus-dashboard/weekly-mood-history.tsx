"use client"

import { useEffect, useState } from "react"
import { getWeekHistory, type WeekDay } from "@/src/lib/plus/checkin-queries"

const DAY_LABELS = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"]

function moodFace(avg: number | null): string {
  if (avg === null) return "—"
  if (avg <= 1.5) return "😞"
  if (avg <= 2.5) return "🙁"
  if (avg <= 3.5) return "😐"
  if (avg <= 4.5) return "🙂"
  return "😄"
}

interface WeeklyMoodHistoryProps {
  userId: string
  refreshKey?: number
}

/** Real last-7-days strip — empty outline when there was no answer, never a fabricated value. */
export function WeeklyMoodHistory({ userId, refreshKey }: WeeklyMoodHistoryProps) {
  const [days, setDays] = useState<WeekDay[] | null>(null)

  useEffect(() => {
    let cancelled = false
    getWeekHistory(userId).then((d) => {
      if (!cancelled) setDays(d)
    })
    return () => {
      cancelled = true
    }
  }, [userId, refreshKey])

  if (!days) {
    return <div className="h-16 animate-pulse rounded-xl bg-muted" />
  }

  return (
    <div>
      <p className="mb-3 text-sm font-medium text-foreground">Tu semana</p>
      <div className="flex justify-between gap-1">
        {days.map((day) => {
          const date = new Date(`${day.date}T00:00:00`)
          return (
            <div key={day.date} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-medium text-muted-foreground">{DAY_LABELS[date.getDay()]}</span>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-base ${
                  day.completed ? "bg-secondary" : "border border-dashed border-border text-muted-foreground/50"
                }`}
                aria-label={day.completed ? `Chequeo completado, ánimo ${moodFace(day.moodAverage)}` : "Sin chequeo"}
              >
                {day.completed ? moodFace(day.moodAverage) : ""}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
