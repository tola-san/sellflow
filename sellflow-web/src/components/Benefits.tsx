import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export function Benefits() {
  const benefits = [
    {
      title: 'Easy to Use',
      desc: 'Intuitive interface designed for non-technical users.',
    },
    {
      title: 'Fast Performance',
      desc: 'Built on modern tech stack for lightning-fast loading.',
    },
    {
      title: 'Open Source',
      desc: 'Full access to the codebase. Host it yourself if you want.',
    },
    {
      title: 'Free Forever',
      desc: 'Core features will always remain free for small businesses.',
    },
    {
      title: 'Secure API',
      desc: 'Enterprise-grade security protecting your business data.',
    },
    {
      title: 'Responsive Design',
      desc: 'Looks perfect on mobile, tablet, and desktop.',
    },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Enhanced Mockup with Soft Gradients */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Soft Background Glows */}
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-400/10 via-cyan-400/10 to-transparent rounded-[3rem] blur-3xl -z-10" />
            
            <div className="bg-white rounded-3xl border border-zinc-100 p-8 shadow-2xl relative overflow-hidden">
              {/* Abstract UI Representation */}
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-inner">
                    <span className="text-white text-3xl">📱</span>
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-2/3 bg-zinc-100 rounded-full" />
                    <div className="h-3 w-1/2 bg-zinc-100 rounded-full" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.03 }}
                      className="h-32 rounded-2xl bg-gradient-to-br from-zinc-50 to-white border border-zinc-100 flex items-center justify-center shadow-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/70 backdrop-blur-sm flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating Success Toast */}
              <motion.div
                animate={{
                  y: [-8, 8, -8],
                  rotate: [-2, 2, -2],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4.5,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4 bg-white p-5 rounded-2xl shadow-xl border border-zinc-100 w-72"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-900">Product Added</div>
                    <div className="text-sm text-zinc-600">Truffle Carbonara • Successfully synced</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tighter text-zinc-900 mb-6">
              Everything you need,<br />nothing you don&apos;t.
            </h2>
            <p className="text-xl text-zinc-600 mb-12">
              We stripped away the complexity of traditional e-commerce platforms 
              to give you exactly what you need to showcase and sell your products.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ x: 8 }}
                  className="group flex gap-4 p-6 rounded-3xl border border-zinc-100 hover:border-violet-200 hover:shadow-md bg-white transition-all duration-300"
                >
                  <div className="mt-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-2 text-lg">
                      {benefit.title}
                    </h4>
                    <p className="text-zinc-600 leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}