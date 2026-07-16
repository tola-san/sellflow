import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Check,
  Globe2,
  Package,
  Sparkles,
} from "lucide-react";

import dashboardMockup from "../assets/images/dashboard-hero.jpg";
import { HeroBackground } from "./ui/HeroBackground";

const trustPoints = ["Free forever plan", "No credit card", "Launch in minutes"];

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="home" className="relative isolate -mt-24 overflow-hidden bg-white pb-16 pt-40 sm:-mt-28 sm:pb-20 sm:pt-48 lg:-mt-32 lg:pb-28 lg:pt-56">
      <HeroBackground intensity="strong" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-violet-200/70 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-violet-700 shadow-sm shadow-violet-100/70 backdrop-blur-xl sm:text-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Built for modern Cambodian sellers
            <Sparkles className="h-3.5 w-3.5" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.05 }}
            className="mx-auto mt-6 max-w-4xl text-4xl font-semibold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl"
          >
            Turn your products into a
            <span className="relative ml-2 inline-block bg-gradient-to-r from-violet-700 via-purple-500 to-blue-500 bg-clip-text text-transparent sm:ml-3">
              beautiful store.
              <motion.span
                className="absolute -bottom-1 left-0 h-1 w-full origin-left rounded-full bg-gradient-to-r from-violet-500/60 to-blue-400/20"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.65 }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8"
          >
            Build a digital catalog, share one simple link, and let customers discover your products—while you manage everything from one dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.23 }}
            className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
          >
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-violet-700"
            >
              Start building for free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
            >
              Explore features
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
          >
            {trustPoints.map((point) => (
              <span key={point} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 sm:text-sm">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                {point}
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-14 max-w-5xl sm:mt-16 lg:mt-20"
        >
          <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-r from-violet-300/30 via-blue-200/30 to-fuchsia-200/30 blur-3xl" />

          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-[0_32px_90px_-28px_rgba(76,29,149,0.35)] sm:rounded-[1.75rem] sm:p-2">
            <div className="flex h-10 items-center border-b border-slate-100 px-3 sm:h-12 sm:px-4">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="mx-auto flex max-w-[15rem] items-center gap-2 rounded-md bg-slate-50 px-3 py-1 text-[10px] text-slate-400 sm:w-72 sm:max-w-none sm:text-xs">
                <Globe2 className="h-3 w-3" />
                sellflow.com/dashboard
              </div>
              <div className="w-10 sm:w-12" />
            </div>

            <div className="relative overflow-hidden rounded-b-xl sm:rounded-b-[1.25rem]">
              <img
                src={dashboardMockup}
                alt="SellFlow seller dashboard showing catalog analytics"
                className="h-auto w-full"
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/[0.035]" />
            </div>
          </div>

          <motion.div
            animate={reduceMotion ? undefined : { y: [-6, 7, -6] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-5 top-16 hidden items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-3.5 shadow-xl shadow-violet-200/30 backdrop-blur-xl md:flex lg:-left-12"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-700">
              <Package className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-slate-500">Active products</p>
              <p className="text-sm font-bold text-slate-900">126 products</p>
            </div>
          </motion.div>

          <motion.div
            animate={reduceMotion ? undefined : { y: [7, -6, 7] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-5 bottom-14 hidden items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-3.5 shadow-xl shadow-blue-200/30 backdrop-blur-xl md:flex lg:-right-12"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
              <BarChart3 className="h-5 w-5" />
            </span>
            <div>
              <p className="flex items-center gap-1 text-xs text-emerald-600">
                <BadgeCheck className="h-3.5 w-3.5" /> Store is live
              </p>
              <p className="text-sm font-bold text-slate-900">Ready to share</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
