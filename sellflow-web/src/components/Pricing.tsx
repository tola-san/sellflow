import React from 'react';
import { Check } from 'lucide-react';
import { FadeIn } from './ui/FadeIn';
import { GlassCard } from './ui/GlassCard';
const tiers = [
{
  name: 'Starter',
  price: '9',
  description: 'Perfect for new sellers just getting started.',
  features: [
  '1 Store',
  '500 Orders per month',
  'Product Catalog',
  'Basic Analytics',
  'Email Support'],

  cta: 'Start Free Trial',
  highlighted: false
},
{
  name: 'Business',
  price: '19',
  description: 'Everything you need to scale your growing business.',
  features: [
  '3 Stores',
  '2,000 Orders per month',
  'Telegram Notifications',
  'Advanced Analytics',
  'Priority Support'],

  cta: 'Start Free Trial',
  highlighted: true
},
{
  name: 'Pro',
  price: '49',
  description: 'For high-volume sellers who need maximum power.',
  features: [
  'Unlimited Stores',
  'Unlimited Orders',
  'Custom Domain',
  'API Access',
  '24/7 Dedicated Support'],

  cta: 'Contact Sales',
  highlighted: false
}];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-brand-bg relative">
      {/* Background Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-brand-muted">
              Start for free, upgrade when you need more power. No hidden fees.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {tiers.map((tier, index) =>
          <FadeIn key={index} delay={index * 0.15} className="h-full">
              <GlassCard
              className={`p-8 h-full flex flex-col relative ${tier.highlighted ? 'border-brand-blue shadow-xl shadow-brand-blue/10 md:-translate-y-4 md:scale-105 bg-white/90' : 'border-brand-gray/50'}`}>
              
                {tier.highlighted &&
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
              }

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-brand-dark mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-brand-muted mb-6 h-10">
                    {tier.description}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-brand-dark">
                      ${tier.price}
                    </span>
                    <span className="text-brand-muted font-medium">/month</span>
                  </div>
                </div>

                <ul className="flex-1 space-y-4 mb-8">
                  {tier.features.map((feature, fIndex) =>
                <li key={fIndex} className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-brand-cyan flex items-center justify-center shrink-0">
                        <Check
                      size={12}
                      className="text-brand-blue"
                      strokeWidth={3} />
                    
                      </div>
                      <span className="text-brand-dark text-sm">{feature}</span>
                    </li>
                )}
                </ul>

                <button
                className={`w-full py-3 rounded-xl font-semibold transition-all ${tier.highlighted ? 'bg-brand-blue text-white hover:bg-blue-500 shadow-md hover:shadow-lg' : 'bg-brand-gray/20 text-brand-dark hover:bg-brand-gray/40'}`}>
                
                  {tier.cta}
                </button>
              </GlassCard>
            </FadeIn>
          )}
        </div>
      </div>
    </section>);

}