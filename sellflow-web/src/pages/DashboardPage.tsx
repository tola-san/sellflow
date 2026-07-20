import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  ArrowRight,
  Banknote,
  Box,
  CheckCircle2,
  FolderTree,
  Package,
  Plus,
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
  completed: 0,
  paid_revenue: "0",
};

const money = (value: number | string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value) || 0);

const orderTone: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-600/10",
  confirmed: "bg-blue-50 text-blue-700 ring-blue-600/10",
  preparing: "bg-violet-50 text-violet-700 ring-violet-600/10",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-600/10",
};

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
  tone: string;
}) {
  return (
    <article className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,.03)] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60">
      <div className="flex items-start justify-between">
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></span>
        <span className="rounded-full bg-slate-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Live</span>
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{value}</p>
      <p className="mt-2 text-xs text-slate-400">{note}</p>
    </article>
  );
}

function ActivityChart({ orders }: { orders: Order[] }) {
  const data = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      const next = new Date(date);
      next.setDate(next.getDate() + 1);
      const dayOrders = orders.filter((order) => {
        const created = new Date(order.created_at);
        return created >= date && created < next;
      });
      return {
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        count: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + Number(order.total || 0), 0),
      };
    });
  }, [orders]);

  const max = Math.max(...data.map((item) => item.count), 1);
  const points = data.map((item, index) => `${index * (600 / 6)},${150 - (item.count / max) * 120}`).join(" ");
  const area = `0,170 ${points} 600,170`;
  const weekRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-950">Order activity</h2>
          <p className="mt-1 text-sm text-slate-500">Orders captured over the last 7 days</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">7-day revenue</p>
          <p className="font-bold text-slate-900">{money(weekRevenue)}</p>
        </div>
      </div>
      <div className="mt-8 h-52">
        <svg viewBox="0 0 600 180" className="h-[170px] w-full overflow-visible" preserveAspectRatio="none" aria-label="Seven-day order activity chart">
          <defs>
            <linearGradient id="analytics-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7c3aed" stopOpacity=".24" />
              <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[30, 70, 110, 150].map((y) => <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="4 6" />)}
          <polygon points={area} fill="url(#analytics-area)" />
          <polyline points={points} fill="none" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          {data.map((item, index) => (
            <circle key={item.label} cx={index * (600 / 6)} cy={150 - (item.count / max) * 120} r="5" fill="white" stroke="#7c3aed" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        <div className="grid grid-cols-7 text-center text-[11px] font-medium text-slate-400">
          {data.map((item) => <span key={item.label}>{item.label}</span>)}
        </div>
      </div>
    </article>
  );
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
    ]).then(([overviewResult, ordersResult]) => {
      if (overviewResult.status === "fulfilled") setOverview(overviewResult.value);
      else setError(overviewResult.reason);
      if (ordersResult.status === "fulfilled") {
        setOrders(ordersResult.value.orders);
        setSummary(ordersResult.value.summary);
      } else if (overviewResult.status === "fulfilled") setError(ordersResult.reason);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-24 rounded-2xl bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <div key={i} className="h-44 rounded-2xl bg-slate-200" />)}</div>
        <div className="h-80 rounded-2xl bg-slate-200" />
      </div>
    );
  }

  const business = overview?.business;
  const products = overview?.recent_products ?? [];
  const counts = overview?.stats ?? { products: 0, active_products: 0, categories: 0, active_categories: 0, low_stock: 0 };
  const revenue = Number(summary.paid_revenue || 0);
  const averageOrder = summary.total ? revenue / summary.total : 0;
  const fulfillment = summary.total ? Math.round((summary.completed / summary.total) * 100) : 0;
  const statusTotal = summary.pending + summary.confirmed + summary.preparing + summary.completed || 1;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-violet-600"><Sparkles className="h-3.5 w-3.5" /> Analytics overview</div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Welcome back{business ? `, ${business.name}` : ""}</h1>
          <p className="mt-1 text-sm text-slate-500">Your store performance and operations at a glance.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard/orders" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">View orders</Link>
          <Link to="/dashboard/products" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"><Plus className="h-4 w-4" /> Add product</Link>
        </div>
      </header>

      <ErrorMessage error={error} />

      {!business && (
        <div className="flex flex-col gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 p-6 text-white shadow-lg shadow-violet-200 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="font-bold">Complete your business profile</p><p className="mt-1 text-sm text-violet-100">Publish your storefront and start collecting orders.</p></div>
          <Link to="/dashboard/business" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-violet-700">Get started <ArrowRight className="h-4 w-4" /></Link>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Paid revenue" value={money(revenue)} note={`${summary.total} orders in current view`} icon={Banknote} tone="bg-emerald-50 text-emerald-600" />
        <MetricCard label="Total orders" value={summary.total} note={`${summary.pending} waiting for action`} icon={ShoppingCart} tone="bg-violet-50 text-violet-600" />
        <MetricCard label="Average order" value={money(averageOrder)} note="Based on paid revenue" icon={TrendingUp} tone="bg-blue-50 text-blue-600" />
        <MetricCard label="Fulfillment rate" value={`${fulfillment}%`} note={`${summary.completed} completed orders`} icon={CheckCircle2} tone="bg-amber-50 text-amber-600" />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <ActivityChart orders={orders} />
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-semibold text-slate-950">Order pipeline</h2>
          <p className="mt-1 text-sm text-slate-500">Current fulfillment distribution</p>
          <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-slate-100">
            {[
              [summary.pending, "bg-amber-400"], [summary.confirmed, "bg-blue-500"], [summary.preparing, "bg-violet-500"], [summary.completed, "bg-emerald-500"],
            ].map(([value, color], index) => <div key={index} className={String(color)} style={{ width: `${(Number(value) / statusTotal) * 100}%` }} />)}
          </div>
          <div className="mt-6 space-y-4">
            {[
              ["Pending", summary.pending, "bg-amber-400"], ["Confirmed", summary.confirmed, "bg-blue-500"], ["Preparing", summary.preparing, "bg-violet-500"], ["Completed", summary.completed, "bg-emerald-500"],
            ].map(([label, value, color]) => (
              <div key={String(label)} className="flex items-center gap-3 text-sm"><span className={`h-2.5 w-2.5 rounded-full ${color}`} /><span className="flex-1 text-slate-600">{label}</span><strong className="text-slate-900">{value}</strong><span className="w-10 text-right text-xs text-slate-400">{Math.round((Number(value) / statusTotal) * 100)}%</span></div>
            ))}
          </div>
          <Link to="/dashboard/orders" className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">Manage orders <ArrowRight className="h-4 w-4" /></Link>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6"><div><h2 className="font-semibold text-slate-950">Recent orders</h2><p className="mt-1 text-sm text-slate-500">Latest customer activity</p></div><Link to="/dashboard/orders" className="text-sm font-semibold text-violet-600">View all</Link></div>
          {orders.length ? (
            <div className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((order) => (
                <Link to="/dashboard/orders" key={order.id} className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50 sm:px-6">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600"><ShoppingBag className="h-4 w-4" /></span>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{order.customer_name}</p><p className="mt-0.5 text-xs text-slate-400">{order.order_number} · {order.items_count} items</p></div>
                  <span className={`hidden rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ring-1 ring-inset sm:block ${orderTone[order.status]}`}>{order.status}</span>
                  <p className="text-sm font-bold text-slate-900">{money(order.total)}</p>
                </Link>
              ))}
            </div>
          ) : <div className="p-10 text-center text-sm text-slate-500">Orders will appear here when customers start purchasing.</div>}
        </article>

        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between"><div><h2 className="font-semibold text-slate-950">Inventory health</h2><p className="mt-1 text-sm text-slate-500">Catalog availability</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-600"><Box className="h-5 w-5" /></span></div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-400">Products</p><p className="mt-1 text-xl font-bold">{counts.products}</p></div>
            <div className="rounded-xl bg-emerald-50 p-3"><p className="text-xs text-emerald-600">Active</p><p className="mt-1 text-xl font-bold text-emerald-700">{counts.active_products}</p></div>
            <div className="rounded-xl bg-amber-50 p-3"><p className="text-xs text-amber-600">Low stock</p><p className="mt-1 text-xl font-bold text-amber-700">{counts.low_stock}</p></div>
          </div>
          <div className="mt-5 space-y-3">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-500"><Package className="h-4 w-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-800">{product.name}</p><p className="text-[11px] text-slate-400">{product.category?.name || "Uncategorized"}</p></div><span className={`text-xs font-semibold ${product.stock <= 5 ? "text-amber-600" : "text-slate-500"}`}>{product.stock} left</span></div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500"><span className="flex items-center gap-1.5"><FolderTree className="h-3.5 w-3.5" /> {counts.categories} categories</span><Link to="/dashboard/products" className="font-semibold text-violet-600">Manage inventory</Link></div>
        </article>
      </section>
    </div>
  );
}
