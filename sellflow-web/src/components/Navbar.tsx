import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useAuth } from "./Auth/AuthContext";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openAuth } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "មុខងារប្រព័ន្ធ", href: "#features" },
    { name: "គម្រោងតម្លៃ", href: "#pricing" },
    { name: "ដំណោះស្រាយអាជីវកម្ម", href: "#solutions" },
    { name: "អំពីយើង", href: "#about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 ${
        isScrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto glass bg-zinc-200/30 border border-slate-50/50 backdrop-blur-3xl shadow-lg p-3 rounded-2xl transition-all duration-300">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-brand flex items-center justify-center shadow-glow">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-ink">
              SellFlow
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-zinc-900 hover:text-brand transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions (SaaS Style) */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => openAuth("login")}
              className="text-sm font-medium text-muted hover:text-ink transition-colors"
            >
              ចូលប្រើប្រាស់
            </button>
            <button
              onClick={() => openAuth("register")}
              className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-glow hover:shadow-none hover:scale-105 active:scale-95"
            >
              សាកល្បងឥតគិតថ្លៃ
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-ink p-1 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-4 right-4 mt-2 md:hidden glass bg-white/95 border border-line shadow-xl rounded-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="px-5 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-base font-medium text-ink hover:text-brand transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              
              <div className="h-px bg-zinc-200 my-1" />
              
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuth("login");
                }}
                className="w-full text-left text-base font-medium text-ink py-2"
              >
                ចូលប្រើប្រាស់
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuth("register");
                }}
                className="w-full bg-brand text-white px-4 py-3 rounded-xl text-base font-medium text-center shadow-glow active:scale-98 transition-all"
              >
                សាកល្បងឥតគិតថ្លៃ
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}