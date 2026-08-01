import { useCallback, useEffect, useState } from "react";
import {
  Banknote,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  PackageCheck,
  Search,
  ShoppingCart,
  X,
  Filter,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  StickyNote,
  CreditCard,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
  BellRing
} from "lucide-react";
import { orderService } from "../Services/order";
import { EmptyState, ErrorMessage, PageHeader, buttonPrimary, inputClass } from "../components/dashboard/DashboardUI";
import { useAuth } from "../components/Auth/AuthContext";
import { useToast } from "../components/ui/ToastContext";
import type { Order, OrderListResponse, OrderStatus, PaymentStatus } from "../types/order";

// Initial states
const emptySummary: OrderListResponse["summary"] = {
  total: 0,
  pending: 0,
  confirmed: 0,
  preparing: 0,
  ready: 0,
  completed: 0,
  cancelled: 0,
  paid_revenue: "0.00"
};

const emptyMeta = {
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0
};

// Status transition maps
const nextStatuses = (status: OrderStatus, supportsReady: boolean): OrderStatus[] => {
  if (status === "pending") return ["confirmed", "cancelled"];
  if (status === "confirmed") return ["preparing", "cancelled"];
  if (status === "preparing") return supportsReady ? ["ready", "cancelled"] : ["completed", "cancelled"];
  if (status === "ready") return ["completed", "cancelled"];
  return [];
};

const nextPayments: Record<PaymentStatus, PaymentStatus[]> = {
  pending: ["paid", "failed"],
  failed: ["pending", "paid"],
  paid: ["refunded"],
  refunded: []
};

