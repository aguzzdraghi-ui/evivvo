export interface Professional {
  id: string
  name: string
  title: string
  specialties: string[]
  rating: number
  reviews: number
  price: number
  yearsExperience: number
  bio: string
  description: string
  availableNow: boolean
  nextAvailable: string
  image: string
  videoUrl?: string
  certification: string
}

export const specialtyFilters = [
  { id: "ansiedad", label: "Ansiedad" },
  { id: "depresion", label: "Depresión" },
  { id: "estres", label: "Estrés" },
  { id: "rupturas", label: "Rupturas amorosas" },
  { id: "duelo", label: "Duelo" },
  { id: "soledad", label: "Soledad" },
  { id: "pareja", label: "Terapia de pareja" },
  { id: "autoestima", label: "Autoestima" },
  { id: "crecimiento-personal", label: "Crecimiento personal" },
  { id: "insomnio", label: "Insomnio" },
] as const

export const professionals: Professional[] = [
  {
    id: "1",
    name: "Dra. María González",
    title: "Psicóloga Clínica",
    specialties: ["ansiedad", "estres", "crecimiento-personal"],
    rating: 4.9,
    reviews: 127,
    price: 18500,
    yearsExperience: 12,
    bio: "Especialista en terapia cognitivo-conductual con más de 12 años de experiencia.",
    description: "Mi enfoque terapéutico se centra en entender las raíces de tus preocupaciones y desarrollar herramientas prácticas que puedas usar en tu día a día.",
    availableNow: true,
    nextAvailable: "Disponible ahora",
    image: "/images/professionals/psicologa-1.jpg",
    certification: "Lic. en Psicología - UBA | M.N. 45678",
  },
  {
    id: "2",
    name: "Dr. Carlos Mendoza",
    title: "Psicólogo Clínico Senior",
    specialties: ["rupturas", "pareja", "duelo"],
    rating: 4.8,
    reviews: 98,
    price: 22000,
    yearsExperience: 18,
    bio: "Especializado en relaciones de pareja y superación de rupturas amorosas.",
    description: "Entiendo lo difícil que puede ser atravesar una ruptura. Mi objetivo es acompañarte en este proceso de sanación.",
    availableNow: false,
    nextAvailable: "Mañana 10:00",
    image: "/images/professionals/psicologo-2.jpg",
    certification: "Dr. en Psicología - UNAM | M.N. 23456",
  },
  {
    id: "3",
    name: "Lic. Ana Rodríguez",
    title: "Psicóloga Especialista en Ansiedad",
    specialties: ["ansiedad", "soledad", "insomnio"],
    rating: 4.9,
    reviews: 156,
    price: 16500,
    yearsExperience: 10,
    bio: "Experta en trastornos de ansiedad y manejo del estrés con enfoque humanista.",
    description: "La ansiedad puede sentirse abrumadora, pero no tienes que enfrentarla solo/a.",
    availableNow: true,
    nextAvailable: "Disponible ahora",
    image: "/images/professionals/psicologa-1.jpg",
    certification: "Lic. en Psicología - U. de Chile | M.N. 34521",
  },
  {
    id: "4",
    name: "Valentina Torres",
    title: "Coach de Vida y Bienestar",
    specialties: ["crecimiento-personal", "autoestima", "estres"],
    rating: 4.7,
    reviews: 84,
    price: 14999,
    yearsExperience: 6,
    bio: "Coach ejecutiva y de vida con amplia experiencia en desarrollo personal.",
    description: "Mi pasión es ayudar a las personas a descubrir su máximo potencial.",
    availableNow: true,
    nextAvailable: "Disponible ahora",
    image: "/images/professionals/coach-1.jpg",
    certification: "Coach Certificada ICF PCC",
  },
  {
    id: "5",
    name: "Dra. Laura Martínez",
    title: "Psicóloga de Parejas",
    specialties: ["pareja", "rupturas", "crecimiento-personal"],
    rating: 4.9,
    reviews: 112,
    price: 25000,
    yearsExperience: 14,
    bio: "Especialista en terapia de pareja con enfoque sistémico.",
    description: "Las relaciones son complejas y a veces necesitamos ayuda para navegarlas.",
    availableNow: true,
    nextAvailable: "Disponible ahora",
    image: "/images/professionals/psicologa-1.jpg",
    certification: "Dra. en Psicología Clínica - UCM",
  },
  {
    id: "6",
    name: "Martín Herrera",
    title: "Coach de Alto Rendimiento",
    specialties: ["estres", "crecimiento-personal", "autoestima"],
    rating: 4.8,
    reviews: 76,
    price: 17500,
    yearsExperience: 8,
    bio: "Coach especializado en alto rendimiento y mindfulness.",
    description: "Creo en el poder del momento presente para transformar nuestras vidas.",
    availableNow: false,
    nextAvailable: "Hoy 18:00",
    image: "/images/professionals/coach-2.jpg",
    certification: "Coach Certificado ICF | Instructor MBSR",
  },
  {
    id: "7",
    name: "Dra. Patricia Vega",
    title: "Psicóloga Clínica Senior",
    specialties: ["soledad", "depresion", "duelo"],
    rating: 5.0,
    reviews: 203,
    price: 28000,
    yearsExperience: 20,
    bio: "Más de 20 años de experiencia en psicoterapia individual.",
    description: "Mi compromiso es ofrecerte un espacio de escucha genuina y sin juicios.",
    availableNow: true,
    nextAvailable: "Disponible ahora",
    image: "/images/professionals/psicologa-1.jpg",
    certification: "Dra. en Psicología - UB | M.N. 12345",
  },
  {
    id: "8",
    name: "Federico López",
    title: "Coach de Desarrollo Personal",
    specialties: ["crecimiento-personal", "autoestima", "estres"],
    rating: 4.6,
    reviews: 58,
    price: 14999,
    yearsExperience: 4,
    bio: "Coach especializado en jóvenes profesionales y liderazgo.",
    description: "Si sientes que estás estancado, puedo ayudarte a encontrar claridad.",
    availableNow: true,
    nextAvailable: "Disponible ahora",
    image: "/images/professionals/coach-2.jpg",
    certification: "Coach Certificado CTI",
  },
]

export function getProfessionalById(id: string): Professional | undefined {
  return professionals.find((p) => p.id === id)
}

export function filterProfessionals(
  specialties: string[],
  availableNow: boolean
): Professional[] {
  return professionals.filter((p) => {
    const matchesSpecialty =
      specialties.length === 0 ||
      specialties.some((s) => p.specialties.includes(s))
    const matchesAvailability = !availableNow || p.availableNow
    return matchesSpecialty && matchesAvailability
  })
}
