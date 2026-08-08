import { useEffect, useMemo, useState } from "react";
import { Boxes, Layers3, Pencil, Plus, Trash2, X } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/Auth/AuthContext";
import {
  EmptyState,
  ErrorMessage,
  PageHeader,
  buttonPrimary,
  buttonSecondary,
  inputClass,
} from "../components/dashboard/DashboardUI";
import { productVariantService, type ProductVariantPayload } from "../Services/inventory";
import { productService } from "../Services/product";
import type { Product, ProductVariant } from "../types/product";
import type { BusinessType } from "../types/businessTypes";
import { formatCurrency } from "../lib/currency";

const retailTypes: BusinessType[] = ["fashion", "beauty", "electronics", "grocery_retail"];

interface VariantForm {
  product_id: number;
  name: string;
  sku: string;
  price: string;
  discount_price: string;
  stock: string;
  low_stock_threshold: string;
  is_active: boolean;
  sort_order: string;
  attributes: { key: string; value: string }[];
}

const blankForm = (productId = 0): VariantForm => ({
  product_id: productId,
  name: "",
  sku: "",
  price: "",
  discount_price: "",
  stock: "0",
  low_stock_threshold: "5",
  is_active: true,
  sort_order: "0",
  attributes: [{ key: "", value: "" }],
});

