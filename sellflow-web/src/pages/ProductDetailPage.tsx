import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowLeft, Check, Copy, Globe2, Minus, Plus, RefreshCw, Send, Share2, Shield, ShoppingCart, Store, Truck, X } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { storefrontService, type StorefrontProductDetail } from "../Services/storefront";
import { useCart } from "../components/cart/CartContext";
import { useToast } from "../components/ui/ToastContext";
import { useTelegramMiniApp } from "../components/telegram/TelegramMiniAppContext";
import { resolveCustomerTheme, useCustomerTheme } from "../theme/useCustomerTheme";

export function ProductDetailPage() {
  const { slug = "", productSlug = "" } = useParams();
  const [detail, setDetail] = useState<StorefrontProductDetail | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [missing, setMissing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const cart = useCart();
  const { showToast } = useToast();
  const { hapticImpact, storePath } = useTelegramMiniApp();
  const { selection: customerTheme } = useCustomerTheme(slug);

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

  useEffect(() => {
    if (!shareOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShareOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [shareOpen]);

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
  const theme = resolveCustomerTheme(business.theme, customerTheme);
  const currentPrice = Number(product.discount_price || product.price);
  const regularPrice = Number(product.price);
  const discountPercent = product.discount_price 
    ? Math.round(((regularPrice - currentPrice) / regularPrice) * 100)
    : 0;
  
  // Enhanced font family support with Khmer (Kantumruy Pro)
  const fontFamily = theme.font_family === "classic"
    ? "'Kantumruy Pro', Georgia, Cambria, serif"
    : theme.font_family === "modern"
      ? "'Kantumruy Pro', Inter, ui-sans-serif, system-ui, sans-serif"
      : "'Kantumruy Pro', ui-sans-serif, system-ui, sans-serif";

  const variables = {
    "--store-radius": theme.button_style === "pill" ? "9999px" : theme.button_style === "square" ? "6px" : "16px",
    "--store-radius-sm": theme.button_style === "pill" ? "9999px" : theme.button_style === "square" ? "4px" : "12px",
    backgroundColor: theme.background_color,
    color: theme.text_color,
    fontFamily,
  } as CSSProperties;

  const addToCart = () => {
    cart.add(slug, product, quantity);
    hapticImpact();
    showToast(`${quantity} × ${product.name} added to cart.`, "success");
  };

  const shareProduct = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on ${business.name}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareOpen(false);
        return;
      }

      await navigator.clipboard.writeText(shareData.url);
      showToast("Product link copied.", "success");
      setShareOpen(false);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      showToast("The product link could not be shared.", "error");
    }
  };

  const copyProductLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Product link copied.", "success");
      setShareOpen(false);
    } catch {
      showToast("The product link could not be copied.", "error");
    }
  };

  const openSocialShare = (network: "facebook" | "telegram" | "whatsapp") => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${product.name} on ${business.name}`);
    const destinations = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };

    window.open(destinations[network], "_blank", "noopener,noreferrer,width=680,height=620");
    setShareOpen(false);
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
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 sm:gap-4 sm:px-6 lg:px-8">
          <Link 
            to={storePath(slug)}
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

          <Link 
            to={storePath(slug, "/cart")}
            className="relative flex shrink-0 items-center gap-2 px-3 py-2 text-sm font-semibold transition-all hover:scale-105 active:scale-95 sm:px-4"
            style={{ 
              borderRadius: "var(--store-radius)", 
              backgroundColor: `${theme.primary_color}12`, 
              color: theme.primary_color 
            }}
          >
            <ShoppingCart className="shrink-0" size={18} />
            <span>Cart</span>
            <div className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1.5 text-xs font-bold shadow-md transition-all" style={{ color: theme.primary_color }}>
              {cart.count(slug)}
            </div>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex min-w-0 items-center gap-2 overflow-hidden text-sm" aria-label="Breadcrumb" style={{ color: theme.muted_color }}>
          <Link to={storePath(slug)} className="shrink-0 transition hover:opacity-70">Home</Link>
          <span className="shrink-0 opacity-40">/</span>
          <Link to={storePath(slug)} className="max-w-[42%] truncate transition hover:opacity-70 sm:max-w-none">{business.name}</Link>
          <span className="shrink-0 opacity-40">/</span>
          <span className="min-w-0 truncate font-medium" style={{ color: theme.text_color }}>{product.name}</span>
        </nav>

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 xl:gap-20">
          <section className="lg:sticky lg:top-24" aria-label="Product image">
            <div
              className="group relative mx-auto w-full max-w-[540px] overflow-hidden border p-2 shadow-[0_14px_40px_rgba(15,23,42,0.07)] sm:p-3 lg:max-w-none"
              style={{
                borderRadius: theme.button_style === "square" ? "8px" : "20px",
                borderColor: `${theme.muted_color}24`,
                backgroundColor: theme.surface_color,
              }}
            >
              <div
                className="relative grid h-[min(78vw,380px)] place-items-center overflow-hidden sm:h-[460px] lg:h-[min(44vw,540px)]"
                style={{
                  borderRadius: theme.button_style === "square" ? "5px" : "14px",
                  backgroundColor: `${theme.muted_color}08`,
                }}
              >
                {product.thumbnail ? (
                  <>
                    {!imageLoaded && <div className="absolute inset-0 animate-pulse" style={{ backgroundColor: `${theme.muted_color}12` }} />}
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className={`h-full w-full object-contain transition duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                      onLoad={() => setImageLoaded(true)}
                    />
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3" style={{ color: `${theme.muted_color}70` }}>
                    <ShoppingCart size={72} strokeWidth={1.25} />
                    <span className="text-sm font-medium">No product image</span>
                  </div>
                )}
              </div>

              {product.discount_price && (
                <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg sm:left-5 sm:top-5">
                  Save {discountPercent}%
                </span>
              )}
            </div>
          </section>

          {/* Product Info */}
          <section className="flex flex-col pb-32 md:pb-0">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.5px] transition-all" style={{ backgroundColor: `${theme.primary_color}12`, color: theme.primary_color }}>
                {product.category.name}
              </span>
              {product.is_featured && (
                <span className="rounded-full px-4 py-1.5 text-xs font-bold animate-pulse-glow" style={{ backgroundColor: `${theme.secondary_color}18`, color: theme.secondary_color }}>
                  ✨ Featured
                </span>
              )}
              <button
                type="button"
                onClick={() => setShareOpen(true)}
                className="ml-auto flex items-center gap-2 border px-3.5 py-1.5 bg-zinc-100 text-xs font-semibold transition hover:-translate-y-0.5 hover:shadow-sm active:scale-95"
                style={{ borderRadius: "var(--store-radius)", borderColor: `${theme.muted_color}30`, color: theme.muted_color }}
                aria-haspopup="dialog"
                aria-expanded={shareOpen}
              >
                <Share2 size={15} /> Share
              </button>
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
            <div className="hidden md:block mt-auto pt-8">
              <div className="flex items-center gap-4 rounded-2xl" style={{
                // border: `1px solid ${theme.muted_color}20`,
                // backgroundColor: `${theme.surface_color}F5`
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
                  className="group relative flex h-14 flex-1 items-center justify-center gap-3 rounded-3xl px-6 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-2xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor: theme.primary_color,
                    boxShadow: `0 8px 25px -5px ${theme.primary_color}50`,
                  }}
                >
                  <ShoppingCart size={20} className="transition-transform group-hover:scale-110" />
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
      <div className="fixed inset-x-0 bottom-0 z-50 block md:hidden animate-slide-up" style={{
        background: `linear-gradient(to top, ${theme.surface_color}FF, ${theme.surface_color}F2 60%)`,
        paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
        boxShadow: `0 -4px 20px ${theme.muted_color}15`,
        borderTop: `1px solid ${theme.muted_color}15`,
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
            className="
              group
              relative
              flex-1
              min-h-12
              sm:min-h-11
              rounded-full
              px-6
              py-3
              sm:px-5
              font-semibold
              text-white
              shadow-lg
              transition-all
              duration-200
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-50
              overflow-hidden
            "
            style={{
              backgroundColor: theme.primary_color,
              boxShadow: `0 10px 24px -8px ${theme.primary_color}40`,
            }}
          >
          <span className="flex items-center justify-center gap-2 whitespace-nowrap">
            <ShoppingCart
              size={16}
              strokeWidth={2.2}
              className="shrink-0"
            />
            <span className="text-sm sm:text-base">
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </span>
          </span>
        </button>
          </div>
        </div>
      </div>

      {shareOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6" role="presentation">
          <button type="button" className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" onClick={() => setShareOpen(false)} aria-label="Close share options" />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-product-title"
            className="relative z-10 w-full max-w-md rounded-t-3xl border p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl sm:p-6"
            style={{ backgroundColor: theme.surface_color, borderColor: `${theme.muted_color}25` }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full sm:hidden" style={{ backgroundColor: `${theme.muted_color}35` }} />
            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <h2 id="share-product-title" className="text-lg font-bold">Share this product</h2>
                <p className="mt-1 truncate text-sm" style={{ color: theme.muted_color }}>{product.name}</p>
              </div>
              <button type="button" onClick={() => setShareOpen(false)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition hover:bg-black/5" aria-label="Close"><X size={18} /></button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <ShareOption label="Facebook" color="#1877F2" icon={<FaFacebook size={20} />} onClick={() => openSocialShare("facebook")} />
              <ShareOption label="Telegram" color="#229ED9" icon={<Send size={20} />} onClick={() => openSocialShare("telegram")} />
              {typeof navigator !== "undefined" && navigator.share && <ShareOption label="More apps" color={theme.primary_color} icon={<Share2 size={20} />} onClick={shareProduct} />}
            </div>

            <button type="button" onClick={copyProductLink} className="mt-4 flex w-full items-center justify-center gap-2 border px-4 py-3 text-sm font-semibold transition hover:bg-black/[0.03]" style={{ borderRadius: "var(--store-radius-sm)", borderColor: `${theme.muted_color}30` }}>
              <Copy size={17} /> Copy product link
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

function ShareOption({ label, color, icon, onClick }: { label: string; color: string; icon: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex min-h-14 items-center gap-3 rounded-2xl border px-3 text-left text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]" style={{ borderColor: `${color}25`, backgroundColor: `${color}0D` }}>
      <span className="grid h-9 w-9 shrink-0 place-items-center  rounded-full text-white" style={{ backgroundColor: color }}>{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}

// Quantity Control Component
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

// Product Not Found Component
function ProductNotFound({ slug }: { slug: string }) {
  const { storePath } = useTelegramMiniApp();
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-12 text-center">
      <div className="animate-fade-in-up">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-3xl bg-slate-200/50 shadow-lg">
          <ShoppingCart size={48} className="text-slate-400" strokeWidth={1.5} />
        </div>
        <h1 className="mt-8 text-4xl font-bold tracking-tight">Product not found</h1>
        <p className="mx-auto mt-3 max-w-sm text-slate-600">
          Sorry, this product may have been removed or is currently unavailable.
        </p>
        <Link 
          to={storePath(slug)}
          className="group mt-10 inline-flex items-center gap-3 rounded-xl bg-zinc-900 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-black hover:scale-105 active:scale-95 shadow-xl"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" /> 
          Back to Store
        </Link>
      </div>
    </div>
  );
}
