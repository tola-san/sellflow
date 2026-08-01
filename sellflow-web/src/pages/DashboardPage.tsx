import { useEffect, useMemo, useState, type ComponentType, type CSSProperties, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  ExternalLink,
  FolderTree,
  MoreHorizontal,
  Package,
  Palette,
  Plus,
  ReceiptText,
  Sparkles,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import { Link } from "react-router-dom";
import { dashboardService, type DashboardOverview } from "../Services/dashboard";
import { orderService } from "../Services/order";
import type { Order, OrderListResponse } from "../types/order";
import { ErrorMessage } from "../components/dashboard/DashboardUI";
import { DashboardLoading } from "../components/dashboard/DashboardLoading";

const emptySummary: OrderListResponse["summary"] = {
  total: 0,
  pending: 0,
  confirmed: 0,
  preparing: 0,
  ready: 0,
  completed: 0,
  cancelled: 0,
  paid_revenue: "0",
};

const money = (value: number | string, compact = false) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 2,
  }).format(Number(value) || 0);

const orderTone: Record<string, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  confirmed: "border-blue-200 bg-blue-50 text-blue-700",
  preparing: "border-violet-200 bg-violet-50 text-violet-700",
  ready: "border-cyan-200 bg-cyan-50 text-cyan-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

interface LaunchStep {
  title: string;
  description: string;
  href: string;
  action: string;
  complete: boolean;
}

interface QuickAction {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  external?: boolean;
}

interface DailySales {
  key: string;
  label: string;
  day: string;
  revenue: number;
  orders: number;
}

