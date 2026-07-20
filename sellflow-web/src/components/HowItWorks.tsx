import React from "react";
import { motion } from "framer-motion";
import {
  Store,
  PlusCircle,
  Share2,
  ShoppingBag,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

type Step = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  glow: string;
  accent: string;
};

/**
 * Orbiting particle: outer wrapper rotates around the icon's center
 * (transformOrigin 50% 50%), inner dot is offset from that center by
 * `radius` px. Rotating the wrapper is what makes the dot trace a
 * circle -- rotating the dot alone (the old approach) is invisible
 * because a symmetric dot spinning on its own center looks static.
 * Reserved for the large "signature" tile only -- keeping it off the
 * smaller tiles is what keeps the grid calm instead of busy.
 */
function OrbitParticle({
  radius,
  size = "h-1.5 w-1.5",
  duration,
  delay = 0,
}: {
  radius: number;
  size?: string;
  duration: number;
  delay?: number;
}) {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ transformOrigin: "50% 50%" }}
      animate={{ rotate: 360 }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
        delay,
      }}
    >
      <motion.div
        className={`absolute left-1/2 top-1/2 ${size} rounded-full bg-white/80`}
        style={{
          transform: `translate(-50%, -50%) translateX(${radius}px)`,
        }}
        animate={{
          scale: [0.6, 1, 0.6],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay * -0.6,
        }}
      />
    </motion.div>
  );
}

