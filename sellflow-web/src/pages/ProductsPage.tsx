import { useEffect, useMemo, useState } from "react";
import { ImagePlus, Pencil, Plus, Search, Trash2, Upload, X } from "lucide-react";
import { productService, type ProductPayload } from "../Services/product";
import { categoryService } from "../Services/category";
import type { Product } from "../types/product";
import type { Category } from "../types/category";
import { EmptyState, ErrorMessage, PageHeader, buttonPrimary, buttonSecondary, inputClass } from "../components/dashboard/DashboardUI";
import { Modal } from "./CategoriesPage";

type ProductForm = {
  category_id: number; name: string; slug: string; sku: string; description: string;
  price: string; discount_price: string; stock: number; is_featured: boolean; is_active: boolean;
};

const blank: ProductForm = { category_id: 0, name: "", slug: "", sku: "", description: "", price: "", discount_price: "", stock: 0, is_featured: false, is_active: true };

export function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductForm>(blank);
  const [editing, setEditing] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [search, setSearch] = useState("");

  const load = () => Promise.all([productService.getProducts(), categoryService.getCategories()])
    .then(([products, categoryItems]) => { setItems(products); setCategories(categoryItems); })
    .catch(setError).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);
  useEffect(() => () => { if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview); }, [imagePreview]);

  const visible = useMemo(() => items.filter((product) => `${product.name} ${product.sku || ""} ${product.category?.name || ""}`.toLowerCase().includes(search.toLowerCase())), [items, search]);

  const show = (product?: Product) => {
    setError(null); setEditing(product?.id || null); setImageFile(null); setImagePreview(product?.thumbnail || null); setRemoveImage(false);
    setForm(product ? { category_id: product.category_id, name: product.name, slug: product.slug, sku: product.sku || "", description: product.description || "", price: String(product.price), discount_price: product.discount_price ? String(product.discount_price) : "", stock: product.stock, is_featured: product.is_featured, is_active: product.is_active } : { ...blank, category_id: categories.find((category) => category.is_active)?.id || 0 });
    setOpen(true);
  };

  const chooseImage = (file?: File) => {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { setError(new Error("Product images must be 4 MB or smaller.")); return; }
    setError(null); setImageFile(file); setImagePreview(URL.createObjectURL(file)); setRemoveImage(false);
  };

  const clearImage = () => { setImageFile(null); setImagePreview(null); setRemoveImage(true); };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true); setError(null);
    const payload: ProductPayload = { category_id: form.category_id, name: form.name, slug: form.slug, sku: form.sku || null, description: form.description || null, price: Number(form.price), discount_price: form.discount_price === "" ? null : Number(form.discount_price), stock: form.stock, is_featured: form.is_featured, is_active: form.is_active, thumbnail: imageFile, remove_thumbnail: removeImage };
    try { editing ? await productService.updateProduct(editing, payload) : await productService.createProduct(payload); setOpen(false); await load(); }
    catch (err) { setError(err); } finally { setSaving(false); }
  };

  const remove = async (product: Product) => {
    if (!confirm(`Delete “${product.name}”?`)) return;
    try { await productService.deleteProduct(product.id); setItems((current) => current.filter((item) => item.id !== product.id)); }
    catch (err) { setError(err); }
  };

  return <>
    <PageHeader title="Products" description="Manage prices, inventory, visibility, and product images." action={<button className={buttonPrimary} onClick={() => show()} disabled={!categories.some((category) => category.is_active)}><Plus size={17}/>Add product</button>}/>
    <ErrorMessage error={error}/>
    {!categories.length && <div className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">Create an active category before adding products.</div>}
    <div className="relative mb-5 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17}/><input className={`${inputClass} mt-0 pl-10`} placeholder="Search products or SKU..." value={search} onChange={(event) => setSearch(event.target.value)}/></div>
    {loading ? <p className="text-sm text-slate-500">Loading products...</p> : visible.length ? <ProductTable products={visible} edit={show} remove={remove}/> : <EmptyState title={search ? "No matching products" : "No products yet"} description={search ? "Try a different search term." : "Add your first product to start building the catalog."} action={!search && categories.length ? <button className={buttonPrimary} onClick={() => show()}><Plus size={17}/>Add product</button> : undefined}/>}

    {open && <Modal title={editing ? "Edit product" : "New product"} close={() => setOpen(false)}><form onSubmit={submit} className="space-y-5">
      <ImageUpload preview={imagePreview} choose={chooseImage} clear={clearImage}/>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Product name" required value={form.name} onChange={(name) => setForm((current) => ({ ...current, name, slug: editing ? current.slug : name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") }))}/>
        <label className="text-sm font-medium">Category<select required className={inputClass} value={form.category_id} onChange={(event) => setForm((current) => ({ ...current, category_id: Number(event.target.value) }))}><option value={0}>Select category</option>{categories.filter((category) => category.is_active).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <Field label="Slug" required value={form.slug} onChange={(slug) => setForm((current) => ({ ...current, slug }))}/><Field label="SKU" value={form.sku} onChange={(sku) => setForm((current) => ({ ...current, sku }))}/>
        <Field label="Price" required type="number" value={form.price} onChange={(price) => setForm((current) => ({ ...current, price }))}/><Field label="Discount price" type="number" value={form.discount_price} onChange={(discount_price) => setForm((current) => ({ ...current, discount_price }))}/>
        <Field label="Stock" required type="number" value={String(form.stock)} onChange={(stock) => setForm((current) => ({ ...current, stock: Number(stock) }))}/>
      </div>
      <label className="block text-sm font-medium">Description<textarea rows={3} className={inputClass} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}/></label>
      <div className="flex gap-6"><Checkbox label="Active" checked={form.is_active} onChange={(is_active) => setForm((current) => ({ ...current, is_active }))}/><Checkbox label="Featured" checked={form.is_featured} onChange={(is_featured) => setForm((current) => ({ ...current, is_featured }))}/></div>
      <ErrorMessage error={error}/><div className="flex justify-end gap-3"><button type="button" className={buttonSecondary} onClick={() => setOpen(false)}>Cancel</button><button disabled={saving} className={buttonPrimary}>{saving ? "Saving..." : "Save product"}</button></div>
    </form></Modal>}
  </>;
}

