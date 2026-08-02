import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Clock3,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DotField } from "./ui/DotField";
import {
  billingService,
  type BillingCycle,
  type SubscriptionPlan,
} from "../Services/billing";

const fallbackPlans: SubscriptionPlan[] = [
  { id: -1, name: "Starter", slug: "starter", description: "Essential tools for a small business starting online.", monthly_price: "6.00", yearly_price: "60.00", currency: "USD", limits: { businesses: 1, staff: 1, products: 100 }, features: { inventory: "basic", telegram_notifications: true, restaurant_qr: false, analytics_history_days: 30, custom_domain: false, priority_support: false }, is_popular: false },
  { id: -2, name: "Growth", slug: "growth", description: "Advanced operations for a growing store or restaurant.", monthly_price: "12.00", yearly_price: "120.00", currency: "USD", limits: { businesses: 1, staff: 5, products: null }, features: { inventory: "advanced", telegram_notifications: true, restaurant_qr: true, analytics_history_days: 365, custom_domain: false, priority_support: false }, is_popular: true },
  { id: -3, name: "Pro", slug: "pro", description: "Multiple businesses, unlimited insights, and priority support.", monthly_price: "25.00", yearly_price: "250.00", currency: "USD", limits: { businesses: 3, staff: 15, products: null }, features: { inventory: "advanced", telegram_notifications: true, restaurant_qr: true, analytics_history_days: null, custom_domain: true, priority_support: true }, is_popular: false },
];

