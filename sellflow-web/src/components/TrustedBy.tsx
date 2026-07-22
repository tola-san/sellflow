import { motion, useReducedMotion } from "framer-motion";
import { Cake, Coffee, Flower2, Shirt, Smartphone } from "lucide-react";

const sellerTypes = [
  { name: "Fashion sellers", icon: Shirt },
  { name: "Beauty shops", icon: Flower2 },
  { name: "Phone stores", icon: Smartphone },
  { name: "Coffee shops", icon: Coffee },
  { name: "Bakeries", icon: Cake },
];

export function TrustedBy() {
  const reduceMotion = useReducedMotion();
  const repeated = [...sellerTypes, ...sellerTypes];

  return (
    <section className="border-b border-violet-100 bg-gradient-to-r from-sky-50/60 via-white to-amber-50/50 py-9">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex items-center justify-center gap-4 py-2">
          <span className="hidden h-px w-32 bg-gradient-to-l from-slate-400/30 to-transparent md:block" />
          <p className="text-center text-xs font-medium text-slate-500 sm:text-sm">Made for big ideas and growing local businesses</p>
          <span className="hidden h-px w-32 bg-gradient-to-r from-slate-400/30 to-transparent md:block" />
        </div>

        <div className="mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div
            className="flex w-max gap-3"
            animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          >
            {repeated.map((seller, index) => (
              <div key={`${seller.name}-${index}`} className="flex min-w-44 items-center justify-center gap-2.5 rounded-full border border-white bg-white/80 px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur">
                <seller.icon className="h-4 w-4 text-violet-600" />{seller.name}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
