import { useState, type ComponentType, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Coffee,
  Laptop,
  Palette,
  Scissors,
  ShoppingBag,
  Sparkles,
  Store,
  Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { businessService } from "../Services/business";
import { BUSINESS_TYPES, type BusinessType } from "../types/businessTypes";
import { useAuth } from "../components/Auth/AuthContext";
import { useToast } from "../components/ui/ToastContext";

type BusinessIcon = ComponentType<{ className?: string; size?: number }>;

const businessIcons: Record<BusinessType, BusinessIcon> = {
  food_beverage: Coffee,
  fashion: ShoppingBag,
  beauty: Sparkles,
  electronics: Laptop,
  grocery_retail: Store,
  services: Wrench,
  digital_products: Palette,
  other: Scissors,
};

interface OnboardingForm {
  business_type: BusinessType | "";
  name: string;
  slug: string;
  phone: string;
  city: string;
  country: string;
}

const initialForm: OnboardingForm = {
  business_type: "",
  name: "",
  slug: "",
  phone: "",
  city: "",
  country: "",
};

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user, setSession } = useAuth();
  const { showToast } = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState(initialForm);
  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectType = (businessType: BusinessType) => {
    setForm((current) => ({ ...current, business_type: businessType }));
    setError("");
  };

  const changeName = (name: string) => {
    setForm((current) => ({
      ...current,
      name,
      slug: slugEdited ? current.slug : slugify(name),
    }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.business_type) {
      setStep(1);
      setError("Choose the type that best describes your business.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await businessService.saveBusiness(
        {
          business_type: form.business_type,
          name: form.name.trim(),
          slug: form.slug.trim(),
          phone: form.phone.trim() || null,
          city: form.city.trim() || null,
          country: form.country.trim() || null,
          is_active: true,
        },
        false,
      );

      const token = localStorage.getItem("token");
      if (token && user) {
        setSession(token, {
          ...user,
          has_business: true,
          onboarding_completed: true,
          business_type: form.business_type,
        });
      }

      showToast("Your store is ready. Welcome to SellFlow!");
      navigate("/dashboard", { replace: true });
    } catch (exception) {
      setError(apiErrorMessage(exception));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-purple-600/25 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <div className="flex items-center gap-3 text-white">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-purple-600 shadow-lg shadow-purple-950/30">
            <Store size={20} />
          </span>
          <div>
            <p className="font-bold">SellFlow</p>
            <p className="text-xs text-slate-400">Store setup</p>
          </div>
        </div>
        <p className="hidden text-sm text-slate-400 sm:block">
          Signed in as <span className="font-semibold text-slate-200">{user?.name || user?.email}</span>
        </p>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 pb-12 sm:px-8">
        <div className="grid overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-2xl shadow-black/30 lg:grid-cols-[330px_1fr]">
          <aside className="bg-gradient-to-br from-purple-700 via-violet-700 to-indigo-800 p-7 text-white sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-purple-200">Welcome to SellFlow</p>
            <h1 className="mt-4 text-3xl font-bold leading-tight">
              Let&apos;s build your store.
            </h1>
            <p className="mt-4 text-sm leading-6 text-purple-100/85">
              Tell us what you sell so your workspace starts with the most useful setup for your business.
            </p>

            <ol className="mt-10 space-y-5">
              <ProgressItem
                number={1}
                title="Business type"
                description="Choose your industry"
                active={step === 1}
                complete={step > 1}
              />
              <ProgressItem
                number={2}
                title="Store identity"
                description="Name and public URL"
                active={step === 2}
                complete={false}
              />
            </ol>

            <div className="mt-10 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm leading-6 text-purple-100 backdrop-blur">
              You can update these details later from your Business Profile.
            </div>
          </aside>

          <section className="min-h-[650px] p-6 sm:p-10">
            {step === 1 ? (
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-600">Step 1 of 2</span>
                <h2 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">What kind of business do you run?</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">Choose the closest match. This helps SellFlow personalize your setup.</p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {BUSINESS_TYPES.map((type) => {
                    const Icon = businessIcons[type.value];
                    const selected = form.business_type === type.value;

                    return (
                      <button
                        key={type.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => selectType(type.value)}
                        className={`group relative flex min-h-28 items-start gap-4 rounded-2xl border p-4 text-left transition ${
                          selected
                            ? "border-purple-500 bg-purple-50 ring-2 ring-purple-100"
                            : "border-slate-200 bg-white hover:border-purple-300 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition ${
                          selected ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-purple-100 group-hover:text-purple-700"
                        }`}>
                          <Icon size={21} />
                        </span>
                        <span>
                          <strong className="block text-sm text-slate-900">{type.label}</strong>
                          <span className="mt-1 block text-xs leading-5 text-slate-500">{type.description}</span>
                        </span>
                        {selected && (
                          <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-purple-600 text-white">
                            <Check size={13} strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {error && <ErrorBanner message={error} />}

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    disabled={!form.business_type}
                    onClick={() => {
                      setError("");
                      setStep(2);
                    }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                  >
                    Continue <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit}>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-purple-600">Step 2 of 2</span>
                <h2 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">Create your storefront</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">Start with the essentials. Brand images, themes, and social links can be added from the dashboard.</p>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <OnboardingField
                    label="Business name"
                    value={form.name}
                    onChange={changeName}
                    placeholder="Coffee House"
                    required
                  />
                  <OnboardingField
                    label="Store URL"
                    value={form.slug}
                    onChange={(value) => {
                      setSlugEdited(true);
                      setForm((current) => ({ ...current, slug: slugify(value) }));
                    }}
                    placeholder="coffee-house"
                    prefix="sellflow.com/"
                    required
                  />
                  <OnboardingField
                    label="Phone"
                    value={form.phone}
                    onChange={(phone) => setForm((current) => ({ ...current, phone }))}
                    placeholder="+855 12 345 678"
                  />
                  <OnboardingField
                    label="City"
                    value={form.city}
                    onChange={(city) => setForm((current) => ({ ...current, city }))}
                    placeholder="Phnom Penh"
                  />
                  <OnboardingField
                    label="Country"
                    value={form.country}
                    onChange={(country) => setForm((current) => ({ ...current, country }))}
                    placeholder="Cambodia"
                  />
                </div>

                <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
                      <Sparkles size={17} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-emerald-900">Your store starts active</p>
                      <p className="mt-1 text-xs leading-5 text-emerald-700">After setup, add categories and products before sharing your public URL with customers.</p>
                    </div>
                  </div>
                </div>

                {error && <ErrorBanner message={error} />}

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setStep(1);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <ArrowLeft size={17} /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !form.name.trim() || !form.slug.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "Creating your store..." : "Create store"}
                    {!saving && <ArrowRight size={17} />}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function ProgressItem({ number, title, description, active, complete }: {
  number: number;
  title: string;
  description: string;
  active: boolean;
  complete: boolean;
}) {
  return (
    <li className="flex items-center gap-3">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border text-sm font-bold ${
        complete
          ? "border-emerald-300 bg-emerald-400 text-emerald-950"
          : active
            ? "border-white bg-white text-purple-700"
            : "border-white/25 bg-white/10 text-purple-200"
      }`}>
        {complete ? <Check size={17} strokeWidth={3} /> : number}
      </span>
      <span>
        <strong className={`block text-sm ${active || complete ? "text-white" : "text-purple-200"}`}>{title}</strong>
        <span className="text-xs text-purple-200/75">{description}</span>
      </span>
    </li>
  );
}

function OnboardingField({ label, value, onChange, placeholder, prefix, required = false }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  prefix?: string;
  required?: boolean;
}) {
  return (
    <label className="text-sm font-semibold text-slate-700">
      {label}
      <span className="mt-2 flex overflow-hidden rounded-xl border border-slate-200 bg-white transition focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100">
        {prefix && <span className="hidden items-center border-r border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-400 md:flex">{prefix}</span>}
        <input
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 px-3.5 py-3 text-sm font-normal text-slate-900 outline-none placeholder:text-slate-400"
        />
      </span>
    </label>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      {message}
    </div>
  );
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function apiErrorMessage(error: unknown): string {
  if (typeof error !== "object" || error === null || !("response" in error)) {
    return "We could not create your store. Please try again.";
  }

  const response = (error as {
    response?: {
      data?: {
        message?: string;
        errors?: Record<string, string[]>;
      };
    };
  }).response;
  const validationMessage = response?.data?.errors
    ? Object.values(response.data.errors).flat()[0]
    : undefined;

  return validationMessage ?? response?.data?.message ?? "We could not create your store. Please try again.";
}
