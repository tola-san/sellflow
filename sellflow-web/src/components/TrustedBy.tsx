import React from 'react';
import { motion } from 'framer-motion';
export function TrustedBy() {
  const logos = [
  {
    name: 'Acme Corp',
    icon: 'A'
  },
  {
    name: 'GlobalTech',
    icon: 'G'
  },
  {
    name: 'Nexus',
    icon: 'N'
  },
  {
    name: 'Lumina',
    icon: 'L'
  },
  {
    name: 'Strata',
    icon: 'S'
  },
  {
    name: 'Vortex',
    icon: 'V'
  }];

  return (
    <section className="py-12 border-y border-surface bg-canvas/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted mb-8">
          Trusted by growing small businesses worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {logos.map((logo, index) =>
          <motion.div
            key={logo.name}
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
            className="flex items-center gap-2 text-ink font-display font-bold text-xl">
            
              <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-sm">
                {logo.icon}
              </div>
              {logo.name}
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}