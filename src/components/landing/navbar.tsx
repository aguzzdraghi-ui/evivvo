"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/src/lib/auth-context"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isLoading, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-24 items-center justify-between px-4 md:px-6">
        {/* Logo prominente - protagonista de la identidad */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/evivvo-logo.png"
            alt="Evivvo - Plataforma de Bienestar Emocional"
            width={280}
            height={80}
            className="h-20 md:h-24"
            style={{ width: 'auto' }}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            href="/#como-funciona"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Cómo funciona
          </Link>
          <Link
            href="/profesionales"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Profesionales
          </Link>
          <Link
            href="/planes"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Evivvo Plus
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />
          ) : user ? (
            <>
              <Button variant="ghost" onClick={() => logout()}>
                Cerrar sesión
              </Button>
              <Link
                href="/mi-cuenta"
                className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-4 transition-colors hover:border-primary/40"
              >
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {user.avatar ? (
                    <Image src={user.avatar} alt={user.name} width={32} height={32} className="h-full w-full object-cover" />
                  ) : (
                    user.name?.[0]?.toUpperCase() || "U"
                  )}
                </span>
                <span className="text-sm font-medium text-foreground">Mi cuenta</span>
              </Link>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Iniciar sesión</Link>
              </Button>
              <Button asChild className="animate-pulse-blue">
                <Link href="/registro">Comenzar ahora</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-4">
            <Link
              href="/#como-funciona"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Cómo funciona
            </Link>
            <Link
              href="/profesionales"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Profesionales
            </Link>
            <Link
              href="/planes"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Evivvo Plus
            </Link>
            <hr className="border-border" />
            {user ? (
              <>
                <Button variant="outline" asChild>
                  <Link href="/mi-cuenta" onClick={() => setIsMenuOpen(false)}>
                    Mi cuenta
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="justify-start">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    Iniciar sesión
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/registro" onClick={() => setIsMenuOpen(false)}>
                    Regístrate
                  </Link>
                </Button>
                <Button asChild className="animate-pulse-blue">
                  <Link href="/registro" onClick={() => setIsMenuOpen(false)}>
                    Comenzar ahora
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
