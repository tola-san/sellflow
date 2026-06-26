import React from 'react';
import { motion } from 'framer-motion';
import { Store, PlusCircle, Share2, ShoppingBag } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Business",
      description: "Sign up and set up your store profile in seconds.",
      icon: Store,
    },
    {
      number: "02",
      title: "Add Products",
      description: "Upload images, set prices, and organize by category.",
      icon: PlusCircle,
    },
    {
      number: "03",
      title: "Share QR Code",
      description: "Print or share your unique catalog link anywhere.",
      icon: Share2,
    },
    {
      number: "04",
      title: "Receive Orders",
      description: "Get notified instantly when customers place orders.",
      icon: ShoppingBag,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-semibold tracking-tighter text-zinc-900 mb-4"
          >
            Start selling in four simple steps
          </motion.h2>
          <p className="text-zinc-600 text-lg">
            From setup to your first order — everything takes just minutes.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 -translate-y-1/2 z-0" />

          {/* Step Cards */}
          <div className="grid md:grid-cols-4 gap-8 lg:gap-10 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative flex flex-col items-center text-center bg-white rounded-3xl p-8 border border-zinc-100 hover:border-violet-200 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Icon Container */}
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-50 to-indigo-50 flex items-center justify-center border border-violet-100 group-hover:border-violet-200 transition-colors">
                    <step.icon className="w-10 h-10 text-violet-600" />
                  </div>

                  {/* Step Number */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-sm font-mono font-bold text-zinc-400 group-hover:text-violet-600 transition-colors">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-display text-2xl font-semibold text-zinc-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-zinc-600 leading-relaxed">
                  {step.description}
                </p>

                {/* Subtle bottom accent */}
                <div className="h-1 w-12 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full mt-8 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}