import Footer from "@/components/footer"
import CTASection from "@/components/landing-page/cta"
import FeaturesSection from "@/components/landing-page/features"
import HeroSection from "@/components/landing-page/hero"
import HowItWorksSection from "@/components/landing-page/how-it-works"
import Navbar from "@/components/landing-page/navbar"
import PhilosophySection from "@/components/landing-page/philosophy"
import TechnologySection from "@/components/landing-page/tech-stack"

export default function WealthOSLanding() {
  return (
    <main className="snap-container">
      <Navbar />
      <HeroSection />
      <PhilosophySection />
      <FeaturesSection />
      <HowItWorksSection />
      <TechnologySection />
      <CTASection />
      <Footer />
    </main>
  )
}
