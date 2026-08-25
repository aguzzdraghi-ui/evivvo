"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Camera, Save, Check, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar, Footer } from "@/src/components/landing"
import { useAuth } from "@/src/lib/auth-context"
import { useEvivvoStore } from "@/src/lib/store"

interface UserProfile {
  foto: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  biografia: string
  preferenciaAtencion: 'videollamada' | 'chat' | 'ambas'
  profesionalPreferido: string
  idioma: string
}

const defaultProfile: UserProfile = {
  foto: '',
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  biografia: '',
  preferenciaAtencion: 'videollamada',
  profesionalPreferido: '',
  idioma: 'es',
}

export default function PerfilPage() {
  const { user } = useAuth()
  const professionals = useEvivvoStore(state => state.getPublicProfessionals())
  const [profile, setProfile] = useState<UserProfile>(defaultProfile)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const savedProfile = localStorage.getItem('evivvo_user_profile')
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    } else if (user) {
      // Inicializar con datos del usuario actual
      const nameParts = user.name.split(' ')
      setProfile(prev => ({
        ...prev,
        nombre: nameParts[0] || '',
        apellido: nameParts.slice(1).join(' ') || '',
        email: user.email,
        foto: user.avatar || '',
      }))
    }
  }, [user])

  const handleChange = (key: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem('evivvo_user_profile', JSON.stringify(profile))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

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
            <h1 className="text-2xl font-bold text-foreground">Mi perfil</h1>
            <p className="text-muted-foreground mt-1">
              Editá tu información personal
            </p>
          </div>

          {/* Profile Photo */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  {profile.foto ? (
                    <Image
                      src={profile.foto}
                      alt="Foto de perfil"
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Foto de perfil</h3>
                  <p className="text-sm text-muted-foreground">
                    JPG o PNG. Máximo 2MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Información personal</CardTitle>
              <CardDescription>
                Esta información será visible para los profesionales antes de tus sesiones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={profile.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    placeholder="Tu nombre"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    value={profile.apellido}
                    onChange={(e) => handleChange('apellido', e.target.value)}
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="tu@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={profile.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  placeholder="+54 11 1234-5678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="biografia">Sobre vos</Label>
                <Textarea
                  id="biografia"
                  value={profile.biografia}
                  onChange={(e) => handleChange('biografia', e.target.value)}
                  placeholder="Contanos un poco sobre vos, tus intereses, o cualquier información que quieras compartir con tus profesionales..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Esta información ayuda a los profesionales a conocerte mejor antes de la sesión
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Preferencias de atención</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preferencia">Modalidad preferida</Label>
                <Select
                  value={profile.preferenciaAtencion}
                  onValueChange={(value) => handleChange('preferenciaAtencion', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná tu preferencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="videollamada">Videollamada</SelectItem>
                    <SelectItem value="chat">Chat</SelectItem>
                    <SelectItem value="ambas">Ambas modalidades</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profesional">Profesional preferido</Label>
                <Select
                  value={profile.profesionalPreferido}
                  onValueChange={(value) => handleChange('profesionalPreferido', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sin preferencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin preferencia</SelectItem>
                    {professionals.map(prof => (
                      <SelectItem key={prof.id} value={prof.id}>
                        {prof.nombre} {prof.apellido} - {prof.tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idioma">Idioma</Label>
                <Select
                  value={profile.idioma}
                  onValueChange={(value) => handleChange('idioma', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná tu idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full gap-2" size="lg">
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Cambios guardados
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar cambios
              </>
            )}
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
