import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  CreditCard,
  FileText,
  Package,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import {
  billingService,
  type BillingCycle,
  type BillingOverview,
  type SubscriptionPayment,
  type SubscriptionPlan,
  type UsageMetric,
} from "../Services/billing";
import { ErrorMessage } from "../components/dashboard/DashboardUI";

const featureLabels = [
  "Inventory management",
  "Telegram notifications",
  "Restaurant QR ordering",
  "Analytics history",
  "Custom domain",
  "Priority support",
] as const;

export function BillingPage() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [overview, setOverview] = useState<BillingOverview | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [payments, setPayments] = useState<SubscriptionPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    Promise.all([
      billingService.getOverview(),
      billingService.getPlans(),
      billingService.getPayments(),
    ])
      .then(([billingOverview, planList, paymentList]) => {
        setOverview(billingOverview);
        setPlans(planList);
        setPayments(paymentList);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <BillingSkeleton />;

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-6 pb-10">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-600">
            <CreditCard className="h-4 w-4" />
            Subscription
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-3xl">
            Billing & plan
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
            Review your trial, compare plans, and track subscription usage.
          </p>
        </div>
        <CycleToggle cycle={cycle} onChange={setCycle} />
      </header>

      <ErrorMessage error={error} />

      {overview && <SubscriptionSummary overview={overview} />}

      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-950">Choose the right plan</h2>
          <p className="mt-1 text-xs text-slate-500">Every new business starts with Growth features free for 30 days.</p>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              cycle={cycle}
              currentPlan={overview?.subscription.plan.slug}
              trialing={overview?.subscription.status === "trialing"}
            />
          ))}
        </div>
      </section>

      <PaymentHistory payments={payments} />
    </div>
  );
}

function SubscriptionSummary({ overview }: { overview: BillingOverview }) {
  const { subscription, usage } = overview;
  const trialProgress = useMemo(() => {
    if (!subscription.trial_started_at || !subscription.trial_ends_at) return 0;
    const start = new Date(subscription.trial_started_at).getTime();
    const end = new Date(subscription.trial_ends_at).getTime();
    const elapsed = Date.now() - start;
    return Math.max(0, Math.min(100, Math.round((elapsed / Math.max(end - start, 1)) * 100)));
  }, [subscription.trial_ends_at, subscription.trial_started_at]);
  const trialing = subscription.status === "trialing";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-950/[0.025]">
      <div className="grid xl:grid-cols-[minmax(300px,0.75fr)_minmax(0,1.25fr)]">
        <div className="border-b border-slate-100 bg-slate-950 p-5 text-white xl:border-b-0 xl:border-r sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Current access</p>
              <div className="mt-2 flex items-center gap-2">
                <h2 className="text-xl font-semibold">{subscription.plan.name}</h2>
                <span className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${
                  subscription.has_access ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-400/15 text-rose-300"
                }`}>
                  {statusLabel(subscription.status)}
                </span>
              </div>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-violet-300">
              <Sparkles className="h-5 w-5" />
            </span>
          </div>

          {trialing ? (
            <>
              <p className="mt-6 text-3xl font-semibold tracking-[-0.04em]">
                {subscription.trial_days_remaining}
                <span className="ml-2 text-sm font-medium text-slate-400">days left</span>
              </p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-violet-400" style={{ width: `${trialProgress}%` }} />
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                Trial ends {formatDate(subscription.trial_ends_at)}
              </p>
            </>
          ) : (
            <p className="mt-6 text-sm leading-6 text-slate-300">
              {subscription.has_access
                ? `Your plan renews ${formatDate(subscription.current_period_end)}.`
                : "Choose a paid plan to restore full business access."}
            </p>
          )}
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-950">Plan usage</h3>
              <p className="mt-0.5 text-[11px] text-slate-500">Current resources against your plan allowance</p>
            </div>
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <UsageCard label="Businesses" metric={usage.businesses} icon={<Building2 className="h-4 w-4" />} />
            <UsageCard label="Team members" metric={usage.staff} icon={<Users className="h-4 w-4" />} />
            <UsageCard label="Products" metric={usage.products} icon={<Package className="h-4 w-4" />} />
          </div>
        </div>
      </div>
    </section>
  );
}

function UsageCard({ label, metric, icon }: { label: string; metric: UsageMetric; icon: ReactNode }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex items-center justify-between text-slate-500">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-white shadow-sm">{icon}</span>
        <span className="text-[10px] font-semibold">{metric.unlimited ? "Unlimited" : `${metric.percent}%`}</span>
      </div>
      <p className="mt-4 text-lg font-semibold text-slate-950">
        {metric.used}
        <span className="text-xs font-medium text-slate-400"> / {metric.unlimited ? "∞" : metric.limit}</span>
      </p>
      <p className="mt-0.5 text-[11px] text-slate-500">{label}</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${(metric.percent ?? 0) >= 90 ? "bg-amber-500" : "bg-violet-500"}`}
          style={{ width: `${metric.unlimited ? 12 : metric.percent ?? 0}%` }}
        />
      </div>
    </article>
  );
}

