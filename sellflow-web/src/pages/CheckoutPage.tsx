import { useEffect, useState } from "react";
import { ArrowLeft, BadgeCheck, Banknote, Landmark, ShoppingBag } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { checkoutService, type CheckoutPayload, type PublicOrder } from "../Services/checkout";
import { storefrontService, type Storefront } from "../Services/storefront";
import { useCart } from "../components/cart/CartContext";
import { ErrorMessage, inputClass } from "../components/dashboard/DashboardUI";

const initialForm: Omit<CheckoutPayload, "items"> = {
  customer_name: "",
  customer_phone: "",
  customer_email: "",
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

  const cart = useCart();
  const items = cart.items(slug);

  const primary = store?.business?.theme?.primary_color || "#3b82f6";
  const subtotal = items.reduce((sum, item) => 
    sum + Number(item.product.discount_price || item.product.price) * item.quantity, 0
  );

  useEffect(() => {
    if (!slug) return;
    storefrontService.getStore(slug).then(setStore).catch(setError);
  }, [slug]);

  const change = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload: CheckoutPayload = {
        ...form,
        items: items.map(item => ({
          product_slug: item.product.slug,
          quantity: item.quantity
        }))
      };

      const created = await checkoutService.createOrder(slug, payload);
      setOrder(created);
      cart.clear(slug);
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-5">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600">
            <BadgeCheck size={48} />
          </div>
          <h1 className="mt-6 text-3xl font-bold">Order Received</h1>
          <p className="mt-3 text-slate-600">Thank you, <strong>{order.customer_name}</strong>!</p>
          <p className="mt-1 text-sm text-slate-500">The seller will contact you soon to confirm.</p>

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

          <Link
            to={`/${slug}`}
            className="mt-8 block w-full rounded-2xl py-4 text-lg font-semibold text-white"
            style={{ backgroundColor: primary }}
          >
            Back to Store
          </Link>
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
      <div className="grid min-h-screen place-items-center bg-slate-50 p-5 text-center">
        <div>
          <ShoppingBag className="mx-auto text-slate-300" size={64} />
          <h1 className="mt-6 text-3xl font-bold">Cart is empty</h1>
          <Link
            to={`/${slug}`}
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
    <div className="min-h-screen bg-slate-50 pb-12">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 flex items-center">
          <Link to={`/${slug}/cart`} className="flex items-center gap-2 text-sm font-medium hover:text-slate-900">
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
            <form onSubmit={submit} className="space-y-8">
              {/* Customer Info */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Customer Information</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full Name" required value={form.customer_name} onChange={(v) => change("customer_name", v)} />
                  <Field label="Phone Number" required value={form.customer_phone} onChange={(v) => change("customer_phone", v)} />
                  <Field label="Email Address" type="email" value={form.customer_email} onChange={(v) => change("customer_email", v)} />
                  <Field label="City" value={form.city} onChange={(v) => change("city", v)} />
                  
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-2">Delivery Address <span className="text-red-500">*</span></label>
                    <textarea
                      required
                      rows={3}
                      className={inputClass}
                      value={form.delivery_address}
                      onChange={(e) => change("delivery_address", e.target.value)}
                      placeholder="Street address, building, etc."
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-2">Order Notes (Optional)</label>
                    <textarea
                      rows={3}
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
                    active={form.payment_method === "cash"}
                    onClick={() => setForm(v => ({ ...v, payment_method: "cash" }))}
                    icon={<Banknote size={26} />}
                    title="Cash on Delivery"
                    description="Pay when the seller delivers"
                  />
                  <PaymentOption
                    active={form.payment_method === "bakong"}
                    onClick={() => setForm(v => ({ ...v, payment_method: "bakong" }))}
                    icon={<Landmark size={26} />}
                    title="Bakong"
                    description="Bank transfer via Bakong"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl py-4 text-lg font-semibold text-white disabled:opacity-70 transition"
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
                {items.map(({ product, quantity }) => (
                  <div key={product.slug} className="flex gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                      {product.thumbnail && (
                        <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-2 font-medium">{product.name}</p>
                      <p className="text-sm text-slate-500 mt-0.5">Qty: {quantity}</p>
                    </div>
                    <p className="font-semibold whitespace-nowrap">
                      ${(Number(product.discount_price || product.price) * quantity).toFixed(2)}
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
  label,
  value,
  onChange,
  type = "text",
  required = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </label>
  );
}

function PaymentOption({
  active,
  onClick,
  icon,
  title,
  description
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full gap-4 rounded-2xl border p-5 text-left transition-all ${
        active 
          ? "border-purple-500 bg-purple-50 ring-2 ring-purple-100" 
          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <div className={active ? "text-purple-600" : "text-slate-400"}>{icon}</div>
      <div>
        <strong className="block">{title}</strong>
        <span className="text-sm text-slate-500 mt-1 block">{description}</span>
      </div>
    </button>
  );
}