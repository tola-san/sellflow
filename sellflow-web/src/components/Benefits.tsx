import type { ComponentType, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  BellRing,
  Check,
  CheckCircle2,
  CircleDot,
  LayoutDashboard,
  LoaderCircle,
  MousePointerClick,
  PackageCheck,
  PackagePlus,
  Palette,
  Rocket,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  TrendingUp,
  UserRound,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTelegramPlane,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

type SocialChannel = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  className: string;
  position: string;
  delay: number;
};

const socialChannels: SocialChannel[] = [
  {
    label: "Facebook",
    icon: FaFacebookF,
    className: "bg-blue-600 text-white",
    position: "left-2 top-5 sm:left-5",
    delay: 0,
  },
  {
    label: "Instagram",
    icon: FaInstagram,
    className: "bg-pink-500 text-white",
    position: "right-2 top-6 sm:right-5",
    delay: 0.25,
  },
  {
    label: "Telegram",
    icon: FaTelegramPlane,
    className: "bg-sky-500 text-white",
    position: "bottom-5 left-5 sm:left-10",
    delay: 0.5,
  },
  {
    label: "TikTok",
    icon: FaTiktok,
    className: "bg-slate-950 text-white",
    position: "bottom-4 right-1/2 translate-x-1/2",
    delay: 0.75,
  },
  {
    label: "WhatsApp",
    icon: FaWhatsapp,
    className: "bg-purple-500 text-white",
    position: "bottom-5 right-5 sm:right-10",
    delay: 1,
  },
];

const setupSteps = [
  { label: "Add products", icon: PackagePlus },
  { label: "Customize store", icon: Palette },
  { label: "Share and sell", icon: Share2 },
];

const orderStatuses = [
  { label: "New", icon: CircleDot, className: "border-blue-200 bg-blue-50 text-blue-700" },
  { label: "Confirmed", icon: BadgeCheck, className: "border-violet-200 bg-violet-50 text-violet-700" },
  { label: "Processing", icon: LoaderCircle, className: "border-amber-200 bg-amber-50 text-amber-700" },
  { label: "Completed", icon: PackageCheck, className: "border-purple-200 bg-purple-50 text-purple-700" },
];

const dailyBenefits = [
  { label: "Easy setup", description: "Start without a developer", icon: Rocket },
  { label: "Mobile friendly", description: "Manage sales from anywhere", icon: Smartphone },
  { label: "Secure and reliable", description: "Your business data stays protected", icon: ShieldCheck },
];

