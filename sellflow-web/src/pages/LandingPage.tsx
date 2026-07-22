// pages/LandingPage.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthModal } from "../components/Auth/AuthModal";
import { useAuth } from "../components/Auth/AuthContext";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { TrustedBy } from "../components/TrustedBy";
import { Features } from "../components/Features";
import { DashboardPreview } from "../components/DashboardPreview";
import { HowItWorks } from "../components/HowItWorks";
import { Benefits } from "../components/Benefits";
import { Pricing } from "../components/Pricing";
import { FAQ } from "../components/FAQ";
import { FinalCTA } from "../components/FinalCTA";
import { Footer } from "../components/Footer";

export default function LandingPage() {
  const { openAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/register") {
      openAuth("register");
    }
  }, [location.pathname, openAuth]);

  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-white">
        <Hero />
        <TrustedBy />
        <Features />
        <DashboardPreview />
        <HowItWorks />
        <Benefits />
        <Pricing />
        <FAQ />

      </main>
      <Footer />
      <AuthModal />
    </>
  );
}
