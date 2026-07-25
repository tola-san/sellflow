import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Clock3, EyeOff, Search, TimerReset, Utensils, X } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/Auth/AuthContext";
import { ErrorMessage, PageHeader, buttonPrimary, buttonSecondary, inputClass } from "../components/dashboard/DashboardUI";
import { menuAvailabilityService, type AvailabilitySchedule, type AvailabilityStatus } from "../Services/menuAvailability";
import type { Product } from "../types/product";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const statusMeta: Record<AvailabilityStatus, { label: string; classes: string }> = {
  always: { label: "Available", classes: "bg-emerald-50 text-emerald-700" },
  scheduled: { label: "Scheduled", classes: "bg-amber-50 text-amber-700" },
  sold_out: { label: "Sold out", classes: "bg-rose-50 text-rose-700" },
  hidden: { label: "Hidden", classes: "bg-slate-100 text-slate-600" },
};
const defaultSchedule: AvailabilitySchedule = {
  name: "Breakfast",
  days: [0, 1, 2, 3, 4, 5, 6],
  start_time: "06:30",
  end_time: "11:00",
  is_active: true,
};

export function MenuAvailabilityPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AvailabilityStatus | "all">("all");
  const [editing, setEditing] = useState<Product | null>(null);
  const [editStatus, setEditStatus] = useState<AvailabilityStatus>("always");
  const [schedules, setSchedules] = useState<AvailabilitySchedule[]>([defaultSchedule]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const load = async () => {
    try {
      setItems(await menuAvailabilityService.all());
    } catch (cause) {
      setError(cause);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => items.filter((item) =>
    (status === "all" || item.availability_status === status)
    && item.name.toLowerCase().includes(search.toLowerCase()),
  ), [items, search, status]);

  if (user?.business?.business_type !== "food_beverage") return <Navigate to="/dashboard" replace />;

  const summary = (value: AvailabilityStatus) => items.filter((item) => item.availability_status === value).length;
  const showEditor = (item: Product) => {
    setEditing(item);
    setEditStatus(item.availability_status);
    setSchedules(item.availability_schedules?.length ? item.availability_schedules : [structuredClone(defaultSchedule)]);
    setError(null);
  };
  const quickUpdate = async (item: Product, next: AvailabilityStatus) => {
    try {
      const updated = await menuAvailabilityService.update(
        item.id,
        next,
        next === "scheduled" ? (item.availability_schedules?.length ? item.availability_schedules : [defaultSchedule]) : [],
      );
      setItems((current) => current.map((value) => value.id === item.id ? updated : value));
    } catch (cause) {
      setError(cause);
    }
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const updated = await menuAvailabilityService.update(editing.id, editStatus, editStatus === "scheduled" ? schedules : []);
      setItems((current) => current.map((value) => value.id === editing.id ? updated : value));
      setEditing(null);
    } catch (cause) {
      setError(cause);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Menu availability" description="Control when menu items are available to customers." />
      <ErrorMessage error={error} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={<Utensils />} label="Available now" value={items.filter((item) => item.is_available_now).length} color="emerald" />
        <Metric icon={<CalendarClock />} label="Scheduled" value={summary("scheduled")} color="amber" />
        <Metric icon={<TimerReset />} label="Sold out" value={summary("sold_out")} color="rose" />
        <Metric icon={<EyeOff />} label="Hidden" value={summary("hidden")} color="slate" />
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row">
          <label className="relative flex-1"><Search className="absolute left-3 top-3.5 text-slate-400" size={17} /><input className={`${inputClass} !mt-0 pl-10`} placeholder="Search menu items..." value={search} onChange={(e) => setSearch(e.target.value)} /></label>
          <select className={`${inputClass} !mt-0 sm:w-48`} value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
            <option value="all">All statuses</option>
            {Object.entries(statusMeta).map(([value, meta]) => <option key={value} value={value}>{meta.label}</option>)}
          </select>
        </div>
        {loading ? <div className="p-12 text-center text-sm text-slate-500">Loading menu availability…</div> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Menu item</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Current status</th><th className="px-5 py-3">Schedule</th><th className="px-5 py-3 text-right">Quick action</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const meta = statusMeta[item.availability_status];
                  return <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4"><div className="flex items-center gap-3">{item.thumbnail ? <img src={item.thumbnail} className="h-11 w-11 rounded-xl object-cover" alt="" /> : <span className="grid h-11 w-11 place-items-center rounded-xl bg-purple-50 text-purple-500"><Utensils size={19} /></span>}<div><p className="font-semibold text-slate-900">{item.name}</p><p className="text-xs text-slate-500">{item.stock} in stock</p></div></div></td>
                    <td className="px-5 py-4 text-slate-600">{item.category?.name || "—"}</td>
                    <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${meta.classes}`}>{meta.label}</span></td>
                    <td className="px-5 py-4 text-slate-600">{item.availability_status === "scheduled" ? item.availability_schedules?.map((schedule) => `${schedule.name} ${schedule.start_time.slice(0, 5)}–${schedule.end_time.slice(0, 5)}`).join(", ") || "No schedule" : item.availability_status === "always" ? "All day" : "—"}</td>
                    <td className="px-5 py-4"><div className="flex justify-end gap-2"><select className="rounded-lg border border-slate-200 px-2 py-2 text-xs" value={item.availability_status} onChange={(e) => void quickUpdate(item, e.target.value as AvailabilityStatus)}>{Object.entries(statusMeta).map(([value, valueMeta]) => <option key={value} value={value}>{valueMeta.label}</option>)}</select><button className={buttonSecondary} onClick={() => showEditor(item)}><Clock3 size={15} /> Schedule</button></div></td>
                  </tr>;
                })}
              </tbody>
            </table>
            {!filtered.length && <p className="p-10 text-center text-sm text-slate-500">No menu items match these filters.</p>}
          </div>
        )}
      </section>

      {editing && <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/45 p-4">
        <form onSubmit={save} className="my-6 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center border-b px-6 py-4"><div><h2 className="text-lg font-semibold">{editing.name}</h2><p className="text-sm text-slate-500">Availability and recurring time slots</p></div><button type="button" className="ml-auto p-2 text-slate-400" onClick={() => setEditing(null)}><X /></button></div>
          <div className="max-h-[70vh] space-y-5 overflow-y-auto p-6">
            <label className="block text-sm font-medium">Availability status<select className={inputClass} value={editStatus} onChange={(e) => setEditStatus(e.target.value as AvailabilityStatus)}>{Object.entries(statusMeta).map(([value, meta]) => <option key={value} value={value}>{meta.label}</option>)}</select></label>
            {editStatus === "scheduled" && <section><div className="flex items-center justify-between"><h3 className="font-semibold">Time slots</h3><button type="button" className={buttonSecondary} onClick={() => setSchedules([...schedules, { ...defaultSchedule, name: `Schedule ${schedules.length + 1}` }])}>Add time slot</button></div>
              <div className="mt-3 space-y-4">{schedules.map((schedule, index) => <div key={index} className="rounded-xl border border-slate-200 p-4">
                <div className="grid gap-3 sm:grid-cols-[1fr_130px_130px_auto]"><input required className={inputClass} value={schedule.name} onChange={(e) => setSchedules(schedules.map((item, i) => i === index ? { ...item, name: e.target.value } : item))} /><input required type="time" className={inputClass} value={schedule.start_time.slice(0, 5)} onChange={(e) => setSchedules(schedules.map((item, i) => i === index ? { ...item, start_time: e.target.value } : item))} /><input required type="time" className={inputClass} value={schedule.end_time.slice(0, 5)} onChange={(e) => setSchedules(schedules.map((item, i) => i === index ? { ...item, end_time: e.target.value } : item))} /><button type="button" className="mt-1.5 p-2 text-rose-500" disabled={schedules.length === 1} onClick={() => setSchedules(schedules.filter((_, i) => i !== index))}>Remove</button></div>
                <div className="mt-3 flex flex-wrap gap-2">{days.map((day, dayIndex) => <button key={day} type="button" onClick={() => setSchedules(schedules.map((item, i) => i !== index ? item : { ...item, days: item.days.includes(dayIndex) ? item.days.filter((value) => value !== dayIndex) : [...item.days, dayIndex] }))} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${schedule.days.includes(dayIndex) ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600"}`}>{day}</button>)}</div>
              </div>)}</div>
            </section>}
          </div>
          <div className="flex justify-end gap-3 border-t px-6 py-4"><button type="button" className={buttonSecondary} onClick={() => setEditing(null)}>Cancel</button><button className={buttonPrimary} disabled={saving}>{saving ? "Saving…" : "Save changes"}</button></div>
        </form>
      </div>}
    </div>
  );
}

function Metric({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: "emerald" | "amber" | "rose" | "slate" }) {
  const colors = { emerald: "bg-emerald-50 text-emerald-600", amber: "bg-amber-50 text-amber-600", rose: "bg-rose-50 text-rose-600", slate: "bg-slate-100 text-slate-500" };
  return <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className={`grid h-12 w-12 place-items-center rounded-full ${colors[color]}`}>{icon}</span><div><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-bold">{value}</p></div></div>;
}
