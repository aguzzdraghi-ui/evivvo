"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, AlertCircle, Video, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DailyVideoCall } from "@/src/components/video/daily-video-call"
import { useAuth } from "@/src/lib/auth-context"

interface SessionData {
  id: string
  professionalName: string
  patientName: string
  date: string
  time: string
  duration: number
  modality: string
}

export default function VideoCallPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const sessionId = params.sessionId as string
  
  const [roomUrl, setRoomUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [sessionData, setSessionData] = useState<SessionData | null>(null)

  // Fetch or create room
  useEffect(() => {
    const initializeRoom = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Try to get session data from localStorage
        const savedSessions = localStorage.getItem("evivvo_sessions")
        let session: SessionData | null = null
        
        if (savedSessions) {
          const sessions = JSON.parse(savedSessions)
          session = sessions.find((s: any) => s.id === sessionId)
        }

        // If no session found, create mock data
        if (!session) {
          session = {
            id: sessionId,
            professionalName: "Dra. María González",
            patientName: user?.name || "Paciente",
            date: new Date().toISOString().split("T")[0],
            time: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
            duration: 45,
            modality: "videollamada"
          }
        }

        setSessionData(session)

        // Create Daily.co room
        const response = await fetch("/api/daily/create-room", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            professionalName: session.professionalName,
            patientName: session.patientName,
          }),
        })

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || "Error al crear la sala")
        }

        setRoomUrl(data.roomUrl)
        setIsDemoMode(data.isDemoMode || false)

      } catch (err: any) {
        console.error("[Session] Error:", err)
        setError(err.message || "Error al conectar con la sesión")
      } finally {
        setIsLoading(false)
      }
    }

    if (sessionId) {
      initializeRoom()
    }
  }, [sessionId, user])

  const handleLeave = () => {
    router.push("/mi-cuenta/sesiones")
  }

  const handleError = (errorMsg: string) => {
    setError(errorMsg)
  }

  const handleRetry = () => {
    setError(null)
    setRoomUrl(null)
    setIsLoading(true)
    // Re-trigger useEffect
    window.location.reload()
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Preparando la sala</h2>
          <p className="text-gray-400">Conectando con el servicio de video...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              Error de conexión
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">{error}</p>
            <div className="flex gap-3">
              <Button onClick={handleRetry} variant="outline" className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
              <Button onClick={handleLeave} variant="ghost" className="flex-1">
                Volver
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Demo mode - API key not configured
  if (isDemoMode || !roomUrl) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <Link
              href="/mi-cuenta/sesiones"
              className="flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver
            </Link>
            {sessionData && (
              <p className="text-white font-medium">{sessionData.professionalName}</p>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-xl mx-auto bg-gray-800 border-gray-700">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
                <AlertCircle className="h-8 w-8 text-amber-400" />
              </div>
              <CardTitle className="text-white">Videollamadas no configuradas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-gray-300">
                El administrador debe configurar la API key de Daily.co para habilitar las videollamadas.
              </p>
              <Button onClick={handleLeave} variant="outline" className="text-white border-gray-600">
                Volver a mis sesiones
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Video call
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/mi-cuenta/sesiones"
              className="flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
              Salir
            </Link>
            <div className="h-6 w-px bg-gray-600" />
            <span className="text-gray-400 text-sm">Sesión #{sessionId.slice(0, 8)}</span>
          </div>
          {sessionData && (
            <div className="text-right">
              <p className="text-white font-medium">{sessionData.professionalName}</p>
              <p className="text-gray-400 text-sm">{sessionData.duration} minutos</p>
            </div>
          )}
        </div>
      </div>

      {/* Video call component */}
      <div className="container mx-auto px-4 py-6">
        {roomUrl && (
          <DailyVideoCall
            roomUrl={roomUrl}
            userName={user?.name || "Participante"}
            userRole={user?.role === "profesional" ? "professional" : "patient"}
            onLeave={handleLeave}
            onError={handleError}
          />
        )}
      </div>
    </div>
  )
}
