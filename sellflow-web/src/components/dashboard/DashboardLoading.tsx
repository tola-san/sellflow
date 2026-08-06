import { useReducedMotion } from "framer-motion";
import { Boxes } from "lucide-react";

type DashboardLoadingProps = {
  message?: string;
  compact?: boolean;
};

export function DashboardLoading({
  message = "Preparing your dashboard...",
  compact = false,
}: DashboardLoadingProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${compact ? "min-h-64 py-8" : "min-h-[420px] py-12"}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="relative grid h-28 w-28 place-items-center sm:h-32 sm:w-32">
        <div className="absolute inset-3 rounded-full bg-violet-300/25 blur-2xl" aria-hidden="true" />
        {!reduceMotion && (
          <div className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-t-violet-500 border-r-indigo-300" aria-hidden="true" />
        )}
        <BrandFallback pulsing={!reduceMotion} />
      </div>

      <p className="mt-1 text-sm font-semibold text-slate-700">{message}</p>
      <p className="mt-1 text-xs text-slate-400">Loading your latest store activity</p>
    </div>
  );
}

function BrandFallback({ pulsing = false }: { pulsing?: boolean }) {
  return (
    <div
      className={`relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-200 ${pulsing ? "animate-pulse" : ""}`}
      aria-hidden="true"
    >
      <Boxes className="h-7 w-7" />
    </div>
  );
}
