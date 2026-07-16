import React, { useState } from "react";
import {
  Check,
  QrCode,
  X,
  Smartphone,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import bakongQr from "../assets/images/qrcode-bakong/image.png";
import { useNavigate } from "react-router-dom";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
}

const plans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "For sellers starting their first digital catalog.",
    features: [
      "1 business store",
      "Up to 20 products",
      "Default SellFlow theme",
      "Public store URL",
      "QR catalog sharing",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: 5,
    description: "For small businesses that want more control.",
    features: [
      "Up to 100 products",
      "Custom brand colors",
      "Remove some SellFlow branding",
      "Basic catalog analytics",
      "Telegram order notifications",
    ],
    highlighted: true,
  },
  {
    id: "business",
    name: "Business",
    price: 12,
    description: "For growing businesses with more products and orders.",
    features: [
      "Unlimited products",
      "Premium themes",
      "Advanced analytics",
      "Custom QR code",
      "Priority support",
    ],
  },
];

export function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] =
    useState<PricingPlan | null>(null);

  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success">("idle");

  const openPayment = (plan: PricingPlan) => {
    if (plan.price === 0) {
      navigate("/register");
      return;
    }

    setSelectedPlan(plan);
    setPaymentStatus("idle");
  };

  const closePayment = () => {
    setSelectedPlan(null);
    setPaymentStatus("idle");
  };

  const confirmPayment = () => {
    setPaymentStatus("success");
  };

  return (
    <>
      <section
        id="pricing"
        className="relative overflow-hidden bg-slate-50 py-20 sm:py-24"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.12),_transparent_65%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
              Simple pricing
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-5xl">
              Start free. Upgrade when your business grows.
            </h2>

            <p className="mt-5 text-lg text-slate-600">
              Choose a plan and pay securely through Bakong KHQR.
            </p>
          </div>

          <div className="relative mt-14 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
            {plans.map((plan) => (
              <article
                key={plan.id}
                className={[
                  "relative flex h-full flex-col rounded-3xl border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7",
                  plan.highlighted
                    ? "border-violet-500 ring-4 ring-violet-100 md:col-span-2 lg:col-span-1 lg:-translate-y-3 lg:hover:-translate-y-4"
                    : "border-slate-200",
                ].join(" ")}
              >
                {plan.highlighted && (
                  <span className="absolute right-6 top-0 -translate-y-1/2 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-violet-200">
                    Most popular
                  </span>
                )}

                <h3 className="text-xl font-bold text-slate-900">
                  {plan.name}
                </h3>

                <p className="mt-2 min-h-12 text-sm text-slate-500">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-end gap-1">
                  <span className="text-4xl font-bold text-slate-900">
                    ${plan.price}
                  </span>

                  {plan.price > 0 && (
                    <span className="pb-1 text-sm text-slate-500">
                      /month
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => openPayment(plan)}
                  className={[
                    "mt-7 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition",
                    plan.highlighted
                      ? "bg-purple-500 text-white shadow-lg shadow-violet-200 hover:bg-purple-600"
                      : "border border-slate-200 text-slate-900 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {plan.price === 0 ? (
                    "Get started free"
                  ) : (
                    <>
                      <QrCode className="h-4 w-4" />
                      Pay with QR Bakong
                    </>
                  )}
                </button>

                <ul className="mt-7 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-slate-600"
                    >
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                        <Check className="h-3.5 w-3.5" />
                      </div>

                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="relative mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
            {["No setup fee", "Cancel anytime", "Secure KHQR payment"].map((item) => <span key={item} className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-emerald-600" />{item}</span>)}
          </div>
        </div>
      </section>

      {selectedPlan && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-sm sm:p-4">
          <div className="relative w-full max-w-sm max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-3xl bg-white shadow-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:max-h-[calc(100dvh-2rem)]">
            <button
              type="button"
              onClick={closePayment}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close payment modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="bg-gradient-to-b from-red-50 to-white px-5 pb-3 pt-4 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-md shadow-red-200">
                <QrCode className="h-5 w-5" />
              </div>

              <h3 className="mt-2 text-xl font-bold text-slate-900">
                Pay with Bakong KHQR
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Subscribe to the {selectedPlan.name} plan
              </p>
            </div>

            {paymentStatus === "idle" && (
              <div className="px-4 pb-4 sm:px-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mx-auto w-full max-w-[180px] overflow-hidden rounded-xl bg-white shadow-sm ring-2 ring-white sm:max-w-[300px]">
                    <img src={bakongQr} alt="Bakong KHQR for Tola San" className="h-auto w-full" />
                  </div>

                </div>

              
                <button
                  type="button"
                  onClick={confirmPayment}
                  className="mt-3 w-full rounded-full bg-purple-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-600"
                >
                  I have sent the payment
                </button>

                <p className="mt-2 text-center text-[11px] leading-4 text-slate-400">
                  Submission is not automatic verification. Activate plans only after confirming the transaction.
                </p>
              </div>
            )}

            {paymentStatus === "success" && (
              <div className="px-6 py-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="h-8 w-8" />
                </div>

                <h4 className="mt-5 text-2xl font-bold text-slate-900">
                  Payment submitted
                </h4>

                <p className="mt-2 text-sm text-slate-500">
                  Your payment is pending confirmation. Your plan will be
                  activated after verification.
                </p>

                <button
                  type="button"
                  onClick={closePayment}
                  className="mt-6 w-full rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
