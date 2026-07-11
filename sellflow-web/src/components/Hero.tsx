import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, TrendingUp, Users, Star } from "lucide-react";

import dashboardMockup from "../assets/images/dashboard-hero.jpg";
import { useAuth } from "./Auth/AuthContext";

// Customizable Connection Grid
function ConnectionGrid() {
  const config = {
    width: 1500,
    height: 1500,
    gridSize: 30,
    lineOpacity: 0.1,
    primaryColor: "#8b5cf6",
    accentColor: "#22d3ee",
    glowStd: 5,
  };

  const nodes = [
    [100, 200],
    [400, 200],
    [400, 400],
    [800, 400],
    [800, 600],
    [1100, 600],
    [900, 100],
    [600, 300],
    [200, 500],
    [300, 650],
    [700, 150],
    [1050, 350],
  ];

  const paths = [
    // Facebook -> Dashboard
    {
      d: "M 120 220 L 350 220 L 520 380 L 700 380",
      duration: 6,
      delay: 0,
    },

    // Telegram -> Dashboard
    {
      d: "M 150 450 L 350 450 L 520 380 L 700 380",
      duration: 7,
      delay: 1,
    },

    // AI -> Dashboard
    {
      d: "M 700 120 L 700 220 L 700 380",
      duration: 5,
      delay: 2,
    },

    // Cloud -> Dashboard
    {
      d: "M 520 180 L 620 220 L 700 380",
      duration: 6,
      delay: 3,
    },

    // Analytics -> Dashboard
    {
      d: "M 900 180 L 800 240 L 700 380",
      duration: 6,
      delay: 4,
    },

    // Dashboard -> QR
    {
      d: "M 700 380 L 900 380 L 1100 300 L 1220 220",
      duration: 8,
      delay: 1,
    },

    // Dashboard -> Catalog
    {
      d: "M 700 380 L 900 380 L 1180 380",
      duration: 7,
      delay: 2,
    },

    // Dashboard -> Payment
    {
      d: "M 700 380 L 900 450 L 1100 520 L 1220 560",
      duration: 8,
      delay: 3,
    },

    // Dashboard -> Customer
    {
      d: "M 700 380 L 700 500 L 700 620",
      duration: 6,
      delay: 4,
    },

    // API -> Dashboard
    {
      d: "M 520 380 L 700 380",
      duration: 4,
      delay: 2,
    },

    // Dashboard -> Orders
    {
      d: "M 700 380 L 900 380",
      duration: 4,
      delay: 3,
    },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${config.width} ${config.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={config.glowStd} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={config.primaryColor} stopOpacity="0" />
            <stop offset="90%" stopColor={config.accentColor} stopOpacity="1" />
            <stop
              offset="100%"
              stopColor={config.primaryColor}
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {/* Grid Lines */}
        {Array.from({
          length: Math.floor(config.width / config.gridSize) + 1,
        }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={i * config.gridSize}
            y1="0"
            x2={i * config.gridSize}
            y2={config.height}
            stroke="#2b2b92"
            strokeWidth="2"
            opacity={config.lineOpacity}
          />
        ))}

        {Array.from({
          length: Math.floor(config.height / config.gridSize) + 1,
        }).map((_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={i * config.gridSize}
            x2={config.width}
            y2={i * config.gridSize}
            stroke="#631c75"
            strokeWidth="2"
            opacity={config.lineOpacity}
          />
        ))}

        {/* Flowing Paths + Moving Dots */}
        {paths.map((path, i) => (
          <React.Fragment key={i}>
            <motion.path
              d={path.d}
              fill="none"
              stroke="url(#flowGradient)"
              strokeWidth="4"
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
              transition={{
                duration: path.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: path.delay,
              }}
            />

            <polygon
              points="-6,-3 6,0 -6,3 -2,0"
              fill={config.primaryColor}
              filter="url(#glow)"
            >
              <animateMotion
                dur={`${path.duration}s`}
                repeatCount="indefinite"
                path={path.d}
                begin={`${path.delay}s`}
                rotate="auto"
              />
            </polygon>
          </React.Fragment>
        ))}

        {/* Pulsing Nodes */}
        {nodes.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="1"
            fill={config.primaryColor}
            filter="url(#glow)"
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.9, 1] }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function Hero() {
  const { openAuth } = useAuth();

  return (
    <section className="relative overflow-hidden bg-zinc-50 pt-20 pb-16 lg:pt-32 lg:pb-24">
      {/* Animated Connection Grid */}
      <ConnectionGrid />

      {/* Soft Overlay for Text Readability */}
      {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-50/70 via-zinc-50/50 to-zinc-50" /> */}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Content */}
        <div className="mx-auto mb-12 max-w-4xl text-center lg:mb-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-1.5 text-sm font-medium text-purple-500 shadow-sm backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Now with Catalog Builder
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-8 text-4xl font-semibold leading-[1.05] tracking-tighter text-zinc-800 sm:text-5xl lg:text-4xl xl:text-6xl"
          >
            ម៉ឺនុយឌីជីថលដ៏ស្រស់ស្អាត។
            <br className="hidden sm:block" />
            <span className="mt-3 bg-gradient-to-r from-blue-600 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Catelog QR ភ្លាមៗ។
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg"
          >
            ជំនួយការពិសេសសម្រាប់អ្នកលក់អនឡាញលើ Facebook និងអាជីវកម្មខ្នាតតូច!
            រៀបចំកាតាឡុកផលិតផលឱ្យមានរបៀប រួចផ្ញើ Link
            ទៅកាន់អតិថិជនដើម្បីកម្មង់ទិញ និងមើលតម្លៃភ្លាមៗ
            ងាយស្រួលគ្រប់គ្រងការបញ្ជាទិញ។
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-4 px-4 sm:max-w-none sm:flex-row"
          >
            <motion.button
              onClick={() => openAuth("login")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-purple-500/40 transition-all duration-300 hover:from-purple-700 hover:to-violet-700 sm:w-auto"
            >
              សាកល្បងឥតគិតថ្លៃ — មិនទាមទារកាត
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-zinc-200 bg-white/80 px-7 py-3.5 text-base font-semibold text-zinc-800 backdrop-blur-2xl transition-all duration-300 hover:bg-white sm:w-auto"
            >
              <Play className="h-5 w-5" />
              មើលវីដេអូណែនាំ ៩០ វិនាទី
            </motion.button>
          </motion.div>

          {/* Trust Bar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-12 flex flex-col items-center justify-center gap-6 text-sm sm:flex-row"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/96?img=${i + 20}`}
                  alt={`Customer ${i}`}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
                />
              ))}
            </div>

            <div className="text-center sm:text-left">
              <p className="font-medium text-zinc-700">
                Trusted by 12,000+ businesses
              </p>
              <p className="text-xs text-zinc-500">
                from online sellers to local cafés
              </p>
            </div>
          </motion.div>
        </div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="absolute inset-0 scale-[0.96] rounded-[2rem] bg-gradient-to-br from-purple-500/40 via-cyan-400/30 to-fuchsia-500/40 opacity-80 blur-[90px]" />

          <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/30 shadow-[0_30px_100px_rgba(124,58,237,.20)] backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/10 via-transparent to-cyan-400/10" />
            <img
              src={dashboardMockup}
              alt="Sellflow Dashboard Preview"
              className="relative z-10 h-auto w-full object-cover"
            />
          </div>

          {/* Floating Elements */}
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-24 -top-24 z-10 hidden w-64 rounded-3xl border border-white/60 bg-white/80 p-5 shadow-2xl backdrop-blur-2xl xl:block"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-medium">Today</span>
                </div>
                <div className="mt-1 text-3xl font-semibold text-zinc-800">
                  $842
                </div>
                <div className="text-sm text-emerald-600">
                  +18% from yesterday
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-40 bottom-24 z-10 hidden w-56 rounded-3xl border border-white/60 bg-white/80 p-4 shadow-2xl backdrop-blur-2xl lg:block"
          >
            <div className="flex gap-4">
              <img
                src="https://picsum.photos/seed/food1/80/80"
                alt="Amok"
                className="h-16 w-16 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <div className="text-sm font-medium">អាម៉ុកត្រី</div>
                <div className="text-xs text-zinc-500">
                  Traditional Khmer • $8.50
                </div>
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-28 bottom-20 z-10 hidden w-64 rounded-3xl border border-white/60 bg-white/80 p-4 shadow-2xl backdrop-blur-2xl xl:block"
          >
            <div className="text-sm italic text-zinc-600">
              "QR code ងាយស្រួលណាស់! អតិថិជនចូលចិត្តខ្លាំង។"
            </div>
            <div className="mt-3 text-xs font-medium">
              — លោក សុខា, Owner @ Cafe 25
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
