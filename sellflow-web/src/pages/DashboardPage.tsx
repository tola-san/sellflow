import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, BarChart3, Package, ShoppingCart } from 'lucide-react';

export function DashboardPage() {
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Main Dashboard Frame */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl overflow-hidden">
        {/* Browser Header */}
        <div className="h-11 bg-zinc-50 border-b border-zinc-100 flex items-center px-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <div className="mx-auto flex items-center gap-2 bg-white px-4 py-1 rounded-full text-xs text-zinc-400 font-mono border border-zinc-100">
            <QrCode className="w-3.5 h-3.5" />
            sellflow.app/dashboard
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 lg:p-8">
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Today's Revenue", value: "$2,847", icon: BarChart3, color: "emerald" },
              { label: "Live Catalogs", value: "18", icon: Package, color: "violet" },
              { label: "Orders Today", value: "47", icon: ShoppingCart, color: "amber" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-50 border border-zinc-100 rounded-2xl p-5"
              >
                <div className={`w-9 h-9 rounded-xl bg-${stat.color}-50 flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
                <div className="text-xs text-zinc-500 mb-1">{stat.label}</div>
                <div className="text-3xl font-semibold tracking-tight text-zinc-900">
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Menu Preview */}
            <div className="lg:col-span-3 bg-white border border-zinc-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="font-semibold">Signature Menu</div>
                <div className="text-emerald-600 text-xs font-medium flex items-center gap-1">
                  ● Live
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { name: "Truffle Carbonara", price: "24" },
                  { name: "Wagyu Ribeye", price: "68" },
                  { name: "Matcha Tiramisu", price: "14" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between py-3 border-b border-zinc-100 last:border-0">
                    <div className="font-medium">{item.name}</div>
                    <div className="font-mono text-zinc-500">€{item.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white border border-zinc-100 rounded-2xl p-6 flex flex-col">
              <div className="font-semibold mb-6">This Week</div>
              <div className="flex-1 flex items-end gap-2">
                {[35, 68, 45, 85, 72, 95, 100].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 1.2, delay: 0.1 * i }}
                    className="flex-1 bg-gradient-to-t from-violet-600 to-indigo-500 rounded-t-xl"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}