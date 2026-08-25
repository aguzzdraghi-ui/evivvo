"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Clock, Video, Calendar, Play, Volume2, VolumeX, Shield, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Professional as StoreProfessional } from "@/src/lib/store"
import type { Professional as DataProfessional } from "@/src/data/professionals"

// Aceptar ambos tipos de professional (del store o de data)
type AnyProfessional = StoreProfessional | DataProfessional

interface ProfessionalCardProps {
  professional: AnyProfessional
  index?: number
}

// Helpers para normalizar campos entre los dos tipos
function getName(p: AnyProfessional): string {
  if ('nombre' in p && 'apellido' in p) {
    return `${p.nombre} ${p.apellido}`
  }
  return (p as DataProfessional).name
}

function getTitle(p: AnyProfessional): string {
  if ('tipo' in p) {
    const tipoMap: Record<string, string> = {
      psicologo: 'Psicólogo/a',
      coach: 'Coach',
      terapeuta: 'Terapeuta',
      psiquiatra: 'Psiquiatra',
    }
    return tipoMap[p.tipo] || p.tipo
  }
  return (p as DataProfessional).title
}

function getImage(p: AnyProfessional): string {
  if ('foto' in p) return p.foto
  return (p as DataProfessional).image
}

function getSpecialties(p: AnyProfessional): string[] {
  if ('especialidades' in p) return p.especialidades
  return (p as DataProfessional).specialties
}

function getPrice(p: AnyProfessional): number {
  if ('precio' in p) return p.precio
  return (p as DataProfessional).price
}

function getRating(p: AnyProfessional): number {
  return p.rating
}

function getReviews(p: AnyProfessional): number {
  if ('reviewCount' in p) return p.reviewCount
  return (p as DataProfessional).reviews
}

function isAvailable(p: AnyProfessional): boolean {
  if ('estadoOnline' in p) return p.estadoOnline
  return (p as DataProfessional).availableNow
}

function getVerificationBadge(p: AnyProfessional, index: number) {
  // Si tiene badge del store, usarlo
  if ('badge' in p && p.badge !== 'ninguno') {
    const badgeMap: Record<string, { label: string; className: string; icon: typeof Award }> = {
      verificado: { label: "Verificado", className: "badge-gold", icon: Shield },
      destacado: { label: "Destacado", className: "badge-platinum", icon: Award },
      premium: { label: "Premium", className: "badge-platinum", icon: Award },
      top: { label: "Top Profesional", className: "badge-platinum", icon: Award },
    }
    return badgeMap[p.badge] || { label: "Verificado", className: "badge-gold", icon: Shield }
  }

  const title = getTitle(p)
  // First 3 professionals get Platinum
  if (index < 3) {
    return { label: "Certificado Evivvo Platinum", className: "badge-platinum", icon: Award }
  }
  // Coaches get blue badge
  if (title.toLowerCase().includes("coach")) {
    return { label: "Coach Verificado", className: "badge-coach", icon: Shield }
  }
  // Others get Gold
  return { label: "Verificado Evivvo Gold", className: "badge-gold", icon: Shield }
}

export function ProfessionalCard({ professional, index = 0 }: ProfessionalCardProps) {
  const [isMuted, setIsMuted] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  
  // Normalizar datos
  const name = getName(professional)
  const title = getTitle(professional)
  const image = getImage(professional)
  const specialties = getSpecialties(professional)
  const price = getPrice(professional)
  const rating = getRating(professional)
  const reviews = getReviews(professional)
  const available = isAvailable(professional)
  
  const badge = getVerificationBadge(professional, index)
  const BadgeIcon = badge.icon

  return (
    <div 
      className="group relative video-card-vertical transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video/Image Background */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={name}
          fill
          className={`object-cover transition-all duration-700 ${
            isHovered ? "scale-105 brightness-75" : "scale-100 brightness-90"
          }`}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="video-card-overlay absolute inset-0" />

      {/* Animated shimmer effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 animate-shimmer opacity-20" />
      )}

      {/* Top Section */}
      <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-4">
        {/* Verification Badge */}
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${badge.className}`}>
          <BadgeIcon className="h-3.5 w-3.5" />
          <span>{badge.label}</span>
        </div>

        {/* Available Now */}
        {available && (
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-emerald-500/30">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            EN VIVO
          </div>
        )}
      </div>

      {/* Center Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className={`flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 ${
            isHovered ? "scale-110 bg-white/30" : "scale-100"
          }`}
        >
          <Play className="h-10 w-10 fill-white text-white ml-1" />
        </div>
      </div>

      {/* Sound Toggle (simulated) */}
      <button 
        onClick={(e) => {
          e.preventDefault()
          setIsMuted(!isMuted)
        }}
        className="absolute right-4 top-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/60"
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {/* Subtitle simulation */}
        <div className="mb-4 rounded-lg bg-black/60 px-3 py-2 backdrop-blur-sm">
          <p className="text-sm text-white/90 italic">
            &quot;Te ayudo a encontrar tu equilibrio emocional...&quot;
          </p>
        </div>

        {/* Professional Info */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">
            {name}
          </h3>
          <p className="text-white/80">{title}</p>
        </div>

        {/* Rating & Stats */}
        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-1 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-sm">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-white">{rating}</span>
            <span className="text-sm text-white/60">({reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-white/80">
            <Clock className="h-4 w-4" />
            <span className="text-sm">40 min</span>
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-5 flex flex-wrap gap-1.5">
          {specialties.slice(0, 3).map((specialty) => (
            <span
              key={specialty}
              className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm capitalize"
            >
              {specialty.replace("-", " ")}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="mb-4 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-white">
            ${price.toLocaleString("es-AR")}
          </span>
          <span className="text-white/60">/sesión</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            asChild 
            className="flex-1 border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
          >
            <Link href={`/profesionales/${professional.id}`}>Ver perfil</Link>
          </Button>
          {available ? (
            <Button 
              asChild 
              className="flex-1 gap-1.5 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600"
            >
              <Link href={`/profesionales/${professional.id}#hablar`}>
                <Video className="h-4 w-4" />
                Hablar ahora
              </Link>
            </Button>
          ) : (
            <Button 
              asChild 
              className="flex-1 gap-1.5 bg-white text-foreground hover:bg-white/90"
            >
              <Link href={`/profesionales/${professional.id}#reservar`}>
                <Calendar className="h-4 w-4" />
                Agendar
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
