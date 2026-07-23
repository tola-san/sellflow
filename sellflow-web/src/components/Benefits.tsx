import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  BellRing,
  Check,
  Clock3,
  Quote,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "./Auth/AuthContext";

const outcomes = [
  {
    number: "01",
    eyebrow: "Move faster",
    title: "Launch in minutes, not weeks.",
    description:
      "Skip hosting, plugins, and technical setup. Add your details and products, then publish a storefront that is ready for customers.",
    metric: "0 code",
    metricLabel: "required to launch",
    icon: Clock3,
    accent: "bg-violet-100 text-violet-700",
  },
  {
    number: "02",
    eyebrow: "Stay in control",
    title: "Never lose an order in chat.",
    description:
      "Every customer order enters one clear queue with its payment and fulfillment status, so the next action is always obvious.",
    metric: "1 queue",
    metricLabel: "for every order",
    icon: BellRing,
    accent: "bg-sky-100 text-sky-700",
  },
  {
    number: "03",
    eyebrow: "Grow with clarity",
    title: "Know what is selling today.",
    description:
      "See revenue, order activity, and product performance without maintaining a spreadsheet or piecing reports together.",
    metric: "Live",
    metricLabel: "business visibility",
    icon: TrendingUp,
    accent: "bg-emerald-100 text-emerald-700",
  },
];

export function Benefits() {
  const reduceMotion = useReducedMotion();
  const { openAuth } = useAuth();

  return (
    <section
      id="benefits"
      aria-labelledby="benefits-heading"
      className="relative overflow-hidden border-y border-slate-200 bg-white py-24 sm:py-28 lg:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-52 top-24 h-[520px] w-[520px] rounded-full bg-violet-100/70 blur-[130px]"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 xl:gap-28">
          <motion.header
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Why Sellflow
            </span>

            <h2
              id="benefits-heading"
              className="mt-6 max-w-xl text-4xl font-medium leading-[1.04] tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-[3.6rem]"
            >
              Less busywork.
              <span className="font-editorial block text-violet-700">More business.</span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Sellflow removes the operational noise between a customer discovering your products
              and you completing their order.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs font-semibold text-slate-600">
              {["Mobile-ready", "Secure by default", "Simple to manage"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {item}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => openAuth("register")}
              className="group mt-9 inline-flex h-12 items-center gap-3 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
            >
              Start selling free
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" aria-hidden="true" />
            </button>
          </motion.header>

          <div className="border-t border-slate-200">
            {outcomes.map((outcome, index) => {
              const Icon = outcome.icon;

              return (
                <motion.article
                  key={outcome.number}
                  initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className="group border-b border-slate-200 py-8 sm:py-10"
                >
                  <div className="grid gap-6 sm:grid-cols-[auto_1fr_auto] sm:items-start">
                    <div className="flex items-center gap-3 sm:block">
                      <span className="text-xs font-bold tracking-[0.18em] text-slate-300">
                        {outcome.number}
                      </span>
                      <span
                        className={`grid h-11 w-11 place-items-center rounded-2xl transition-transform duration-300 group-hover:-rotate-6 sm:mt-5 ${outcome.accent}`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </div>

                    <div className="sm:px-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-violet-600">
                        {outcome.eyebrow}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-3xl">
                        {outcome.title}
                      </h3>
                      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                        {outcome.description}
                      </p>
                    </div>

                    <div className="min-w-28 border-l-2 border-violet-200 pl-4 sm:mt-7 sm:text-right">
                      <p className="text-xl font-bold tracking-tight text-slate-950">{outcome.metric}</p>
                      <p className="mt-1 max-w-24 text-[10px] font-medium leading-4 text-slate-400 sm:ml-auto">
                        {outcome.metricLabel}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.65 }}
          className="relative mt-16 overflow-hidden rounded-[28px] bg-slate-950 px-6 py-9 text-white sm:px-10 sm:py-11 lg:mt-20 lg:px-14"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-violet-600/40 blur-[90px]"
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-[auto_1fr_auto] lg:gap-10">
            <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.07] text-violet-300">
              <Quote className="h-6 w-6" aria-hidden="true" />
            </span>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
                The seller experience
              </p>
              <blockquote className="mt-3 max-w-3xl text-xl font-medium leading-8 tracking-[-0.025em] text-white sm:text-2xl sm:leading-9">
                “I can see what was ordered, who ordered it, and exactly what needs to happen next.”
              </blockquote>
            </div>

            <div className="flex gap-7 border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0">
              <div>
                <BarChart3 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                <p className="mt-2 text-xs font-semibold text-white">Clear insights</p>
              </div>
              <div>
                <ShieldCheck className="h-5 w-5 text-sky-400" aria-hidden="true" />
                <p className="mt-2 text-xs font-semibold text-white">Less risk</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
