"use client"

import { useState } from "react"
import { 
  DollarSign, 
  TrendingUp, 
  Download, 
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const stats = [
  {
    label: "Balance disponible",
    value: "$125,400",
    icon: Wallet,
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    label: "Ingresos del mes",
    value: "$180,000",
    change: "+12%",
    icon: TrendingUp,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Comisiones retenidas",
    value: "$18,900",
    icon: DollarSign,
    color: "bg-amber-500/10 text-amber-600",
  },
]

const transactions = [
  { 
    id: 1, 
    type: "Sesión programada", 
    patient: "María García",
    gross: 15000, 
    commission: 2100, 
    net: 12900,
    date: "05/05/2024 14:30",
    status: "completed" 
  },
  { 
    id: 2, 
    type: "Sesión en vivo", 
    patient: "Juan Pérez",
    gross: 18000, 
    commission: 1260, 
    net: 16740,
    date: "05/05/2024 12:15",
    status: "completed" 
  },
  { 
    id: 3, 
    type: "Sesión programada", 
    patient: "Pedro Sánchez",
    gross: 20000, 
    commission: 2800, 
    net: 17200,
    date: "04/05/2024 18:00",
    status: "completed" 
  },
  { 
    id: 4, 
    type: "Sesión en vivo", 
    patient: "Ana Rodríguez",
    gross: 15000, 
    commission: 1050, 
    net: 13950,
    date: "04/05/2024 16:30",
    status: "pending" 
  },
]

const withdrawals = [
  { id: 1, amount: 80000, date: "01/05/2024", status: "completed" },
  { id: 2, amount: 65000, date: "15/04/2024", status: "completed" },
  { id: 3, amount: 45000, date: "01/04/2024", status: "completed" },
]

export default function ProfessionalPaymentsPage() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleWithdraw = () => {
    console.log("[v0] Withdraw requested:", withdrawAmount)
    setShowWithdrawModal(false)
    setWithdrawAmount("")
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Mis Pagos</h1>
          <p className="text-muted-foreground">Gestiona tus ingresos y retiros</p>
        </div>
        <Button onClick={() => setShowWithdrawModal(true)}>
          <Wallet className="mr-2 h-4 w-4" />
          Solicitar retiro
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-background p-5">
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              {stat.change && (
                <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                  <ArrowUpRight className="h-4 w-4" />
                  {stat.change}
                </span>
              )}
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
              <h2 className="font-semibold text-foreground">Historial de sesiones</h2>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Sesión</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Bruto</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Comisión</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Neto</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{tx.patient}</p>
                        <p className="text-sm text-muted-foreground">{tx.type} - {tx.date}</p>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-foreground">
                        {formatCurrency(tx.gross)}
                      </td>
                      <td className="px-4 py-3 text-right text-red-600">
                        -{formatCurrency(tx.commission)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-600">
                        {formatCurrency(tx.net)}
                      </td>
                      <td className="px-4 py-3">
                        {tx.status === "completed" ? (
                          <span className="flex items-center gap-1 text-sm text-emerald-600">
                            <CheckCircle className="h-4 w-4" />
                            Pagado
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-sm text-amber-600">
                            <Clock className="h-4 w-4" />
                            Pendiente
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border p-4">
              <Button variant="ghost" className="w-full">Ver historial completo</Button>
            </div>
          </div>
        </div>

        {/* Withdrawals History */}
        <div>
          <div className="rounded-xl border border-border bg-background">
            <div className="border-b border-border p-5">
              <h2 className="font-semibold text-foreground">Retiros realizados</h2>
            </div>
            <div className="divide-y divide-border">
              {withdrawals.map((w) => (
                <div key={w.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-foreground">{formatCurrency(w.amount)}</p>
                    <p className="text-sm text-muted-foreground">{w.date}</p>
                  </div>
                  <span className="flex items-center gap-1 text-sm text-emerald-600">
                    <CheckCircle className="h-4 w-4" />
                    Completado
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Commission Info */}
          <div className="mt-6 rounded-xl bg-muted/50 p-5">
            <h3 className="font-semibold text-foreground">Información de comisiones</h3>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sesiones en vivo</span>
                <span className="font-medium text-foreground">7%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sesiones programadas</span>
                <span className="font-medium text-foreground">14%</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Las comisiones se descuentan automáticamente de cada sesión completada.
            </p>
          </div>

          {/* Bank Info */}
          <div className="mt-6 rounded-xl border border-border bg-background p-5">
            <h3 className="font-semibold text-foreground">Datos bancarios</h3>
            <div className="mt-3 space-y-2 text-sm">
              <p className="text-muted-foreground">CBU: ****1234</p>
              <p className="text-muted-foreground">Alias: MARIA.EVIVVO</p>
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full">
              Actualizar datos
            </Button>
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-background p-6">
            <h2 className="mb-4 text-xl font-bold text-foreground">Solicitar retiro</h2>
            <div className="mb-4 rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Balance disponible</p>
              <p className="text-2xl font-bold text-foreground">$125,400</p>
            </div>
            <div className="mb-4">
              <Label htmlFor="amount">Monto a retirar</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Ingresa el monto"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
            </div>
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-amber-500/10 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
              <p className="text-sm text-amber-600">
                Los retiros se procesan en 24-48 horas hábiles.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowWithdrawModal(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleWithdraw}>
                Solicitar retiro
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
