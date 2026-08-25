"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/src/lib/auth-context"
import { 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp,
  Video,
  Clock,
  Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const stats = [
  {
    label: "Ingresos del mes",
    value: "$125,400",
    change: "+12%",
    icon: DollarSign,
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    label: "Sesiones realizadas",
    value: "24",
    change: "+8%",
    icon: Video,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Pacientes activos",
    value: "18",
    change: "+3",
    icon: Users,
    color: "bg-violet-500/10 text-violet-600",
  },
  {
    label: "Valoración promedio",
    value: "4.9",
    change: "+0.2",
    icon: Star,
    color: "bg-amber-500/10 text-amber-600",
  },
]

const upcomingSessions = [
  {
    id: 1,
    patient: "María García",
    time: "Hoy, 14:00",
    type: "Terapia individual",
    status: "confirmed",
  },
  {
    id: 2,
    patient: "Juan Pérez",
    time: "Hoy, 16:00",
    type: "Primera consulta",
    status: "confirmed",
  },
  {
    id: 3,
    patient: "Ana Rodríguez",
    time: "Mañana, 10:00",
    type: "Terapia de pareja",
    status: "pending",
  },
]

const recentPayments = [
  { id: 1, patient: "María García", amount: "$15,000", date: "Hace 2 horas", status: "completed" },
  { id: 2, patient: "Juan Pérez", amount: "$15,000", date: "Hace 1 día", status: "completed" },
  { id: 3, patient: "Ana Rodríguez", amount: "$20,000", date: "Hace 2 días", status: "completed" },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [isOnline, setIsOnline] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<boolean | null>(null)

  // Cargar estado del localStorage al montar
  useEffect(() => {
    const savedStatus = localStorage.getItem("evivvo_professional_online_status")
    if (savedStatus !== null) {
      setIsOnline(savedStatus === "true")
    }
  }, [])

  // Guardar estado en localStorage cuando cambia
  const handleStatusChange = (newStatus: boolean) => {
    setPendingStatus(newStatus)
    setShowModal(true)
  }

  const confirmStatusChange = () => {
    if (pendingStatus !== null) {
      setIsOnline(pendingStatus)
      localStorage.setItem("evivvo_professional_online_status", String(pendingStatus))
    }
    setShowModal(false)
    setPendingStatus(null)
  }

  const cancelStatusChange = () => {
    setShowModal(false)
    setPendingStatus(null)
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          Bienvenido, {user?.name.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Aquí tienes un resumen de tu actividad
        </p>
      </div>

      {/* Online Status Toggle */}
      <div className={`mb-8 flex items-center justify-between rounded-xl border p-4 transition-colors ${
        isOnline 
          ? "border-emerald-200 bg-emerald-50/50" 
          : "border-border bg-background"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
            isOnline ? "bg-emerald-500/20" : "bg-muted"
          }`}>
            <Video className={`h-6 w-6 transition-colors ${
              isOnline ? "text-emerald-600" : "text-muted-foreground"
            }`} />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {isOnline ? "En línea" : "Fuera de línea"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isOnline 
                ? "Apareces disponible para sesiones inmediatas" 
                : "No aparecerás disponible para atención inmediata"
              }
            </p>
          </div>
        </div>
        <Button 
          onClick={() => handleStatusChange(!isOnline)}
          className={`transition-colors ${
            isOnline 
              ? "bg-emerald-500 hover:bg-emerald-600" 
              : "bg-muted-foreground hover:bg-muted-foreground/80"
          }`}
        >
          {isOnline && <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-white" />}
          {isOnline ? "En línea" : "Fuera de línea"}
        </Button>
      </div>

      {/* Modal de confirmación */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingStatus ? "Activar disponibilidad" : "Desactivar disponibilidad"}
            </DialogTitle>
            <DialogDescription>
              {pendingStatus 
                ? "Tienes activada la disponibilidad inmediata. Los usuarios podrán encontrarte y solicitar sesiones en tiempo real."
                : "Seguirás pudiendo administrar tu agenda y reservas programadas, pero no recibirás solicitudes inmediatas."
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={cancelStatusChange}>
              Cancelar
            </Button>
            <Button 
              onClick={confirmStatusChange}
              className={pendingStatus ? "bg-emerald-500 hover:bg-emerald-600" : ""}
            >
              {pendingStatus ? "Activar disponibilidad" : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-background p-5"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                <TrendingUp className="h-4 w-4" />
                {stat.change}
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Sessions */}
        <div className="rounded-xl border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-semibold text-foreground">Próximas sesiones</h2>
            <Button variant="ghost" size="sm">Ver todas</Button>
          </div>
          <div className="divide-y divide-border">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-medium text-primary">
                      {session.patient.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{session.patient}</p>
                    <p className="text-sm text-muted-foreground">{session.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="flex items-center gap-1 text-sm font-medium text-foreground">
                    <Clock className="h-4 w-4" />
                    {session.time}
                  </p>
                  <span className={`text-xs ${
                    session.status === "confirmed" 
                      ? "text-emerald-600" 
                      : "text-amber-600"
                  }`}>
                    {session.status === "confirmed" ? "Confirmada" : "Pendiente"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="rounded-xl border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-semibold text-foreground">Pagos recientes</h2>
            <Button variant="ghost" size="sm">Ver todos</Button>
          </div>
          <div className="divide-y divide-border">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{payment.patient}</p>
                    <p className="text-sm text-muted-foreground">{payment.date}</p>
                  </div>
                </div>
                <p className="font-semibold text-emerald-600">{payment.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Commission Info */}
      <div className="mt-8 rounded-xl bg-muted/50 p-5">
        <h3 className="font-semibold text-foreground">Información de comisiones</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Evivvo retiene un <strong>7%</strong> en sesiones en vivo y <strong>14%</strong> en sesiones programadas. 
          Los pagos se procesan automáticamente después de cada sesión completada.
        </p>
      </div>
    </div>
  )
}