export function HowItWorks() {
  const steps: Step[] = [
    {
      number: "01",
      title: "Create Business",
      description:
        "Sign up and set up your online business profile in minutes -- your name, logo, and storefront link, ready to share.",
      icon: Store,
      gradient: "from-emerald-500 to-cyan-400",
      glow: "shadow-emerald-500/30",
      accent: "text-emerald-600",
    },
    {
      number: "02",
      title: "Add Products",
      description: "Upload images, add prices, and organize categories.",
      icon: PlusCircle,
      gradient: "from-violet-500 to-purple-500",
      glow: "shadow-violet-500/30",
      accent: "text-violet-600",
    },
    {
      number: "03",
      title: "Share Catalog",
      description: "Share your catalog link or QR code with customers.",
      icon: Share2,
      gradient: "from-amber-400 to-orange-500",
      glow: "shadow-orange-500/30",
      accent: "text-orange-600",
    },
    {
      number: "04",
      title: "Receive Orders",
      description:
        "Orders land straight in your dashboard the moment a customer checks out -- no missed messages, no manual tracking.",
      icon: ShoppingBag,
      gradient: "from-rose-400 to-pink-500",
      glow: "shadow-pink-500/30",
      accent: "text-pink-600",
    },
  ];

  const [step1, step2, step3, step4] = steps;

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-zinc-50 py-24">
      {/* Background glows */}
      <div className="pointer-events-none absolute left-1/4 top-20 h-72 w-72 rounded-full bg-violet-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-cyan-400/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-5 inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-600"
          >
            Simple workflow
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-semibold tracking-tighter text-zinc-900 md:text-5xl"
          >
            Start selling in four simple steps
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-600"
          >
            Build your catalog, share it with customers, and receive your first
            order in just a few minutes.
          </motion.p>
        </div>

        {/* Bento grid -- desktop / tablet */}
        <div className="hidden gap-6 sm:grid sm:grid-cols-12 sm:auto-rows-[minmax(0,1fr)]">
          {/* Tile 1: Create Business -- large signature tile, spans both rows */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            whileHover={{ y: -4 }}
            className="group relative col-span-7 row-span-2 overflow-hidden rounded-xl border border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur-xl md:p-10"
          >
            <div
              className={`pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br ${step1.gradient} opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-35`}
            />

            <div className="relative flex h-full flex-col justify-between">
              <div>
                <div className="mb-8 flex items-center justify-between">
                  <motion.div
                    whileHover={{ scale: 1.06 }}
                    transition={{ type: "spring", stiffness: 900, damping: 18 }}
                    className={`relative flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br ${step1.gradient} shadow-xl ${step1.glow}`}
                  >
                    <step1.icon className="h-8 w-8 text-white" />
                    <div className="absolute inset-0">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <OrbitParticle
                          key={i}
                          radius={44}
                          duration={4 + i * 1.2}
                          delay={i * -1.1}
                        />
                      ))}
                    </div>
                  </motion.div>

                  <span className="text-6xl font-bold tracking-tighter text-zinc-900/10">
                    {step1.number}
                  </span>
                </div>

                <h3 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
                  {step1.title}
                </h3>
                <p className="mt-4 max-w-md text-base leading-7 text-zinc-600">
                  {step1.description}
                </p>
              </div>

              <div className={`mt-8 inline-flex items-center gap-1.5 text-sm font-medium ${step1.accent}`}>
                Where every business starts
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </motion.div>

          {/* Tile 2: Add Products */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="group relative col-span-5 overflow-hidden rounded-xl border border-white/60 bg-white/70 p-7 shadow-xl backdrop-blur-xl"
          >
            <div
              className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${step2.gradient} opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-35`}
            />
            <div className="relative flex items-start justify-between">
              <motion.div
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 900, damping: 18 }}
                className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${step2.gradient} shadow-lg ${step2.glow}`}
              >
                <step2.icon className="h-6 w-6 text-white" />
              </motion.div>
              <span className="text-4xl font-bold tracking-tighter text-zinc-900/10">
                {step2.number}
              </span>
            </div>
            <h3 className="relative mt-6 text-xl font-semibold tracking-tight text-zinc-900">
              {step2.title}
            </h3>
            <p className="relative mt-2 text-sm leading-6 text-zinc-600">
              {step2.description}
            </p>
          </motion.div>

          {/* Tile 3: Share Catalog */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="group relative col-span-5 overflow-hidden rounded-xl border border-white/60 bg-white/70 p-7 shadow-xl backdrop-blur-xl"
          >
            <div
              className={`pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-gradient-to-br ${step3.gradient} opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-35`}
            />
            <div className="relative flex items-start justify-between">
              <motion.div
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 900, damping: 18 }}
                className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${step3.gradient} shadow-lg ${step3.glow}`}
              >
                <step3.icon className="h-6 w-6 text-white" />
              </motion.div>
              <span className="text-4xl font-bold tracking-tighter text-zinc-900/10">
                {step3.number}
              </span>
            </div>
            <h3 className="relative mt-6 text-xl font-semibold tracking-tight text-zinc-900">
              {step3.title}
            </h3>
            <p className="relative mt-2 text-sm leading-6 text-zinc-600">
              {step3.description}
            </p>
          </motion.div>

          {/* Tile 4: Receive Orders -- wide banner, the payoff step */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.3 }}
            whileHover={{ y: -4 }}
            className="group relative col-span-12 overflow-hidden rounded-xl border border-white/60 bg-white/70 p-7 shadow-xl backdrop-blur-xl md:p-8"
          >
            <div
              className={`pointer-events-none absolute -left-16 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-gradient-to-br ${step4.gradient} opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-35`}
            />
            <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-6">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 900, damping: 18 }}
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${step4.gradient} shadow-lg ${step4.glow}`}
                >
                  <step4.icon className="h-7 w-7 text-white" />
                </motion.div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                    Step {step4.number}
                  </span>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900 md:text-2xl">
                    {step4.title}
                  </h3>
                </div>
              </div>
              <p className="max-w-md text-sm leading-6 text-zinc-600 md:text-right">
                {step4.description}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Mobile workflow -- stacked glass cards */}
        <div className="space-y-5 sm:hidden">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative overflow-hidden rounded-xl border border-white/60 bg-white/70 p-6 shadow-lg backdrop-blur-xl"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${step.gradient} shadow-lg ${step.glow}`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
                      Step {step.number}
                    </span>
                    <h3 className="mt-1 text-lg font-semibold text-zinc-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
