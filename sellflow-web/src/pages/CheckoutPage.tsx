import { useEffect, useState } from "react";
import { ArrowLeft, BadgeCheck, Banknote, Landmark, ShoppingBag } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { checkoutService, type CheckoutPayload, type PublicOrder } from "../Services/checkout";
import { storefrontService, type Storefront } from "../Services/storefront";
import { useCart } from "../components/cart/CartContext";
import { ErrorMessage, inputClass } from "../components/dashboard/DashboardUI";

const initialForm: Omit<CheckoutPayload, "items"> = { customer_name: "", customer_phone: "", customer_email: "", delivery_address: "", city: "", notes: "", payment_method: "cash" };

export function CheckoutPage() {
  const { slug = "" } = useParams();
  const [store, setStore] = useState<Storefront | null>(null);
  const [form, setForm] = useState(initialForm);
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [submitting, setSubmitting] = useState(false);
  const cart = useCart();
  const items = cart.items(slug);

  useEffect(() => { storefrontService.getStore(slug).then(setStore).catch(setError); }, [slug]);
  const change = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setSubmitting(true); setError(null);
    try {
      const created = await checkoutService.createOrder(slug, { ...form, items: items.map((item) => ({ product_slug: item.product.slug, quantity: item.quantity })) });
      setOrder(created); cart.clear(slug); window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) { setError(err); } finally { setSubmitting(false); }
  };

  if (!store) return <div className="grid min-h-screen place-items-center bg-slate-50"><div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600"/></div>;
  const primary = store.business.theme.primary_color;
  const subtotal = items.reduce((sum, item) => sum + Number(item.product.discount_price || item.product.price) * item.quantity, 0);

  if (order) return <div className="grid min-h-screen place-items-center bg-slate-50 p-5"><div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-xl"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600"><BadgeCheck size={32}/></span><h1 className="mt-5 text-2xl font-bold">Order received</h1><p className="mt-2 text-sm text-slate-500">Thank you, {order.customer_name}. The seller will contact you to confirm the order.</p><div className="mt-6 rounded-lg bg-slate-50 p-4 text-left"><p className="text-xs uppercase tracking-wider text-slate-400">Order number</p><p className="mt-1 font-mono text-lg font-bold">{order.order_number}</p><div className="mt-4 flex justify-between text-sm"><span>Total</span><strong>${Number(order.total).toFixed(2)}</strong></div><div className="mt-2 flex justify-between text-sm"><span>Status</span><span className="capitalize text-amber-600">{order.status}</span></div></div><Link to={`/${slug}`} className="mt-6 inline-flex rounded-xl px-5 py-3 text-sm font-semibold text-white" style={{ backgroundColor: primary }}>Back to store</Link></div></div>;

  if (!items.length) return <div className="grid min-h-screen place-items-center bg-slate-50 p-5 text-center"><div><ShoppingBag className="mx-auto text-slate-300" size={48}/><h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1><Link to={`/${slug}`} className="mt-6 inline-flex rounded-xl px-5 py-3 text-sm font-semibold text-white" style={{ backgroundColor: primary }}>Browse products</Link></div></div>;

  return <div className="min-h-screen bg-slate-50"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6"><Link to={`/${slug}/cart`} className="inline-flex items-center gap-2 text-sm"><ArrowLeft size={16}/>Back to cart</Link><strong className="ml-auto">{store.business.name}</strong></div></header><main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12"><div className="mb-8"><h1 className="text-3xl font-bold">Checkout</h1><p className="mt-1 text-sm text-slate-500">Enter your details to place the order.</p></div><ErrorMessage error={error}/><div className="grid gap-6 lg:grid-cols-[1fr_360px]"><form onSubmit={submit} className="space-y-6"><section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-semibold">Customer information</h2><div className="mt-5 grid gap-5 sm:grid-cols-2"><Field label="Full name" required value={form.customer_name} onChange={(v)=>change("customer_name",v)}/><Field label="Phone number" required value={form.customer_phone} onChange={(v)=>change("customer_phone",v)}/><Field label="Email" type="email" value={form.customer_email || ""} onChange={(v)=>change("customer_email",v)}/><Field label="City" value={form.city || ""} onChange={(v)=>change("city",v)}/><label className="text-sm font-medium sm:col-span-2">Delivery address<textarea required rows={3} className={inputClass} value={form.delivery_address} onChange={(e)=>change("delivery_address",e.target.value)}/></label><label className="text-sm font-medium sm:col-span-2">Order notes<textarea rows={3} className={inputClass} value={form.notes || ""} onChange={(e)=>change("notes",e.target.value)}/></label></div></section><section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="font-semibold">Payment method</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><PaymentOption active={form.payment_method === "cash"} onClick={()=>setForm(v=>({...v,payment_method:"cash"}))} icon={<Banknote/>} title="Cash" description="Pay when the seller confirms delivery."/><PaymentOption active={form.payment_method === "bakong"} onClick={()=>setForm(v=>({...v,payment_method:"bakong"}))} icon={<Landmark/>} title="Bakong" description="Seller will provide payment instructions."/></div></section><button disabled={submitting} className="w-full rounded-xl px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-60" style={{ backgroundColor: primary }}>{submitting ? "Placing order..." : "Place order"}</button></form><aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6"><h2 className="font-semibold">Your order</h2><div className="mt-5 space-y-4">{items.map(({product,quantity})=><div key={product.slug} className="flex gap-3"><div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">{product.thumbnail&&<img src={product.thumbnail} alt="" className="h-full w-full object-cover"/>}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{product.name}</p><p className="text-xs text-slate-500">Qty {quantity}</p></div><span className="text-sm font-semibold">${(Number(product.discount_price || product.price)*quantity).toFixed(2)}</span></div>)}</div><div className="my-5 border-t border-slate-200"/><div className="flex justify-between font-bold"><span>Total</span><span>${subtotal.toFixed(2)}</span></div><p className="mt-3 text-xs leading-5 text-slate-400">The API recalculates this total using current product prices before creating the order.</p></aside></div></main></div>;
}

function Field({label,value,onChange,type="text",required=false}:{label:string;value:string;onChange:(value:string)=>void;type?:string;required?:boolean}) { return <label className="text-sm font-medium">{label}<input required={required} type={type} value={value} onChange={(e)=>onChange(e.target.value)} className={inputClass}/></label>; }
function PaymentOption({active,onClick,icon,title,description}:{active:boolean;onClick:()=>void;icon:React.ReactNode;title:string;description:string}) { return <button type="button" onClick={onClick} className={`flex gap-3 rounded-xl border p-4 text-left transition ${active ? "border-purple-500 bg-purple-50 ring-2 ring-purple-100" : "border-slate-200 hover:border-slate-300"}`}><span className={active?"text-purple-600":"text-slate-400"}>{icon}</span><span><strong className="block text-sm">{title}</strong><span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span></span></button>; }
