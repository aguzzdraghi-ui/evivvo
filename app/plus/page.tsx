import { Calendar, History, MessageSquare, FileText } from "lucide-react"
import { getPlusEntitlement } from "@/src/lib/plus/entitlement"
import { PlusGreeting } from "@/src/components/plus-dashboard/plus-greeting"
import { DailyCheckinCard } from "@/src/components/plus-dashboard/daily-checkin-card"
import { WeeklyMoodHistory } from "@/src/components/plus-dashboard/weekly-mood-history"
import { PlusStatusCard } from "@/src/components/plus-dashboard/plus-status-card"
import { PriorityCareCard } from "@/src/components/plus-dashboard/priority-care-card"
import { EvaQuickCard } from "@/src/components/plus-dashboard/eva-quick-card"
import { NextSessionCard } from "@/src/components/plus-dashboard/next-session-card"
import { DashboardActionCard } from "@/src/components/plus-dashboard/dashboard-action-card"

export default async function PlusDashboardPage() {
  // Layout already redirected non-Plus/unauthenticated requests, so this is
  // always a real entitled user here.
  const entitlement = await getPlusEntitlement()
  const userId = entitlement.userId!

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <PlusGreeting nombre={entitlement.nombre} />
        <span className="w-fit rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Evivvo Plus
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DailyCheckinCard userId={userId} />
          <div className="mt-6 rounded-2xl border border-border bg-card p-5">
            <WeeklyMoodHistory userId={userId} />
          </div>
        </div>

        <div className="space-y-4">
          <PlusStatusCard userId={userId} />
          <PriorityCareCard />
          <EvaQuickCard />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <NextSessionCard userId={userId} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardActionCard icon={Calendar} title="Mis sesiones" description="Próximas y pasadas" href="/mi-cuenta/sesiones" />
        <DashboardActionCard icon={MessageSquare} title="Mensajes" description="Chat con tus profesionales" href="/plus/mensajes" />
        <DashboardActionCard icon={History} title="Mi historial" description="Registros privados de atención" href="/mi-cuenta/historial" />
        <DashboardActionCard icon={FileText} title="Mis recetas" description="Indicaciones emitidas por profesionales" href="/mi-cuenta/recetas" />
      </div>
    </main>
  )
}
