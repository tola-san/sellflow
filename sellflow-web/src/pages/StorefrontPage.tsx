import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Mail, MapPin, Phone, Search, ShoppingBag, Store, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { storefrontService, type Storefront } from "../Services/storefront";

export function StorefrontPage() {
  const { slug = "" } = useParams();
  const [storefront, setStorefront] = useState<Storefront | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [missing, setMissing] = useState(false);

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
  const primary = business.theme.primary_color;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="relative z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          {business.logo ? <img src={business.logo} alt={`${business.name} logo`} className="h-10 w-10 rounded-xl object-cover" /> : <span className="grid h-10 w-10 place-items-center rounded-xl text-white" style={{ backgroundColor: primary }}><Store size={20} /></span>}
          <div><p className="font-bold leading-tight">{business.name}</p><p className="text-xs text-slate-500">Powered by SellFlow</p></div>
          <div className="ml-auto flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm"><ShoppingBag size={17} /><span className="hidden sm:inline">Cart</span><span className="grid h-5 w-5 place-items-center rounded-full text-xs text-white" style={{ backgroundColor: primary }}>0</span></div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden  text-white">
        {business.banner && <img src={business.banner} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-zinc-200" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: primary }}>Welcome to</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold sm:text-6xl">{business.name}</h1>
          {business.description && <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">{business.description}</p>}
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
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
        className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md mb-8"
      >
        <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6 sm:py-5">
          <div className="flex flex-col gap-3 sm:gap-5 lg:flex-row lg:items-center">
            {/* Prominent Category Chips */}
            <nav aria-label="Product categories " className="flex-1 overflow-hidden">
              <div className="flex touch-pan-x snap-x snap-proximity gap-2 overflow-x-auto overscroll-x-contain scroll-smooth scroll-px-1 px-1 pb-0.5 sm:gap-3 sm:pb-1 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden">
                <Filter
                  buttonRef={(node) => { categoryButtons.current.all = node; }}
                  active={activeCategory === "all"}
                  color={primary}
                  onClick={() => scrollToCategory("all")}
                >
                  All Products
                </Filter>
                {categories.map((item) => (
                  <Filter
                    key={item.slug}
                    buttonRef={(node) => { categoryButtons.current[item.slug] = node; }}
                    active={activeCategory === item.slug}
                    color={primary}
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
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-200 sm:py-3 sm:pl-11"
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
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                    {categoryProducts.map((product) => <ProductCard key={product.slug} product={product} primary={primary} />)}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <ShoppingBag className="mx-auto text-slate-300" size={48} />
            <h2 className="mt-6 text-xl font-semibold">No products found</h2>
            <button onClick={clearSearch} className="mt-6 text-violet-600 hover:underline">Clear search</button>
          </div>
        )}
      </main>

      <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} {business.name} · Built with SellFlow
      </footer>
    </div>
  );
}

function Filter({ active, color, onClick, children, buttonRef }: { 
  active: boolean; 
  color: string; 
  onClick: () => void; 
  children: React.ReactNode; 
  buttonRef?: (node: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      aria-pressed={active}
      className={`relative isolate min-h-10 shrink-0 snap-start overflow-hidden whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold shadow-sm transition-[color,border-color,transform] duration-200 active:scale-95 sm:min-h-12 sm:px-6 sm:py-3 sm:text-sm ${active ? "border-transparent text-white shadow-md" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow"}`}
    >
      {active && <motion.span
        layoutId="storefront-active-category"
        className="absolute inset-0 -z-10 rounded-full"
        style={{ backgroundColor: color }}
        transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.75 }}
      />}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

function ProductCard({ product, primary }: { product: Storefront["products"][number]; primary: string }) {
  return (
    <article className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-square bg-slate-100">
        {product.thumbnail ? <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-slate-300"><ShoppingBag className="h-12 w-12" /></div>}
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: primary }}>{product.category.name}</p>
        <h3 className="mt-1 line-clamp-2 font-semibold leading-tight">{product.name}</h3>
        <div className="mt-3 flex items-baseline justify-between">
          <strong className="text-xl">${Number(product.discount_price || product.price).toFixed(2)}</strong>
          {product.discount_price && <span className="text-xs text-slate-400 line-through">${Number(product.price).toFixed(2)}</span>}
        </div>
      </div>
    </article>
  );
}

function NotFound() {
  return <div className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center"><div><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-slate-200 text-slate-500"><Store size={30} /></span><h1 className="mt-5 text-2xl font-bold">Store not found</h1><p className="mt-2 text-slate-500">This store does not exist or is currently unavailable.</p><Link to="/" className="mt-6 inline-block rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white">Go to SellFlow</Link></div></div>;
}
