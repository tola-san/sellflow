import React from 'react';
import { motion } from 'framer-motion';
import { Store, PlusCircle, Share2, ShoppingBag } from 'lucide-react';
export function HowItWorks() {
  const steps = [
  {
    title: 'Create Business',
    description: 'Sign up and set up your store profile in seconds.',
    icon: Store
  },
  {
    title: 'Add Products',
    description: 'Upload images, set prices, and organize by category.',
    icon: PlusCircle
  },
  {
    title: 'Share QR Code',
    description: 'Print or share your unique catalog link anywhere.',
    icon: Share2
  },
  {
    title: 'Receive Orders',
    description: 'Get notified instantly when customers place orders.',
    icon: ShoppingBag
  }];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
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
            className="font-display text-3xl md:text-4xl font-bold text-ink mb-4">
            
            Start selling in four simple steps
          </motion.h2>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop only) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-line -translate-y-1/2 z-0"></div>

          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) =>
            <motion.div
              key={step.title}
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
                delay: index * 0.2
              }}
              className="relative flex flex-col items-center text-center">
              
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-brand flex items-center justify-center mb-6 shadow-glow">
                  <step.icon className="w-8 h-8 text-brand" />
                </div>
                <h3 className="font-display text-xl font-bold text-ink mb-2">
                  {step.title}
                </h3>
                <p className="text-muted">{step.description}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>);

}