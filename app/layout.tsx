import type { Metadata, Viewport } from 'next'
import { Nunito_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/src/lib/auth-context'
import { AppWrapper } from '@/src/components/mobile'
import './globals.css'

const nunitoSans = Nunito_Sans({ 
  subsets: ['latin'],
  variable: '--font-nunito-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Evivvo | Bienestar emocional a tu alcance',
  description: 'Conecta con psicólogos y coaches certificados por videollamada. Tu bienestar emocional es nuestra prioridad.',
  keywords: ['psicología', 'terapia online', 'bienestar emocional', 'coaching', 'salud mental', 'videollamada'],
  authors: [{ name: 'Evivvo' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Evivvo',
  },
  formatDetection: {
    telephone: true,
    email: true,
  },
  openGraph: {
    title: 'Evivvo | Bienestar emocional a tu alcance',
    description: 'Conecta con psicólogos y coaches certificados por videollamada.',
    type: 'website',
    locale: 'es_AR',
    siteName: 'Evivvo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Evivvo | Bienestar emocional a tu alcance',
    description: 'Conecta con psicólogos y coaches certificados por videollamada.',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'msapplication-TileColor': '#4F7BF7',
    'msapplication-tap-highlight': 'no',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFBFF' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-visual',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${nunitoSans.variable} bg-background`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* PWA & Mobile App Meta Tags */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-152x152.png" />
        
        {/* Splash Screens for iOS */}
        <link 
          rel="apple-touch-startup-image" 
          href="/splash/splash-portrait.png"
          media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link 
          rel="apple-touch-startup-image" 
          href="/splash/splash-portrait.png"
          media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link 
          rel="apple-touch-startup-image" 
          href="/splash/splash-portrait.png"
          media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link 
          rel="apple-touch-startup-image" 
          href="/splash/splash-portrait.png"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased min-h-screen overscroll-none">
        <AuthProvider>
          <AppWrapper>
            {children}
          </AppWrapper>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
