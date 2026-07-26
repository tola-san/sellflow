import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  BarChart3,
  CheckCircle2,
  DollarSign,
  ReceiptText,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { analyticsService, type AnalyticsDays, type AnalyticsReport } from "../Services/analytics";
import { useAuth } from "../components/Auth/AuthContext";
import { EmptyState, ErrorMessage, PageHeader } from "../components/dashboard/DashboardUI";

const ranges: AnalyticsDays[] = [7, 30, 90];
const statusColors: Record<string, string> = {
  pending: "bg-amber-500",
  confirmed: "bg-blue-500",
  preparing: "bg-violet-500",
  ready: "bg-cyan-500",
  completed: "bg-emerald-500",
  cancelled: "bg-rose-500",
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

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          title="Analytics"
          description={`Track revenue, order performance, and your best-selling ${itemLabel}.`}
        />
        <div className="inline-flex self-start rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {ranges.map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setDays(range)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                days === range ? "bg-purple-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {range} days
            </button>
          ))}
        </div>
      </div>

      <ErrorMessage error={error} />

      {loading ? (
        <AnalyticsSkeleton />
      ) : !report ? (
        <EmptyState
          title="Create your business first"
          description="Analytics will begin tracking after your business is created."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Paid revenue"
              value={money(report.summary.revenue)}
              icon={<DollarSign size={20} />}
              tone="emerald"
              change={report.summary.changes.revenue}
            />
            <MetricCard
              label="Orders"
              value={report.summary.orders.toLocaleString()}
              icon={<ShoppingCart size={20} />}
              tone="purple"
              change={report.summary.changes.orders}
            />
            <MetricCard
              label="Average order"
              value={money(report.summary.average_order_value)}
              icon={<ReceiptText size={20} />}
              tone="blue"
              change={report.summary.changes.average_order_value}
            />
            <MetricCard
              label="Completion rate"
              value={`${report.summary.completion_rate}%`}
              icon={<CheckCircle2 size={20} />}
              tone="cyan"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
            <Panel
              title="Revenue trend"
              description={`${formatDate(report.period.from)} – ${formatDate(report.period.to)}`}
            >
              <RevenueChart data={report.trend} />
            </Panel>
            <Panel title="Order status" description="Current fulfillment distribution">
              <StatusBreakdown statuses={report.statuses} />
            </Panel>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
            <Panel
              title={`Top ${itemLabel}`}
              description="Ranked by quantity ordered, excluding cancelled orders"
            >
              <TopProducts products={report.top_products} />
            </Panel>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-1">
              <Panel title="Order types" description="How customers receive their orders">
                <CompactBreakdown
                  items={report.order_types.map((item) => ({
                    label: titleCase(item.type),
                    count: item.count,
                  }))}
                />
              </Panel>
              <Panel title="Payment status" description="Payment progress for this period">
                <CompactBreakdown
                  items={report.payment_statuses.map((item) => ({
                    label: titleCase(item.status),
                    count: item.count,
                  }))}
                />
              </Panel>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  tone,
  change,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  tone: "emerald" | "purple" | "blue" | "cyan";
  change?: number | null;
}) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    purple: "bg-purple-50 text-purple-600 ring-purple-100",
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    cyan: "bg-cyan-50 text-cyan-600 ring-cyan-100",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <span className={`grid h-11 w-11 place-items-center rounded-xl ring-1 ${tones[tone]}`}>{icon}</span>
        {change !== undefined && <ChangeBadge value={change} />}
      </div>
      <p className="mt-5 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
    </article>
  );
}

