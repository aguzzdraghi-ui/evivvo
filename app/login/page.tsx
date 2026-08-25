"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/src/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsSubmitting(true)
    
    const supabase = createClient()
    
    if (isLoginMode) {
      // Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })
      
      if (error) {
        setError(error.message === "Invalid login credentials" 
          ? "Email o contrasena incorrectos" 
          : error.message)
        setIsSubmitting(false)
        return
      }
      
      if (data.user) {
        // Verificar rol del usuario en profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('rol')
          .eq('id', data.user.id)
          .single()
        
        const rol = profile?.rol || 'paciente'
        const redirect = rol === 'admin' ? '/admin' 
          : rol === 'profesional' ? '/dashboard' 
          : '/mi-cuenta'
        
        router.push(redirect)
        router.refresh()
      }
    } else {
      // Registro
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
          data: {
            full_name: formData.name,
          },
        },
      })
      
      if (error) {
        setError(error.message)
        setIsSubmitting(false)
        return
      }
      
      if (data.user) {
        setSuccess("Revisa tu email para confirmar tu cuenta")
      }
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto flex h-20 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/evivvo-logo.png"
              alt="Evivvo"
              width={180}
              height={54}
              className="h-14"
              style={{ width: 'auto' }}
            />
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm md:p-8">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold text-foreground">
                {isLoginMode ? "Bienvenido de nuevo" : "Crea tu cuenta"}
              </h1>
              <p className="text-muted-foreground">
                {isLoginMode
                  ? "Ingresa tus datos para acceder"
                  : "Completa los datos para comenzar"}
              </p>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {success}
              </div>
            )}

            {/* Boton Google OAuth */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full gap-3"
              onClick={async () => {
                setError("")
                const supabase = createClient()
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: {
                    redirectTo: "`${window.location.origin}/auth/callback`"
                  }
                })
                if (error) {
                  setError("No pudimos iniciar sesion con Google. Intenta nuevamente.")
                }
              }}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </Button>

            {/* Separador */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">O con email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLoginMode && (
                <div>
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    type="text"
                    required={!isLoginMode}
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="password">Contrasena</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Tu contrasena"
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {isLoginMode && (
                <div className="text-right">
                  <Link href="/recuperar-password" className="text-sm text-primary hover:underline">
                    Olvidaste tu contrasena?
                  </Link>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isLoginMode ? "Ingresando..." : "Creando cuenta..."}
                  </span>
                ) : isLoginMode ? (
                  "Iniciar sesion"
                ) : (
                  "Crear cuenta"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLoginMode ? "No tienes una cuenta?" : "Ya tienes una cuenta?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMode(!isLoginMode)
                    setError("")
                    setSuccess("")
                  }}
                  className="font-medium text-primary hover:underline"
                >
                  {isLoginMode ? "Crear cuenta" : "Iniciar sesion"}
                </button>
              </p>
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <Link
                href="/profesionales/registro"
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Soy profesional y quiero unirme
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Al continuar, aceptas nuestros{" "}
            <Link href="/terminos-y-condiciones" className="underline hover:text-primary">
              terminos y condiciones
            </Link>{" "}
            y{" "}
            <Link href="/terminos-y-condiciones" className="underline hover:text-primary">
              politica de privacidad
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  )
}
