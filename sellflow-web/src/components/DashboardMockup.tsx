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

export function DashboardMockup() {
  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Main Dashboard Container */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl overflow-hidden">
        {/* Browser Header */}
        <div className="h-12 bg-zinc-50 border-b border-zinc-100 flex items-center px-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <div className="mx-auto flex items-center gap-2 bg-white px-6 py-1 rounded-full text-xs text-zinc-400 font-mono border border-zinc-100">
            <ShoppingBag className="w-3.5 h-3.5" />
            app.sellflow.com/dashboard
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 lg:p-8 bg-zinc-50">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-2 hidden lg:flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div className="font-semibold text-zinc-900">SellFlow</div>
              </div>

              <div className="space-y-1">
                {['Overview', 'Catalogs', 'Orders', 'Analytics', 'Settings'].map((item, i) => (
                  <div
                    key={i}
                    className={`h-10 px-4 rounded-2xl flex items-center text-sm font-medium transition-colors ${
                      i === 0
                        ? 'bg-white shadow-sm text-violet-600'
                        : 'text-zinc-500 hover:bg-white/70'
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-12 lg:col-span-10 flex flex-col gap-6">
              {/* Top Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight text-zinc-900">Overview</h3>
                  <p className="text-sm text-zinc-500">Welcome back, Sarah</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">Sarah Chen</div>
                    <div className="text-xs text-emerald-600">Online</div>
                  </div>
                  <div className="w-9 h-9 rounded-2xl bg-zinc-200 flex items-center justify-center text-sm font-semibold">
                    SC
                  </div>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Revenue */}
                <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-emerald-50 rounded-2xl">
                      <TrendingUp className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      <ArrowUpRight className="w-3 h-3 mr-1" />12.5%
                    </span>
                  </div>
                  <p className="mt-6 text-sm text-zinc-500">Total Revenue</p>
                  <p className="text-3xl font-semibold tracking-tighter text-zinc-900 mt-1">$24,500</p>
                </div>

                {/* Orders */}
                <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-violet-50 rounded-2xl">
                      <ShoppingBag className="w-6 h-6 text-violet-600" />
                    </div>
                    <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      <ArrowUpRight className="w-3 h-3 mr-1" />8.2%
                    </span>
                  </div>
                  <p className="mt-6 text-sm text-zinc-500">Total Orders</p>
                  <p className="text-3xl font-semibold tracking-tighter text-zinc-900 mt-1">1,248</p>
                </div>

                {/* Active Channels */}
                <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-sky-50 rounded-2xl">
                      <Send className="w-6 h-6 text-sky-600" />
                    </div>
                  </div>
                  <p className="mt-6 text-sm text-zinc-500">Active Channels</p>
                  <div className="flex gap-2 mt-3">
                    <span className="text-xs font-medium px-4 py-1.5 bg-sky-50 text-sky-700 rounded-2xl">Telegram</span>
                    <span className="text-xs font-medium px-4 py-1.5 bg-zinc-100 text-zinc-600 rounded-2xl">+2</span>
                  </div>
                </div>
              </div>

              {/* Chart + Recent Orders */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-semibold text-zinc-900">Sales Overview</h4>
                    <MoreHorizontal className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="h-52 flex items-end gap-2">
                    {[42, 68, 45, 92, 65, 88, 125, 95, 110, 78, 135, 102].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end group">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 1.2, delay: i * 0.04 }}
                          className={`w-full rounded-t-2xl transition-colors ${
                            i === 10
                              ? 'bg-violet-600'
                              : 'bg-gradient-to-t from-violet-400 to-indigo-400 group-hover:from-violet-500'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
                  <h4 className="font-semibold text-zinc-900 mb-5">Recent Orders</h4>
                  <div className="space-y-5">
                    {[
                      { name: 'Alex M.', item: 'Pro Bundle', status: 'completed', time: '2m ago' },
                      { name: 'Sarah K.', item: 'Basic Kit', status: 'pending', time: '15m ago' },
                      { name: 'John D.', item: 'Pro Bundle', status: 'completed', time: '1h ago' },
                    ].map((order, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-zinc-100 flex items-center justify-center text-sm font-medium">
                            {order.name[0]}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{order.name}</p>
                            <p className="text-xs text-zinc-500">{order.item}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          {order.status === 'completed' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                          ) : (
                            <Clock className="w-4 h-4 text-amber-500 mx-auto" />
                          )}
                          <p className="text-[10px] text-zinc-500 mt-1">{order.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Notifications */}
      <motion.div
        animate={{ y: [-12, 8, -12] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-6 lg:-right-10 top-24 bg-white p-4 rounded-2xl shadow-xl border border-zinc-100 flex items-center gap-3.5 w-72 hidden xl:flex"
      >
        <div className="w-9 h-9 rounded-2xl bg-blue-50 flex items-center justify-center">
          <Send className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900">New Order via Telegram</p>
          <p className="text-xs text-emerald-600">$129.00 • Just now</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        className="absolute -left-4 lg:-left-8 bottom-20 bg-white p-4 rounded-2xl shadow-xl border border-zinc-100 flex items-center gap-3.5 w-64 hidden xl:flex"
      >
        <div className="w-9 h-9 rounded-2xl bg-emerald-50 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900">Payment Received</p>
          <p className="text-xs text-zinc-500">Stripe • +$45.00</p>
        </div>
      </motion.div>
    </div>
  );
}