import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FadeIn } from './ui/FadeIn';
const faqs = [
{
  question: 'Can I connect Facebook?',
  answer:
  'Yes! SellFlow integrates seamlessly with Facebook, Instagram, and TikTok. You can manage all your orders from these platforms in one unified dashboard.'
},
{
  question: 'Can I receive Telegram notifications?',
  answer:
  'Absolutely. Our Telegram integration is one of our most popular features. You can set it up in seconds to receive instant alerts for new orders, payments, and customer messages.'
},
{
  question: 'Do I need technical knowledge?',
  answer:
  'Not at all. SellFlow is designed specifically for non-technical users. If you can use social media, you can use SellFlow. Setting up your store takes less than 5 minutes.'
},
{
  question: 'Is there a free trial?',
  answer:
  'Yes, we offer a 14-day free trial on all our plans. No credit card is required to sign up, so you can explore all features risk-free.'
}];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <section id="faq" className="py-24 bg-brand-bg">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-brand-muted">
              Everything you need to know about SellFlow.
            </p>
          </FadeIn>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) =>
          <FadeIn key={index} delay={index * 0.1}>
              <div
              className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${openIndex === index ? 'border-brand-blue bg-brand-cyan/10' : 'border-brand-gray/50 bg-white hover:border-brand-gray'}`}>
              
                <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                aria-expanded={openIndex === index}>
                
                  <span className="font-semibold text-brand-dark pr-8">
                    {faq.question}
                  </span>
                  <motion.div
                  animate={{
                    rotate: openIndex === index ? 180 : 0
                  }}
                  transition={{
                    duration: 0.3,
                    ease: 'easeInOut'
                  }}
                  className="shrink-0 text-brand-muted">
                  
                    <ChevronDown size={20} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === index &&
                <motion.div
                  initial={{
                    height: 0,
                    opacity: 0
                  }}
                  animate={{
                    height: 'auto',
                    opacity: 1
                  }}
                  exit={{
                    height: 0,
                    opacity: 0
                  }}
                  transition={{
                    duration: 0.3,
                    ease: 'easeInOut'
                  }}>
                  
                      <div className="px-6 pb-5 text-brand-muted leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                }
                </AnimatePresence>
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>);

}