export function DashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState(emptySummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    Promise.allSettled([
      dashboardService.getOverview(),
      orderService.getOrders({ per_page: 50 }),
    ])
      .then(([overviewResult, ordersResult]) => {
        if (overviewResult.status === "fulfilled") {
          setOverview(overviewResult.value);
        } else {
          setError(overviewResult.reason);
        }

        if (ordersResult.status === "fulfilled") {
          setOrders(ordersResult.value.orders);
          setSummary(ordersResult.value.summary);
        } else if (overviewResult.status === "fulfilled") {
          setError(ordersResult.reason);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const dailySales = useMemo(() => buildDailySales(orders), [orders]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const business = overview?.business ?? null;
  const counts = overview?.stats ?? {
    products: 0,
    active_products: 0,
    categories: 0,
    active_categories: 0,
    low_stock: 0,
  };
  const activeOrders = summary.pending + summary.confirmed + summary.preparing + summary.ready;
  const revenue = Number(summary.paid_revenue || 0);
  const averageOrder = summary.total ? revenue / summary.total : 0;

  const launchSteps: LaunchStep[] = [
    {
      title: "Complete business profile",
      description: "Add your store identity and public URL.",
      href: "/dashboard/business",
      action: "Review profile",
      complete: Boolean(business?.name && business?.slug),
    },
    {
      title: "Create a category",
      description: "Organize products so customers can browse faster.",
      href: "/dashboard/categories",
      action: "Add category",
      complete: counts.categories > 0,
    },
    {
      title: "Publish your first item",
      description: "Add a product, menu item, or service.",
      href: "/dashboard/products",
      action: "Add item",
      complete: counts.active_products > 0,
    },
    {
      title: "Open your storefront",
      description: "Make your catalog available to customers.",
      href: business?.slug ? `/${business.slug}` : "/dashboard/business",
      action: business?.slug ? "View storefront" : "Set public URL",
      complete: Boolean(business?.is_active && counts.active_products > 0),
    },
  ];
  const completedSteps = launchSteps.filter((step) => step.complete).length;

  const quickActions: QuickAction[] = [
    { label: "Add item", href: "/dashboard/products", icon: Plus },
    { label: "Manage orders", href: "/dashboard/orders", icon: ReceiptText },
    { label: "Customize store", href: "/dashboard/theme", icon: Palette },
    {
      label: "View storefront",
      href: business?.slug ? `/${business.slug}` : "/dashboard/business",
      icon: ExternalLink,
      external: Boolean(business?.slug),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-5 pb-8 sm:space-y-6 sm:pb-10">
      <OverviewHeader
        businessName={business?.name}
        activeOrders={activeOrders}
        quickActions={quickActions}
      />

      <ErrorMessage error={error} />

      {completedSteps < launchSteps.length && (
        <SetupCard steps={launchSteps} completed={completedSteps} />
      )}

      <section aria-label="Business metrics" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <MetricCard
          label="Paid revenue"
          value={money(revenue)}
          helper={`${summary.total} total orders`}
          icon={CircleDollarSign}
          accent="violet"
        />
        <MetricCard
          label="Active orders"
          value={activeOrders}
          helper={activeOrders ? "Require attention" : "All caught up"}
          icon={Clock3}
          accent="amber"
          attention={activeOrders > 0}
        />
        <MetricCard
          label="Average order"
          value={money(averageOrder)}
          helper="Across all orders"
          icon={TrendingUp}
          accent="blue"
        />
        <MetricCard
          label="Live products"
          value={counts.active_products}
          helper={`${counts.products} total in catalog`}
          icon={Package}
          accent="emerald"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.65fr)]">
        <SalesPulse data={dailySales} />
        <OrderDistribution summary={summary} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.65fr)]">
        <RecentOrders
          orders={orders}
          businessLogo={business?.logo}
          businessName={business?.name}
        />
        <InventoryHealth
          products={counts.products}
          activeProducts={counts.active_products}
          categories={counts.categories}
          activeCategories={counts.active_categories}
          lowStock={counts.low_stock}
        />
      </section>
    </div>
  );
}

function OverviewHeader({
  businessName,
  activeOrders,
  quickActions,
}: {
  businessName?: string;
  activeOrders: number;
  quickActions: QuickAction[];
}) {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">Workspace / Overview</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">Overview</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
          {businessName
            ? `Here’s what’s happening at ${businessName} today.`
            : "Set up your business and start taking orders."}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:mx-0 sm:pb-0">
          {quickActions.slice(1).map((action) => {
            const Icon = action.icon;
            return (
              <Link
                to={action.href}
                target={action.external ? "_blank" : undefined}
                rel={action.external ? "noreferrer" : undefined}
                key={action.label}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 shadow-sm shadow-slate-950/[0.02] transition hover:border-slate-300 hover:bg-slate-50"
              >
                <Icon className="h-3.5 w-3.5 text-slate-500" />
                {action.label}
                {action.label === "Manage orders" && activeOrders > 0 && (
                  <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
                    {activeOrders}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
        <Link
          to="/dashboard/products"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Add item
        </Link>
      </div>
    </header>
  );
}

function SetupCard({ steps, completed }: { steps: LaunchStep[]; completed: number }) {
  const nextStep = steps.find((step) => !step.complete);
  const percent = Math.round((completed / steps.length) * 100);

  return (
    <section className="overflow-hidden rounded-xl border border-violet-200 bg-white shadow-sm shadow-violet-950/[0.03]">
      <div className="grid lg:grid-cols-[minmax(250px,0.72fr)_minmax(0,1.28fr)]">
        <div className="border-b border-violet-100 bg-violet-50/70 p-5 lg:border-b-0 lg:border-r sm:p-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-700">
            <Sparkles className="h-4 w-4" />
            Store setup
          </div>
          <h2 className="mt-3 text-lg font-semibold tracking-tight text-slate-950">
            You’re {percent}% ready to sell
          </h2>
          <p className="mt-1.5 text-xs leading-5 text-slate-500">
            Finish these essentials to make your storefront customer-ready.
          </p>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-violet-100">
            <div
              className="h-full rounded-full bg-violet-600 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>{completed} of {steps.length} complete</span>
            <span>{percent}%</span>
          </div>
          {nextStep && (
            <Link
              to={nextStep.href}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              {nextStep.action}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <ol className="grid sm:grid-cols-2">
          {steps.map((step, index) => (
            <li
              className={`flex min-w-0 items-start gap-3 p-4 sm:p-5 ${
                index % 2 === 0 ? "sm:border-r sm:border-slate-100" : ""
              } ${index < 2 ? "border-b border-slate-100" : index === 2 ? "border-b border-slate-100 sm:border-b-0" : ""}`}
              key={step.title}
            >
              <span
                className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[10px] font-bold ${
                  step.complete
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-white text-slate-400"
                }`}
              >
                {step.complete ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold ${step.complete ? "text-slate-500" : "text-slate-900"}`}>
                  {step.title}
                </p>
                <p className="mt-1 text-[11px] leading-4 text-slate-500">{step.description}</p>
              </div>
              <Link
                to={step.href}
                aria-label={`${step.action}: ${step.title}`}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-violet-600"
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  helper,
  icon: Icon,
  accent,
  attention = false,
}: {
  label: string;
  value: string | number;
  helper: string;
  icon: ComponentType<{ className?: string }>;
  accent: "violet" | "amber" | "blue" | "emerald";
  attention?: boolean;
}) {
  const accents = {
    violet: "bg-violet-50 text-violet-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
  };

  return (
    <article className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm shadow-slate-950/[0.025] sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <span className={`grid h-8 w-8 place-items-center rounded-lg sm:h-9 sm:w-9 sm:rounded-xl ${accents[accent]}`}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
        {attention && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Action
          </span>
        )}
      </div>
      <p className="mt-4 truncate text-[11px] font-medium text-slate-500 sm:mt-5 sm:text-xs">{label}</p>
      <p className="mt-1.5 truncate text-2xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-3xl">{value}</p>
      <p className="mt-2 truncate text-[11px] text-slate-400">{helper}</p>
    </article>
  );
}

function SalesPulse({ data }: { data: DailySales[] }) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
  const chartMetric = totalRevenue > 0 || totalOrders === 0 ? "revenue" : "orders";
  const maxValue = Math.max(
    ...data.map((item) => chartMetric === "revenue" ? item.revenue : item.orders),
    1,
  );
  const showingOrderVolume = chartMetric === "orders";
  const points = data.map((item, index) => {
    const value = chartMetric === "revenue" ? item.revenue : item.orders;
    return {
      x: data.length === 1 ? 450 : 44 + (index / Math.max(data.length - 1, 1)) * 812,
      y: 22 + (1 - value / maxValue) * 205,
      item,
    };
  });
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const peak = points.reduce<typeof points[number] | null>((best, point) => {
    if (!best) return point;
    const value = chartMetric === "revenue" ? point.item.revenue : point.item.orders;
    const bestValue = chartMetric === "revenue" ? best.item.revenue : best.item.orders;
    return value > bestValue ? point : best;
  }, null);

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm shadow-slate-950/[0.025]">
      <SectionHeader
        title="Sales pulse"
        description="Daily performance from recent orders"
        action={
          <Link to="/dashboard/analytics" className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700">
            Analytics <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium text-slate-500">
              {showingOrderVolume ? "Order activity" : "Paid revenue"} · Last 7 days
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-3xl">
              {showingOrderVolume ? `${totalOrders} orders` : money(totalRevenue)}
            </p>
            {showingOrderVolume && (
              <p className="mt-1.5 text-[10px] text-amber-700">
                No paid revenue yet. Showing order volume instead.
              </p>
            )}
          </div>
          <div className="rounded-xl bg-slate-50 px-3.5 py-2.5 text-right ring-1 ring-inset ring-slate-200/70">
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
              {showingOrderVolume ? "Paid revenue" : "Orders"}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-slate-800">
              {showingOrderVolume ? money(totalRevenue) : totalOrders}
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden">
          <svg viewBox="0 0 900 235" className="h-[190px] w-full sm:h-[250px]" role="img" aria-label="Seven day sales trend">
            <defs>
              <linearGradient id="overview-sales-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[73, 124, 175, 226].map((y) => <line key={y} x1="44" x2="856" y1={y} y2={y} stroke="#e8e9ee" strokeDasharray="3 7" />)}
            {points.length > 1 && <polygon points={`44,227 ${line} 856,227`} fill="url(#overview-sales-area)" />}
            <polyline points={line} fill="none" stroke="#6d4aff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {peak && <circle cx={peak.x} cy={peak.y} r="7" fill="#6d4aff" stroke="white" strokeWidth="4"><title>{`${peak.item.label}: ${peak.item.orders} orders · ${money(peak.item.revenue)}`}</title></circle>}
          </svg>
          <div className="grid grid-cols-7 px-1 text-center text-[10px] font-medium text-slate-400 sm:text-[11px]">
            {points.map((point, index) => (
              <span key={point.item.key} className={index !== 0 && index !== 3 && index !== points.length - 1 ? "text-transparent sm:text-slate-400" : ""}>
                {point.item.day}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function OrderDistribution({ summary }: { summary: OrderListResponse["summary"] }) {
  const groups = [
    { label: "Pending", value: summary.pending, color: "bg-amber-400" },
    { label: "Preparing", value: summary.confirmed + summary.preparing + summary.ready, color: "bg-violet-500" },
    { label: "Completed", value: summary.completed, color: "bg-emerald-500" },
    { label: "Cancelled", value: summary.cancelled ?? 0, color: "bg-rose-500" },
  ];
  const tracked = groups.reduce((sum, item) => sum + item.value, 0);

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm shadow-slate-950/[0.025]">
      <SectionHeader
        title="Order distribution"
        description="All orders by fulfillment status"
        action={
          <Link to="/dashboard/orders" aria-label="Open orders" className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        }
      />
      <div className="p-5 sm:p-6">
        <div className="flex justify-center">
          <OrderDonut groups={groups} total={tracked} />
        </div>

        <div className="mt-6 space-y-4">
          {groups.map((item) => (
            <div className="flex items-center gap-3" key={item.label}>
              <span className={`h-2 w-2 shrink-0 rounded-full ${item.color}`} />
              <span className="min-w-0 flex-1 text-xs text-slate-500">{item.label}</span>
              <span className="text-sm font-semibold tabular-nums text-slate-900">{item.value}</span>
              <span className="w-9 text-right text-[10px] tabular-nums text-slate-400">
                {tracked ? Math.round((item.value / tracked) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function OrderDonut({ groups, total }: {
  groups: Array<{ label: string; value: number; color: string }>;
  total: number;
}) {
  const palette: Record<string, string> = {
    "bg-amber-400": "#f59e0b",
    "bg-violet-500": "#8b5cf6",
    "bg-emerald-500": "#10b981",
    "bg-rose-500": "#f43f5e",
  };
  let cursor = 0;
  const stops = groups.map((group) => {
    const start = cursor;
    cursor += total ? (group.value / total) * 100 : 0;
    return `${palette[group.color]} ${start}% ${cursor}%`;
  });
  const style = { "--order-donut": total ? `conic-gradient(${stops.join(",")})` : "#e2e8f0" } as CSSProperties;

  return (
    <div className="relative grid h-40 w-40 place-items-center rounded-full bg-[var(--order-donut)]" style={style}>
      <div className="grid h-[112px] w-[112px] place-items-center rounded-full bg-white text-center">
        <div>
          <p className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">{total}</p>
          <p className="mt-1 text-[10px] font-medium text-slate-400">Total orders</p>
        </div>
      </div>
    </div>
  );
}

function RecentOrders({
  orders,
  businessLogo,
  businessName,
}: {
  orders: Order[];
  businessLogo?: string | null;
  businessName?: string;
}) {
  const recent = orders.slice(0, 6);

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm shadow-slate-950/[0.025]">
      <SectionHeader
        title="Recent orders"
        description="Latest customer activity"
        action={
          <Link to="/dashboard/orders" className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      {recent.length ? (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                  <th className="px-6 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="w-12 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((order) => (
                  <tr className="group transition hover:bg-slate-50/70" key={order.id}>
                    <td className="whitespace-nowrap px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <BusinessAvatar
                          logo={businessLogo}
                          name={businessName}
                          className="h-9 w-9 rounded-xl"
                        />
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{order.order_number}</p>
                          <p className="mt-0.5 text-[10px] text-slate-400">{formatOrderTime(order.created_at)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-[180px] px-4 py-3.5">
                      <p className="truncate text-xs font-medium text-slate-700">{order.customer_name || "Customer"}</p>
                      <p className="mt-0.5 text-[10px] text-slate-400">{order.items_count} {order.items_count === 1 ? "item" : "items"}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[11px] font-medium capitalize ${order.payment_status === "paid" ? "text-emerald-700" : "text-slate-500"}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-right text-xs font-semibold text-slate-900">
                      {money(order.total)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link to="/dashboard/orders" aria-label={`View order ${order.order_number}`} className="inline-flex rounded-lg p-1.5 text-slate-300 transition group-hover:bg-white group-hover:text-slate-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {recent.map((order) => (
              <Link to="/dashboard/orders" className="block p-4 transition active:bg-slate-50" key={order.id}>
                <div className="flex items-start gap-3">
                  <BusinessAvatar
                    logo={businessLogo}
                    name={businessName}
                    className="h-10 w-10 rounded-xl"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{order.customer_name || "Customer"}</p>
                        <p className="mt-0.5 text-[10px] text-slate-400">
                          {order.order_number} · {formatOrderTime(order.created_at)}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-semibold text-slate-950">{money(order.total)}</p>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between gap-3">
                      <StatusBadge status={order.status} />
                      <span className="text-[10px] text-slate-400">{order.items_count} {order.items_count === 1 ? "item" : "items"}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <EmptyOrders />
      )}
    </article>
  );
}

function BusinessAvatar({
  logo,
  name,
  className,
}: {
  logo?: string | null;
  name?: string;
  className: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = (name || "Store")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (logo && !imageFailed) {
    return (
      <img
        src={logo}
        alt={`${name || "Store"} logo`}
        className={`${className} shrink-0 border border-slate-200 bg-white object-cover shadow-sm`}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <span
      aria-label={`${name || "Store"} logo placeholder`}
      className={`${className} grid shrink-0 place-items-center bg-violet-50 text-[10px] font-bold text-violet-700 ring-1 ring-inset ring-violet-100`}
    >
      {initials}
    </span>
  );
}

function InventoryHealth({
  products,
  activeProducts,
  categories,
  activeCategories,
  lowStock,
}: {
  products: number;
  activeProducts: number;
  categories: number;
  activeCategories: number;
  lowStock: number;
}) {
  const catalogPercent = products ? Math.round((activeProducts / products) * 100) : 0;
  const categoryPercent = categories ? Math.round((activeCategories / categories) * 100) : 0;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-950/[0.025]">
      <SectionHeader
        title="Catalog health"
        description="Products and availability"
        action={
          <Link to="/dashboard/inventory" aria-label="Open inventory" className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        }
      />
      <div className="space-y-5 p-5 sm:p-6">
        <CatalogBar
          label="Products live"
          value={`${activeProducts} / ${products}`}
          percent={catalogPercent}
          color="bg-violet-500"
          icon={Package}
        />
        <CatalogBar
          label="Categories active"
          value={`${activeCategories} / ${categories}`}
          percent={categoryPercent}
          color="bg-blue-500"
          icon={FolderTree}
        />

        <div className={`rounded-xl border p-4 ${lowStock > 0 ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"}`}>
          <div className="flex items-start gap-3">
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${lowStock > 0 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
              {lowStock > 0 ? <TriangleAlert className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-semibold ${lowStock > 0 ? "text-amber-900" : "text-emerald-900"}`}>
                {lowStock > 0 ? `${lowStock} low-stock ${lowStock === 1 ? "item" : "items"}` : "Stock levels look good"}
              </p>
              <p className={`mt-1 text-[11px] leading-4 ${lowStock > 0 ? "text-amber-700" : "text-emerald-700"}`}>
                {lowStock > 0 ? "Restock soon to avoid missed sales." : "No inventory needs attention right now."}
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/inventory"
            className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold ${lowStock > 0 ? "text-amber-800" : "text-emerald-800"}`}
          >
            Review inventory <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function CatalogBar({
  label,
  value,
  percent,
  color,
  icon: Icon,
}: {
  label: string;
  value: string;
  percent: number;
  color: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-slate-600">{label}</p>
            <p className="text-xs font-semibold tabular-nums text-slate-900">{value}</p>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-slate-950 sm:text-[15px]">{title}</h2>
        <p className="mt-0.5 truncate text-[11px] text-slate-500">{description}</p>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: Order["status"] }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-semibold capitalize ${orderTone[status] || "border-slate-200 bg-slate-50 text-slate-600"}`}>
      {status}
    </span>
  );
}

function EmptyOrders() {
  return (
    <div className="px-6 py-14 text-center">
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
        <Boxes className="h-5 w-5" />
      </span>
      <p className="mt-3 text-sm font-semibold text-slate-900">No orders yet</p>
      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
        Share your storefront to start receiving customer orders.
      </p>
      <Link to="/dashboard/business" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-700">
        Open storefront settings <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="relative mx-auto w-full max-w-[1600px] overflow-hidden rounded-3xl">
      <div className="animate-pulse space-y-5 opacity-45 blur-[1px]" aria-hidden="true">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="h-8 w-40 rounded-lg bg-slate-200" />
            <div className="mt-2 h-4 w-72 max-w-full rounded bg-slate-100" />
          </div>
          <div className="h-10 w-full rounded-xl bg-slate-200 sm:w-44" />
        </div>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="h-36 rounded-xl border border-slate-200 bg-white" key={index} />
          ))}
        </div>
        <div className="grid gap-5 xl:grid-cols-[1.55fr_0.65fr]">
          <div className="h-80 rounded-xl border border-slate-200 bg-white" />
          <div className="h-80 rounded-xl border border-slate-200 bg-white" />
        </div>
      </div>
      <div className="absolute inset-0 grid place-items-center bg-white/45 backdrop-blur-[2px]">
        <DashboardLoading message="Preparing your dashboard..." />
      </div>
    </div>
  );
}

function buildDailySales(orders: Order[]): DailySales[] {
  const formatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
  const today = new Date();
  const days: DailySales[] = [];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - offset);
    const key = localDateKey(date);
    days.push({
      key,
      label: formatter.format(date),
      day: offset === 0 ? "Today" : dayFormatter.format(date),
      revenue: 0,
      orders: 0,
    });
  }

  const byDay = new Map(days.map((day) => [day.key, day]));
  orders.forEach((order) => {
    const date = new Date(order.created_at);
    const bucket = byDay.get(localDateKey(date));
    if (!bucket) return;
    bucket.orders += 1;
    if (order.payment_status === "paid") {
      bucket.revenue += Number(order.total) || 0;
    }
  });

  return days;
}

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatOrderTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  if (localDateKey(date) === localDateKey(now)) {
    return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(date);
  }

  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}
