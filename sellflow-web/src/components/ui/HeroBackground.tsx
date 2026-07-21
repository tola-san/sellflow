import { motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  BellRing,
  CreditCard,
  Globe2,
  Link2,
  PackageCheck,
  ShoppingBag,
  Users,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTelegramPlane,
  FaTiktok,
} from "react-icons/fa";

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

const orbitLayers = [
  {
    inset: 3,
    duration: 42,
    direction: 1,
    opacity: 0.72,
    items: [
      { name: "Facebook", icon: FaFacebookF, color: "#1877F2", tint: "#EEF5FF", angle: 194 },
      { name: "Instagram", icon: FaInstagram, color: "#E1306C", tint: "#FFF0F5", angle: 264 },
      { name: "TikTok", icon: FaTiktok, color: "#111827", tint: "#F1F5F9", angle: 336 },
      { name: "Store link", icon: Link2, color: "#7C3AED", tint: "#F5F3FF", angle: 52 },
      { name: "Audience", icon: Users, color: "#2563EB", tint: "#EFF6FF", angle: 122 },
    ],
  },
  {
    inset: 17,
    duration: 34,
    direction: -1,
    opacity: 0.84,
    items: [
      { name: "Telegram", icon: FaTelegramPlane, color: "#229ED9", tint: "#EEFAFF", angle: 214 },
      { name: "Order paid", icon: CreditCard, color: "#059669", tint: "#ECFDF5", angle: 334 },
      { name: "Analytics", icon: BarChart3, color: "#7C3AED", tint: "#F5F3FF", angle: 142 },
    ],
  },
  {
    inset: 30,
    duration: 27,
    direction: 1,
    opacity: 1,
    items: [
      { name: "Live store", icon: Globe2, color: "#4F46E5", tint: "#EEF2FF", angle: 226 },
      { name: "New order", icon: BellRing, color: "#D97706", tint: "#FFFBEB", angle: 350 },
      { name: "Ready", icon: PackageCheck, color: "#16A34A", tint: "#F0FDF4", angle: 108 },
    ],
  },
];

