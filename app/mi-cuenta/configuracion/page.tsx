"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Bell, Mail, Clock, MessageSquare, Pill, Sparkles, Save, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Navbar, Footer } from "@/src/components/landing"

interface NotificationSettings {
  emailNotifications: boolean
  reminder24h: boolean
  reminder1h: boolean
  sessionChanges: boolean
  professionalMessages: boolean
  evaRecommendations: boolean
  medicalPrescriptions: boolean
  plusNews: boolean
}

const defaultSettings: NotificationSettings = {
  emailNotifications: true,
  reminder24h: true,
  reminder1h: true,
  sessionChanges: true,
  professionalMessages: true,
  evaRecommendations: false,
  medicalPrescriptions: true,
  plusNews: false,
}

export default function ConfiguracionPage() {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const savedSettings = localStorage.getItem('evivvo_user_notification_settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem('evivvo_user_notification_settings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const notificationOptions = [
    {
      key: 'emailNotifications' as const,
      icon: Mail,
      title: 'Notificaciones por email',
      description: 'Recibir todas las notificaciones también por correo electrónico',
    },
    {
      key: 'reminder24h' as const,
      icon: Clock,
      title: 'Recordatorio 24 horas antes',
      description: 'Te avisamos un día antes de tu próxima sesión',
    },
    {
      key: 'reminder1h' as const,
      icon: Clock,
      title: 'Recordatorio 1 hora antes',
      description: 'Te avisamos una hora antes de comenzar',
    },
    {
      key: 'sessionChanges' as const,
      icon: Bell,
      title: 'Cambios de sesión',
      description: 'Notificaciones cuando se modifique o cancele una sesión',
    },
    {
      key: 'professionalMessages' as const,
      icon: MessageSquare,
      title: 'Mensajes de profesionales',
      description: 'Cuando tu profesional te envíe un mensaje',
    },
    {
      key: 'evaRecommendations' as const,
      icon: Sparkles,
      title: 'Recomendaciones EVA',
      description: 'Sugerencias personalizadas basadas en tu estado emocional',
    },
    {
      key: 'medicalPrescriptions' as const,
      icon: Pill,
      title: 'Recetas médicas',
      description: 'Alertas cuando recibas una nueva receta',
    },
    {
      key: 'plusNews' as const,
      icon: Sparkles,
      title: 'Novedades Evivvo Plus',
      description: 'Ofertas especiales y nuevas funciones Plus',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link 
              href="/mi-cuenta" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Mi cuenta
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
            <p className="text-muted-foreground mt-1">
              Gestioná tus preferencias de notificaciones
            </p>
          </div>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notificaciones
              </CardTitle>
              <CardDescription>
                Elegí qué notificaciones querés recibir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {notificationOptions.map(({ key, icon: Icon, title, description }) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <Label htmlFor={key} className="text-sm font-medium cursor-pointer">
                        {title}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={key}
                    checked={settings[key]}
                    onCheckedChange={() => handleToggle(key)}
                  />
                </div>
              ))}

              <div className="pt-4 border-t">
                <Button onClick={handleSave} className="w-full gap-2">
                  {saved ? (
                    <>
                      <Check className="h-4 w-4" />
                      Guardado
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Guardar cambios
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
