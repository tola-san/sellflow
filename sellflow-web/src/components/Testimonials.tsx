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
        'SellFlow completely transformed how we take orders. The QR code feature means customers can browse our arrangements right from their table.',
    },
    {
      name: 'Marcus Chen',
      business: 'Artisan Roasters',
      image: 'https://i.pravatar.cc/150?img=11',
      quote:
        "Finally, an open-source platform that looks and feels like a premium SaaS product. It's fast, beautiful, and exactly what my coffee shop needed.",
    },
    {
      name: 'Elena Rodriguez',
      business: 'Handcrafted Ceramics',
      image: 'https://i.pravatar.cc/150?img=5',
      quote:
        "I'm not technical at all, but I had my entire catalog set up in under an hour. The dashboard is incredibly intuitive.",
    },
  ];

  return (
    <section className="py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-semibold tracking-tighter text-zinc-900 mb-4"
          >
            Loved by small business owners
          </motion.h2>
          <p className="text-zinc-600 text-lg">
            Real stories from people who switched to SellFlow
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 hover:shadow-xl hover:border-violet-100 transition-all duration-300 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-zinc-700 text-[17px] leading-relaxed mb-10 flex-1">
                “{testimonial.quote}”
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 mt-auto">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-zinc-100 group-hover:ring-violet-200 transition-colors"
                />
                <div>
                  <div className="font-semibold text-zinc-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-zinc-500">
                    {testimonial.business}
                  </div>
                </div>
              </div>

              {/* Subtle accent line */}
              <div className="h-0.5 w-12 bg-gradient-to-r from-violet-500 to-transparent mt-8 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}