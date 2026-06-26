import React from 'react';
import { motion } from 'framer-motion';
import dashboardImage from '../assets/images/feature-analytics.jpg';
import {Send,CheckCircle2 } from 'lucide-react';
// ← Adjust path if needed

export function  DashboardPreview() {
  return (
    <div className="relative w-full max-w-6xl mx-auto px-4">
      {/* Gradient Shadow Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-violet-600 to-fuchsia-600 
                      blur-[90px] opacity-30 rounded-[3rem] scale-[0.92] -z-10" />

      {/* Main Mockup Container */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative rounded-3xl overflow-hidden border border-zinc-200 shadow-2xl shadow-zinc-900/30"
      >
        <motion.img
          src={dashboardImage}
          alt="Sellflow Dashboard Preview"
          className="w-full h-auto object-cover"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
        />
      </motion.div>

      {/* Floating Elements (Optional - still looks good with image) */}
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