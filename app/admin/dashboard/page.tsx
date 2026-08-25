"use client"

import { 
  DollarSign, 
  Users, 
  UserCog,
  TrendingUp,
  Video,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const stats = [
  {
    label: "Ingresos totales (mes)",
    value: "$2,450,000",
    change: "+18%",
    icon: DollarSign,
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    label: "Comisiones retenidas",
    value: "$245,000",
    change: "+15%",
    icon: TrendingUp,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Usuarios activos",
    value: "1,284",
    change: "+124",
    icon: Users,
    color: "bg-violet-500/10 text-violet-600",
  },
  {
    label: "Profesionales activos",
    value: "48",
    change: "+6",
    icon: UserCog,
    color: "bg-amber-500/10 text-amber-600",
  },
]

const pendingProfessionals = [
  { id: 1, name: "Dr. Carlos López", profession: "Psicólogo", date: "Hace 2 horas" },
  { id: 2, name: "Lic. Ana Martínez", profession: "Coach", date: "Hace 5 horas" },
  { id: 3, name: "Dr. Roberto Díaz", profession: "Psiquiatra", date: "Hace 1 día" },
]

const recentReports = [
  { id: 1, type: "Contenido inapropiado", user: "Usuario #1234", date: "Hace 1 hora", status: "pending" },
  { id: 2, type: "Intento de contacto externo", user: "Prof. #456", date: "Hace 3 horas", status: "pending" },
  { id: 3, type: "Cancelación sin aviso", user: "Usuario #789", date: "Hace 6 horas", status: "resolved" },
]

const recentTransactions = [
  { id: 1, type: "Sesión programada", amount: "$15,000", commission: "$2,100", date: "Hace 30 min" },
  { id: 2, type: "Sesión en vivo", amount: "$18,000", commission: "$1,260", date: "Hace 1 hora" },
  { id: 3, type: "Suscripción Plus", amount: "$4,990", commission: "$4,990", date: "Hace 2 horas" },
]

export default function AdminDashboardPage() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          Panel de Administración
        </h1>
        <p className="text-muted-foreground">
          Resumen general de la plataforma Evivvo
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-background p-5">
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending Professionals */}
        <div className="rounded-xl border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-semibold text-foreground">Profesionales pendientes</h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-xs font-medium text-amber-600">
              {pendingProfessionals.length}
            </span>
          </div>
          <div className="divide-y divide-border">
            {pendingProfessionals.map((prof) => (
              <div key={prof.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <UserCog className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{prof.name}</p>
                    <p className="text-sm text-muted-foreground">{prof.profession}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Ver</Button>
                  <Button size="sm">Aprobar</Button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border p-4">
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/admin/profesionales">Ver todos</Link>
            </Button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="rounded-xl border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-semibold text-foreground">Reportes recientes</h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-xs font-medium text-red-600">
              {recentReports.filter(r => r.status === "pending").length}
            </span>
          </div>
          <div className="divide-y divide-border">
            {recentReports.map((report) => (
              <div key={report.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${
                      report.status === "pending" ? "bg-red-500/10" : "bg-emerald-500/10"
                    }`}>
                      {report.status === "pending" ? (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{report.type}</p>
                      <p className="text-sm text-muted-foreground">{report.user}</p>
                      <p className="text-xs text-muted-foreground">{report.date}</p>
                    </div>
                  </div>
                  {report.status === "pending" && (
                    <Button size="sm" variant="outline">Revisar</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border p-4">
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/admin/reportes">Ver todos los reportes</Link>
            </Button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-xl border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-semibold text-foreground">Transacciones recientes</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/sesiones">Ver todas</Link>
            </Button>
          </div>
          <div className="divide-y divide-border">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{tx.type}</p>
                      <p className="text-sm text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{tx.amount}</p>
                    <p className="text-sm text-emerald-600">+{tx.commission}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 rounded-xl border border-border bg-background p-6">
        <h2 className="mb-4 font-semibold text-foreground">Acciones rápidas</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/admin/profesionales">
              <UserCog className="mr-2 h-4 w-4" />
              Aprobar profesionales
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/reportes">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Revisar reportes
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/sesiones">
              <Video className="mr-2 h-4 w-4" />
              Monitorear sesiones
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/configuracion">
              <DollarSign className="mr-2 h-4 w-4" />
              Configuración
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
