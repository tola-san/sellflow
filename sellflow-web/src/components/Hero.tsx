import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  QrCode,
} from "lucide-react";

// Import your dashboard mockup image
import dashboardMockup from "../assets/images/dashboard-hero.jpg"; // ← Adjust path if needed

export function Hero() {
  return (
    <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-zinc-50">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-300 via-white to-white" />
      
      <div className="absolute top-[-15%] right-[-10%] w-[700px] h-[700px] lg:w-[800px] lg:h-[800px] rounded-full bg-gradient-to-br from-violet-400/10 via-indigo-400/10 to-transparent blur-3xl" />
      <div className="absolute bottom-[-25%] left-[-10%] w-[600px] h-[600px] lg:w-[700px] lg:h-[700px] rounded-full bg-gradient-to-br from-emerald-400/8 via-cyan-400/8 to-transparent blur-3xl" />

      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top Content */}
        <div className="max-w-4xl mx-auto text-center mb-12 lg:mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/30 backdrop-blur-xl border border-zinc-100 text-zinc-700 text-sm font-medium mb-8 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            v2.0 — Now with AI Catalog Builder
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tighter text-zinc-900 leading-[1.05] mb-6">
            Beautiful digital menus.<br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-zinc-900 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Instant QR catalogs.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-600 leading-relaxed max-w-2xl mx-auto mb-10">
            Create stunning digital catalogs and menus for your restaurant, café, 
            retail shop, or hotel. Online ordering, real-time analytics, and effortless management.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md sm:max-w-none mx-auto px-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 
                         bg-gradient-to-r from-purple-600 to-violet-600 
                         hover:from-purple-700 hover:to-violet-700
                         text-white px-8 py-3.5 rounded-full
                         text-base font-semibold shadow-lg shadow-purple-500/40 
                         transition-all duration-300 active:scale-95"
            >
              Start Free — No Card Needed
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 
                         bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl 
                         hover:bg-white dark:hover:bg-zinc-800 
                         border border-zinc-200 dark:border-zinc-700 
                         px-7 py-3.5 rounded-full
                         text-base font-semibold text-zinc-800 dark:text-zinc-100 
                         transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              Watch 90-sec Demo
            </motion.button>
          </div>

          {/* Trust Bar */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/96?img=${i + 20}`}
                  alt={`Customer ${i}`}
                  className="w-9 h-9 rounded-full ring-2 ring-white object-cover"
                />
              ))}
            </div>
            <div className="text-center sm:text-left">
              <p className="font-medium text-zinc-700">Trusted by 12,000+ businesses</p>
              <p className="text-xs text-zinc-500">from Michelin-starred restaurants to local cafés</p>
            </div>
          </div>
        </div>

        {/* === REAL IMAGE DASHBOARD MOCKUP === */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative max-w-5xl mx-auto "
        >
          {/* Gradient Shadow */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-cyan-400 to-purple-600 blur-[50px] opacity-90  scale-[1] " />

          <div className="relative rounded-3xl overflow-hidden border border-zinc-100 ">
            <img
              src={dashboardMockup}
              alt="Sellflow Dashboard Preview"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Optional Floating Element */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="hidden lg:block absolute -right-20 top-16 bg-white/10 rounded-3xl border border-zinc-100 shadow-2xl p-5 w-72 backdrop-blur-xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm">Table 7 • Just now</div>
                <div className="text-emerald-600 text-sm">Order received</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}