function PlanCard({
  plan,
  cycle,
  currentPlan,
  trialing,
}: {
  plan: SubscriptionPlan;
  cycle: BillingCycle;
  currentPlan?: string;
  trialing?: boolean;
}) {
  const current = plan.slug === currentPlan;
  const price = Number(cycle === "monthly" ? plan.monthly_price : plan.yearly_price);
  const monthlyEquivalent = cycle === "yearly" ? price / 12 : price;
  const features = planFeatures(plan);

  return (
    <article className={`relative flex flex-col rounded-2xl border bg-white p-5 shadow-sm sm:p-6 ${
      plan.is_popular ? "border-violet-400 ring-2 ring-violet-100" : "border-slate-200"
    }`}>
      {plan.is_popular && (
        <span className="absolute right-5 top-0 -translate-y-1/2 rounded-full bg-violet-600 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white">
          Most popular
        </span>
      )}
      <div>
        <h3 className="text-lg font-semibold text-slate-950">{plan.name}</h3>
        <p className="mt-1 min-h-10 text-xs leading-5 text-slate-500">{plan.description}</p>
      </div>
      <div className="mt-5">
        <div className="flex items-end gap-1">
          <span className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">${monthlyEquivalent.toFixed(0)}</span>
          <span className="pb-1 text-xs text-slate-500">/month</span>
        </div>
        {cycle === "yearly" && (
          <p className="mt-1 text-[11px] font-medium text-emerald-600">${price.toFixed(0)} billed yearly · 2 months free</p>
        )}
      </div>
      <div className="my-5 border-t border-slate-100" />
      <ul className="flex-1 space-y-3">
        {features.map((feature) => (
          <li className="flex items-start gap-2.5 text-xs" key={feature.label}>
            <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${
              feature.included ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
            }`}>
              {feature.included ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
            </span>
            <span className={feature.included ? "text-slate-600" : "text-slate-400"}>{feature.value}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled
        title={current ? "This is your current plan." : "Connect a payment provider to enable plan changes."}
        className={`mt-6 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${
          current ? "bg-violet-50 text-violet-700" : "bg-slate-100 text-slate-500"
        }`}
      >
        {current ? (trialing ? "Current trial plan" : "Current plan") : "Payment setup required"}
        {!current && <ArrowRight className="h-4 w-4" />}
      </button>
    </article>
  );
}

function PaymentHistory({ payments }: { payments: SubscriptionPayment[] }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-950">Payment history</h2>
          <p className="mt-0.5 text-[11px] text-slate-500">Invoices and confirmed subscription payments</p>
        </div>
        <ReceiptText className="h-5 w-5 text-slate-400" />
      </div>
      {payments.length ? (
        <div className="divide-y divide-slate-100">
          {payments.map((payment) => (
            <div className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:px-6" key={payment.id}>
              <div>
                <p className="text-sm font-semibold text-slate-900">{payment.invoice_number}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{payment.plan?.name} · {formatDate(payment.created_at)}</p>
              </div>
              <span className="justify-self-start rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold uppercase text-slate-600 sm:justify-self-end">
                {payment.status}
              </span>
              <p className="text-sm font-semibold text-slate-950">${Number(payment.amount).toFixed(2)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-6 py-12 text-center">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-500">
            <FileText className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-slate-900">No payments yet</p>
          <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
            Your invoices and subscription payments will appear here after payment collection is connected.
          </p>
        </div>
      )}
    </section>
  );
}

function CycleToggle({ cycle, onChange }: { cycle: BillingCycle; onChange: (cycle: BillingCycle) => void }) {
  return (
    <div className="inline-flex self-start rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      {(["monthly", "yearly"] as const).map((option) => (
        <button
          type="button"
          key={option}
          onClick={() => onChange(option)}
          className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize transition ${
            cycle === option ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          {option}
          {option === "yearly" && <span className="ml-1.5 text-[9px] text-emerald-400">Save 17%</span>}
        </button>
      ))}
    </div>
  );
}

function planFeatures(plan: SubscriptionPlan): Array<{ label: string; value: string; included: boolean }> {
  return [
    {
      label: featureLabels[0],
      value: `${titleCase(plan.features.inventory)} inventory`,
      included: true,
    },
    {
      label: featureLabels[1],
      value: "Telegram notifications",
      included: plan.features.telegram_notifications,
    },
    {
      label: featureLabels[2],
      value: "Restaurant QR ordering",
      included: plan.features.restaurant_qr,
    },
    {
      label: featureLabels[3],
      value: plan.features.analytics_history_days
        ? `${plan.features.analytics_history_days === 365 ? "1 year" : `${plan.features.analytics_history_days} days`} analytics`
        : "Unlimited analytics history",
      included: true,
    },
    {
      label: featureLabels[4],
      value: "Custom domain",
      included: plan.features.custom_domain,
    },
    {
      label: featureLabels[5],
      value: "Priority support",
      included: plan.features.priority_support,
    },
  ];
}

function BillingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-16 max-w-xl rounded-xl bg-slate-100" />
      <div className="h-64 rounded-2xl bg-slate-100" />
      <div className="grid gap-4 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => <div className="h-[520px] rounded-2xl bg-slate-100" key={index} />)}
      </div>
    </div>
  );
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function statusLabel(status: string): string {
  return titleCase(status.replace("_", " "));
}

function titleCase(value: string): string {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
