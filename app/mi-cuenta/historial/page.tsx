"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowLeft, 
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  Heart,
  Sparkles,
  Calendar,
  Clock,
  User,
  Pill,
  AlertCircle,
  CheckCircle,
  Activity,
  BarChart3,
  FileText,
  ChevronRight,
  Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { PlusGate, PlusGateCompact } from "@/src/components/plus"
import { useAuth } from "@/src/lib/auth-context"
import { useEvivvoStore } from "@/src/lib/store"
import { Navbar, Footer } from "@/src/components/landing"
import type { MedicalHistory, EmotionalSummary, SignificantChange, ConsultedProfessional } from "@/src/types/medical-history"

// Mock data
const mockEmotionalSummary: EmotionalSummary = {
  id: 'summary-001',
  patientId: 'patient-001',
  generatedAt: '2026-05-06T10:00:00Z',
  overallStatus: 'improving',
  summary: 'Tu evolución emocional muestra una tendencia positiva en las últimas semanas. Has desarrollado mejores estrategias de afrontamiento para la ansiedad y se observa mayor estabilidad en tu estado de ánimo general.',
  keyInsights: [
    'Reducción significativa de episodios de ansiedad',
    'Mejora en la calidad del sueño',
    'Mayor capacidad de regulación emocional',
    'Incremento en actividades sociales',
  ],
  emotionalTrend: [
    { date: '2026-04-01', score: 5, dominantEmotion: 'Ansioso' },
    { date: '2026-04-08', score: 5.5, dominantEmotion: 'Preocupado' },
    { date: '2026-04-15', score: 6, dominantEmotion: 'Esperanzado' },
    { date: '2026-04-22', score: 6.5, dominantEmotion: 'Tranquilo' },
    { date: '2026-04-29', score: 7, dominantEmotion: 'Tranquilo' },
    { date: '2026-05-06', score: 7.5, dominantEmotion: 'Optimista' },
  ],
  detectedPatterns: [
    { id: 'p1', type: 'positive', pattern: 'Mejor manejo del estrés laboral', frequency: 'Consistente últimas 3 semanas', firstDetected: '2026-04-15', lastOccurrence: '2026-05-05' },
    { id: 'p2', type: 'positive', pattern: 'Rutina de sueño más estable', frequency: 'Diario', firstDetected: '2026-04-20', lastOccurrence: '2026-05-06' },
    { id: 'p3', type: 'concern', pattern: 'Picos de ansiedad los domingos por la noche', frequency: 'Semanal', firstDetected: '2026-03-01', lastOccurrence: '2026-05-04' },
  ],
  recommendations: [
    { id: 'r1', type: 'action', title: 'Continuar con técnicas de respiración', description: 'Las técnicas que aprendiste están funcionando bien', priority: 'medium' },
    { id: 'r2', type: 'session', title: 'Próxima sesión sugerida', description: 'Te recomendamos agendar tu próxima sesión para la semana que viene', priority: 'low', actionUrl: '/profesionales' },
  ],
}

const mockConsultedProfessionals: ConsultedProfessional[] = [
  { professionalId: 'prof-001', professionalName: 'Dra. María González', professionalType: 'psychologist', professionalImage: '/images/professionals/psicologa-1.jpg', sessionsCount: 12, firstSession: '2026-01-15', lastSession: '2026-05-02', status: 'active' },
  { professionalId: 'psiq-001', professionalName: 'Dr. Roberto Sánchez', professionalType: 'psychiatrist', professionalImage: '/images/professionals/psicologo-2.jpg', sessionsCount: 3, firstSession: '2026-04-01', lastSession: '2026-05-01', status: 'active' },
]

