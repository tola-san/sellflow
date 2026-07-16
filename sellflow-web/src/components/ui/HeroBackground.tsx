import { motion, useReducedMotion } from "framer-motion";

type BackgroundIntensity = "soft" | "medium" | "strong";

interface HeroBackgroundProps {
  intensity?: BackgroundIntensity;
  className?: string;
}

const intensityValues: Record<BackgroundIntensity, number> = {
  soft: 0.55,
  medium: 0.78,
  strong: 1,
};

function OrbitSystem({ strength }: { strength: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="absolute left-1/2 top-[24rem] h-[48rem] w-[48rem] -translate-x-1/2 -translate-y-1/2 sm:h-[58rem] sm:w-[58rem]"
      style={{
        opacity: 0.60 * strength,
        maskImage: "radial-gradient(circle, transparent 0%, black 34%, black 74%, transparent 96%)",
        WebkitMaskImage: "radial-gradient(circle, transparent 0%, black 34%, black 74%, transparent 96%)",
      }}
    >
      <motion.div
        className="absolute inset-5 rounded-full border border-violet-400/55"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500 shadow-[0_0_22px_rgba(139,92,246,0.7)]" />
        <span className="absolute bottom-[14%] right-[12%] h-1.5 w-1.5 rounded-full bg-blue-100 shadow-[0_0_18px_rgba(96,165,250,0.65)]" />
      </motion.div>

      <motion.div
        className="absolute inset-[7.5rem] rounded-full border border-dashed border-cyan-400/45"
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute right-[7%] top-[22%] h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.7)]" />
      </motion.div>

      <motion.div
        className="absolute inset-[14rem] rounded-full border border-violet-400/40"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute bottom-[8%] left-[22%] h-1.5 w-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_16px_rgba(232,121,249,0.65)]" />
      </motion.div>
    </div>
  );
}

export function HeroBackground({ intensity = "medium", className = "" }: HeroBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const strength = intensityValues[intensity];

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: 0.50 * strength,
          backgroundImage:
            "linear-gradient(rgba(124,58,237,.13) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.10) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          maskImage: "radial-gradient(ellipse 92% 72% at 50% 26%, black 4%, rgba(0,0,0,.82) 52%, transparent 92%)",
          WebkitMaskImage: "radial-gradient(ellipse 92% 72% at 50% 26%, black 4%, rgba(0,0,0,.82) 52%, transparent 92%)",
        }}
        animate={reduceMotion ? undefined : { backgroundPosition: ["0px 0px", "44px 44px"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute left-1/2 top-0 h-[32rem] w-[52rem] -translate-x-1/2 rounded-full bg-violet-400/30 blur-[120px]"
        style={{ opacity: strength }}
        animate={reduceMotion ? undefined : { scale: [1, 1.1, 1], opacity: [0.55 * strength, 0.9 * strength, 0.55 * strength] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -left-40 top-20 h-[28rem] w-[28rem] rounded-full bg-purple-500/30 blur-[105px]"
        animate={reduceMotion ? undefined : { x: [0, 38, 0], y: [0, 24, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        style={{ opacity: 0.8 * strength }}
      />
      <motion.div
        className="absolute -right-44 top-32 h-[30rem] w-[30rem] rounded-full bg-cyan-400/30 blur-[110px]"
        animate={reduceMotion ? undefined : { x: [0, -42, 0], y: [18, -14, 18] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        style={{ opacity: 0.85 * strength }}
      />

      <OrbitSystem strength={strength} />

      <div className="absolute left-1/2 top-8 h-[34rem] w-[min(88vw,56rem)] -translate-x-1/2 rounded-[50%] bg-white/55 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-white via-white/85 to-transparent" />
    </div>
  );
}
