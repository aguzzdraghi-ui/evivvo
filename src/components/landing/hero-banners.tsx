"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Sparkles, Shield, Video, TrendingUp } from "lucide-react"

const banners = [
  {
    id: 1,
    title: "Tu bienestar emocional comienza aqui",
    cta: "Hablar con EVA",
    ctaLink: "#eva-chat",
    icon: Sparkles,
    gradient: "from-primary to-emerald-600",
  },
  {
    id: 2,
    title: "Profesionales verificados y disponibles",
    cta: "Ver profesionales",
    ctaLink: "/profesionales",
    icon: Shield,
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    id: 3,
    title: "Sesiones online seguras y flexibles",
    cta: "Agendar sesion",
    ctaLink: "/profesionales?disponible=true",
    icon: Video,
    gradient: "from-violet-600 to-pink-500",
  },
  {
    id: 4,
    title: "Seguimiento emocional con Evivvo Plus",
    cta: "Conocer Plus",
    ctaLink: "/plus",
    icon: TrendingUp,
    gradient: "from-amber-500 to-rose-500",
  },
]

export function HeroBanners() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(nextSlide, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  const currentBanner = banners[currentIndex]
  const IconComponent = currentBanner.icon

  return (
    <section className="relative w-full overflow-hidden">
      {/* Compact Banner - Mobile: ~120px, Desktop: ~100px */}
      <div 
        className={`relative py-4 md:py-3 bg-gradient-to-r ${currentBanner.gradient} transition-all duration-500`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left Arrow - Hidden on mobile */}
            <button
              onClick={() => { prevSlide(); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 10000); }}
              className="hidden sm:flex w-8 h-8 rounded-full bg-white/20 items-center justify-center text-white hover:bg-white/30 transition-colors shrink-0"
              aria-label="Banner anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center gap-3 md:gap-4 text-white min-w-0">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              
              <h2 className="text-sm md:text-base lg:text-lg font-semibold truncate">
                {currentBanner.title}
              </h2>
              
              <Link href={currentBanner.ctaLink} className="shrink-0">
                <Button 
                  size="sm"
                  className="bg-white text-primary hover:bg-white/90 font-semibold text-xs md:text-sm px-3 md:px-4 h-8 md:h-9"
                >
                  {currentBanner.cta}
                </Button>
              </Link>
            </div>

            {/* Right Arrow - Hidden on mobile */}
            <button
              onClick={() => { nextSlide(); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 10000); }}
              className="hidden sm:flex w-8 h-8 rounded-full bg-white/20 items-center justify-center text-white hover:bg-white/30 transition-colors shrink-0"
              aria-label="Siguiente banner"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Dots Navigation - Compact */}
          <div className="flex items-center justify-center gap-2 mt-3">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-5 h-1.5 rounded-full bg-white' 
                    : 'w-1.5 h-1.5 rounded-full bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Ir al banner ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
