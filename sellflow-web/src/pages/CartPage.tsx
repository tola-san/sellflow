import { useEffect, useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { storefrontService, type Storefront } from "../Services/storefront";
import { useCart } from "../components/cart/CartContext";

export function CartPage() {
  const { slug = "" } = useParams();
  const [store, setStore] = useState<Storefront | null>(null);
  const [missing, setMissing] = useState(false);
  const cart = useCart();
  const items = cart.items(slug);

  useEffect(() => {
    storefrontService.getStore(slug).then(setStore).catch(() => setMissing(true));
  }, [slug]);

  if (missing) return <SimpleMessage title="Store unavailable" description="This store does not exist or is currently inactive." href="/" action="Go home"/>;
  if (!store) return <Loading/>;

  const primary = store.business.theme.primary_color;
  const subtotal = items.reduce((sum, item) => sum + Number(item.product.discount_price || item.product.price) * item.quantity, 0);

  return <div className="min-h-screen bg-slate-50 text-slate-900">
    <CommerceHeader slug={slug} name={store.business.name} primary={primary}/>
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8"><Link to={`/${slug}`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"><ArrowLeft size={16}/>Continue shopping</Link><h1 className="mt-4 text-3xl font-bold">Your cart</h1><p className="mt-1 text-sm text-slate-500">{items.length ? `${cart.count(slug)} item(s) from ${store.business.name}` : "Your cart is currently empty."}</p></div>

      {!items.length ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center"><ShoppingBag className="mx-auto text-slate-300" size={48}/><h2 className="mt-5 text-xl font-semibold">Nothing here yet</h2><p className="mt-2 text-sm text-slate-500">Browse the catalog and add products to start an order.</p><Link to={`/${slug}`} className="mt-6 inline-flex rounded-xl px-5 py-3 text-sm font-semibold text-white" style={{ backgroundColor: primary }}>Browse products</Link></div> :
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="space-y-3">{items.map(({ product, quantity }) => <article key={product.slug} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">{product.thumbnail ? <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover"/> : <span className="grid h-full place-items-center text-slate-300"><ShoppingBag/></span>}</div>
          <div className="min-w-0 flex-1"><p className="text-xs font-semibold uppercase tracking-wider" style={{ color: primary }}>{product.category.name}</p><h2 className="mt-1 truncate font-semibold">{product.name}</h2><p className="mt-1 font-bold">${Number(product.discount_price || product.price).toFixed(2)}</p>
            <div className="mt-3 flex items-center justify-between"><div className="flex items-center rounded-lg border border-slate-200"><button onClick={() => quantity === 1 ? cart.remove(slug, product.slug) : cart.update(slug, product.slug, quantity - 1)} className="p-2" aria-label="Decrease quantity"><Minus size={14}/></button><span className="w-8 text-center text-sm font-semibold">{quantity}</span><button disabled={quantity >= product.stock} onClick={() => cart.update(slug, product.slug, quantity + 1)} className="p-2 disabled:opacity-30" aria-label="Increase quantity"><Plus size={14}/></button></div><button onClick={() => cart.remove(slug, product.slug)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`Remove ${product.name}`}><Trash2 size={17}/></button></div>
          </div>
        </article>)}</section>
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6"><h2 className="font-semibold">Order summary</h2><div className="mt-5 flex justify-between text-sm text-slate-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div><div className="mt-3 flex justify-between text-sm text-slate-500"><span>Delivery</span><span>Calculated by seller</span></div><div className="my-5 border-t border-slate-200"/><div className="flex justify-between text-lg font-bold"><span>Total</span><span>${subtotal.toFixed(2)}</span></div><Link to={`/${slug}/checkout`} className="mt-5 flex w-full justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white" style={{ backgroundColor: primary }}>Continue to checkout</Link><p className="mt-3 text-center text-xs leading-5 text-slate-400">Final prices and stock are verified securely by the store.</p></aside>
      </div>}
    </main>
  </div>;
}

function CommerceHeader({ slug, name, primary }: { slug: string; name: string; primary: string }) { return <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6"><Link to={`/${slug}`} className="font-bold">{name}</Link><span className="ml-auto grid h-9 w-9 place-items-center rounded-xl text-white" style={{ backgroundColor: primary }}><ShoppingBag size={18}/></span></div></header>; }
function Loading() { return <div className="grid min-h-screen place-items-center bg-slate-50"><div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600"/></div>; }
function SimpleMessage({ title, description, href, action }: { title: string; description: string; href: string; action: string }) { return <div className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center"><div><h1 className="text-2xl font-bold">{title}</h1><p className="mt-2 text-slate-500">{description}</p><Link to={href} className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">{action}</Link></div></div>; }
