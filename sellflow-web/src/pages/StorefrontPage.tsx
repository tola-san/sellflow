import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import axios from "axios";
import { BriefcaseBusiness, Check, ChevronDown, Download, ExternalLink, MapPin, Phone, Search, Shirt, ShoppingBag, ShoppingBasket, Smartphone, Sparkles, Store, Utensils, X } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTelegramPlane, FaTiktok } from "react-icons/fa";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { storefrontService, type PublicRestaurantTable, type Storefront } from "../Services/storefront";
import type { ThemeSettings } from "../types/theme";
import { CUSTOMER_THEMES, CUSTOMER_THEME_LABELS, findCustomerTheme, type CustomerThemeId } from "../theme/customerThemes";
import { resolveCustomerTheme, useCustomerTheme } from "../theme/useCustomerTheme";
import { useCart } from "../components/cart/CartContext";
import { useToast } from "../components/ui/ToastContext";
import { useTelegramMiniApp } from "../components/telegram/TelegramMiniAppContext";
import { withHexOpacity } from "../lib/color";
import { StoreProfileDrawer } from "../components/ui/StoreProfileDrawer";
import { ProgressiveImage } from "../components/ui/ProgressiveImage";
import { formatCurrency, type StoreCurrency } from "../lib/currency";
import type { BusinessType } from "../types/businessTypes";

