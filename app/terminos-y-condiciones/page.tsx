"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Navbar, Footer } from "@/src/components/landing"
import { useEvivvoStore } from "@/src/lib/store"
import ReactMarkdown from "react-markdown"

export default function TermsPage() {
  // Leer términos del store centralizado
  const terms = useEvivvoStore(state => state.getTerms())
  
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

          <div className="rounded-2xl border border-border bg-background p-6 md:p-10">
            <h1 className="mb-2 text-3xl font-bold text-foreground">
              Términos y Condiciones
            </h1>
            <p className="mb-8 text-sm text-muted-foreground">
              Última actualización: {new Date(terms.ultimaActualizacion).toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} - Versión {terms.version}
            </p>

            <div className="prose prose-gray max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold text-foreground mb-4">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-medium text-foreground mb-2 mt-4">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-muted-foreground mb-4">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-1">{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li>{children}</li>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-foreground font-semibold">{children}</strong>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} className="text-primary hover:underline">{children}</a>
                  ),
                }}
              >
                {terms.contenido}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
