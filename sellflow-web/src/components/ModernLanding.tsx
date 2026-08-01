import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  CircleDollarSign,
  Globe2,
  LayoutDashboard,
  MessageCircleMore,
  PackageCheck,
  Palette,
  Play,
  QrCode,
  Rocket,
  Send,
  ShoppingBag,
  Sparkles,
  Store,
} from "lucide-react";
import { useAuth } from "./Auth/AuthContext";
import { Pricing } from "./Pricing";

const purple = "#8754d8";

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

  return (
    <div className="landing-soft min-h-screen bg-white px-3 pt-3 text-[#18171d] sm:px-5 sm:pt-5">
      <section id="home" className="hero-purple relative isolate min-h-[820px] overflow-hidden rounded-[22px] px-5 pb-0 pt-32 shadow-[0_28px_90px_-35px_rgba(80,57,185,.72)] sm:rounded-[28px] sm:px-8 sm:pt-36">
        <motion.div aria-hidden="true" className="absolute -left-[12%] -top-[30%] -z-10 h-[44rem] w-[44rem] rounded-full bg-[#a691ff]/45 blur-[90px]" animate={{ x: [0, 60, 0], y: [0, 30, 0], scale: [1, 1.08, 1] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div aria-hidden="true" className="absolute -right-[12%] top-[5%] -z-10 h-[38rem] w-[38rem] rounded-full bg-[#9e8cff]/50 blur-[95px]" animate={{ x: [0, -45, 0], y: [0, 45, 0], scale: [1.08, .96, 1.08] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />
        <div aria-hidden="true" className="hero-ray hero-ray-one" />
        <div aria-hidden="true" className="hero-ray hero-ray-two" />
        <div aria-hidden="true" className="hero-ray hero-ray-three" />
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:92px_92px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />

        <div className="relative mx-auto max-w-6xl text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-medium text-white/85 shadow-sm backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5" /> Fastest way to launch your online store
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.05, ease: [0.16, 1, 0.3, 1] }} className="mx-auto mt-7 max-w-[900px] text-[3rem] font-medium leading-[1.01] tracking-[-.055em] text-white sm:text-6xl md:text-7xl lg:text-[4.9rem]">
            Empowering you to <span className="whitespace-nowrap">sell <Rocket className="inline h-[.82em] w-[.82em] -translate-y-[.05em] stroke-[1.5]" /></span> and grow wisely.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.16 }} className="mx-auto mt-5 max-w-xl text-xs leading-6 text-white/65 sm:text-sm">
            The complete commerce platform for modern local businesses—storefront, orders, inventory, and insights in one place.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.24 }} className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button onClick={() => openAuth("register")} className="group inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-xs font-semibold text-[#5441bf] shadow-[0_12px_30px_-12px_rgba(30,18,105,.7)] transition hover:-translate-y-1">
              Get started free <span className="grid h-6 w-6 place-items-center rounded-full bg-[#6b55dc] text-white"><ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" /></span>
            </button>
            <a href="#features" className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-xs font-medium text-white backdrop-blur transition hover:bg-white/20"><Play className="h-3.5 w-3.5 fill-white" /> Explore features</a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }} className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] font-medium text-white/50">
            {["No card required", "30-day Growth trial", "Live in minutes"].map((item) => <span key={item} className="flex items-center gap-1.5"><Check className="h-3 w-3 text-white/80" />{item}</span>)}
          </motion.div>
        </div>

        <HeroDashboard />
      </section>

      <TrustedCompanies />

      <section className="relative mx-auto max-w-7xl px-3 py-20 sm:px-8 lg:py-28">
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

      <section id="how-it-works" className="relative overflow-hidden rounded-[24px] border border-[#ece9f4] bg-[#f8f7fb] px-5 py-24 sm:rounded-[30px] sm:px-10 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_55%,rgba(201,171,244,.3),transparent_34%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.72fr_1.28fr] lg:items-center">
          <motion.div {...reveal}>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#8754d8]">How it works</p>
            <h2 className="mt-4 text-4xl font-medium leading-[1.08] tracking-[-.05em] sm:text-6xl">From idea to first order, beautifully simple.</h2>
            <div className="mt-10 space-y-5">
              {[["01", "Set up", "Add your business and products."], ["02", "Share", "Publish your store link or QR code."], ["03", "Grow", "Manage orders and learn what sells."]].map(([number, title, copy]) => <div key={number} className="grid grid-cols-[2.5rem_1fr] gap-3 rounded-2xl border border-[#ddd5e8] bg-white/75 p-4 shadow-sm backdrop-blur"><span className="font-mono text-xs font-semibold text-[#8754d8]">{number}</span><div><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 text-xs leading-5 text-[#777080]">{copy}</p></div></div>)}
            </div>
          </motion.div>
          <DashboardDetail />
        </div>
      </section>

      <Pricing />

      <section id="faq" className="mx-auto grid max-w-7xl gap-12 px-3 pb-28 sm:px-8 lg:grid-cols-[.7fr_1.3fr] lg:pb-36">
        <motion.div {...reveal}><p className="text-xs font-semibold uppercase tracking-[.18em] text-[#8754d8]">Questions, answered</p><h2 className="mt-4 text-4xl font-medium tracking-[-.05em] sm:text-5xl">Good to know.</h2><p className="mt-5 max-w-sm text-sm leading-7 text-[#746d7d]">Still curious? We’ll help you find the right setup for your business.</p><a href="https://t.me/tolasannn" target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#7543bd]">Talk to us on Telegram <ArrowRight className="h-4 w-4" /></a></motion.div>
        <div className="overflow-hidden rounded-3xl border border-[#dcd3e9] bg-white/70 px-5 shadow-[0_20px_60px_-40px_rgba(80,52,119,.45)] backdrop-blur sm:px-7">{faqs.map(([question, answer], index) => <div key={question} className="border-b border-[#e6e0ed] last:border-0"><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between gap-5 py-6 text-left text-sm font-semibold sm:text-base"><span>{question}</span><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#d8cce8] text-[#7543bd] transition ${openFaq === index ? "rotate-180 bg-[#8754d8] text-white" : "bg-white"}`}><ChevronDown className="h-4 w-4" /></span></button><AnimatePresence initial={false}>{openFaq === index && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="max-w-2xl pb-6 pr-8 text-sm leading-7 text-[#746d7d]">{answer}</p></motion.div>}</AnimatePresence></div>)}</div>
      </section>
    </div>
  );
}

function HeroDashboard() {
  return (
    <motion.div initial={{ opacity: 0, y: 60, scale: .97 }} animate={{ opacity: 1, y: [0, -7, 0], scale: 1 }} transition={{ opacity: { duration: .95, delay: .32 }, scale: { duration: .95, delay: .32 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 } }} className="relative mx-auto mt-12 w-full max-w-[1000px] sm:mt-14">
      <div className="absolute -inset-8 rounded-[3rem] border border-white/15 bg-white/10 blur-[1px]" />
      <div className="absolute -inset-16 -z-10 bg-white/15 blur-[65px]" />
      <div className="relative overflow-hidden rounded-t-[20px] border border-white/45 bg-white/90 p-2 shadow-[0_20px_65px_-22px_rgba(39,25,112,.68)] backdrop-blur sm:rounded-t-[26px] sm:p-3">
        <div className="overflow-hidden rounded-t-[16px] border border-[#ebe7ef] bg-[#fbfafc] sm:rounded-t-[20px]">
          <div className="flex h-14 items-center justify-between border-b border-[#ece8f0] bg-white px-4 sm:px-6"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#8754d8] text-white"><ShoppingBag className="h-4 w-4" /></span><span className="text-xs font-bold text-[#584167]">SellFlow</span></div><div className="flex items-center gap-2"><span className="hidden rounded-full bg-[#f0e7fb] px-3 py-1.5 text-[9px] font-semibold text-[#7543bd] sm:block">Store is live</span><span className="h-8 w-8 rounded-full bg-gradient-to-br from-[#e0d2ef] to-[#b792db]" /></div></div>
          <div className="grid min-h-[360px] grid-cols-[68px_1fr] sm:min-h-[430px] sm:grid-cols-[165px_1fr]">
            <aside className="border-r border-[#ece8f0] bg-white p-2 sm:p-4"><p className="hidden px-2 text-[9px] font-semibold uppercase tracking-widest text-[#aaa2b0] sm:block">Workspace</p><div className="mt-3 space-y-1">{[LayoutDashboard, ShoppingBag, PackageCheck, BarChart3, Palette].map((Icon, index) => <div key={index} className={`flex items-center gap-2 rounded-lg p-2 text-[10px] font-medium ${index === 0 ? "bg-[#f1eafb] text-[#7543bd]" : "text-[#9991a1]"}`}><Icon className="h-4 w-4" /><span className="hidden sm:inline">{["Overview", "Orders", "Products", "Analytics", "Store design"][index]}</span></div>)}</div></aside>
            <div className="p-4 text-left sm:p-7"><div className="flex items-start justify-between"><div><p className="text-[10px] text-[#a39ba9]">Good morning, Dara</p><h3 className="mt-1 text-lg font-semibold sm:text-2xl">Here’s your store today.</h3></div><button className="hidden rounded-lg bg-[#8754d8] px-3 py-2 text-[10px] font-semibold text-white sm:block">View storefront</button></div><div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3"><Metric label="Revenue" value="$1,248" change="+18.4%" /><Metric label="Orders" value="86" change="+12.1%" /><Metric label="Visitors" value="1,429" change="+8.6%" extra="hidden sm:block" /><Metric label="Products" value="42" change="All live" extra="hidden sm:block" /></div><div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-[1.4fr_.6fr]"><SalesChart /><RecentOrders /></div></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TrustedCompanies() {
  const companies = ["ABA", "Wing", "Telegram", "Shopify", "Meta", "Google"];
  const repeated = [...companies, ...companies];
  return <section className="overflow-hidden bg-white px-4 py-12 sm:py-16"><div className="mx-auto max-w-6xl text-center"><motion.h2 {...reveal} className="text-xl font-medium tracking-[-.035em] sm:text-3xl">Trusted tools for <span className="text-[#725bd8]">growing</span> businesses</motion.h2><div className="mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"><motion.div className="flex w-max gap-3" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }}>{repeated.map((company, index) => <div key={`${company}-${index}`} className="flex min-w-36 items-center justify-center gap-2 rounded-full border border-[#ebe8f1] bg-[#faf9fc] px-5 py-3 text-sm font-semibold text-[#5d5964] shadow-sm"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#ece7ff] text-[#6b55d8]"><Sparkles className="h-3.5 w-3.5" /></span>{company}</div>)}</motion.div></div></div></section>;
}

function Metric({ label, value, change, extra = "" }: { label: string; value: string; change: string; extra?: string }) { return <div className={`rounded-xl border border-[#ebe6ef] bg-white p-3 shadow-sm ${extra}`}><p className="text-[8px] text-[#aaa2b0] sm:text-[9px]">{label}</p><p className="mt-1 text-sm font-semibold sm:text-lg">{value}</p><p className="mt-1 text-[8px] font-semibold text-[#8754d8]">{change}</p></div>; }
function SalesChart() { return <div className="rounded-xl border border-[#ebe6ef] bg-white p-3 sm:p-4"><div className="flex items-center justify-between"><div><p className="text-[9px] text-[#aaa2b0]">Revenue</p><p className="text-xs font-semibold">This week</p></div><span className="text-[9px] font-semibold text-[#8754d8]">+24.8%</span></div><div className="mt-5 flex h-24 items-end gap-1.5 sm:h-28 sm:gap-2">{[36, 52, 44, 68, 55, 77, 93, 72, 100, 86].map((height, index) => <motion.span key={index} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ delay: .65 + index * .04, duration: .45 }} className={`flex-1 rounded-t-sm ${index === 8 ? "bg-[#8754d8]" : "bg-[#e5d8f5]"}`} />)}</div></div>; }
function RecentOrders() { return <div className="hidden rounded-xl border border-[#ebe6ef] bg-white p-4 sm:block"><div className="flex items-center justify-between"><p className="text-xs font-semibold">Recent orders</p><span className="text-[8px] text-[#8754d8]">View all</span></div><div className="mt-4 space-y-3">{[["#1048", "$24.50"], ["#1047", "$18.00"], ["#1046", "$32.75"]].map(([id, value]) => <div key={id} className="flex items-center justify-between border-b border-[#f0edf3] pb-2 text-[9px] last:border-0"><span className="text-[#7a7281]">{id}</span><span className="font-semibold">{value}</span></div>)}</div></div>; }

function SoftCard({ className = "", icon: Icon, eyebrow, title, description, children }: { className?: string; icon: typeof Store; eyebrow: string; title: string; description: string; children?: React.ReactNode }) { return <motion.article {...reveal} whileHover={{ y: -7, scale: 1.005 }} className={`feature-card relative min-h-[300px] overflow-hidden rounded-[20px] border border-[#e8e5ee] bg-[#fbfafc] p-6 shadow-[0_24px_70px_-50px_rgba(80,52,119,.55)] sm:p-8 ${className}`}><div className="feature-eyebrow flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.16em] text-[#725bd8]"><span className="feature-icon grid h-9 w-9 place-items-center rounded-xl bg-[#ece7ff]"><Icon className="h-4 w-4" /></span>{eyebrow}</div><h3 className="mt-7 max-w-lg text-2xl font-medium leading-[1.12] tracking-[-.035em] sm:text-3xl">{title}</h3><p className="feature-copy mt-4 max-w-md text-sm leading-6 text-[#777080]">{description}</p>{children}</motion.article>; }
function StorefrontPreview() { return <div className="mt-8 grid grid-cols-3 gap-2 rounded-2xl border border-[#e4dced] bg-[#f6f2fa] p-2.5">{[["Everyday tote", "$18"], ["Stone mug", "$12"], ["Soft cap", "$15"]].map(([name, price], index) => <div key={name} className="rounded-xl bg-white p-2 shadow-sm"><div className={`grid aspect-square place-items-center rounded-lg ${["bg-[#eee5fa]", "bg-[#e5f4ef]", "bg-[#f7e9e2]"][index]}`}><ShoppingBag className="h-5 w-5 text-[#8754d8] opacity-55" /></div><p className="mt-2 truncate text-[9px] font-semibold">{name}</p><p className="text-[9px] text-[#9b94a1]">{price}</p></div>)}</div>; }
function OrderToast({ label, detail, subtle = false }: { label: string; detail: string; subtle?: boolean }) { return <motion.div initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className={`flex items-center gap-3 rounded-xl border border-[#e1d6ed] bg-white p-3 shadow-lg ${subtle ? "ml-5 opacity-75" : ""}`}><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f0e7fb] text-[#8754d8]"><MessageCircleMore className="h-4 w-4" /></span><div><p className="text-xs font-semibold">{label}</p><p className="mt-0.5 text-[9px] text-[#968e9e]">{detail}</p></div></motion.div>; }

function DashboardDetail() { return <motion.div {...reveal} className="relative"><div className="absolute -inset-12 bg-[#af7fe2]/20 blur-[70px]" /><div className="relative overflow-hidden rounded-[26px] border border-[#d9c9ea] bg-white p-3 shadow-[0_30px_80px_-35px_rgba(92,52,141,.5)] sm:p-5"><div className="flex items-center justify-between rounded-xl bg-[#fbf9fc] px-4 py-3"><div className="flex items-center gap-2"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#8754d8] text-white"><ShoppingBag className="h-3.5 w-3.5" /></span><span className="text-xs font-semibold">SellFlow</span></div><span className="rounded-lg bg-[#f0e7fb] px-3 py-1.5 text-[9px] font-semibold text-[#7543bd]">Open store</span></div><div className="mt-3 grid gap-3 sm:grid-cols-[1.25fr_.75fr]"><div className="rounded-xl bg-[#fbfafc] p-4"><div className="flex items-end justify-between"><div><p className="text-[9px] text-[#9d95a4]">Net sales</p><p className="mt-1 text-2xl font-semibold">$4,820.40</p></div><p className="text-[9px] font-semibold text-[#8754d8]">+16.8%</p></div><svg className="mt-5 h-40 w-full" viewBox="0 0 500 180" fill="none"><defs><linearGradient id="softChart" x1="0" y1="0" x2="0" y2="1"><stop stopColor={purple} stopOpacity=".25"/><stop offset="1" stopColor={purple} stopOpacity="0"/></linearGradient></defs><path d="M0 145 C45 132 60 118 105 124 S170 72 215 90 S270 42 315 68 S380 25 430 45 S475 20 500 12 V180 H0Z" fill="url(#softChart)"/><path d="M0 145 C45 132 60 118 105 124 S170 72 215 90 S270 42 315 68 S380 25 430 45 S475 20 500 12" stroke={purple} strokeWidth="4" strokeLinecap="round"/></svg></div><div className="rounded-xl bg-[#fbfafc] p-4"><p className="text-[9px] text-[#9d95a4]">Today’s overview</p><div className="mt-4 space-y-3">{[["Orders", "28", ShoppingBag], ["Revenue", "$684", CircleDollarSign], ["Visitors", "420", Globe2]].map(([name, value, Icon]) => { const ItemIcon = Icon as typeof ShoppingBag; return <div key={name as string} className="flex items-center gap-3 rounded-lg bg-white p-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f0e7fb] text-[#8754d8]"><ItemIcon className="h-4 w-4" /></span><div><p className="text-[8px] text-[#a49ca9]">{name as string}</p><p className="text-sm font-semibold">{value as string}</p></div></div>; })}</div></div></div></div></motion.div>; }
