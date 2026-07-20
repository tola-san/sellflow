import { motion, useReducedMotion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaTelegramPlane, FaTiktok, FaWhatsapp, FaYoutube } from "react-icons/fa";

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

const socialChannels = [
  { name: "Facebook", icon: FaFacebookF, color: "#1877F2", tint: "#eef5ff", angle: 15, duration: 34, reverse: false, orbit: 92 },
  { name: "Instagram", icon: FaInstagram, color: "#E1306C", tint: "#fff0f5", angle: 195, duration: 34, reverse: false, orbit: 92 },
  { name: "Telegram", icon: FaTelegramPlane, color: "#229ED9", tint: "#eefaff", angle: 75, duration: 27, reverse: true, orbit: 70 },
  { name: "TikTok", icon: FaTiktok, color: "#111827", tint: "#f1f5f9", angle: 255, duration: 27, reverse: true, orbit: 70 },
  { name: "WhatsApp", icon: FaWhatsapp, color: "#16a34a", tint: "#effcf3", angle: 135, duration: 21, reverse: false, orbit: 48 },
  { name: "YouTube", icon: FaYoutube, color: "#ef4444", tint: "#fff1f2", angle: 315, duration: 21, reverse: false, orbit: 48 },
];

function OrbitSystem({ strength }: { strength: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="absolute bottom-8 left-1/2 h-[21rem] w-[21rem] -translate-x-1/2 sm:h-[27rem] sm:w-[27rem] lg:bottom-auto lg:left-[76%] lg:top-1/2 lg:h-[32rem] lg:w-[32rem] lg:-translate-y-1/2"
      style={{ opacity: strength }}
    >
      <div className="absolute inset-[8%] rounded-full bg-violet-300/15 blur-3xl" />
      {[92, 70, 48, 28].map((size, index) => (
        <div
          key={size}
          className={`absolute left-1/2 top-1/2 rounded-full border ${index % 2 ? "border-dashed border-violet-200/70" : "border-slate-200/90"}`}
          style={{ width: `${size}%`, height: `${size}%`, transform: "translate(-50%, -50%)" }}
        />
      ))}

      {socialChannels.map((channel) => {
        const Icon = channel.icon;
        const endRotation = channel.reverse ? channel.angle - 360 : channel.angle + 360;
        return (
          <div
            key={channel.name}
            className="absolute left-1/2 top-1/2"
            style={{ width: `${channel.orbit}%`, height: `${channel.orbit}%`, transform: "translate(-50%, -50%)" }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ rotate: channel.angle }}
              animate={reduceMotion ? { rotate: channel.angle } : { rotate: endRotation }}
              transition={{ duration: channel.duration, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                className="absolute left-1/2 top-0 grid h-11 w-11 place-items-center rounded-full border border-white bg-white shadow-[0_12px_35px_-10px_rgba(51,65,85,.32)] ring-1 ring-slate-200/80 sm:h-14 sm:w-14"
                style={{ x: "-50%", y: "-50%" }}
                initial={{ rotate: -channel.angle }}
                animate={reduceMotion ? { rotate: -channel.angle } : { rotate: -endRotation }}
                transition={{ duration: channel.duration, repeat: Infinity, ease: "linear" }}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full sm:h-10 sm:w-10" style={{ color: channel.color, backgroundColor: channel.tint }}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <span className="sr-only">{channel.name}</span>
              </motion.div>
            </motion.div>
          </div>
        );
      })}
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

      <div className="absolute left-1/2 top-8 h-[34rem] w-[min(88vw,56rem)] -translate-x-1/2 rounded-[50%] bg-white/55 blur-3xl" />
      <OrbitSystem strength={strength} />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-white via-white/85 to-transparent" />
    </div>
  );
}
