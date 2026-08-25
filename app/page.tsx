import {
  Navbar,
  Hero,
  HeroBanners,
  AIExperience,
  FeaturedProfessionals,
  Differentials,
  HowItWorks,
  Pricing,
  Footer,
} from "@/src/components/landing"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroBanners />
        <Hero />
        <FeaturedProfessionals />
        <AIExperience />
        <Differentials />
        <HowItWorks />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}
