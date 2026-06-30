// pages/LandingPage.tsx
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { TrustedBy } from "../components/TrustedBy";
import { Features } from "../components/Features";
import { DashboardPreview } from "../components/DashboardPreview";
import { HowItWorks } from "../components/HowItWorks";
import { Benefits } from "../components/Benefits";
import { Testimonials } from "../components/Testimonials";
import { Pricing } from "../components/Pricing";
import { CTA } from "../components/CTA";
import { FinalCTA } from "../components/FinalCTA";
import { Footer } from "../components/Footer";
import { AuthModal } from "../components/Auth/AuthModal";

export default function LandingPage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <DashboardPreview />
        <HowItWorks />
        <Benefits />
        <Testimonials />
        {/* <Pricing /> */}
        <FinalCTA />
        {/* <CTA /> */}
      </main>

      <Footer />

      <AuthModal />
    </>
  );
}
