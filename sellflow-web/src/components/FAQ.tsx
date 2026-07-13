import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FadeIn } from './ui/FadeIn';

const faqs = [
  {
    question: 'ខ្ញុំអាចភ្ជាប់ជាមួយ Facebook បានទេ?',
    answer:
      'បាន! SellFlow រួមបញ្ចូលជាមួយ Facebook, Instagram និង TikTok យ៉ាងរលូន។ អ្នកអាចគ្រប់គ្រងការបញ្ជាទិញទាំងអស់ពីវេទិកាទាំងនេះក្នុង Dashboard តែមួយ។',
  },
  {
    question: 'ខ្ញុំអាចទទួលបានការជូនដំណឹងតាម Telegram បានទេ?',
    answer:
      'បានជាក់លាក់។ ការរួមបញ្ចូល Telegram របស់យើងគឺជាមុខងារដ៏ពេញនិយមបំផុតមួយ។ អ្នកអាចរៀបចំវាក្នុងរយៈពេលពីរបីវិនាទីដើម្បីទទួលបានការជូនដំណឹងភ្លាមៗសម្រាប់ការបញ្ជាទិញថ្មី ការទូទាត់ និងសារពីអតិថិជន។',
  },
  {
    question: 'តើខ្ញុំត្រូវមានចំណេះដឹងបច្ចេកទេសទេ?',
    answer:
      'មិនចាំបាច់ទេ។ SellFlow ត្រូវបានរចនាឡើងសម្រាប់អ្នកដែលមិនមែនជាអ្នកបច្ចេកវិទ្យា។ បើអ្នកប្រើប្រាស់បណ្តាញសង្គមបាន អ្នកក៏អាចប្រើ SellFlow បានដែរ។ ការរៀបចំហាងរបស់អ្នកចំណាយពេលតិចជាង ៥ នាទី។',
  },
  {
    question: 'តើមានការសាកល្បងឥតគិតថ្លៃទេ?',
    answer:
      'មាន។ យើងផ្តល់ជូនការសាកល្បងឥតគិតថ្លៃ ១៤ ថ្ងៃ លើគ្រប់ផែនការទាំងអស់។ មិនត្រូវការកាតឥណទានទេ ដូច្នេះអ្នកអាចសាកល្បងមុខងារទាំងអស់ដោយគ្មានហានិភ័យ។',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-zinc-50">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
              សំណួរដែលគេសួរញឹកញាប់
            </h2>
            <p className="text-lg text-brand-muted">
              អ្វីគ្រប់យ៉ាងដែលអ្នកត្រូវដឹងអំពី SellFlow
            </p>
          </FadeIn>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FadeIn key={index} delay={index * 0.08}>
              <div
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  openIndex === index
                    ? 'border-brand-blue bg-brand-cyan/10 shadow-sm'
                    : 'border-brand-gray/50 bg-white hover:border-brand-gray hover:shadow'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group"
                  aria-expanded={openIndex === index}
                >
                  <span className="font-semibold text-brand-dark pr-8 text-[17px]">
                    {faq.question}
                  </span>

                  <motion.div
                    animate={{
                      rotate: openIndex === index ? 180 : 0,
                    }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="shrink-0 text-brand-muted group-hover:text-brand-blue transition-colors"
                  >
                    <ChevronDown size={22} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: 'auto', 
                        opacity: 1 
                      }}
                      exit={{ 
                        height: 0, 
                        opacity: 0 
                      }}
                      transition={{
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                    >
                      <div className="px-6 pb-6 text-brand-muted leading-relaxed text-[15.5px]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}