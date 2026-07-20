import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Globe } from "lucide-react";
import { useAuth } from "./Auth/AuthContext";

type Language = "en" | "km";

const translations = {
  en: {
    features: "Features",
    pricing: "Pricing",
    solutions: "Business Solutions",
    about: "About Us",
    login: "Log In",
    tryFree: "Try for Free",
    language: "EN",
  },
  km: {
    features: "មុខងារប្រព័ន្ធ",
    pricing: "គម្រោងតម្លៃ",
    solutions: "ដំណោះស្រាយអាជីវកម្ម",
    about: "អំពីយើង",
    login: "ចូលប្រើប្រាស់",
    tryFree: "សាកល្បងឥតគិតថ្លៃ",
    language: "ខ្មែរ",
  },
};

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("km");

  const { openAuth } = useAuth();

  const currentLang = translations[language];

  const navLinks = [
    { name: currentLang.features, href: "#features" },
    { name: currentLang.pricing, href: "#pricing" },
    { name: currentLang.solutions, href: "#solutions" },
    { name: currentLang.about, href: "#about" },
  ];

  useEffect(() => {
    const savedLang = localStorage.getItem("preferredLanguage") as Language | null;

    if (savedLang === "en" || savedLang === "km") {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang: Language = language === "en" ? "km" : "en";

    setLanguage(newLang);
    localStorage.setItem("preferredLanguage", newLang);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 px-4 sm:px-6 lg:px-8 ${
        isScrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto bg-zinc-200/30 border border-slate-50/50 backdrop-blur-3xl shadow-lg p-3 rounded-2xl transition-all duration-300">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-full p-2 h-10 rounded-lg bg-brand flex items-center justify-center shadow-glow">
              <ShoppingBag className=" text-white"  />
            </div>

            <span className="font-display font-bold text-xl tracking-tight text-ink">
              Sellflow
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-md font-medium text-zinc-900 hover:text-brand transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-700 hover:text-ink hover:bg-white/60 rounded-lg transition-all border border-zinc-200"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wide">
                {currentLang.language}
              </span>
            </button>

            <button
              onClick={() => openAuth("login")}
              className="text-sm font-medium text-muted hover:text-ink transition-colors"
            >
              {currentLang.login}
            </button>

            <button
              onClick={() => openAuth("register")}
              className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-glow hover:shadow-none hover:scale-105 active:scale-95"
            >
              {currentLang.tryFree}
            </button>
          </div>
          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 py-2 text-zinc-700"
              aria-label="Toggle language"
            >
              <Globe className="w-5 h-5" />
              <span className="text-xs font-semibold">
                {currentLang.language}
              </span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="text-ink p-1 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute left-4 right-4 mt-2 md:hidden bg-white/95 border border-line shadow-xl rounded-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="px-5 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-base font-medium text-ink hover:text-brand transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}

              <div className="h-px bg-zinc-200 my-1" />

              <button
                onClick={toggleLanguage}
                className="flex items-center justify-between w-full text-base font-medium text-ink py-2"
              >
                <span>Language</span>
                <span className="flex items-center gap-2 text-brand">
                  <Globe className="w-4 h-4" />
                  {currentLang.language}
                </span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuth("login");
                }}
                className="w-full text-left text-base font-medium text-ink py-2"
              >
                {currentLang.login}
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuth("register");
                }}
                className="w-full bg-brand text-white px-4 py-3 rounded-lg text-base font-medium text-center shadow-glow active:scale-95 transition-all"
              >
                {currentLang.tryFree}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
