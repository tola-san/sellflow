import React from "react";
import { motion } from "framer-motion";
import { Store, PlusCircle, Share2, ShoppingBag } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Business",
      description: "Sign up and set up your store profile in seconds.",
      icon: Store,
      color: "from-emerald-500 to-cyan-400",
    },
    {
      number: "02",
      title: "Add Products",
      description: "Upload images, set prices, and organize by category.",
      icon: PlusCircle,
      color: "from-violet-400 to-purple-500",
    },
    {
      number: "03",
      title: "Share QR Code",
      description: "Print or share your unique catalog link anywhere.",
      icon: Share2,
      color: "from-amber-400 to-orange-500",
    },
    {
      number: "04",
      title: "Receive Orders",
      description: "Get notified instantly when customers place orders.",
      icon: ShoppingBag,
      color: "from-rose-400 to-pink-500",
    },
  ];

  return (
    <section className="py-24 bg-zinc-50 relative overflow-hidden">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="group relative bg-white rounded-3xl p-8 border border-zinc-100 shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              {/* Soft Gradient Glow Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-5 rounded-3xl blur-xl group-hover:opacity-20 transition-opacity`}
              />

              {/* Icon Container */}
              <div className="relative mb-8 flex justify-center">
                <div
                  className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                >
                  <step.icon className="w-10 h-10 text-white" />
                </div>

                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-sm font-mono font-bold text-zinc-400 group-hover:text-violet-600 transition-colors">
                  {step.number}
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="font-display text-2xl font-semibold text-zinc-900 mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-zinc-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Accent Line */}
              <div
                className={`h-1 w-12 bg-gradient-to-r ${step.color} rounded-full mx-auto mt-8 opacity-70 group-hover:opacity-100 transition-all`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
