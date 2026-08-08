import { useEffect, useMemo, useState, type DragEvent, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { 
  AlertTriangle, 
  ImagePlus, 
  PackageCheck, 
  Pencil, 
  Plus, 
  Search, 
  Sparkles, 
  Trash2, 
  Upload, 
  X,
  Package,
  Tag,
  DollarSign,
  Box,
  Eye,
  EyeOff,
  Star,
  Grid3x3,
  List,
  RefreshCw
} from "lucide-react";
import { productService, type ProductPayload } from "../Services/product";
import { categoryService } from "../Services/category";
import type { Product } from "../types/product";
import type { Category } from "../types/category";
import { 
  EmptyState, 
  ErrorMessage, 
  PageHeader, 
  buttonPrimary, 
  buttonSecondary, 
  inputClass 
} from "../components/dashboard/DashboardUI";
import { ProgressiveImage } from "../components/ui/ProgressiveImage";
import { useAuth } from "../components/Auth/AuthContext";
import { activeStoreCurrency, currencySymbol, formatCurrency } from "../lib/currency";

type ProductForm = {
  category_id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: string;
  discount_price: string;
  stock: number;
  is_featured: boolean;
  is_active: boolean;
};

const blank: ProductForm = {
  category_id: 0, name: "", slug: "", sku: "", description: "", price: "",
  discount_price: "", stock: 0, is_featured: false, is_active: true,
};

export function ProductsPage() {
  const { user } = useAuth();
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const { productUuid } = useParams<{ productUuid?: string }>();
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductForm>(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const load = () => Promise.all([productService.getProducts(), categoryService.getCategories()])
    .then(([products, categoryItems]) => {
      setItems(products);
      setCategories(categoryItems);
    })
    .catch(setError)
    .finally(() => setLoading(false));

  const refresh = () => {
    setRefreshing(true);
    load().finally(() => setRefreshing(false));
  };

  useEffect(() => { load(); }, []);
  useEffect(() => () => {
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  const visible = useMemo(() => items.filter((product) =>
    `${product.name} ${product.sku || ""} ${product.category?.name || ""}`
      .toLowerCase().includes(search.toLowerCase())), [items, search]);

  const activeCount = items.filter((product) => product.is_active).length;
  const lowStockCount = items.filter((product) => product.stock <= 5).length;
  const featuredCount = items.filter((product) => product.is_featured).length;
  const editingProduct = editing ? items.find((product) => product.uuid === editing) : null;
  const stockManagedByVariants = Boolean(editingProduct?.variants?.length);

  const show = (product?: Product) => {
    setError(null);
    setEditing(product?.uuid || null);
    setImageFile(null);
    setImagePreview(product?.thumbnail || null);
    setRemoveImage(false);
    setForm(product ? {
      category_id: product.category_id,
      name: product.name,
      slug: product.slug,
      sku: product.sku || "",
      description: product.description || "",
      price: String(product.price),
      discount_price: product.discount_price ? String(product.discount_price) : "",
      stock: product.stock,
      is_featured: product.is_featured,
      is_active: product.is_active,
    } : { ...blank, category_id: categories.find((category) => category.is_active)?.id || 0 });
    setOpen(true);
    if (product) navigate(`/dashboard/products/${product.uuid}/edit`);
  };

  const closeModal = () => {
    setOpen(false);
    setEditing(null);
    if (productUuid) navigate("/dashboard/products");
  };

  useEffect(() => {
    if (!productUuid || loading) return;
    const product = items.find((item) => item.uuid === productUuid);
    if (!product) {
      setError(new Error("Product not found."));
      return;
    }

    setEditing(product.uuid);
    setImageFile(null);
    setImagePreview(product.thumbnail || null);
    setRemoveImage(false);
    setForm({
      category_id: product.category_id,
      name: product.name,
      slug: product.slug,
      sku: product.sku || "",
      description: product.description || "",
      price: String(product.price),
      discount_price: product.discount_price ? String(product.discount_price) : "",
      stock: product.stock,
      is_featured: product.is_featured,
      is_active: product.is_active,
    });
    setOpen(true);
  }, [items, loading, productUuid]);

  const chooseImage = (file?: File) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError(new Error("Choose a JPG, PNG, or WebP image."));
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError(new Error("Product images must be 4 MB or smaller."));
      return;
    }
    setError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveImage(false);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const payload: ProductPayload = {
      category_id: form.category_id,
      name: form.name,
      slug: form.slug,
      sku: form.sku || null,
      description: form.description || null,
      price: Number(form.price),
      discount_price: form.discount_price === "" ? null : Number(form.discount_price),
      stock: form.stock,
      is_featured: form.is_featured,
      is_active: form.is_active,
      thumbnail: imageFile,
      remove_thumbnail: removeImage,
    };
    try {
      editing ? await productService.updateProduct(editing, payload) : await productService.createProduct(payload);
      closeModal();
      await load();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (product: Product) => {
    if (!confirm(`Delete “${product.name}”?`)) return;
    try {
      await productService.deleteProduct(product.uuid);
      setItems((current) => current.filter((item) => item.id !== product.id));
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage product media, pricing, inventory, and storefront visibility."
        action={
          <button 
            className={`${buttonPrimary} gap-2`} 
            onClick={() => show()} 
            disabled={!categories.some((category) => category.is_active)}
          >
            <Plus size={17}/> Add product
          </button>
        }
      />
      
      <ErrorMessage error={error}/>
      
      {/* {!categories.length && (
        <div className="rounded-xl bg-amber-50 px-5 py-4 text-sm text-amber-800 border border-amber-200 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          Create an active category before adding products.
        </div>
      )} */}

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat 
          label="Total Products" 
          value={items.length} 
          icon={<Package size={16}/>} 
          tone="slate" 
        />
        <MiniStat 
          label="Active" 
          value={activeCount} 
          icon={<Eye size={16}/>} 
          tone="emerald" 
        />
        <MiniStat 
          label="Low Stock" 
          value={lowStockCount} 
          icon={<AlertTriangle size={16}/>} 
          tone="amber" 
        />
        <MiniStat 
          label="Featured" 
          value={featuredCount} 
          icon={<Star size={16}/>} 
          tone="violet" 
        />
      </div>

      {/* Search & View Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17}/>
          <input 
            className={`${inputClass} border-slate-200 bg-zinc-100/60 pl-10 focus:bg-white`} 
            placeholder="Search products, category, or SKU..." 
            value={search} 
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && (
            <button 
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-slate-200 bg-white p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-1.5 transition ${
                viewMode === "grid" 
                  ? "bg-violet-50 text-violet-600" 
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg p-1.5 transition ${
                viewMode === "list" 
                  ? "bg-violet-50 text-violet-600" 
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <List size={18} />
            </button>
          </div>
          <button
            onClick={refresh}
            disabled={refreshing}
            aria-label="Refresh products"
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
          >
            <motion.span
              className="block"
              animate={refreshing && !reduceMotion ? { rotate: 360 } : { rotate: 0 }}
              transition={refreshing ? { duration: 0.75, repeat: Infinity, ease: "linear" } : { duration: 0.2 }}
            >
              <RefreshCw size={18} />
            </motion.span>
          </button>
        </div>
      </div>

      {/* Products Display */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl bg-slate-100 p-4">
              <div className="aspect-square rounded-xl bg-slate-200" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="h-3 w-1/2 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div animate={{ opacity: refreshing ? 0.55 : 1 }} transition={{ duration: reduceMotion ? 0 : 0.18 }}>
          <AnimatePresence mode="wait" initial={false}>
            {visible.length ? (
              viewMode === "grid" ? (
                <motion.div
                  key="product-grid"
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <AnimatePresence mode="popLayout">
                    {visible.map((product) => (
                      <ProductCard
                        key={product.uuid}
                        product={product}
                        edit={show}
                        remove={remove}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="product-list"
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductTable products={visible} edit={show} remove={remove} />
                </motion.div>
              )
            ) : (
              <motion.div
                key="product-empty"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                className="rounded-xl border-2 border-dashed border-slate-200 bg-zinc-100/50 p-12"
              >
                <EmptyState
                  title={search ? "No matching products" : "No products yet"}
                  description={search ? "Try a different search term." : "Add your first product to start building the catalog."}
                  action={!search && categories.length ?
                    <button className={`${buttonPrimary} gap-2`} onClick={() => show()}>
                      <Plus size={17}/> Add product
                    </button> : undefined
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Product Modal */}
      {open && (
        <ProductModal title={editing ? "Edit product" : "Create product"} close={closeModal}>
          <form onSubmit={submit} className="flex max-h-[calc(92vh-73px)] flex-col">
            <div className="grid min-h-0 flex-1 overflow-y-auto md:grid-cols-[300px_minmax(0,1fr)] md:overflow-hidden xl:grid-cols-[330px_minmax(0,1fr)]">
              <aside className="border-b border-slate-200 bg-zinc-100/60 p-5 md:overflow-y-auto md:border-b-0 md:border-r xl:p-6">
                <ImageUpload preview={imagePreview} file={imageFile} choose={chooseImage} clear={clearImage}/>
                <div className="mt-5 rounded-xl border border-violet-100 bg-violet-50/70 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-violet-800">
                    <Sparkles size={16}/> Image tips
                  </div>
                  <ul className="mt-2 space-y-1.5 text-xs leading-5 text-violet-700/80">
                    <li>• Use a square image for consistent cards.</li>
                    <li>• Keep the product centered and well lit.</li>
                    <li>• Recommended size: 1200 × 1200 pixels.</li>
                  </ul>
                </div>
              </aside>

              <div className="space-y-7 p-5 md:overflow-y-auto lg:p-7">
                <ErrorMessage error={error}/>
                
                <FormSection title="Basic information" description="The details customers use to identify this product.">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field 
                      label="Product name" 
                      required 
                      value={form.name} 
                      onChange={(name) => setForm((current) => ({ 
                        ...current, 
                        name, 
                        slug: editing ? current.slug : name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") 
                      }))}
                    />
                    <label className="text-sm font-medium text-slate-700">
                      Category *
                      <select 
                        required 
                        className={`${inputClass} mt-1.5`} 
                        value={form.category_id} 
                        onChange={(event) => setForm((current) => ({ ...current, category_id: Number(event.target.value) }))}
                      >
                        <option value={0}>Select category</option>
                        {categories.filter((category) => category.is_active).map((category) => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </label>
                    <Field 
                      label="Slug" 
                      required 
                      value={form.slug} 
                      onChange={(slug) => setForm((current) => ({ ...current, slug }))}
                    />
                    <Field 
                      label="SKU" 
                      value={form.sku} 
                      placeholder="Optional stock code" 
                      onChange={(sku) => setForm((current) => ({ ...current, sku }))}
                    />
                  </div>
                  <label className="mt-4 block text-sm font-medium text-slate-700">
                    Description
                    <textarea 
                      rows={4} 
                      className={`${inputClass} mt-1.5 resize-none`} 
                      placeholder="Describe the product, size, materials, or ingredients..." 
                      value={form.description} 
                      onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    />
                  </label>
                </FormSection>

                <FormSection title="Pricing and inventory" description="Set the selling price and available quantity.">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field 
                      label="Regular price" 
                      required 
                      type="number" 
                      prefix={currencySymbol(user?.business?.currency)}
                      value={form.price} 
                      onChange={(price) => setForm((current) => ({ ...current, price }))}
                    />
                    <Field 
                      label="Discount price" 
                      type="number" 
                      prefix={currencySymbol(user?.business?.currency)}
                      value={form.discount_price} 
                      onChange={(discount_price) => setForm((current) => ({ ...current, discount_price }))}
                    />
                    {stockManagedByVariants ? (
                      <label className="text-sm font-medium text-slate-700">
                        Stock quantity
                        <input disabled className={`${inputClass} cursor-not-allowed bg-slate-100 text-slate-500`} value={form.stock} />
                        <span className="mt-1 block text-xs font-normal text-slate-500">Calculated from active variants. Adjust it from Inventory.</span>
                      </label>
                    ) : (
                      <Field
                        label="Stock quantity"
                        required
                        type="number"
                        value={String(form.stock)}
                        onChange={(stock) => setForm((current) => ({ ...current, stock: Number(stock) }))}
                      />
                    )}
                  </div>
                </FormSection>

                <FormSection title="Storefront visibility" description="Control how this product appears to customers.">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Toggle 
                      label="Active product" 
                      description="Visible and available in the storefront." 
                      checked={form.is_active} 
                      onChange={(is_active) => setForm((current) => ({ ...current, is_active }))}
                    />
                    <Toggle 
                      label="Featured product" 
                      description="Prioritize this product in the catalog." 
                      checked={form.is_featured} 
                      onChange={(is_featured) => setForm((current) => ({ ...current, is_featured }))}
                    />
                  </div>
                </FormSection>
              </div>
            </div>
            
            <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-white px-5 py-4 lg:px-7">
              <p className="hidden text-xs text-slate-400 sm:block">Changes appear after saving.</p>
              <div className="ml-auto flex gap-3">
                <button type="button" className={buttonSecondary} onClick={closeModal}>Cancel</button>
                <button disabled={saving} className={`${buttonPrimary} gap-2`}>
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving...
                    </>
                  ) : (
                    editing ? "Save changes" : "Create product"
                  )}
                </button>
              </div>
            </div>
          </form>
        </ProductModal>
      )}
    </div>
  );
}

// Product Card Component (Grid View)
function ProductCard({ product, edit, remove }: { product: Product; edit: (product: Product) => void; remove: (product: Product) => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.975, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.97, y: -6 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-xl bg-slate-100 border border-slate-200 p-4 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-zinc-200/50"
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl shadow-sm">
        {product.thumbnail ? (
          <ProgressiveImage
            src={product.thumbnail}
            alt={product.name}
            className="h-full w-full"
            imageClassName="h-full w-full object-cover group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">
            <Package size={48} />
          </div>
        )}
        
        {/* Status badges overlay */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.is_featured && (
            <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              ★ Featured
            </span>
          )}
          {!product.is_active && (
            <span className="rounded-full bg-slate-600/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
              Hidden
            </span>
          )}
        </div>
        
        {/* Stock badge */}
        <div className="absolute right-2 top-2">
          {product.stock === 0 ? (
            <span className="rounded-full bg-red-100/90 px-2 py-1 text-[10px] font-bold text-red-500 shadow-sm">
              Out of stock
            </span>
          ) : product.stock <= 5 ? (
            <span className="rounded-full bg-amber-100/90 px-2 py-1 text-[10px] font-bold text-orange-500 shadow-sm">
              Low stock
            </span>
          ) : (
            <span className="rounded-full bg-emerald-100/90 px-2 py-1 text-[10px] font-bold text-emerald-400 shadow-sm ">
              In stock
            </span>
          )}
        </div>
        
        {/* Quick actions overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full  px-3 pb-3 pt-8 transition duration-300 group-hover:translate-y-0">
          <div className="flex items-center justify-center gap-2">
            <button 
              onClick={() => edit(product)}
              className="rounded-full bg-purple-100/40 backdrop-blur-xl  px-3 py-1.5 text-xs font-semibold text-slate-100 shadow-lg transition hover:bg-violet-50 hover:text-violet-600"
            >
              Edit
            </button>
            <button 
              onClick={() => remove(product)}
              className="rounded-full bg-red-100/30 px-3 py-1.5 text-xs font-semibold text-red-600 backdrop-blur-xl shadow-lg transition hover:bg-red-100 hover:text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="mt-3 space-y-1">
        <h3 className="font-semibold text-slate-900 truncate">{product.name}</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-violet-600">
              {formatCurrency(product.discount_price || product.price, activeStoreCurrency())}
            </p>
            {product.discount_price && (
              <p className="text-xs text-slate-400 line-through">
                {formatCurrency(product.price, activeStoreCurrency())}
              </p>
            )}
          </div>
          <span className="text-xs text-slate-400">
            {product.stock} units
          </span>
        </div>
        <p className="text-xs text-slate-400 truncate">
          {product.category?.name || "Uncategorized"}
        </p>
      </div>
    </motion.article>
  );
}

function ProductModal({ title, close, children }: { title: string; close: () => void; children: ReactNode }) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) close();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [close]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm sm:p-5"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-[0_30px_100px_rgba(15,23,42,.28)]">
        <div className="flex h-[73px] items-center justify-between border-b border-slate-200 px-5 sm:px-7">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            <p className="mt-0.5 text-xs text-slate-500">Add product details and a storefront-ready image.</p>
          </div>
          <button 
            type="button" 
            onClick={close} 
            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" 
            aria-label="Close product editor"
          >
            <X size={19}/>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ImageUpload({ preview, file, choose, clear }: { preview: string | null; file: File | null; choose: (file?: File) => void; clear: () => void }) {
  const [dragging, setDragging] = useState(false);
  const drop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    choose(event.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">Product media</p>
          <p className="mt-0.5 text-xs text-slate-500">Your main catalog image</p>
        </div>
        {preview && (
          <button 
            type="button" 
            onClick={clear} 
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
          >
            <Trash2 size={14}/> Remove
          </button>
        )}
      </div>
      
      {preview ? (
        <div>
          <div className="group relative h-56 overflow-hidden rounded-xl border border-slate-200 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px] shadow-sm sm:h-64 md:h-[260px]">
            <img src={preview} alt="Product preview" className="h-full w-full object-contain"/>
            <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-slate-950/80 to-transparent px-4 pb-4 pt-10 transition group-hover:translate-y-0">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-lg">
                <Upload size={15}/> Replace image
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => choose(event.target.files?.[0])}/>
              </label>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span className="max-w-[220px] truncate">{file?.name || "Current product image"}</span>
            {file && <span>{formatFileSize(file.size)}</span>}
          </div>
        </div>
      ) : (
        <label 
          onDragEnter={() => setDragging(true)} 
          onDragLeave={() => setDragging(false)} 
          onDragOver={(event) => event.preventDefault()} 
          onDrop={drop} 
          className={`flex h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 text-center transition sm:h-64 md:h-[260px] ${
            dragging 
              ? "border-violet-500 bg-violet-100/70 ring-4 ring-violet-100" 
              : "border-slate-300 bg-white hover:border-violet-400 hover:bg-violet-50/40"
          }`}
        >
          <span className="grid h-14 w-14 place-items-center rounded-xl bg-violet-50 text-violet-600 shadow-sm">
            <ImagePlus size={27}/>
          </span>
          <span className="mt-4 text-sm font-semibold text-slate-800">Drop your image here</span>
          <span className="mt-1 text-xs text-slate-500">or click to browse files</span>
          <span className="mt-4 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500">
            JPG, PNG, WebP · max 4 MB
          </span>
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => choose(event.target.files?.[0])}/>
        </label>
      )}
    </div>
  );
}

function FormSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section>
      <div className="mb-4">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

function ProductTable({ products, edit, remove }: { products: Product[]; edit: (product: Product) => void; remove: (product: Product) => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-100/60 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Inventory</th>
              <th className="px-5 py-3">Visibility</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence initial={false}>
            {products.map((product) => (
              <motion.tr
                layout={!reduceMotion}
                key={product.uuid}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="group transition-colors hover:bg-zinc-50/70"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
                      {product.thumbnail ? (
                        <ProgressiveImage src={product.thumbnail} alt={product.name} className="h-full w-full" imageClassName="h-full w-full object-cover" />
                      ) : (
                        <span className="grid h-full place-items-center text-slate-300">
                          <ImagePlus size={20}/>
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="max-w-[240px] truncate font-semibold text-slate-900">{product.name}</p>
                        {product.is_featured && (
                          <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold uppercase text-violet-700">
                            ★ Featured
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-400">{product.sku || product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-500">
                  {product.category?.name || "—"}
                </td>
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">
                    {formatCurrency(product.discount_price || product.price, activeStoreCurrency())}
                  </p>
                  {product.discount_price && (
                    <p className="mt-0.5 text-xs text-slate-400 line-through">
                      {formatCurrency(product.price, activeStoreCurrency())}
                    </p>
                  )}
                </td>
                <td className="px-5 py-4">
                  <InventoryBadge stock={product.stock} />
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    product.is_active 
                      ? "bg-emerald-50 text-emerald-700" 
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      product.is_active ? "bg-emerald-500" : "bg-slate-400"
                    }`}/>
                    {product.is_active ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1 opacity-70 transition group-hover:opacity-100">
                    <button 
                      onClick={() => edit(product)} 
                      className="rounded-lg bg-blue-50 p-2 text-blue-500 transition hover:bg-blue-100 hover:text-blue-600" 
                      aria-label={`Edit ${product.name}`}
                    >
                      <Pencil size={16}/>
                    </button>
                    <button 
                      onClick={() => remove(product)} 
                      className="rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100 hover:text-red-600" 
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InventoryBadge({ stock }: { stock: number }) {
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { 
      label: "Out of stock", 
      color: "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-500",
      progressColor: "bg-red-400"
    };
    if (stock <= 5) return { 
      label: "Low stock", 
      color: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
      progressColor: "bg-amber-400"
    };
    return { 
      label: "In stock", 
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
      progressColor: "bg-emerald-500"
    };
  };

  const status = getStockStatus(stock);
  const progressWidth = Math.min((stock / 50) * 100, 100);

  return (
    <div className="min-w-[140px] max-w-[200px]">
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.color}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`}/>
          <span className="hidden sm:inline">{status.label}</span>
          <span className="sm:hidden">{stock}</span>
        </span>
        <span className="hidden text-xs font-semibold text-slate-700 sm:inline">
          {stock} <span className="font-normal text-slate-400">units</span>
        </span>
      </div>
      <div className="mt-1.5 hidden sm:block">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${status.progressColor}`}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function Field({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  required = false, 
  placeholder = "", 
  prefix 
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void; 
  type?: string; 
  required?: boolean; 
  placeholder?: string; 
  prefix?: string 
}) {
  return (
    <label className="text-sm font-medium text-slate-700">
      {label}
      <div className="relative mt-1.5">
        {prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
            {prefix}
          </span>
        )}
        <input 
          required={required} 
          type={type} 
          min={type === "number" ? 0 : undefined} 
          step={type === "number" ? "0.01" : undefined} 
          placeholder={placeholder} 
          className={`${inputClass} ${prefix ? "pl-8" : ""}`} 
          value={value} 
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </label>
  );
}

function Toggle({ 
  label, 
  description, 
  checked, 
  onChange 
}: { 
  label: string; 
  description: string; 
  checked: boolean; 
  onChange: (value: boolean) => void 
}) {
  return (
    <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
      checked ? "border-violet-200 bg-violet-50/60" : "border-slate-200 hover:bg-slate-50"
    }`}>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? "bg-violet-600" : "bg-slate-300"
      }`}>
        <input type="checkbox" className="sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)}/>
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
          checked ? "left-6" : "left-1"
        }`}/>
      </span>
      <span>
        <span className="block text-sm font-semibold text-slate-800">{label}</span>
        <span className="mt-0.5 block text-xs leading-5 text-slate-500">{description}</span>
      </span>
    </label>
  );
}

function MiniStat({ label, value, icon, tone }: { label: string; value: number; icon: ReactNode; tone: "slate" | "emerald" | "amber" | "violet" }) {
  const colors = { 
    slate: "bg-blue-100 border border-blue-200 text-blue-600", 
    emerald: "bg-emerald-100 border border-emerald-200 text-emerald-600", 
    amber: "bg-orange-100/40 border border-orange-200 text-orange-600",
    violet: "bg-purple-100  border border-purple-200 text-purple-600"
  };
  return (
    <div className="rounded-xl bg-slate-100 border border-200 p-4 shadow-sm transition hover:shadow-md">
      <span className={`grid h-9 w-9 place-items-center rounded-xl ${colors[tone]}`}>
        {icon}
      </span>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

function formatFileSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
