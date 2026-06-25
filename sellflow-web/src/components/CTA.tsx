import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand via-[#7a4ee8] to-[#a98bf7]"></div>

      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.h2
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
          
          Start Building Your Digital Catalog Today
        </motion.h2>
        <motion.p
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            delay: 0.1
          }}
          className="text-xl text-brand-soft mb-10 max-w-2xl mx-auto">
          
          Join thousands of small businesses using SellFlow to showcase their
          products and grow their sales.
        </motion.p>

        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            delay: 0.2
          }}
          className="flex flex-col sm:flex-row gap-4 justify-center">
          
          <button className="inline-flex items-center justify-center gap-2 bg-white text-brand px-8 py-4 rounded-full text-base font-bold transition-all hover:scale-105 active:scale-95 shadow-xl">
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="inline-flex items-center justify-center gap-2 bg-brand-hover/30 text-white border border-brand-soft/30 hover:bg-brand-hover/50 px-8 py-4 rounded-full text-base font-bold transition-all hover:scale-105 active:scale-95 backdrop-blur-sm">
            View Documentation
          </button>
        </motion.div>
      </div>
    </section>);

}