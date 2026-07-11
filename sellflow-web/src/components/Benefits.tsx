import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap, Shield, Globe, Rocket, Users, Star } from 'lucide-react';

export function Benefits() {
  const benefits = [
    {
      icon: CheckCircle2,
      title: 'Easy to Use',
      desc: 'Intuitive interface designed for non-technical users.',
      color: 'emerald',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      desc: 'Built on modern tech stack for blazing performance.',
      color: 'amber',
    },
    {
      icon: Shield,
      title: 'Enterprise Secure',
      desc: 'Bank-grade security for your business data.',
      color: 'violet',
    },
    {
      icon: Globe,
      title: 'Fully Responsive',
      desc: 'Flawless experience across all devices.',
      color: 'cyan',
    },
    {
      icon: Rocket,
      title: 'Free Forever',
      desc: 'Core features always free for small teams.',
      color: 'rose',
    },
    {
      icon: Users,
      title: 'Community Powered',
      desc: 'Open source with active contributor ecosystem.',
      color: 'indigo',
    },
  ];

  return (
    <section className="py-28 bg-zinc-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-70" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200 mb-4">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-zinc-600">Why thousands love us</span>
          </div>
          
          <h2 className="font-display text-5xl md:text-6xl font-semibold tracking-tighter text-zinc-900 mb-6">
            Built for speed.<br />Designed for clarity.
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-zinc-600">
            Every feature is thoughtfully crafted to remove friction and amplify what matters most — your business.
          </p>
        </div>

        {/* New Benefit Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ 
                  y: -12, 
                  transition: { duration: 0.3, ease: "easeOut" } 
                }}
                className="group relative bg-white rounded-3xl p-10 border border-zinc-100 hover:border-zinc-200 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
              >
                {/* Decorative Gradient Orb */}
                <div className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-${benefit.color}-400 to-${benefit.color}-600 rounded-full opacity-10 group-hover:opacity-20 blur-2xl transition-all duration-700`} />
                
                {/* Icon Container */}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-${benefit.color}-100 to-white flex items-center justify-center mb-8 border border-${benefit.color}-100 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className={`w-10 h-10 text-${benefit.color}-600`} />
                </div>

                <h3 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-4">
                  {benefit.title}
                </h3>
                
                <p className="text-zinc-600 leading-relaxed text-[17px] flex-1">
                  {benefit.desc}
                </p>

                {/* Bottom Accent Line */}
                <div className={`h-1 w-12 bg-gradient-to-r from-${benefit.color}-500 to-transparent mt-10 rounded-full group-hover:w-20 transition-all duration-500`} />
              </motion.div>
            );
          })}
        </div>

        {/* Trust Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 flex flex-wrap justify-center items-center gap-x-16 gap-y-8 opacity-75"
        >
          <div className="font-mono text-sm tracking-widest text-zinc-400">TRUSTED BY TEAMS AT</div>
          <div className="flex items-center gap-12 text-2xl font-light text-zinc-400">
            <span>stripe</span>
            <span>notion</span>
            <span>vercel</span>
            <span>webflow</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}