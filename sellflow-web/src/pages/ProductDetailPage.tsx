import { useEffect, useState, type CSSProperties } from "react";
import { ArrowLeft, Check, Minus, Plus, ShoppingBag, Store, Heart, Share2, Truck, Shield, RefreshCw } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { storefrontService, type StorefrontProductDetail } from "../Services/storefront";
import { useCart } from "../components/cart/CartContext";
import { useToast } from "../components/ui/ToastContext";

export function ProductDetailPage() {
  const { slug = "", productSlug = "" } = useParams();
  const [detail, setDetail] = useState<StorefrontProductDetail | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [missing, setMissing] = useState(false);
  const [liked, setLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cart = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    setMissing(false);
    setDetail(null);
    setImageLoaded(false);
    storefrontService.getProduct(slug, productSlug)
      .then((data) => {
        setDetail(data);
        document.title = `${data.product.name} · ${data.business.name}`;
      })
      .catch(() => setMissing(true));

    return () => { document.title = "SellFlow"; };
  }, [slug, productSlug]);

  if (missing) return <ProductNotFound slug={slug} />;
  if (!detail) return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600" />
        <div className="absolute inset-0 h-16 w-16 animate-pulse rounded-full border-4 border-transparent border-t-purple-300/30" />
      </div>
    </div>
  );

  const { business, product } = detail;
  const theme = business.theme;
  const currentPrice = Number(product.discount_price || product.price);
  const regularPrice = Number(product.price);
  const discountPercent = product.discount_price 
    ? Math.round(((regularPrice - currentPrice) / regularPrice) * 100)
    : 0;
  const fontFamily = theme.font_family === "classic"
    ? "Georgia, Cambria, serif"
    : theme.font_family === "modern"
      ? "Inter, ui-sans-serif, system-ui, sans-serif"
      : "ui-sans-serif, system-ui, sans-serif";

  const variables = {
    "--store-radius": theme.button_style === "pill" ? "9999px" : theme.button_style === "square" ? "6px" : "16px",
    backgroundColor: theme.background_color,
    color: theme.text_color,
    fontFamily,
  } as CSSProperties;

  const addToCart = () => {
    cart.add(slug, product, quantity);
    showToast(`${quantity} × ${product.name} added to cart.`, "success");
  };

  const isOutOfStock = product.stock < 1;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="min-h-screen overflow-x-hidden" style={variables}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b backdrop-blur-2xl transition-all duration-300" style={{ 
        backgroundColor: `${theme.surface_color}F2`, 
        borderColor: `${theme.muted_color}30` 
      }}>
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link 
            to={`/${slug}`} 
            className="group flex min-w-0 flex-1 items-center gap-3 transition-all hover:opacity-80"
          >
            {business.logo ? (
              <img src={business.logo} alt={business.name} className="h-9 w-9 rounded-xl object-cover shadow-sm ring-2 ring-white/50 transition-transform group-hover:scale-105" />
            ) : (
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white shadow-sm" style={{ backgroundColor: theme.primary_color }}>
                <Store size={20} />
              </div>
            )}
            <div className="min-w-0 truncate">
              <p className="font-semibold tracking-tight">{business.name}</p>
              <p className="text-[10px] -mt-0.5 opacity-60 group-hover:opacity-80 transition-opacity">Back to shop</p>
            </div>
          </Link>

          <button 
            onClick={() => {
              // Share functionality
              if (navigator.share) {
                navigator.share({
                  title: product.name,
                  text: `Check out ${product.name} on ${business.name}`,
                  url: window.location.href,
                });
              }
            }}
            className="hidden sm:flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105 active:scale-95"
            style={{ 
              borderRadius: "var(--store-radius)", 
              backgroundColor: `${theme.muted_color}10`, 
              color: theme.muted_color 
            }}
          >
            <Share2 size={18} />
            <span>Share</span>
          </button>

          <Link 
            to={`/${slug}/cart`} 
            className="relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
            style={{ 
              borderRadius: "var(--store-radius)", 
              backgroundColor: `${theme.primary_color}12`, 
              color: theme.primary_color 
            }}
          >
            <ShoppingBag size={18} />
            <span className="hidden sm:inline">Cart</span>
            <div className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1.5 text-xs font-bold shadow-md transition-all" style={{ color: theme.primary_color }}>
              {cart.count(slug)}
            </div>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-32 pt-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm" style={{ color: theme.muted_color }}>
          <Link to={`/${slug}`} className="transition hover:opacity-70">Home</Link>
          <span>/</span>
          <Link to={`/${slug}`} className="transition hover:opacity-70">{business.name}</Link>
          <span>/</span>
          <span className="font-medium" style={{ color: theme.text_color }}>{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image Section */}
          <div className="relative">
            <div className="group relative overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl" style={{ 
              borderRadius: "var(--store-radius)", 
              backgroundColor: `${theme.muted_color}08`,
              border: `1px solid ${theme.muted_color}15` 
            }}>
              <div className="aspect-[4/3] lg:aspect-square">
                {product.thumbnail ? (
                  <>
                    {!imageLoaded && (
                      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-200/50 to-slate-300/50" />
                    )}
                    <img 
                      src={product.thumbnail} 
                      alt={product.name} 
                      className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => setImageLoaded(true)}
                    />
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center" style={{ color: `${theme.muted_color}40` }}>
                    <ShoppingBag size={80} strokeWidth={1.2} />
                  </div>
                )}
              </div>

              {/* Discount Badge */}
              {product.discount_price && (
                <div className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg animate-bounce-in">
                  -{discountPercent}%
                </div>
              )}

              {/* <button
                onClick={() => setLiked(!liked)}
                className={`absolute right-4 top-4 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 ${
                  liked ? 'scale-110' : ''
                }`}
              >
                <Heart size={20} className={`transition-all duration-300 ${liked ? "fill-red-500 text-red-500" : "text-slate-600"}`} />
              </button> */}
            </div>

            {/* Thumbnail Navigation */}
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {[product.thumbnail, product.thumbnail, product.thumbnail].slice(0, 3).map((img, idx) => (
                <button
                  key={idx}
                  className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all hover:scale-105 ${
                    idx === 0 ? 'border-2' : 'border-transparent'
                  }`}
                  style={{ borderColor: idx === 0 ? theme.primary_color : `${theme.muted_color}30` }}
                >
                  <img src={img || product.thumbnail} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <section className="flex flex-col">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.5px] transition-all" style={{ backgroundColor: `${theme.primary_color}12`, color: theme.primary_color }}>
                {product.category.name}
              </span>
              {product.is_featured && (
                <span className="rounded-full px-4 py-1.5 text-xs font-bold animate-pulse-glow" style={{ backgroundColor: `${theme.secondary_color}18`, color: theme.secondary_color }}>
                  ✨ Featured
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-4">
              <div className="text-4xl font-bold tracking-tight" style={{ color: theme.primary_color }}>
                ${currentPrice.toFixed(2)}
              </div>
              {product.discount_price && (
                <div className="text-xl line-through opacity-50">${regularPrice.toFixed(2)}</div>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-3 flex items-center gap-2 text-sm">
              {isOutOfStock ? (
                <span className="flex items-center gap-1.5 text-red-500">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
                  </span>
                  Out of stock
                </span>
              ) : isLowStock ? (
                <span className="flex items-center gap-1.5 text-amber-500">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                  </span>
                  Only {product.stock} left in stock
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-emerald-500">
                  <Check size={18} className="text-emerald-500" />
                  In stock • {product.stock} available
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-6 text-[15px] leading-relaxed" style={{ color: theme.muted_color }}>
                {product.description}
              </div>
            )}

            {/* Desktop Add to Cart */}
            <div className="mt-auto hidden pt-8 md:block">
              <div className="flex items-center gap-4 rounded-xl p-4 shadow-sm" style={{ 
                border: `1px solid ${theme.muted_color}20`,
                backgroundColor: `${theme.surface_color}F5`
              }}>
                <QuantityControl
                  quantity={quantity}
                  stock={product.stock}
                  setQuantity={setQuantity}
                  color={theme.primary_color}
                  muted={theme.muted_color}
                  surface={theme.surface_color}
                />

                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider opacity-50">Total</p>
                  <p className="text-2xl font-bold tracking-tight" style={{ color: theme.primary_color }}>
                    ${(currentPrice * quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  disabled={isOutOfStock}
                  onClick={addToCart}
                  className="group relative flex h-14 flex-1 items-center justify-center gap-3 rounded-xl px-6 font-semibold text-white shadow-md  transition-all hover:-translate-y-0.5 hover:shadow-2xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor: theme.primary_color,
                    boxShadow: `0 8px 25px -5px ${theme.primary_color}50`,
                  }}
                >
                  <ShoppingBag size={20} className="transition-transform group-hover:scale-110" />
                  <span>{isOutOfStock ? "Out of stock" : "Add to cart"}</span>
                </button>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-sm" style={{ color: theme.muted_color }}>
              <div className="flex flex-col items-center gap-2 rounded-xl p-3 transition-all hover:bg-white/50" style={{ backgroundColor: `${theme.surface_color}80` }}>
                <Truck size={20} className="opacity-60" />
                <span className="text-center text-xs font-medium">Free shipping</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-xl p-3 transition-all hover:bg-white/50" style={{ backgroundColor: `${theme.surface_color}80` }}>
                <Shield size={20} className="opacity-60" />
                <span className="text-center text-xs font-medium">Secure checkout</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-xl p-3 transition-all hover:bg-white/50" style={{ backgroundColor: `${theme.surface_color}80` }}>
                <RefreshCw size={20} className="opacity-60" />
                <span className="text-center text-xs font-medium">Easy returns</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Mobile Floating Bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 md:hidden animate-slide-up" style={{
        background: `linear-gradient(to top, ${theme.surface_color}FF, ${theme.surface_color}F2 60%)`,
        paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
      }}>
        <div className="mx-auto max-w-2xl px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs font-medium opacity-60">
                <span>{quantity} item{quantity > 1 ? 's' : ''}</span>
                {isLowStock && !isOutOfStock && (
                  <span className="text-amber-500">• Only {product.stock} left</span>
                )}
              </div>
              <p className="text-2xl font-bold tracking-tight" style={{ color: theme.primary_color }}>
                ${(currentPrice * quantity).toFixed(2)}
              </p>
            </div>

            <QuantityControl
              quantity={quantity}
              stock={product.stock}
              setQuantity={setQuantity}
              color={theme.primary_color}
              muted={theme.muted_color}
              surface={theme.surface_color}
              compact
            />

            <button
              disabled={isOutOfStock}
              onClick={addToCart}
              className="group relative h-14 min-w-[120px] flex-1 rounded-xl font-semibold text-white shadow-xl transition-all active:scale-95 disabled:opacity-50"
              style={{
                backgroundColor: theme.primary_color,
                boxShadow: `0 10px 20px -5px ${theme.primary_color}40`,
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <ShoppingBag size={18} className="transition-transform group-hover:scale-110" />
                {isOutOfStock ? "Out of stock" : "Add"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuantityControl({
  quantity,
  stock,
  setQuantity,
  color,
  muted,
  surface,
  compact = false
}: {
  quantity: number;
  stock: number;
  setQuantity: (quantity: number) => void;
  color: string;
  muted: string;
  surface: string;
  compact?: boolean;
}) {
  const isOutOfStock = stock < 1;

  return (
    <div 
      className={`flex items-center border shadow-sm transition-all ${compact ? "h-11" : "h-14"}`}
      style={{ 
        borderRadius: "var(--store-radius)", 
        borderColor: `${muted}25`, 
        backgroundColor: surface 
      }}
    >
      <button
        type="button"
        disabled={quantity <= 1 || isOutOfStock}
        className="h-full w-10 flex items-center justify-center rounded-l-[var(--store-radius)] transition-all hover:bg-white/50 active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent"
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
      >
        <Minus size={compact ? 16 : 18} />
      </button>

      <div className={`min-w-[2.5rem] text-center font-semibold tabular-nums select-none ${compact ? "text-base" : "text-lg"}`} style={{ color }}>
        {quantity}
      </div>

      <button
        type="button"
        disabled={quantity >= stock || isOutOfStock}
        className="h-full w-10 flex items-center justify-center rounded-r-[var(--store-radius)] transition-all hover:bg-white/50 active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent"
        onClick={() => setQuantity(Math.min(stock, quantity + 1))}
      >
        <Plus size={compact ? 16 : 18} />
      </button>
    </div>
  );
}

function ProductNotFound({ slug }: { slug: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-12 text-center">
      <div className="animate-fade-in-up">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-3xl bg-slate-200/50 shadow-lg">
          <ShoppingBag size={48} className="text-slate-400" strokeWidth={1.5} />
        </div>
        <h1 className="mt-8 text-4xl font-bold tracking-tight">Product not found</h1>
        <p className="mx-auto mt-3 max-w-sm text-slate-600">
          Sorry, this product may have been removed or is currently unavailable.
        </p>
        <Link 
          to={`/${slug}`} 
          className="group mt-10 inline-flex items-center gap-3 rounded-xl bg-zinc-900 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-black hover:scale-105 active:scale-95 shadow-xl"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" /> 
          Back to Store
        </Link>
      </div>
    </div>
  );
}