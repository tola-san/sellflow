import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FadeIn } from './ui/FadeIn';

const faqs = [
  {
    question: 'Can I connect with Facebook?',
    answer:
      'Yes! SellFlow integrates seamlessly with Facebook, Instagram, and TikTok. You can manage all orders from these platforms in a single dashboard.',
  },
  {
    question: 'Can I receive notifications via Telegram?',
    answer:
      'Absolutely. Our Telegram integration is one of our most popular features. You can set it up in a few seconds to get instant notifications for new orders, payments, and customer messages.',
  },
  {
    question: 'Do I need technical knowledge?',
    answer:
      'Not at all. SellFlow is designed for non-tech users. If you can use social media, you can use SellFlow. Setting up your store takes less than 5 minutes.',
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Yes. We offer a 14-day free trial on all plans. No credit card required, so you can test all features risk-free.',
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
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-brand-muted">
              Everything you need to know about SellFlow
            </p>
          </FadeIn>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FadeIn key={index} delay={index * 0.08}>
              <div
                className={`border rounded-xl overflow-hidden transition-all duration-300 ${
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