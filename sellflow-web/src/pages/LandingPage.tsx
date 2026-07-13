// pages/LandingPage.tsx
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { TrustedBy } from "../components/TrustedBy";
import { Features } from "../components/Features";
import { DashboardPreview } from "../components/DashboardPreview";
import { HowItWorks } from "../components/HowItWorks";
import { Benefits } from "../components/Benefits"; 
import { FinalCTA } from "../components/FinalCTA";
import { Footer } from "../components/Footer";
import {Pricing} from "../components/Pricing";
import { FAQ } from "../components/FAQ";
import { AuthModal } from "../components/Auth/AuthModal";

export default function LandingPage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Features />
        <DashboardPreview />
        <HowItWorks />
        <Pricing />
        <FAQ />
      </main>

      <Footer />

      <AuthModal />
    </>
  );
}
