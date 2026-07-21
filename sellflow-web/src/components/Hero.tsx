import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { HeroBackground } from "./ui/HeroBackground";
import { DotField } from "./ui/DotField";

const trustPoints = ["Free forever plan", "No credit card", "Launch in minutes"];

export function Hero() {
  return (
    <section id="home" className="relative isolate -mt-24 overflow-hidden bg-white pb-14 pt-36 sm:-mt-28 sm:pb-20 sm:pt-44 lg:-mt-32 lg:min-h-[850px] lg:pb-24 lg:pt-48">
      <HeroBackground intensity="strong" />
      <DotField className="z-0 [mask-image:linear-gradient(to_bottom,black_10%,black_72%,transparent_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-4 px-4 sm:px-6 lg:grid-cols-[.95fr_1.05fr] lg:gap-8 lg:px-8">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-white/85 px-3.5 py-1.5 text-xs font-semibold text-violet-700 shadow-sm backdrop-blur-xl sm:text-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Built for modern online businesses
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.05 }}
            className="mt-6 text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-[4rem]"
          >
            Turn Your Social Audience
            <span className="block bg-gradient-to-r from-violet-700 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
              Into Real Sales
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14 }}
            className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 lg:mx-0"
          >
            Launch a professional online storefront, showcase your products,
            accept customer orders, and manage your sales from one simple
            platform.
            <span className="mt-2 block">
              No coding or complicated setup. Share your Sellflow store on
              Facebook, Telegram, TikTok, or anywhere your customers shop.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start"
          >
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-violet-700"
            >
              Create your free store
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-violet-200 hover:text-violet-700"
            >
              See how Sellflow works
              <ChevronRight className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start"
          >
            {trustPoints.map((point) => (
              <span
                key={point}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 sm:text-sm"
              >
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                {point}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 hidden items-center gap-3 text-xs font-medium text-slate-400 lg:flex"
          >
            <Bot className="h-4 w-4 text-violet-500" />
            Automate orders and notifications while staying connected with your
            customers.
          </motion.div>
</div>

        <div className="h-[340px] sm:h-[430px] lg:h-[510px]" aria-hidden="true" />
      </div>
    </section>
  );
}
