"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  FileText, 
  Filter, 
  Search,
  ChevronLeft,
  Shield,
  Calendar,
  User,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { professionals } from "@/src/data/professionals"
import { getAuditLogs } from "@/src/data/audit-logs"
import { auditActionLabels, auditActionColors, type AuditAction, type AuditUserRole } from "@/src/types/audit"
import type { AuditLog } from "@/src/types/audit"

export default function AuditoriaPage() {
  const [filters, setFilters] = useState<{
    professionalId?: string
    action?: AuditAction
    userRole?: AuditUserRole
    dateFrom?: string
    dateTo?: string
  }>({})
  const [searchQuery, setSearchQuery] = useState('')
  
  const allLogs = getAuditLogs(filters)
  
  const filteredLogs = searchQuery 
    ? allLogs.filter(log => 
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.professionalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.reason?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allLogs
  
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const getRoleColor = (role: AuditUserRole) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800'
      case 'profesional': return 'bg-blue-100 text-blue-800'
      case 'paciente': return 'bg-emerald-100 text-emerald-800'
    }
  }
  
  const handleExport = () => {
    // Preparar datos para exportar
    const csvData = filteredLogs.map(log => ({
      Fecha: formatTimestamp(log.timestamp),
      Usuario: log.userName,
      Rol: log.userRole,
      Acción: auditActionLabels[log.action],
      Profesional: log.professionalName || '-',
      'Valor anterior': log.previousValue || '-',
      'Valor nuevo': log.newValue || '-',
      Motivo: log.reason || '-',
    }))
    
    console.log('[v0] Exportando auditoría:', csvData)
    alert('Funcionalidad de exportación próximamente disponible')
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Evivvo Manager</span>
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/admin/calendario" className="hover:text-primary">Calendario</Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Auditoría</span>
          </div>
          <Link href="/admin/calendario">
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Volver al calendario
            </Button>
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 md:px-6">
        {/* Título y acciones */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Auditoría del Calendario</h1>
            <p className="text-muted-foreground">Registro completo de acciones sobre calendarios y sesiones</p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
        
        {/* Filtros */}
        <Card className="mb-6 glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {/* Búsqueda */}
              <div className="relative sm:col-span-2 lg:col-span-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              
              {/* Profesional */}
              <select
                value={filters.professionalId || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, professionalId: e.target.value || undefined }))}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Todos los profesionales</option>
                {professionals.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              
              {/* Rol */}
              <select
                value={filters.userRole || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, userRole: e.target.value as AuditUserRole || undefined }))}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Todos los roles</option>
                <option value="admin">Admin</option>
                <option value="profesional">Profesional</option>
                <option value="paciente">Paciente</option>
              </select>
              
              {/* Fecha desde */}
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value || undefined }))}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              
              {/* Fecha hasta */}
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value || undefined }))}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            
            {/* Limpiar filtros */}
            {(filters.professionalId || filters.action || filters.userRole || filters.dateFrom || filters.dateTo || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters({})
                  setSearchQuery('')
                }}
                className="mt-3"
              >
                Limpiar filtros
              </Button>
            )}
          </CardContent>
        </Card>
        
        {/* Tabla de logs */}
        <Card className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Fecha y hora</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Usuario</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Rol</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Acción</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Profesional</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Detalles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {log.userName.charAt(0)}
                          </div>
                          <span className="text-sm font-medium">{log.userName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getRoleColor(log.userRole)}`}>
                          {log.userRole}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${auditActionColors[log.action]}`}>
                          {auditActionLabels[log.action]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {log.professionalName || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm max-w-xs">
                        <div className="space-y-1">
                          {log.previousValue && (
                            <p className="text-muted-foreground">
                              <span className="text-red-500">-</span> {log.previousValue}
                            </p>
                          )}
                          {log.newValue && (
                            <p className="text-muted-foreground">
                              <span className="text-emerald-500">+</span> {log.newValue}
                            </p>
                          )}
                          {log.reason && (
                            <p className="text-xs text-muted-foreground italic">
                              Motivo: {log.reason}
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
                      <p className="font-medium text-muted-foreground">No se encontraron registros</p>
                      <p className="text-sm text-muted-foreground">Ajustá los filtros para ver más resultados</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer con conteo */}
          <div className="border-t border-border bg-muted/30 px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredLogs.length} registros
            </p>
          </div>
        </Card>
      </main>
    </div>
  )
}
