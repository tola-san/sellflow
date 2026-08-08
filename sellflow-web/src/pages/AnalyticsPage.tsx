import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Package,
  ShoppingBag,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { analyticsService, type AnalyticsDays, type AnalyticsReport } from "../Services/analytics";
import { useAuth } from "../components/Auth/AuthContext";
import { EmptyState, ErrorMessage } from "../components/dashboard/DashboardUI";
import { activeStoreCurrency, formatCurrency } from "../lib/currency";

const ranges: Array<{ value: AnalyticsDays; label: string }> = [
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
  { value: 365, label: "1 year" },
];

const statusColors: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  preparing: "#8b5cf6",
  ready: "#06b6d4",
  completed: "#10b981",
  cancelled: "#f43f5e",
};

const paymentColors: Record<string, string> = {
  paid: "bg-emerald-500",
  pending: "bg-amber-400",
  failed: "bg-rose-500",
  refunded: "bg-blue-500",
};

export function AnalyticsPage() {
  const [days, setDays] = useState<AnalyticsDays>(30);
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const { user } = useAuth();
  const itemLabel = user?.business?.business_type === "food_beverage" ? "menu items" : "products";

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    analyticsService.getReport(days)
      .then((data) => {
        if (active) setReport(data);
      })
      .catch((requestError) => {
        if (active) setError(requestError);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [days]);

  const exportReport = () => {
    if (!report) return;
    const rows = [
      ["Date", "Orders", "Revenue"],
      ...report.trend.map((point) => [point.date, point.orders, point.revenue]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `sellflow-analytics-${report.period.from}-${report.period.to}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-5 pb-10 sm:space-y-6">
      <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">Workspace / Analytics</p>
          <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">Business analytics</h1>
          <p className="mt-2 text-sm text-slate-500">A clear view of your store&apos;s performance.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex w-full overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm shadow-slate-950/[0.02] sm:w-auto">
            {ranges.map((range) => (
              <button
                key={range.value}
                type="button"
                onClick={() => setDays(range.value)}
                className={`min-w-0 flex-1 shrink-0 rounded-lg px-2.5 py-2 text-xs font-semibold transition sm:flex-none sm:px-3 ${
                  days === range.value ? "bg-violet-50 text-violet-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={exportReport}
            disabled={!report}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </header>

      <ErrorMessage error={error} />

      {loading ? (
        <AnalyticsSkeleton />
      ) : !report ? (
        <EmptyState title="Create your business first" description="Analytics will begin tracking after your business is created." />
      ) : (
        <AnalyticsContent report={report} itemLabel={itemLabel} />
      )}
    </div>
  );
}

function AnalyticsContent({ report, itemLabel }: { report: AnalyticsReport; itemLabel: string }) {
  const totalStatuses = report.statuses.reduce((sum, item) => sum + item.count, 0);
  const topDay = report.trend.reduce<AnalyticsReport["trend"][number] | null>(
    (best, point) => !best || Number(point.revenue) > Number(best.revenue) ? point : best,
    null,
  );

  return (
    <>
      <section aria-label="Key performance metrics" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <FeaturedMetric report={report} />
        <MetricCard
          label="Total orders"
          value={report.summary.orders.toLocaleString()}
          change={report.summary.changes.orders}
          icon={<ShoppingBag className="h-4 w-4" />}
          spark={report.trend.map((point) => point.orders)}
        />
        <MetricCard
          label="Average order value"
          value={money(report.summary.average_order_value)}
          change={report.summary.changes.average_order_value}
          icon={<TrendingUp className="h-4 w-4" />}
          spark={report.trend.map((point) => Number(point.revenue))}
        />
        <MetricCard
          label="Completion rate"
          value={`${report.summary.completion_rate}%`}
          helper={`${report.statuses.find((item) => item.status === "completed")?.count ?? 0} completed orders`}
          icon={<Sparkles className="h-4 w-4" />}
          spark={report.trend.map((point) => point.orders)}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(290px,0.62fr)]">
        <Surface>
          <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-slate-950">Revenue overview</h2>
              <div className="mt-3 flex items-center gap-5 text-xs font-medium">
                <span className="border-b-2 border-violet-600 pb-2 text-violet-700">Revenue</span>
                <span className="pb-2 text-slate-400">Orders</span>
                <span className="pb-2 text-slate-400">Average value</span>
              </div>
            </div>
            {topDay && (
              <div className="flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-[11px] font-semibold text-violet-700">
                <Sparkles className="h-3.5 w-3.5" /> Best day · {formatDate(topDay.date)}
              </div>
            )}
          </div>
          <div className="px-3 pb-4 pt-5 sm:px-5 sm:pb-6">
            <RevenueChart data={report.trend} />
          </div>
        </Surface>

        <Surface className="p-5 sm:p-6">
          <div>
            <p className="text-base font-semibold text-slate-950">Order health</p>
            <p className="mt-1 text-xs text-slate-400">Fulfillment distribution</p>
          </div>
          <div className="mt-6 flex justify-center">
            <Donut
              items={report.statuses.map((item) => ({ value: item.count, color: statusColors[item.status] ?? "#94a3b8" }))}
              value={`${report.summary.completion_rate}%`}
              label="Completion"
            />
          </div>
          <div className="mt-7 space-y-3.5">
            {report.statuses.filter((item) => item.count > 0).map((item) => (
              <div className="flex items-center gap-3" key={item.status}>
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: statusColors[item.status] ?? "#94a3b8" }} />
                <span className="flex-1 text-xs font-medium text-slate-500">{titleCase(item.status)}</span>
                <span className="text-xs font-semibold tabular-nums text-slate-900">{item.count}</span>
                <span className="w-10 text-right text-[10px] tabular-nums text-slate-400">
                  {totalStatuses ? ((item.count / totalStatuses) * 100).toFixed(1) : "0.0"}%
                </span>
              </div>
            ))}
          </div>
        </Surface>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(310px,0.55fr)]">
        <Surface>
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-base font-semibold text-slate-950">Top {itemLabel}</h2>
              <p className="mt-1 text-xs text-slate-400">Ranked by units sold in this period</p>
            </div>
            <Package className="h-4 w-4 text-slate-300" />
          </div>
          <TopProducts products={report.top_products} />
        </Surface>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
          <Surface className="p-5 sm:p-6">
            <h2 className="text-base font-semibold text-slate-950">Sales mix</h2>
            <p className="mt-1 text-xs text-slate-400">How customers receive orders</p>
            <div className="mt-6 space-y-5">
              <BreakdownBars items={report.order_types.map((item) => ({ label: titleCase(item.type), count: item.count }))} />
            </div>
            <Insight change={report.summary.changes.orders} />
          </Surface>

          <Surface className="p-5 sm:p-6">
            <h2 className="text-base font-semibold text-slate-950">Payment status</h2>
            <p className="mt-1 text-xs text-slate-400">Payment progress for this period</p>
            <div className="mt-5 space-y-4">
              <PaymentBars items={report.payment_statuses} />
            </div>
          </Surface>
        </div>
      </section>
    </>
  );
}

