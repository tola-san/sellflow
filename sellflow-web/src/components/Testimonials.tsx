import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
export function Testimonials() {
  const testimonials = [
  {
    name: 'Sarah Jenkins',
    business: 'Bloom Floral Studio',
    image: 'https://i.pravatar.cc/150?img=44',
    quote:
    'SellFlow completely transformed how we take orders. The QR code feature means customers can browse our arrangements right from their table.'
  },
  {
    name: 'Marcus Chen',
    business: 'Artisan Roasters',
    image: 'https://i.pravatar.cc/150?img=11',
    quote:
    "Finally, an open-source platform that looks and feels like a premium SaaS product. It's fast, beautiful, and exactly what my coffee shop needed."
  },
  {
    name: 'Elena Rodriguez',
    business: 'Handcrafted Ceramics',
    image: 'https://i.pravatar.cc/150?img=5',
    quote:
    "I'm not technical at all, but I had my entire catalog set up in under an hour. The dashboard is incredibly intuitive."
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
            
            Loved by small business owners
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) =>
          <motion.div
            key={t.name}
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
            className="p-8 rounded-3xl border border-line bg-canvas relative">
            
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) =>
              <Star
                key={star}
                className="w-5 h-5 fill-amber-400 text-amber-400" />

              )}
              </div>
              <p className="text-ink/80 mb-8 text-lg leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <img
                src={t.image}
                alt={t.name}
                className="w-12 h-12 rounded-full object-cover" />
              
                <div>
                  <div className="font-bold text-ink">{t.name}</div>
                  <div className="text-sm text-muted">{t.business}</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}