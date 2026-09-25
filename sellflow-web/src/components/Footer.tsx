import { ArrowRight, Mail, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandLogo } from "./ui/BrandLogo";

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Footer() {
  return (
    <footer className="bg-[#111012]/80 text-white">
      <div className="relative overflow-hidden px-5 py-12 sm:px-8 lg:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_0%,rgba(117,87,232,.18),transparent_34%)]" />
        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#a991ff]">Your first 30 days are on us</p>
              <h2 className="mt-4 text-3xl font-medium tracking-[-.045em] sm:text-4xl">Put your store online and start taking orders.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">Launch a branded storefront, share your link, and manage customer orders from one simple workspace.</p>
            </div>
            <Link to="/register" className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-[#7557e8] px-5 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#6549d3] lg:self-auto">Start 30-day trial <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" /></Link>
          </div>

          <div className="grid gap-10 py-10 md:grid-cols-[1.15fr_.85fr] md:items-start">
            <div>
              <Link to="/" aria-label="SellFlow home" className="inline-block rounded-lg bg-white px-3 py-2"><BrandLogo markClassName="h-7 w-7" wordmarkClassName="text-base" /></Link>
              <p className="mt-4 max-w-sm text-xs leading-6 text-white/45">Storefront, orders, inventory, and Telegram workflows for modern local businesses.</p>
              <div className="mt-5 flex gap-2"><a href="mailto:tolasan369369@gmail.com" aria-label="Email SellFlow" className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10"><Mail className="h-4 w-4" /></a><a href="https://t.me/tolasannn" target="_blank" rel="noopener noreferrer" aria-label="SellFlow on Telegram" className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10"><Send className="h-4 w-4" /></a></div>
            </div>
            <nav className="grid grid-cols-2 gap-x-6 gap-y-4" aria-label="Footer navigation">{footerLinks.map((link) => <a key={link.href} href={link.href} className="text-xs font-medium text-white/55 transition hover:text-white">{link.label}</a>)}</nav>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-[11px] text-white/35 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} SellFlow. All rights reserved.</p><p>Built for modern businesses in Cambodia.</p></div>
        </div>
      </div>
    </footer>
  );
}
