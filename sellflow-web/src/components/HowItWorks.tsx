import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Link2,
  PackagePlus,
  QrCode,
  ShoppingBag,
  Sparkles,
  Store,
} from "lucide-react";
import { useAuth } from "./Auth/AuthContext";

const cardMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
};

function StepLabel({
  number,
  label,
  inverted = false,
}: {
  number: string;
  label: string;
  inverted?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] ${
        inverted ? "text-white/55" : "text-slate-400"
      }`}
    >
      <span
        className={`grid h-6 w-6 place-items-center rounded-full border tracking-normal ${
          inverted ? "border-white/15 bg-white/10 text-white" : "border-slate-200 bg-white text-slate-700"
        }`}
      >
        {number}
      </span>
      {label}
    </div>
  );
}

function StoreCard() {
  return (
    <motion.article
      {...cardMotion}
      transition={{ duration: 0.55 }}
      className="group relative overflow-hidden rounded-xl border border-violet-200/70 bg-gradient-to-br from-violet-100 via-white to-fuchsia-50 p-6 sm:p-8 lg:col-span-7 lg:row-span-2"
    >
      <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-300/40 blur-3xl" />
      <div className="relative">
        <div className="flex items-start justify-between gap-5">
          <div>
            <StepLabel number="01" label="Create your store" />
            <h3 className="mt-5 max-w-lg text-2xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-3xl">
              Shape a storefront that feels unmistakably yours.
            </h3>
            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              Add your identity once. Sellflow turns it into a polished, mobile-ready shopping experience.
            </p>
          </div>
          <div className="hidden h-12 w-12 shrink-0 place-items-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-300/50 sm:grid">
            <Store className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[22px] border border-white/80 bg-white/75 p-2 shadow-[0_24px_70px_-32px_rgba(91,33,182,0.5)] backdrop-blur">
          <div className="flex h-9 items-center gap-1.5 border-b border-slate-100 px-3">
            <span className="h-2 w-2 rounded-full bg-rose-300" />
            <span className="h-2 w-2 rounded-full bg-amber-300" />
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            <div className="mx-auto flex h-5 w-44 max-w-[55%] items-center justify-center rounded-md bg-slate-100 text-[8px] font-medium text-slate-400">
              sellflow.co/sundaygoods
            </div>
          </div>
          <div className="grid gap-3 p-3 sm:grid-cols-[0.72fr_1.28fr]">
            <div className="rounded-xl bg-slate-950 p-4 text-white">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500 text-xs font-bold">SG</div>
              <p className="mt-4 text-sm font-semibold">Sunday Goods</p>
              <p className="mt-1 text-[9px] leading-4 text-slate-400">Small things for slower, brighter days.</p>
              <div className="mt-5 h-7 rounded-lg bg-white text-center text-[9px] font-semibold leading-7 text-slate-900">
                Browse collection
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["bg-orange-100", "Clay cup", "$18"],
                ["bg-sky-100", "Daily tote", "$24"],
                ["bg-emerald-100", "Herb set", "$16"],
                ["bg-fuchsia-100", "Soft journal", "$12"],
              ].map(([color, name, price]) => (
                <div key={name} className="rounded-xl border border-slate-100 bg-white p-2 shadow-sm">
                  <div className={`h-12 rounded-lg ${color}`} />
                  <div className="mt-2 flex items-center justify-between gap-1">
                    <span className="truncate text-[9px] font-semibold text-slate-700">{name}</span>
                    <span className="text-[9px] font-bold text-slate-950">{price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ProductsCard() {
  return (
    <motion.article
      {...cardMotion}
      transition={{ duration: 0.55, delay: 0.06 }}
      className="group relative overflow-hidden rounded-xl border border-blue-200/80 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 sm:p-7 lg:col-span-5"
    >
      <div className="flex items-center justify-between">
        <StepLabel number="02" label="Add products" />
        <PackagePlus className="h-5 w-5 text-slate-400 transition group-hover:rotate-6 group-hover:text-violet-600" />
      </div>
      <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Fill your shelves.</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">Photos, prices, categories, and details stay beautifully organized.</p>

      <div className="mt-5 grid grid-cols-3 gap-2.5">
        {[
          { color: "from-orange-200 to-amber-100", accent: "bg-orange-500", name: "Ceramic mug", price: "$18" },
          { color: "from-sky-200 to-cyan-100", accent: "bg-sky-500", name: "Canvas tote", price: "$24" },
          { color: "from-violet-200 to-fuchsia-100", accent: "bg-violet-500", name: "Desk set", price: "$32" },
        ].map((item) => (
          <div
            key={item.name}
            className="rounded-2xl border border-white bg-white p-2 shadow-lg shadow-blue-950/[0.08] transition duration-300 group-hover:-translate-y-1"
          >
            <div className={`relative aspect-[5/4] overflow-hidden rounded-xl bg-gradient-to-br ${item.color}`}>
              <div className="absolute left-1/2 top-1/2 h-10 w-8 -translate-x-1/2 -translate-y-1/2 rounded-lg border-4 border-white/80 bg-white/45 shadow-sm" />
              <span className={`absolute right-2 top-2 h-2 w-2 rounded-full ${item.accent}`} />
            </div>
            <p className="mt-2 truncate text-[10px] font-semibold text-slate-700">{item.name}</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-950">{item.price}</p>
              <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[7px] font-bold text-emerald-700">LIVE</span>
            </div>
          </div>
        ))}
      </div>
    </motion.article>
  );
}

function ShareCard() {
  return (
    <motion.article
      {...cardMotion}
      transition={{ duration: 0.55, delay: 0.1 }}
      className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-6 text-white sm:p-7 lg:col-span-5"
    >
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-violet-600/40 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <StepLabel number="03" label="Share anywhere" inverted />
          <Link2 className="h-5 w-5 text-white/40" />
        </div>
        <div className="mt-6 grid grid-cols-[1fr_auto] items-end gap-5">
          <div>
            <h3 className="text-2xl font-semibold tracking-[-0.03em]">One link. Every channel.</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Drop it into Telegram, your bio, a message, or a printed QR.
            </p>
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2.5">
              <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-slate-300">
                sellflow.co/sundaygoods
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-violet-300" />
            </div>
          </div>
          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-white shadow-2xl shadow-violet-950">
            <QrCode className="h-16 w-16 text-slate-950" strokeWidth={1.4} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function OrdersCard() {
  return (
    <motion.article
      {...cardMotion}
      transition={{ duration: 0.55, delay: 0.14 }}
      className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-gradient-to-br from-cyan-50 via-white to-purple-100 p-6 sm:p-8 lg:col-span-12"
    >
      <div className="flex items-center justify-between">
        <StepLabel number="04" label="Receive orders" />
        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-2.5 py-1 text-[9px] font-bold text-emerald-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          LIVE
        </div>
      </div>

      <div className="mt-6 grid items-end gap-6 sm:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-3xl">Orders land in one calm place.</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Confirm, prepare, and complete every sale without losing the conversation.
          </p>
          <div className="mt-5 flex gap-5">
            <div>
              <p className="text-xl font-bold text-slate-950">24</p>
              <p className="text-[9px] font-medium uppercase tracking-wider text-slate-400">Orders</p>
            </div>
            <div className="h-9 w-px bg-emerald-200" />
            <div>
              <p className="text-xl font-bold text-slate-950">$1,248</p>
              <p className="text-[9px] font-medium uppercase tracking-wider text-slate-400">Revenue</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {[
            ["#1024", "Mina K.", "$74.00", "bg-emerald-100 text-emerald-700", "Paid"],
            ["#1023", "Dara S.", "$46.00", "bg-amber-100 text-amber-700", "Preparing"],
            ["#1022", "Lina M.", "$32.00", "bg-sky-100 text-sky-700", "Ready"],
          ].map(([id, name, total, statusColor, status]) => (
            <div key={id} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white/85 p-3 shadow-sm backdrop-blur">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100">
                <ShoppingBag className="h-3.5 w-3.5 text-slate-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-slate-800">{id}</p>
                <p className="text-[9px] text-slate-400">{name}</p>
              </div>
              <span className={`rounded-full px-2 py-1 text-[8px] font-bold ${statusColor}`}>{status}</span>
              <p className="text-[10px] font-bold text-slate-900">{total}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export function HowItWorks() {
  

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-[#fafafa] py-24 sm:py-28 lg:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-violet-100/70 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-violet-700 shadow-sm backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Four steps. One smooth flow.
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="mt-6 text-4xl font-medium leading-[1.05] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl"
          >
            From idea to first order,
            <span className="font-editorial block text-violet-700">beautifully simple.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg"
          >
            Everything you need to launch, share, and run your store fits together naturally.
          </motion.p>
        </div>

        <div className="grid gap-4 sm:gap-5 lg:grid-cols-12">
          <StoreCard />
          <ProductsCard />
          <ShareCard />
          <OrdersCard />
        </div>

      
      </div>
    </section>
  );
}
