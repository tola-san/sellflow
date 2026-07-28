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
import {
  billingService,
  type BillingCycle,
  type SubscriptionPlan,
} from "../Services/billing";

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
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const startTrial = (plan: SubscriptionPlan) => {
    navigate(`/register?plan=${plan.slug}&billing=${cycle}`);
  };

  return (
    <section id="pricing" className="relative overflow-hidden bg-slate-50 py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.11),_transparent_65%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            30-day Growth trial
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Start free. Choose a plan when your trial ends.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Explore every Growth feature for 30 days. No card required, no setup fee, and your business data stays yours.
          </p>
          <CycleToggle cycle={cycle} onChange={setCycle} />
        </div>

        {loading ? (
          <PricingSkeleton />
        ) : error ? (
          <div className="mx-auto mt-14 max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <RefreshCw className="mx-auto h-6 w-6 text-slate-400" />
            <h3 className="mt-3 font-semibold text-slate-900">Pricing is temporarily unavailable</h3>
            <p className="mt-1 text-sm text-slate-500">Try loading the current plans again.</p>
            <button
              type="button"
              onClick={loadPlans}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
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

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
          {["No card required", "Cancel anytime", "Data preserved after expiry"].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-emerald-600" />
              {item}
            </span>
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-2xl border border-violet-200 bg-violet-50/70 px-4 py-3.5 text-left">
          <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
          <p className="text-xs leading-5 text-violet-900">
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
    <article
      className={`relative flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7 ${
        plan.is_popular
          ? "border-violet-500 ring-4 ring-violet-100 md:col-span-2 lg:col-span-1 lg:-translate-y-3 lg:hover:-translate-y-4"
          : "border-slate-200"
      }`}
    >
      {plan.is_popular && (
        <span className="absolute right-6 top-0 -translate-y-1/2 rounded-full bg-violet-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-lg shadow-violet-200">
          Most popular
        </span>
      )}

      <div>
        <h3 className="text-xl font-bold text-slate-950">{plan.name}</h3>
        <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">{plan.description}</p>
      </div>

      <div className="mt-6">
        <div className="flex items-end gap-1">
          <span className="text-4xl font-bold tracking-tight text-slate-950">${price.toFixed(0)}</span>
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
            ? "bg-violet-600 text-white shadow-lg shadow-violet-200 hover:bg-violet-700"
            : "border border-slate-200 text-slate-900 hover:border-slate-300 hover:bg-slate-50"
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
    </article>
  );
}

function PlanLimit({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-2 py-3 text-center">
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
    <div className="mt-7 inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      {(["monthly", "yearly"] as const).map((option) => (
        <button
          type="button"
          key={option}
          onClick={() => onChange(option)}
          className={`rounded-lg px-4 py-2 text-xs font-semibold capitalize transition ${
            cycle === option ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-50"
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