export function ProductVariantsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | "all">("all");
  const [form, setForm] = useState<VariantForm>(blankForm());
  const [editing, setEditing] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const load = async () => {
    try {
      setError(null);
      const [nextProducts, nextVariants] = await Promise.all([
        productService.getProducts(),
        productVariantService.all(),
      ]);
      setProducts(nextProducts);
      setVariants(nextVariants);
    } catch (cause) {
      setError(cause);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const businessType = user?.business?.business_type;
  const visibleVariants = selectedProductId === "all"
    ? variants
    : variants.filter((variant) => variant.product_id === selectedProductId);

  const grouped = useMemo(() => products
    .map((product) => ({
      product,
      variants: visibleVariants.filter((variant) => variant.product_id === product.id),
    }))
    .filter((group) => selectedProductId === "all" ? group.variants.length > 0 : group.product.id === selectedProductId),
  [products, visibleVariants, selectedProductId]);

  if (!businessType || !retailTypes.includes(businessType)) {
    return <Navigate to="/dashboard" replace />;
  }

  const show = (variant?: ProductVariant, productId?: number) => {
    setError(null);
    setEditing(variant?.id ?? null);
    setForm(variant ? {
      product_id: variant.product_id,
      name: variant.name,
      sku: variant.sku ?? "",
      price: variant.price ?? "",
      discount_price: variant.discount_price ?? "",
      stock: String(variant.stock),
      low_stock_threshold: String(variant.low_stock_threshold),
      is_active: variant.is_active,
      sort_order: String(variant.sort_order),
      attributes: Object.entries(variant.attributes).length
        ? Object.entries(variant.attributes).map(([key, value]) => ({ key, value }))
        : [{ key: "", value: "" }],
    } : blankForm(productId ?? (selectedProductId === "all" ? products[0]?.id : selectedProductId) ?? 0));
    setOpen(true);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const payload: ProductVariantPayload = {
      product_id: form.product_id,
      name: form.name.trim(),
      sku: form.sku.trim() || null,
      price: form.price === "" ? null : Number(form.price),
      discount_price: form.discount_price === "" ? null : Number(form.discount_price),
      stock: Number(form.stock),
      low_stock_threshold: Number(form.low_stock_threshold),
      is_active: form.is_active,
      sort_order: Number(form.sort_order),
      attributes: Object.fromEntries(form.attributes
        .filter((attribute) => attribute.key.trim() && attribute.value.trim())
        .map((attribute) => [attribute.key.trim(), attribute.value.trim()])),
    };

    try {
      if (editing) {
        const { product_id: _productId, ...updatePayload } = payload;
        await productVariantService.update(editing, updatePayload);
      } else {
        await productVariantService.create(payload);
      }
      setOpen(false);
      await load();
    } catch (cause) {
      setError(cause);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (variant: ProductVariant) => {
    if (!confirm(`Delete variant "${variant.name}"? Its stock history will remain on existing orders.`)) return;
    try {
      await productVariantService.remove(variant.id);
      setVariants((current) => current.filter((item) => item.id !== variant.id));
    } catch (cause) {
      setError(cause);
    }
  };

  return (
    <div>
      <PageHeader
        title="Product variants"
        description="Track each size, color, shade, model, weight, or pack as its own SKU."
        action={products.length > 0
          ? <button className={buttonPrimary} onClick={() => show()}><Plus size={17} /> New variant</button>
          : undefined}
      />
      <ErrorMessage error={error} />

      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-50 text-purple-600"><Layers3 size={19} /></div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">Filter by product</p>
          <p className="text-xs text-slate-500">A product’s storefront stock is calculated from its active variants.</p>
        </div>
        <select
          className={`${inputClass} mt-0 sm:w-64`}
          value={selectedProductId}
          onChange={(event) => setSelectedProductId(event.target.value === "all" ? "all" : Number(event.target.value))}
        >
          <option value="all">All products</option>
          {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading variants…</div>
      ) : products.length === 0 ? (
        <EmptyState
          title="Create a product first"
          description="Variants belong to products. Add your first product, then return here to create its options."
        />
      ) : grouped.length === 0 ? (
        <EmptyState
          title="No variants yet"
          description="Start with options such as Black / Medium, 500 g, or Rose / 30 ml."
          action={<button className={buttonPrimary} onClick={() => show()}><Plus size={17} /> Create first variant</button>}
        />
      ) : (
        <div className="space-y-5">
          {grouped.map(({ product, variants: productVariants }) => (
            <section key={product.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                {product.thumbnail
                  ? <img src={product.thumbnail} alt="" className="h-11 w-11 rounded-xl object-cover" />
                  : <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-400"><Boxes size={19} /></span>}
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold text-slate-900">{product.name}</h2>
                  <p className="text-xs text-slate-500">{productVariants.length} variant{productVariants.length === 1 ? "" : "s"} · {productVariants.reduce((sum, variant) => sum + variant.stock, 0)} total units</p>
                </div>
                <button className={buttonSecondary} onClick={() => show(undefined, product.id)}><Plus size={15} /> Add variant</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Variant</th>
                      <th className="px-5 py-3 font-semibold">SKU</th>
                      <th className="px-5 py-3 font-semibold">Price</th>
                      <th className="px-5 py-3 font-semibold">Stock</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                      <th className="px-5 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {productVariants.map((variant) => (
                      <tr key={variant.id} className="hover:bg-slate-50/70">
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-slate-900">{variant.name}</p>
                          {Object.keys(variant.attributes).length > 0 && <p className="mt-0.5 text-xs text-slate-500">{Object.entries(variant.attributes).map(([key, value]) => `${key}: ${value}`).join(" · ")}</p>}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs text-slate-600">{variant.sku || "—"}</td>
                        <td className="px-5 py-3.5 font-semibold text-slate-800">{formatCurrency(variant.effective_price ?? variant.price ?? product.discount_price ?? product.price, user?.business?.currency)}</td>
                        <td className="px-5 py-3.5">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            variant.stock === 0 ? "bg-rose-50 text-rose-700"
                              : variant.is_low_stock ? "bg-amber-50 text-amber-700"
                                : "bg-emerald-50 text-emerald-700"
                          }`}>{variant.stock} units</span>
                        </td>
                        <td className="px-5 py-3.5 text-xs font-medium text-slate-600">{variant.is_active ? "Active" : "Hidden"}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex justify-end gap-1">
                            <button className="rounded-lg p-2 text-slate-400 hover:bg-purple-50 hover:text-purple-600" onClick={() => show(variant)} aria-label={`Edit ${variant.name}`}><Pencil size={16} /></button>
                            <button className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600" onClick={() => void remove(variant)} aria-label={`Delete ${variant.name}`}><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/45 p-4">
          <form onSubmit={submit} className="my-6 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start gap-4 border-b border-slate-200 px-6 py-5">
              <div className="flex-1"><h2 className="text-lg font-semibold">{editing ? "Edit variant" : "New product variant"}</h2><p className="mt-1 text-sm text-slate-500">Give this sellable option its own identity, price, and stock.</p></div>
              <button type="button" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" onClick={() => setOpen(false)} aria-label="Close"><X size={20} /></button>
            </div>
            <div className="max-h-[70vh] space-y-5 overflow-y-auto p-6">
              <label className="block text-sm font-medium text-slate-700">Product
                <select required disabled={Boolean(editing)} className={inputClass} value={form.product_id} onChange={(event) => setForm({ ...form, product_id: Number(event.target.value) })}>
                  <option value={0} disabled>Select product</option>
                  {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                </select>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">Variant name<input required maxLength={150} className={inputClass} placeholder="e.g. Black / Medium" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
                <label className="text-sm font-medium text-slate-700">SKU<input maxLength={100} className={inputClass} placeholder="e.g. TEE-BLK-M" value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} /></label>
              </div>

              <section className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between"><div><h3 className="text-sm font-semibold">Option values</h3><p className="mt-0.5 text-xs text-slate-500">Examples: Color = Black, Size = M, Weight = 500 g.</p></div><button type="button" className="text-xs font-semibold text-purple-600" onClick={() => setForm({ ...form, attributes: [...form.attributes, { key: "", value: "" }] })}>+ Add option</button></div>
                <div className="mt-3 space-y-2">
                  {form.attributes.map((attribute, index) => (
                    <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                      <input className={inputClass} placeholder="Option name" value={attribute.key} onChange={(event) => setForm({ ...form, attributes: form.attributes.map((item, itemIndex) => itemIndex === index ? { ...item, key: event.target.value } : item) })} />
                      <input className={inputClass} placeholder="Value" value={attribute.value} onChange={(event) => setForm({ ...form, attributes: form.attributes.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item) })} />
                      <button type="button" className="mt-1.5 rounded-lg p-2 text-slate-400 hover:text-rose-600" disabled={form.attributes.length === 1} onClick={() => setForm({ ...form, attributes: form.attributes.filter((_, itemIndex) => itemIndex !== index) })}><Trash2 size={17} /></button>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">Variant price <span className="font-normal text-slate-400">(optional)</span><input type="number" min={0} step="0.01" className={inputClass} placeholder="Uses product price" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></label>
                <label className="text-sm font-medium text-slate-700">Discount price <span className="font-normal text-slate-400">(optional)</span><input type="number" min={0} step="0.01" className={inputClass} value={form.discount_price} onChange={(event) => setForm({ ...form, discount_price: event.target.value })} /></label>
                <label className="text-sm font-medium text-slate-700">Stock quantity<input required type="number" min={0} className={inputClass} value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} /></label>
                <label className="text-sm font-medium text-slate-700">Low-stock alert at<input required type="number" min={0} className={inputClass} value={form.low_stock_threshold} onChange={(event) => setForm({ ...form, low_stock_threshold: event.target.value })} /></label>
              </div>
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm"><input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} /><span><b className="block text-slate-800">Active variant</b><span className="text-xs text-slate-500">Customers can select it while it has stock.</span></span></label>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4"><button type="button" className={buttonSecondary} onClick={() => setOpen(false)}>Cancel</button><button disabled={saving || !form.product_id} className={buttonPrimary}>{saving ? "Saving…" : "Save variant"}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
