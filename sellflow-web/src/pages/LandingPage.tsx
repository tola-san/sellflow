// pages/LandingPage.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthModal } from "../components/Auth/AuthModal";
import { useAuth } from "../components/Auth/AuthContext";
import { Navbar } from "../components/Navbar";
import { ModernLanding } from "../components/ModernLanding";
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
      <main className="overflow-hidden">
        <ModernLanding />
      </main>
      <Footer />
      <AuthModal />
    </>
  );
}