const mockSignificantChanges: SignificantChange[] = [
  { id: 'c1', date: '2026-05-01', type: 'milestone', title: 'Reducción de medicación', description: 'Se acordó reducir la dosis de clonazepam gradualmente', detectedBy: 'professional' },
  { id: 'c2', date: '2026-04-20', type: 'improvement', title: 'Mejor manejo de crisis', description: 'Lograste aplicar técnicas de respiración durante un episodio de ansiedad', detectedBy: 'self-report' },
  { id: 'c3', date: '2026-04-10', type: 'milestone', title: 'Retorno a actividades sociales', description: 'Retomaste actividades que habías dejado por la ansiedad', detectedBy: 'ai' },
]

interface EvaSummary {
  resumenSituacion: string
  emocionesDetectadas: string[]
  nivelUrgencia: string
  especialidadesRecomendadas: string[]
  tipoProfesional: string
  fecha: string
  historial: { rol: string; texto: string }[]
}

export default function EmotionalHistoryPage() {
  const { user } = useAuth()
  const isPlus = user?.isPlus === true
  const sessions = useEvivvoStore(state => state.getSessions())
  
  const [activeTab, setActiveTab] = useState('resumen')
  const [evaSummary, setEvaSummary] = useState<EvaSummary | null>(null)

  // Calcular bienestar real desde sesiones
  const userSessions = sessions.filter(s => s.pacienteId === user?.id && s.estado === 'completada')
  const bienestarData = userSessions
    .filter(s => s.bienestarFin !== undefined)
    .map(s => ({
      fecha: s.fecha,
      inicio: s.bienestarInicio || 0,
      fin: s.bienestarFin || 0,
    }))
  
  const avgBienestar = bienestarData.length > 0
    ? bienestarData.reduce((acc, b) => acc + b.fin, 0) / bienestarData.length
    : null
  
  const lastBienestar = bienestarData.length > 0 
    ? bienestarData[bienestarData.length - 1] 
    : null

  useEffect(() => {
    const saved = localStorage.getItem('evivvo_eva_summary')
    if (saved) {
      setEvaSummary(JSON.parse(saved))
    }
  }, [])

  const statusConfig = {
    improving: { label: 'Mejorando', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: TrendingUp },
    stable: { label: 'Estable', color: 'text-blue-600', bg: 'bg-blue-100', icon: Minus },
    declining: { label: 'Atención', color: 'text-amber-600', bg: 'bg-amber-100', icon: TrendingDown },
    critical: { label: 'Crítico', color: 'text-red-600', bg: 'bg-red-100', icon: AlertCircle },
  }

  const currentStatus = statusConfig[mockEmotionalSummary.overallStatus]
  const StatusIcon = currentStatus.icon

  // Calcular score actual y cambio
  const currentScore = mockEmotionalSummary.emotionalTrend[mockEmotionalSummary.emotionalTrend.length - 1].score
  const previousScore = mockEmotionalSummary.emotionalTrend[mockEmotionalSummary.emotionalTrend.length - 2].score
  const scoreChange = currentScore - previousScore

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/mi-cuenta">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Mi Historial Emocional</h1>
              <p className="text-sm text-muted-foreground">Tu evolución en Evivvo</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* EVA Summary Card - Si existe */}
        {evaSummary && (
          <Card className="mb-6 border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">Tu última conversación con EVA</CardTitle>
                  <CardDescription className="text-xs">
                    {new Date(evaSummary.fecha).toLocaleDateString('es-AR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-primary/5 rounded-lg">
                <p className="text-sm text-foreground">{evaSummary.resumenSituacion}</p>
              </div>
              {evaSummary.emocionesDetectadas?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {evaSummary.emocionesDetectadas.map((emocion) => (
                    <Badge key={emocion} variant="secondary" className="text-xs">
                      {emocion}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Link href="/profesionales?match=true" className="flex-1">
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    Ver profesionales recomendados
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Score Card - Apple Health Style */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                <span className="font-medium">Bienestar emocional</span>
              </div>
              <Badge className={`${currentStatus.bg} ${currentStatus.color} border-0`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {currentStatus.label}
              </Badge>
            </div>
            
            <div className="flex items-end gap-4 mb-4">
              <span className="text-6xl font-bold">{currentScore.toFixed(1)}</span>
              <div className="pb-2">
                <span className="text-lg">/10</span>
                <div className="flex items-center gap-1 text-sm">
                  {scoreChange > 0 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-emerald-300" />
                      <span className="text-emerald-300">+{scoreChange.toFixed(1)}</span>
                    </>
                  ) : scoreChange < 0 ? (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-300" />
                      <span className="text-red-300">{scoreChange.toFixed(1)}</span>
                    </>
                  ) : (
                    <>
                      <Minus className="h-4 w-4 text-white/70" />
                      <span className="text-white/70">Sin cambio</span>
                    </>
                  )}
                  <span className="text-white/70 ml-1">vs semana anterior</span>
                </div>
              </div>
            </div>

            {/* Mini trend chart */}
            <div className="flex items-end gap-1 h-16">
              {mockEmotionalSummary.emotionalTrend.map((point, i) => (
                <div 
                  key={i}
                  className="flex-1 bg-white/30 rounded-t transition-all"
                  style={{ height: `${(point.score / 10) * 100}%` }}
                  title={`${point.date}: ${point.score}`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-white/70 mt-2">
              <span>Hace 6 semanas</span>
              <span>Hoy</span>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium mb-1">Resumen IA</p>
                <p className="text-muted-foreground">{mockEmotionalSummary.summary}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="profesionales">Profesionales</TabsTrigger>
            <TabsTrigger value="tratamiento">Tratamiento</TabsTrigger>
            <TabsTrigger value="cambios">Cambios</TabsTrigger>
          </TabsList>

          {/* Resumen Tab */}
          <TabsContent value="resumen" className="space-y-6">
            {/* Key Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Insights clave
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {mockEmotionalSummary.keyInsights.map((insight, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Patrones detectados - Solo Plus */}
            <PlusGate feature="Patrones emocionales">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Patrones detectados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockEmotionalSummary.detectedPatterns.map((pattern) => (
                      <div 
                        key={pattern.id} 
                        className={`p-4 rounded-lg border ${
                          pattern.type === 'positive' 
                            ? 'bg-emerald-50 border-emerald-200' 
                            : pattern.type === 'concern'
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-muted/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{pattern.pattern}</p>
                            <p className="text-sm text-muted-foreground">{pattern.frequency}</p>
                          </div>
                          <Badge variant={pattern.type === 'positive' ? 'default' : 'secondary'}>
                            {pattern.type === 'positive' ? 'Positivo' : pattern.type === 'concern' ? 'Atención' : 'Neutral'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </PlusGate>

            {/* Recomendaciones avanzadas - Solo Plus */}
            <PlusGate feature="Recomendaciones avanzadas">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Recomendaciones de Evivvo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockEmotionalSummary.recommendations.map((rec) => (
                      <div key={rec.id} className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                        <div>
                          <p className="font-medium">{rec.title}</p>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                        </div>
                        {rec.actionUrl && (
                          <Link href={rec.actionUrl}>
                            <Button size="sm" variant="outline">
                              Ver
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </PlusGate>
          </TabsContent>

          {/* Profesionales Tab */}
          <TabsContent value="profesionales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profesionales consultados</CardTitle>
                <CardDescription>
                  Tu equipo de bienestar emocional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockConsultedProfessionals.map((prof) => {
                    const typeLabels = {
                      psychologist: { label: 'Psicólogo/a', color: 'bg-primary text-white' },
                      psychiatrist: { label: 'Psiquiatra', color: 'bg-red-500 text-white' },
                      coach: { label: 'Coach', color: 'bg-emerald-500 text-white' },
                    }
                    const typeConfig = typeLabels[prof.professionalType]

                    return (
                      <div key={prof.professionalId} className="flex items-center gap-4 p-4 border rounded-xl">
                        <Image
                          src={prof.professionalImage}
                          alt={prof.professionalName}
                          width={64}
                          height={64}
                          className="rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{prof.professionalName}</p>
                            <Badge className={typeConfig.color}>{typeConfig.label}</Badge>
                            {prof.status === 'active' && (
                              <Badge variant="outline" className="text-emerald-600 border-emerald-300">
                                Activo
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {prof.sessionsCount} sesiones
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Última: {new Date(prof.lastSession).toLocaleDateString('es-AR')}
                            </span>
                          </div>
                        </div>
                        <Link href={`/profesionales/${prof.professionalId}`}>
                          <Button variant="outline" size="sm">
                            Ver perfil
                          </Button>
                        </Link>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-4xl font-bold text-primary">15</p>
                  <p className="text-sm text-muted-foreground">Sesiones totales</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-4xl font-bold text-primary">12.5</p>
                  <p className="text-sm text-muted-foreground">Horas de terapia</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-4xl font-bold text-primary">4</p>
                  <p className="text-sm text-muted-foreground">Meses en Evivvo</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tratamiento Tab */}
          <TabsContent value="tratamiento" className="space-y-6">
            {/* Seguimiento psiquiátrico */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-red-600" />
                  Seguimiento psiquiátrico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium">Dr. Roberto Sánchez</p>
                      <p className="text-sm text-muted-foreground">Médico Psiquiatra - M.N. 78432</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700">Tratamiento estable</Badge>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Medicación actual</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="gap-1">
                        <Pill className="h-3 w-3" />
                        Sertralina 50mg
                      </Badge>
                      <Badge variant="secondary" className="gap-1">
                        <Pill className="h-3 w-3" />
                        Clonazepam 0.5mg (en reducción)
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Última evaluación</p>
                      <p className="font-medium">1 de Mayo, 2026</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Próxima evaluación</p>
                      <p className="font-medium">15 de Mayo, 2026</p>
                    </div>
                  </div>

                  <Link href="/mi-cuenta/recetas">
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Ver mis recetas
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Derivaciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Derivaciones sugeridas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                  <p className="font-medium">Sin derivaciones pendientes</p>
                  <p className="text-sm text-muted-foreground">
                    Cuando Evivvo detecte que podrías beneficiarte de otro tipo de apoyo, te lo haremos saber.
                  </p>
                </div>
                <Link href="/mi-cuenta/recomendaciones">
                  <Button variant="outline" className="w-full">
                    Ver recomendaciones
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cambios Tab */}
          <TabsContent value="cambios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cambios importantes detectados</CardTitle>
                <CardDescription>
                  Hitos y evolución en tu proceso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />
                  
                  <div className="space-y-6">
                    {mockSignificantChanges.map((change) => {
                      const typeConfig = {
                        improvement: { color: 'bg-emerald-500', icon: TrendingUp },
                        milestone: { color: 'bg-primary', icon: Star },
                        setback: { color: 'bg-amber-500', icon: TrendingDown },
                        concern: { color: 'bg-red-500', icon: AlertCircle },
                      }
                      const config = typeConfig[change.type]
                      const Icon = config.icon

                      return (
                        <div key={change.id} className="relative pl-10">
                          <div className={`absolute left-2 w-5 h-5 rounded-full ${config.color} flex items-center justify-center`}>
                            <Icon className="h-3 w-3 text-white" />
                          </div>
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium">{change.title}</p>
                              <span className="text-xs text-muted-foreground">
                                {new Date(change.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{change.description}</p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {change.detectedBy === 'ai' ? 'Detectado por IA' : 
                               change.detectedBy === 'professional' ? 'Registrado por profesional' :
                               'Auto-reportado'}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer info */}
        <Card className="mt-8 border-muted">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground text-center">
              Este historial es generado automáticamente por Evivvo combinando información de tus sesiones,
              auto-reportes y análisis de IA. Es una herramienta para acompañar tu proceso, no un diagnóstico médico.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
