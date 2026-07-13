import React from 'react';
import { Check } from 'lucide-react';
import { FadeIn } from './ui/FadeIn';
import { GlassCard } from './ui/GlassCard';

const tiers = [
  {
    name: 'Starter (ដំបូង)',
    price: '9',
    description:
      'ល្អឥតខ្ចោះសម្រាប់អ្នកលក់ថ្មីថ្មោងដែលទើបតែចាប់ផ្ដើម។',
    features: [
      'ហាងអនឡាញ ១ (1 Store)',
      '៥០០ ការបញ្ជាទិញ/ខែ',
      'ប្រព័ន្ធបង្កើតកាតាឡុកផលិតផល',
      'របាយការណ៍កម្រិតដំបូង',
      'គាំទ្រនិងជំនួយតាមអ៊ីមែល',
    ],
    cta: 'សាកល្បងឥតគិតថ្លៃ',
    highlighted: false,
    gradient: 'from-blue-50/80 via-white to-white',
  },
  {
    name: 'Business (អាជីវកម្ម)',
    price: '19',
    description:
      'គ្រប់យ៉ាងដែលអ្នកត្រូវការដើម្បីពង្រីកអាជីវកម្មឱ្យកាន់តែរីកចម្រើន។',
    features: [
      'ហាងអនឡាញ ៣ (3 Stores)',
      '២,០០០ ការបញ្ជាទិញ/ខែ',
      'ប្រព័ន្ធជូនដំណឹងតាម Telegram',
      'របាយការណ៍លម្អិតឆ្លាតវៃ',
      'ទទួលបានការដោះស្រាយអាទិភាពមុនគេ',
    ],
    cta: 'សាកល្បងឥតគិតថ្លៃ',
    highlighted: true,
    gradient: 'from-purple-50/80 via-violet-50/70 to-white',
  },
  {
    name: 'Pro (កម្រិតខ្ពស់)',
    price: '49',
    description:
      'សម្រាប់អ្នកលក់ដាច់ខ្លាំង (High-volume) ដែលត្រូវការមុខងារពេញលេញបំផុត។',
    features: [
      'ហាងអនឡាញមិនកំណត់',
      'ការបញ្ជាទិញមិនកំណត់',
      'ភ្ជាប់ Domain ផ្ទាល់ខ្លួនបាន',
      'ប្រព័ន្ធដោតភ្ជាប់ API Access',
      'ក្រុមការងារជំនួយផ្ទាល់ខ្លួន ២៤/៧',
    ],
    cta: 'ទាក់ទងផ្នែកលក់',
    highlighted: false,
    gradient: 'from-emerald-50/80 via-teal-50/70 to-white',
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-brand-bg py-24"
    >
      {/* Background accent */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-full max-w-5xl -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-blue/5 to-purple-500/5 blur-[120px]" />

      <div className="container relative z-10 mx-auto px-6">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <FadeIn>
            <h2 className="mb-4 text-3xl font-bold leading-tight text-brand-dark md:text-4xl">
              គម្រោងតម្លៃងាយស្រួល និងតម្លាភាព
            </h2>

            <p className="text-base text-brand-muted sm:text-lg">
              ចាប់ផ្ដើមសាកល្បងដោយឥតគិតថ្លៃ
              ដំឡើងគម្រោងនៅពេលអាជីវកម្មរបស់អ្នករីកធំធាត់។
              គ្មានការគិតថ្លៃលាក់កំបាំងឡើយ។
            </p>
          </FadeIn>
        </div>

        {/* Pricing grid */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 md:grid-cols-3">
          {tiers.map((tier, index) => (
            <FadeIn
              key={tier.name}
              delay={index * 0.15}
              className="h-full"
            >
              <GlassCard
                className={`group relative flex h-full flex-col overflow-hidden border border-white/60 p-8 transition-all duration-500 hover:-translate-y-2 ${
                  tier.highlighted
                    ? 'shadow-2xl shadow-purple-500/20 md:scale-105'
                    : 'hover:shadow-xl'
                }`}
              >
                {/* Soft gradient background */}
                <div
                  className={`absolute inset-0 -z-10 bg-gradient-to-br ${tier.gradient}`}
                />

                {/* Highlighted card glow */}
                {tier.highlighted && (
                  <div className="absolute -inset-[1px] -z-20 rounded-3xl bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 opacity-20 transition-opacity group-hover:opacity-40" />
                )}

                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-8">
                    <h3 className="mb-2 text-2xl font-bold text-brand-dark transition-colors group-hover:text-brand-blue">
                      {tier.name}
                    </h3>

                    <p className="mb-6 min-h-[48px] text-sm leading-relaxed text-brand-muted">
                      {tier.description}
                    </p>

                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-extrabold tracking-tighter text-brand-dark">
                        ${tier.price}
                      </span>

                      <span className="text-sm font-medium text-brand-muted">
                        /ខែ
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="mb-10 flex-1 space-y-4">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white bg-white/80 shadow-sm">
                          <Check
                            size={13}
                            className="text-emerald-600"
                            strokeWidth={3.5}
                          />
                        </div>

                        <span className="text-[15px] leading-normal text-brand-dark">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    type="button"
                    className={`mt-auto w-full rounded-2xl py-3.5 text-sm font-semibold transition-all duration-300 ${
                      tier.highlighted
                        ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:brightness-110 hover:shadow-xl hover:shadow-purple-500/40'
                        : 'border border-brand-dark/10 bg-white text-brand-dark hover:bg-slate-100 hover:text-brand-dark'
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