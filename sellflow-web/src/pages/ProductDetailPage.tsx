import { useEffect, useState, type CSSProperties } from "react";
import { ArrowLeft, Check, Minus, Plus, ShoppingBag, Store } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { storefrontService, type StorefrontProductDetail } from "../Services/storefront";
import { useCart } from "../components/cart/CartContext";
import { useToast } from "../components/ui/ToastContext";

export function ProductDetailPage() {
  const { slug = "", productSlug = "" } = useParams();
  const [detail, setDetail] = useState<StorefrontProductDetail | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [missing, setMissing] = useState(false);
  const cart = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    setMissing(false);
    setDetail(null);
    storefrontService.getProduct(slug, productSlug)
      .then((data) => {
        setDetail(data);
        document.title = `${data.product.name} · ${data.business.name}`;
      })
      .catch(() => setMissing(true));

    return () => { document.title = "SellFlow"; };
  }, [slug, productSlug]);

  if (missing) return <ProductNotFound slug={slug} />;
  if (!detail) return <div className="grid min-h-screen place-items-center bg-slate-50"><div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600" /></div>;

  const { business, product } = detail;
  const theme = business.theme;
  const currentPrice = Number(product.discount_price || product.price);
  const regularPrice = Number(product.price);
  const fontFamily = theme.font_family === "classic"
    ? "Georgia, Cambria, serif"
    : theme.font_family === "modern"
      ? "Inter, ui-sans-serif, system-ui, sans-serif"
      : "ui-sans-serif, system-ui, sans-serif";
  const variables = {
    "--store-radius": theme.button_style === "pill" ? "999px" : theme.button_style === "square" ? "5px" : "12px",
    backgroundColor: theme.background_color,
    color: theme.text_color,
    fontFamily,
  } as CSSProperties;

  const addToCart = () => {
    cart.add(slug, product, quantity);
    showToast(`${quantity} × ${product.name} added to cart.`);
  };

  return (
    <div className="min-h-screen" style={variables}>
      <header className="sticky top-0 z-30 border-b backdrop-blur-xl" style={{ backgroundColor: `${theme.surface_color}F2`, borderColor: `${theme.muted_color}35` }}>
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link to={`/${slug}`} className="flex min-w-0 items-center gap-3">
            {business.logo ? <img src={business.logo} alt="" className="h-10 w-10 rounded-xl object-cover" /> : <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white" style={{ backgroundColor: theme.primary_color }}><Store size={20} /></span>}
            <div className="min-w-0"><p className="truncate font-bold">{business.name}</p><p className="text-xs" style={{ color: theme.muted_color }}>Back to storefront</p></div>
          </Link>
          <Link to={`/${slug}/cart`} className="ml-auto flex items-center gap-2 px-3 py-2 text-sm font-semibold" style={{ borderRadius: "var(--store-radius)", backgroundColor: `${theme.primary_color}12`, color: theme.primary_color }}>
            <ShoppingBag size={17} /><span className="hidden sm:inline">Cart</span><span className="grid h-5 min-w-5 place-items-center rounded-full px-1 text-xs text-white" style={{ backgroundColor: theme.primary_color }}>{cart.count(slug)}</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-32 pt-6 sm:px-6 sm:pb-16 sm:pt-10">
        <Link to={`/${slug}`} className="inline-flex items-center gap-2 text-sm font-semibold transition hover:opacity-70" style={{ color: theme.muted_color }}><ArrowLeft size={17} /> Continue shopping</Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
          <section className="overflow-hidden border" style={{ borderRadius: theme.button_style === "square" ? "8px" : "24px", borderColor: `${theme.muted_color}35`, backgroundColor: `${theme.muted_color}0D` }}>
            <div className="aspect-square">
              {product.thumbnail ? <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center" style={{ color: `${theme.muted_color}80` }}><ShoppingBag className="h-20 w-20" strokeWidth={1.25} /></div>}
            </div>
          </section>

          <section className="flex flex-col justify-center lg:py-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: `${theme.primary_color}14`, color: theme.primary_color }}>{product.category.name}</span>
              {product.is_featured && <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: `${theme.secondary_color}18`, color: theme.secondary_color }}>Featured</span>}
            </div>

            <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-5xl">{product.name}</h1>
            <div className="mt-5 flex items-end gap-3">
              <strong className="text-3xl sm:text-4xl">${currentPrice.toFixed(2)}</strong>
              {product.discount_price && <span className="pb-1 text-lg line-through" style={{ color: theme.muted_color }}>${regularPrice.toFixed(2)}</span>}
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm font-medium" style={{ color: product.stock > 0 ? "#059669" : "#DC2626" }}>
              {product.stock > 0 && <Check size={17} />}{product.stock > 0 ? `${product.stock} available` : "Currently out of stock"}
            </div>

            {product.description && <p className="mt-7 whitespace-pre-line text-base leading-7" style={{ color: theme.muted_color }}>{product.description}</p>}

            <div className="mt-9 hidden items-center gap-4 sm:flex">
              <QuantityControl quantity={quantity} stock={product.stock} setQuantity={setQuantity} color={theme.primary_color} muted={theme.muted_color} surface={theme.surface_color} />
              <button disabled={product.stock < 1} onClick={addToCart} className="flex min-h-12 flex-1 items-center justify-center gap-2 px-6 font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40" style={{ borderRadius: "var(--store-radius)", backgroundColor: theme.primary_color, boxShadow: `0 14px 28px ${theme.primary_color}30` }}><ShoppingBag size={19} /> Add to cart</button>
            </div>
          </section>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t p-3 backdrop-blur-xl sm:hidden" style={{ backgroundColor: `${theme.surface_color}F5`, borderColor: `${theme.muted_color}35` }}>
        <div className="mx-auto flex max-w-lg gap-3">
          <QuantityControl quantity={quantity} stock={product.stock} setQuantity={setQuantity} color={theme.primary_color} muted={theme.muted_color} surface={theme.surface_color} compact />
          <button disabled={product.stock < 1} onClick={addToCart} className="min-h-12 flex-1 px-4 font-bold text-white disabled:opacity-40" style={{ borderRadius: "var(--store-radius)", backgroundColor: theme.primary_color }}>{product.stock > 0 ? `Add · $${(currentPrice * quantity).toFixed(2)}` : "Out of stock"}</button>
        </div>
      </div>
    </div>
  );
}

