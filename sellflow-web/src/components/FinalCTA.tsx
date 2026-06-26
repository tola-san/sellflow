import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FadeIn } from './ui/FadeIn';
export function FinalCTA() {
  return (
    <section className="py-24 bg-brand-bg relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <FadeIn>
          <div className="max-w-6xl mx-auto bg-brand-dark rounded-2xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-blue/30 blur-[100px] rounded-full mix-blend-screen" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 blur-[100px] rounded-full mix-blend-screen" />
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Start Selling Smarter Today
              </h2>
              <p className="text-lg md:text-xl text-brand-gray/80 mb-10 max-w-2xl mx-auto">
                Join thousands of sellers who are growing their business with
                SellFlow. Setup takes less than 5 minutes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#pricing"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-blue text-white font-semibold hover:bg-blue-500 transition-all shadow-lg shadow-brand-blue/25 hover:shadow-xl hover:shadow-brand-blue/30 flex items-center justify-center gap-2 group">
                  
                  Get Started Free
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform" />
                  
                </a>
              </div>
              <p className="text-sm text-brand-gray/60 mt-6">
                14-day free trial • No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>);

}