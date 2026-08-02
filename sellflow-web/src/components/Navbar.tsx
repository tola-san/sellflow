import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "./Auth/AuthContext";
import { BrandLogo } from "./ui/BrandLogo";

const navLinks = [
  { name: "Features", href: "#features" },
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
      className="fixed inset-x-0 top-2 z-50 px-5 py-3 sm:top-5"
    >
      <div
        className={`mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full px-3 transition-all duration-500 sm:px-4 ${
          scrolled
            ? "border border-white bg-white/90 shadow-[0_16px_45px_-22px_rgba(45,30,110,.45)] backdrop-blur-2xl"
            : "border border-white/50 bg-white/90 shadow-[0_12px_35px_-24px_rgba(32,22,90,.5)] backdrop-blur-xl"
        }`}
      >
        <Link to="/" className="transition hover:-translate-y-0.5" aria-label="SellFlow home"><BrandLogo /></Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-xs font-medium text-slate-600 transition hover:bg-[#f3edfa] hover:text-[#7543bd]"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <button onClick={() => openAuth("login")} className="rounded-full px-4 border border-slate-200 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white">
            Sign in
          </button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openAuth("register")}
            className="group relative inline-flex h-10 items-center overflow-hidden rounded-full bg-gradient-to-r from-[#7655df] via-[#8269e8] to-cyan-400 py-1 pl-4 pr-11 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition-all duration-500 hover:pl-11 hover:pr-4"
          >
            <span className="relative z-10">Start free</span>
            <span className="absolute right-1 grid h-8 w-8 place-items-center rounded-full bg-white text-slate-950 transition-all duration-500 group-hover:right-[calc(100%-36px)] group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </motion.button>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white/80 sm:hidden"
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
              <button onClick={() => { setMobileOpen(false); openAuth("register"); }} className="rounded-full bg-gradient-to-r from-[#7655df] via-[#8269e8] to-cyan-400 px-4 py-3 text-sm font-semibold text-white">Start free</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
