import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Heart,
  Mail,
  Send,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

const footerGroups = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "How it works", href: "#how-it-works" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Seller dashboard", href: "/dashboard" },
      { label: "Create an account", href: "/register" },
      { label: "API documentation", href: "#" },
      { label: "System status", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "mailto:tolasan369369@gmail.com" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-slate-900 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.65) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.65) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "linear-gradient(to bottom, black, transparent 78%)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent 78%)",
          }}
          animate={{ backgroundPosition: ["0px 0px", "48px 48px"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute -left-32 -top-36 h-80 w-80 rounded-xl bg-violet-600/25 blur-[100px]"
          animate={{ x: [0, 70, 0], y: [0, 35, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute -right-24 top-20 h-72 w-72 rounded-xl bg-blue-500/20 blur-[110px]"
          animate={{ x: [0, -50, 0], y: [0, -25, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-5 sm:px-6 sm:pb-10 lg:px-8">
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.055] px-5 py-8 shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-8 sm:py-10 lg:px-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(139,92,246,0.18),transparent_35%)]" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-200">
                <Sparkles className="h-3.5 w-3.5" />
                Start selling in minutes
              </span>

              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
                Your storefront is closer than you think.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Create a beautiful catalog, share one simple link, and manage your business from a single dashboard.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-violet-50"
              >
                Start for free
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <a
                href="https://t.me/tolasannn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.08]"
              >
                <Send className="h-4 w-4" />
                Talk to us
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-12 px-1 pb-12 pt-14 md:grid-cols-[1.25fr_2fr] lg:gap-20 lg:pt-16">
          <div>
            <Link to="/" className="inline-flex items-center gap-3" aria-label="SellFlow home">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 shadow-lg shadow-violet-950/40">
                <ShoppingBag className="h-5 w-5" />
              </span>
              <span className="text-xl font-semibold tracking-tight">SellFlow</span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              The simple commerce platform for Cambodian sellers to launch, share, and grow an online storefront.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              <a
                href="mailto:tolasan369369@gmail.com"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-400/10 hover:text-white"
              >
                <Mail className="h-3.5 w-3.5" />
                Email us
              </a>
              <a
                href="https://t.me/tolasannn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-white"
              >
                <Send className="h-3.5 w-3.5" />
                Telegram
              </a>
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3" aria-label="Footer navigation">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {group.title}
                </h3>
                <ul className="mt-5 space-y-3.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("/") ? (
                        <Link className="text-sm text-slate-400 transition hover:text-white" to={link.href}>
                          {link.label}
                        </Link>
                      ) : (
                        <a className="text-sm text-slate-400 transition hover:text-white" href={link.href}>
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 px-1 pt-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SellFlow. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="h-3.5 w-3.5 fill-violet-400 text-violet-400" /> for modern businesses in Cambodia.
          </p>
        </div>
      </div>
    </footer>
  );
}