function FeaturedMetric({ report }: { report: AnalyticsReport }) {
  const values = report.trend.map((point) => Number(point.revenue));
  return (
    <article className="relative col-span-2 overflow-hidden rounded-xl bg-violet-600 p-5 text-white shadow-lg shadow-violet-900/10 xl:col-span-1">
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-violet-100">Net revenue</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{money(report.summary.revenue)}</p>
        </div>
        <ChangeBadge value={report.summary.changes.revenue} inverted />
      </div>
      <MiniChart values={values} light />
    </article>
  );
}

function MetricCard({ label, value, change, helper, icon, spark }: {
  label: string;
  value: string;
  change?: number | null;
  helper?: string;
  icon: ReactNode;
  spark: number[];
}) {
  return (
    <article className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-950/[0.025] sm:p-5">
      <div className="flex items-center justify-between text-slate-400">
        <p className="text-xs font-medium">{label}</p>
        {icon}
      </div>
      <div className="mt-2 flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
        <p className="max-w-full truncate text-2xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-3xl">{value}</p>
        {change !== undefined && <ChangeBadge value={change} />}
      </div>
      {helper ? <p className="mt-2 text-[11px] text-slate-400">{helper}</p> : <MiniChart values={spark} />}
    </article>
  );
}

function ChangeBadge({ value, inverted = false }: { value: number | null; inverted?: boolean }) {
  if (value === null) return <span className={inverted ? "rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold" : "text-[10px] font-semibold text-violet-600"}>New</span>;
  const positive = value >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${
      inverted ? "bg-lime-300 text-slate-950" : positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
    }`}>
      <Icon className="h-3 w-3" /> {Math.abs(value)}%
    </span>
  );
}

function MiniChart({ values, light = false }: { values: number[]; light?: boolean }) {
  const points = chartPoints(values, 220, 46, 3);
  return (
    <svg viewBox="0 0 220 46" className="mt-4 h-10 w-full" aria-hidden="true">
      <polyline points={points} fill="none" stroke={light ? "rgba(255,255,255,.9)" : "#7c3aed"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RevenueChart({ data }: { data: AnalyticsReport["trend"] }) {
  const width = 900;
  const height = 290;
  const horizontalPadding = 48;
  const topPadding = 18;
  const bottomPadding = 34;
  const maximum = Math.max(...data.map((point) => Number(point.revenue)), 1);
  const points = data.map((point, index) => ({
    ...point,
    x: data.length === 1 ? width / 2 : horizontalPadding + (index / (data.length - 1)) * (width - horizontalPadding * 2),
    y: topPadding + (1 - Number(point.revenue) / maximum) * (height - topPadding - bottomPadding),
  }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const peak = points.reduce<typeof points[number] | null>((best, point) => !best || Number(point.revenue) > Number(best.revenue) ? point : best, null);
  const labels = [0, Math.floor((data.length - 1) / 2), data.length - 1].filter((value, index, array) => array.indexOf(value) === index);

  return (
    <div>
    <svg viewBox={`0 0 ${width} ${height - 24}`} className="h-[210px] w-full sm:h-[276px]" role="img" aria-label="Revenue by day">
      <defs>
        <linearGradient id="revenue-area-modern" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((ratio) => {
        const y = topPadding + ratio * (height - topPadding - bottomPadding);
        return <line key={ratio} x1={horizontalPadding} x2={width - horizontalPadding} y1={y} y2={y} stroke="#e8e9ee" strokeDasharray="3 7" />;
      })}
      {points.length > 1 && <polygon points={`${horizontalPadding},${height - bottomPadding} ${line} ${width - horizontalPadding},${height - bottomPadding}`} fill="url(#revenue-area-modern)" />}
      <polyline points={line} fill="none" stroke="#6d4aff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {peak && (
        <>
          <line x1={peak.x} x2={peak.x} y1={peak.y + 8} y2={height - bottomPadding} stroke="#a78bfa" strokeDasharray="4 5" />
          <circle cx={peak.x} cy={peak.y} r="7" fill="#6d4aff" stroke="white" strokeWidth="4"><title>{`${formatDate(peak.date)} · ${money(peak.revenue)}`}</title></circle>
        </>
      )}
    </svg>
    <div className="flex justify-between px-3 text-[10px] font-medium text-slate-400 sm:px-5 sm:text-[11px]">
      {labels.map((index) => <span key={index}>{formatDate(points[index]?.date)}</span>)}
    </div>
    </div>
  );
}

function Donut({ items, value, label }: { items: Array<{ value: number; color: string }>; value: string; label: string }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let cursor = 0;
  const stops = items.map((item) => {
    const start = cursor;
    cursor += total ? (item.value / total) * 100 : 0;
    return `${item.color} ${start}% ${cursor}%`;
  });
  const style: CSSProperties = {
    background: total ? `conic-gradient(${stops.join(",")})` : "#e2e8f0",
  };
  return (
    <div
      className="relative grid h-40 w-40 place-items-center rounded-full"
      style={style}
      role="img"
      aria-label={`${label}: ${value}`}
    >
      <div className="grid h-[112px] w-[112px] place-items-center rounded-full bg-white text-center shadow-[0_0_0_2px_white]">
        <span className="flex flex-col">
          <strong className="text-2xl font-semibold tracking-tight text-slate-950">{value}</strong>
          <span className="mt-1 text-[10px] font-medium text-slate-400">{label}</span>
        </span>
      </div>
    </div>
  );
}

function TopProducts({ products }: { products: AnalyticsReport["top_products"] }) {
  if (!products.length) return <p className="px-6 py-14 text-center text-sm text-slate-400">No product sales in this period yet.</p>;
  const maxRevenue = Math.max(...products.map((product) => Number(product.revenue)), 1);
  return (
    <div className="divide-y divide-slate-100 px-5 sm:px-6">
      {products.map((product, index) => (
        <div className="grid grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-2.5 py-3.5 sm:grid-cols-[28px_minmax(0,1fr)_80px_100px] sm:gap-3 sm:py-4" key={product.name}>
          <span className="text-xs font-semibold text-slate-400">{index + 1}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">{product.name}</p>
            <div className="mt-2 h-1 max-w-xs overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-violet-500" style={{ width: `${(Number(product.revenue) / maxRevenue) * 100}%` }} />
            </div>
          </div>
          <span className="hidden text-right text-xs text-slate-500 sm:block">{product.quantity} sold</span>
          <span className="text-right text-sm font-semibold tabular-nums text-slate-950">{money(product.revenue)}</span>
        </div>
      ))}
    </div>
  );
}

function BreakdownBars({ items }: { items: Array<{ label: string; count: number }> }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  return <>{items.map((item) => {
    const percentage = total ? (item.count / total) * 100 : 0;
    return <div key={item.label}><div className="mb-2 flex items-center justify-between text-xs"><span className="font-medium text-slate-600">{item.label}</span><span className="font-semibold tabular-nums text-slate-900">{percentage.toFixed(1)}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-violet-600" style={{ width: `${percentage}%` }} /></div></div>;
  })}</>;
}

function PaymentBars({ items }: { items: AnalyticsReport["payment_statuses"] }) {
  const maximum = Math.max(...items.map((item) => item.count), 1);
  return <>{items.map((item) => <div className="grid grid-cols-[70px_minmax(0,1fr)_32px] items-center gap-3" key={item.status}><span className="text-xs font-medium text-slate-500">{titleCase(item.status)}</span><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${paymentColors[item.status] ?? "bg-slate-400"}`} style={{ width: `${(item.count / maximum) * 100}%` }} /></div><span className="text-right text-xs font-semibold tabular-nums text-slate-900">{item.count}</span></div>)}</>;
}

