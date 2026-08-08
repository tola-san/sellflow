import { useEffect, useState } from "react";
import { Check, ListPlus, Pencil, Plus, Trash2, X } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/Auth/AuthContext";
import { EmptyState, ErrorMessage, PageHeader, buttonPrimary, buttonSecondary, inputClass } from "../components/dashboard/DashboardUI";
import { modifierGroupService, type ModifierGroup, type ModifierGroupPayload } from "../Services/modifierGroups";
import { productService } from "../Services/product";
import type { Product } from "../types/product";
import { formatCurrency } from "../lib/currency";

const blank: ModifierGroupPayload = {
  name: "",
  selection_type: "single",
  is_required: false,
  min_select: 0,
  max_select: 1,
  is_active: true,
  product_ids: [],
  options: [{ name: "", price_adjustment: 0, is_active: true }],
};

export function AddOnsPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<ModifierGroup[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ModifierGroupPayload>(blank);
  const [editing, setEditing] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const load = async () => {
    try {
      const [nextGroups, nextProducts] = await Promise.all([modifierGroupService.all(), productService.getProducts()]);
      setGroups(nextGroups);
      setProducts(nextProducts);
    } catch (cause) {
      setError(cause);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  if (user?.business?.business_type !== "food_beverage") return <Navigate to="/dashboard" replace />;

  const show = (group?: ModifierGroup) => {
    setError(null);
    setEditing(group?.id ?? null);
    setForm(group ? {
      name: group.name,
      selection_type: group.selection_type,
      is_required: group.is_required,
      min_select: group.min_select,
      max_select: group.max_select,
      is_active: group.is_active,
      product_ids: group.product_ids,
      options: group.options.map((option) => ({
        name: option.name,
        price_adjustment: option.price_adjustment,
        is_active: option.is_active,
      })),
    } : structuredClone(blank));
    setOpen(true);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editing) await modifierGroupService.update(editing, form);
      else await modifierGroupService.create(form);
      setOpen(false);
      await load();
    } catch (cause) {
      setError(cause);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (group: ModifierGroup) => {
    if (!confirm(`Delete "${group.name}"? Existing orders keep their saved add-on details.`)) return;
    try {
      await modifierGroupService.remove(group.id);
      setGroups((current) => current.filter((item) => item.id !== group.id));
    } catch (cause) {
      setError(cause);
    }
  };

  return (
    <div>
      <PageHeader
        title="Add-ons & modifiers"
        description="Create extras, sizes, and preparation choices, then assign them to menu items."
        action={<button className={buttonPrimary} onClick={() => show()}><Plus size={17} /> New add-on group</button>}
      />
      <ErrorMessage error={error} />

      {loading ? <div className="rounded-2xl border bg-white p-10 text-center text-sm text-slate-500">Loading add-ons…</div>
        : groups.length === 0 ? <EmptyState title="No add-ons yet" description="Start with a group such as Size, Sugar level, Toppings, or Extra protein." action={<button className={buttonPrimary} onClick={() => show()}><Plus size={17} /> Create first group</button>} />
          : <div className="grid gap-5 lg:grid-cols-2">
            {groups.map((group) => (
              <article key={group.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-purple-50 text-purple-600"><ListPlus size={21} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{group.name}</h2>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs capitalize text-slate-600">{group.selection_type}</span>
                      {group.is_required && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">Required</span>}
                      {!group.is_active && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">Hidden</span>}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{group.product_ids.length} menu item(s)</p>
                  </div>
                  <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-purple-600" onClick={() => show(group)} aria-label={`Edit ${group.name}`}><Pencil size={17} /></button>
                  <button className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600" onClick={() => void remove(group)} aria-label={`Delete ${group.name}`}><Trash2 size={17} /></button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.options.map((option) => <span key={option.id} className="rounded-lg border border-slate-200 px-2.5 py-1 text-sm text-slate-700">{option.name}{Number(option.price_adjustment) > 0 && <b className="ml-1 text-emerald-600">+{formatCurrency(option.price_adjustment, user?.business?.currency)}</b>}</span>)}
                </div>
              </article>
            ))}
          </div>}

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/45 p-4">
          <form onSubmit={submit} className="my-6 w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center border-b px-6 py-4">
              <div><h2 className="text-lg font-semibold">{editing ? "Edit add-on group" : "New add-on group"}</h2><p className="text-sm text-slate-500">Customers will choose these options on the menu item page.</p></div>
              <button type="button" className="ml-auto p-2 text-slate-400" onClick={() => setOpen(false)}><X /></button>
            </div>
            <div className="max-h-[70vh] space-y-6 overflow-y-auto p-6">
              <label className="block text-sm font-medium">Group name<input required maxLength={100} className={inputClass} placeholder="e.g. Sugar level" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium">Selection type<select className={inputClass} value={form.selection_type} onChange={(e) => setForm({ ...form, selection_type: e.target.value as "single" | "multiple", max_select: e.target.value === "single" ? 1 : form.max_select })}><option value="single">Choose one</option><option value="multiple">Choose multiple</option></select></label>
                <label className="flex items-center gap-3 self-end rounded-xl border border-slate-200 p-3 text-sm"><input type="checkbox" checked={form.is_required} onChange={(e) => setForm({ ...form, is_required: e.target.checked, min_select: e.target.checked ? Math.max(1, form.min_select) : 0 })} /> Required choice</label>
              </div>
              {form.selection_type === "multiple" && <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Minimum choices<input className={inputClass} type="number" min={0} max={20} value={form.min_select} onChange={(e) => setForm({ ...form, min_select: Number(e.target.value) })} /></label><label className="text-sm font-medium">Maximum choices<input className={inputClass} type="number" min={1} max={20} value={form.max_select ?? ""} onChange={(e) => setForm({ ...form, max_select: e.target.value ? Number(e.target.value) : null })} /></label></div>}

              <section><h3 className="text-sm font-semibold">Options</h3><div className="mt-3 space-y-3">
                {form.options.map((option, index) => <div key={index} className="grid grid-cols-[1fr_130px_auto] gap-2"><input required className={inputClass} placeholder="Option name" value={option.name} onChange={(e) => setForm({ ...form, options: form.options.map((item, i) => i === index ? { ...item, name: e.target.value } : item) })} /><input required className={inputClass} type="number" min={0} step="0.01" placeholder="Extra price" value={option.price_adjustment} onChange={(e) => setForm({ ...form, options: form.options.map((item, i) => i === index ? { ...item, price_adjustment: e.target.value } : item) })} /><button type="button" className="mt-1.5 p-2 text-slate-400 hover:text-rose-600" disabled={form.options.length === 1} onClick={() => setForm({ ...form, options: form.options.filter((_, i) => i !== index) })}><Trash2 size={18} /></button></div>)}
                <button type="button" className={buttonSecondary} onClick={() => setForm({ ...form, options: [...form.options, { name: "", price_adjustment: 0, is_active: true }] })}><Plus size={16} /> Add option</button>
              </div></section>

              <section><h3 className="text-sm font-semibold">Assign to menu items</h3><p className="mt-1 text-xs text-slate-500">Leave everything unchecked to save the group without showing it to customers.</p><div className="mt-3 grid max-h-48 gap-2 overflow-y-auto rounded-xl border border-slate-200 p-3 sm:grid-cols-2">
                {products.map((product) => <label key={product.id} className="flex items-center gap-2 rounded-lg p-2 text-sm hover:bg-slate-50"><input type="checkbox" checked={form.product_ids.includes(product.id)} onChange={() => setForm({ ...form, product_ids: form.product_ids.includes(product.id) ? form.product_ids.filter((id) => id !== product.id) : [...form.product_ids, product.id] })} /> {product.name}</label>)}
              </div></section>
              <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /><Check size={16} className="text-emerald-600" /> Active and visible to customers</label>
            </div>
            <div className="flex justify-end gap-3 border-t px-6 py-4"><button type="button" className={buttonSecondary} onClick={() => setOpen(false)}>Cancel</button><button disabled={saving} className={buttonPrimary}>{saving ? "Saving…" : "Save group"}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
