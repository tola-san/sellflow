import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  MessageCircleMore,
  MoreHorizontal,
  PackageCheck,
  Plus,
  QrCode,
  Search,
  Send,
  ShoppingBag,
  Sparkles,
  Store,
} from "lucide-react";
import { useAuth } from "./Auth/AuthContext";
import { Pricing } from "./Pricing";
import { DotField } from "./ui/DotField";
import { BrandLogo } from "./ui/BrandLogo";
import "./landing.css";

type HeroView = "products" | "orders" | "insights";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

const faqs = [
  ["Do I need technical experience?", "No. Add your products, choose a theme, and share your store link. SellFlow handles the technical setup for you."],
  ["Can customers order from their phone?", "Yes. Every SellFlow storefront is mobile-first, so customers can browse, order, and check out smoothly from any modern phone."],
  ["How do Telegram notifications work?", "Connect Telegram once and receive new-order and status updates without keeping your dashboard open."],
  ["Can I use SellFlow for a restaurant?", "Yes. SellFlow supports menu availability, product options, restaurant tables, and QR ordering alongside standard storefronts."],
];

export function ModernLanding() {
  const { openAuth } = useAuth();
  const [openFaq, setOpenFaq] = useState(0);
  const [heroView, setHeroView] = useState<HeroView>("orders");

  return (
    <div className="landing-soft min-h-screen bg-white text-[#18171d]">
      <section id="home" className="hero-workspace relative isolate min-h-[890px] overflow-hidden px-5 pb-0 pt-32 sm:px-8 sm:pt-36">
        <DotField gap={29} className="z-0 opacity-70 [mask-image:linear-gradient(to_bottom,black,black_58%,transparent_92%)]" />
        <motion.div aria-hidden="true" className="absolute -left-[10%] top-[22%] -z-10 h-[32rem] w-[32rem] rounded-full bg-violet-200/55 blur-[115px]" animate={{ x: [0, 55, 0], y: [0, 24, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div aria-hidden="true" className="absolute -right-[9%] top-[25%] -z-10 h-[31rem] w-[31rem] rounded-full bg-cyan-200/60 blur-[115px]" animate={{ x: [0, -48, 0], y: [0, 34, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-200/70 bg-white/80 px-3 py-1.5 text-[10px] font-semibold text-[#655d70] shadow-[0_8px_25px_-15px_rgba(107,70,193,.5)] backdrop-blur-xl">
            <span className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-br from-violet-500 to-cyan-400" /> Your business, beautifully organized
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.05, ease: [0.16, 1, 0.3, 1] }} className="mx-auto mt-6 max-w-[780px] text-[2.75rem] font-semibold leading-[1.02] tracking-[-.055em] text-[#17151a] sm:text-6xl lg:text-[4.35rem]">
            Manage every sale with <span className="gradient-word">clarity and speed.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.16 }} className="mx-auto mt-5 max-w-xl text-xs leading-6 text-[#77717e] sm:text-sm">
            Products, orders, customers, and insights in one calm workspace built to keep your business moving.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.24 }} className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button onClick={() => openAuth("register")} className="group inline-flex h-12 items-center gap-2 rounded-full bg-[#1c1a1f] px-5 text-xs font-semibold text-white shadow-[0_14px_30px_-12px_rgba(20,18,25,.62)] transition hover:-translate-y-1 hover:bg-[#6f54d9]">
              Start selling free <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[#1c1a1f]"><ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" /></span>
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="hero-view-switcher mx-auto mt-8 flex w-fit items-center rounded-xl bg-white/75 p-1 shadow-[0_10px_35px_-18px_rgba(61,43,99,.45)] backdrop-blur-xl">
            {(["products", "orders", "insights"] as HeroView[]).map((view) => <button key={view} onClick={() => setHeroView(view)} className={`relative isolate rounded-lg px-4 py-2 text-[10px] font-semibold capitalize transition ${heroView === view ? "text-[#4e3a75]" : "text-[#918a98] hover:text-[#655d70]"}`}>{heroView === view && <motion.span layoutId="hero-view" className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-violet-100 to-cyan-100 shadow-sm" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}{view}</button>)}
          </motion.div>
        </div>

        <HeroWorkspace activeView={heroView} />
      </section>

      <TrustedCompanies />

      <section className="relative mx-auto max-w-7xl overflow-hidden px-3 py-20 sm:px-8 lg:py-28">
        <DotField gap={38} className="-z-10 opacity-45 [mask-image:radial-gradient(circle_at_center,black,transparent_74%)]" />
        <motion.div {...reveal} className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#f1edff] px-3 py-1.5 text-[10px] font-semibold text-[#6954d0]"><Sparkles className="h-3 w-3" /> Powerful features</span>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-medium leading-[1.08] tracking-[-.05em] sm:text-6xl">Commerce for the<br />modern business</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#6e6877]">Simple enough to start today, powerful enough to support your next stage of growth.</p>
        </motion.div>

        <div id="features" className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          <SoftCard className="lg:col-span-7" icon={Store} eyebrow="Storefront" title="A beautiful store that is unmistakably yours." description="Choose your colors, organize your catalog, and publish a fast experience that looks polished on every screen.">
            <StorefrontPreview />
          </SoftCard>
          <SoftCard className="feature-highlight lg:col-span-5" icon={Send} eyebrow="Telegram" title="Every new order finds you instantly." description="Stay close to your business with clear order updates wherever your day takes you.">
            <div className="mt-8 space-y-3">
              <OrderToast label="New order #1048" detail="3 items · $24.50" />
              <OrderToast label="Payment confirmed" detail="ABA Pay · Just now" subtle />
            </div>
          </SoftCard>
          <SoftCard className="lg:col-span-4" icon={QrCode} eyebrow="QR ordering" title="Scan. Browse. Order." description="Turn tables, counters, and packaging into direct sales channels." />
          <SoftCard className="lg:col-span-4" icon={PackageCheck} eyebrow="Inventory" title="Always know what’s available." description="Products, variants, add-ons, and stock stay neatly in sync." />
          <SoftCard className="lg:col-span-4" icon={BarChart3} eyebrow="Analytics" title="See what moves your business." description="Understand revenue and best sellers through clear, useful insights." />
        </div>
      </section>

      <HowItWorksJourney />

      <Pricing />

      <section id="faq" className="relative mx-auto grid max-w-7xl gap-12 overflow-hidden px-3 pb-28 pt-8 sm:px-8 lg:grid-cols-[.7fr_1.3fr] lg:pb-36">
        <DotField gap={40} className="-z-10 opacity-35 [mask-image:radial-gradient(circle_at_25%_45%,black,transparent_55%)]" />
        <motion.div {...reveal}><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#8754d8]">Questions, answered</p><h2 className="mt-4 text-4xl font-medium tracking-[-.05em] sm:text-5xl">Good to know.</h2><p className="mt-5 max-w-sm text-sm leading-7 text-[#746d7d]">Still curious? We’ll help you find the right setup for your business.</p><a href="https://t.me/tolasannn" target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#7543bd]">Talk to us on Telegram <ArrowRight className="h-4 w-4" /></a></motion.div>
        <div className="overflow-hidden rounded-3xl border border-[#dcd3e9] bg-white/70 px-5 shadow-[0_20px_60px_-40px_rgba(80,52,119,.45)] backdrop-blur sm:px-7">{faqs.map(([question, answer], index) => <div key={question} className="border-b border-[#e6e0ed] last:border-0"><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between gap-5 py-6 text-left text-sm font-semibold sm:text-base"><span>{question}</span><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#d8cce8] text-[#7543bd] transition ${openFaq === index ? "rotate-180 bg-[#8754d8] text-white" : "bg-white"}`}><ChevronDown className="h-4 w-4" /></span></button><AnimatePresence initial={false}>{openFaq === index && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="max-w-2xl pb-6 pr-8 text-sm leading-7 text-[#746d7d]">{answer}</p></motion.div>}</AnimatePresence></div>)}</div>
      </section>
    </div>
  );
}

function HeroWorkspace({ activeView }: { activeView: HeroView }) {
  const navigation = ["Overview", "Products", "Orders", "Customers", "Analytics"];

  return (
    <motion.div initial={{ opacity: 0, y: 54, scale: .97 }} animate={{ opacity: 1, y: [0, -5, 0], scale: 1 }} transition={{ opacity: { duration: .8, delay: .4 }, y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.2 }, scale: { duration: .8, delay: .4 } }} className="hero-dashboard relative z-10 mx-auto mt-9 w-full max-w-[1040px]">
      <div className="dashboard-glow" />
      <div className="relative overflow-hidden rounded-t-[24px] bg-white/95 p-2 shadow-[0_34px_95px_-38px_rgba(70,49,120,.48)] ring-1 ring-white/90 backdrop-blur-xl sm:p-3">
        <div className="flex items-center gap-1.5 border-b border-[#eceaf0] px-2 pb-2">
          <span className="h-2 w-2 rounded-full bg-[#d9d4e2]" /><span className="h-2 w-2 rounded-full bg-[#d9d4e2]" /><span className="h-2 w-2 rounded-full bg-[#d9d4e2]" />
          <div className="mx-auto flex h-6 w-48 items-center justify-center rounded-md bg-[#f6f5f8] text-[7px] text-[#a19aa8] sm:w-72">app.sellflow.store</div>
        </div>
        <div className="grid min-h-[340px] grid-cols-[54px_1fr] sm:grid-cols-[176px_1fr]">
          <aside className="border-r border-[#eceaf0] bg-[#fbfafc] p-2 sm:p-4">
            <BrandLogo className="mb-6" markClassName="h-8 w-8" wordmarkClassName="hidden text-xs sm:block" />
            <div className="space-y-1">{navigation.map((item, index) => <div key={item} className={`flex items-center gap-2 rounded-lg px-2 py-2 text-[9px] font-medium ${item.toLowerCase() === activeView || (activeView === "insights" && item === "Analytics") ? "bg-gradient-to-r from-violet-100 to-cyan-50 text-[#6047a7]" : "text-[#98919f]"}`}><span className={`h-1.5 w-1.5 rounded-full ${index % 2 ? "bg-cyan-300" : "bg-violet-300"}`} /><span className="hidden sm:block">{item}</span></div>)}</div>
          </aside>
          <main className="min-w-0 bg-white p-3 text-left sm:p-5">
            <div className="flex items-center justify-between gap-3"><div><p className="text-[8px] text-[#9a94a1]">Your workspace</p><h2 className="mt-1 text-base font-semibold tracking-[-.03em] sm:text-xl">{activeView === "insights" ? "Store insights" : activeView === "products" ? "Product catalog" : "Orders"}</h2></div><div className="flex items-center gap-2"><span className="hidden items-center gap-2 rounded-lg bg-[#f7f6f9] px-3 py-2 text-[8px] text-[#9b95a2] sm:flex"><Search className="h-3 w-3" /> Search anything</span><button className="flex items-center gap-1 rounded-lg bg-[#1d1b21] px-3 py-2 text-[8px] font-semibold text-white"><Plus className="h-3 w-3" /> New</button></div></div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={activeView} initial={{ opacity: 0, y: 12, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8, filter: "blur(3px)" }} transition={{ duration: .28 }}>
                {activeView === "orders" && <OrdersView />}
                {activeView === "products" && <ProductsView />}
                {activeView === "insights" && <InsightsView />}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </motion.div>
  );
}

function OrdersView() {
  const rows = [["#1048", "Sokha Lim", "$84.00", "Paid"], ["#1047", "Dara Kim", "$42.50", "Packing"], ["#1046", "Maly Chan", "$126.00", "Paid"], ["#1045", "Nita Heng", "$38.00", "Delivered"]];
  return <div className="mt-5 overflow-hidden rounded-xl border border-[#eeebf2]"><div className="grid grid-cols-[.7fr_1.2fr_.7fr_.7fr_auto] bg-[#faf9fb] px-3 py-2 text-[7px] font-semibold uppercase tracking-wider text-[#aaa3b0]"><span>Order</span><span>Customer</span><span>Total</span><span>Status</span><span /></div>{rows.map((row, index) => <motion.div key={row[0]} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .06 }} className="grid grid-cols-[.7fr_1.2fr_.7fr_.7fr_auto] items-center border-t border-[#f0edf3] px-3 py-3 text-[8px] sm:text-[9px]"><span className="font-semibold">{row[0]}</span><span>{row[1]}</span><span className="font-semibold">{row[2]}</span><span className="w-fit rounded-full bg-gradient-to-r from-violet-100 to-cyan-100 px-2 py-1 text-[7px] font-semibold text-[#665188]">{row[3]}</span><MoreHorizontal className="h-3 w-3 text-[#aaa3af]" /></motion.div>)}</div>;
}

function ProductsView() {
  return <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{["Daily tote", "Cloud mug", "Studio cap", "Soft tee"].map((product, index) => <motion.div key={product} initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * .06 }} className="rounded-xl border border-[#eeebf2] bg-[#fcfbfd] p-2"><div className={`grid aspect-[1.2] place-items-center rounded-lg ${index % 2 ? "bg-cyan-50" : "bg-violet-50"}`}><PackageCheck className={`h-5 w-5 ${index % 2 ? "text-cyan-400" : "text-violet-400"}`} /></div><p className="mt-2 text-[8px] font-semibold sm:text-[9px]">{product}</p><p className="mt-1 text-[7px] text-[#9b94a1]">{24 + index * 8} in stock</p></motion.div>)}</div>;
}

function InsightsView() {
  return <div className="mt-5 grid gap-3 sm:grid-cols-[1.35fr_.65fr]"><div className="rounded-xl border border-[#eeebf2] p-4"><div className="flex items-end justify-between"><div><p className="text-[8px] text-[#9b94a1]">Revenue</p><p className="mt-1 text-xl font-semibold">$8,420</p></div><span className="rounded-full bg-cyan-50 px-2 py-1 text-[7px] font-semibold text-cyan-600">+18.4%</span></div><div className="mt-5 flex h-28 items-end gap-2">{[36, 54, 44, 72, 60, 88, 78, 96].map((height, index) => <motion.span key={index} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ delay: index * .05, duration: .45 }} className="flex-1 rounded-t bg-gradient-to-t from-violet-500 to-cyan-300 opacity-80" />)}</div></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-1">{[["Orders", "284"], ["Customers", "1,248"], ["Conversion", "6.8%"]].map(([label, value]) => <div key={label} className="rounded-xl bg-gradient-to-br from-violet-50 to-cyan-50 p-3"><p className="text-[7px] text-[#9b94a1]">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>)}</div></div>;
}

function HowItWorksJourney() {
  const steps = [
    { number: "01", title: "Create your space", copy: "Add your brand, products, and prices in a guided setup.", icon: Store, tone: "violet" },
    { number: "02", title: "Share anywhere", copy: "Turn your store into a link or QR code customers can open instantly.", icon: QrCode, tone: "cyan" },
    { number: "03", title: "Watch orders flow", copy: "Receive orders, update status, and understand what sells best.", icon: ShoppingBag, tone: "mix" },
  ] as const;

  return <section id="how-it-works" className="journey-section relative isolate overflow-hidden px-5 py-24 sm:px-10 lg:py-32">
    <DotField gap={28} className="-z-10 opacity-55 [mask-image:radial-gradient(ellipse_at_center,black,transparent_76%)]" />
    <motion.div aria-hidden="true" className="absolute left-[8%] top-[24%] -z-10 h-80 w-80 rounded-full bg-violet-200/55 blur-[100px]" animate={{ x: [0, 44, 0], y: [0, 20, 0] }} transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }} />
    <motion.div aria-hidden="true" className="absolute right-[6%] top-[35%] -z-10 h-80 w-80 rounded-full bg-cyan-200/60 blur-[100px]" animate={{ x: [0, -38, 0], y: [0, 28, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} />

    <div className="relative mx-auto max-w-7xl">
      <motion.div {...reveal} className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-[10px] font-semibold text-[#7155c8] shadow-sm backdrop-blur"><Sparkles className="h-3 w-3" /> From zero to selling</span>
        <h2 className="mt-5 text-4xl font-medium leading-[1.06] tracking-[-.05em] sm:text-6xl">Your store takes shape<br /><span className="gradient-word">in three simple moves.</span></h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#736d79]">A clear path from your first product to your next customer—with no complicated setup in the way.</p>
      </motion.div>

      <div className="journey-map relative mt-16 grid gap-5 lg:grid-cols-3">
        <div className="journey-track absolute left-[16%] right-[16%] top-[72px] hidden h-px lg:block"><motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }} className="block h-full origin-left bg-gradient-to-r from-violet-400 via-[#9187ec] to-cyan-400" /></div>
        {steps.map(({ number, title, copy, icon: Icon, tone }, index) => <motion.article key={number} {...reveal} transition={{ ...reveal.transition, delay: index * .12 }} whileHover={{ y: -10 }} className="journey-card group relative overflow-hidden rounded-[28px] bg-white/78 p-5 shadow-[0_24px_70px_-45px_rgba(73,50,118,.5)] backdrop-blur-xl sm:p-7">
          <div className="flex items-center justify-between"><span className="font-mono text-[10px] font-semibold tracking-[.18em] text-[#9b92a4]">STEP {number}</span><span className={`grid h-11 w-11 place-items-center rounded-2xl ${tone === "violet" ? "bg-violet-100 text-violet-600" : tone === "cyan" ? "bg-cyan-100 text-cyan-600" : "bg-gradient-to-br from-violet-100 to-cyan-100 text-[#6950c1]"}`}><Icon className="h-5 w-5" /></span></div>
          <JourneyVisual step={index} />
          <h3 className="mt-7 text-xl font-semibold tracking-[-.035em]">{title}</h3>
          <p className="mt-3 text-xs leading-6 text-[#777080]">{copy}</p>
        </motion.article>)}
      </div>

      <motion.div {...reveal} className="mt-10 flex flex-col items-center justify-center gap-4 text-center sm:flex-row">
        <p className="text-xs font-medium text-[#7c7583]">Most stores are ready to share in less than 10 minutes.</p>
        <a href="#pricing" className="group inline-flex items-center gap-2 text-xs font-semibold text-[#684bbd]">See plans <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></a>
      </motion.div>
    </div>
  </section>;
}

function JourneyVisual({ step }: { step: number }) {
  if (step === 0) return <div className="journey-visual mt-8 flex h-44 items-end justify-center gap-2 rounded-[22px] bg-gradient-to-br from-violet-50 to-white p-4"><motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="w-full rounded-2xl bg-white p-3 shadow-[0_15px_35px_-20px_rgba(82,57,130,.45)]"><div className="mb-3 flex items-center gap-2"><span className="h-7 w-7 rounded-lg bg-violet-100" /><div><span className="block h-1.5 w-20 rounded bg-[#ded9e5]" /><span className="mt-1.5 block h-1 w-12 rounded bg-[#efedf2]" /></div></div><div className="grid grid-cols-3 gap-2">{[0, 1, 2].map(item => <span key={item} className={`aspect-square rounded-lg ${item === 1 ? "bg-cyan-100" : "bg-violet-100"}`} />)}</div></motion.div></div>;
  if (step === 1) return <div className="journey-visual mt-8 grid h-44 place-items-center rounded-[22px] bg-gradient-to-br from-cyan-50 to-white"><motion.div animate={{ rotate: [0, 2, -2, 0], y: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="rounded-[22px] bg-white p-4 shadow-[0_18px_40px_-20px_rgba(36,174,205,.45)]"><div className="grid grid-cols-5 gap-1">{Array.from({ length: 25 }, (_, item) => <span key={item} className={`h-2.5 w-2.5 rounded-[2px] ${(item * 7) % 5 < 2 ? "bg-[#3b3350]" : item % 3 === 0 ? "bg-cyan-400" : "bg-violet-200"}`} />)}</div><p className="mt-3 text-center text-[7px] font-semibold text-[#716b78]">Scan to shop</p></motion.div></div>;
  return <div className="journey-visual mt-8 flex h-44 items-center justify-center rounded-[22px] bg-gradient-to-br from-violet-50 via-white to-cyan-50 p-4"><motion.div animate={{ y: [6, -6, 6], rotate: [-1, 1, -1] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} className="w-full rounded-2xl bg-white p-4 shadow-[0_18px_45px_-22px_rgba(79,55,128,.5)]"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white"><ShoppingBag className="h-4 w-4" /></span><div className="flex-1"><p className="text-[9px] font-semibold">New order #1048</p><p className="mt-1 text-[7px] text-[#9d96a3]">3 items · $84.00</p></div><span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" /></div><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#eeeaf3]"><motion.span initial={{ width: "18%" }} whileInView={{ width: "82%" }} transition={{ duration: 1.2, delay: .4 }} className="block h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" /></div></motion.div></div>;
}

function TrustedCompanies() {
  const businessTypes = ["Retail stores", "Restaurants", "Cafes", "Fashion brands", "Beauty salons", "Online sellers"];
  const repeated = [...businessTypes, ...businessTypes];
  return <section className="overflow-hidden bg-white px-4 py-12 sm:py-16"><div className="mx-auto max-w-6xl text-center"><motion.h2 {...reveal} className="text-xl font-medium tracking-[-.035em] sm:text-3xl">Made for every <span className="text-[#725bd8]">growing</span> business</motion.h2><div className="mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"><motion.div className="flex w-max gap-3" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }}>{repeated.map((businessType, index) => <div key={`${businessType}-${index}`} className="flex min-w-36 items-center justify-center gap-2 rounded-full border border-[#ebe8f1] bg-[#faf9fc] px-5 py-3 text-sm font-semibold text-[#5d5964] shadow-sm"><span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-violet-100 to-cyan-100 text-[#6b55d8]"><Store className="h-3.5 w-3.5" /></span>{businessType}</div>)}</motion.div></div></div></section>;
}

function SoftCard({ className = "", icon: Icon, eyebrow, title, description, children }: { className?: string; icon: typeof Store; eyebrow: string; title: string; description: string; children?: React.ReactNode }) { return <motion.article {...reveal} whileHover={{ y: -7, scale: 1.005 }} className={`feature-card relative min-h-[300px] overflow-hidden rounded-[20px] border border-[#e8e5ee] bg-[#fbfafc] p-6 shadow-[0_24px_70px_-50px_rgba(80,52,119,.55)] sm:p-8 ${className}`}><div className="feature-eyebrow flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.16em] text-[#725bd8]"><span className="feature-icon grid h-9 w-9 place-items-center rounded-xl bg-[#ece7ff]"><Icon className="h-4 w-4" /></span>{eyebrow}</div><h3 className="mt-7 max-w-lg text-2xl font-medium leading-[1.12] tracking-[-.035em] sm:text-3xl">{title}</h3><p className="feature-copy mt-4 max-w-md text-sm leading-6 text-[#777080]">{description}</p>{children}</motion.article>; }
function StorefrontPreview() { return <div className="mt-8 grid grid-cols-3 gap-2 rounded-2xl border border-[#e4dced] bg-[#f6f2fa] p-2.5">{[["Everyday tote", "$18"], ["Stone mug", "$12"], ["Soft cap", "$15"]].map(([name, price], index) => <div key={name} className="rounded-xl bg-white p-2 shadow-sm"><div className={`grid aspect-square place-items-center rounded-lg ${["bg-[#eee5fa]", "bg-[#e5f4ef]", "bg-[#f7e9e2]"][index]}`}><ShoppingBag className="h-5 w-5 text-[#8754d8] opacity-55" /></div><p className="mt-2 truncate text-[9px] font-semibold">{name}</p><p className="text-[9px] text-[#9b94a1]">{price}</p></div>)}</div>; }
function OrderToast({ label, detail, subtle = false }: { label: string; detail: string; subtle?: boolean }) { return <motion.div initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className={`flex items-center gap-3 rounded-xl border border-[#e1d6ed] bg-white p-3 shadow-lg ${subtle ? "ml-5 opacity-75" : ""}`}><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f0e7fb] text-[#8754d8]"><MessageCircleMore className="h-4 w-4" /></span><div><p className="text-xs font-semibold">{label}</p><p className="mt-0.5 text-[9px] text-[#968e9e]">{detail}</p></div></motion.div>; }
