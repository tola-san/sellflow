
import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ShoppingBag,
  Send,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
export function DashboardMockup() {
  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Browser Chrome */}
      <GlassCard className="border-t-0 rounded-t-2xl rounded-b-2xl shadow-2xl bg-white/90">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-brand-gray/50 bg-brand-gray/20">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="mx-auto bg-white/50 px-24 py-1 rounded-md text-[10px] text-brand-muted font-medium flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-brand-blue/20 flex items-center justify-center">
              <ShoppingBag size={8} className="text-brand-blue" />
            </span>
            app.sellflow.com
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 grid grid-cols-12 gap-6 bg-brand-bg/50">
          {/* Sidebar Area (Simplified) */}
          <div className="col-span-2 hidden md:flex flex-col gap-4">
            <div className="h-8 w-8 rounded-lg bg-brand-blue mb-4 flex items-center justify-center">
              <ShoppingBag size={16} className="text-white" />
            </div>
            {[1, 2, 3, 4, 5].map((i) =>
            <div
              key={i}
              className={`h-8 rounded-md ${i === 1 ? 'bg-brand-cyan text-brand-blue' : 'bg-transparent text-brand-muted'} flex items-center px-3 gap-2`}>
              
                <div
                className={`w-4 h-4 rounded-sm ${i === 1 ? 'bg-brand-blue/20' : 'bg-brand-gray'}`} />
              
                <div
                className={`h-2 rounded-full w-12 ${i === 1 ? 'bg-brand-blue/40' : 'bg-brand-gray'}`} />
              
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="col-span-12 md:col-span-10 flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-brand-dark">
                  Overview
                </h3>
                <p className="text-xs text-brand-muted">Welcome back, Sarah</p>
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-8 rounded-full bg-brand-gray flex items-center justify-center">
                  <span className="text-xs font-medium">SA</span>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-brand-gray shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-brand-cyan rounded-lg">
                    <TrendingUp size={16} className="text-brand-blue" />
                  </div>
                  <span className="flex items-center text-[10px] text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded">
                    <ArrowUpRight size={10} className="mr-0.5" /> 12.5%
                  </span>
                </div>
                <p className="text-xs text-brand-muted mb-1">Total Revenue</p>
                <p className="text-xl font-bold text-brand-dark">$24,500</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-brand-gray shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <ShoppingBag size={16} className="text-purple-500" />
                  </div>
                  <span className="flex items-center text-[10px] text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded">
                    <ArrowUpRight size={10} className="mr-0.5" /> 8.2%
                  </span>
                </div>
                <p className="text-xs text-brand-muted mb-1">Total Orders</p>
                <p className="text-xl font-bold text-brand-dark">1,248</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-brand-gray shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-brand-cyan rounded-bl-full -z-10 opacity-50" />
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Send size={16} className="text-blue-500" />
                  </div>
                </div>
                <p className="text-xs text-brand-muted mb-1">Active Channels</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-md">
                    Telegram
                  </span>
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                    +2
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Chart Area */}
              <div className="col-span-2 bg-white p-5 rounded-xl border border-brand-gray shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-sm font-semibold text-brand-dark">
                    Sales Overview
                  </h4>
                  <MoreHorizontal size={16} className="text-brand-muted" />
                </div>
                <div className="h-32 flex items-end gap-2">
                  {[40, 70, 45, 90, 65, 85, 120, 95, 110, 80, 130, 100].map(
                    (height, i) =>
                    <div
                      key={i}
                      className="flex-1 flex flex-col justify-end group">
                      
                        <motion.div
                        initial={{
                          height: 0
                        }}
                        whileInView={{
                          height: `${height}%`
                        }}
                        viewport={{
                          once: true
                        }}
                        transition={{
                          duration: 0.8,
                          delay: i * 0.05
                        }}
                        className={`w-full rounded-t-sm ${i === 10 ? 'bg-brand-blue' : 'bg-brand-cyan group-hover:bg-brand-blue/50 transition-colors'}`} />
                      
                      </div>

                  )}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="col-span-1 bg-white p-5 rounded-xl border border-brand-gray shadow-sm">
                <h4 className="text-sm font-semibold text-brand-dark mb-4">
                  Recent Orders
                </h4>
                <div className="flex flex-col gap-4">
                  {[
                  {
                    name: 'Alex M.',
                    item: 'Pro Bundle',
                    status: 'completed',
                    time: '2m ago'
                  },
                  {
                    name: 'Sarah K.',
                    item: 'Basic Kit',
                    status: 'pending',
                    time: '15m ago'
                  },
                  {
                    name: 'John D.',
                    item: 'Pro Bundle',
                    status: 'completed',
                    time: '1h ago'
                  }].
                  map((order, i) =>
                  <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-gray/50 flex items-center justify-center text-[10px] font-medium">
                          {order.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-brand-dark">
                            {order.name}
                          </p>
                          <p className="text-[10px] text-brand-muted">
                            {order.item}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        {order.status === 'completed' ?
                      <CheckCircle2
                        size={12}
                        className="text-green-500 mb-1" /> :


                      <Clock size={12} className="text-amber-500 mb-1" />
                      }
                        <span className="text-[9px] text-brand-muted">
                          {order.time}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [-10, 10, -10]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute -right-12 top-20 bg-white p-3 rounded-xl shadow-xl border border-brand-gray/50 flex items-center gap-3 z-10">
        
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
          <Send size={14} className="text-blue-500" />
        </div>
        <div>
          <p className="text-xs font-semibold text-brand-dark">
            New Order via Telegram
          </p>
          <p className="text-[10px] text-brand-muted">Just now • $129.00</p>
        </div>
      </motion.div>

      <motion.div
        animate={{
          y: [10, -10, 10]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1
        }}
        className="absolute -left-8 bottom-24 bg-white p-3 rounded-xl shadow-xl border border-brand-gray/50 flex items-center gap-3 z-10">
        
        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle2 size={14} className="text-green-500" />
        </div>
        <div>
          <p className="text-xs font-semibold text-brand-dark">
            Payment Received
          </p>
          <p className="text-[10px] text-brand-muted">Stripe • +$45.00</p>
        </div>
      </motion.div>
    </div>);

}