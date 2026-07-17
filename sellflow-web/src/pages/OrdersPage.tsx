import { useCallback, useEffect, useState } from "react";
import { Banknote, ChevronLeft, ChevronRight, Clock3, Eye, PackageCheck, Search, ShoppingCart, X } from "lucide-react";
import { orderService } from "../Services/order";
import { EmptyState, ErrorMessage, PageHeader, buttonPrimary, inputClass } from "../components/dashboard/DashboardUI";
import { useToast } from "../components/ui/ToastContext";
import type { Order, OrderListResponse, OrderStatus, PaymentStatus } from "../types/order";

// Initial states
const emptySummary: OrderListResponse["summary"] = {
  total: 0,
  pending: 0,
  confirmed: 0,
  preparing: 0,
  completed: 0,
  paid_revenue: "0.00"
};

const emptyMeta = {
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0
};

// Status transition maps
const nextStatuses: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["completed", "cancelled"],
  completed: [],
  cancelled: []
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
      setSelected(await orderService.getOrder(order.id));
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
      replaceOrder(await orderService.updateStatus(selected.id, value));
      showToast("Order status updated.");
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
      replaceOrder(await orderService.updatePaymentStatus(selected.id, value));
      showToast("Payment status updated.");
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      {/* Page header */}
      <PageHeader
        title="Orders"
        description="Review customer orders, confirm payments, and manage fulfillment."
      />
      
      {/* Error display */}
      <ErrorMessage error={error} />

      {/* Statistics cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
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
          icon={<PackageCheck size={20} />}
          tone="purple"
        />
        <Stat
          label="Paid revenue"
          value={`$${Number(summary.paid_revenue).toFixed(2)}`}
          icon={<Banknote size={20} />}
          tone="emerald"
          wide
        />
      </div>

      {/* Filters */}
      <div className="mb-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px_180px]">
        {/* Search input */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={17}
          />
          <input
            className={`${inputClass} mt-0 pl-10`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order, customer, or phone..."
          />
        </div>

        {/* Order status filter */}
        <select
          className={`${inputClass} mt-0`}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All order statuses</option>
          {["pending", "confirmed", "preparing", "completed", "cancelled"].map(
            (item) => (
              <option key={item} value={item}>
                {titleCase(item)}
              </option>
            )
          )}
        </select>

        {/* Payment status filter */}
        <select
          className={`${inputClass} mt-0`}
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
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
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Loading orders...
        </div>
      ) : orders.length ? (
        <>
          {/* Desktop table view */}
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Order</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Total</th>
                    <th className="px-5 py-3">Payment</th>
                    <th className="px-5 py-3">Fulfillment</th>
                    <th className="px-5 py-3">Placed</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      {/* Order number & items count */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => openOrder(order)}
                          className="font-mono font-semibold text-purple-700 hover:underline"
                        >
                          {order.order_number}
                        </button>
                        <p className="mt-1 text-xs text-slate-400">
                          {order.items_count} item(s)
                        </p>
                      </td>

                      {/* Customer info */}
                      <td className="px-5 py-4">
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-xs text-slate-400">
                          {order.customer_phone}
                        </p>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4 font-semibold">
                        ${Number(order.total).toFixed(2)}
                      </td>

                      {/* Payment status badge */}
                      <td className="px-5 py-4">
                        <StatusBadge value={order.payment_status} />
                      </td>

                      {/* Fulfillment status badge */}
                      <td className="px-5 py-4">
                        <StatusBadge value={order.status} />
                      </td>

                      {/* Date placed */}
                      <td className="px-5 py-4 text-slate-500">
                        {formatDate(order.created_at)}
                      </td>

                      {/* View action */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() => openOrder(order)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
                          aria-label="View order"
                        >
                          <Eye size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile card view */}
          <div className="space-y-3 md:hidden">
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => openOrder(order)}
                className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm font-semibold text-purple-700">
                      {order.order_number}
                    </p>
                    <p className="mt-1 font-medium">{order.customer_name}</p>
                    <p className="text-xs text-slate-400">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <strong>${Number(order.total).toFixed(2)}</strong>
                </div>
                <div className="mt-4 flex gap-2">
                  <StatusBadge value={order.status} />
                  <StatusBadge value={order.payment_status} />
                </div>
              </button>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-5 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Page {meta.current_page} of {meta.last_page} · {meta.total} orders
            </p>
            <div className="flex gap-2">
              <button
                disabled={meta.current_page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-slate-200 bg-white p-2 disabled:opacity-40"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                disabled={meta.current_page >= meta.last_page}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-slate-200 bg-white p-2 disabled:opacity-40"
              >
                <ChevronRight size={20} />
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
              ? "Try changing your order filters."
              : "New customer orders will appear here."
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
        />
      )}
    </>
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
  onPayment
}: {
  order: Order;
  loading: boolean;
  updating: boolean;
  close: () => void;
  onStatus: (value: OrderStatus) => void;
  onPayment: (value: PaymentStatus) => void;
}) {
  return (
    <>
      {/* Backdrop overlay */}
      <button
        className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-sm"
        onClick={close}
        aria-label="Close order details"
      />

      {/* Drawer panel */}
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
        {/* Drawer header */}
        <div className="sticky top-0 z-10 flex items-center border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-xs text-slate-400">Order details</p>
            <h2 className="font-mono text-lg font-bold">{order.order_number}</h2>
          </div>
          <button
            onClick={close}
            className="ml-auto rounded-lg p-2 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer content */}
        {loading ? (
          <p className="p-8 text-sm text-slate-500">Loading order details...</p>
        ) : (
          <div className="space-y-6 p-5 sm:p-6">
            {/* Status controls */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Fulfillment status */}
              <Control
                label="Fulfillment status"
                value={order.status}
                disabled={updating || !nextStatuses[order.status].length}
                options={[order.status, ...nextStatuses[order.status]]}
                onChange={(value) => onStatus(value as OrderStatus)}
              />

              {/* Payment status */}
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
            <Section title="Customer">
              <Info label="Name" value={order.customer_name} />
              <Info label="Phone" value={order.customer_phone} />
              {order.customer_email && (
                <Info label="Email" value={order.customer_email} />
              )}
              <Info
                label="Delivery"
                value={[order.delivery_address, order.city]
                  .filter(Boolean)
                  .join(", ")}
              />
              {order.notes && <Info label="Notes" value={order.notes} />}
            </Section>

            {/* Order items */}
            <Section
              title={`Items (${order.items?.length || order.items_count})`}
            >
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    {/* Product thumbnail */}
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {item.thumbnail && (
                        <img
                          src={item.thumbnail}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    {/* Product details */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.quantity} × ${Number(item.unit_price).toFixed(2)}
                      </p>
                    </div>

                    {/* Line total */}
                    <strong className="text-sm">
                      ${Number(item.line_total).toFixed(2)}
                    </strong>
                  </div>
                ))}
              </div>

              {/* Order totals */}
              <div className="mt-5 border-t border-slate-200 pt-4">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span>${Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="mt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${Number(order.total).toFixed(2)}</span>
                </div>
              </div>
            </Section>

            {/* Order metadata */}
            <Section title="Order information">
              <Info
                label="Placed"
                value={new Date(order.created_at).toLocaleString()}
              />
              <Info
                label="Payment method"
                value={titleCase(order.payment_method)}
              />
            </Section>
          </div>
        )}
      </aside>
    </>
  );
}

