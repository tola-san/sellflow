import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  Package,
  QrCode,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Upload,
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
import bankQrCode from "../assets/images/qrcode-bakong/sellflow-subscription-qr.png";

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
  const [checkoutPlan, setCheckoutPlan] = useState<SubscriptionPlan | null>(null);
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
          <p className="mt-1 text-xs text-slate-500">Every new business starts with Business features free for 30 days.</p>
        </div>
        <div className="grid gap-4 xl:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              cycle={cycle}
              currentPlan={overview?.subscription.plan.slug}
              trialing={overview?.subscription.status === "trialing"}
              onSelect={() => setCheckoutPlan(plan)}
            />
          ))}
        </div>
      </section>

      <PaymentHistory payments={payments} />

      {checkoutPlan && (
        <PaymentFlowDialog
          plan={checkoutPlan}
          cycle={cycle}
          onClose={() => setCheckoutPlan(null)}
          onSubmitted={(payment) => setPayments((current) => [payment, ...current.filter((item) => item.id !== payment.id)])}
        />
      )}
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
  onSelect,
}: {
  plan: SubscriptionPlan;
  cycle: BillingCycle;
  currentPlan?: string;
  trialing?: boolean;
  onSelect: () => void;
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
          <span className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">${monthlyEquivalent.toFixed(Number.isInteger(monthlyEquivalent) ? 0 : 2)}</span>
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
        onClick={onSelect}
        className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
          current && !trialing
            ? "bg-slate-950 text-white hover:bg-slate-800"
            : "bg-violet-600 text-white hover:bg-violet-700"
        }`}
      >
        {current ? (trialing ? `Subscribe to ${plan.name}` : "Renew this plan") : `Choose ${plan.name}`}
        <ArrowRight className="h-4 w-4" />
      </button>
    </article>
  );
}

function PaymentFlowDialog({
  plan,
  cycle,
  onClose,
  onSubmitted,
}: {
  plan: SubscriptionPlan;
  cycle: BillingCycle;
  onClose: () => void;
  onSubmitted: (payment: SubscriptionPayment) => void;
}) {
  const [step, setStep] = useState<"confirm" | "pay" | "proof" | "submitted">("confirm");
  const [payment, setPayment] = useState<SubscriptionPayment | null>(null);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [reference, setReference] = useState("");
  const [working, setWorking] = useState(false);
  const [flowError, setFlowError] = useState<unknown>(null);
  const price = Number(cycle === "monthly" ? plan.monthly_price : plan.yearly_price);

  const createPayment = async () => {
    setWorking(true);
    setFlowError(null);
    try {
      const created = await billingService.createPayment(plan.slug, cycle);
      setPayment(created);
      setStep("pay");
    } catch (error) {
      setFlowError(error);
    } finally {
      setWorking(false);
    }
  };

  const submitProof = async () => {
    if (!payment || !receipt) return;
    setWorking(true);
    setFlowError(null);
    try {
      const submitted = await billingService.submitPaymentProof(payment.id, receipt, reference.trim() || undefined);
      setPayment(submitted);
      setStep("submitted");
      onSubmitted(submitted);
    } catch (error) {
      setFlowError(error);
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="presentation">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-flow-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-slate-200 bg-white shadow-2xl sm:rounded-3xl"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-violet-600">
              <QrCode className="h-3.5 w-3.5" /> Bank QR payment
            </div>
            <h2 id="payment-flow-title" className="mt-1 text-lg font-semibold text-slate-950">
              {step === "confirm" && `Subscribe to ${plan.name}`}
              {step === "pay" && "Scan and pay"}
              {step === "proof" && "Upload payment receipt"}
              {step === "submitted" && "Payment sent for review"}
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close payment dialog" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="px-5 py-6 sm:px-7">
          <div className="mb-6 grid grid-cols-4 gap-2" aria-label="Payment progress">
            {[
              ["confirm", "Plan"],
              ["pay", "Pay"],
              ["proof", "Receipt"],
              ["submitted", "Review"],
            ].map(([value, label], index) => {
              const currentIndex = ["confirm", "pay", "proof", "submitted"].indexOf(step);
              return (
                <div key={value}>
                  <div className={`h-1.5 rounded-full ${index <= currentIndex ? "bg-violet-600" : "bg-slate-200"}`} />
                  <p className={`mt-1.5 text-[10px] font-semibold ${index <= currentIndex ? "text-violet-700" : "text-slate-400"}`}>{label}</p>
                </div>
              );
            })}
          </div>

          <ErrorMessage error={flowError} />

          {step === "confirm" && (
            <div>
              <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-violet-700">Selected plan</p>
                    <h3 className="mt-1 text-xl font-semibold text-slate-950">{plan.name}</h3>
                    <p className="mt-1 text-xs text-slate-500">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-slate-950">${price.toFixed(0)}</p>
                    <p className="text-[11px] capitalize text-slate-500">per {cycle === "monthly" ? "month" : "year"}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-slate-200 p-4 text-xs leading-5 text-slate-600">
                Your plan starts after Sellflow verifies the bank transfer. Renewal is manual, and we will remind you before the next payment is due.
              </div>
              <div className="mt-6 flex justify-end">
                <button type="button" onClick={createPayment} disabled={working} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60">
                  {working ? "Creating invoice…" : "Continue to payment"}<ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === "pay" && payment && (
            <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_240px] md:items-start">
              <div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex justify-between gap-3 border-b border-slate-200 pb-4">
                    <span className="text-xs text-slate-500">Amount to pay</span>
                    <strong className="text-xl text-slate-950">${Number(payment.amount).toFixed(2)} {payment.currency}</strong>
                  </div>
                  <dl className="mt-3 space-y-3 text-xs">
                    <div className="flex justify-between gap-4"><dt className="text-slate-500">Invoice</dt><dd className="font-semibold text-slate-900">{payment.invoice_number}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-slate-500">Plan</dt><dd className="font-semibold text-slate-900">{plan.name} · {cycle}</dd></div>
                  </dl>
                </div>
                <div className="mt-4 rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-900">
                  Pay the exact amount shown. After the transfer succeeds, continue and upload the receipt from your banking app.
                </div>
              </div>
              <div className="text-center">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <img src={bankQrCode} alt="Sellflow bank payment QR code" className="aspect-square w-full object-contain" />
                </div>
                <a href={bankQrCode} download="sellflow-bank-qr.png" className="mt-2 inline-block text-xs font-semibold text-violet-700 hover:text-violet-900">Save QR image</a>
              </div>
              <div className="flex flex-wrap justify-between gap-3 md:col-span-2">
                <button type="button" onClick={() => setStep("confirm")} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"><ArrowLeft className="h-4 w-4" /> Back</button>
                <button type="button" onClick={() => setStep("proof")} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700">I have paid <ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          )}

          {step === "proof" && payment && (
            <div>
              <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:border-violet-400 hover:bg-violet-50/40">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-violet-100 text-violet-700"><Upload className="h-5 w-5" /></span>
                <span className="mt-3 text-sm font-semibold text-slate-900">{receipt ? receipt.name : "Choose your bank receipt"}</span>
                <span className="mt-1 text-xs text-slate-500">A screenshot or photo showing successful payment · JPG, PNG or PDF · max 5 MB</span>
                <input type="file" accept="image/jpeg,image/png,application/pdf" className="sr-only" onChange={(event) => setReceipt(event.target.files?.[0] ?? null)} />
              </label>
              <label className="mt-4 block">
                <span className="text-xs font-semibold text-slate-700">Bank transaction reference <span className="font-normal text-slate-400">(optional)</span></span>
                <input value={reference} onChange={(event) => setReference(event.target.value)} placeholder="Example: 123456789" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
              </label>
              <div className="mt-6 flex flex-wrap justify-between gap-3">
                <button type="button" onClick={() => setStep("pay")} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"><ArrowLeft className="h-4 w-4" /> Back to QR</button>
                <button type="button" onClick={submitProof} disabled={!receipt || working} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50">
                  {working ? "Uploading…" : "Submit receipt"}<Upload className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === "submitted" && payment && (
            <div className="py-6 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-8 w-8" /></span>
              <h3 className="mt-5 text-xl font-semibold text-slate-950">Receipt received</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">We will compare your receipt with the bank transfer and activate your {plan.name} plan after confirmation.</p>
              <div className="mx-auto mt-6 flex max-w-sm items-center justify-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-900"><Clock3 className="h-4 w-4" /> Status: awaiting verification</div>
              <button type="button" onClick={onClose} className="mt-7 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800">Done</button>
            </div>
          )}
        </div>
      </section>
    </div>
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
