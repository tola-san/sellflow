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
    {
      name: "Features",
      href: "#features",
    },
    {
      name: "Pricing",
      href: "#demo",
    },
    {
      name: "Contact",
      href: "#docs",
    },
    {
      name: "About",
      href: "#github",
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-0  " : "bg-transparent py-4  "}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 glass bg-zinc-200/30  border-b border-slate-50  backdrop-blur-3xl shadow-lg p-2 rounded-xl">
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
                className="text-lg font-medium text-zinc-900 hover:text-brand transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => openAuth("login")}
              className="text-sm font-medium text-muted hover:text-ink transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => openAuth("register")}
              className="bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-glow hover:shadow-none hover:scale-105 active:scale-95"
            >
              Register
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-ink"
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="md:hidden glass bg-white/50 border-b border-line overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-base font-medium text-ink"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-line my-2" />
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuth("login");
                }}
                className="w-full text-left text-base font-medium text-ink"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAuth("register");
                }}
                className="w-full bg-brand text-white px-4 py-3 rounded-xl text-base font-medium text-center"
              >
                Register
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
