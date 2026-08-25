"use client"

import { useState } from "react"
import { Search, MoreVertical, Ban, UserX, CheckCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const users = [
  { id: 1, name: "María García", email: "maria@email.com", status: "active", sessions: 12, joined: "15/01/2024" },
  { id: 2, name: "Juan Pérez", email: "juan@email.com", status: "active", sessions: 8, joined: "20/02/2024" },
  { id: 3, name: "Ana Rodríguez", email: "ana@email.com", status: "suspended", sessions: 3, joined: "10/03/2024" },
  { id: 4, name: "Carlos López", email: "carlos@email.com", status: "active", sessions: 25, joined: "05/01/2024" },
  { id: 5, name: "Laura Martínez", email: "laura@email.com", status: "blocked", sessions: 0, joined: "28/03/2024" },
  { id: 6, name: "Pedro Sánchez", email: "pedro@email.com", status: "active", sessions: 15, joined: "12/02/2024" },
]

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<number | null>(null)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAction = (userId: number, action: string) => {
    console.log(`[v0] Action: ${action} for user ${userId}`)
    setSelectedUser(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600">Activo</span>
      case "suspended":
        return <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600">Suspendido</span>
      case "blocked":
        return <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-600">Bloqueado</span>
      default:
        return null
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Usuarios</h1>
        <p className="text-muted-foreground">Gestiona los usuarios de la plataforma</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Todos</Button>
          <Button variant="outline" size="sm">Activos</Button>
          <Button variant="outline" size="sm">Suspendidos</Button>
          <Button variant="outline" size="sm">Bloqueados</Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-border bg-background">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Usuario</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Sesiones</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Registro</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-sm font-medium text-primary">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">{getStatusBadge(user.status)}</td>
                  <td className="px-4 py-4 text-foreground">{user.sessions}</td>
                  <td className="px-4 py-4 text-muted-foreground">{user.joined}</td>
                  <td className="px-4 py-4">
                    <div className="relative flex justify-end">
                      <button
                        onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                        className="rounded-lg p-2 hover:bg-muted"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      
                      {selectedUser === user.id && (
                        <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-border bg-background py-1 shadow-lg">
                          <button
                            onClick={() => handleAction(user.id, "view")}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted"
                          >
                            <Eye className="h-4 w-4" />
                            Ver perfil
                          </button>
                          {user.status !== "suspended" && (
                            <button
                              onClick={() => handleAction(user.id, "suspend")}
                              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-amber-600 hover:bg-muted"
                            >
                              <UserX className="h-4 w-4" />
                              Suspender
                            </button>
                          )}
                          {user.status === "suspended" && (
                            <button
                              onClick={() => handleAction(user.id, "activate")}
                              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-emerald-600 hover:bg-muted"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Reactivar
                            </button>
                          )}
                          {user.status !== "blocked" && (
                            <button
                              onClick={() => handleAction(user.id, "block")}
                              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-muted"
                            >
                              <Ban className="h-4 w-4" />
                              Bloquear
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredUsers.length} de {users.length} usuarios
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Anterior</Button>
          <Button variant="outline" size="sm">Siguiente</Button>
        </div>
      </div>
    </div>
  )
}
