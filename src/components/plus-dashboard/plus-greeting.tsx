"use client"

import { useEffect, useState } from "react"

interface PlusGreetingProps {
  nombre: string | null
}

function greetingForHour(hour: number): string {
  if (hour < 12) return "Buenos días"
  if (hour < 19) return "Buenas tardes"
  return "Buenas noches"
}

export function PlusGreeting({ nombre }: PlusGreetingProps) {
  // Avoid a server/client hydration mismatch: render a stable greeting for
  // the initial (server) pass, then swap to the browser's real local hour
  // once mounted.
  const [greeting, setGreeting] = useState("Hola")

  useEffect(() => {
    setGreeting(greetingForHour(new Date().getHours()))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
        {greeting}
        {nombre ? `, ${nombre}` : ""}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground sm:text-base">Este es tu espacio para sentirte acompañado.</p>
    </div>
  )
}