function ChangeBadge({ value }: { value: number | null }) {
  if (value === null) {
    return <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-semibold text-purple-600">New</span>;
  }

  const positive = value >= 0;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
      positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
    }`}>
      {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {Math.abs(value)}%
    </span>
  );
}

function RevenueChart({ data }: { data: AnalyticsReport["trend"] }) {
  const chart = useMemo(() => {
    const width = 720;
    const height = 220;
    const padding = 18;
    const maximum = Math.max(...data.map((point) => Number(point.revenue)), 1);
    const points = data.map((point, index) => {
      const x = data.length === 1 ? width / 2 : padding + (index / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - (Number(point.revenue) / maximum) * (height - padding * 2);
      return { ...point, x, y };
    });

    return {
      points,
      polyline: points.map((point) => `${point.x},${point.y}`).join(" "),
      maximum,
    };
  }, [data]);
  const totalOrders = data.reduce((sum, point) => sum + point.orders, 0);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          <strong className="text-slate-800">{totalOrders}</strong> orders in selected period
        </p>
        <p className="text-xs text-slate-400">Peak daily revenue {money(chart.maximum)}</p>
      </div>
      <div className="overflow-hidden rounded-xl bg-gradient-to-b from-purple-50/70 to-white p-2">
        <svg viewBox="0 0 720 220" className="h-56 w-full" role="img" aria-label="Daily paid revenue chart">
          <defs>
            <linearGradient id="analytics-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[55, 110, 165].map((y) => (
            <line key={y} x1="18" x2="702" y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="4 6" />
          ))}
          {chart.points.length > 1 && (
            <polygon
              points={`18,202 ${chart.polyline} 702,202`}
              fill="url(#analytics-area)"
            />
          )}
          <polyline
            points={chart.polyline}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {chart.points.map((point, index) => (
            <circle key={`${point.date}-${index}`} cx={point.x} cy={point.y} r="4" fill="#fff" stroke="#7c3aed" strokeWidth="3">
              <title>{`${formatDate(point.date)}: ${money(point.revenue)} · ${point.orders} orders`}</title>
            </circle>
          ))}
        </svg>
      </div>
      <div className="mt-3 flex justify-between text-[10px] font-medium text-slate-400">
        <span>{formatDate(data[0]?.date)}</span>
        <span>{formatDate(data[Math.floor(data.length / 2)]?.date)}</span>
        <span>{formatDate(data[data.length - 1]?.date)}</span>
      </div>
    </div>
  );
}

function StatusBreakdown({ statuses }: { statuses: AnalyticsReport["statuses"] }) {
  const total = statuses.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-4">
      {statuses.map((item) => {
        const percentage = total ? Math.round((item.count / total) * 100) : 0;
        return (
          <div key={item.status}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-600">{titleCase(item.status)}</span>
              <span className="text-xs font-semibold text-slate-500">{item.count} · {percentage}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${statusColors[item.status] ?? "bg-slate-400"}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TopProducts({ products }: { products: AnalyticsReport["top_products"] }) {
  if (!products.length) {
    return <p className="py-10 text-center text-sm text-slate-400">No order data in this period yet.</p>;
  }

  return (
    <div className="divide-y divide-slate-100">
      {products.map((product, index) => (
        <div key={product.name} className="grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 py-3.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-purple-50 text-xs font-bold text-purple-600">
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-700">{product.name}</p>
            <p className="mt-0.5 text-xs text-slate-400">{product.quantity} ordered</p>
          </div>
          <p className="text-sm font-bold text-slate-800">{money(product.revenue)}</p>
        </div>
      ))}
    </div>
  );
}

function CompactBreakdown({ items }: { items: Array<{ label: string; count: number }> }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl bg-slate-50 p-3">
          <p className="text-lg font-bold text-slate-800">{item.count}</p>
          <p className="mt-0.5 text-xs text-slate-500">{item.label}</p>
          <p className="mt-2 text-[10px] font-semibold text-purple-600">
            {total ? Math.round((item.count / total) * 100) : 0}%
          </p>
        </div>
      ))}
    </div>
  );
}

function Panel({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-purple-50 text-purple-600">
          <BarChart3 size={18} />
        </span>
        <div>
          <h2 className="font-semibold text-slate-800">{title}</h2>
          <p className="mt-0.5 text-xs text-slate-400">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-36 rounded-2xl bg-slate-100" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-96 rounded-2xl bg-slate-100" />
        <div className="h-96 rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}

function money(value: string | number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value) || 0);
}

function formatDate(value?: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function titleCase(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
