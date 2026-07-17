import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ExternalLink, Mail, MapPin, Phone, Search, ShoppingBag, Store, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { storefrontService, type Storefront } from "../Services/storefront";
import type { ThemeSettings } from "../types/theme";
import { useCart } from "../components/cart/CartContext";
import { useToast } from "../components/ui/ToastContext";

export function StorefrontPage() {
  const { slug = "" } = useParams();
  const [storefront, setStorefront] = useState<Storefront | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [missing, setMissing] = useState(false);
  const cart = useCart();
  const { showToast } = useToast();

  const categoryButtons = useRef<Record<string, HTMLButtonElement | null>>({});
  const categoryNav = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMissing(false);
    storefrontService.getStore(slug).then((data) => {
      setStorefront(data);
      document.title = `${data.business.name} · SellFlow`;
    }).catch(() => setMissing(true));
    return () => { document.title = "SellFlow"; };
  }, [slug]);

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
        const threshold = navHeight + 40;

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
    const top = target.getBoundingClientRect().top + window.scrollY - (navHeight + 20);
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  const clearSearch = () => {
    setSearch("");
    searchInputRef.current?.focus();
  };

  if (missing) return <NotFound />;
  if (!storefront) return <div className="grid min-h-screen place-items-center bg-slate-50"><div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600" /></div>;

  const { business, categories } = storefront;
  const theme = business.theme;
  const primary = theme.primary_color;
  const isMinimalHero = theme.hero_style === "minimal";
  const fontFamily = theme.font_family === "classic"
    ? "Georgia, Cambria, serif"
    : theme.font_family === "modern"
      ? "Inter, ui-sans-serif, system-ui, sans-serif"
      : "ui-sans-serif, system-ui, sans-serif";
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
    <div className="min-h-screen" style={themeVariables}>
      {/* Header */}
      <header className="relative z-10 border-b" style={{ backgroundColor: theme.surface_color, borderColor: `${theme.muted_color}35` }}>
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          {business.logo ? <img src={business.logo} alt={`${business.name} logo`} className="h-10 w-10 rounded-lg object-cover" /> : <span className="grid h-10 w-10 place-items-center rounded-lg text-white" style={{ backgroundColor: primary }}><Store size={20} /></span>}
          <div><p className="font-bold leading-tight">{business.name}</p><p className="text-xs" style={{ color: theme.muted_color }}>Powered by SellFlow</p></div>
          <Link to={`/${slug}/cart`} className="ml-auto flex items-center gap-2 px-3 py-2 text-sm" style={{ borderRadius: "var(--store-radius)", backgroundColor: `${primary}12` }}><ShoppingBag size={17} /><span className="hidden sm:inline">Cart</span><span className="grid h-5 min-w-5 place-items-center rounded-full px-1 text-xs text-white" style={{ backgroundColor: primary }}>{cart.count(slug)}</span></Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ color: isMinimalHero ? theme.text_color : "white", background: isMinimalHero ? theme.surface_color : `linear-gradient(125deg, ${theme.secondary_color}, ${theme.primary_color})` }}>
        {theme.hero_style === "banner" && business.banner && <img src={business.banner} alt="" className="absolute inset-0 h-full w-full object-cover" />}
        {theme.hero_style === "banner" && <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${theme.secondary_color}F2, ${theme.primary_color}99)` }} />}
        {theme.hero_style === "gradient" && <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 80% 10%, white 0, transparent 35%)" }} />}
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: isMinimalHero ? primary : "currentColor", opacity: isMinimalHero ? 1 : 0.8 }}>Welcome to</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold sm:text-6xl">{business.name}</h1>
          {business.description && <p className="mt-5 max-w-2xl text-base leading-7 opacity-80 sm:text-lg">{business.description}</p>}
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm opacity-75">
            {business.address && <span className="flex items-center gap-2"><MapPin size={16} />{[business.address, business.city, business.country].filter(Boolean).join(", ")}</span>}
            {business.phone && <a className="flex items-center gap-2 hover:text-white" href={`tel:${business.phone}`}><Phone size={16} />{business.phone}</a>}
            {business.email && <a className="flex items-center gap-2 hover:text-white" href={`mailto:${business.email}`}><Mail size={16} />{business.email}</a>}
            {business.website && <a className="flex items-center gap-2 hover:text-white" href={business.website} target="_blank" rel="noreferrer"><ExternalLink size={16} />Website</a>}
          </div>
        </div>
      </section>

      {/* FIXED STICKY NAVIGATION */}
      <div 
        ref={categoryNav} 
        className="sticky top-0 z-50 mb-8 border-b shadow-sm backdrop-blur-md"
        style={{ backgroundColor: `${theme.surface_color}F2`, borderColor: `${theme.muted_color}35` }}
      >
        <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6 sm:py-5">
          <div className="flex flex-col gap-3 sm:gap-5 lg:flex-row lg:items-center">
            {/* Prominent Category Chips */}
            <nav aria-label="Product categories " className="flex-1 overflow-hidden">
              <div className="flex touch-pan-x snap-x snap-proximity gap-2 overflow-x-auto overscroll-x-contain scroll-smooth scroll-px-1 px-1 pb-0.5 sm:gap-3 sm:pb-1 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
                <Filter
                  buttonRef={(node) => { categoryButtons.current.all = node; }}
                  active={activeCategory === "all"}
                  theme={theme}
                  onClick={() => scrollToCategory("all")}
                >
                  All Products
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

            {/* Search Bar */}
            <div className="relative w-full max-w-md lg:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                ref={searchInputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full border py-2.5 pl-10 pr-10 text-sm outline-none transition-all focus:ring-2 sm:py-3 sm:pl-11"
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

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {products.length > 0 ? (
          <div className="space-y-16">
            {categories.map((item) => {
              const categoryProducts = products.filter((product) => product.category.slug === item.slug);
              if (!categoryProducts.length) return null;
              return (
                <section id={`category-${item.slug}`} key={item.slug} className="scroll-mt-28">
                  <div className="mb-6 flex items-end justify-between border-b border-slate-200 pb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{item.name}</h2>
                      {item.description && <p className="mt-1 text-sm text-slate-500">{item.description}</p>}
                    </div>
                    <span className="text-sm text-slate-400">{categoryProducts.length} items</span>
                  </div>
                  <div className={`grid grid-cols-2 gap-4 sm:gap-6 ${theme.grid_columns === 2 ? "lg:grid-cols-2" : theme.grid_columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4"}`}>
                    {categoryProducts.map((product) => <ProductCard key={product.slug} product={product} theme={theme} onAdd={() => { cart.add(slug, product); showToast(`${product.name} added to cart.`); }} />)}
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

      <footer className="mt-16 border-t py-8 text-center text-sm" style={{ borderColor: `${theme.muted_color}35`, backgroundColor: theme.surface_color, color: theme.muted_color }}>
        © {new Date().getFullYear()} {business.name} · Built with SellFlow
      </footer>
    </div>
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

function ProductCard({ product, theme, onAdd }: { product: Storefront["products"][number]; theme: ThemeSettings; onAdd: () => void }) {
  const cardStyle = theme.card_style === "elevated"
    ? { borderColor: "transparent", boxShadow: "0 12px 30px rgba(15,23,42,.10)" }
    : theme.card_style === "flat"
      ? { borderColor: "transparent", boxShadow: "none" }
      : { borderColor: `${theme.muted_color}40`, boxShadow: "none" };
  return (
    <article className="min-w-0 overflow-hidden border transition hover:-translate-y-1" style={{ ...cardStyle, borderRadius: theme.button_style === "square" ? "7px" : "16px", backgroundColor: theme.surface_color }}>
      <div className="aspect-square" style={{ backgroundColor: `${theme.muted_color}12` }}>
        {product.thumbnail ? <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-slate-300"><ShoppingBag className="h-12 w-12" /></div>}
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: theme.primary_color }}>{product.category.name}</p>
        <h3 className="mt-1 line-clamp-2 font-semibold leading-tight">{product.name}</h3>
        <div className="mt-3 flex items-baseline justify-between">
          <strong className="text-xl">${Number(product.discount_price || product.price).toFixed(2)}</strong>
          {product.discount_price && <span className="text-xs text-slate-400 line-through">${Number(product.price).toFixed(2)}</span>}
        </div>
        <button disabled={product.stock < 1} onClick={onAdd} className="mt-4 w-full px-3 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40" style={{ backgroundColor: theme.primary_color, borderRadius: "var(--store-radius)" }}>{product.stock > 0 ? "Add to cart" : "Out of stock"}</button>
      </div>
    </article>
  );
}

function NotFound() {
  return <div className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center"><div><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-slate-200 text-slate-500"><Store size={30} /></span><h1 className="mt-5 text-2xl font-bold">Store not found</h1><p className="mt-2 text-slate-500">This store does not exist or is currently unavailable.</p><Link to="/" className="mt-6 inline-block rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white">Go to SellFlow</Link></div></div>;
}
