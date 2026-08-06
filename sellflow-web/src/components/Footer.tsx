import { ArrowUpRight, Heart, Mail, Send } from "lucide-react";
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
    <footer className="bg-[#f7f5fb]">
      <div className="relative overflow-hidden px-5 py-10 text-[#201d28] sm:px-10 lg:px-14 lg:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(211,189,244,.42),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 border-b border-[#dfd7e8] pb-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#8754d8]">Your first 30 days are on us</p>
              <h2 className="mt-4 text-3xl font-medium tracking-[-.045em] sm:text-5xl">Put your store online and start taking orders.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#746d7d]">Launch a branded storefront, share your link, and manage customer orders from one simple workspace.</p>
            </div>
            <Link to="/register" className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-[#8754d8] px-5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-1 hover:bg-[#7543bd] lg:self-auto">Start 30-day trial <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
          </div>

          <div className="grid gap-10 py-10 md:grid-cols-[1.2fr_1fr] md:items-start">
            <div>
              <Link to="/" aria-label="SellFlow home"><BrandLogo markClassName="h-10 w-10" wordmarkClassName="text-xl" /></Link>
              <p className="mt-4 max-w-sm text-sm leading-6 text-[#7a7381]">Storefront, orders, inventory, and Telegram workflows for modern local businesses.</p>
              <div className="mt-5 flex gap-2"><a href="mailto:tolasan369369@gmail.com" aria-label="Email SellFlow" className="grid h-9 w-9 place-items-center rounded-full border border-[#d9cfE5] bg-white text-[#7543bd] transition hover:bg-[#f1e8fb]"><Mail className="h-4 w-4" /></a><a href="https://t.me/tolasannn" target="_blank" rel="noopener noreferrer" aria-label="SellFlow on Telegram" className="grid h-9 w-9 place-items-center rounded-full border border-[#d9cfe5] bg-white text-[#7543bd] transition hover:bg-[#f1e8fb]"><Send className="h-4 w-4" /></a></div>
            </div>
            <nav className="grid grid-cols-2 gap-4 sm:grid-cols-4" aria-label="Footer navigation">{footerLinks.map((link) => <a key={link.href} href={link.href} className="text-sm font-medium text-[#756e7b] transition hover:text-[#7543bd]">{link.label}</a>)}</nav>
          </div>

          <div className="flex flex-col gap-3 border-t border-[#dfd7e8] pt-6 text-xs text-[#8b8491] sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} SellFlow. All rights reserved.</p><p className="flex items-center gap-1.5">Built with <Heart className="h-3.5 w-3.5 fill-[#8754d8] text-[#8754d8]" /> for modern businesses in Cambodia.</p></div>
        </div>
      </div>
    </footer>
  );
}
