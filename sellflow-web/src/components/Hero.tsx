import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  QrCode,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";

import dashboardMockup from "../assets/images/dashboard-hero.jpg";

export function Hero() {
  return (
    <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-zinc-50">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 via-white to-purple-500/50" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:10px_10px] opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top Content - unchanged */}
        <div className="max-w-4xl mx-auto text-center mb-12 lg:mb-16">
          <div className="max-w-4xl mx-auto text-center mb-12 lg:mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-100 backdrop-blur-xl border border-white text-zinc-700 text-sm font-medium mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Now with Catalog Builder
            </div>

            <h1 className=" text-4xl sm:text-5xl lg:text-4xl xl:text-6xl font-semibold tracking-tighter text-zinc-700 leading-[1.05] mb-8">
              ម៉ឺនុយឌីជីថលដ៏ស្រស់ស្អាត។
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-600 via-purple-300 to-cyan-400 bg-clip-text text-transparent mt-3">
                Catelog QR ភ្លាមៗ។
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-600 leading-relaxed max-w-2xl mx-auto mb-10">
              បង្កើតកាតាឡុក និងម៉ឺនុយឌីជីថលដ៏ទាក់ទាញសម្រាប់ភោជនីយដ្ឋាន ហាងកាហ្វេ
              ហាងលក់រាយ ឬសណ្ឋាគាររបស់អ្នក។ រួមបញ្ចូលទាំងការកម្មង់អនឡាញ
              ការវិភាគទិន្នន័យផ្ទាល់ និងការគ្រប់គ្រងយ៉ាងងាយស្រួល។
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
                         bg-white/80 dark:bg-white/30 backdrop-blur-2xl 
                         hover:bg-white dark:hover:bg-white/60
                         border border- zinc-200 dark:border-white
                         px-7 py-3.5 rounded-full
                         text-base font-semibold text-zinc-800 dark:text-zinc-800 
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
                <p className="font-medium text-zinc-700">
                  Trusted by 12,000+ businesses
                </p>
                <p className="text-xs text-zinc-500">
                  from Michelin-starred restaurants to local cafés
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* === DASHBOARD MOCKUP WITH MULTIPLE FLOATING ELEMENTS === */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Glow behind the mockup */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-cyan-400 to-purple-600 blur-[80px] opacity-90c scale-[0.96]" />
          <div className="relative rounded-3xl overflow-hidden border border-zinc-100 shadow-2xl">
            <img
              src={dashboardMockup}
              alt="Sellflow Dashboard Preview"
              className="w-full h-auto object-cover"
            />
          </div>
          {/* ==================== FLOATING ELEMENTS ==================== */}
          {/* 1. Order Notification (Existing + improved) */}
          {/* <motion.div
            animate={{ y: [-12, 12, -12] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="hidden lg:block absolute right-8 top-20 bg-white/95 backdrop-blur-2xl rounded-3xl border border-zinc-100 shadow-2xl p-5 w-72 z-10"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm">Table 7 • ពេលនេះ</div>
                <div className="text-emerald-600 text-sm font-medium">
                  ការកម្មង់ត្រូវបានទទួល
                </div>
                <div className="text-xs text-zinc-500 mt-1">2 នាទីមុន</div>
              </div>
            </div>
          </motion.div> */}

          {/* 3. Live Stats Card (Top Right) */}
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="hidden xl:block absolute -right-24 -top-24 bg-white/95 backdrop-blur-2xl rounded-3xl border border-zinc-100 shadow-2xl p-5 w-64 z-10"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-medium">Today</span>
                </div>
                <div className="text-3xl font-semibold text-zinc-800 mt-1">
                  $842
                </div>
                <div className="text-sm text-emerald-600">
                  +18% from yesterday
                </div>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </motion.div>
          {/* 4. Menu Item Preview (Bottom Left) */}
          <motion.div
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="hidden lg:block absolute -left-40 bottom-24 bg-white/95 backdrop-blur-2xl rounded-3xl border border-zinc-100 shadow-2xl p-4 w-56 z-10"
          >
            <div className="flex gap-4">
              <img
                src="https://picsum.photos/seed/food1/80/80"
                alt="Amok"
                className="w-16 h-16 object-cover rounded-2xl"
              />
              <div className="flex-1">
                <div className="font-medium text-sm">អាម៉ុកត្រី</div>
                <div className="text-xs text-zinc-500">
                  Traditional Khmer • $8.50
                </div>
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          {/* 5. Customer Review Bubble (Bottom Right) */}
          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="hidden xl:block absolute -right-28 bottom-20 bg-white/90 backdrop-blur-2xl rounded-3xl border border-zinc-100 shadow-2xl p-4 w-64 z-10"
          >
            <div className="italic text-sm text-zinc-600">
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