export function StorefrontPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [storefront, setStorefront] = useState<Storefront | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const { selection: customerTheme, select: selectCustomerTheme } = useCustomerTheme(slug);
  const [missing, setMissing] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [restaurantTable, setRestaurantTable] = useState<PublicRestaurantTable | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const cart = useCart();
  const { showToast } = useToast();
  const { hapticImpact, isMiniAppRoute, storePath } = useTelegramMiniApp();

  const categoryButtons = useRef<Record<string, HTMLButtonElement | null>>({});
  const categoryNav = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setStorefront(null);
    setMissing(false);
    setLoadFailed(false);
    storefrontService.getStore(slug).then((data) => {
      setStorefront(data);
      document.title = `${data.business.name} · SellFlow`;
    }).catch((error: unknown) => {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setMissing(true);
        return;
      }
      setLoadFailed(true);
    });
    return () => { document.title = "SellFlow"; };
  }, [slug]);

  useEffect(() => {
    const token = searchParams.get("table");
    if (!slug) return;
    if (!token) {
      try {
        const stored = localStorage.getItem(`sellflow_restaurant_table_${slug}`);
        setRestaurantTable(stored ? JSON.parse(stored) as PublicRestaurantTable : null);
      } catch {
        localStorage.removeItem(`sellflow_restaurant_table_${slug}`);
      }
      return;
    }
    storefrontService.getTable(slug, token).then((table) => {
      setRestaurantTable(table);
      localStorage.setItem(`sellflow_restaurant_table_${slug}`, JSON.stringify(table));
      setSearchParams({}, { replace: true });
    }).catch(() => {
      localStorage.removeItem(`sellflow_restaurant_table_${slug}`);
      showToast("This table QR code is invalid or inactive.", "error");
    });
  }, [slug, searchParams, setSearchParams, showToast]);

  const products = useMemo(() => {
    if (!storefront) return [];
    const term = search.toLowerCase().trim();
    return storefront.products.filter((product) =>
      `${product.name} ${product.description || ""} ${product.category.name}`.toLowerCase().includes(term)
    );
  }, [storefront, search]);

  // Improved Scroll Spy
  useEffect(() => {
    if (!storefront) return;

    let frame: number;
    const updateActiveCategory = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const navHeight = categoryNav.current?.offsetHeight || 0;
        const threshold = navHeight + 88;

        let current = "all";
        for (const item of storefront.categories) {
          const section = document.getElementById(`category-${item.slug}`);
          if (section && section.getBoundingClientRect().top <= threshold) {
            current = item.slug;
          }
        }
        setActiveCategory(current);
      });
    };

    updateActiveCategory();
    window.addEventListener("scroll", updateActiveCategory, { passive: true });
    window.addEventListener("resize", updateActiveCategory);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveCategory);
      window.removeEventListener("resize", updateActiveCategory);
    };
  }, [storefront, products]);

  // Auto scroll active chip into view
  useEffect(() => {
    const button = categoryButtons.current[activeCategory];
    const scroller = button?.parentElement;
    if (!button || !scroller) return;

    const buttonRect = button.getBoundingClientRect();
    const scrollerRect = scroller.getBoundingClientRect();
    const isOutside = buttonRect.left < scrollerRect.left + 12
      || buttonRect.right > scrollerRect.right - 12;

    if (isOutside) {
      const left = button.offsetLeft - (scroller.clientWidth - button.offsetWidth) / 2;
      scroller.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    }
  }, [activeCategory]);

  const scrollToCategory = (categorySlug: string) => {
    setActiveCategory(categorySlug);
    const target = document.getElementById(categorySlug === "all" ? "catalog-start" : `category-${categorySlug}`);
    if (!target) return;

    const navHeight = categoryNav.current?.offsetHeight || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - (navHeight + 84);
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  const clearSearch = () => {
    setSearch("");
    searchInputRef.current?.focus();
  };

  if (missing) return <NotFound />;
  if (loadFailed) return <StoreUnavailable />;
  if (!storefront) return <div className="grid min-h-screen place-items-center bg-slate-50"><div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600" /></div>;

  const { business, categories } = storefront;
  const businessPresentation = getBusinessPresentation(business.business_type);
  const isFashionStore = business.business_type === "fashion";
  const theme = resolveCustomerTheme(business.theme, customerTheme);
  const resolvedThemeId = customerTheme === "store" ? findCustomerTheme(business.theme) : customerTheme;
  const isKhmerTheme = resolvedThemeId === "angkor" || resolvedThemeId === "krama";
  const primary = theme.primary_color;
  const cartItems = cart.items(slug);
  const cartTotal = cartItems.reduce((sum, item) => sum + Number(item.product.discount_price || item.product.price) * item.quantity, 0);
  // Uploaded branding always wins; Angkor supplies an illustrated fallback.
  const heroBanner = business.banner || (resolvedThemeId === "angkor" ? "/theme-backgrounds/angkor-default-banner-v1.webp" : null);
  const hasBannerHero = Boolean(heroBanner);
  const bannerOverlayOpacity = theme.banner_overlay_opacity ?? 35;
  const effectiveBannerOverlayOpacity = business.banner ? bannerOverlayOpacity : 18;
  
  const fontFamily = theme.font_family === "classic"
    ? "Georgia, 'Kantumruy Pro', Cambria, serif"
    : theme.font_family === "modern"
      ? "'Plus Jakarta Sans', 'Kantumruy Pro', ui-sans-serif, system-ui, sans-serif"
      : "'Plus Jakarta Sans', 'Kantumruy Pro', ui-sans-serif, system-ui, sans-serif";
  
  const themeVariables = {
    "--store-primary": theme.primary_color,
    "--store-secondary": theme.secondary_color,
    "--store-background": theme.background_color,
    "--store-surface": theme.surface_color,
    "--store-text": theme.text_color,
    "--store-muted": theme.muted_color,
    "--store-radius": theme.button_style === "pill" ? "999px" : theme.button_style === "square" ? "5px" : "12px",
    backgroundColor: theme.background_color,
    color: theme.text_color,
    fontFamily,
  } as CSSProperties;

  return (
    <div className={`min-h-screen ${isMiniAppRoute && cartItems.length ? "pb-24" : ""}`} data-customer-theme={resolvedThemeId || undefined} style={themeVariables}>
      <header className="sticky top-0 z-[60] border-b backdrop-blur-xl" style={{ backgroundColor: `${theme.surface_color}EE`, borderColor: `${theme.muted_color}28` }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setIsProfileOpen(true)}
            aria-label={`View ${business.name} information`}
            aria-haspopup="dialog"
            className="flex min-w-0 items-center gap-3 rounded-xl text-left transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ color: theme.text_color }}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full" style={{ backgroundColor: `${primary}12`, color: primary }}>
              <businessPresentation.icon size={18} />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-bold leading-tight">{business.name}</span>
              <span className="block text-[11px] font-medium" style={{ color: theme.muted_color }}>{businessPresentation.label}</span>
            </span>
          </button>
          <div className="ml-auto">
            <ThemePicker
            value={customerTheme}
            storeTheme={business.theme}
            activeTheme={theme}
            onChange={selectCustomerTheme}
            />
          </div>
          <Link to={storePath(slug, "/cart")} aria-label={`Cart with ${cart.count(slug)} items`} className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full" style={{ backgroundColor: `${primary}12`, color: primary }}><ShoppingBag size={18} /><motion.span key={cart.count(slug)} initial={{ scale: 0.65 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 520, damping: 20 }} className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border-2 px-1 text-[10px] font-bold text-white" style={{ backgroundColor: primary, borderColor: theme.surface_color }}>{cart.count(slug)}</motion.span></Link>
        </div>
      </header>

      {restaurantTable && (
        <div className="border-b border-purple-100 bg-purple-50 px-4 py-3 text-center text-sm font-medium text-purple-800">
          Dine-in ordering for <strong>{restaurantTable.name}</strong>
          {restaurantTable.area ? ` · ${restaurantTable.area}` : ""}
          <button
            className="ml-3 text-xs font-semibold underline"
            onClick={() => {
              localStorage.removeItem(`sellflow_restaurant_table_${slug}`);
              setRestaurantTable(null);
            }}
          >
            Leave table
          </button>
        </div>
      )}

      <section className={`storefront-cover-hero relative h-56 overflow-hidden sm:h-80 ${hasBannerHero ? "storefront-banner-hero" : ""} ${isKhmerTheme ? `khmer-hero khmer-hero--${resolvedThemeId}` : ""}`} style={{ background: `linear-gradient(135deg, ${theme.secondary_color}, ${theme.primary_color})` }}>
        {heroBanner && <img src={heroBanner} alt={business.banner ? `${business.name} storefront banner` : "Illustrated Cambodian countryside with Angkor temples"} className="absolute inset-0 h-full w-full object-cover" />}
        {hasBannerHero && (
          <div
            className="storefront-banner-overlay absolute inset-0"
            style={{
              background: `linear-gradient(90deg, ${withHexOpacity(theme.secondary_color, effectiveBannerOverlayOpacity)} 0%, ${withHexOpacity(theme.secondary_color, effectiveBannerOverlayOpacity * 0.66)} 45%, ${withHexOpacity(theme.primary_color, effectiveBannerOverlayOpacity * 0.36)} 100%), linear-gradient(0deg, ${withHexOpacity(theme.secondary_color, effectiveBannerOverlayOpacity * 0.28)} 0%, transparent 55%)`,
            }}
          />
        )}
        {!hasBannerHero && <div className="absolute inset-0 opacity-35" style={{ backgroundImage: "radial-gradient(circle at 78% 18%, white 0, transparent 34%), radial-gradient(circle at 15% 85%, white 0, transparent 28%)" }} />}
      </section>

      <section className="relative z-40 -mt-9 rounded-t-[2.25rem] px-4 pb-5 pt-14 shadow-[0_-12px_36px_rgba(15,23,42,0.08)] sm:-mt-12 sm:rounded-t-[3rem] sm:pb-7 sm:pt-16" style={{ backgroundColor: theme.surface_color }}>
        <button type="button" onClick={() => setIsProfileOpen(true)} className="absolute left-1/2 top-0 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[5px] shadow-xl transition hover:scale-105 sm:h-28 sm:w-28" style={{ borderColor: theme.surface_color, backgroundColor: theme.surface_color, color: primary }} aria-label={`View ${business.name} information`}>
          {business.logo ? <img src={business.logo} alt={`${business.name} logo`} className="h-full w-full rounded-full object-cover" /> : <businessPresentation.icon size={38} />}
          {resolvedThemeId === "angkor" && <img src="/theme-backgrounds/angkor-palm-hat-overlay-v1.png" alt="" aria-hidden="true" className="khmer-hat-overlay" />}
        </button>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: primary }}>{businessPresentation.eyebrow}</p>
          <h1 className="mt-1.5 text-balance text-2xl font-bold leading-tight sm:text-4xl">{business.name}</h1>
          {business.description && <p className="mx-auto mt-2 max-w-xl text-xs leading-5 sm:text-sm" style={{ color: theme.muted_color }}>{business.description}</p>}
          {business.address && <p className="mt-2 flex items-start justify-center gap-1.5 text-[11px] sm:text-xs" style={{ color: theme.muted_color }}><MapPin className="mt-0.5 shrink-0" size={13} />{[business.address, business.city, business.country].filter(Boolean).join(", ")}</p>}
          <div className="mt-4 flex flex-wrap justify-center gap-2" aria-label="Store contact actions">
            {business.phone && <HeroAction href={`tel:${business.phone}`} label="Call" color={primary}><Phone size={17} /></HeroAction>}
            {business.website && <HeroAction href={business.website} label="Website" external color={primary}><ExternalLink size={17} /></HeroAction>}
            {business.facebook_url && <HeroAction href={business.facebook_url} label="Facebook" external color={primary}><FaFacebookF /></HeroAction>}
            {business.instagram_url && <HeroAction href={business.instagram_url} label="Instagram" external color={primary}><FaInstagram /></HeroAction>}
            {business.telegram_url && <HeroAction href={business.telegram_url} label="Telegram" external color={primary}><FaTelegramPlane /></HeroAction>}
            {business.tiktok_url && <HeroAction href={business.tiktok_url} label="TikTok" external color={primary}><FaTiktok /></HeroAction>}
          </div>
        </div>
      </section>

      <div 
        ref={categoryNav} 
        className="sticky top-16 z-50 border-b shadow-sm backdrop-blur-xl"
        style={{ backgroundColor: `${theme.surface_color}F2`, borderColor: `${theme.muted_color}35` }}
      >
        <div className="mx-auto max-w-6xl px-3 py-3 sm:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <nav aria-label="Product categories " className="flex-1 overflow-hidden">
              <div className="flex touch-pan-x snap-x snap-proximity gap-2 overflow-x-auto overscroll-x-contain scroll-smooth scroll-px-1 px-1 pb-0.5 sm:gap-3 sm:pb-1 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
                <Filter
                  buttonRef={(node) => { categoryButtons.current.all = node; }}
                  active={activeCategory === "all"}
                  theme={theme}
                  onClick={() => scrollToCategory("all")}
                >
                  {businessPresentation.allLabel}
                </Filter>
                {categories.map((item) => (
                  <Filter
                    key={item.slug}
                    buttonRef={(node) => { categoryButtons.current[item.slug] = node; }}
                    active={activeCategory === item.slug}
                    theme={theme}
                    onClick={() => scrollToCategory(item.slug)}
                  >
                    {item.name}
                  </Filter>
                ))}
              </div>
            </nav>

            <div className="relative w-full max-w-md lg:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                ref={searchInputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={businessPresentation.searchPlaceholder}
                className="w-full border py-2.5 pl-10 pr-10 text-sm outline-none transition-all focus:ring-2"
                style={{ borderRadius: "var(--store-radius)", borderColor: `${theme.muted_color}45`, backgroundColor: theme.surface_color, color: theme.text_color }}
              />
              {search && (
                <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div id="catalog-start" className="h-0" />

      <main className={`khmer-storefront-body relative mx-auto max-w-6xl px-3 pb-10 sm:px-6 ${isKhmerTheme ? "pt-5 sm:pt-6" : "pt-6 sm:pt-10"}`}>
        {products.length > 0 ? (
          <div className="relative z-10 space-y-8 sm:space-y-14">
            {categories.map((item) => {
              const categoryProducts = products.filter((product) => product.category.slug === item.slug);
              if (!categoryProducts.length) return null;
              return (
                <section id={`category-${item.slug}`} key={item.slug} className={`scroll-mt-40 ${isFashionStore ? "p-0" : "rounded-[1.75rem] p-3 sm:rounded-none sm:p-0"}`} style={{ backgroundColor: isFashionStore ? "transparent" : theme.surface_color }}>
                  <div className="mb-2 flex items-end justify-between px-2 pb-3 sm:mb-6 sm:border-b sm:px-0 sm:pb-4" style={{ borderColor: `${theme.muted_color}28` }}>
                    <div>
                      <h2 className="text-xl font-bold sm:text-2xl">{item.name}</h2>
                      {item.description && <p className="mt-1 text-xs sm:text-sm" style={{ color: theme.muted_color }}>{item.description}</p>}
                    </div>
                    <span className="shrink-0 text-xs" style={{ color: theme.muted_color }}>{categoryProducts.length} {businessPresentation.itemNoun}</span>
                  </div>
                  <div className={isFashionStore ? "columns-2 gap-3 sm:columns-3 sm:gap-5 lg:columns-4" : `grid grid-cols-2 gap-3 sm:gap-5 ${theme.grid_columns === 2 ? "lg:grid-cols-2" : theme.grid_columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4"}`}>
                    {categoryProducts.map((product, productIndex) => <ProductCard key={product.slug} product={product} theme={theme} currency={business.currency} gallery={isFashionStore} galleryIndex={productIndex} onAdd={() => {
                      if (!product.is_available_now) return false;
                      if ((product.modifier_groups || []).length > 0 || (product.variants || []).length > 0) {
                        navigate(storePath(slug, `/products/${product.slug}`));
                        return false;
                      }
                      cart.add(slug, product);
                      hapticImpact();
                      showToast(`${product.name} added to cart.`);
                      return true;
                    }} />)}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed py-20 text-center" style={{ borderColor: `${theme.muted_color}55`, backgroundColor: theme.surface_color }}>
            <ShoppingBag className="mx-auto text-slate-300" size={48} />
            <h2 className="mt-6 text-xl font-semibold">No products found</h2>
            <button onClick={clearSearch} className="mt-6 text-violet-600 hover:underline">Clear search</button>
          </div>
        )}
      </main>

      {isMiniAppRoute && cartItems.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-[70] px-3 pb-[max(0.75rem,var(--tg-content-safe-area-inset-bottom,0px))]">
          <Link to={storePath(slug, "/cart")} className="mx-auto flex min-h-14 max-w-md items-center justify-between gap-4 rounded-2xl px-5 text-sm font-semibold text-white shadow-2xl" style={{ backgroundColor: primary }}>
            <span className="inline-flex items-center gap-2"><ShoppingBag size={18} />{cart.count(slug)} {cart.count(slug) === 1 ? "item" : "items"}</span>
            <span>{formatCurrency(cartTotal, business.currency)} <span aria-hidden="true">→</span></span>
          </Link>
        </div>
      )}

      <footer className="mt-16 border-t py-8 text-center text-sm" style={{ borderColor: `${theme.muted_color}35`, backgroundColor: theme.surface_color, color: theme.muted_color }}>
        <span className={isKhmerTheme ? "khmer-footer-signature" : undefined}>
          © {new Date().getFullYear()} {business.name} · Built with SellFlow
        </span>
      </footer>

      <StoreProfileDrawer
        business={business}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        theme={theme}
      />
    </div>
  );
}

function ThemePicker({ value, storeTheme, activeTheme, onChange }: {
  value: CustomerThemeId | "store";
  storeTheme: ThemeSettings;
  activeTheme: ThemeSettings;
  onChange: (value: CustomerThemeId | "store") => void;
}) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const menuId = "storefront-theme-menu";
  const options: Array<{ id: CustomerThemeId | "store"; label: string; theme: ThemeSettings }> = [
    { id: "store", label: "Store theme", theme: storeTheme },
    ...(Object.keys(CUSTOMER_THEMES) as CustomerThemeId[]).map((id) => ({
      id,
      label: CUSTOMER_THEME_LABELS[id],
      theme: CUSTOMER_THEMES[id],
    })),
  ];

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const selectedLabel = value === "store" ? "Theme" : CUSTOMER_THEME_LABELS[value];

  return (
    <div ref={pickerRef} className="relative ml-auto">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        className="flex h-10 items-center gap-2 border px-2.5 text-sm font-semibold shadow-sm transition hover:-translate-y-px focus:outline-none focus:ring-2 sm:px-3"
        style={{ borderRadius: "var(--store-radius)", borderColor: `${activeTheme.muted_color}45`, backgroundColor: activeTheme.background_color, color: activeTheme.text_color, "--tw-ring-color": `${activeTheme.primary_color}55` } as CSSProperties}
      >
        <ThemeSwatch theme={activeTheme} />
        <span className="hidden max-w-24 truncate sm:block">{selectedLabel}</span>
        <ChevronDown size={15} className={`hidden transition-transform sm:block ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        <span className="sr-only">Choose storefront theme</span>
      </button>

      {open && (
        <div
          id={menuId}
          role="listbox"
          aria-label="Storefront themes"
          className="fixed left-3 right-3 top-20 z-[100] max-h-[min(70vh,34rem)] overflow-y-auto rounded-3xl border border-black/10 bg-[#f7f7f8] p-2.5 text-slate-800 shadow-[0_24px_70px_rgba(15,23,42,0.24)] [scrollbar-color:#a3a3a3_transparent] [scrollbar-width:thin] sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+12px)] sm:w-72"
        >
          <p className="px-3 pb-2 pt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Theme</p>
          <div className="space-y-0.5">
            {options.map((option) => {
              const selected = value === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => { onChange(option.id); setOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-2.5 py-2 text-left text-[15px] transition ${selected ? "bg-white font-semibold shadow-sm" : "hover:bg-white/75"}`}
                >
                  <ThemeSwatch theme={option.theme} />
                  <span className="flex-1">{option.label}</span>
                  {selected && <Check size={18} strokeWidth={3} className="text-slate-900" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ThemeSwatch({ theme }: { theme: ThemeSettings }) {
  const colors = [theme.primary_color, theme.secondary_color, theme.text_color, theme.muted_color];
  return (
    <span className="grid h-7 w-7 shrink-0 grid-cols-2 gap-[3px] rounded-lg border border-black/5 p-1 shadow-sm" style={{ backgroundColor: theme.surface_color }} aria-hidden="true">
      {colors.map((color, index) => <span key={`${color}-${index}`} className="rounded-full" style={{ backgroundColor: color }} />)}
    </span>
  );
}

function Filter({ active, theme, onClick, children, buttonRef }: { 
  active: boolean; 
  theme: ThemeSettings;
  onClick: () => void; 
  children: React.ReactNode; 
  buttonRef?: (node: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      aria-pressed={active}
      className={`relative isolate min-h-10 shrink-0 snap-start overflow-hidden whitespace-nowrap border px-4 py-2 text-xs font-semibold shadow-sm transition-[color,border-color,transform] duration-200 active:scale-95 sm:min-h-12 sm:px-6 sm:py-3 sm:text-sm ${active ? "border-transparent text-white shadow-md" : "hover:shadow"}`}
      style={{ borderRadius: "var(--store-radius)", borderColor: active ? "transparent" : `${theme.muted_color}45`, backgroundColor: active ? undefined : theme.surface_color, color: active ? "white" : theme.text_color }}
    >
      {active && <motion.span
        layoutId="storefront-active-category"
        className="absolute inset-0 -z-10"
        style={{ backgroundColor: theme.primary_color, borderRadius: "var(--store-radius)" }}
        transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.75 }}
      />}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

function ProductCard({ product, theme, currency, onAdd, gallery = false, galleryIndex = 0 }: { product: Storefront["products"][number]; theme: ThemeSettings; currency: StoreCurrency; onAdd: () => boolean; gallery?: boolean; galleryIndex?: number }) {
  const reduceMotion = useReducedMotion();
  const [added, setAdded] = useState(false);
  const galleryRatio = ["aspect-[4/5]", "aspect-[3/4]", "aspect-square", "aspect-[5/7]"][galleryIndex % 4];
  const add = () => {
    if (!onAdd()) return;
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1100);
  };
  return (
    <article className={gallery ? "group mb-4 inline-flex w-full break-inside-avoid flex-col overflow-hidden align-top transition hover:-translate-y-1" : "group flex min-w-0 flex-col overflow-hidden border p-2.5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-3"} style={{ borderColor: gallery ? "transparent" : `${theme.muted_color}28`, borderRadius: theme.button_style === "square" ? "8px" : "20px", backgroundColor: gallery ? "transparent" : theme.surface_color }}>
      <Link to={`products/${product.slug}`} aria-label={`View ${product.name}`} className={`block w-full shrink-0 overflow-hidden shadow-sm transition group-hover:shadow-lg ${gallery ? `${galleryRatio} rounded-[1.15rem] sm:rounded-[1.4rem]` : "aspect-square rounded-[0.9rem] sm:rounded-2xl"}`} style={{ backgroundColor: `${theme.muted_color}12` }}>
        {product.thumbnail ? <ProgressiveImage src={product.thumbnail} alt={product.name} className="h-full w-full" imageClassName="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-slate-300"><ShoppingBag className="h-12 w-12" /></div>}
      </Link>
      <div className={`flex min-w-0 flex-1 flex-col px-1 pb-0.5 ${gallery ? "pt-2.5" : "pt-3"}`}>
        <h3 className={`line-clamp-2 text-sm font-semibold leading-snug sm:text-base ${gallery ? "" : "min-h-10 sm:min-h-12"}`}><Link to={`products/${product.slug}`} className="transition hover:opacity-70">{product.name}</Link></h3>
        <p className="mt-0.5 truncate text-[10px] font-medium sm:text-xs" style={{ color: theme.muted_color }}>{product.category.name}</p>
        {product.description && !gallery && <p className="mt-1 hidden line-clamp-2 text-xs sm:block" style={{ color: theme.muted_color }}>{product.description}</p>}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="min-w-0">
            <strong className="block truncate text-base sm:text-xl">{formatCurrency(product.discount_price || product.price, currency)}</strong>
            {product.discount_price && <span className="block truncate text-[10px] line-through sm:text-xs" style={{ color: theme.muted_color }}>{formatCurrency(product.price, currency)}</span>}
          </div>
        <motion.button
          disabled={product.stock < 1 || !product.is_available_now}
          onClick={add}
          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
          animate={added && !reduceMotion ? { scale: [1, 1.04, 1] } : { scale: 1 }}
          aria-label={`Add ${product.name} to cart`}
          className={`grid shrink-0 place-items-center overflow-hidden text-xs font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40 ${gallery ? "h-9 w-9 sm:h-10 sm:w-10" : "h-10 w-10 sm:h-11 sm:w-11"}`}
          style={{ backgroundColor: theme.primary_color, borderRadius: theme.button_style === "square" ? "8px" : "14px" }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={added ? "added" : "add"} initial={reduceMotion ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -5 }} className="flex items-center justify-center gap-1.5">
              {added ? <Check size={17} /> : <ShoppingBag size={17} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
        </div>
      </div>
    </article>
  );
}

function NotFound() {
  const { isMiniAppRoute } = useTelegramMiniApp();
  return <div className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center"><div><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-slate-200 text-slate-500"><Store size={30} /></span><h1 className="mt-5 text-2xl font-bold">Store not found</h1><p className="mt-2 text-slate-500">This store does not exist or is currently unavailable.</p><Link to={isMiniAppRoute ? "/telegram/store" : "/"} className="mt-6 inline-block rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white">{isMiniAppRoute ? "Back" : "Go to SellFlow"}</Link></div></div>;
}

function StoreUnavailable() {
  return <div className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center"><div><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-100 text-amber-600"><Store size={30} /></span><h1 className="mt-5 text-2xl font-bold">Store temporarily unavailable</h1><p className="mt-2 text-slate-500">We could not load this store right now. Please try again.</p><button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white">Try again</button></div></div>;
}



function HeroAction({ href, label, external = false, color, children }: {
  href: string;
  label: string;
  external?: boolean;
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="flex min-h-10 items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      style={color ? { color, borderColor: withHexOpacity(color, 25), backgroundColor: withHexOpacity(color, 10) } : undefined}
    >
      <span className="text-sm" aria-hidden="true">{children}</span>
      {label}
    </a>
  );
}

type BusinessPresentation = {
  label: string;
  eyebrow: string;
  allLabel: string;
  searchPlaceholder: string;
  itemNoun: string;
  icon: typeof Store;
};

const BUSINESS_PRESENTATIONS: Record<BusinessType, BusinessPresentation> = {
  food_beverage: { label: "Food & beverage", eyebrow: "Fresh from our menu", allLabel: "Full menu", searchPlaceholder: "Search the menu...", itemNoun: "items", icon: Utensils },
  fashion: { label: "Fashion & clothing", eyebrow: "Shop the collection", allLabel: "All styles", searchPlaceholder: "Search the collection...", itemNoun: "styles", icon: Shirt },
  beauty: { label: "Beauty & cosmetics", eyebrow: "Your beauty edit", allLabel: "All beauty", searchPlaceholder: "Search beauty products...", itemNoun: "products", icon: Sparkles },
  electronics: { label: "Electronics", eyebrow: "Discover better tech", allLabel: "All tech", searchPlaceholder: "Search electronics...", itemNoun: "products", icon: Smartphone },
  grocery_retail: { label: "Grocery & retail", eyebrow: "Everyday essentials", allLabel: "Shop all", searchPlaceholder: "Search the store...", itemNoun: "items", icon: ShoppingBasket },
  services: { label: "Services", eyebrow: "How we can help", allLabel: "All services", searchPlaceholder: "Search services...", itemNoun: "services", icon: BriefcaseBusiness },
  digital_products: { label: "Digital products", eyebrow: "Made for your next idea", allLabel: "All downloads", searchPlaceholder: "Search digital products...", itemNoun: "downloads", icon: Download },
  other: { label: "Independent business", eyebrow: "Explore our store", allLabel: "Shop all", searchPlaceholder: "Search products...", itemNoun: "items", icon: Store },
};

function getBusinessPresentation(type: BusinessType): BusinessPresentation {
  return BUSINESS_PRESENTATIONS[type] ?? BUSINESS_PRESENTATIONS.other;
}