export function OrdersPage() {
  // State management
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState(emptySummary);
  const [meta, setMeta] = useState(emptyMeta);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const { showToast } = useToast();
  const { user } = useAuth();
  const supportsReady = user?.business?.business_type === "food_beverage";

  // Load orders with filters and pagination
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await orderService.getOrders({
        search: search || undefined,
        status: status || undefined,
        payment_status: paymentStatus || undefined,
        page
      });
      setOrders(result.orders);
      setSummary(result.summary);
      setMeta(result.meta);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [search, status, paymentStatus, page]);

  // Debounced search
  useEffect(() => {
    const timer = window.setTimeout(load, search ? 300 : 0);
    return () => window.clearTimeout(timer);
  }, [load, search]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, status, paymentStatus]);

  // Open order detail drawer
  const openOrder = async (order: Order) => {
    setSelected(order);
    setDetailLoading(true);
    setError(null);
    try {
      setSelected(await orderService.getOrder(order.uuid));
    } catch (err) {
      setError(err);
    } finally {
      setDetailLoading(false);
    }
  };

  // Update order in local state after status change
  const replaceOrder = (updated: Order) => {
    setSelected(updated);
    setOrders((current) =>
      current.map((order) =>
        order.id === updated.id ? { ...order, ...updated } : order
      )
    );
  };

  // Change fulfillment status
  const changeStatus = async (value: OrderStatus) => {
    if (!selected) return;
    setUpdating(true);
    setError(null);
    try {
      replaceOrder(await orderService.updateStatus(selected.uuid, value));
      showToast("Order status updated successfully.");
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setUpdating(false);
    }
  };

  // Change payment status
  const changePayment = async (value: PaymentStatus) => {
    if (!selected) return;
    setUpdating(true);
    setError(null);
    try {
      replaceOrder(await orderService.updatePaymentStatus(selected.uuid, value));
      showToast("Payment status updated successfully.");
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <PageHeader
          title="Orders"
          description="Review customer orders, confirm payments, and manage fulfillment."
        />
        
        {/* Error display */}
        <ErrorMessage error={error} />

        {/* Statistics cards */}
        <div className={`mb-8 grid grid-cols-2 gap-4 ${supportsReady ? "lg:grid-cols-6" : "lg:grid-cols-5"}`}>
          <Stat
            label="All orders"
            value={summary.total}
            icon={<ShoppingCart size={20} />}
            tone="slate"
          />
          <Stat
            label="Pending"
            value={summary.pending}
            icon={<Clock3 size={20} />}
            tone="amber"
          />
          <Stat
            label="Confirmed"
            value={summary.confirmed}
            icon={<PackageCheck size={20} />}
            tone="blue"
          />
          <Stat
            label="Preparing"
            value={summary.preparing}
            icon={<Truck size={20} />}
            tone="purple"
          />
          {supportsReady && (
            <Stat
              label="Ready"
              value={summary.ready}
              icon={<BellRing size={20} />}
              tone="cyan"
            />
          )}
          <Stat
            label="Paid revenue"
            value={`$${Number(summary.paid_revenue).toFixed(2)}`}
            icon={<Banknote size={20} />}
            tone="emerald"
            wide
          />
        </div>

        {/* Filters */}
        <div className="mb-6 grid gap-4 sm:grid-cols-[minmax(0,1fr)_180px_180px]">
          <div className="relative group">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-purple-500"
              size={18}
            />
            <input
              className={`${inputClass} mt-0 pl-10 pr-4 transition-all duration-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order, customer, or phone..."
            />
          </div>

          <select
            className={`${inputClass} mt-0 cursor-pointer appearance-none bg-white pr-10 transition-all duration-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500`}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.5rem 1.5rem',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <option value="">All order statuses</option>
            {["pending", "confirmed", "preparing", ...(supportsReady ? ["ready"] : []), "completed", "cancelled"].map(
              (item) => (
                <option key={item} value={item}>
                  {titleCase(item)}
                </option>
              )
            )}
          </select>

          <select
            className={`${inputClass} mt-0 cursor-pointer appearance-none bg-white pr-10 transition-all duration-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500`}
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1.5rem 1.5rem',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <option value="">All payments</option>
            {["pending", "paid", "failed", "refunded"].map((item) => (
              <option key={item} value={item}>
                {titleCase(item)}
              </option>
            ))}
          </select>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-16">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            <p className="mt-4 text-sm text-slate-500">Loading orders...</p>
          </div>
        ) : orders.length ? (
          <>
            {/* Desktop table view */}
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gradient-to-r from-slate-50 to-purple-50/50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Order</th>
                      <th className="px-5 py-4 font-semibold">Customer</th>
                      <th className="px-5 py-4 font-semibold text-right">Total</th>
                      <th className="px-5 py-4 font-semibold">Payment</th>
                      <th className="px-5 py-4 font-semibold">Fulfillment</th>
                      <th className="px-5 py-4 font-semibold">Placed</th>
                      <th className="px-5 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((order, index) => (
                      <tr 
                        key={order.id} 
                        className="group transition-colors hover:bg-purple-50/30"
                        style={{
                          animationDelay: `${index * 50}ms`
                        }}
                      >
                        <td className="px-5 py-4">
                          <button
                            onClick={() => openOrder(order)}
                            className="font-mono font-semibold text-purple-600 transition-colors hover:text-purple-800 hover:underline"
                          >
                            {order.order_number}
                          </button>
                          <p className="mt-1 text-xs text-slate-400">
                            {order.items_count} item{order.items_count !== 1 ? 's' : ''}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-800">{order.customer_name}</p>
                          <p className="text-xs text-slate-400">{order.customer_phone}</p>
                        </td>

                        <td className="px-5 py-4 text-right font-bold text-slate-800">
                          ${Number(order.total).toFixed(2)}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge value={order.payment_status} />
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge value={order.status} />
                        </td>

                        <td className="px-5 py-4 text-slate-500">
                          {formatDate(order.created_at)}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => openOrder(order)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-purple-600 transition-all hover:bg-purple-50 hover:text-purple-800"
                          >
                            <Eye size={16} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile card view */}
            <div className="space-y-4 md:hidden">
              {orders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => openOrder(order)}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-sm font-semibold text-purple-600">
                        {order.order_number}
                      </p>
                      <p className="mt-1 truncate font-medium text-slate-800">{order.customer_name}</p>
                      <p className="text-xs text-slate-400">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-800">
                        ${Number(order.total).toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-400">{order.items_count} items</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusBadge value={order.status} />
                    <StatusBadge value={order.payment_status} />
                  </div>
                </button>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-slate-500">
                Showing page <span className="font-medium">{meta.current_page}</span> of{' '}
                <span className="font-medium">{meta.last_page}</span> ·{' '}
                <span className="font-medium">{meta.total}</span> orders total
              </p>
              <div className="flex gap-2">
                <button
                  disabled={meta.current_page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <button
                  disabled={meta.current_page >= meta.last_page}
                  onClick={() => setPage((p) => p + 1)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          // Empty state
          <EmptyState
            title="No orders found"
            description={
              search || status || paymentStatus
                ? "Try adjusting your filters or search terms."
                : "New customer orders will appear here once placed."
            }
          />
        )}

        {/* Order detail drawer */}
        {selected && (
          <OrderDrawer
            order={selected}
            loading={detailLoading}
            updating={updating}
            close={() => setSelected(null)}
            onStatus={changeStatus}
            onPayment={changePayment}
            supportsReady={supportsReady}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Order detail drawer component
 * Slides in from the right with order information and status controls
 */
function OrderDrawer({
  order,
  loading,
  updating,
  close,
  onStatus,
  onPayment,
  supportsReady
}: {
  order: Order;
  loading: boolean;
  updating: boolean;
  close: () => void;
  onStatus: (value: OrderStatus) => void;
  onPayment: (value: PaymentStatus) => void;
  supportsReady: boolean;
}) {
  return (
    <>
      <button
        className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity"
        onClick={close}
        aria-label="Close order details"
      />
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl overflow-y-auto bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Order details</p>
            <h2 className="font-mono text-xl font-bold text-slate-800">{order.order_number}</h2>
            {order.restaurant_table && <p className="mt-1 text-sm font-semibold text-purple-600">Dine-in · {order.restaurant_table.name}{order.restaurant_table.area ? ` · ${order.restaurant_table.area}` : ""}</p>}
          </div>
          <button
            onClick={close}
            className="rounded-full p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-16">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            <p className="mt-4 text-sm text-slate-500">Loading order details...</p>
          </div>
        ) : (
          <div className="space-y-6 p-6">
            {/* Status controls */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Control
                label="Fulfillment status"
                value={order.status}
                disabled={updating || !nextStatuses(order.status, supportsReady).length}
                options={[order.status, ...nextStatuses(order.status, supportsReady)]}
                onChange={(value) => onStatus(value as OrderStatus)}
              />
              <Control
                label="Payment status"
                value={order.payment_status}
                disabled={updating || !nextPayments[order.payment_status].length}
                options={[
                  order.payment_status,
                  ...nextPayments[order.payment_status]
                ]}
                onChange={(value) => onPayment(value as PaymentStatus)}
              />
            </div>

            {/* Customer information */}
            <Section title="Customer Information" icon={<User size={18} />}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Info icon={<User size={16} />} label="Name" value={order.customer_name} />
                <Info icon={<Phone size={16} />} label="Phone" value={order.customer_phone} />
                {order.customer_email && (
                  <Info icon={<Mail size={16} />} label="Email" value={order.customer_email} />
                )}
                <Info 
                  icon={<MapPin size={16} />} 
                  label="Delivery" 
                  value={[order.delivery_address, order.city].filter(Boolean).join(", ")} 
                />
                {order.notes && (
                  <div className="sm:col-span-2">
                    <Info icon={<StickyNote size={16} />} label="Notes" value={order.notes} />
                  </div>
                )}
              </div>
            </Section>

            {/* Order items */}
            <Section title={`Order Items (${order.items?.length || order.items_count})`} icon={<PackageCheck size={18} />}>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 rounded-xl bg-slate-50 p-3 transition-colors hover:bg-slate-100">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-200">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.product_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
                          <PackageCheck className="h-6 w-6 text-purple-400" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-800">{item.product_name}</p>
                      {item.modifiers?.length > 0 && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          {item.modifiers.map((modifier) => modifier.option_name).join(", ")}
                        </p>
                      )}
                      <p className="text-sm text-slate-500">
                        {item.quantity} × ${Number(item.unit_price).toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold text-slate-800">
                      ${Number(item.line_total).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-slate-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-700">${Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="mt-3 flex justify-between text-lg">
                  <span className="font-semibold text-slate-800">Total</span>
                  <span className="font-bold text-purple-600">${Number(order.total).toFixed(2)}</span>
                </div>
              </div>
            </Section>

            {/* Order metadata */}
            <Section title="Order Information" icon={<Calendar size={18} />}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Info 
                  icon={<Clock3 size={16} />} 
                  label="Placed" 
                  value={new Date(order.created_at).toLocaleString()} 
                />
                <Info 
                  icon={<CreditCard size={16} />} 
                  label="Payment method" 
                  value={titleCase(order.payment_method)} 
                />
              </div>
            </Section>
          </div>
        )}
      </aside>
    </>
  );
}

/**
 * Statistics card component
 */
function Stat({
  label,
  value,
  icon,
  tone,
  wide = false
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  tone: string;
  wide?: boolean;
}) {
  const colors: Record<string, { bg: string; icon: string; border: string }> = {
    slate: { bg: "bg-slate-50", icon: "text-slate-600", border: "border-slate-200" },
    amber: { bg: "bg-amber-50", icon: "text-amber-600", border: "border-amber-200" },
    blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-200" },
    purple: { bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-200" },
    cyan: { bg: "bg-cyan-50", icon: "text-cyan-600", border: "border-cyan-200" },
    emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", border: "border-emerald-200" }
  };

  return (
    <div
      className={`group rounded-2xl border ${colors[tone].border} bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${
        wide ? "col-span-2 lg:col-span-1" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${colors[tone].bg} ${colors[tone].icon}`}>
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Status badge component
 */
function StatusBadge({ value }: { value: string }) {
  const colors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    pending: { 
      bg: "bg-amber-50", 
      text: "text-amber-700",
      icon: <Clock3 size={12} className="text-amber-500" />
    },
    confirmed: { 
      bg: "bg-blue-50", 
      text: "text-blue-700",
      icon: <CheckCircle2 size={12} className="text-blue-500" />
    },
    preparing: { 
      bg: "bg-purple-50", 
      text: "text-purple-700",
      icon: <Truck size={12} className="text-purple-500" />
    },
    ready: {
      bg: "bg-cyan-50",
      text: "text-cyan-700",
      icon: <BellRing size={12} className="text-cyan-500" />
    },
    completed: { 
      bg: "bg-emerald-50", 
      text: "text-emerald-700",
      icon: <CheckCircle2 size={12} className="text-emerald-500" />
    },
    cancelled: { 
      bg: "bg-slate-100", 
      text: "text-slate-600",
      icon: <XCircle size={12} className="text-slate-400" />
    },
    paid: { 
      bg: "bg-emerald-50", 
      text: "text-emerald-700",
      icon: <CheckCircle2 size={12} className="text-emerald-500" />
    },
    failed: { 
      bg: "bg-rose-50", 
      text: "text-rose-700",
      icon: <XCircle size={12} className="text-rose-500" />
    },
    refunded: { 
      bg: "bg-cyan-50", 
      text: "text-cyan-700",
      icon: <AlertCircle size={12} className="text-cyan-500" />
    }
  };

  const color = colors[value] || colors.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${color.bg} ${color.text}`}
    >
      {color.icon}
      {value}
    </span>
  );
}

/**
 * Form control component
 */
function Control({
  label,
  value,
  options,
  onChange,
  disabled
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:bg-slate-50 disabled:text-slate-400 ${
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-slate-300'
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.5rem 1.5rem',
          backgroundRepeat: 'no-repeat',
          appearance: 'none'
        }}
      >
        {options.map((item) => (
          <option key={item} value={item} className="font-normal">
            {titleCase(item)}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Section wrapper
 */
function Section({
  title,
  icon,
  children
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        {icon && <span className="text-slate-400">{icon}</span>}
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      {children}
    </section>
  );
}

/**
 * Info row component
 */
function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1.5">
        {icon && <span className="text-slate-400">{icon}</span>}
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
      </div>
      <p className="text-sm text-slate-700">{value || '—'}</p>
    </div>
  );
}

/**
 * Utility: Convert snake_case to Title Case
 */
function titleCase(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/**
 * Utility: Format date string
 */
function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}
