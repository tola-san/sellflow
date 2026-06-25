import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustedBy } from './components/TrustedBy';
import { Features } from './components/Features';
import { DashboardPreview } from './components/DashboardPreview';
import { HowItWorks } from './components/HowItWorks';
import { Benefits } from './components/Benefits';
import { Testimonials } from './components/Testimonials';
import { OpenSource } from './components/OpenSource';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { AuthProvider } from './components/auth/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
export function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white text-ink transition-colors duration-300 selection:bg-brand/30">
        <Navbar />
        <main>
          <Hero />
          <TrustedBy />
          <Features />
          <DashboardPreview />
          <HowItWorks />
          <Benefits />
          <Testimonials />
          <OpenSource />
          <CTA />
        </main>
        <Footer />
        <AuthModal />
      </div>
    </AuthProvider>);

}