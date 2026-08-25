"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Settings,
  Users,
  Maximize,
  Minimize,
  Send,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface DailyVideoCallProps {
  roomUrl: string
  userName: string
  userRole: "patient" | "professional"
  onLeave?: () => void
  onError?: (error: string) => void
}

interface ChatMessage {
  id: string
  sender: string
  text: string
  timestamp: Date
}

export function DailyVideoCall({
  roomUrl,
  userName,
  userRole,
  onLeave,
  onError
}: DailyVideoCallProps) {
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const callObjectRef = useRef<any>(null)

  const [isJoined, setIsJoined] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [participantCount, setParticipantCount] = useState(1)
  const [connectionState, setConnectionState] = useState<string>("disconnected")
  const [remoteParticipant, setRemoteParticipant] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Initialize Daily.co
  const initializeCall = useCallback(async () => {
    if (callObjectRef.current) return

    setIsJoining(true)
    setError(null)

    try {
      // Dynamic import of Daily.co SDK
      const DailyIframe = (await import("@daily-co/daily-js")).default

      const callObject = DailyIframe.createCallObject({
        url: roomUrl,
        userName: userName,
      })

      callObjectRef.current = callObject

      // Event listeners
      callObject.on("joined-meeting", () => {
        setIsJoined(true)
        setIsJoining(false)
        setConnectionState("connected")
      })

      callObject.on("left-meeting", () => {
        setIsJoined(false)
        setConnectionState("disconnected")
        onLeave?.()
      })

      callObject.on("participant-joined", (event: any) => {
        setParticipantCount((prev) => prev + 1)
        setRemoteParticipant(event.participant.user_name || "Participante")
        
        // Add system message
        setChatMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            sender: "Sistema",
            text: `${event.participant.user_name || "Un participante"} se unió a la sesión`,
            timestamp: new Date(),
          },
        ])
      })

      callObject.on("participant-left", (event: any) => {
        setParticipantCount((prev) => Math.max(1, prev - 1))
        setRemoteParticipant(null)
        
        setChatMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            sender: "Sistema",
            text: `${event.participant.user_name || "Un participante"} abandonó la sesión`,
            timestamp: new Date(),
          },
        ])
      })

      callObject.on("error", (event: any) => {
        setError(event.errorMsg || "Error en la conexión")
        setIsJoining(false)
        onError?.(event.errorMsg || "Error en la conexión")
      })

      callObject.on("track-started", async (event: any) => {
        if (event.participant.local) {
          if (event.track.kind === "video" && localVideoRef.current) {
            localVideoRef.current.srcObject = new MediaStream([event.track])
          }
        } else {
          if (event.track.kind === "video" && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = new MediaStream([event.track])
          }
        }
      })

      // App message for chat
      callObject.on("app-message", (event: any) => {
        if (event.data.type === "chat") {
          setChatMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              sender: event.fromId === "local" ? userName : (remoteParticipant || "Participante"),
              text: event.data.message,
              timestamp: new Date(),
            },
          ])
        }
      })

      // Join the call
      await callObject.join()

    } catch (err: any) {
      setError(err.message || "Error al conectar con la sala")
      setIsJoining(false)
      onError?.(err.message || "Error al conectar con la sala")
    }
  }, [roomUrl, userName, onLeave, onError, remoteParticipant])

  // Leave call
  const leaveCall = useCallback(async () => {
    if (callObjectRef.current) {
      await callObjectRef.current.leave()
      callObjectRef.current.destroy()
      callObjectRef.current = null
    }
    onLeave?.()
  }, [onLeave])

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (callObjectRef.current) {
      callObjectRef.current.setLocalAudio(!isMuted)
      setIsMuted(!isMuted)
    }
  }, [isMuted])

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (callObjectRef.current) {
      callObjectRef.current.setLocalVideo(!isVideoOff)
      setIsVideoOff(!isVideoOff)
    }
  }, [isVideoOff])

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (videoContainerRef.current) {
      if (!isFullscreen) {
        videoContainerRef.current.requestFullscreen?.()
      } else {
        document.exitFullscreen?.()
      }
      setIsFullscreen(!isFullscreen)
    }
  }, [isFullscreen])

  // Send chat message
  const sendMessage = useCallback(() => {
    if (!newMessage.trim() || !callObjectRef.current) return

    callObjectRef.current.sendAppMessage({
      type: "chat",
      message: newMessage,
    }, "*")

    setChatMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: userName,
        text: newMessage,
        timestamp: new Date(),
      },
    ])

    setNewMessage("")
  }, [newMessage, userName])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (callObjectRef.current) {
        callObjectRef.current.leave()
        callObjectRef.current.destroy()
      }
    }
  }, [])

  // Auto-join when component mounts
  useEffect(() => {
    if (roomUrl && !isJoined && !isJoining) {
      initializeCall()
    }
  }, [roomUrl, isJoined, isJoining, initializeCall])

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl bg-destructive/10 p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive">Error de conexión</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
        <Button onClick={initializeCall} variant="outline">
          Reintentar conexión
        </Button>
      </div>
    )
  }

  if (isJoining) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl bg-muted/50 p-8">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Conectando a la sesión...</p>
      </div>
    )
  }

  return (
    <div 
      ref={videoContainerRef}
      className="relative flex h-[600px] flex-col overflow-hidden rounded-xl bg-gray-900"
    >
      {/* Main video area */}
      <div className="relative flex-1">
        {/* Remote video (full size) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="h-full w-full object-cover"
        />

        {/* Waiting for participant overlay */}
        {!remoteParticipant && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/80">
            <Users className="mb-4 h-16 w-16 text-gray-400" />
            <p className="text-lg font-medium text-white">
              Esperando al {userRole === "patient" ? "profesional" : "paciente"}...
            </p>
            <p className="text-sm text-gray-400">
              Compartí el enlace de la sesión
            </p>
          </div>
        )}

        {/* Local video (picture-in-picture) */}
        <div className="absolute bottom-4 right-4 h-32 w-44 overflow-hidden rounded-lg border-2 border-white/20 bg-gray-800 shadow-xl">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
              <VideoOff className="h-8 w-8 text-gray-400" />
            </div>
          )}
          <div className="absolute bottom-1 left-1 rounded bg-black/50 px-1.5 py-0.5 text-xs text-white">
            Vos
          </div>
        </div>

        {/* Connection status */}
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5">
          <span className={`h-2 w-2 rounded-full ${
            connectionState === "connected" ? "bg-emerald-500" : "bg-yellow-500 animate-pulse"
          }`} />
          <span className="text-xs font-medium text-white">
            {connectionState === "connected" ? "Conectado" : "Conectando..."}
          </span>
        </div>

        {/* Participant count */}
        <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5">
          <Users className="h-4 w-4 text-white" />
          <span className="text-xs font-medium text-white">{participantCount}</span>
        </div>
      </div>

      {/* Chat panel */}
      {showChat && (
        <div className="absolute right-0 top-0 z-10 flex h-full w-80 flex-col border-l border-white/10 bg-gray-800">
          <div className="flex items-center justify-between border-b border-white/10 p-3">
            <span className="font-medium text-white">Chat de la sesión</span>
            <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-lg p-2 ${
                  msg.sender === userName
                    ? "ml-8 bg-primary text-primary-foreground"
                    : msg.sender === "Sistema"
                    ? "bg-gray-700/50 text-center text-xs text-gray-400"
                    : "mr-8 bg-gray-700 text-white"
                }`}
              >
                {msg.sender !== "Sistema" && (
                  <p className="text-xs font-medium opacity-70">{msg.sender}</p>
                )}
                <p className="text-sm">{msg.text}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 p-3">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribí un mensaje..."
                className="border-white/20 bg-gray-700 text-white placeholder:text-gray-400"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button size="icon" onClick={sendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Controls bar */}
      <div className="flex items-center justify-center gap-3 bg-gray-800 p-4">
        <Button
          variant={isMuted ? "destructive" : "secondary"}
          size="icon"
          onClick={toggleAudio}
          className="h-12 w-12 rounded-full"
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>

        <Button
          variant={isVideoOff ? "destructive" : "secondary"}
          size="icon"
          onClick={toggleVideo}
          className="h-12 w-12 rounded-full"
        >
          {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
        </Button>

        <Button
          variant="destructive"
          size="icon"
          onClick={leaveCall}
          className="h-14 w-14 rounded-full"
        >
          <PhoneOff className="h-6 w-6" />
        </Button>

        <Button
          variant={showChat ? "default" : "secondary"}
          size="icon"
          onClick={() => setShowChat(!showChat)}
          className="h-12 w-12 rounded-full"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>

        <Button
          variant="secondary"
          size="icon"
          onClick={toggleFullscreen}
          className="h-12 w-12 rounded-full"
        >
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  )
}
