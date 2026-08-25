"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, AlertCircle, Loader2, Mail, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/src/lib/supabase/client"

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/actualizar-password`,
      })

      if (error) {
        setError(error.message)
        setIsSubmitting(false)
        return
      }

      setSuccess(true)
    } catch {
      setError("Error al enviar el correo. Intenta de nuevo.")
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
            href="/login"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al login
          </Link>

          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm md:p-8">
            {success ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <h1 className="mb-2 text-2xl font-bold text-foreground">
                  Revisa tu correo
                </h1>
                <p className="mb-6 text-muted-foreground">
                  Te enviamos un enlace a <strong>{email}</strong> para restablecer tu contrasena.
                </p>
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Volver al login
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="mb-2 text-2xl font-bold text-foreground">
                    Recuperar contrasena
                  </h1>
                  <p className="text-muted-foreground">
                    Ingresa tu email y te enviaremos un enlace para restablecer tu contrasena.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando...
                      </span>
                    ) : (
                      "Enviar enlace"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Recordaste tu contrasena?{" "}
                    <Link href="/login" className="font-medium text-primary hover:underline">
                      Iniciar sesion
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
