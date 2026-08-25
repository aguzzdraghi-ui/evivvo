import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand con logo prominente */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/evivvo-logo.png"
                alt="Evivvo - Plataforma de Bienestar Emocional"
                width={200}
                height={58}
                className="h-14"
                style={{ width: 'auto' }}
              />
            </Link>
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              Plataforma de Bienestar Emocional
            </p>
            <p className="text-sm text-muted-foreground">
              Conectá con psicólogos y coaches certificados por videollamada. Agenda gratis o hablá en minutos.
            </p>
          </div>

          {/* Plataforma */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Plataforma</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#como-funciona"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link
                  href="/profesionales"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Profesionales
                </Link>
              </li>
              <li>
                <Link
                  href="/#planes"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Planes y precios
                </Link>
              </li>
            </ul>
          </div>

          {/* Para profesionales */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Para profesionales</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/profesionales/registro"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Quiero formar parte
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Acceso profesionales
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal y Soporte */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Legal y Soporte</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contacto"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  href="/terminos-y-condiciones"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-de-privacidad"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 rounded-lg bg-muted/50 p-4">
          <p className="text-center text-xs text-muted-foreground">
            <strong>Importante:</strong> Evivvo es una plataforma intermediaria que conecta usuarios con profesionales independientes. 
            No brindamos servicios médicos directamente. Si estás en crisis o emergencia, contactá a los servicios de emergencia locales.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Evivvo. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Hecho con cariño en Argentina
          </p>
        </div>
      </div>
    </footer>
  )
}
