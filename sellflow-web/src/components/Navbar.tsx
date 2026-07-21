import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useAuth } from "./Auth/AuthContext";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { openAuth } = useAuth();

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Business Solutions", href: "#solutions" },
    { name: "About Us", href: "#about" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation variants for hamburger icon
  const menuIconVariants = {
    closed: { rotate: 0 },
    open: { rotate: 90 },
  };

  // Animation variants for mobile menu items
  const menuItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
      },
    }),
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
              <ShoppingBag className="text-white" />
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
              onClick={() => openAuth("login")}
              className="text-sm font-medium text-muted hover:text-ink transition-colors"
            >
              Log In
            </button>

            <button
              onClick={() => openAuth("register")}
              className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-glow hover:shadow-none hover:scale-105 active:scale-95"
            >
              Try for Free
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/60 transition-colors"
            aria-label="Toggle menu"
          >
            <motion.div
              animate={isMobileMenuOpen ? "open" : "closed"}
              variants={menuIconVariants}
              transition={{ duration: 0.2 }}
              className="absolute"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-ink" />
              ) : (
                <Menu className="w-6 h-6 text-ink" />
              )}
            </motion.div>
          </button>
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
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={menuItemVariants}
                  className="text-base font-medium text-ink hover:text-brand transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </motion.a>
              ))}

              <div className="h-px bg-zinc-200 my-1" />

              <motion.button
                custom={4}
                initial="hidden"
                animate="visible"
                variants={menuItemVariants}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuth("login");
                }}
                className="w-full text-left text-base font-medium text-ink py-2"
              >
                Log In
              </motion.button>

              <motion.button
                custom={5}
                initial="hidden"
                animate="visible"
                variants={menuItemVariants}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuth("register");
                }}
                className="w-full bg-brand text-white px-4 py-3 rounded-lg text-base font-medium text-center shadow-glow active:scale-95 transition-all"
              >
                Try for Free
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}