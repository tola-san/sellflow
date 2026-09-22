import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BellRing,
  Check,
  ChevronDown,
  CircleDollarSign,
  Globe2,
  LayoutDashboard,
  MessageCircleMore,
  PackageCheck,
  Palette,
  QrCode,
  Send,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Store,
  UsersRound,
} from "lucide-react";
import { useAuth } from "./Auth/AuthContext";
import { Pricing } from "./Pricing";
import { BrandLogo } from "./ui/BrandLogo";
import "./landing.css";

type HeroView = "orders" | "products" | "analytics";

const features = [
  { icon: Store, title: "Mobile storefront", copy: "Publish a branded store customers can open from any link and shop without creating an account." },
  { icon: ShoppingBag, title: "Guest ordering", copy: "Let customers browse, add items, and place orders from mobile in a few simple steps." },
  { icon: Send, title: "Telegram workflow", copy: "Receive new-order alerts and keep customers updated as order and payment statuses change." },
  { icon: PackageCheck, title: "Catalog & inventory", copy: "Keep products, categories, variants, add-ons, availability, and stock connected." },
  { icon: QrCode, title: "Restaurant table QR", copy: "Give every table a QR code that opens the right menu and table ordering experience." },
  { icon: BarChart3, title: "Business analytics", copy: "See revenue, orders, product performance, and low-stock activity in one place." },
];

const faqs = [
  ["How do customers place an order?", "Share your public store link. Customers can browse, add items to their cart, and check out from their phone without creating an account."],
  ["What happens after the 30-day trial?", "Your trial starts with Business features. After 30 days, choose Starter, Business, or Pro based on your catalog, staff, and business needs."],
  ["How do Telegram notifications work?", "Connect Telegram once to receive new-order alerts and send order or payment-status updates without keeping the dashboard open."],
  ["Can I use SellFlow for a restaurant?", "Yes. Business and Pro support menu availability, add-ons, restaurant tables, and table QR ordering alongside the standard storefront."],
  ["Do customers need a SellFlow account?", "No. SellFlow supports guest browsing and checkout, so customers can order quickly from the web or Telegram Mini App."],
];

const testimonials = [
  { name: "Marina", business: "Online fashion seller", quote: "I share one store link instead of sending product photos and prices one by one in chat." },
  { name: "Chan Dara", business: "Dara Roastery", quote: "Orders are easier to follow, stock is clearer, and Telegram tells us when something needs attention." },
  { name: "Sopheap", business: "Natural beauty shop", quote: "I created my store and organized the catalog in less than an hour. The dashboard is simple to understand." },
  { name: "Vicheka", business: "Phone accessories store", quote: "Customers can browse first and send a complete order. It saves us a lot of back-and-forth messages." },
  { name: "Maly", business: "Neighborhood café", quote: "Table QR ordering keeps the lunch rush organized and gives our team one clear order queue." },
  { name: "Sokha", business: "Home bakery", quote: "I can see what was ordered, who ordered it, and exactly what needs to happen next." },
];

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-70px" },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
};

