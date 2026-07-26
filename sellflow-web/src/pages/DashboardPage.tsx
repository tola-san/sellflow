import { useEffect, useState, type ComponentType } from "react";
import {
  ArrowRight,
  BarChart3,
  Box,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  DollarSign,
  ExternalLink,
  FolderTree,
  Package,
  Palette,
  Plus,
  Rocket,
  Send,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { dashboardService, type DashboardOverview } from "../Services/dashboard";
import { orderService } from "../Services/order";
import type { Order, OrderListResponse } from "../types/order";
import { ErrorMessage } from "../components/dashboard/DashboardUI";

const emptySummary: OrderListResponse["summary"] = {
  total: 0,
  pending: 0,
  confirmed: 0,
  preparing: 0,
  ready: 0,
  completed: 0,
  paid_revenue: "0",
};

const money = (value: number | string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const orderTone: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  preparing: "bg-violet-50 text-violet-700",
  ready: "bg-cyan-50 text-cyan-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-rose-50 text-rose-700",
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
  description: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  external?: boolean;
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
      title: "Business profile",
      description: "Store identity and public URL",
      href: "/dashboard/business",
      action: "Review profile",
      complete: Boolean(business?.name && business?.slug),
    },
    {
      title: "Organize your catalog",
      description: "Create at least one category",
      href: "/dashboard/categories",
      action: "Add category",
      complete: counts.categories > 0,
    },
    {
      title: "Add your first offer",
      description: "Publish a product, menu item, or service",
      href: "/dashboard/products",
      action: "Add item",
      complete: counts.active_products > 0,
    },
    {
      title: "Publish and share",
      description: "Open the storefront customers will see",
      href: business?.slug ? `/${business.slug}` : "/dashboard/business",
      action: business?.slug ? "View storefront" : "Set public URL",
      complete: Boolean(business?.is_active && counts.active_products > 0),
    },
  ];
  const completedSteps = launchSteps.filter((step) => step.complete).length;
  const nextStep = launchSteps.find((step) => !step.complete);
  const launchPercent = Math.round((completedSteps / launchSteps.length) * 100);

  const quickActions: QuickAction[] = [
    {
      label: "Add item",
      description: "Grow your catalog",
      href: "/dashboard/products",
      icon: Plus,
    },
    {
      label: "Manage orders",
      description: activeOrders ? `${activeOrders} need attention` : "Review fulfillment",
      href: "/dashboard/orders",
      icon: ShoppingBag,
    },
    {
      label: "Design storefront",
      description: "Brand the customer view",
      href: "/dashboard/theme",
      icon: Palette,
    },
    {
      label: "Open storefront",
      description: business?.slug ? `/${business.slug}` : "Set up your public URL",
      href: business?.slug ? `/${business.slug}` : "/dashboard/business",
      icon: ExternalLink,
      external: Boolean(business?.slug),
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-purple-600">
            <Sparkles className="h-4 w-4" />
            Command center
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {business ? `Good to see you, ${business.name}` : "Welcome to SellFlow"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            One place to launch, sell, fulfill, and grow your business.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/dashboard/orders"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:flex-none"
          >
            <ShoppingCart className="h-4 w-4" />
            Orders
            {activeOrders > 0 && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                {activeOrders}
              </span>
            )}
          </Link>
          <Link
            to="/dashboard/products"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 sm:flex-none"
          >
            <Plus className="h-4 w-4" />
            Add item
          </Link>
        </div>
      </header>

      <ErrorMessage error={error} />

      <LifecycleBar
        setupComplete={completedSteps === launchSteps.length}
        hasOrders={summary.total > 0}
        hasActiveOrders={activeOrders > 0}
        hasRevenue={revenue > 0}
      />

      {completedSteps < launchSteps.length && (
        <LaunchPlan
          steps={launchSteps}
          completed={completedSteps}
          percent={launchPercent}
          nextStep={nextStep}
        />
      )}

      {completedSteps === launchSteps.length && (
        <div className="flex flex-col gap-4 overflow-hidden rounded-2xl bg-slate-950 p-5 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-400 text-slate-950">
              <Rocket className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold">Your storefront is live</p>
              <p className="mt-1 text-sm text-slate-300">
                Your launch checklist is complete. Focus on orders and repeatable growth.
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/analytics"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900"
          >
            View analytics <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      <section aria-label="Business metrics" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <MetricCard
          label="Paid revenue"
          value={money(revenue)}
          note={`${summary.total} total orders`}
          icon={DollarSign}
          tone="emerald"
        />
        <MetricCard
          label="Active orders"
          value={activeOrders}
          note={activeOrders ? "Move these through fulfillment" : "No orders need attention"}
          icon={Clock3}
          tone="amber"
        />
        <MetricCard
          label="Average order"
          value={money(averageOrder)}
          note="Based on paid revenue"
          icon={TrendingUp}
          tone="blue"
        />
        <MetricCard
          label="Live items"
          value={counts.active_products}
          note={`${counts.products} total · ${counts.low_stock} low stock`}
          icon={Package}
          tone="purple"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <RecentOrders orders={orders} />
        <QuickActions actions={quickActions} />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <InventoryHealth
          products={counts.products}
          activeProducts={counts.active_products}
          categories={counts.categories}
          lowStock={counts.low_stock}
        />
        <GrowthCard hasOrders={summary.total > 0} />
      </section>
    </div>
  );
}

function LifecycleBar({
  setupComplete,
  hasOrders,
  hasActiveOrders,
  hasRevenue,
}: {
  setupComplete: boolean;
  hasOrders: boolean;
  hasActiveOrders: boolean;
  hasRevenue: boolean;
}) {
  const stages = [
    { label: "Set up", description: "Build your storefront", complete: setupComplete, active: !setupComplete },
    { label: "Sell", description: "Receive customer orders", complete: hasOrders, active: setupComplete && !hasOrders },
    { label: "Fulfill", description: "Process every order", complete: hasOrders && !hasActiveOrders, active: hasActiveOrders },
    { label: "Grow", description: "Learn from real sales", complete: hasRevenue, active: hasRevenue && !hasActiveOrders },
  ];

  return (
    <section aria-label="SellFlow lifecycle" className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0">
        {stages.map((stage, index) => (
          <div className={`relative p-4 sm:p-5 ${stage.active ? "bg-purple-50/70" : ""}`} key={stage.label}>
            <div className="flex items-center gap-2">
              <span
                className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${
                  stage.complete
                    ? "bg-emerald-500 text-white"
                    : stage.active
                      ? "bg-purple-600 text-white"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {stage.complete ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <p className={`text-sm font-bold ${stage.active ? "text-purple-700" : "text-slate-800"}`}>{stage.label}</p>
            </div>
            <p className="mt-1 pl-8 text-[11px] text-slate-500">{stage.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function LaunchPlan({
  steps,
  completed,
  percent,
  nextStep,
}: {
  steps: LaunchStep[];
  completed: number;
  percent: number;
  nextStep?: LaunchStep;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-sm">
      <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
        <div className="bg-gradient-to-br from-purple-700 to-indigo-800 p-6 text-white sm:p-7">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-purple-200">
            <Rocket className="h-4 w-4" /> Launch plan
          </div>
          <h2 className="mt-3 text-2xl font-bold">Get ready for your first sale</h2>
          <p className="mt-2 text-sm leading-6 text-purple-100">
            Complete the essentials in order. SellFlow will show the next best action as your store grows.
          </p>
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>{completed} of {steps.length} complete</span>
              <span>{percent}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${percent}%` }} />
            </div>
          </div>
          {nextStep && (
            <Link
              to={nextStep.href}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-purple-700 transition hover:bg-purple-50"
            >
              {nextStep.action} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        <ol className="divide-y divide-slate-100">
          {steps.map((step, index) => (
            <li className="flex items-center gap-4 px-5 py-4 sm:px-6" key={step.title}>
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                  step.complete ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
                }`}
              >
                {step.complete ? <Check className="h-4 w-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold ${step.complete ? "text-slate-500 line-through" : "text-slate-900"}`}>
                  {step.title}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-500">{step.description}</p>
              </div>
              <Link
                to={step.href}
                aria-label={`${step.action}: ${step.title}`}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-purple-600"
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
  note,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  note: string;
  icon: ComponentType<{ className?: string }>;
  tone: "emerald" | "amber" | "blue" | "purple";
}) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
        <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
        </span>
      </div>
      <p className="mt-4 text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">{value}</p>
      <p className="mt-2 truncate text-[11px] text-slate-400">{note}</p>
    </article>
  );
}

function RecentOrders({ orders }: { orders: Order[] }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
        <div>
          <h2 className="font-bold text-slate-950">Order queue</h2>
          <p className="mt-0.5 text-xs text-slate-500">Newest orders, ready for action</p>
        </div>
        <Link to="/dashboard/orders" className="text-xs font-bold text-purple-600 hover:text-purple-700">
          View all
        </Link>
      </div>
      {orders.length ? (
        <div className="divide-y divide-slate-100">
          {orders.slice(0, 5).map((order) => (
            <Link
              to="/dashboard/orders"
              key={order.id}
              className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-slate-50 sm:px-6"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
                <ShoppingBag className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {order.customer_name || "Customer"}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {order.order_number} · {order.items_count} {order.items_count === 1 ? "item" : "items"}
                </p>
              </div>
              <span className={`hidden rounded-full px-2.5 py-1 text-[10px] font-bold capitalize sm:block ${orderTone[order.status]}`}>
                {order.status}
              </span>
              <p className="text-sm font-bold text-slate-900">{money(order.total)}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="px-6 py-12 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-purple-50 text-purple-500">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-slate-800">Your order queue is clear</p>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
            New customer orders will appear here with their payment and fulfillment status.
          </p>
        </div>
      )}
    </article>
  );
}

function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="font-bold text-slate-950">Quick actions</h2>
      <p className="mt-0.5 text-xs text-slate-500">Keep daily work moving</p>
      <div className="mt-4 space-y-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              to={action.href}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noreferrer" : undefined}
              key={action.label}
              className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-purple-200 hover:bg-purple-50/50"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600 transition group-hover:bg-purple-100 group-hover:text-purple-700">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-800">{action.label}</span>
                <span className="block truncate text-[11px] text-slate-400">{action.description}</span>
              </span>
              <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-purple-500" />
            </Link>
          );
        })}
      </div>
    </article>
  );
}

function InventoryHealth({
  products,
  activeProducts,
  categories,
  lowStock,
}: {
  products: number;
  activeProducts: number;
  categories: number;
  lowStock: number;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-bold text-slate-950">Catalog health</h2>
          <p className="mt-0.5 text-xs text-slate-500">Availability at a glance</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-purple-50 text-purple-600">
          <Box className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <CatalogStat label="Items" value={products} />
        <CatalogStat label="Live" value={activeProducts} good />
        <CatalogStat label="Low stock" value={lowStock} warning={lowStock > 0} />
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="flex items-center gap-2 text-xs text-slate-500">
          <FolderTree className="h-4 w-4" /> {categories} {categories === 1 ? "category" : "categories"}
        </span>
        <Link to="/dashboard/inventory" className="inline-flex items-center gap-1 text-xs font-bold text-purple-600">
          Manage inventory <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}

function CatalogStat({
  label,
  value,
  good = false,
  warning = false,
}: {
  label: string;
  value: number;
  good?: boolean;
  warning?: boolean;
}) {
  const tone = warning
    ? "bg-amber-50 text-amber-800"
    : good
      ? "bg-emerald-50 text-emerald-800"
      : "bg-slate-50 text-slate-900";

  return (
    <div className={`rounded-xl p-3 ${tone}`}>
      <p className="text-[10px] font-semibold opacity-70">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

function GrowthCard({ hasOrders }: { hasOrders: boolean }) {
  const tasks = hasOrders
    ? [
        "Review your best-selling items",
        "Resolve low-stock products",
        "Connect Telegram order alerts",
      ]
    : [
        "Share your storefront link",
        "Preview checkout as a customer",
        "Connect Telegram order alerts",
      ];

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-bold text-slate-950">{hasOrders ? "Next growth moves" : "Prepare for your first order"}</h2>
          <p className="mt-0.5 text-xs text-slate-500">Small actions with the highest impact</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
          <BarChart3 className="h-5 w-5" />
        </span>
      </div>
      <ul className="mt-5 space-y-3">
        {tasks.map((task, index) => (
          <li className="flex items-center gap-3 text-sm text-slate-700" key={task}>
            {index === 0 ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-600" />
            ) : (
              <Circle className="h-4 w-4 shrink-0 text-slate-300" />
            )}
            {task}
          </li>
        ))}
      </ul>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <Link
          to="/dashboard/analytics"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          <TrendingUp className="h-4 w-4" /> Analytics
        </Link>
        <Link
          to="/dashboard/notifications"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-purple-700"
        >
          <Send className="h-4 w-4" /> Telegram
        </Link>
      </div>
    </article>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-20 rounded-2xl bg-slate-200" />
      <div className="h-24 rounded-2xl bg-slate-200" />
      <div className="h-64 rounded-2xl bg-slate-200" />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="h-36 rounded-2xl bg-slate-200" key={index} />
        ))}
      </div>
    </div>
  );
}
