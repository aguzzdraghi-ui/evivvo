"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { BottomNavigation } from "./bottom-navigation"
import { PlusPromoCard } from "@/src/components/plus"

interface AppWrapperProps {
  children: React.ReactNode
}

export function AppWrapper({ children }: AppWrapperProps) {
  const pathname = usePathname()
  const [isCapacitor, setIsCapacitor] = useState(false)
  const [platform, setPlatform] = useState<'ios' | 'android' | 'web'>('web')
  
  // Pages where we hide the mobile navigation (Plus has its own PlusMobileNavigation)
  const hideNavPages = ['/login', '/registro', '/admin', '/dashboard', '/plus']
  const shouldHideNav = hideNavPages.some(p => pathname.startsWith(p))
  
  // Show Plus promo on specific pages
  const promoPages = ['/', '/profesionales', '/mi-cuenta']
  const shouldShowPromo = promoPages.includes(pathname) && !pathname.startsWith('/planes') && !shouldHideNav

  useEffect(() => {
    // Detect if running in Capacitor native app
    const checkCapacitor = async () => {
      // Only run Capacitor-specific code when actually in a native app
      // The Capacitor object is only available when built with Capacitor
      const capacitorGlobal = (window as any).Capacitor
      
      if (typeof window !== 'undefined' && capacitorGlobal?.isNativePlatform?.()) {
        setIsCapacitor(true)
        const plt = capacitorGlobal.getPlatform()
        setPlatform(plt as 'ios' | 'android' | 'web')
        
        // Add platform class to body
        document.body.classList.add(`capacitor-${plt}`)
        
        // Capacitor plugins are only available in native builds
        // These will be loaded when the app is compiled with Capacitor
      }
    }

    checkCapacitor()
  }, [])

  return (
    <div className={`min-h-screen ${isCapacitor ? 'pt-safe' : ''}`}>
      {/* Status bar overlay for iOS */}
      {isCapacitor && platform === 'ios' && (
        <div className="status-bar-overlay" />
      )}
      
      {/* Main content with bottom navigation spacing */}
      <div className={shouldHideNav ? '' : 'has-bottom-nav'}>
        {children}
      </div>
      
      {/* Mobile sticky Plus promo - only on specific pages */}
      {shouldShowPromo && (
        <PlusPromoCard variant="sticky" />
      )}
      
      {/* Mobile bottom navigation - hidden on login/admin/dashboard */}
      {!shouldHideNav && <BottomNavigation />}
    </div>
  )
}