export function ModernLanding() {
  const { openAuth } = useAuth();
  const [heroView, setHeroView] = useState<HeroView>("orders");
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="mondai-landing min-h-screen bg-white text-[#17151c]">
      <section id="home" className="mondai-hero relative overflow-hidden px-5 pb-16 pt-32 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mondai-pill">
            <Sparkles className="h-3 w-3" /> Built for local businesses in Cambodia
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="mx-auto mt-6 max-w-3xl text-[2.55rem] font-semibold leading-[1.02] tracking-[-.055em] sm:text-6xl">
            Your complete selling workflow, <span className="text-[#7557e8]">ready in minutes.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 }} className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#746e7b]">
            Publish a branded mobile storefront, accept guest orders, manage stock and fulfillment, and stay updated through Telegram—all from one dashboard.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }} className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button type="button" onClick={() => openAuth("register")} className="mondai-primary">Start 30-day free trial <ArrowRight className="h-4 w-4" /></button>
            <a href="#features" className="mondai-link">See what is included</a>
          </motion.div>
          <p className="mt-3 text-[11px] text-[#96909c]">No card required · Plans from $3/month after your trial</p>

          <div className="mx-auto mt-9 flex w-fit rounded-lg border border-[#e8e3ee] bg-white p-1 shadow-sm">
            {(["orders", "products", "analytics"] as HeroView[]).map((view) => (
              <button key={view} type="button" onClick={() => setHeroView(view)} className={`relative isolate rounded-md px-4 py-2 text-[11px] font-semibold capitalize transition ${heroView === view ? "text-[#6045b1]" : "text-[#98919f]"}`}>
                {heroView === view && <motion.span layoutId="landing-tab" className="absolute inset-0 -z-10 rounded-md bg-[#f0ebff]" />}{view}
              </button>
            ))}
          </div>

          <DashboardFrame view={heroView} />
        </div>
      </section>

      <BusinessStrip />

      <section id="how-it-works" className="mondai-section px-5 sm:px-8">
        <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-[.82fr_1.18fr]">
          <motion.div {...reveal}>
            <SectionTag>Simple setup</SectionTag>
            <h2 className="mondai-heading mt-4">Go from idea to taking orders in three steps.</h2>
            <div className="mt-8 divide-y divide-[#e8e4ec] border-y border-[#e8e4ec]">
              {[
                ["01", "Create your space", "Add your business details, brand, products, and prices."],
                ["02", "Publish and share", "Share your storefront link or restaurant table QR codes."],
                ["03", "Manage every order", "Track payment, fulfillment, inventory, and customer updates."],
              ].map(([number, title, copy]) => <div key={number} className="grid grid-cols-[40px_1fr] gap-3 py-5"><span className="text-xs font-semibold text-[#8b6fea]">{number}</span><div><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 text-xs leading-5 text-[#7d7683]">{copy}</p></div></div>)}
            </div>
          </motion.div>
          <motion.div {...reveal} className="mondai-soft-panel p-5 sm:p-7">
            <OrderAutomationMockup />
          </motion.div>
        </div>
      </section>

      <section id="features" className="mondai-section px-5 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
            <SectionTag>One connected workflow</SectionTag>
            <h2 className="mondai-heading mt-4">Everything you need to sell online.</h2>
            <p className="mondai-copy mx-auto mt-4 max-w-xl">Simple tools for the customer-facing store and the day-to-day work behind every order.</p>
          </motion.div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, copy }, index) => (
              <motion.article key={title} {...reveal} transition={{ ...reveal.transition, delay: index * .04 }} className="mondai-feature-card group">
                <span className="mondai-icon"><Icon className="h-4 w-4" /></span>
                <h3 className="mt-5 text-base font-semibold tracking-[-.02em]">{title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#7a7480]">{copy}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#7557e8]">Learn more <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" /></span>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mondai-tools px-5 py-24 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
            <SectionTag>Customer to fulfillment</SectionTag>
            <h2 className="mondai-heading mt-4">Unlock productivity with smart sales tools.</h2>
            <p className="mondai-copy mx-auto mt-4 max-w-xl">SellFlow removes repetitive work between a customer discovering an item and your team completing the order.</p>
          </motion.div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ToolCard title="Branded storefront" copy="A fast, mobile-first catalog with guest checkout." icon={Smartphone}><MiniStore /></ToolCard>
            <ToolCard title="Telegram Mini App" copy="A familiar shopping experience inside Telegram." icon={Send}><TelegramCard /></ToolCard>
            <ToolCard title="Order automation" copy="Clear statuses and notifications for every step." icon={BellRing}><StatusFlow /></ToolCard>
            <ToolCard title="Inventory awareness" copy="Availability and stock stay connected to orders." icon={PackageCheck}><StockList /></ToolCard>
            <ToolCard title="Simple reporting" copy="Know what is selling and what needs attention." icon={BarChart3}><MiniChart /></ToolCard>
          </div>
        </div>
      </section>

      <section className="mondai-section px-5 sm:px-8">
        <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <motion.div {...reveal}>
            <SectionTag>Guest ordering</SectionTag>
            <h2 className="mondai-heading mt-4">A storefront that feels effortless on web and Telegram.</h2>
            <p className="mondai-copy mt-5 max-w-md">Customers can browse and order without a SellFlow account. Your catalog, stock, and order queue stay consistent across every entry point.</p>
            <button type="button" onClick={() => openAuth("register")} className="mondai-primary mt-7">Explore SellFlow <ArrowRight className="h-4 w-4" /></button>
          </motion.div>
          <motion.div {...reveal} className="mondai-soft-panel overflow-hidden p-5 sm:p-7"><GuestChannelsMockup /></motion.div>
        </div>
      </section>

      <Integrations />
      <Testimonials />
      <Pricing />

      <section id="faq" className="mondai-section px-5 pb-28 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <SectionTag>Frequently asked questions</SectionTag>
          <h2 className="mondai-heading mt-4">Getting started, answered.</h2>
          <p className="mondai-copy mt-3">Everything you need to know before opening your first SellFlow store.</p>
        </div>
        <div className="mx-auto mt-10 max-w-4xl divide-y divide-[#e5e1e9] border-y border-[#e5e1e9]">
          {faqs.map(([question, answer], index) => (
            <div key={question}>
              <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between gap-6 py-5 text-left text-sm font-semibold">
                <span>{question}</span><ChevronDown className={`h-4 w-4 shrink-0 text-[#7557e8] transition ${openFaq === index ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>{openFaq === index && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="max-w-2xl pb-5 text-xs leading-6 text-[#77717d]">{answer}</p></motion.div>}</AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionTag({ children }: { children: React.ReactNode }) {
  return <span className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#8467dd]">{children}</span>;
}

function DashboardFrame({ view }: { view: HeroView }) {
  const title = view === "orders" ? "Order management" : view === "products" ? "Product catalog" : "Business analytics";
  return (
    <motion.div initial={{ opacity: 0, y: 35, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: .28, duration: .7 }} className="mondai-dashboard mx-auto mt-8 max-w-5xl text-left">
      <div className="flex h-9 items-center gap-1.5 border-b border-[#ebe8ef] px-3"><i /><i /><i /><span className="mx-auto rounded-md bg-[#f4f2f6] px-16 py-1 text-[7px] text-[#aaa4af]">app.sellflow.store</span></div>
      <div className="grid min-h-[340px] grid-cols-[55px_1fr] sm:grid-cols-[160px_1fr]">
        <aside className="border-r border-[#ece9ef] bg-[#fbfafc] p-3 sm:p-4"><BrandLogo markClassName="h-7 w-7" wordmarkClassName="hidden text-xs sm:block" /><div className="mt-7 space-y-1">{["Overview", "Products", "Orders", "Inventory", "Analytics"].map(item => <div key={item} className={`rounded-md px-2 py-2 text-[9px] ${item.toLowerCase() === view || (item === "Overview" && view === "orders") ? "bg-[#eee9ff] font-semibold text-[#694fc2]" : "text-[#9a949f]"}`}>{item}</div>)}</div></aside>
        <main className="min-w-0 p-4 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-[8px] text-[#9a949f]">Your workspace</p><h3 className="mt-1 text-base font-semibold sm:text-xl">{title}</h3></div><span className="rounded-md bg-[#7557e8] px-3 py-2 text-[8px] font-semibold text-white">+ New</span></div><AnimatePresence mode="wait"><motion.div key={view} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .2 }}>{view === "orders" ? <OrdersPanel /> : view === "products" ? <ProductsPanel /> : <AnalyticsPanel />}</motion.div></AnimatePresence></main>
      </div>
    </motion.div>
  );
}

function OrdersPanel() {
  const rows = [["#1048", "Sokha Lim", "$84.00", "Paid"], ["#1047", "Dara Kim", "$42.50", "Packing"], ["#1046", "Maly Chan", "$126.00", "Paid"], ["#1045", "Nita Heng", "$38.00", "Delivered"]];
  return <div className="mt-6 overflow-hidden rounded-lg border border-[#ece9ef]"><div className="grid grid-cols-4 bg-[#faf9fb] px-3 py-2 text-[7px] uppercase text-[#aaa4af]"><span>Order</span><span>Customer</span><span>Total</span><span>Status</span></div>{rows.map(row => <div key={row[0]} className="grid grid-cols-4 border-t border-[#efecf2] px-3 py-3 text-[8px] sm:text-[9px]"><strong>{row[0]}</strong><span>{row[1]}</span><strong>{row[2]}</strong><span className="text-[#684fc0]">{row[3]}</span></div>)}</div>;
}

function ProductsPanel() {
  return <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{["Daily tote", "Cloud mug", "Studio cap", "Soft tee"].map((item, index) => <div key={item} className="rounded-lg border border-[#ece9ef] p-2"><div className={`grid aspect-square place-items-center rounded-md ${index % 2 ? "bg-cyan-50" : "bg-violet-50"}`}><ShoppingBag className="h-5 w-5 text-[#8467dd]" /></div><p className="mt-2 text-[9px] font-semibold">{item}</p><p className="text-[8px] text-[#9a949f]">{24 + index * 8} in stock</p></div>)}</div>;
}

function AnalyticsPanel() {
  return <div className="mt-6 grid gap-3 sm:grid-cols-[1.35fr_.65fr]"><div className="rounded-lg border border-[#ece9ef] p-4"><p className="text-[8px] text-[#99929f]">Paid revenue</p><p className="mt-1 text-xl font-semibold">$8,420</p><div className="mt-5 flex h-28 items-end gap-2">{[32, 48, 40, 68, 54, 82, 70, 94].map((h, i) => <motion.span key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} className="flex-1 rounded-t bg-[#8062e8]" />)}</div></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-1">{[["Orders", "284"], ["Customers", "1,248"], ["Conversion", "6.8%"]].map(([l, v]) => <div key={l} className="rounded-lg bg-[#f5f1ff] p-3"><p className="text-[8px] text-[#99929f]">{l}</p><p className="mt-1 text-sm font-semibold">{v}</p></div>)}</div></div>;
}

function BusinessStrip() {
  const types = [[Store, "Retail"], [Smartphone, "Online sellers"], [QrCode, "Restaurants"], [ShoppingBag, "Boutiques"], [CircleDollarSign, "Growing teams"]] as const;
  return <section className="border-y border-[#efecf2] py-7"><div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-9 gap-y-4 px-5">{types.map(([Icon, label]) => <span key={label} className="flex items-center gap-2 text-xs font-medium text-[#827b88]"><Icon className="h-4 w-4 text-[#8a70de]" />{label}</span>)}</div></section>;
}

function OrderAutomationMockup() {
  return <div className="overflow-hidden rounded-xl border border-[#e6e0eb] bg-white shadow-[0_20px_45px_-30px_rgba(75,53,111,.4)]"><div className="flex items-center justify-between border-b border-[#ece8ef] px-4 py-3"><div><p className="text-[8px] uppercase tracking-wider text-[#9c94a2]">Order automation</p><p className="mt-1 text-xs font-semibold">Order #SF-1048</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[8px] font-semibold text-emerald-700">Paid</span></div><div className="space-y-4 p-4">{[[Check, "Order received", "Customer checked out as guest"], [CircleDollarSign, "Payment confirmed", "$24.50 recorded"], [BellRing, "Telegram alert sent", "Seller notified instantly"], [PackageCheck, "Ready to fulfill", "Stock updated automatically"]].map(([Icon, title, copy], index) => { const I = Icon as typeof Check; return <div key={title as string} className="flex gap-3"><span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${index < 3 ? "bg-[#efeaff] text-[#7557e8]" : "bg-[#f4f2f6] text-[#aaa3af]"}`}><I className="h-3.5 w-3.5" /></span><div><p className="text-[11px] font-semibold">{title as string}</p><p className="mt-1 text-[9px] text-[#958e9b]">{copy as string}</p></div></div>})}</div></div>;
}

function ToolCard({ title, copy, icon: Icon, children }: { title: string; copy: string; icon: typeof Store; children: React.ReactNode }) {
  return <motion.article {...reveal} className="overflow-hidden rounded-xl border border-[#ded7e8] bg-white"><div className="min-h-[175px] bg-gradient-to-b from-white to-[#eee8ff] p-4">{children}</div><div className="border-t border-[#e5dfeb] p-5"><div className="flex items-center gap-2"><Icon className="h-4 w-4 text-[#7557e8]" /><h3 className="text-sm font-semibold">{title}</h3></div><p className="mt-2 text-xs leading-5 text-[#7a7480]">{copy}</p></div></motion.article>;
}

function MiniStore() { return <div className="mx-auto w-40 rounded-[20px] border-[5px] border-[#302a38] bg-white p-2 shadow-lg"><div className="rounded-lg bg-[#7557e8] p-2 text-white"><p className="text-[8px] font-semibold">Bloom Café</p><p className="mt-1 text-[6px] text-white/70">Fresh favorites</p></div><div className="mt-2 grid grid-cols-2 gap-1.5">{[1,2,3,4].map(i => <span key={i} className="aspect-square rounded-md bg-[#f0ebf8]" />)}</div></div>; }
function TelegramCard() { return <div className="mx-auto mt-4 max-w-[220px] rounded-xl border border-[#cde9f6] bg-white p-3 shadow-lg"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#229ed9] text-white"><Send className="h-3.5 w-3.5" /></span><div><p className="text-[10px] font-semibold">New order #1048</p><p className="text-[8px] text-[#8e8794]">3 items · $24.50</p></div></div><button className="mt-3 w-full rounded-md bg-[#229ed9] py-2 text-[8px] font-semibold text-white">Open in SellFlow</button></div>; }
function StatusFlow() { return <div className="mx-auto mt-4 max-w-[230px] space-y-2">{["Order received", "Payment confirmed", "Ready for pickup"].map((x,i) => <div key={x} className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm"><span className={`h-2 w-2 rounded-full ${i < 2 ? "bg-[#7557e8]" : "bg-[#d8d2df]"}`} /><span className="text-[9px] font-medium">{x}</span></div>)}</div>; }
function StockList() { return <div className="mx-auto mt-3 max-w-[230px] overflow-hidden rounded-lg border border-[#e6e0eb] bg-white">{[["Khmer iced coffee", "42"], ["Coconut cake", "8"], ["Daily tote", "24"]].map(([name, n]) => <div key={name} className="flex items-center justify-between border-b border-[#eeeaf1] px-3 py-2.5 last:border-0"><span className="text-[9px] font-medium">{name}</span><span className="text-[8px] text-[#7557e8]">{n} left</span></div>)}</div>; }
function MiniChart() { return <div className="mx-auto mt-4 flex h-28 max-w-[230px] items-end gap-2 rounded-lg bg-white p-4 shadow-sm">{[35,50,44,75,62,92,78].map((h,i) => <span key={i} className="flex-1 rounded-t bg-[#8264e8]" style={{height:`${h}%`}} />)}</div>; }

function GuestChannelsMockup() {
  return <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-[#e5dfeb] bg-white p-3"><div className="flex items-center gap-2 border-b border-[#eeeaf1] pb-2 text-[9px] text-[#8f8795]"><Globe2 className="h-3 w-3" /> sellflow.app/bloom</div><StorefrontTile /></div><div className="rounded-xl border border-[#cfe9f5] bg-white p-3"><div className="flex items-center gap-2 border-b border-[#e1eff5] pb-2 text-[9px] text-[#229ed9]"><Send className="h-3 w-3" /> Telegram Mini App</div><StorefrontTile /></div></div>;
}
function StorefrontTile() { return <div className="pt-3"><div className="rounded-lg bg-[#7557e8] p-3 text-white"><p className="text-[9px] font-semibold">Bloom Café</p><p className="mt-1 text-[7px] text-white/70">Good food, ready when you are.</p></div><div className="mt-2 grid grid-cols-2 gap-2">{["Bowl", "Burger", "Coffee", "Cake"].map((x,i) => <div key={x} className="rounded-md bg-[#f6f2fa] p-2"><span className={`block aspect-square rounded ${i%2?"bg-cyan-50":"bg-violet-100"}`} /><p className="mt-1 text-[7px] font-semibold">{x}</p></div>)}</div></div>; }

function Integrations() {
  const items = [[Send,"Telegram"],[QrCode,"QR ordering"],[Globe2,"Web storefront"],[CircleDollarSign,"Payments"],[MessageCircleMore,"Customer updates"],[LayoutDashboard,"Dashboard"],[Palette,"Store themes"],[UsersRound,"Team access"]] as const;
  return <section className="px-5 py-10 sm:px-8"><motion.div {...reveal} className="mondai-integration mx-auto max-w-5xl px-6 py-16 text-center sm:px-10"><div className="mx-auto flex max-w-xl flex-wrap justify-center gap-3">{items.map(([Icon,label],index)=><motion.span key={label} animate={{y:[0,index%2?-4:4,0]}} transition={{duration:4+index*.2,repeat:Infinity,ease:"easeInOut"}} className="grid h-12 w-12 place-items-center rounded-full border border-[#ddd5e8] bg-white text-[#7a5bd8] shadow-sm" aria-label={label}><Icon className="h-4 w-4" /></motion.span>)}</div><div className="mt-8"><SectionTag>Connected by design</SectionTag></div><h2 className="mondai-heading mx-auto mt-4 max-w-xl">Your essential selling tools, working together.</h2><p className="mondai-copy mx-auto mt-4 max-w-lg">Storefront, customer communication, operations, and reporting stay in one SellFlow workflow.</p></motion.div></section>;
}

function Testimonials() {
  return <section className="mondai-section px-5 sm:px-8"><div className="mx-auto max-w-5xl"><div className="text-center"><SectionTag>Customer stories</SectionTag><h2 className="mondai-heading mt-4">Built for real local businesses.</h2><p className="mondai-copy mt-3">How sellers use SellFlow to make everyday work simpler.</p></div><div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{testimonials.map((item,index)=><motion.blockquote key={item.name} {...reveal} transition={{...reveal.transition,delay:index*.04}} className="rounded-xl border border-[#e6e2e9] bg-white p-5"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#efeaff] text-xs font-semibold text-[#7557e8]">{item.name[0]}</span><div><p className="text-xs font-semibold">{item.name}</p><p className="text-[10px] text-[#928b97]">{item.business}</p></div></div><p className="mt-4 text-xs leading-6 text-[#6f6875]">“{item.quote}”</p></motion.blockquote>)}</div></div></section>;
}
