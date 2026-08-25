"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, CheckCircle, X, Play, Instagram, Linkedin, Globe } from "lucide-react"
import { Navbar, Footer } from "@/src/components/landing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const professionOptions = [
  { id: "psicologo", label: "Psicólogo/a" },
  { id: "psiquiatra", label: "Psiquiatra" },
  { id: "coach", label: "Coach" },
]

const specialtiesOptions = [
  { id: "ansiedad", label: "Ansiedad" },
  { id: "depresion", label: "Depresión" },
  { id: "estres", label: "Estrés" },
  { id: "rupturas", label: "Rupturas amorosas" },
  { id: "duelo", label: "Duelo" },
  { id: "soledad", label: "Soledad" },
  { id: "pareja", label: "Terapia de pareja" },
  { id: "autoestima", label: "Autoestima" },
  { id: "crecimiento-personal", label: "Crecimiento personal" },
  { id: "insomnio", label: "Insomnio" },
  { id: "alimentacion", label: "Trastornos alimenticios" },
  { id: "adicciones", label: "Adicciones" },
  { id: "familia", label: "Terapia familiar" },
  { id: "laboral", label: "Estrés laboral" },
]

export default function ProfessionalRegistrationPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    // Datos de acceso
    username: "",
    password: "",
    confirmPassword: "",
    // Datos personales
    fullName: "",
    email: "",
    phone: "",
    // Datos profesionales
    profession: "",
    specialties: [] as string[],
    experience: "",
    certification: "",
    bio: "",
    price: "",
    availableNow: false,
    // Redes sociales
    instagram: "",
    linkedin: "",
    website: "",
  })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setVideoPreview(url)
    }
  }

  const removePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview("")
  }

  const removeVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
    }
    setVideoFile(null)
    setVideoPreview("")
  }

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.username) newErrors.username = "El nombre de usuario es requerido"
    if (formData.password.length < 6) newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden"
    if (!formData.fullName) newErrors.fullName = "El nombre completo es requerido"
    if (!formData.email) newErrors.email = "El email es requerido"
    if (!formData.profession) newErrors.profession = "La profesión es requerida"
    if (formData.specialties.length === 0) newErrors.specialties = "Selecciona al menos una especialidad"
    if (!photoFile) newErrors.photo = "La foto de perfil es requerida"
    if (!videoFile) newErrors.video = "El video de presentación es requerido"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      console.log("[v0] Form submitted:", formData)
      console.log("[v0] Photo:", photoFile?.name)
      console.log("[v0] Video:", videoFile?.name)
      setIsSubmitted(true)
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center py-16">
          <div className="mx-auto max-w-md px-4 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle className="h-10 w-10 text-emerald-500" />
              </div>
            </div>
            <h1 className="mb-4 text-2xl font-bold text-foreground">
              Solicitud enviada correctamente
            </h1>
            <p className="mb-8 text-muted-foreground">
              Hemos recibido tu solicitud para unirte a Evivvo. Nuestro equipo
              revisará tu información y te contactaremos en las próximas 48-72
              horas hábiles. Recibirás un email de confirmación con los siguientes pasos.
            </p>
            <Button asChild>
              <Link href="/">Volver al inicio</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto max-w-3xl px-4 md:px-6">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <div className="rounded-2xl border border-border bg-background p-6 md:p-8">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
                Únete a Evivvo como profesional
              </h1>
              <p className="text-muted-foreground">
                Completa el formulario para iniciar el proceso de registro. 
                Podrás ofrecer múltiples tipos de terapia desde tu perfil.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Datos de Acceso */}
              <div className="space-y-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">1</span>
                  Datos de acceso
                </h2>
                <p className="text-sm text-muted-foreground">
                  Estos serán tus credenciales para acceder al panel de profesional
                </p>

                <div>
                  <Label htmlFor="username">Nombre de usuario *</Label>
                  <Input
                    id="username"
                    type="text"
                    required
                    placeholder="Ej: dr.juanperez"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className={errors.username ? "border-destructive" : ""}
                  />
                  {errors.username && <p className="mt-1 text-sm text-destructive">{errors.username}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="password">Contraseña *</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={errors.password ? "border-destructive" : ""}
                    />
                    {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password}</p>}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      placeholder="Repite tu contraseña"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={errors.confirmPassword ? "border-destructive" : ""}
                    />
                    {errors.confirmPassword && <p className="mt-1 text-sm text-destructive">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* Información Personal */}
              <div className="space-y-4 border-t border-border pt-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">2</span>
                  Información personal
                </h2>

                <div>
                  <Label htmlFor="fullName">Nombre completo *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    required
                    placeholder="Ej: Dr. Juan Pérez"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="+54 11 1234 5678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Información Profesional */}
              <div className="space-y-4 border-t border-border pt-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">3</span>
                  Información profesional
                </h2>

                <div>
                  <Label htmlFor="profession">Profesión *</Label>
                  <select
                    id="profession"
                    required
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Selecciona tu profesión</option>
                    {professionOptions.map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Especialidades / Tipos de terapia *</Label>
                  <p className="mb-3 text-sm text-muted-foreground">
                    Selecciona todas las áreas en las que ofreces atención. Puedes elegir múltiples especialidades.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {specialtiesOptions.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSpecialtyToggle(s.id)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                          formData.specialties.includes(s.id)
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  {errors.specialties && <p className="mt-2 text-sm text-destructive">{errors.specialties}</p>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="experience">Años de experiencia *</Label>
                    <Input
                      id="experience"
                      type="number"
                      required
                      min="1"
                      placeholder="Ej: 5"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Precio por sesión (ARS) *</Label>
                    <Input
                      id="price"
                      type="number"
                      required
                      min="1000"
                      placeholder="Ej: 15000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="certification">Matrícula o certificación *</Label>
                  <Input
                    id="certification"
                    type="text"
                    required
                    placeholder="Ej: M.N. 12345 / Coach Certificado ICF"
                    value={formData.certification}
                    onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Biografía profesional *</Label>
                  <Textarea
                    id="bio"
                    required
                    rows={4}
                    placeholder="Cuéntanos sobre tu trayectoria, enfoque terapéutico y cómo puedes ayudar a los usuarios..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="availableNow"
                    checked={formData.availableNow}
                    onChange={(e) => setFormData({ ...formData, availableNow: e.target.checked })}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <Label htmlFor="availableNow" className="cursor-pointer">
                    Estoy disponible para atender de forma inmediata (aparecerás en "Hablar ahora")
                  </Label>
                </div>
              </div>

              {/* Redes Sociales */}
              <div className="space-y-4 border-t border-border pt-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">4</span>
                  Redes sociales (opcional)
                </h2>
                <p className="text-sm text-muted-foreground">
                  Agrega tus redes sociales para que los usuarios puedan conocerte mejor
                </p>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label htmlFor="instagram" className="flex items-center gap-2">
                      <Instagram className="h-4 w-4" /> Instagram
                    </Label>
                    <Input
                      id="instagram"
                      type="text"
                      placeholder="@usuario"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin" className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      type="text"
                      placeholder="URL del perfil"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Sitio web
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://..."
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Foto y Video */}
              <div className="space-y-4 border-t border-border pt-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">5</span>
                  Foto y video de presentación
                </h2>

                {/* Foto de perfil */}
                <div>
                  <Label>Foto de perfil *</Label>
                  <p className="mb-3 text-sm text-muted-foreground">
                    Sube una foto profesional tuya (JPG o PNG, máx. 5MB)
                  </p>
                  
                  {photoPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="h-32 w-32 rounded-full object-cover border-4 border-primary/20"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${errors.photo ? "border-destructive" : "border-border"} bg-muted/30 px-6 py-8 transition-colors hover:border-primary/50 hover:bg-muted/50`}>
                      <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Clic para subir tu foto</span>
                      <span className="text-xs text-muted-foreground">JPG o PNG, máximo 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  )}
                  {errors.photo && <p className="mt-2 text-sm text-destructive">{errors.photo}</p>}
                </div>

                {/* Video de presentación */}
                <div>
                  <Label>Video de presentación *</Label>
                  <p className="mb-3 text-sm text-muted-foreground">
                    Graba un video corto (1-2 minutos) presentándote y explicando tu enfoque. 
                    Este video ayudará a los usuarios a conocerte antes de agendar.
                  </p>
                  
                  {videoPreview ? (
                    <div className="relative">
                      <video
                        ref={videoRef}
                        src={videoPreview}
                        className="w-full max-w-md rounded-lg border border-border"
                        controls
                      />
                      <div className="mt-3 flex gap-2">
                        <label className="cursor-pointer">
                          <Button type="button" variant="outline" size="sm" asChild>
                            <span>
                              <Upload className="mr-2 h-4 w-4" />
                              Reemplazar video
                            </span>
                          </Button>
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={handleVideoChange}
                          />
                        </label>
                        <Button type="button" variant="destructive" size="sm" onClick={removeVideo}>
                          <X className="mr-2 h-4 w-4" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${errors.video ? "border-destructive" : "border-border"} bg-muted/30 px-6 py-10 transition-colors hover:border-primary/50 hover:bg-muted/50`}>
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <Play className="h-7 w-7 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">Clic para subir tu video</span>
                      <span className="text-xs text-muted-foreground">MP4 o MOV, máximo 100MB</span>
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleVideoChange}
                      />
                    </label>
                  )}
                  {errors.video && <p className="mt-2 text-sm text-destructive">{errors.video}</p>}
                </div>
              </div>

              {/* Comisiones */}
              <div className="rounded-lg bg-muted/50 p-4">
                <h3 className="font-semibold text-foreground">Información sobre comisiones</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Evivvo retiene una comisión por cada sesión realizada:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>- Sesiones en vivo (inmediatas): <strong className="text-foreground">7%</strong></li>
                  <li>- Sesiones programadas: <strong className="text-foreground">14%</strong></li>
                </ul>
              </div>

              {/* Submit */}
              <div className="border-t border-border pt-6">
                <Button type="submit" size="lg" className="w-full">
                  Enviar solicitud de registro
                </Button>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Al enviar este formulario, aceptas nuestros{" "}
                  <Link href="/terminos-y-condiciones" className="underline hover:text-primary">
                    términos y condiciones
                  </Link>{" "}
                  y confirmas que la información proporcionada es verídica.
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
