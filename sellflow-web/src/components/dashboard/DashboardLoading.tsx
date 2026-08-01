import { lazy, Suspense } from "react";
import { useReducedMotion } from "framer-motion";
import { Boxes } from "lucide-react";

const DotLottiePlayer = lazy(() =>
  import("@lottiefiles/dotlottie-react").then((module) => ({
    default: module.DotLottieReact,
  })),
);

const DASHBOARD_ANIMATION_URL =
  "https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie";

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
      <div className="relative grid h-36 w-36 place-items-center sm:h-44 sm:w-44">
        <div className="absolute inset-5 rounded-full bg-violet-300/20 blur-2xl" aria-hidden="true" />
        {reduceMotion ? (
          <BrandFallback />
        ) : (
          <Suspense fallback={<BrandFallback pulsing />}>
            <DotLottiePlayer
              src={DASHBOARD_ANIMATION_URL}
              autoplay
              loop
              className="relative h-full w-full"
            />
          </Suspense>
        )}
      </div>

      <p className="mt-1 text-sm font-semibold text-slate-700">{message}</p>
      <p className="mt-1 text-xs text-slate-400">Loading your latest store activity</p>
      {!reduceMotion && (
        <div className="mt-4 h-1 w-28 overflow-hidden rounded-full bg-violet-100" aria-hidden="true">
          <div className="h-full w-1/2 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
        </div>
      )}
    </div>
  );
}

function BrandFallback({ pulsing = false }: { pulsing?: boolean }) {
  return (
    <div
      className={`relative grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-200 ${pulsing ? "animate-pulse" : ""}`}
      aria-hidden="true"
    >
      <Boxes className="h-9 w-9" />
    </div>
  );
}
