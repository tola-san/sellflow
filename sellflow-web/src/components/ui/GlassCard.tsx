import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}
export function GlassCard({
  children,
  className,
  hoverEffect = false
}: GlassCardProps) {
  const baseClasses =
  'bg-white/70 backdrop-blur-xl border border-brand-gray/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden';
  if (hoverEffect) {
    return (
      <motion.div
        whileHover={{
          y: -5,
          boxShadow: '0 20px 40px rgb(0,0,0,0.08)'
        }}
        transition={{
          duration: 0.3,
          ease: 'easeOut'
        }}
        className={twMerge(baseClasses, className)}>
        
        {children}
      </motion.div>);

  }
  return <div className={twMerge(baseClasses, className)}>{children}</div>;
}