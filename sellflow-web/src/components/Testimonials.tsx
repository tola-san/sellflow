import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

type Testimonial = {
  name: string;
  business: string;
  image: string;
  quote: string;
};

export function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      name: "ម៉ារីណា",
      business: "ហាងលក់សម្លៀកបំពាក់អនឡាញ នារីស្អាត",
      image: "https://i.pravatar.cc/150?img=44",
      quote:
        "SellFlow ជួយសម្រួលការលក់លើ Facebook របស់ខ្ញុំខ្លាំងណាស់! ឥឡូវគ្រាន់តែផ្ញើ Link កាតាឡុកទៅ ភ្ញៀវអាចមើលម៉ូដ និងតម្លៃបានភ្លាមៗ។",
    },
    {
      name: "ចាន់ដារ៉ា",
      business: "ដារ៉ា កាហ្វេដុត",
      image: "https://i.pravatar.cc/150?img=11",
      quote:
        "ប្រព័ន្ធដំណើរការលឿន ងាយស្រួលគ្រប់គ្រងស្តុកផលិតផល និងមានមុខងារទិន្នន័យច្បាស់លាស់។",
    },
    {
      name: "សុភ័ក្រ",
      business: "ហាងលក់គ្រឿងសម្អាងធម្មជាតិ",
      image: "https://i.pravatar.cc/150?img=5",
      quote:
        "ខ្ញុំអាចបង្កើតហាង និងរៀបចំកាតាឡុកផលិតផលរួចរាល់ក្នុងពេលមិនដល់មួយម៉ោង។ Dashboard ងាយស្រួលយល់។",
    },
    {
      name: "វិច្ឆិកា",
      business: "ហាងទូរស័ព្ទអនឡាញ",
      image: "https://i.pravatar.cc/150?img=32",
      quote:
        "SellFlow ធ្វើឲ្យការលក់តាម Chat កាន់តែងាយ។ ខ្ញុំអាចផ្ញើ Link ផលិតផលទៅអតិថិជន ហើយទទួល Order បានលឿនជាងមុន។",
    },
  ];

  const marqueeTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="relative overflow-hidden py-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-violet-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl"
          >
            ទទួលបានការស្រឡាញ់ពីម្ចាស់អាជីវកម្មខ្នាតតូច
          </motion.h2>

          <p className="text-base text-zinc-600 sm:text-lg">
            បទពិសោធន៍ពិតៗពីអ្នកលក់ដែលបានផ្លាស់ប្តូរមកប្រើប្រាស់ SellFlow
          </p>
        </div>

        <div className="relative overflow-hidden">
          {/* Fade left/right */}
          <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-24 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-24 bg-gradient-to-l from-white to-transparent" />

          <motion.div
            className="flex w-max gap-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 30,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {marqueeTestimonials.map((item, index) => (
              <motion.div
                key={`${item.name}-${index}`}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                }}
                transition={{ duration: 0.25 }}
                className="group relative w-[340px] shrink-0 overflow-hidden rounded-3xl border border-zinc-100  p-8  md:w-[420px]"
              >
                {/* Card glow */}
                <div className="absolute inset-0 -z-10">
                  <div className="absolute inset-0 rounded-3xl bg-white" />

                  <div className="absolute -left-10 -top-16 h-40 w-40 rounded-full bg-violet-400/20 blur-3xl transition-all duration-700 group-hover:bg-violet-500/30" />

                  <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-sky-400/20 blur-3xl transition-all duration-700 group-hover:bg-sky-500/30" />

                  <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-400/10 blur-2xl" />
                </div>

                <div className="mb-5 flex gap-1">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="h-5 w-5 fill-purple-500 text-purple-500 drop-shadow-[]"
                    />
                  ))}
                </div>

                <p className="mb-8 line-clamp-4 text-[17px] leading-8 text-zinc-700">
                  “{item.quote}”
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 rounded-2xl object-cover ring-4 ring-violet-100 shadow-lg shadow-violet-500/20"
                  />

                  <div>
                    <h3 className="font-bold text-zinc-900">{item.name}</h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      {item.business}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}