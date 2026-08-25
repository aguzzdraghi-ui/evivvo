"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PublicProfessionalCard } from "./public-professional-card"
import type { PublicProfessional } from "@/src/lib/professionals/public-types"

interface ProfessionalsCarouselProps {
  professionals: PublicProfessional[]
  showArrows?: boolean
  className?: string
}

/**
 * Shared horizontal carousel used by both the professionals explorer and,
 * on mobile, the home featured section — one component, one query result,
 * no duplicated markup. Native scroll-snap gives touch/trackpad/mouse
 * dragging for free; arrow buttons and keyboard scroll cover the rest.
 */
export function ProfessionalsCarousel({ professionals, showArrows = true, className = "" }: ProfessionalsCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollBy = (direction: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>("[data-carousel-item]")
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.8
    el.scrollBy({ left: direction * step, behavior: "smooth" })
  }

  return (
    <div className={`relative ${className}`}>
      {showArrows && (
        <button
          type="button"
          aria-label="Ver profesionales anteriores"
          onClick={() => scrollBy(-1)}
          className="absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-md hover:bg-muted md:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      <div
        ref={scrollerRef}
        role="region"
        aria-label="Profesionales"
        tabIndex={0}
        className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 focus:outline-none"
      >
        {professionals.map((p) => (
          <div key={p.id} data-carousel-item className="w-[280px] shrink-0 snap-start sm:w-[300px]">
            <PublicProfessionalCard professional={p} />
          </div>
        ))}
      </div>

      {showArrows && (
        <button
          type="button"
          aria-label="Ver más profesionales"
          onClick={() => scrollBy(1)}
          className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-md hover:bg-muted md:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
