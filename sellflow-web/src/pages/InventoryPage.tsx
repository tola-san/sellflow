import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AlertTriangle, Boxes, History, PackageCheck, Search, SlidersHorizontal, X } from "lucide-react";
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
import { inventoryService, type InventoryData, type InventoryItem } from "../Services/inventory";
import type { BusinessType } from "../types/businessTypes";

const retailTypes: BusinessType[] = ["fashion", "beauty", "electronics", "grocery_retail"];

export function InventoryPage() {
  const { user } = useAuth();
  const [data, setData] = useState<InventoryData | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState("0");
  const [threshold, setThreshold] = useState("5");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const load = async () => {
    try {
      setError(null);
      setData(await inventoryService.get());
    } catch (cause) {
      setError(cause);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const businessType = user?.business?.business_type;
  const items = useMemo(() => (data?.items ?? []).filter((item) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query
      || item.product_name.toLowerCase().includes(query)
      || item.variant_name?.toLowerCase().includes(query)
      || item.sku?.toLowerCase().includes(query);
    const matchesFilter = filter === "all"
      || (filter === "out" ? item.stock === 0 : item.stock <= item.low_stock_threshold);
    return matchesSearch && matchesFilter;
  }), [data, search, filter]);

  if (!businessType || !retailTypes.includes(businessType)) {
    return <Navigate to="/dashboard" replace />;
  }

  const openAdjustment = (item: InventoryItem) => {
    setEditing(item);
    setQuantity(String(item.stock));
    setThreshold(String(item.low_stock_threshold));
    setReason("");
    setError(null);
  };

  const saveAdjustment = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      await inventoryService.adjust({
        product_id: editing.product_id,
        product_variant_id: editing.product_variant_id,
        quantity: Number(quantity),
        low_stock_threshold: Number(threshold),
        reason: reason.trim() || null,
      });
      setEditing(null);
      await load();
    } catch (cause) {
      setError(cause);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Monitor stock by product and variant, set low-stock thresholds, and keep an audit trail."
      />
      <ErrorMessage error={error} />

      {data && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <Stat label="Products" value={data.summary.products} icon={<Boxes size={18} />} tone="purple" />
          <Stat label="Variants" value={data.summary.variants} icon={<SlidersHorizontal size={18} />} tone="blue" />
          <Stat label="Units in stock" value={data.summary.units} icon={<PackageCheck size={18} />} tone="emerald" />
          <Stat label="Low stock" value={data.summary.low_stock} icon={<AlertTriangle size={18} />} tone="amber" />
          <Stat label="Out of stock" value={data.summary.out_of_stock} icon={<X size={18} />} tone="rose" />
        </div>
      )}

      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className={`${inputClass} mt-0 pl-9`} placeholder="Search product, variant, or SKU" value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
        <div className="flex rounded-xl bg-slate-100 p-1">
          {([
            ["all", "All stock"],
            ["low", "Low stock"],
            ["out", "Out of stock"],
          ] as const).map(([value, label]) => (
            <button key={value} className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${filter === value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`} onClick={() => setFilter(value)}>{label}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading inventory…</div>
      ) : !data || data.items.length === 0 ? (
        <EmptyState title="No inventory yet" description="Create products first. Products with variants will appear as separate stock rows." />
      ) : items.length === 0 ? (
        <EmptyState title="No matching stock" description="Try a different search or inventory filter." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">SKU</th>
                  <th className="px-5 py-3 font-semibold">Available</th>
                  <th className="px-5 py-3 font-semibold">Alert level</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3"><span className="sr-only">Action</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => {
                  const stockStatus = item.stock === 0
                    ? { label: "Out of stock", color: "bg-rose-50 text-rose-700", bar: "bg-rose-500" }
                    : item.stock <= item.low_stock_threshold
                      ? { label: "Low stock", color: "bg-amber-50 text-amber-700", bar: "bg-amber-500" }
                      : { label: "Healthy", color: "bg-emerald-50 text-emerald-700", bar: "bg-emerald-500" };
                  const progress = Math.min(100, item.stock / Math.max(item.low_stock_threshold * 3, 1) * 100);
                  return (
                    <tr key={item.key} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {item.thumbnail
                            ? <img src={item.thumbnail} alt="" className="h-10 w-10 rounded-xl object-cover" />
                            : <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-400"><Boxes size={17} /></span>}
                          <div className="min-w-0"><p className="font-semibold text-slate-900">{item.product_name}</p>{item.variant_name && <p className="mt-0.5 text-xs text-slate-500">{item.variant_name}{Object.keys(item.attributes).length ? ` · ${Object.values(item.attributes).join(" / ")}` : ""}</p>}</div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-slate-600">{item.sku || "—"}</td>
                      <td className="px-5 py-4">
                        <div className="w-36"><div className="flex items-baseline justify-between"><b className="text-slate-900">{item.stock}</b><span className="text-[10px] text-slate-400">units</span></div><div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${stockStatus.bar}`} style={{ width: `${progress}%` }} /></div></div>
                      </td>
                      <td className="px-5 py-4 text-slate-600">≤ {item.low_stock_threshold} units</td>
                      <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${stockStatus.color}`}>{stockStatus.label}</span>{!item.is_active && <span className="ml-2 text-xs text-slate-400">Hidden</span>}</td>
                      <td className="px-5 py-4 text-right"><button className={buttonSecondary} onClick={() => openAdjustment(item)}>Adjust stock</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data && data.movements.length > 0 && (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2"><History size={18} className="text-purple-600" /><h2 className="font-semibold text-slate-900">Recent stock activity</h2></div>
          <div className="mt-4 divide-y divide-slate-100">
            {data.movements.slice(0, 8).map((movement) => (
              <div key={movement.id} className="flex flex-col gap-2 py-3 text-sm sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1"><p className="font-medium text-slate-800">{movement.product.name}{movement.variant ? ` · ${movement.variant.name}` : ""}</p><p className="mt-0.5 text-xs text-slate-500">{movement.reason || movement.type}{movement.reference ? ` · ${movement.reference}` : ""}</p></div>
                <span className={`font-semibold ${movement.quantity_delta > 0 ? "text-emerald-600" : movement.quantity_delta < 0 ? "text-rose-600" : "text-slate-500"}`}>{movement.quantity_delta > 0 ? "+" : ""}{movement.quantity_delta}</span>
                <span className="text-xs text-slate-400">{movement.quantity_before} → {movement.quantity_after}</span>
                <time className="text-xs text-slate-400">{new Date(movement.created_at).toLocaleString()}</time>
              </div>
            ))}
          </div>
        </section>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4">
          <form onSubmit={saveAdjustment} className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start gap-3 border-b border-slate-200 px-5 py-4"><div className="flex-1"><h2 className="font-semibold text-slate-900">Adjust stock</h2><p className="mt-1 text-sm text-slate-500">{editing.product_name}{editing.variant_name ? ` · ${editing.variant_name}` : ""}</p></div><button type="button" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100" onClick={() => setEditing(null)}><X size={19} /></button></div>
            <div className="space-y-4 p-5">
              <label className="block text-sm font-medium text-slate-700">New quantity<input required autoFocus type="number" min={0} className={inputClass} value={quantity} onChange={(event) => setQuantity(event.target.value)} /></label>
              <label className="block text-sm font-medium text-slate-700">Low-stock alert at<input required type="number" min={0} className={inputClass} value={threshold} onChange={(event) => setThreshold(event.target.value)} /></label>
              <label className="block text-sm font-medium text-slate-700">Reason <span className="font-normal text-slate-400">(optional)</span><input maxLength={255} className={inputClass} placeholder="Restock, correction, damaged stock…" value={reason} onChange={(event) => setReason(event.target.value)} /></label>
              <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">This change will be recorded in stock activity. Current quantity: <b className="text-slate-700">{editing.stock}</b>.</div>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4"><button type="button" className={buttonSecondary} onClick={() => setEditing(null)}>Cancel</button><button disabled={saving} className={buttonPrimary}>{saving ? "Saving…" : "Update inventory"}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, icon, tone }: { label: string; value: number; icon: ReactNode; tone: "purple" | "blue" | "emerald" | "amber" | "rose" }) {
  const colors = {
    purple: "bg-purple-50 text-purple-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><span className={`grid h-9 w-9 place-items-center rounded-xl ${colors[tone]}`}>{icon}</span><p className="mt-3 text-2xl font-bold text-slate-900">{value}</p><p className="text-xs text-slate-500">{label}</p></div>;
}