/**
 * Statistics card component
 * Displays a single metric with icon and label
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
  const colors: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
    emerald: "bg-emerald-50 text-emerald-700"
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${
        wide ? "col-span-2 lg:col-span-1" : ""
      }`}
    >
      <span className={`grid h-9 w-9 place-items-center rounded-xl ${colors[tone]}`}>
        {icon}
      </span>
      <p className="mt-4 text-2xl font-bold">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

/**
 * Status badge component
 * Color-coded badge for order and payment statuses
 */
function StatusBadge({ value }: { value: string }) {
  const colors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-blue-50 text-blue-700",
    preparing: "bg-purple-50 text-purple-700",
    completed: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-slate-100 text-slate-600",
    paid: "bg-emerald-50 text-emerald-700",
    failed: "bg-rose-50 text-rose-700",
    refunded: "bg-cyan-50 text-cyan-700"
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
        colors[value] || colors.pending
      }`}
    >
      {value}
    </span>
  );
}

/**
 * Form control component for status dropdowns
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
    <label className="text-sm font-medium">
      {label}
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} disabled:bg-slate-50 disabled:text-slate-400`}
      >
        {options.map((item) => (
          <option key={item} value={item}>
            {titleCase(item)}
          </option>
        ))}
      </select>
    </label>
  );
}

/**
 * Section wrapper with title
 */
function Section({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 p-4">
      <h3 className="mb-4 font-semibold">{title}</h3>
      {children}
    </section>
  );
}

/**
 * Info row component for displaying label-value pairs
 */
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm">{value}</p>
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
 * Utility: Format date string to readable format
 */
function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}