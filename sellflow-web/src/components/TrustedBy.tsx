import React from "react";
import { motion } from "framer-motion";
import {
  Shirt,
  Flower2,
  Smartphone,
  Coffee,
  Cake,
} from "lucide-react";

type Logo = {
  name: string;
  icon: React.ReactNode;
};

export function TrustedBy() {
  const logos: Logo[] = [
    { name: "Fashion Store", icon: <Shirt className="w-6 h-6" /> },
    { name: "Beauty Shop", icon: <Flower2 className="w-6 h-6" /> },
    { name: "Phone Store", icon: <Smartphone className="w-6 h-6" /> },
    { name: "Coffee Shop", icon: <Coffee className="w-6 h-6" /> },
    { name: "Bakery", icon: <Cake className="w-6 h-6" /> },
  ];

  // Duplicate twice for smoother infinite loop
  const marqueeLogos = [...logos, ...logos, ...logos];

  return (
    <section className="relative overflow-hidden border-y border-surface bg-canvas/50 py-14">
      <div className="mx-auto max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center text-sm font-medium text-muted"
        >
          Trusted by local online stores and growing businesses in Cambodia
        </motion.p>

        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />

        <motion.div
          className="flex w-max gap-6"
          animate={{
            x: [0, "-50%"],        // ← Reversed + smoother
          }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: "linear",
            repeatType: "loop",
          }}
          style={{
            x: "-25%",              // Important: start from middle of first set
          }}
        >
          {marqueeLogos.map((logo, index) => (
            <motion.div
              key={`${logo.name}-${index}`}
              whileHover={{ y: -4, scale: 1.03 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-4 rounded-2xl border border-surface/60 px-6 py-4 backdrop-blur-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {logo.icon}
              </div>
              <span className="whitespace-nowrap text-sm font-semibold text-foreground">
                {logo.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}