function Insight({ change }: { change: number | null }) {
  const positive = change === null || change >= 0;
  return <div className="mt-6 flex items-start gap-3 rounded-xl bg-violet-50 p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-violet-600"><TrendingUp className="h-4 w-4" /></span><p className="text-xs leading-5 text-slate-600">Orders are <strong className="text-violet-700">{change === null ? "new" : `${positive ? "up" : "down"} ${Math.abs(change)}%`}</strong> compared with the previous period.</p></div>;
}

function Surface({ className = "", children }: { className?: string; children: ReactNode }) {
  return <article className={`overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm shadow-slate-950/[0.025] ${className}`}>{children}</article>;
}

function AnalyticsSkeleton() {
  return <div className="animate-pulse space-y-5"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div className="h-36 rounded-xl bg-slate-100" key={index} />)}</div><div className="grid gap-5 xl:grid-cols-[1.65fr_.62fr]"><div className="h-[470px] rounded-xl bg-slate-100" /><div className="h-[470px] rounded-xl bg-slate-100" /></div></div>;
}

function chartPoints(values: number[], width: number, height: number, padding: number) {
  const maximum = Math.max(...values, 1);
  return values.map((value, index) => {
    const x = values.length === 1 ? width / 2 : padding + (index / (values.length - 1)) * (width - padding * 2);
    const y = height - padding - (value / maximum) * (height - padding * 2);
    return `${x},${y}`;
  }).join(" ");
}

function money(value: string | number) {
  return formatCurrency(value, activeStoreCurrency());
}

function formatDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function titleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