function ImageUpload({ preview, choose, clear }: { preview: string | null; choose: (file?: File) => void; clear: () => void }) { return <div><p className="mb-2 text-sm font-medium">Product image</p>{preview ? <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"><img src={preview} alt="Product preview" className="h-52 w-full object-contain"/><div className="absolute right-3 top-3 flex gap-2"><label className="cursor-pointer rounded-lg bg-white p-2 shadow hover:bg-slate-50" title="Replace image"><Upload size={17}/><input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => choose(event.target.files?.[0])}/></label><button type="button" onClick={clear} className="rounded-lg bg-white p-2 text-rose-600 shadow hover:bg-rose-50" title="Remove image"><X size={17}/></button></div></div> : <label className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-purple-400 hover:bg-purple-50/40"><ImagePlus className="text-slate-400" size={34}/><span className="mt-3 text-sm font-semibold">Choose a product image</span><span className="mt-1 text-xs text-slate-500">JPG, PNG, or WebP · maximum 4 MB</span><input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => choose(event.target.files?.[0])}/></label>}</div>; }
function ProductTable({ products, edit, remove }: { products: Product[]; edit: (product: Product) => void; remove: (product: Product) => void }) { return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="px-5 py-3">Product</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Price</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{products.map((product) => <tr key={product.id}><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">{product.thumbnail ? <img src={product.thumbnail} alt="" className="h-full w-full object-cover"/> : <span className="grid h-full place-items-center text-slate-300"><ImagePlus size={18}/></span>}</div><div><p className="font-semibold">{product.name}</p><p className="text-xs text-slate-400">{product.sku || product.slug}</p></div></div></td><td className="px-5 py-4 text-slate-500">{product.category?.name || "—"}</td><td className="px-5 py-4"><p className="font-medium">${Number(product.discount_price || product.price).toFixed(2)}</p>{product.discount_price && <p className="text-xs text-slate-400 line-through">${Number(product.price).toFixed(2)}</p>}</td><td className={`px-5 py-4 ${product.stock <= 5 ? "font-semibold text-amber-600" : ""}`}>{product.stock}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${product.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{product.is_active ? "Active" : "Hidden"}</span></td><td className="px-5 py-4"><div className="flex justify-end"><button onClick={() => edit(product)} className="rounded-lg p-2 hover:bg-slate-100"><Pencil size={16}/></button><button onClick={() => remove(product)} className="rounded-lg p-2 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={16}/></button></div></td></tr>)}</tbody></table></div></div>; }
function Field({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) { return <label className="text-sm font-medium">{label}<input required={required} type={type} min={type === "number" ? 0 : undefined} step={type === "number" ? "0.01" : undefined} className={inputClass} value={value} onChange={(event) => onChange(event.target.value)}/></label>; }
function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)}/>{label}</label>; }
