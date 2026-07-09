import React from "react";
import { motion } from "framer-motion";
import dashboardImage from "../assets/images/feature-analytics.jpg";
import { Send, CheckCircle2 } from "lucide-react";
// ← Adjust path if needed

export function DashboardPreview() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-zinc-50">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_3px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_2px)] bg-[size:40px_40px] opacity-30" />

      {/* Refined Gradient Shadow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6">
        <div
          className="w-full max-w-5xl 
                     bg-gradient-to-tl from-purple-600 via-cyan-400 to-purple-600 
                     blur-[90px] opacity-50
                     scale-[0.98] 
                     aspect-[16/9.7] rounded-[3.5rem]"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 text-sm font-medium tracking-wider bg-white border border-zinc-200 rounded-full text-zinc-600 mb-4">
              ផ្ទាំងគ្រប់គ្រងពេលវេលាជាក់ស្តែង
            </span>
            <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-900">
              មើលឃើញអ្វីៗគ្រប់យ៉ាងដោយគ្រាន់តែក្រឡេកមើល
            </h2>
            <p className="mt-4 text-xl text-zinc-600 max-w-2xl mx-auto">
              ផ្ទាំងវិភាគទិន្នន័យដ៏ស្រស់ស្អាត និងមានភាពរហ័សទាន់ចិត្ត
              (Responsive) ជាមួយការធ្វើបច្ចុប្បន្នភាពផ្ទាល់ ការជូនដំណឹង
              និងការយល់ដឹងស៊ីជម្រៅភ្លាមៗ។
            </p>
          </motion.div>
        </div>

        {/* Main Mockup Container */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden border border-zinc-200 shadow-2xl shadow-zinc-900/30 bg-white mx-auto max-w-5xl"
        >
          <motion.img
            src={dashboardImage}
            alt="Sellflow Dashboard Preview"
            className="w-full h-auto object-cover"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            whileHover={{ scale: 1.015 }}
          />
        </motion.div>

        {/* Floating Notification Cards */}
        <motion.div
          animate={{ y: [-12, 8, -12] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-4 lg:right-8 top-44 lg:top-30 bg-white p-5 rounded-2xl shadow-xl border border-zinc-100 flex items-center gap-4 w-72 hidden xl:flex z-10"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Send className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900">
              New Order via Telegram
            </p>
            <p className="text-xs text-emerald-600 mt-0.5">
              $129.00 • Just now
            </p>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2,
          }}
          className="absolute top-40 bg-white p-5 rounded-2xl shadow-xl border border-zinc-100 flex items-center gap-4 w-64 hidden xl:flex z-10"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900">
              Payment Received
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">Stripe • +$45.00</p>
          </div>
        </motion.div>

        <p className="text-center text-sm text-zinc-500 mt-8">
          Live demo • Updates every few seconds
        </p>
      </div>
    </section>
  );
}
