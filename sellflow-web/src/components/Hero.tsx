import { motion } from "framer-motion";
import { ArrowUpRight, Check, ExternalLink, Star } from "lucide-react";
import { useAuth } from "./Auth/AuthContext";
import { DotField } from "./ui/DotField";

const trustPoints = ["Free to start", "No credit card", "Launch in minutes"];
const sellerInitials = [
  { initials: "DS", color: "bg-violet-600" },
  { initials: "LM", color: "bg-sky-500" },
  { initials: "SK", color: "bg-fuchsia-500" },
  { initials: "MN", color: "bg-slate-800" },
];

export function Hero() {
  const { openAuth } = useAuth();

  return (
    <section id="home" className="relative isolate overflow-hidden border-b border-violet-100 bg-white pb-20 pt-28 sm:pb-24 sm:pt-36 lg:pb-28 lg:pt-40">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_18%_28%,rgba(186,230,253,.55),transparent_30%),radial-gradient(circle_at_82%_30%,rgba(254,215,170,.42),transparent_31%),radial-gradient(circle_at_50%_50%,rgba(221,214,254,.55),transparent_42%),linear-gradient(to_bottom,#fff,#fbfaff_78%,#fff)]" />
      <motion.div
        aria-hidden="true"
        className="absolute left-[8%] top-28 -z-10 h-72 w-72 rounded-full bg-sky-200/35 blur-[95px]"
        animate={{ x: [0, 70, 0], y: [0, 35, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute right-[6%] top-32 -z-10 h-80 w-80 rounded-full bg-violet-300/30 blur-[105px]"
        animate={{ x: [0, -60, 0], y: [0, -30, 0], scale: [1.08, 0.96, 1.08] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <DotField gap={30} className="z-0 opacity-55 [mask-image:linear-gradient(to_bottom,black_5%,black_72%,transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 text-center sm:px-8">
        <motion.div
  initial={{ opacity: 0, y: -8, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
  className="mx-auto mb-8 flex max-w-fit items-center overflow-hidden rounded-full border border-violet-200/60 bg-white/80 text-[11px] font-medium shadow-lg shadow-violet-100/50 backdrop-blur-xl backdrop-saturate-150 sm:text-xs"
>
  <span className="relative shrink-0 self-stretch bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 py-1.5 text-white shadow-sm">
    <span className="relative z-10">✨ New</span>
    <motion.span
      className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-400 opacity-0"
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  </span>
  <span className="min-w-0 whitespace-nowrap px-3.5 py-1.5 text-slate-700 sm:hidden">
    Telegram order updates are live
  </span>
  <span className="hidden whitespace-nowrap px-3.5 py-1.5 text-slate-700 sm:inline">
    <span className="font-semibold text-violet-600">Telegram orders</span>
    {" • "}
    <span className="font-semibold text-violet-600">storefront themes</span>
    {" • "}
    live status updates
  </span>
</motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="mx-auto max-w-6xl text-5xl font-medium leading-[1.02] tracking-[-0.055em] text-slate-950 sm:text-6xl md:text-7xl lg:text-[5.6rem]"
        >
          Build a bold storefront with{" "}
          <span className="font-editorial whitespace-nowrap tracking-[-0.035em] text-violet-700">thoughtful flow</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: "easeInOut" }}
          className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8"
        >
          Launch a professional storefront, share one link, collect customer orders, and manage your business from one calm dashboard—without writing code.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openAuth("register")}
            className="group relative inline-flex h-12 items-center overflow-hidden rounded-full bg-slate-950 py-1 pl-6 pr-14 text-sm font-semibold text-white shadow-xl shadow-violet-200 transition-all duration-500 hover:pl-14 hover:pr-6"
          >
            <span className="relative z-10">Create your store</span>
            <span className="absolute right-1 grid h-10 w-10 place-items-center rounded-full bg-white text-slate-950 transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </motion.button>
          <a href="#features" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-violet-200 bg-white/75 px-6 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-violet-400 hover:text-violet-700">
            Explore the platform <ExternalLink className="h-4 w-4" />
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.35 }} className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
          {trustPoints.map((item) => <span key={item} className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600" />{item}</span>)}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }} className="mt-8 flex items-center justify-center gap-4">
          <div className="flex items-center pl-2">
            {sellerInitials.map((seller) => (
              <motion.span key={seller.initials} whileHover={{ y: -4, zIndex: 10 }} className={`-ml-2 grid h-10 w-10 place-items-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow-sm ${seller.color}`}>
                {seller.initials}
              </motion.span>
            ))}
          </div>
          <div className="text-left">
            <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}</div>
            <p className="mt-1 text-xs text-slate-500">Designed for ambitious local sellers</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
