import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "./Auth/AuthContext";
import { BrandLogo } from "./ui/BrandLogo";

const navLinks = [
  { name: "Product", href: "#features" },
  { name: "How it works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

export function Navbar() {
  const { openAuth } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY >= 50);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const closeDesktopMenu = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", closeDesktopMenu);
    return () => window.removeEventListener("resize", closeDesktopMenu);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 border-b border-transparent px-5 py-3 sm:px-8"
    >
      <div
        className={`mx-auto flex h-12 max-w-5xl items-center justify-between px-0 transition-all duration-300 ${
          scrolled
            ? "rounded-xl border border-[#ece8f0] bg-white/95 px-3 shadow-[0_14px_35px_-28px_rgba(45,30,80,.5)] backdrop-blur-xl sm:px-4"
            : "bg-white/80 backdrop-blur-md"
        }`}
      >
        <Link to="/" className="transition hover:-translate-y-0.5" aria-label="SellFlow home"><BrandLogo /></Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-[11px] font-medium text-slate-600 transition hover:bg-[#f3edfa] hover:text-[#7543bd]"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <button onClick={() => openAuth("login")} className="rounded-md px-3 py-2 text-[11px] font-semibold text-slate-700 transition hover:bg-[#f6f3f9]">
            Sign in
          </button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openAuth("register")}
            className="group inline-flex h-9 items-center gap-2 rounded-md bg-[#7557e8] px-4 text-[11px] font-semibold text-white shadow-[0_8px_18px_-10px_rgba(78,51,166,.7)] transition hover:bg-[#6549d3]"
          >
            <span>Start trial</span><ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </motion.button>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
          className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 bg-white sm:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-[24px] border border-white/80 bg-white/90 p-4 shadow-2xl shadow-violet-200/50 backdrop-blur-2xl sm:hidden"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-violet-50">
                  {link.name}
                </a>
              ))}
            </nav>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
              <button onClick={() => { setMobileOpen(false); openAuth("login"); }} className="rounded-full border border-zinc-200 px-4 py-3 text-sm font-semibold">Sign in</button>
              <button onClick={() => { setMobileOpen(false); openAuth("register"); }} className="rounded-full bg-gradient-to-r from-[#7655df] via-[#8269e8] to-cyan-400 px-4 py-3 text-sm font-semibold text-white">Start trial</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
