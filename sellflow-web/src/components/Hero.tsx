import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Play,
  BarChart3,
  Package,
  ShoppingCart } from
'lucide-react';
export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-soft via-white to-white gradient-mesh animate-gradient"></div>

      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-brand/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#a98bf7]/10 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.6
            }}
            className="max-w-2xl">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-soft text-brand text-sm font-medium mb-6 border border-brand/20">
              <span className="flex h-2 w-2 rounded-full bg-brand"></span>
              v2.0 is now live
            </div>
            <h1 className="font-display text-5xl lg:text-6xl font-bold tracking-tight text-ink leading-[1.1] mb-6">
              Showcase Your Products. <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-[#a98bf7]">
                Grow Your Business.
              </span>
            </h1>
            <p className="text-lg text-muted mb-8 leading-relaxed max-w-xl">
              Create a beautiful digital product catalog, organize products by
              category, share with QR codes, and manage everything from one
              modern dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-white px-8 py-4 rounded-full text-base font-semibold transition-all shadow-glow hover:shadow-none hover:-translate-y-0.5 active:translate-y-0">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="inline-flex items-center justify-center gap-2 bg-white hover:bg-canvas text-ink border border-line px-8 py-4 rounded-full text-base font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm">
                <Play className="w-5 h-5" />
                View Demo
              </button>
            </div>

            <div className="mt-10 flex items-center gap-4 text-sm text-muted">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) =>
                <img
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                  alt="User avatar" />

                )}
              </div>
              <p>Trusted by 10,000+ businesses</p>
            </div>
          </motion.div>

          {/* Right Mockup */}
          <motion.div
            initial={{
              opacity: 0,
              x: 20
            }}
            animate={{
              opacity: 1,
              x: 0
            }}
            transition={{
              duration: 0.8,
              delay: 0.2
            }}
            className="relative lg:ml-10">
            
            {/* Main Dashboard Window */}
            <div className="relative rounded-3xl border border-line/50 bg-white/80 backdrop-blur-xl shadow-2xl overflow-hidden aspect-[4/3] flex flex-col">
              {/* Window Header */}
              <div className="h-12 border-b border-line/50 flex items-center px-4 gap-2 bg-surface/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-brand"></div>
                </div>
                <div className="mx-auto bg-white rounded-md px-3 py-1 text-xs text-muted border border-line flex items-center gap-2">
                  <span>sellflow.app/dashboard</span>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="flex-1 p-6 flex flex-col gap-6">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                  {
                    label: 'Total Revenue',
                    value: '$12,450',
                    icon: BarChart3,
                    color: 'text-brand',
                    bg: 'bg-brand-soft'
                  },
                  {
                    label: 'Active Products',
                    value: '142',
                    icon: Package,
                    color: 'text-blue-500',
                    bg: 'bg-blue-50'
                  },
                  {
                    label: 'New Orders',
                    value: '28',
                    icon: ShoppingCart,
                    color: 'text-amber-500',
                    bg: 'bg-amber-50'
                  }].
                  map((stat, i) =>
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-4 border border-line shadow-sm">
                    
                      <div
                      className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                      
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                      <div className="text-xs text-muted mb-1">
                        {stat.label}
                      </div>
                      <div className="font-display font-bold text-lg text-ink">
                        {stat.value}
                      </div>
                    </div>
                  )}
                </div>

                {/* Chart Area */}
                <div className="flex-1 bg-white rounded-2xl border border-line p-4 shadow-sm flex flex-col">
                  <div className="text-sm font-medium text-ink mb-4">
                    Revenue Overview
                  </div>
                  <div className="flex-1 flex items-end gap-2">
                    {[40, 70, 45, 90, 65, 85, 100, 60, 80, 50].map((h, i) =>
                    <div
                      key={i}
                      className="flex-1 bg-brand-soft rounded-t-sm relative group">
                      
                        <motion.div
                        initial={{
                          height: 0
                        }}
                        animate={{
                          height: `${h}%`
                        }}
                        transition={{
                          duration: 1,
                          delay: 0.5 + i * 0.1
                        }}
                        className="absolute bottom-0 w-full bg-brand rounded-t-sm">
                      </motion.div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <motion.div
              animate={{
                y: [-10, 10, -10]
              }}
              transition={{
                repeat: Infinity,
                duration: 6,
                ease: 'easeInOut'
              }}
              className="absolute -right-8 top-20 glass bg-white/90 p-4 rounded-2xl border border-line shadow-xl flex items-center gap-4">
              
              <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-brand" />
              </div>
              <div>
                <div className="text-sm font-bold text-ink">New Order #402</div>
                <div className="text-xs text-muted">Just now • $129.00</div>
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [10, -10, 10]
              }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: 'easeInOut',
                delay: 1
              }}
              className="absolute -left-8 bottom-20 glass bg-white/90 p-4 rounded-2xl border border-line shadow-xl flex items-center gap-3">
              
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=sellflow"
                alt="QR Code"
                className="w-12 h-12 rounded-lg" />
              
              <div>
                <div className="text-sm font-bold text-ink">Scan to view</div>
                <div className="text-xs text-brand font-medium">
                  Catalog active
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>);

}