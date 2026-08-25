"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  Users,
  Search,
  Filter,
  Brain,
  Heart,
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Eye,
  BarChart3,
  Download,
  TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { referrals, getReferralStats } from "@/src/data/referrals"
import { referralReasons, type ReferralType, type Referral } from "@/src/types/referral"

const typeConfig: Record<ReferralType, { label: string; icon: typeof Brain; color: string }> = {
  psychiatrist: { label: 'Psiquiatra', icon: Brain, color: 'text-red-600 bg-red-100' },
  psychologist: { label: 'Psicólogo', icon: Heart, color: 'text-primary bg-primary/10' },
  coach: { label: 'Coach', icon: Sparkles, color: 'text-emerald-600 bg-emerald-100' },
}

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700' },
  shown: { label: 'Mostrada', color: 'bg-blue-100 text-blue-700' },
  accepted: { label: 'Aceptada', color: 'bg-emerald-100 text-emerald-700' },
  scheduled: { label: 'Agendada', color: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'Rechazada', color: 'bg-red-100 text-red-700' },
  expired: { label: 'Expirada', color: 'bg-slate-100 text-slate-700' },
}

export default function AdminReferralsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null)

  const stats = getReferralStats()

  const filteredReferrals = referrals.filter(r => {
    const matchesSearch = 
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.suggestingProfessionalName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || r.status === statusFilter
    const matchesType = typeFilter === "all" || r.recommendedType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const handleExport = () => {
    alert('Exportando datos de derivaciones...')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">Gestión de Derivaciones</h1>
                <p className="text-sm text-muted-foreground">Panel Evivvo Manager</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-5 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-amber-100 p-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.byStatus.pending + stats.byStatus.shown}</p>
                  <p className="text-xs text-muted-foreground">Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-100 p-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.byStatus.scheduled}</p>
                  <p className="text-xs text-muted-foreground">Agendadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-red-100 p-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.byStatus.rejected}</p>
                  <p className="text-xs text-muted-foreground">Rechazadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/20 p-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                  <p className="text-xs text-muted-foreground">Conversión</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats by type */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-red-100 p-2">
                    <Brain className="h-5 w-5 text-red-600" />
                  </div>
                  <span className="font-medium">A Psiquiatra</span>
                </div>
                <span className="text-2xl font-bold">{stats.byType.psychiatrist}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">A Psicólogo</span>
                </div>
                <span className="text-2xl font-bold">{stats.byType.psychologist}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-100 p-2">
                    <Sparkles className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="font-medium">A Coach</span>
                </div>
                <span className="text-2xl font-bold">{stats.byType.coach}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por paciente o profesional..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="shown">Mostrada</SelectItem>
                  <SelectItem value="accepted">Aceptada</SelectItem>
                  <SelectItem value="scheduled">Agendada</SelectItem>
                  <SelectItem value="rejected">Rechazada</SelectItem>
                  <SelectItem value="expired">Expirada</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="psychiatrist">Psiquiatra</SelectItem>
                  <SelectItem value="psychologist">Psicólogo</SelectItem>
                  <SelectItem value="coach">Coach</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de derivaciones</CardTitle>
            <CardDescription>
              {filteredReferrals.length} derivaciones encontradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Profesional que sugiere</TableHead>
                  <TableHead>Tipo sugerido</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Tiempo respuesta</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReferrals.map((referral) => {
                  const type = typeConfig[referral.recommendedType]
                  const TypeIcon = type.icon
                  const status = statusConfig[referral.status]

                  // Calcular tiempo de respuesta
                  let responseTime = '-'
                  if (referral.respondedAt) {
                    const created = new Date(referral.createdAt)
                    const responded = new Date(referral.respondedAt)
                    const hours = Math.round((responded.getTime() - created.getTime()) / (1000 * 60 * 60))
                    responseTime = hours < 24 ? `${hours}h` : `${Math.round(hours / 24)}d`
                  }

                  return (
                    <TableRow key={referral.id}>
                      <TableCell className="text-sm">
                        {new Date(referral.createdAt).toLocaleDateString('es-AR')}
                      </TableCell>
                      <TableCell className="font-medium">{referral.patientName}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{referral.suggestingProfessionalName}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {referral.suggestingProfessionalType === 'psychiatrist' ? 'Psiquiatra' :
                             referral.suggestingProfessionalType === 'psychologist' ? 'Psicólogo' : 'Coach'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${type.color}`}>
                          <TypeIcon className="h-3 w-3" />
                          {type.label}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {referralReasons[referral.reason].label}
                      </TableCell>
                      <TableCell>
                        <Badge className={status.color}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{responseTime}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedReferral(referral)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Detail Dialog */}
      <Dialog open={!!selectedReferral} onOpenChange={() => setSelectedReferral(null)}>
        <DialogContent className="max-w-2xl">
          {selectedReferral && (
            <>
              <DialogHeader>
                <DialogTitle>Detalle de Derivación</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Paciente</p>
                    <p className="font-medium">{selectedReferral.patientName}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p className="font-medium">{new Date(selectedReferral.createdAt).toLocaleString('es-AR')}</p>
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Profesional que sugiere</p>
                  <p className="font-medium">{selectedReferral.suggestingProfessionalName}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {selectedReferral.suggestingProfessionalType === 'psychiatrist' ? 'Psiquiatra' :
                     selectedReferral.suggestingProfessionalType === 'psychologist' ? 'Psicólogo' : 'Coach'}
                  </p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Motivo de derivación</p>
                  <p className="font-medium">{referralReasons[selectedReferral.reason].label}</p>
                  <p className="text-sm mt-1">{selectedReferral.reasonDescription}</p>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Contexto emocional</p>
                  <p className="text-sm">{selectedReferral.emotionalContext}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Historial</p>
                  <div className="space-y-2">
                    {selectedReferral.history.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between text-sm p-2 border rounded">
                        <span>{entry.details}</span>
                        <span className="text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleString('es-AR')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