function OrbitItem({ item, angle, duration, direction, reduceMotion }: {
  item: (typeof orbitLayers)[number]["items"][number]; angle: number; duration: number; direction: number; reduceMotion: boolean | null;
}) {
  const Icon = item.icon;
  return (
    <div className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="rounded-full border border-white/90 bg-white/90 p-1 shadow-[0_12px_34px_-12px_rgba(15,23,42,.35)] backdrop-blur-xl"
          animate={reduceMotion ? undefined : { rotate: direction > 0 ? -360 : 360 }}
          transition={{ duration, repeat: Infinity, ease: "linear" }}
        >
          <div className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-100 bg-white/80 py-1 pl-1 pr-1 xl:pr-2.5">
            <span className="grid h-6 w-6 place-items-center rounded-full sm:h-7 sm:w-7" style={{ color: item.color, backgroundColor: item.tint }}>
              <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </span>
            <span className="hidden text-[10px] font-semibold text-slate-600 xl:block">{item.name}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function OrbitSystem({ strength }: { strength: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="
        absolute bottom-0 left-1/2
        h-[23rem] w-[23rem]
        -translate-x-1/2
        sm:h-[30rem] sm:w-[30rem]
        lg:bottom-auto lg:left-[78%] lg:top-1/2
        lg:h-[36rem] lg:w-[36rem]
        lg:-translate-y-1/2
      "
      style={{ opacity: strength }}
    >
      {/* Soft glow */}
      <motion.div
        className="absolute inset-[12%] rounded-full bg-violet-300/20 blur-[80px]"
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [1, 1.08, 1],
                opacity: [0.35, 0.6, 0.35],
              }
        }
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Independently moving orbital layers. Satellites counter-rotate to stay upright. */}
      {orbitLayers.map((layer, layerIndex) => (
        <motion.div
          key={layer.inset}
          className="absolute rounded-full border border-slate-300/70"
          style={{ inset: `${layer.inset}%`, opacity: layer.opacity }}
          animate={reduceMotion ? undefined : { rotate: layer.direction > 0 ? 360 : -360 }}
          transition={{ duration: layer.duration, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 rounded-full border border-white/70 shadow-[inset_0_0_35px_rgba(124,58,237,.05)]" />
          {layer.items.map((item) => (
            <OrbitItem key={item.name} item={item} angle={item.angle} duration={layer.duration} direction={layer.direction} reduceMotion={reduceMotion} />
          ))}
          <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500 shadow-[0_0_12px_3px_rgba(139,92,246,.38)]" />
          {layerIndex === 0 && <span className="absolute bottom-[7%] right-[12%] h-1 w-1 rounded-full bg-blue-400" />}
        </motion.div>
      ))}

      {/* Inner halo adds another visual depth layer behind the card. */}
      <div className="absolute inset-[38%] rounded-full border border-violet-200/80 bg-white/45 shadow-[0_0_55px_20px_rgba(139,92,246,.1)] backdrop-blur-sm" />

      {/* Main storefront status card */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.7,
          delay: 0.25,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          absolute left-1/2 top-1/2 z-30
          w-[12.5rem] -translate-x-1/2 -translate-y-1/2
          rounded-[1.25rem] border border-white
          bg-white/95 p-3.5
          shadow-[0_28px_70px_-25px_rgba(15,23,42,.35)]
          backdrop-blur-xl
          sm:w-[15.5rem] sm:p-4
        "
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25">
            <ShoppingBag className="h-4 w-4" />
          </div>

          <div>
            <p className="text-[10px] font-medium text-slate-400">
              Your storefront
            </p>
            <h3 className="text-xs font-semibold text-slate-900 sm:text-sm">
              Studio Supply
            </h3>
          </div>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
          </span>
        </div>

        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[8px] font-medium text-slate-400 sm:text-[9px]">Sales this month</p>
              <p className="mt-0.5 text-base font-semibold tracking-tight text-slate-900 sm:text-lg">$8,420</p>
            </div>
            <span className="rounded-md bg-emerald-50 px-1.5 py-1 text-[8px] font-semibold text-emerald-600">+18.4%</span>
          </div>
          <div className="mt-3 flex h-7 items-end gap-1">
            {[32, 48, 40, 68, 56, 82, 74, 100, 86].map((height, index) => (
              <span key={index} className="flex-1 rounded-t-sm bg-violet-200" style={{ height: `${height}%`, backgroundColor: index === 7 ? "#7c3aed" : undefined }} />
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex -space-x-1.5">
            {[FaFacebookF, FaInstagram, FaTelegramPlane].map((ChannelIcon, index) => (
              <span key={index} className="grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-slate-100 text-slate-500">
                <ChannelIcon className="h-2.5 w-2.5" />
              </span>
            ))}
          </div>
          <div className="text-right">
            <p className="text-[9px] font-semibold text-slate-700">3 channels connected</p>
            <p className="text-[8px] text-slate-400">Syncing automatically</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function HeroBackground({
  intensity = "medium",
  className = "",
}: HeroBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const strength = intensityValues[intensity];

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Light neutral background */}
      <div className="absolute inset-0 bg-[#fafafa]" />

      {/* Subtle grid */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: 0.28 * strength,
          backgroundImage: `
            linear-gradient(rgba(100,116,139,.10) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,116,139,.10) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 85% 75% at 72% 50%, black 5%, rgba(0,0,0,.65) 55%, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 75% at 72% 50%, black 5%, rgba(0,0,0,.65) 55%, transparent 90%)",
        }}
        animate={
          reduceMotion
            ? undefined
            : {
                backgroundPosition: ["0px 0px", "32px 32px"],
              }
        }
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Very soft colored lights */}
      <motion.div
        className="absolute right-[5%] top-[15%] h-[28rem] w-[28rem] rounded-full bg-violet-200/25 blur-[110px]"
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [1, 1.08, 1],
                opacity: [0.3, 0.55, 0.3],
              }
        }
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute right-[20%] top-[28%] h-[20rem] w-[20rem] rounded-full bg-blue-200/20 blur-[100px]"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 25, 0],
                y: [0, -15, 0],
              }
        }
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <OrbitSystem strength={strength} />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent" />
    </div>
  );
}
