import {
  Navbar,
  Matching,
  Differentials,
  HowItWorks,
  Pricing,
  Footer,
} from "@/src/components/landing"
import { HomeHero } from "@/src/components/home/home-hero"
import { FeaturedProfessionalsInline } from "@/src/components/home/featured-professionals-inline"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HomeHero />
        <FeaturedProfessionalsInline />
        <Matching />
        <Differentials />
        <HowItWorks />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}
