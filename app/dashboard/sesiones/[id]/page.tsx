"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { 
  ArrowLeft, Video, MessageSquare, Clock, Calendar, User, 
  Heart, Save, Check, TrendingUp, TrendingDown, Minus,
  FileText, Brain, Star, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useEvivvoStore, type PatientProfessionalNote } from "@/src/lib/store"
import { useAuth } from "@/src/lib/auth-context"

export default function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = use(params)
  const router = useRouter()
  const { user } = useAuth()
  
  // Store
  const sessions = useEvivvoStore(state => state.getSessions())
  const patients = useEvivvoStore(state => state.getPatients())
  const updateSession = useEvivvoStore(state => state.updateSession)
  
  const session = sessions.find(s => s.id === sessionId)
  const patient = session ? patients.find(p => p.id === session.pacienteId) : null
  
  // Estados para bienestar
  const [bienestarInicio, setBienestarInicio] = useState<number>(session?.bienestarInicio || 5)
  const [bienestarFin, setBienestarFin] = useState<number>(session?.bienestarFin || 5)
  const [observacion, setObservacion] = useState(session?.observacionBienestar || '')
  const [recomendacion, setRecomendacion] = useState(session?.recomendacionProxima || '')
  
  // Estados para valoración privada
  const [actitud, setActitud] = useState<'excelente' | 'buena' | 'regular' | 'mala'>('buena')
  const [puntualidad, setPuntualidad] = useState<'puntual' | 'leve_retraso' | 'tarde' | 'no_asistio'>('puntual')
  const [compromiso, setCompromiso] = useState<number>(3)
  const [observacionesPrivadas, setObservacionesPrivadas] = useState('')
  const [puntuacionInterna, setPuntuacionInterna] = useState<number>(3)
  
  const [saved, setSaved] = useState(false)
  
  // Cargar valoración privada existente
  useEffect(() => {
    const savedNotes = localStorage.getItem('evivvo_patient_professional_notes')
    if (savedNotes) {
      const notes: PatientProfessionalNote[] = JSON.parse(savedNotes)
      const existingNote = notes.find(n => n.sessionId === sessionId)
      if (existingNote) {
        setActitud(existingNote.actitud)
        setPuntualidad(existingNote.puntualidad)
        setCompromiso(existingNote.compromiso)
        setObservacionesPrivadas(existingNote.observaciones)
        setPuntuacionInterna(existingNote.puntuacionInterna)
      }
    }
  }, [sessionId])
  
  // Cargar perfil del paciente
  const [patientProfile, setPatientProfile] = useState<{
    biografia?: string
    preferenciaAtencion?: string
  } | null>(null)
  
  useEffect(() => {
    const profile = localStorage.getItem('evivvo_user_profile')
    if (profile) {
      setPatientProfile(JSON.parse(profile))
    }
  }, [])
  
  if (!session) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Sesión no encontrada</h2>
        <Link href="/dashboard/sesiones">
          <Button variant="outline">Volver a sesiones</Button>
        </Link>
      </div>
    )
  }
  
  const handleSave = () => {
    // Guardar bienestar en la sesión
    updateSession(sessionId, {
      bienestarInicio,
      bienestarFin,
      observacionBienestar: observacion,
      recomendacionProxima: recomendacion,
    })
    
    // Guardar valoración privada
    const savedNotes = localStorage.getItem('evivvo_patient_professional_notes')
    const notes: PatientProfessionalNote[] = savedNotes ? JSON.parse(savedNotes) : []
    
    const existingIndex = notes.findIndex(n => n.sessionId === sessionId)
    const newNote: PatientProfessionalNote = {
      id: existingIndex >= 0 ? notes[existingIndex].id : crypto.randomUUID(),
      pacienteId: session.pacienteId,
      profesionalId: session.profesionalId,
      sessionId,
      actitud,
      puntualidad,
      compromiso: compromiso as 1 | 2 | 3 | 4 | 5,
      observaciones: observacionesPrivadas,
      puntuacionInterna: puntuacionInterna as 1 | 2 | 3 | 4 | 5,
      createdAt: new Date().toISOString(),
    }
    
    if (existingIndex >= 0) {
      notes[existingIndex] = newNote
    } else {
      notes.push(newNote)
    }
    
    localStorage.setItem('evivvo_patient_professional_notes', JSON.stringify(notes))
    
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }
  
  const getBienestarDiff = () => {
    const diff = bienestarFin - bienestarInicio
    if (diff > 0) return { icon: TrendingUp, text: `+${diff}`, color: 'text-emerald-500' }
    if (diff < 0) return { icon: TrendingDown, text: `${diff}`, color: 'text-red-500' }
    return { icon: Minus, text: '0', color: 'text-muted-foreground' }
  }
  
  const bienestarDiff = getBienestarDiff()
  const BienestarIcon = bienestarDiff.icon
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link 
          href="/dashboard/sesiones" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a sesiones
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Sesión con {patient ? `${patient.nombre} ${patient.apellido}` : 'Paciente'}
            </h1>
            <div className="flex items-center gap-3 mt-1 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(session.fecha).toLocaleDateString('es-AR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {session.hora}
              </span>
              <Badge variant={session.estado === 'completada' ? 'default' : 'secondary'}>
                {session.estado}
              </Badge>
            </div>
          </div>
          {session.estado === 'confirmada' && (
            <Link href={`/sesion/${sessionId}`}>
              <Button className="gap-2">
                <Video className="h-4 w-4" />
                Iniciar sesión
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Panel principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info del paciente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Información del paciente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {patient?.foto ? (
                  <Image
                    src={patient.foto}
                    alt={patient.nombre}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-15 w-15 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-7 w-7 text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-foreground">
                    {patient ? `${patient.nombre} ${patient.apellido}` : 'Paciente'}
                  </h3>
                  <p className="text-sm text-muted-foreground">{patient?.email}</p>
                </div>
              </div>
              
              {patientProfile?.biografia && (
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="text-sm font-medium text-foreground mb-1">Bio del paciente</h4>
                  <p className="text-sm text-muted-foreground">{patientProfile.biografia}</p>
                </div>
              )}
              
              {patient?.evaHistory && patient.evaHistory.length > 0 && (
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    Último resumen EVA
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {patient.evaHistory[patient.evaHistory.length - 1].respuesta.slice(0, 200)}...
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {patient.evaHistory[patient.evaHistory.length - 1].emociones.map(e => (
                      <Badge key={e} variant="outline" className="text-xs">{e}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Evaluación de bienestar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Evaluación de bienestar
              </CardTitle>
              <CardDescription>
                Registrá el bienestar del paciente al inicio y al final de la sesión
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <Label>Bienestar al inicio: {bienestarInicio}</Label>
                  <Slider
                    value={[bienestarInicio]}
                    onValueChange={([v]) => setBienestarInicio(v)}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Muy bajo</span>
                    <span>Muy alto</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>Bienestar al finalizar: {bienestarFin}</Label>
                  <Slider
                    value={[bienestarFin]}
                    onValueChange={([v]) => setBienestarFin(v)}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Muy bajo</span>
                    <span>Muy alto</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-muted/50">
                <BienestarIcon className={`h-5 w-5 ${bienestarDiff.color}`} />
                <span className="text-lg font-semibold text-foreground">
                  Cambio: <span className={bienestarDiff.color}>{bienestarDiff.text}</span>
                </span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observacion">Observación breve</Label>
                <Textarea
                  id="observacion"
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                  placeholder="Notas sobre la sesión..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recomendacion">Recomendación para próxima sesión</Label>
                <Textarea
                  id="recomendacion"
                  value={recomendacion}
                  onChange={(e) => setRecomendacion(e.target.value)}
                  placeholder="Temas a trabajar, ejercicios sugeridos..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Panel lateral */}
        <div className="space-y-6">
          {/* Valoración privada */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-primary" />
                Valoración privada
              </CardTitle>
              <CardDescription className="text-xs">
                Solo visible para profesionales y admin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Actitud</Label>
                <Select value={actitud} onValueChange={(v: typeof actitud) => setActitud(v)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excelente">Excelente</SelectItem>
                    <SelectItem value="buena">Buena</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="mala">Mala</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Puntualidad</Label>
                <Select value={puntualidad} onValueChange={(v: typeof puntualidad) => setPuntualidad(v)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="puntual">Puntual</SelectItem>
                    <SelectItem value="leve_retraso">Leve retraso</SelectItem>
                    <SelectItem value="tarde">Tarde</SelectItem>
                    <SelectItem value="no_asistio">No asistió</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Compromiso: {compromiso}/5</Label>
                <Slider
                  value={[compromiso]}
                  onValueChange={([v]) => setCompromiso(v)}
                  min={1}
                  max={5}
                  step={1}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Puntuación interna: {puntuacionInterna}/5</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setPuntuacionInterna(n)}
                      className={`p-1 rounded ${n <= puntuacionInterna ? 'text-amber-500' : 'text-muted-foreground/30'}`}
                    >
                      <Star className="h-5 w-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs">Observaciones privadas</Label>
                <Textarea
                  value={observacionesPrivadas}
                  onChange={(e) => setObservacionesPrivadas(e.target.value)}
                  placeholder="Notas internas..."
                  rows={3}
                  className="text-sm"
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Botón guardar */}
          <Button onClick={handleSave} className="w-full gap-2">
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Guardado
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar todo
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
