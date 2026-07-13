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
    highlighted: false,
    gradient: 'from-blue-50/80 via-white to-white'
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
    highlighted: true,
    gradient: 'from-purple-50/80 via-violet-50/70 to-white'
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
    highlighted: false,
    gradient: 'from-emerald-50/80 via-teal-50/70 to-white'
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-brand-bg relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-gradient-to-br from-brand-blue/5 to-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4 leading-tight">
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
                className={`relative h-full flex flex-col p-8 transition-all duration-500 hover:-translate-y-2 group overflow-hidden border border-white/60
                  ${tier.highlighted 
                    ? 'md:scale-105 shadow-2xl shadow-purple-500/20' 
                    : 'hover:shadow-xl'
                  }`}
                style={{
                  background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                }}
              >
                {/* Soft Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tier.gradient} -z-10`} />

                {/* Highlighted Tier Glow */}
                {tier.highlighted && (
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 rounded-3xl opacity-20 group-hover:opacity-40 transition-opacity -z-20" />
                )}

              
                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-brand-dark mb-2 transition-colors group-hover:text-brand-blue">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-brand-muted mb-6 min-h-[48px] leading-relaxed">
                      {tier.description}
                    </p>

                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-extrabold tracking-tighter text-brand-dark">
                        ${tier.price}
                      </span>
                      <span className="text-brand-muted text-sm font-medium">/ខែ</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="flex-1 space-y-4 mb-10">
                    {tier.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-white/80 flex items-center justify-center shrink-0 border border-white shadow-sm">
                          <Check size={13} className="text-emerald-600" strokeWidth={3.5} />
                        </div>
                        <span className="text-brand-dark text-[15px] leading-normal">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 mt-auto ${
                      tier.highlighted 
                        ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:brightness-110 hover:shadow-xl hover:shadow-purple-500/40' 
                        : 'bg-white text-brand-dark border border-brand-dark/10 hover:bg-slate-100 hover:text-dark'
                    }`}
                  >
                    {tier.cta}
                  </button>
                </div>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}