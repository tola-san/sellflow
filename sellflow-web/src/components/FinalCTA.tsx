import React from "react";
import { ArrowRight, Sparkles, Users, Clock } from "lucide-react";
import { FadeIn } from "./ui/FadeIn";

export function FinalCTA() {
  return (
    <section className="py-28 bg-zinc-50 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <FadeIn>
          <div className="max-w-5xl mx-auto">
            {/* Decorative Line Connections */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand/30 to-transparent hidden lg:block" />
            
            <div className="bg-white border border-zinc-100 rounded-3xl p-12 md:p-20 text-center shadow-xl relative overflow-hidden">
              {/* Background Accents */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-12 -left-24 w-[500px] h-[500px] bg-cyan-100/60 rounded-full blur-[120px]" />
                <div className="absolute bottom-12 -right-24 w-[500px] h-[500px] bg-purple-100/60 rounded-full blur-[120px]" />
              </div>

              {/* Connecting Lines */}
              <div className="absolute top-8 left-12 w-6 h-6 border border-brand/30 rounded-full hidden lg:block" />
              <div className="absolute top-8 right-12 w-6 h-6 border border-brand/30 rounded-full hidden lg:block" />
              <div className="absolute bottom-12 left-1/3 w-6 h-6 border border-brand/30 rounded-full hidden lg:block" />
              <div className="absolute bottom-12 right-1/3 w-6 h-6 border border-brand/30 rounded-full hidden lg:block" />

              {/* Social Proof */}
              <div className="flex items-center justify-center gap-6 md:gap-8 mb-10 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-500" />
                  <span>4,872+ sellers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-500" />
                  <span>Setup in 5 mins</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>4.9/5 rating</span>
                </div>
              </div>

              <div className="relative z-10">
                <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-zinc-900 mb-6">
                  Start Selling Smarter<br />
                  Today
                </h2>

                <p className="text-xl md:text-2xl text-zinc-600 max-w-2xl mx-auto mb-12">
                  Join thousands of growing businesses using{" "}
                  <span className="font-semibold text-brand">SellFlow</span>. 
                  Powerful tools. Simple setup. Real results.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="#pricing"
                    className="group w-full sm:w-auto px-10 py-4.5 rounded-2xl bg-brand text-white font-semibold text-lg flex items-center justify-center gap-3 hover:bg-brand-dark transition-all duration-300 shadow-lg shadow-brand/30 hover:shadow-xl hover:shadow-brand/40"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>

                  <a
                    href="#demo"
                    className="w-full sm:w-auto px-8 py-4.5 rounded-2xl border-2 border-zinc-900 text-zinc-900 font-medium flex items-center justify-center gap-2 hover:bg-zinc-900 hover:text-white transition-all"
                  >
                    Watch Demo
                  </a>
                </div>

                <div className="mt-10 flex items-center justify-center gap-6 text-sm text-zinc-500">
                  <div>14-day free trial</div>
                  <div className="w-px h-3 bg-zinc-300" />
                  <div>No credit card required</div>
                  <div className="w-px h-3 bg-zinc-300" />
                  <div>Cancel anytime</div>
                </div>
              </div>
            </div>

            {/* Trust Bar */}
            <div className="mt-12 text-center">
              <p className="text-xs uppercase tracking-[2px] text-zinc-400 mb-6">Trusted at</p>
              <div className="flex justify-center items-center gap-12 text-xl font-semibold text-zinc-400">
                <div>Shopify</div>
                <div>Etsy</div>
                <div>Amazon</div>
                <div>WooCommerce</div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}