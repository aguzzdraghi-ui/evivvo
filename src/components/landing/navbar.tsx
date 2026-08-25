"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
            href="/#planes"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Planes
          </Link>
          <Link
            href="/profesionales"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Profesionales
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="ghost" asChild>
            <Link href="/login">Iniciar sesión</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/registro">Regístrate</Link>
          </Button>
          <Button asChild className="animate-pulse-blue">
            <Link href="/profesionales?disponible=true">Hablar ahora</Link>
          </Button>
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
              href="/#planes"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Planes
            </Link>
            <Link
              href="/profesionales"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Profesionales
            </Link>
            <hr className="border-border" />
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
              <Link href="/profesionales?disponible=true" onClick={() => setIsMenuOpen(false)}>
                Hablar ahora
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
