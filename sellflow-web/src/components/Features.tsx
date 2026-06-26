import React from 'react';
import { motion } from 'framer-motion';
import {
  PackageSearch,
  FolderTree,
  QrCode,
  ClipboardList,
  LineChart,
  Smartphone } from
'lucide-react';


export function Features() {
  const features = [
  {
    title: 'Product Catalog',
    description:
    'Create beautiful product listings with multiple images, variants, and rich descriptions.',
    icon: PackageSearch,
    color: 'text-brand',
    bg: 'bg-brand-soft'
  },
  {
    title: 'Category Management',
    description:
    'Organize your inventory intuitively with nested categories and smart tags.',
    icon: FolderTree,
    color: 'text-blue-500',
    bg: 'bg-blue-50'
  },
  {
    title: 'QR Code Sharing',
    description:
    'Generate instant QR codes for your entire catalog or specific products to share anywhere.',
    icon: QrCode,
    color: 'text-purple-500',
    bg: 'bg-purple-50'
  },
  {
    title: 'Customer Orders',
    description:
    'Receive and manage orders directly through your dashboard with real-time status updates.',
    icon: ClipboardList,
    color: 'text-amber-500',
    bg: 'bg-amber-50'
  },
  {
    title: 'Analytics Dashboard',
    description:
    'Track views, popular products, and revenue with beautiful, easy-to-read charts.',
    icon: LineChart,
    color: 'text-green-400',
    bg: 'bg-green-50'
  },
  {
    title: 'Mobile Friendly',
    description:
    'Your catalog looks perfect on any device, ensuring a great shopping experience.',
    icon: Smartphone,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50'
  }];

  return (
    <section id="features" className="py-24 bg-gradient-to-t from-zinc-50 via-white to-purple-300">
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
            
            Everything you need to sell online
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
            className="text-lg text-muted">
            Powerful features designed specifically for small businesses, packed
            into an intuitive and beautiful interface.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) =>
          <motion.div
            key={feature.title}
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
              delay: index * 0.1
            }}
            whileHover={{
              y: -5
            }}
            className="p-8 rounded-2xl border border-zinc-200/90 bg-white hover:shadow-card shadow-md transition-all duration-300 group">
            
              <div
              className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="font-display text-xl font-bold text-ink mb-3">
                {feature.title}
              </h3>
              <p className="text-muted leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}