function QuantityControl({ quantity, stock, setQuantity, color, muted, surface, compact = false }: { quantity: number; stock: number; setQuantity: (quantity: number) => void; color: string; muted: string; surface: string; compact?: boolean }) {
  return (
    <div className="flex min-h-12 items-center border" style={{ borderRadius: "var(--store-radius)", borderColor: `${muted}45`, backgroundColor: surface }}>
      <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1 || stock < 1} onClick={() => setQuantity(Math.max(1, quantity - 1))} className={`${compact ? "w-10" : "w-12"} grid h-12 place-items-center disabled:opacity-30`}><Minus size={17} /></button>
      <span className={`${compact ? "w-7" : "w-10"} text-center text-sm font-bold`} style={{ color }}>{quantity}</span>
      <button type="button" aria-label="Increase quantity" disabled={quantity >= stock || stock < 1} onClick={() => setQuantity(Math.min(stock, quantity + 1))} className={`${compact ? "w-10" : "w-12"} grid h-12 place-items-center disabled:opacity-30`}><Plus size={17} /></button>
    </div>
  );
}

function ProductNotFound({ slug }: { slug: string }) {
  return <div className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center"><div><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-slate-200 text-slate-500"><ShoppingBag size={30} /></span><h1 className="mt-5 text-2xl font-bold">Product not found</h1><p className="mt-2 text-slate-500">This product is unavailable or no longer published.</p><Link to={`/${slug}`} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white"><ArrowLeft size={17} /> Back to store</Link></div></div>;
}
