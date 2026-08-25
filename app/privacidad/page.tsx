"use client"

import Link from "next/link"
import { ArrowLeft, Shield, Lock, Eye, Database, Bell, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar, Footer } from "@/src/components/landing"

export default function PrivacidadPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                Política de Privacidad
              </h1>
              <p className="mt-2 text-muted-foreground">
                Última actualización: Mayo 2026
              </p>
            </div>

            {/* Resumen de privacidad */}
            <div className="mb-8 grid gap-4 md:grid-cols-3">
              <Card className="glass-card">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <Lock className="mb-3 h-8 w-8 text-primary" />
                  <h3 className="font-semibold">Datos Encriptados</h3>
                  <p className="text-sm text-muted-foreground">
                    Toda tu información está protegida con encriptación SSL
                  </p>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <Eye className="mb-3 h-8 w-8 text-primary" />
                  <h3 className="font-semibold">Sin Grabaciones</h3>
                  <p className="text-sm text-muted-foreground">
                    No grabamos videollamadas ni conversaciones
                  </p>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <Database className="mb-3 h-8 w-8 text-primary" />
                  <h3 className="font-semibold">No Vendemos Datos</h3>
                  <p className="text-sm text-muted-foreground">
                    Tu información nunca será comercializada
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contenido de la política */}
            <Card className="glass-card">
              <CardContent className="prose prose-gray max-w-none p-8">
                <p className="text-muted-foreground">
                  Bienvenido/a a Evivvo. La privacidad, seguridad y confidencialidad de nuestros usuarios y profesionales es una prioridad fundamental. Esta Política de Privacidad explica cómo recopilamos, utilizamos, almacenamos y protegemos la información dentro de la plataforma www.evivvo.app.
                </p>
                <p className="text-muted-foreground">
                  Al utilizar Evivvo, el usuario acepta esta Política de Privacidad y el tratamiento de sus datos conforme a lo aquí establecido.
                </p>

                <h2 className="mt-8 text-xl font-bold text-foreground">1. Información que Recopilamos</h2>
                
                <h3 className="mt-4 text-lg font-semibold text-foreground">A. Información personal</h3>
                <ul className="list-disc pl-6 text-muted-foreground">
                  <li>Nombre y apellido</li>
                  <li>Correo electrónico</li>
                  <li>Número de teléfono</li>
                  <li>Fecha de nacimiento</li>
                  <li>Información de perfil</li>
                  <li>Método de acceso (Google, Apple o email)</li>
                </ul>

                <h3 className="mt-4 text-lg font-semibold text-foreground">B. Información emocional y de bienestar</h3>
                <ul className="list-disc pl-6 text-muted-foreground">
                  <li>Conversaciones con EVA</li>
                  <li>Resúmenes emocionales generados por IA</li>
                  <li>Historial de sesiones</li>
                  <li>Preferencias terapéuticas</li>
                  <li>Evaluaciones y progreso emocional</li>
                </ul>

                <h3 className="mt-4 text-lg font-semibold text-foreground">C. Información profesional</h3>
                <p className="text-muted-foreground">Para psicólogos, coaches y psiquiatras:</p>
                <ul className="list-disc pl-6 text-muted-foreground">
                  <li>Matrícula profesional</li>
                  <li>Certificaciones</li>
                  <li>Especialidades</li>
                  <li>Video de presentación</li>
                  <li>Calendario y disponibilidad</li>
                </ul>

                <h2 className="mt-8 text-xl font-bold text-foreground">2. Uso de la Información</h2>
                <p className="text-muted-foreground">La información recopilada se utiliza para:</p>
                <ul className="list-disc pl-6 text-muted-foreground">
                  <li>Conectar usuarios con profesionales adecuados</li>
                  <li>Mejorar la experiencia personalizada dentro de Evivvo</li>
                  <li>Generar recomendaciones inteligentes mediante EVA</li>
                  <li>Mantener historial emocional y seguimiento terapéutico</li>
                  <li>Gestionar sesiones, pagos y suscripciones</li>
                  <li>Prevenir fraudes y actividades indebidas</li>
                  <li>Garantizar seguridad dentro de la plataforma</li>
                </ul>

                <h2 className="mt-8 text-xl font-bold text-foreground">3. Confidencialidad de las Sesiones</h2>
                <p className="text-muted-foreground">Las sesiones realizadas dentro de Evivvo son privadas y confidenciales.</p>
                <p className="font-medium text-foreground">Evivvo:</p>
                <ul className="list-disc pl-6 text-muted-foreground">
                  <li>No graba videollamadas</li>
                  <li>No comparte conversaciones privadas</li>
                  <li>No comercializa información emocional</li>
                  <li>No vende datos personales a terceros</li>
                </ul>

                <h2 className="mt-8 text-xl font-bold text-foreground">4. EVA y Resúmenes Emocionales</h2>
                <p className="text-muted-foreground">EVA funciona como un sistema de orientación emocional inteligente. La IA puede:</p>
                <ul className="list-disc pl-6 text-muted-foreground">
                  <li>Analizar mensajes</li>
                  <li>Detectar necesidades emocionales</li>
                  <li>Generar resúmenes terapéuticos</li>
                  <li>Recomendar profesionales compatibles</li>
                </ul>
                <p className="mt-4 rounded-lg bg-amber-50 p-4 text-amber-800">
                  <strong>Importante:</strong> EVA NO reemplaza terapia psicológica, atención psiquiátrica, emergencias médicas ni diagnósticos clínicos.
                </p>

                <h2 className="mt-8 text-xl font-bold text-foreground">5. Seguridad de los Datos</h2>
                <p className="text-muted-foreground">Evivvo implementa medidas de seguridad razonables para proteger la información:</p>
                <ul className="list-disc pl-6 text-muted-foreground">
                  <li>Encriptación de datos</li>
                  <li>Accesos protegidos</li>
                  <li>Protección de sesiones</li>
                  <li>Monitoreo de actividad sospechosa</li>
                  <li>Restricción de accesos administrativos</li>
                </ul>

                <h2 className="mt-8 text-xl font-bold text-foreground">6. Derechos del Usuario</h2>
                <p className="text-muted-foreground">El usuario podrá:</p>
                <ul className="list-disc pl-6 text-muted-foreground">
                  <li>Acceder a sus datos</li>
                  <li>Solicitar modificaciones</li>
                  <li>Solicitar eliminación</li>
                  <li>Descargar información</li>
                  <li>Limitar ciertos tratamientos</li>
                </ul>

                <h2 className="mt-8 text-xl font-bold text-foreground">7. Contacto</h2>
                <p className="text-muted-foreground">
                  Para consultas relacionadas con privacidad:
                </p>
                <p className="mt-2">
                  <a href="mailto:info@evivvo.app" className="text-primary hover:underline">
                    info@evivvo.app
                  </a>
                </p>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <Link href="/terminos-y-condiciones">
                <Button variant="outline">
                  Ver Términos y Condiciones
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
