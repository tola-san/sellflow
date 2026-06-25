import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
export function Benefits() {
  const benefits = [
  {
    title: 'Easy to Use',
    desc: 'Intuitive interface designed for non-technical users.'
  },
  {
    title: 'Fast Performance',
    desc: 'Built on modern tech stack for lightning-fast loading.'
  },
  {
    title: 'Open Source',
    desc: 'Full access to the codebase. Host it yourself if you want.'
  },
  {
    title: 'Free Forever',
    desc: 'Core features will always remain free for small businesses.'
  },
  {
    title: 'Secure API',
    desc: 'Enterprise-grade security protecting your business data.'
  },
  {
    title: 'Responsive Design',
    desc: 'Looks perfect on mobile, tablet, and desktop.'
  }];

  return (
    <section className="py-24 bg-canvas overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Illustration/Mockup */}
          <motion.div
            initial={{
              opacity: 0,
              x: -40
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}
            className="relative">
            
            <div className="absolute inset-0 bg-gradient-to-tr from-brand/20 to-[#a98bf7]/20 rounded-[3rem] blur-3xl -z-10"></div>
            <div className="bg-white rounded-[2rem] border border-line p-8 shadow-2xl relative overflow-hidden">
              {/* Abstract UI representation */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-brand-soft"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-1/3 bg-surface rounded-full"></div>
                    <div className="h-3 w-1/4 bg-canvas rounded-full"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) =>
                  <div
                    key={i}
                    className="h-32 rounded-xl bg-canvas border border-surface">
                  </div>
                  )}
                </div>
              </div>

              {/* Floating element */}
              <motion.div
                animate={{
                  y: [-5, 5, -5]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4
                }}
                className="absolute top-1/2 right-0 translate-x-1/3 -translate-y-1/2 bg-white p-4 rounded-2xl shadow-xl border border-surface">
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white">
                    ✓
                  </div>
                  <div>
                    <div className="text-sm font-bold text-ink">
                      Product Added
                    </div>
                    <div className="text-xs text-muted">
                      Successfully synced
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{
              opacity: 0,
              x: 40
            }}
            whileInView={{
              opacity: 1,
              x: 0
            }}
            viewport={{
              once: true
            }}>
            
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-6">
              Everything you need, nothing you don't.
            </h2>
            <p className="text-lg text-muted mb-10">
              We stripped away the complexity of traditional e-commerce
              platforms to give you exactly what you need to showcase and sell
              your products.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) =>
              <motion.div
                key={benefit.title}
                initial={{
                  opacity: 0,
                  y: 10
                }}
                whileInView={{
                  opacity: 1,
                  y: 0
                }}
                viewport={{
                  once: true
                }}
                transition={{
                  delay: index * 0.1
                }}
                className="flex gap-3">
                
                  <CheckCircle2 className="w-6 h-6 text-brand shrink-0" />
                  <div>
                    <h4 className="font-bold text-ink mb-1">{benefit.title}</h4>
                    <p className="text-sm text-muted">{benefit.desc}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

}