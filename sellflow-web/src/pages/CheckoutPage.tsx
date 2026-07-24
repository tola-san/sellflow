import { useEffect, useRef, useState } from "react";
import { ArrowLeft, BadgeCheck, Banknote, Landmark, Send, ShoppingBag } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { checkoutService, type CheckoutPayload, type PublicOrder } from "../Services/checkout";
import { storefrontService, type Storefront } from "../Services/storefront";
import { useCart } from "../components/cart/CartContext";
import { ErrorMessage, inputClass } from "../components/dashboard/DashboardUI";
import { useTelegramMainButton, useTelegramMiniApp } from "../components/telegram/TelegramMiniAppContext";
import { customerThemeVariables, resolveCustomerTheme, useCustomerTheme } from "../theme/useCustomerTheme";

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
  const { slug = "" } = useParams();
  const [store, setStore] = useState<Storefront | null>(null);
  const [form, setForm] = useState(initialForm);
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [submitting, setSubmitting] = useState(false);
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
  }, [slug]);

  useEffect(() => {
    // Telegram profile data is only a convenience prefill; checkout still validates it as customer input.
    if (customerName) setForm((current) => current.customer_name ? current : { ...current, customer_name: customerName });
  }, [customerName]);

  useTelegramMainButton({
    text: submitting ? "Placing order…" : `Place order · $${subtotal.toFixed(2)}`,
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
        items: items.map(item => ({
          product_slug: item.product.slug,
          quantity: item.quantity,
          modifier_ids: item.modifiers.map((modifier) => modifier.id),
        }))
      };

      const created = await checkoutService.createOrder(slug, payload);
      setOrder(created);
      cart.clear(slug);
      hapticSuccess();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Success Screen
  if (order) {
    return (
      <div className="customer-flow-theme min-h-screen bg-slate-50 flex items-center justify-center p-5" style={themeVariables}>
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600">
            <BadgeCheck size={48} />
          </div>
          <h1 className="mt-6 text-3xl font-bold">Order Received</h1>
          <p className="mt-3 text-slate-600">Thank you, <strong>{order.customer_name}</strong>!</p>
          <p className="mt-1 text-sm text-slate-500">
            {order.telegram_receipt_sent
              ? "Your receipt was sent by the SellFlow Telegram bot. We will message you when the order status changes."
              : "Your order is confirmed. Choose Telegram below for instant receipt and live status updates."}
          </p>

          <div className="mt-8 rounded-2xl bg-slate-50 p-6 text-left">
            <p className="text-xs uppercase tracking-wider text-slate-400">Order Number</p>
            <p className="mt-1 font-mono text-2xl font-bold text-slate-900">{order.order_number}</p>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Total</span>
                <span className="font-semibold">${Number(order.total).toFixed(2)}</span>
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
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#229ED9] py-4 text-lg font-semibold text-white transition hover:bg-[#168acd]"
            >
              <Send size={20} />
              Get live updates on Telegram
            </a>
          )}
          {!order.telegram_receipt_sent && order.telegram_link_url && !isTelegramClient && (
            <p className="mt-2 text-xs leading-5 text-slate-500">Instant receipt, payment confirmation, and order updates. No password required.</p>
          )}

          <Link
            to={storePath(slug)}
            className={`${!order.telegram_receipt_sent && order.telegram_link_url && !isTelegramClient ? "mt-3 border border-slate-200 text-slate-700" : "mt-8 text-white"} block w-full rounded-2xl py-4 text-lg font-semibold`}
            style={!order.telegram_receipt_sent && order.telegram_link_url && !isTelegramClient ? undefined : { backgroundColor: primary }}
          >
            Back to Store
          </Link>
          {isTelegramClient && <button type="button" onClick={close} className="mt-3 w-full rounded-2xl border border-slate-200 py-3.5 text-sm font-semibold text-slate-600">Close</button>}
        </div>
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
    <div className="customer-flow-theme min-h-screen bg-slate-50 pb-12 text-slate-900" style={themeVariables}>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 flex items-center">
          <Link to={storePath(slug, "/cart")} className="flex items-center gap-2 text-sm font-medium hover:text-slate-900">
            <ArrowLeft size={18} />
            Back to Cart
          </Link>
          <strong className="ml-auto text-lg">{store.business.name}</strong>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Checkout</h1>
          <p className="mt-2 text-slate-600">Please fill in your details to complete the order</p>
        </div>

        <ErrorMessage error={error} />

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <form ref={formRef} onSubmit={submit} className="space-y-8">
              {/* Customer Info */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Customer Information</h2>
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
                  <Field
                    name="city"
                    label="City"
                    autoComplete="address-level2"
                    maxLength={255}
                    value={form.city}
                    onChange={(v) => change("city", v)}
                  />
                  
                  <div className="sm:col-span-2">
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
                  </div>

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
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-5">Payment Method</h2>
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
                className={`${isTelegramClient ? "hidden" : "block"} w-full rounded-2xl py-4 text-lg font-semibold text-white disabled:opacity-70 transition`}
                style={{ backgroundColor: primary }}
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-6">Order Summary</h2>

              <div className="space-y-5">
                {items.map(({ line_id, product, quantity, modifiers, unit_price }) => (
                  <div key={line_id} className="flex gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                      {product.thumbnail && (
                        <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-2 font-medium">{product.name}</p>
                      {modifiers.length > 0 && <p className="mt-0.5 text-xs leading-5 text-slate-500">{modifiers.map((option) => option.name).join(", ")}</p>}
                      <p className="text-sm text-slate-500 mt-0.5">Qty: {quantity}</p>
                    </div>
                    <p className="font-semibold whitespace-nowrap">
                      ${(unit_price * quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="my-6 border-t border-slate-200" />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                Final amount will be confirmed by the seller after order review.
              </p>
            </div>
          </div>
        </div>
      </main>
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
      className={`flex w-full gap-4 rounded-2xl border p-5 text-left transition-all ${
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