function BenefitCard({ 
  children, 
  className = "", 
  index, 
  reduceMotion,
  layout
}: { 
  children: ReactNode; 
  className?: string; 
  index: number; 
  reduceMotion: boolean | null;
  layout?: "full" | "half" | "third" | "two-thirds";
}) {
  const getGridSpan = () => {
    switch(layout) {
      case "full": return "lg:col-span-12";
      case "half": return "lg:col-span-6";
      case "third": return "lg:col-span-4";
      case "two-thirds": return "lg:col-span-8";
      default: return "lg:col-span-6";
    }
  };

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_24px_70px_-48px_rgba(15,23,42,0.35)] transition-all hover:shadow-[0_30px_80px_-45px_rgba(15,23,42,0.42)] hover:border-slate-300/80 ${getGridSpan()} ${className}`}
    >
      {children}
    </motion.article>
  );
}

export function Benefits() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="benefits"
      aria-labelledby="benefits-heading"
      className="relative isolate overflow-hidden border-y border-slate-200/70 bg-slate-50/70 py-20 sm:py-28"
    >
      {/* Background decorations */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_85%_65%,rgba(124,58,237,0.08),transparent_25%),linear-gradient(to_bottom,#ffffff,rgba(248,250,252,0.78))]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.28] [background-image:radial-gradient(rgba(100,116,139,0.28)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent_72%)]"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="relative mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-2 text-xs font-semibold text-purple-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Why SellFlow
          </span>
          <h2
            id="benefits-heading"
            className="mt-6 text-4xl font-semibold leading-[1.06] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl"
          >
            Everything you need to{" "}
            <span className="font-editorial text-purple-600">sell smarter</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Stop switching between spreadsheets, chat apps, and multiple selling platforms.
            SellFlow brings your products, orders, customers, and sales channels into one
            simple workspace.
          </p>
        </motion.header>

        {/* Main Grid - Clean 2-column layout with clear sections */}
        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
          
          {/* LEFT COLUMN */}
          <div className="space-y-5">
            {/* Card 1: Multi-channel Management */}
            <BenefitCard
              index={0}
              reduceMotion={reduceMotion}
              layout="full"
              className="min-h-[480px] bg-gradient-to-br from-white via-white to-purple-50/70 p-6 sm:p-8"
            >
              <div aria-hidden="true" className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-200/35 blur-3xl" />
              <div className="relative flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg">
                    <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    All channels
                  </span>
                </div>

                <div className="mt-6 max-w-xl">
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-3xl">
                    Manage every sales channel in one place
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                    Connect your storefront with Facebook, Instagram, TikTok, Telegram, and
                    WhatsApp while managing orders from one dashboard.
                  </p>
                </div>

                <div className="relative mt-auto min-h-[200px] pt-6">
                  <div aria-hidden="true" className="absolute inset-x-14 top-[58%] h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
                  <div aria-hidden="true" className="absolute left-1/2 top-8 h-[120px] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-purple-300 to-transparent" />

                  {socialChannels.map((channel) => {
                    const Icon = channel.icon;
                    return (
                      <motion.span
                        key={channel.label}
                        aria-label={channel.label}
                        title={channel.label}
                        animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
                        transition={{ duration: 3.8, delay: channel.delay, repeat: Infinity, ease: "easeInOut" }}
                        className={`absolute z-10 grid h-10 w-10 place-items-center rounded-2xl shadow-lg ring-4 ring-white sm:h-11 sm:w-11 ${channel.className} ${channel.position}`}
                      >
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </motion.span>
                    );
                  })}

                  <div className="absolute left-1/2 top-1/2 z-20 w-[160px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl sm:w-[200px] sm:p-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                        <span className="grid h-6 w-6 place-items-center rounded-lg bg-purple-500 text-white text-[10px]">S</span>
                        SellFlow
                      </span>
                      <span className="h-2 w-2 rounded-full bg-purple-500 ring-4 ring-purple-100" />
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-1.5">
                      {["Orders", "Sales", "Products"].map((item, itemIndex) => (
                        <div key={item} className="rounded-lg bg-slate-50 p-1.5 text-center">
                          <p className="text-[8px] text-slate-400">{item}</p>
                          <p className="mt-0.5 text-xs font-bold text-slate-800">{[24, "$840", 18][itemIndex]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </BenefitCard>

            {/* Card 2: Order Organization */}
            <BenefitCard
              index={2}
              reduceMotion={reduceMotion}
              layout="half"
              className="p-6 sm:p-8"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-100 text-violet-700">
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-2xl font-semibold tracking-[-0.025em] text-slate-950">
                Keep every order organized
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Track new, confirmed, processing, completed, and cancelled orders with a clear
                visual workflow.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2" aria-label="Order workflow statuses">
                {orderStatuses.map((status) => {
                  const Icon = status.icon;
                  return (
                    <span key={status.label} className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-2.5 text-[10px] font-semibold ${status.className}`}>
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {status.label}
                    </span>
                  );
                })}
              </div>
            </BenefitCard>

            {/* Card 3: Launch Storefront */}
            <BenefitCard
              index={3}
              reduceMotion={reduceMotion}
              layout="half"
              className="p-6 sm:p-8"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-purple-100 text-purple-700">
                <Rocket className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-2xl font-semibold tracking-[-0.025em] text-slate-950">
                Launch in minutes
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Add products, customize your brand, and share your storefront link without code.
              </p>
              <ol className="mt-5 space-y-2" aria-label="Store launch steps">
                {setupSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <li key={step.label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-purple-100 text-purple-600 shadow-sm">
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <span className="text-sm font-semibold text-slate-700">{step.label}</span>
                      <span className="ml-auto text-xs font-bold text-slate-300">0{index + 1}</span>
                    </li>
                  );
                })}
              </ol>
            </BenefitCard>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">
            {/* Card 4: Real-time Notifications */}
            <BenefitCard
              index={1}
              reduceMotion={reduceMotion}
              layout="full"
              className="min-h-[480px] bg-slate-950 p-6 text-white sm:p-8"
            >
              <div aria-hidden="true" className="absolute -right-20 -top-16 h-60 w-60 rounded-full bg-sky-500/20 blur-3xl" />
              <div className="relative flex h-full flex-col">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-950/30">
                  <BellRing className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                  Never miss a new order
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300 sm:text-base mb-8">
                  Receive real-time Telegram notifications whenever a customer places an order
                  or an order status changes.
                </p>

                <motion.div
                  animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative mt-auto rounded-3xl border border-white bg-sky-100 p-4 backdrop-blur sm:p-5"
                >
                  <motion.span
                    aria-hidden="true"
                    animate={reduceMotion ? undefined : { scale: [1, 1.7], opacity: [0.5, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                    className="absolute right-5 top-5 h-2.5 w-2.5 rounded-full bg-purple-400"
                  />
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-sky-500 text-white">
                      <FaTelegramPlane className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">SellFlow orders</p>
                      <p className="text-xs text-slate-400">just now</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl bg-white p-4 text-slate-900">
                    <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-purple-700">
                      New order
                    </span>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <UserRound className="h-4 w-4 text-slate-400" aria-hidden="true" />
                        Maya Chen
                      </span>
                      <strong className="text-sm">$84.00</strong>
                    </div>
                    <button
                      type="button"
                      aria-label="View order from Maya Chen"
                      className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                    >
                      View order
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </motion.div>
              </div>
            </BenefitCard>

            {/* Card 5: Analytics Dashboard */}
            <BenefitCard
              index={4}
              reduceMotion={reduceMotion}
              layout="full"
              className=" p-6 sm:p-8"
            >
              <div className="grid h-full gap-6 sm:grid-cols-[0.9fr_1.1fr] sm:items-center">
                <div>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-100 text-cyan-700">
                    <BarChart3 className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-2xl font-semibold tracking-[-0.025em] text-purple500 sm:text-3xl">
                    Real sales data
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    See revenue, orders, top products, and customer activity through a simple
                    analytics dashboard.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ["Revenue", "$8,420"],
                      ["Orders", "248"],
                      ["Conversion", "4.8%"],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-[10px] font-medium text-purple-500">{label}</p>
                        <p className="mt-0.5 text-sm font-bold text-slate-900">{value}</p>
                      </div>
                    ))}
                  </div>
                      <div className="mt-5 flex h-24 items-end gap-1.5" aria-hidden="true">
                    {[38, 54, 46, 72, 64, 88, 100].map((height, index) => (
                      <div key={height + index} className="flex h-full flex-1 items-end rounded-t-md bg-slate-100">
                        <motion.div
                          initial={reduceMotion ? { height: `${height}%` } : { height: 0 }}
                          whileInView={{ height: `${height}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.75, delay: index * 0.08, ease: "easeOut" }}
                          className="w-full rounded-t-md bg-gradient-to-b from-purple-500 to-slate-800"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-[10px] font-medium text-slate-500">Last 7 days</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                      <TrendingUp className="h-3 w-3" aria-hidden="true" />
                      18.4%
                    </span>
                  </div>
                </div>
              </div>
            </BenefitCard>

            {/* Card 6: Simple & Daily */}
            <BenefitCard
              index={5}
              reduceMotion={reduceMotion}
              layout="full"
              className="p-6 sm:p-8"
            >
              <div className="grid gap-6 sm:grid-cols-2 sm:items-center">
                <div>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-100 text-blue-700">
                    <MousePointerClick className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-2xl font-semibold tracking-[-0.025em] text-slate-950">
                    Simple enough to use every day
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    SellFlow removes unnecessary complexity so sellers can focus on customers,
                    products, and growth.
                  </p>
                </div>

                <ul className="divide-y divide-slate-100">
                  {dailyBenefits.map((benefit) => {
                    const Icon = benefit.icon;
                    return (
                      <li key={benefit.label} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-slate-800">{benefit.label}</span>
                          <span className="mt-0.5 block text-xs text-slate-500">{benefit.description}</span>
                        </span>
                        <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-purple-500" aria-hidden="true" />
                      </li>
                    );
                  })}
                </ul>
              </div>
            </BenefitCard>
          </div>
        </div>

        {/* Footer */}
        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-12 flex max-w-xl items-center justify-center gap-2 text-center text-sm font-medium text-slate-500"
        >
          <Check className="h-4 w-4 text-purple-600" aria-hidden="true" />
          One workspace for your storefront, channels, orders, and growth.
        </motion.p>
      </div>
    </section>
  );
}