"use client"

import { useState } from "react"
import { 
  DollarSign, 
  TrendingUp, 
  Download, 
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Wallet,
  Building2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const stats = [
  {
    label: "Ingresos totales (mes)",
    value: "$2,450,000",
    change: "+18%",
    trend: "up",
    icon: DollarSign,
  },
  {
    label: "Comisiones retenidas",
    value: "$245,000",
    change: "+15%",
    trend: "up",
    icon: Wallet,
  },
  {
    label: "Pagos a profesionales",
    value: "$2,205,000",
    change: "+19%",
    trend: "up",
    icon: Building2,
  },
  {
    label: "Suscripciones Plus",
    value: "$498,000",
    change: "+25%",
    trend: "up",
    icon: CreditCard,
  },
]

const transactions = [
  { 
    id: 1, 
    type: "Sesión programada", 
    patient: "María García",
    professional: "Lic. Ana López",
    amount: 15000, 
    commission: 2100, 
    commissionRate: "14%",
    date: "05/05/2024 14:30",
    status: "completed" 
  },
  { 
    id: 2, 
    type: "Sesión en vivo", 
    patient: "Juan Pérez",
    professional: "Dr. Carlos Ruiz",
    amount: 18000, 
    commission: 1260, 
    commissionRate: "7%",
    date: "05/05/2024 12:15",
    status: "completed" 
  },
  { 
    id: 3, 
    type: "Suscripción Plus", 
    patient: "Laura Martínez",
    professional: "-",
    amount: 4990, 
    commission: 4990, 
    commissionRate: "100%",
    date: "05/05/2024 10:00",
    status: "completed" 
  },
  { 
    id: 4, 
    type: "Sesión programada", 
    patient: "Pedro Sánchez",
    professional: "Lic. María González",
    amount: 20000, 
    commission: 2800, 
    commissionRate: "14%",
    date: "04/05/2024 18:00",
    status: "completed" 
  },
  { 
    id: 5, 
    type: "Sesión en vivo", 
    patient: "Ana Rodríguez",
    professional: "Dr. Roberto Díaz",
    amount: 15000, 
    commission: 1050, 
    commissionRate: "7%",
    date: "04/05/2024 16:30",
    status: "pending" 
  },
  { 
    id: 6, 
    type: "Retiro profesional", 
    patient: "-",
    professional: "Lic. Ana López",
    amount: -125000, 
    commission: 0, 
    commissionRate: "-",
    date: "04/05/2024 12:00",
    status: "completed" 
  },
]

const pendingWithdrawals = [
  { id: 1, professional: "Dr. Carlos Ruiz", amount: 85000, requested: "Hace 2 horas" },
  { id: 2, professional: "Lic. María González", amount: 120000, requested: "Hace 5 horas" },
  { id: 3, professional: "Dr. Roberto Díaz", amount: 65000, requested: "Hace 1 día" },
]

export default function AdminPaymentsPage() {
  const [dateRange, setDateRange] = useState("month")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(Math.abs(amount))
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Pagos y Comisiones</h1>
          <p className="text-muted-foreground">Gestiona los pagos y retiros de la plataforma</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-background p-5">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <span className={`flex items-center gap-1 text-sm font-medium ${
                stat.trend === "up" ? "text-emerald-600" : "text-red-600"
              }`}>
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {stat.change}
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Transactions Table */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="font-semibold text-foreground">Transacciones recientes</h2>
              <div className="flex gap-2">
                <Button 
                  variant={dateRange === "week" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setDateRange("week")}
                >
                  Semana
                </Button>
                <Button 
                  variant={dateRange === "month" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setDateRange("month")}
                >
                  Mes
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tipo</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Detalles</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Monto</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Comisión</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          tx.type === "Suscripción Plus" 
                            ? "bg-violet-500/10 text-violet-600"
                            : tx.type === "Retiro profesional"
                            ? "bg-amber-500/10 text-amber-600"
                            : tx.type === "Sesión en vivo"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-primary/10 text-primary"
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-foreground">{tx.patient}</p>
                        <p className="text-xs text-muted-foreground">{tx.professional}</p>
                      </td>
                      <td className={`px-4 py-3 text-right font-medium ${
                        tx.amount < 0 ? "text-red-600" : "text-foreground"
                      }`}>
                        {tx.amount < 0 ? "-" : ""}{formatCurrency(tx.amount)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {tx.commission > 0 ? (
                          <div>
                            <p className="font-medium text-emerald-600">+{formatCurrency(tx.commission)}</p>
                            <p className="text-xs text-muted-foreground">{tx.commissionRate}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border p-4">
              <Button variant="ghost" className="w-full">Ver todas las transacciones</Button>
            </div>
          </div>
        </div>

        {/* Pending Withdrawals */}
        <div>
          <div className="rounded-xl border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="font-semibold text-foreground">Retiros pendientes</h2>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-xs font-medium text-amber-600">
                {pendingWithdrawals.length}
              </span>
            </div>
            <div className="divide-y divide-border">
              {pendingWithdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{withdrawal.professional}</p>
                      <p className="text-sm text-muted-foreground">{withdrawal.requested}</p>
                    </div>
                    <p className="font-semibold text-foreground">{formatCurrency(withdrawal.amount)}</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" className="flex-1">Aprobar</Button>
                    <Button size="sm" variant="outline" className="flex-1">Rechazar</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Commission Info */}
          <div className="mt-6 rounded-xl bg-muted/50 p-5">
            <h3 className="font-semibold text-foreground">Comisiones configuradas</h3>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sesiones en vivo</span>
                <span className="font-medium text-foreground">7%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sesiones programadas</span>
                <span className="font-medium text-foreground">14%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Suscripciones Plus</span>
                <span className="font-medium text-foreground">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
