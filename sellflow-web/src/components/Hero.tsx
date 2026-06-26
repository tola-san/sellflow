import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  BarChart3,
  Package,
  ShoppingCart,
  QrCode,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-zinc-50">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-100 via-white to-purple-400" />
      
      <div className="absolute top-[-15%] right-[-10%] w-[700px] h-[700px] lg:w-[800px] lg:h-[800px] rounded-full bg-gradient-to-br from-violet-400/10 via-indigo-400/10 to-transparent blur-3xl" />
      <div className="absolute bottom-[-25%] left-[-10%] w-[600px] h-[600px] lg:w-[700px] lg:h-[700px] rounded-full bg-gradient-to-br from-emerald-400/8 via-cyan-400/8 to-transparent blur-3xl" />

      {/* Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top Content */}
        <div className="max-w-4xl mx-auto text-center mb-12 lg:mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/30  backdrop-blur-xl border border-zinc-100 text-zinc-700 text-sm font-medium mb-8 shadow-sm">
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center justify-center gap-3 bg-purple-400 hover:bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-md shadow-zinc-900/30 transition-all duration-300"
            >
              Start Free — No Card Needed
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-3 bg-white/50 backdrop-blur-xl hover:bg-zinc-50 border border-zinc-200 px-8 py-4 rounded-full text-lg font-semibold text-zinc-700 transition-all duration-300"
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

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-3xl border border-zinc-200/70 bg-white/95 backdrop-blur-2xl shadow-2xl overflow-hidden aspect-[16/9.8] lg:aspect-[16/10.2] w-full">
            {/* Browser Header */}
            <div className="h-11 border-b border-zinc-100 flex items-center px-4 bg-zinc-50/90">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="mx-auto text-xs text-zinc-400 font-mono tracking-tight bg-white/80 px-5 py-0.5 rounded-full border border-zinc-100 flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5" />
                sellflow.app/dashboard
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 p-6 lg:p-8 flex flex-col gap-6 lg:gap-8">
              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Today’s Revenue", value: "$2,847", icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "Live Catalogs", value: "18", icon: Package, color: "text-violet-600", bg: "bg-violet-50" },
                  { label: "Orders Today", value: "47", icon: ShoppingCart, color: "text-amber-600", bg: "bg-amber-50" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm hover:shadow transition-shadow"
                  >
                    <div className={`w-10 h-10 rounded-2xl ${stat.bg} flex items-center justify-center mb-5`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className="text-xs text-zinc-500 mb-1 tracking-wide">{stat.label}</div>
                    <div className="font-display text-3xl font-semibold tracking-tighter text-zinc-900">
                      {stat.value}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Catalog + Chart */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Mini Catalog Preview */}
                <div className="lg:col-span-3 bg-white rounded-3xl border border-zinc-100 p-6 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="font-semibold text-sm">Signature Menu</div>
                    <div className="text-emerald-600 text-xs font-medium flex items-center gap-1">
                      ● Live
                    </div>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    {[
                      { name: "Truffle Carbonara", price: "24" },
                      { name: "Wagyu Ribeye", price: "68" },
                      { name: "Matcha Tiramisu", price: "14" },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-zinc-100 last:border-0">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="font-mono text-sm text-zinc-500">€{item.price}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue Chart */}
                <div className="lg:col-span-2 rounded-3xl border border-zinc-100 p-6 shadow-sm bg-white flex flex-col">
                  <div className="text-sm font-semibold mb-5">This Week</div>
                  <div className="flex-1 flex items-end gap-1.5">
                    {[38, 65, 47, 82, 71, 95, 100].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end h-40 group relative">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 1.4, delay: 0.5 + i * 0.07 }}
                          className="bg-gradient-to-t from-violet-600 to-indigo-500 rounded-t-xl w-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements - Hidden on mobile */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="hidden lg:block absolute -right-6 top-16 bg-white rounded-3xl border border-zinc-100 shadow-2xl p-5 w-72 backdrop-blur-xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm">Table 7 • Just now</div>
                <div className="text-emerald-600 text-sm">€142.50 • 3 items</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="hidden lg:block absolute -left-6 bottom-20 bg-white rounded-3xl border border-zinc-100 shadow-2xl p-5 flex gap-4 items-center backdrop-blur-xl"
          >
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=https://sellflow.app/c/italian-bistro"
              alt="QR Code"
              className="w-16 h-16 rounded-2xl shadow-sm"
            />
            <div>
              <div className="font-semibold text-sm leading-tight">Scan for Menu</div>
              <div className="text-xs text-zinc-500">Italian Bistro • Live</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}