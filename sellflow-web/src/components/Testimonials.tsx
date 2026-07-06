import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      name: 'ម៉ារីណា',
      business: 'ហាងលក់សម្លៀកបំពាក់អនឡាញ នារីស្អាត',
      image: 'https://i.pravatar.cc/150?img=44',
      quote:
        'SellFlow ជួយសម្រួលការលក់លើ Facebook របស់ខ្ញុំខ្លាំងណាស់! ពីមុនភ្ញៀវសួរតម្លៃច្រើនដដែលៗ ឥឡូវគ្រាន់តែផ្ញើ Link កាតាឡុកទៅ ភ្ញៀវអាចមើលម៉ូដ និងតម្លៃ រួចកុម្ម៉ង់ទិញខ្លួនឯងបានភ្លាមៗតែម្តង។',
    },
    {
      name: 'ចាន់ដារ៉ា',
      business: 'ដារ៉ា កាហ្វេដុត (Dara Artisan Coffee)',
      image: 'https://i.pravatar.cc/150?img=11',
      quote:
        'នេះជាប្រព័ន្ធ SaaS ដែលទំនើប និងមានតម្លៃសមរម្យបំផុត។ ប្រព័ន្ធដំណើរការលឿន ងាយស្រួលគ្រប់គ្រងស្តុកផលិតផល និងមានមុខងារទិន្នន័យច្បាស់លាស់ ត្រូវចិត្តហាងកាហ្វេរបស់ខ្ញុំតែម្តង។',
    },
    {
      name: 'សុភ័ក្រ',
      business: 'ហាងលក់គ្រឿងសម្អាងធម្មជាតិ',
      image: 'https://i.pravatar.cc/150?img=5',
      quote:
        'ខ្ញុំមិនសូវចេះខាងបច្ចេកវិទ្យាទេ ប៉ុន្តែខ្ញុំអាចបង្កើតហាង និងរៀបចំកាតាឡុកផលិតផលទាំងអស់រួចរាល់ក្នុងពេលមិនដល់មួយម៉ោងផង។ ប្រព័ន្ធគ្រប់គ្រង (Dashboard) គឺងាយស្រួលយល់មែនទែន។',
    },
  ];

  return (
    <section className="py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header / ផ្នែកក្បាល */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className=" text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-4 leading-tight"
          >
            ទទួលបានការស្រឡាញ់ពីម្ចាស់អាជីវកម្មខ្នាតតូច
          </motion.h2>
          <p className="text-zinc-600 text-base sm:text-lg">
            បទពិសោធន៍ពិតៗពីអ្នកលក់ដែលបានផ្លាស់ប្តូរមកប្រើប្រាស់ SellFlow
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
              {/* Stars / ផ្កាយ */}
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote / សម្ដីអតិថិជន */}
              <p className="text-zinc-700 text-base sm:text-[16px] leading-relaxed mb-10 flex-1">
                « {testimonial.quote} »
              </p>

              {/* Author / អ្នកប្រើប្រាស់ */}
              <div className="flex items-center gap-4 mt-auto">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-zinc-100 group-hover:ring-violet-200 transition-colors"
                />
                <div>
                  <div className="font-bold text-zinc-900 font-display text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
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