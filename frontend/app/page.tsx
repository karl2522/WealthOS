'use client';

import Footer from "@/components/footer";
import CTASection from "@/components/landing-page/cta";
import FeaturesSection from "@/components/landing-page/features";
import HeroSection from "@/components/landing-page/hero";
import HowItWorksSection from "@/components/landing-page/how-it-works";
import Navbar from "@/components/landing-page/navbar";
import PhilosophySection from "@/components/landing-page/philosophy";
import TechnologySection from "@/components/landing-page/tech-stack";
import { useAuth } from "@/contexts/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WealthOSLanding() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  // Show nothing while checking auth to prevent flash
  if (loading) {
    return null;
  }

  // If user is logged in, they'll be redirected, so don't render
  if (user) {
    return null;
  }

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
