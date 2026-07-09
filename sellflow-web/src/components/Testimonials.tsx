import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

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

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-4 leading-tight"
          >
            ទទួលបានការស្រឡាញ់ពីម្ចាស់អាជីវកម្មខ្នាតតូច
          </motion.h2>
          <p className="text-zinc-600 text-base sm:text-lg">
            បទពិសោធន៍ពិតៗពីអ្នកលក់ដែលបានផ្លាស់ប្តូរមកប្រើប្រាស់ SellFlow
          </p>
        </div>

        {/* Swiper-like Carousel */}
        <div className="relative max-w-2xl mx-auto">
          <div className="overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="bg-white p-8 md:p-12 shadow-xl"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Stars */}
                  <div className="flex gap-1 mb-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-6 h-6 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-zinc-700 text-lg md:text-xl leading-relaxed mb-12 italic">
                    « {testimonials[currentIndex].quote} »
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].name}
                      className="w-16 h-16 rounded-2xl object-cover ring-4 ring-violet-100"
                    />
                    <div className="text-left">
                      <div className="font-bold text-xl text-zinc-900">
                        {testimonials[currentIndex].name}
                      </div>
                      <div className="text-zinc-500 mt-1">
                        {testimonials[currentIndex].business}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute -left-5 top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-lg hover:bg-violet-50 transition-colors border border-zinc-100"
          >
            <ChevronLeft className="w-6 h-6 text-zinc-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute -right-5 top-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-lg hover:bg-violet-50 transition-colors border border-zinc-100"
          >
            <ChevronRight className="w-6 h-6 text-zinc-700" />
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-3 mt-10">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-violet-600 w-8' 
                    : 'bg-zinc-300 hover:bg-zinc-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}