export function Pricing() {
  const navigate = useNavigate();
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadPlans = () => {
    setLoading(true);
    setError(false);
    billingService.getPlans()
      .then(setPlans)
      .catch(() => {
        setPlans(fallbackPlans);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const startTrial = (plan: SubscriptionPlan) => {
    navigate(`/register?plan=${plan.slug}&billing=${cycle}`);
  };

  return (
    <section id="pricing" className="relative overflow-hidden bg-[#f8f7fb] py-20 sm:py-28">
      <DotField gap={36} className="opacity-40 [mask-image:radial-gradient(circle_at_50%_32%,black,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,_rgba(116,88,220,0.16),_transparent_62%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(99,78,140,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(99,78,140,.08)_1px,transparent_1px)] [background-size:110px_110px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ded6f5] bg-white px-3 py-1.5 text-[10px] font-semibold text-[#6954d0] shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            30-day Growth trial
          </div>
          <h2 className="mt-5 text-4xl font-medium leading-[1.06] tracking-[-.05em] text-[#18171d] md:text-6xl">
            Simple pricing.<br /><span className="text-[#735bd6]">Built to grow with you.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#746f7b] sm:text-base">
            Explore every Growth feature for 30 days. No card required, no setup fee, and your business data stays yours.
          </p>
          <CycleToggle cycle={cycle} onChange={setCycle} />
        </motion.div>

        {loading ? (
          <PricingSkeleton />
        ) : (
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                cycle={cycle}
                onStart={() => startTrial(plan)}
              />
            ))}
          </div>
        )}

        {error && <button type="button" onClick={loadPlans} className="mx-auto mt-5 flex items-center gap-2 text-xs font-medium text-[#746f7b] transition hover:text-[#6954d0]"><RefreshCw className="h-3.5 w-3.5" /> Refresh live pricing</button>}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
          {["No card required", "Cancel anytime", "Data preserved after expiry"].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-emerald-600" />
              {item}
            </span>
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-2xl border border-[#ddd4f4] bg-white/75 px-4 py-3.5 text-left shadow-sm backdrop-blur">
          <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#7058d4]" />
          <p className="text-xs leading-5 text-[#514565]">
            Your trial begins with <strong>Growth</strong>. After 30 days, select Starter, Growth, or Pro to keep full access.
          </p>
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  plan,
  cycle,
  onStart,
}: {
  plan: SubscriptionPlan;
  cycle: BillingCycle;
  onStart: () => void;
}) {
  const yearly = cycle === "yearly";
  const price = Number(yearly ? plan.yearly_price : plan.monthly_price);
  const features = planFeatures(plan);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -7 }}
      className={`relative flex h-full flex-col overflow-hidden rounded-[22px] border bg-white p-6 shadow-[0_20px_55px_-40px_rgba(66,45,112,.5)] transition duration-300 hover:shadow-[0_30px_65px_-35px_rgba(82,54,145,.5)] sm:p-7 ${
        plan.is_popular
          ? "border-[#745bd8] bg-gradient-to-b from-[#f5f1ff] to-white ring-4 ring-[#ece7ff] md:col-span-2 lg:col-span-1 lg:-translate-y-3"
          : "border-[#e4e0ea]"
      }`}
    >
      {plan.is_popular && (
        <span className="absolute right-5 top-5 rounded-full bg-[#6c55d2] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white shadow-lg shadow-violet-200">
          Most popular
        </span>
      )}

      <div>
        <h3 className="text-xl font-bold text-slate-950">{plan.name}</h3>
        <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">{plan.description}</p>
      </div>

      <div className="mt-6">
        <div className="flex items-end gap-1">
          <span className="text-5xl font-medium tracking-[-.06em] text-[#19171e]">${price.toFixed(0)}</span>
          <span className="pb-1 text-sm text-slate-500">/{yearly ? "year" : "month"}</span>
        </div>
        <p className={`mt-1.5 min-h-5 text-xs font-medium ${yearly ? "text-emerald-600" : "text-slate-400"}`}>
          {yearly
            ? `${money(price / 12)}/month equivalent · 2 months free`
            : "Billed monthly after your free trial"}
        </p>
      </div>

      <button
        type="button"
        onClick={onStart}
        className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
          plan.is_popular
            ? "bg-[#6c55d2] text-white shadow-lg shadow-violet-200 hover:bg-[#5943bd]"
            : "border border-[#ded9e7] text-[#27232d] hover:border-[#c7bae0] hover:bg-[#f8f5fc]"
        }`}
      >
        Start 30-day free trial
        <ArrowRight className="h-4 w-4" />
      </button>

      <div className="my-6 border-t border-slate-100" />

      <div className="mb-4 grid grid-cols-3 gap-2">
        <PlanLimit label="Businesses" value={limitLabel(plan.limits.businesses)} />
        <PlanLimit label="Staff" value={limitLabel(plan.limits.staff)} />
        <PlanLimit label="Products" value={limitLabel(plan.limits.products)} />
      </div>

      <ul className="flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature.label} className="flex items-start gap-3 text-sm">
            <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
              feature.included ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
            }`}>
              {feature.included ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            </span>
            <span className={feature.included ? "text-slate-600" : "text-slate-400"}>{feature.label}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

function PlanLimit({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#f7f5fa] px-2 py-3 text-center">
      <p className="text-sm font-bold text-slate-900">{value}</p>
      <p className="mt-0.5 truncate text-[9px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  );
}

function CycleToggle({
  cycle,
  onChange,
}: {
  cycle: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}) {
  return (
    <div className="mt-7 inline-flex rounded-full border border-[#ded9e8] bg-white p-1 shadow-sm">
      {(["monthly", "yearly"] as const).map((option) => (
        <button
          type="button"
          key={option}
          onClick={() => onChange(option)}
          className={`rounded-full px-4 py-2 text-xs font-semibold capitalize transition ${
            cycle === option ? "bg-[#6c55d2] text-white shadow-sm" : "text-slate-500 hover:bg-[#f4f0fa]"
          }`}
        >
          {option}
          {option === "yearly" && (
            <span className={`ml-1.5 text-[9px] ${cycle === option ? "text-emerald-400" : "text-emerald-600"}`}>
              Save 17%
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function PricingSkeleton() {
  return (
    <div className="mt-14 grid animate-pulse gap-5 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-[590px] rounded-2xl border border-slate-200 bg-white" />
      ))}
    </div>
  );
}

function planFeatures(plan: SubscriptionPlan): Array<{ label: string; included: boolean }> {
  const analytics = plan.features.analytics_history_days === null
    ? "Unlimited analytics history"
    : plan.features.analytics_history_days === 365
      ? "1 year analytics history"
      : `${plan.features.analytics_history_days} days analytics history`;

  return [
    { label: `${titleCase(plan.features.inventory)} inventory management`, included: true },
    { label: "Telegram notifications", included: plan.features.telegram_notifications },
    { label: "Restaurant QR ordering", included: plan.features.restaurant_qr },
    { label: analytics, included: true },
    { label: "Custom domain", included: plan.features.custom_domain },
    { label: "Priority support", included: plan.features.priority_support },
  ];
}

function limitLabel(value: number | null): string {
  return value === null ? "∞" : value.toLocaleString();
}

function money(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function titleCase(value: string): string {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
