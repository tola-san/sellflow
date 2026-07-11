import React from 'react';
import { Check, Star } from 'lucide-react';
import { FadeIn } from './ui/FadeIn';
import { GlassCard } from './ui/GlassCard';

const tiers = [
  {
    name: 'Starter (ដំបូង)',
    price: '9',
    description: 'ល្អឥតខ្ចោះសម្រាប់អ្នកលក់ថ្មីថ្មោងដែលទើបតែចាប់ផ្ដើម។',
    features: [
      'ហាងអនឡាញ ១ (1 Store)',
      '៥០០ ការបញ្ជាទិញ/ខែ',
      'ប្រព័ន្ធបង្កើតកាតាឡុកផលិតផល',
      'របាយការណ៍កម្រិតដំបូង',
      'គាំទ្រនិងជំនួយតាមអ៊ីមែល'
    ],
    cta: 'សាកល្បងឥតគិតថ្លៃ',
    highlighted: false
  },
  {
    name: 'Business (អាជីវកម្ម)',
    price: '19',
    description: 'គ្រប់យ៉ាងដែលអ្នកត្រូវការដើម្បីពង្រីកអាជីវកម្មឱ្យកាន់តែរីកចម្រើន។',
    features: [
      'ហាងអនឡាញ ៣ (3 Stores)',
      '២,០០០ ការបញ្ជាទិញ/ខែ',
      'ប្រព័ន្ធជូនដំណឹងតាម Telegram',
      'របាយការណ៍លម្អិតឆ្លាតវៃ',
      'ទទួលបានការដោះស្រាយអាទិភាពមុនគេ'
    ],
    cta: 'សាកល្បងឥតគិតថ្លៃ',
    highlighted: true
  },
  {
    name: 'Pro (កម្រិតខ្ពស់)',
    price: '49',
    description: 'សម្រាប់អ្នកលក់ដាច់ខ្លាំង (High-volume) ដែលត្រូវការមុខងារពេញលេញបំផុត។',
    features: [
      'ហាងអនឡាញមិនកំណត់',
      'ការបញ្ជាទិញមិនកំណត់',
      'ភ្ជាប់ Domain ផ្ទាល់ខ្លួនបាន',
      'ប្រព័ន្ធដោតភ្ជាប់ API Access',
      'ក្រុមការងារជំនួយផ្ទាល់ខ្លួន ២៤/៧'
    ],
    cta: 'ទាក់ទងផ្នែកលក់',
    highlighted: false
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-brand-bg relative">
      {/* Background Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4  leading-tight">
              គម្រោងតម្លៃងាយស្រួល និងតម្លាភាព
            </h2>
            <p className="text-base sm:text-lg text-brand-muted">
              ចាប់ផ្ដើមសាកល្បងដោយឥតគិតថ្លៃ ដំឡើងគម្រោងនៅពេលអាជីវកម្មរបស់អ្នករីកធំធាត់។ គ្មានការគិតថ្លៃលាក់កំបាំងឡើយ។
            </p>
          </FadeIn>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {tiers.map((tier, index) => (
            <FadeIn key={index} delay={index * 0.15} className="h-full">
              <GlassCard
                className={`p-8 h-full flex flex-col relative ${
                  tier.highlighted 
                    ? 'border-brand-blue shadow-xl shadow-brand-blue/10 md:-translate-y-4 md:scale-105 bg-white/90' 
                    : 'border-brand-gray/50'
                }`}
              >
                {/* ផ្លាកពេញនិយមបំផុត */}
                {tier.highlighted && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                    ពេញនិយមបំផុត
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-brand-dark mb-2 ">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-brand-muted mb-6 h-12 leading-relaxed">
                    {tier.description}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-brand-dark">
                      ${tier.price}
                    </span>
                    <span className="text-brand-muted text-sm font-medium">/ខែ</span>
                  </div>

                {/* Features List */}
                <ul className="flex-1 space-y-4 mb-8">
                  {tier.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-brand-cyan flex items-center justify-center shrink-0">
                        <Check
                          size={12}
                          className="text-brand-blue"
                          strokeWidth={3}
                        />
                      </div>
                      <span className="text-brand-dark text-sm leading-normal">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    tier.highlighted 
                      ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg' 
                      : 'bg-brand-gray/20 text-brand-dark hover:bg-brand-gray/40'
                  }`}
                >
                  {tier.cta}
                </button>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}