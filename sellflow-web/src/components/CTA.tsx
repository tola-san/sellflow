import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Soft Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-100 via-white to-violet-200" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(34,211,238,0.08)_0%,transparent_50%)]" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-violet-200 text-violet-600 text-sm font-medium mb-6 shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          Ready to get started?
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter text-zinc-900 mb-6"
        >
          Start building your digital<br className="hidden sm:block" /> catalog today
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-zinc-600 max-w-2xl mx-auto mb-12"
        >
          Join thousands of restaurants, cafés, and shops using SellFlow to 
          create beautiful menus and grow their business.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Primary Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center justify-center gap-3 bg-zinc-900 hover:bg-black text-white px-10 py-4 rounded-2xl text-lg font-semibold shadow-xl shadow-zinc-900/30 transition-all duration-300 w-full sm:w-auto"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          {/* Secondary Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-3 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 px-10 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 w-full sm:w-auto"
          >
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Trust Line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-sm text-zinc-500 flex items-center justify-center gap-2"
        >
          No credit card required • Setup in under 2 minutes
        </motion.p>
      </div>
    </section>
  );
}