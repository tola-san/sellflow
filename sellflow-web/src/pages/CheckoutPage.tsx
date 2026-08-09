import { useEffect, useRef, useState } from "react";
import { ArrowLeft, BadgeCheck, Banknote, Landmark, Send, ShoppingBag } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { checkoutService, type CheckoutPayload, type PublicOrder } from "../Services/checkout";
import { storefrontService, type PublicRestaurantTable, type Storefront } from "../Services/storefront";
import { useCart } from "../components/cart/CartContext";
import { ErrorMessage, inputClass } from "../components/dashboard/DashboardUI";
import { useTelegramMainButton, useTelegramMiniApp } from "../components/telegram/TelegramMiniAppContext";
import { customerThemeVariables, resolveCustomerTheme, useCustomerTheme } from "../theme/useCustomerTheme";
import { formatCurrency } from "../lib/currency";

type CheckoutForm = Required<Pick<CheckoutPayload, "customer_name" | "customer_phone" | "delivery_address" | "city" | "notes" | "payment_method">>;

const initialForm: CheckoutForm = {
  customer_name: "",
  customer_phone: "",
  delivery_address: "",
  city: "",
  notes: "",
  payment_method: "cash"
};

export function CheckoutPage() {
  const reduceMotion = useReducedMotion();
  const { slug = "" } = useParams();
  const [store, setStore] = useState<Storefront | null>(null);
  const [form, setForm] = useState(initialForm);
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [submitting, setSubmitting] = useState(false);
  const [restaurantTable, setRestaurantTable] = useState<PublicRestaurantTable | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const cart = useCart();
  const { close, customerName, hapticSuccess, isTelegramClient, requestWriteAccess, storePath, webApp } = useTelegramMiniApp();
  const { selection: customerTheme } = useCustomerTheme(slug);
  const items = cart.items(slug);

  const theme = store ? resolveCustomerTheme(store.business.theme, customerTheme) : null;
  const primary = theme?.primary_color || "#3b82f6";
  const themeVariables = theme ? customerThemeVariables(theme) : undefined;
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  useEffect(() => {
    if (!slug) return;
    storefrontService.getStore(slug).then(setStore).catch(setError);
    try {
      const stored = localStorage.getItem(`sellflow_restaurant_table_${slug}`);
      const table = stored ? JSON.parse(stored) as PublicRestaurantTable : null;
      if (table?.token) {
        storefrontService.getTable(slug, table.token).then(setRestaurantTable).catch(() => {
          localStorage.removeItem(`sellflow_restaurant_table_${slug}`);
        });
      }
    } catch {
      localStorage.removeItem(`sellflow_restaurant_table_${slug}`);
    }
  }, [slug]);

  useEffect(() => {
    // Telegram profile data is only a convenience prefill; checkout still validates it as customer input.
    if (customerName) setForm((current) => current.customer_name ? current : { ...current, customer_name: customerName });
  }, [customerName]);

  useTelegramMainButton({
    text: submitting ? "Placing order…" : `Place order · ${formatCurrency(subtotal, store?.business.currency)}`,
    color: primary,
    visible: isTelegramClient && Boolean(store) && items.length > 0 && !order,
    enabled: !submitting,
    loading: submitting,
    onClick: () => formRef.current?.requestSubmit(),
  });

  const change = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isTelegramClient) {
        // Permission is optional: declining notifications must never block checkout.
        await requestWriteAccess();
      }

      const payload: CheckoutPayload = {
        ...form,
        ...(isTelegramClient && webApp?.initData ? { telegram_init_data: webApp.initData } : {}),
        ...(restaurantTable ? { table_token: restaurantTable.token, delivery_address: "" } : {}),
        items: items.map(item => ({
          product_slug: item.product.slug,
          ...(item.variant ? { variant_id: item.variant.id } : {}),
          quantity: item.quantity,
          modifier_ids: item.modifiers.map((modifier) => modifier.id),
        }))
      };

      const created = await checkoutService.createOrder(slug, payload);
      setOrder(created);
      cart.clear(slug);
      hapticSuccess();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Success Screen
  if (order) {
    return (
      <div className="customer-flow-theme flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-5" style={themeVariables}>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-xl sm:p-8"
        >
          <div className="relative mx-auto h-24 w-24">
            {!reduceMotion && Array.from({ length: 10 }).map((_, index) => {
              const angle = (index / 10) * Math.PI * 2;
              return (
                <motion.span
                  aria-hidden="true"
                  key={index}
                  className="absolute left-1/2 top-1/2 h-2 w-2 rounded-sm"
                  style={{ backgroundColor: index % 2 ? primary : "#10b981" }}
                  initial={{ opacity: 0, x: -4, y: -4, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: Math.cos(angle) * 62,
                    y: Math.sin(angle) * 62,
                    rotate: index * 52,
                    scale: [0, 1, 0.6],
                  }}
                  transition={{ duration: 0.9, delay: 0.15 + index * 0.025, ease: "easeOut" }}
                />
              );
            })}
            <motion.div
              initial={reduceMotion ? false : { scale: 0, rotate: -18 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 20, delay: reduceMotion ? 0 : 0.08 }}
              className="absolute inset-2 grid place-items-center rounded-full bg-emerald-100 text-emerald-600"
            >
              <BadgeCheck size={48} />
            </motion.div>
          </div>
          <h1 className="mt-5 text-2xl font-bold sm:mt-6 sm:text-3xl">Order Received</h1>
          <p className="mt-3 text-slate-600">Thank you, <strong>{order.customer_name}</strong>!</p>
          <p className="mt-1 text-sm text-slate-500">
            {order.telegram_receipt_sent
              ? "Your receipt was sent by the SellFlow Telegram bot. We will message you when the order status changes."
              : "Your order is confirmed. Choose Telegram below for instant receipt and live status updates."}
          </p>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-left sm:mt-8 sm:p-6">
            <p className="text-xs uppercase tracking-wider text-slate-400">Ticket Number</p>
            <p className="mt-1 break-all font-mono text-xl font-bold leading-tight text-slate-900 sm:text-2xl">#{order.order_number}</p>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Total</span>
                <span className="font-semibold">{formatCurrency(order.total, store?.business.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Status</span>
                <span className="capitalize font-medium text-amber-600">{order.status}</span>
              </div>
            </div>
          </div>

          {!order.telegram_receipt_sent && order.telegram_link_url && !isTelegramClient && (
            <a
              href={order.telegram_link_url}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#229ED9] px-3 py-3 text-sm font-semibold text-white transition hover:bg-[#168acd] sm:mt-8 sm:min-h-14 sm:rounded-2xl sm:px-4 sm:text-base"
            >
              <Send size={19} className="shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap sm:hidden">Updates on Telegram</span>
              <span className="hidden whitespace-nowrap sm:inline">Get live updates on Telegram</span>
            </a>
          )}
          {!order.telegram_receipt_sent && order.telegram_link_url && !isTelegramClient && (
            <p className="mt-2 px-1 text-xs leading-5 text-slate-500">Instant receipt, payment confirmation, and order updates. No password required.</p>
          )}

          <Link
            to={storePath(slug)}
            className={`${!order.telegram_receipt_sent && order.telegram_link_url && !isTelegramClient ? "mt-3 border border-slate-200 text-slate-700" : "mt-8 text-white"} block w-full rounded-2xl py-4 text-lg font-semibold`}
            style={!order.telegram_receipt_sent && order.telegram_link_url && !isTelegramClient ? undefined : { backgroundColor: primary }}
          >
            Back to Store
          </Link>
          {isTelegramClient && <button type="button" onClick={close} className="mt-3 w-full rounded-2xl border border-slate-200 py-3.5 text-sm font-semibold text-slate-600">Close</button>}
        </motion.div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="customer-flow-theme grid min-h-screen place-items-center bg-slate-50 p-5 text-center text-slate-900" style={themeVariables}>
        <div>
          <ShoppingBag className="mx-auto text-slate-300" size={64} />
          <h1 className="mt-6 text-3xl font-bold">Cart is empty</h1>
          <Link
            to={storePath(slug)}
            className="mt-8 inline-flex rounded-2xl px-8 py-4 text-lg font-semibold text-white"
            style={{ backgroundColor: primary }}
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-flow-theme min-h-screen bg-slate-50 pb-32 text-slate-900 sm:pb-12" style={themeVariables}>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-3.5 sm:px-6 sm:py-4">
          <Link to={storePath(slug, "/cart")} className="flex min-h-10 items-center gap-2 rounded-xl pr-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
            <ArrowLeft size={18} />
            <span className="sm:hidden">Cart</span>
            <span className="hidden sm:inline">Back to Cart</span>
          </Link>
          <strong className="ml-auto max-w-[55vw] truncate text-base sm:text-lg">{store.business.name}</strong>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Checkout</h1>
          <p className="mt-1.5 text-sm leading-6 text-slate-600 sm:mt-2 sm:text-base">Please fill in your details to complete the order</p>
        </div>

        <ErrorMessage error={error} />

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <form ref={formRef} onSubmit={submit} className="space-y-5 sm:space-y-8">
              {/* Customer Info */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
                <h2 className="mb-5 text-lg font-semibold sm:mb-6 sm:text-xl">Customer Information</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    name="customer_name"
                    label="Full Name"
                    required
                    autoComplete="name"
                    maxLength={255}
                    value={form.customer_name}
                    onChange={(v) => change("customer_name", v)}
                  />
                  <Field
                    name="customer_phone"
                    label="Phone Number"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={50}
                    pattern="\+?[0-9][0-9\s().-]{6,49}"
                    title="Enter a valid phone number with at least 7 digits."
                    value={form.customer_phone}
                    onChange={(v) => change("customer_phone", v)}
                  />
                  {!restaurantTable && <Field
                      name="city"
                      label="City"
                      autoComplete="address-level2"
                      maxLength={255}
                      value={form.city}
                      onChange={(v) => change("city", v)}
                    />}
                  
                  {!restaurantTable && <div className="sm:col-span-2">
                    <label htmlFor="delivery_address" className="block text-sm font-medium mb-2">Delivery Address <span className="text-red-500">*</span></label>
                    <textarea
                      id="delivery_address"
                      name="delivery_address"
                      required
                      rows={3}
                      maxLength={1000}
                      autoComplete="street-address"
                      className={inputClass}
                      value={form.delivery_address}
                      onChange={(e) => change("delivery_address", e.target.value)}
                      placeholder="Street address, building, etc."
                    />
                  </div>}

                  {restaurantTable && <div className="sm:col-span-2 rounded-2xl border border-purple-200 bg-purple-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">Dine-in order</p>
                    <p className="mt-1 text-lg font-bold text-purple-950">{restaurantTable.name}</p>
                    <p className="text-sm text-purple-700">{restaurantTable.area || "Restaurant"} · {restaurantTable.capacity} seats</p>
                  </div>}

                  <div className="sm:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium mb-2">Order Notes (Optional)</label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      maxLength={1000}
                      className={inputClass}
                      value={form.notes}
                      onChange={(e) => change("notes", e.target.value)}
                      placeholder="Special instructions for the seller..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6">
                <h2 className="mb-4 text-lg font-semibold sm:mb-5 sm:text-xl">Payment Method</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <PaymentOption
                    value="cash"
                    checked={form.payment_method === "cash"}
                    onChange={() => setForm(v => ({ ...v, payment_method: "cash" }))}
                    icon={<Banknote size={26} />}
                    title="Cash on Delivery"
                    description="Pay when the seller delivers"
                  />
                  <PaymentOption
                    value="bakong"
                    checked={form.payment_method === "bakong"}
                    onChange={() => setForm(v => ({ ...v, payment_method: "bakong" }))}
                    icon={<Landmark size={26} />}
                    title="Bakong"
                    description="Bank transfer via Bakong"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`${isTelegramClient ? "hidden" : "hidden sm:flex"} min-h-14 w-full items-center justify-center gap-2 rounded-2xl px-6 text-base font-semibold text-white shadow-lg transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70`}
                style={{ backgroundColor: primary }}
              >
                <ShoppingBag size={19} aria-hidden="true" />
                {submitting ? "Placing order..." : `Place order · ${formatCurrency(subtotal, store?.business.currency)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-6">Order Summary</h2>

              <div className="space-y-5">
                {items.map(({ line_id, product, quantity, modifiers, variant, unit_price }) => (
                  <div key={line_id} className="flex gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                      {product.thumbnail && (
                        <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-2 font-medium">{product.name}</p>
                      {variant && <p className="mt-0.5 text-xs font-medium text-slate-600">{variant.name}</p>}
                      {modifiers.length > 0 && <p className="mt-0.5 text-xs leading-5 text-slate-500">{modifiers.map((option) => option.name).join(", ")}</p>}
                      <p className="text-sm text-slate-500 mt-0.5">Qty: {quantity}</p>
                    </div>
                    <p className="font-semibold whitespace-nowrap">
                      {formatCurrency(unit_price * quantity, store?.business.currency)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="my-6 border-t border-slate-200" />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>{formatCurrency(subtotal, store?.business.currency)}</span>
              </div>

              <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                Final amount will be confirmed by the seller after order review.
              </p>
            </div>
          </div>
        </div>
      </main>

      {!isTelegramClient && (
        <div
          className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/80 bg-white/95 px-4 pt-3 shadow-[0_-12px_32px_-20px_rgba(15,23,42,0.45)] backdrop-blur sm:hidden"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <div className="min-w-0 shrink-0">
              <span className="block text-[11px] font-medium uppercase tracking-wide text-slate-500">Total</span>
              <strong className="block truncate text-base text-slate-950">
                {formatCurrency(subtotal, store?.business.currency)}
              </strong>
            </div>
            <button
              type="button"
              disabled={submitting}
              onClick={() => formRef.current?.requestSubmit()}
              className="ml-auto flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white shadow-md transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              style={{ backgroundColor: primary }}
            >
              <ShoppingBag size={18} aria-hidden="true" />
              {submitting ? "Placing order..." : "Place order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====================== Helper Components ====================== */

function Field({
  name,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  autoComplete,
  inputMode,
  maxLength,
  pattern,
  title,
}: {
  name: "customer_name" | "customer_phone" | "city";
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  pattern?: string;
  title?: string;
}) {
  return (
    <label htmlFor={name} className="block">
      <span className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        pattern={pattern}
        title={title}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </label>
  );
}

function PaymentOption({
  value,
  checked,
  onChange,
  icon,
  title,
  description
}: {
  value: CheckoutForm["payment_method"];
  checked: boolean;
  onChange: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <label
      className={`flex min-h-[84px] w-full cursor-pointer items-center gap-3 rounded-2xl border p-4 text-left transition-all sm:gap-4 sm:p-5 ${
        checked
          ? "border-purple-500 bg-purple-50 ring-2 ring-purple-100" 
          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <input
        type="radio"
        name="payment_method"
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div className={checked ? "text-purple-600" : "text-slate-400"}>{icon}</div>
      <div>
        <strong className="block">{title}</strong>
        <span className="text-sm text-slate-500 mt-1 block">{description}</span>
      </div>
    </label>
  );
}
