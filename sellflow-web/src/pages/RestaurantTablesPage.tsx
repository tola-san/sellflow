import { useEffect, useMemo, useRef, useState } from "react";
import { Clock3, Download, Pencil, Plus, Printer, QrCode, RefreshCw, Trash2, UsersRound, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/Auth/AuthContext";
import { ErrorMessage, PageHeader, buttonPrimary, buttonSecondary, inputClass } from "../components/dashboard/DashboardUI";
import { restaurantTableService, type RestaurantTable, type RestaurantTablePayload, type RestaurantTableStatus } from "../Services/restaurantTables";
import { formatCurrency } from "../lib/currency";

const blank: RestaurantTablePayload = { name: "", area: "Main floor", capacity: 4, status: "available", is_active: true, sort_order: 0 };
const statusStyles: Record<RestaurantTableStatus, string> = {
  available: "bg-emerald-50 text-emerald-700",
  occupied: "bg-orange-50 text-orange-700",
  reserved: "bg-blue-50 text-blue-700",
  inactive: "bg-slate-100 text-slate-600",
};

export function RestaurantTablesPage() {
  const { user } = useAuth();
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [area, setArea] = useState("all");
  const [status, setStatus] = useState<RestaurantTableStatus | "all">("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<RestaurantTablePayload>(blank);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    try {
      const next = await restaurantTableService.all();
      setTables(next);
      setSelectedId((current) => current ?? next[0]?.id ?? null);
    } catch (cause) {
      setError(cause);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void load(); }, []);
  const selected = tables.find((table) => table.id === selectedId) || null;
  const areas = useMemo(() => [...new Set(tables.map((table) => table.area).filter(Boolean))] as string[], [tables]);
  const filtered = tables.filter((table) => (area === "all" || table.area === area) && (status === "all" || table.status === status));

  if (user?.business?.business_type !== "food_beverage") return <Navigate to="/dashboard" replace />;

  const qrUrl = selected ? `${window.location.origin}/store/${user.business.slug}?table=${selected.qr_token}` : "";
  const show = (table?: RestaurantTable) => {
    setEditing(table?.id ?? null);
    setForm(table ? { name: table.name, area: table.area, capacity: table.capacity, status: table.status, is_active: table.is_active, sort_order: table.sort_order } : { ...blank, sort_order: tables.length });
    setOpen(true);
    setError(null);
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editing) await restaurantTableService.update(editing, form);
      else await restaurantTableService.create(form);
      setOpen(false);
      await load();
    } catch (cause) {
      setError(cause);
    } finally {
      setSaving(false);
    }
  };
  const remove = async (table: RestaurantTable) => {
    if (!confirm(`Delete ${table.name}? Its old orders will keep their history.`)) return;
    try {
      await restaurantTableService.remove(table.id);
      setTables((current) => current.filter((item) => item.id !== table.id));
      if (selectedId === table.id) setSelectedId(null);
    } catch (cause) {
      setError(cause);
    }
  };
  const regenerate = async () => {
    if (!selected || !confirm(`Regenerate the QR code for ${selected.name}? The old printed code will stop working.`)) return;
    try {
      const updated = await restaurantTableService.regenerateQr(selected.id);
      setTables((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (cause) {
      setError(cause);
    }
  };
  const downloadQr = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg || !selected) return;
    const source = new XMLSerializer().serializeToString(svg);
    const imageUrl = URL.createObjectURL(new Blob([source], { type: "image/svg+xml" }));
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, 1024, 1024);
      context.drawImage(image, 64, 64, 896, 896);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${selected.name.toLowerCase().replace(/\s+/g, "-")}-qr.png`;
        link.click();
        URL.revokeObjectURL(link.href);
      }, "image/png");
      URL.revokeObjectURL(imageUrl);
    };
    image.src = imageUrl;
  };
  const printQr = () => {
    const svg = qrRef.current?.innerHTML;
    if (!svg || !selected) return;
    const popup = window.open("", "_blank", "width=640,height=760");
    popup?.document.write(`<html><head><title>${selected.name} QR code</title><style>body{font-family:Arial;text-align:center;padding:48px}svg{width:360px;height:360px}p{color:#475569}</style></head><body><h1>${selected.name}</h1><p>${selected.area || "Restaurant"} · Scan to order</p>${svg}<p>${qrUrl}</p><script>window.onload=()=>window.print()</script></body></html>`);
    popup?.document.close();
  };

  return <div>
    <PageHeader title="Tables & QR codes" description="Manage dine-in tables and create QR ordering links." action={<div className="flex gap-2"><button className={buttonSecondary} disabled={!selected} onClick={printQr}><Printer size={17} /> Print QR</button><button className={buttonPrimary} onClick={() => show()}><Plus size={17} /> Add table</button></div>} />
    <ErrorMessage error={error} />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Summary label="Total tables" value={tables.length} color="purple" />
      <Summary label="Available" value={tables.filter((table) => table.status === "available").length} color="emerald" />
      <Summary label="Occupied" value={tables.filter((table) => table.status === "occupied").length} color="orange" />
      <Summary label="Reserved" value={tables.filter((table) => table.status === "reserved").length} color="blue" />
    </div>

    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center"><h2 className="text-lg font-semibold">Restaurant floor</h2><div className="sm:ml-auto flex gap-2"><select className={`${inputClass} !mt-0`} value={area} onChange={(e) => setArea(e.target.value)}><option value="all">All areas</option>{areas.map((value) => <option key={value}>{value}</option>)}</select><select className={`${inputClass} !mt-0`} value={status} onChange={(e) => setStatus(e.target.value as typeof status)}><option value="all">All statuses</option>{Object.keys(statusStyles).map((value) => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}</select></div></div>
        {loading ? <p className="p-12 text-center text-sm text-slate-500">Loading tables…</p> : filtered.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((table) => <button key={table.id} onClick={() => setSelectedId(table.id)} className={`group rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${selectedId === table.id ? "border-purple-500 ring-2 ring-purple-100" : "border-slate-200"}`}>
            <div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-purple-50 text-purple-600"><UsersRound size={23} /></span><QrCode size={20} className="text-purple-500" /></div>
            <h3 className="mt-4 text-lg font-semibold">{table.name}</h3><p className="text-sm text-slate-500">{table.area || "No area"} · {table.capacity} seats</p>
            <div className="mt-4 flex items-center justify-between"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[table.status]}`}>{table.status}</span>{table.active_order && <span className="text-xs font-medium text-slate-600">{formatCurrency(table.active_order.total, user?.business?.currency)}</span>}</div>
          </button>)}
        </div> : <p className="p-12 text-center text-sm text-slate-500">No tables match these filters.</p>}
      </section>

      <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {selected ? <><div className="flex items-start"><div><h2 className="text-xl font-bold">{selected.name}</h2><p className="text-sm text-slate-500">{selected.area || "No area"} · {selected.capacity} seats</p></div><button className="ml-auto p-2 text-slate-400 hover:text-purple-600" onClick={() => show(selected)}><Pencil size={17} /></button><button className="p-2 text-slate-400 hover:text-rose-600" onClick={() => void remove(selected)}><Trash2 size={17} /></button></div>
          <span className={`mt-3 inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[selected.status]}`}>{selected.status}</span>
          {selected.active_order && <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50 p-4"><p className="text-xs font-semibold uppercase text-orange-600">Current order</p><p className="mt-1 font-mono font-semibold">{selected.active_order.order_number}</p><div className="mt-2 flex items-center justify-between text-sm"><span className="flex items-center gap-1 text-slate-500"><Clock3 size={14} /> {selected.active_order.status}</span><strong>{formatCurrency(selected.active_order.total, user?.business?.currency)}</strong></div></div>}
          <div className="mt-6 border-t pt-5"><h3 className="font-semibold">QR ordering code</h3><div ref={qrRef} className="mx-auto mt-4 w-fit rounded-2xl border bg-white p-4"><QRCodeSVG value={qrUrl} size={190} level="H" marginSize={1} /></div><p className="mt-3 break-all text-center text-xs text-purple-600">{qrUrl}</p><div className="mt-4 grid grid-cols-2 gap-2"><button className={buttonSecondary} onClick={downloadQr}><Download size={16} /> Download PNG</button><button className={buttonSecondary} onClick={printQr}><Printer size={16} /> Print</button></div><button className={`${buttonSecondary} mt-2 w-full`} onClick={() => void regenerate()}><RefreshCw size={16} /> Regenerate code</button></div>
        </> : <div className="grid min-h-80 place-items-center text-center text-sm text-slate-500"><div><QrCode className="mx-auto mb-3 text-slate-300" size={50} />Select a table to view its QR code.</div></div>}
      </aside>
    </div>

    {open && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4"><form onSubmit={save} className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"><div className="flex items-center border-b px-6 py-4"><h2 className="text-lg font-semibold">{editing ? "Edit table" : "Add table"}</h2><button type="button" className="ml-auto p-2 text-slate-400" onClick={() => setOpen(false)}><X /></button></div><div className="grid gap-4 p-6 sm:grid-cols-2"><label className="text-sm font-medium">Table name<input required maxLength={80} className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label className="text-sm font-medium">Area<input maxLength={80} className={inputClass} value={form.area || ""} onChange={(e) => setForm({ ...form, area: e.target.value || null })} /></label><label className="text-sm font-medium">Capacity<input required type="number" min={1} max={100} className={inputClass} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></label><label className="text-sm font-medium">Status<select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as RestaurantTableStatus })}>{Object.keys(statusStyles).map((value) => <option key={value} value={value}>{value[0].toUpperCase() + value.slice(1)}</option>)}</select></label><label className="sm:col-span-2 flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> QR ordering link is active</label></div><div className="flex justify-end gap-3 border-t px-6 py-4"><button type="button" className={buttonSecondary} onClick={() => setOpen(false)}>Cancel</button><button className={buttonPrimary} disabled={saving}>{saving ? "Saving…" : "Save table"}</button></div></form></div>}
  </div>;
}

function Summary({ label, value, color }: { label: string; value: number; color: "purple" | "emerald" | "orange" | "blue" }) {
  const colors = { purple: "bg-purple-50 text-purple-600", emerald: "bg-emerald-50 text-emerald-600", orange: "bg-orange-50 text-orange-600", blue: "bg-blue-50 text-blue-600" };
  return <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className={`grid h-12 w-12 place-items-center rounded-full ${colors[color]}`}><UsersRound /></span><div><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-bold">{value}</p></div></div>;
}
