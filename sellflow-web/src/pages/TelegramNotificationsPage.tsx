import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BellRing, Bot, Check, Clock3, Copy, ExternalLink, LoaderCircle, MessageCircle, Megaphone, RefreshCw, ShieldCheck, Unplug, Users } from "lucide-react";
import { telegramNotificationService, type TelegramConnectionCode, type TelegramDestinationPurpose, type TelegramSettings } from "../Services/telegramNotifications";
import { useToast } from "../components/ui/ToastContext";

export function TelegramNotificationsPage() {
  const [settings, setSettings] = useState<TelegramSettings | null>(null);
  const [connection, setConnection] = useState<TelegramConnectionCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const loadSettings = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await telegramNotificationService.getSettings();
      setSettings(data);
      setError("");
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => { void loadSettings(); }, [loadSettings]);

  useEffect(() => {
    if (!connection) return;
    const interval = window.setInterval(() => void loadSettings(true), 3000);
    return () => window.clearInterval(interval);
  }, [connection, loadSettings]);

  useEffect(() => {
    if (connection && settings?.destinations.some((destination) => destination.purpose === connection.purpose)) setConnection(null);
  }, [connection, settings]);

  const generateCode = async (purpose: TelegramDestinationPurpose) => {
    setWorking(`connect:${purpose}`);
    try {
      setConnection(await telegramNotificationService.createConnectionCode(purpose));
      setError("");
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setWorking(null);
    }
  };

  const copyCommand = async () => {
    if (!connection) return;
    try {
      await navigator.clipboard.writeText(connection.command);
      showToast("Telegram connection command copied.");
    } catch {
      showToast("Could not copy the command.", "error");
    }
  };

  const updatePreference = async (key: "new_order_enabled" | "payment_enabled", value: boolean) => {
    if (!settings) return;
    const previous = settings;
    setSettings({ ...settings, [key]: value });
    try {
      setSettings(await telegramNotificationService.updateSettings({ [key]: value }));
    } catch (requestError) {
      setSettings(previous);
      showToast(errorMessage(requestError), "error");
    }
  };

  const sendTest = async (purpose: TelegramDestinationPurpose) => {
    setWorking(`test:${purpose}`);
    try {
      showToast(await telegramNotificationService.sendTest(purpose));
    } catch (requestError) {
      showToast(errorMessage(requestError), "error");
    } finally {
      setWorking(null);
    }
  };

  const disconnect = async (purpose: TelegramDestinationPurpose) => {
    if (!window.confirm("Disconnect this Telegram destination from SellFlow?")) return;
    setWorking(`disconnect:${purpose}`);
    try {
      setSettings(await telegramNotificationService.disconnect(purpose));
      setConnection(null);
      showToast("Telegram disconnected successfully.");
    } catch (requestError) {
      showToast(errorMessage(requestError), "error");
    } finally {
      setWorking(null);
    }
  };

  if (loading) {
    return <div className="grid min-h-[420px] place-items-center"><LoaderCircle className="animate-spin text-purple-600" size={34} /></div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-purple-600">Notifications</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Telegram alerts</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Connect your store to Telegram and test delivery before enabling real customer order alerts.</p>
        </div>
        <StatusBadge connected={Boolean(settings?.destinations.length || settings?.connected)} />
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {connection ? (
        <ConnectionInstructions connection={connection} onCopy={copyCommand} onRefresh={() => loadSettings(true)} />
      ) : (
        <DestinationGrid settings={settings!} working={working} onConnect={generateCode} onTest={sendTest} onDisconnect={disconnect} onPreferenceChange={updatePreference} />
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <InfoCard icon={ShieldCheck} title="Secure connection" text="Codes expire after ten minutes and work only once." />
        <InfoCard icon={RefreshCw} title="Automatic detection" text="This page checks for the completed connection every few seconds." />
        <InfoCard icon={BellRing} title="Checkout stays fast" text="Telegram delivery will run separately from customer checkout." />
      </div>
    </div>
  );
}

const destinationMeta = {
  sales_channel: { title: "Sales channel", text: "Publish products and promotions to subscribers.", icon: Megaphone },
  customer_group: { title: "Customer group", text: "Let customers use /start and /shop to open your store.", icon: Users },
  staff_group: { title: "Private staff group", text: "Receive new-order and payment alerts privately.", icon: ShieldCheck },
} satisfies Record<TelegramDestinationPurpose, { title: string; text: string; icon: typeof Bot }>;

function DestinationGrid({ settings, working, onConnect, onTest, onDisconnect, onPreferenceChange }: { settings: TelegramSettings; working: string | null; onConnect: (purpose: TelegramDestinationPurpose) => void; onTest: (purpose: TelegramDestinationPurpose) => void; onDisconnect: (purpose: TelegramDestinationPurpose) => void; onPreferenceChange: (key: "new_order_enabled" | "payment_enabled", value: boolean) => void }) {
  return <div className="grid gap-4 lg:grid-cols-3">{(Object.keys(destinationMeta) as TelegramDestinationPurpose[]).map((purpose) => {
    const meta = destinationMeta[purpose];
    const Icon = meta.icon;
    const destination = settings.destinations.find((item) => item.purpose === purpose) || (purpose === "staff_group" && settings.connected ? { chat_name: settings.chat_name || "Telegram chat", chat_type: "legacy", bot_is_admin: false, connected_at: settings.connected_at } : null);
    return <section key={purpose} className={`rounded-xl border bg-white p-6 shadow-sm ${destination ? "border-emerald-200" : "border-slate-200"}`}>
      <span className={`grid h-11 w-11 place-items-center rounded-xl ${destination ? "bg-emerald-100 text-emerald-700" : "bg-sky-50 text-sky-600"}`}><Icon size={22} /></span>
      <h2 className="mt-4 font-bold text-slate-950">{meta.title}</h2>
      <p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">{meta.text}</p>
      {destination ? <>
        <div className="mt-4 rounded-xl bg-emerald-50 p-3"><p className="text-xs font-semibold text-emerald-800">Connected</p><p className="mt-1 truncate text-sm text-slate-700">{destination.chat_name}</p></div>
        {purpose === "staff_group" && <div className="mt-3"><PreferenceRow title="New orders" text="Send new-order alerts." enabled={settings.new_order_enabled} onChange={(value) => onPreferenceChange("new_order_enabled", value)} /></div>}
        <div className="mt-4 flex gap-3"><button type="button" disabled={Boolean(working)} onClick={() => onTest(purpose)} className="flex-1 rounded-xl bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white">{working === `test:${purpose}` ? "Sending..." : "Test"}</button><button type="button" disabled={Boolean(working)} onClick={() => onDisconnect(purpose)} className="rounded-xl border border-rose-200 px-3 py-2.5 text-rose-600"><Unplug size={16} /></button></div>
      </> : <button type="button" disabled={Boolean(working)} onClick={() => onConnect(purpose)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{working === `connect:${purpose}` ? <LoaderCircle className="animate-spin" size={16} /> : <MessageCircle size={16} />} Connect</button>}
    </section>;
  })}</div>;
}

function ConnectionInstructions({ connection, onCopy, onRefresh }: { connection: TelegramConnectionCode; onCopy: () => void; onRefresh: () => void }) {
  const username = connection.bot_username?.replace(/^@/, "");
  return (
    <section className="overflow-hidden rounded-xl border border-sky-200 bg-white shadow-sm">
      <div className="border-b border-sky-100 bg-sky-50/70 px-6 py-4 sm:px-8">
        <div className="flex items-center gap-3"><Clock3 className="text-sky-600" size={19} /><p className="text-sm font-semibold text-sky-800">Waiting for Telegram connection · expires {new Date(connection.expires_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p></div>
      </div>
      <div className="space-y-6 p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <Step number="1" title="Add the bot" text={connection.purpose === "sales_channel" ? "Add the bot as a channel administrator." : "Add the bot to the selected Telegram group."} />
          <Step number="2" title="Send the command" text="Paste the one-time command exactly as shown." />
          <Step number="3" title="Return here" text="SellFlow will recognize the connection automatically." />
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-950 p-4 text-white sm:flex sm:items-center sm:gap-4">
          <code className="block min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-sm font-semibold text-emerald-300">{connection.command}</code>
          <button type="button" onClick={onCopy} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold transition hover:bg-white/20 sm:mt-0"><Copy size={15} /> Copy</button>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          {username && <a href={`https://t.me/${username}`} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-semibold text-white transition hover:bg-sky-600"><ExternalLink size={17} /> Open @{username}</a>}
          <button type="button" onClick={onRefresh} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"><RefreshCw size={17} /> Check connection</button>
        </div>
      </div>
    </section>
  );
}

function PreferenceRow({ title, text, enabled, onChange }: { title: string; text: string; enabled: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex cursor-pointer items-center gap-4 py-5"><span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-900">{title}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{text}</span></span><input type="checkbox" checked={enabled} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" /><span className="relative h-6 w-11 shrink-0 rounded-full bg-slate-200 transition peer-checked:bg-purple-600 peer-focus-visible:ring-2 peer-focus-visible:ring-purple-500 peer-focus-visible:ring-offset-2 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition peer-checked:after:translate-x-5" /></label>;
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return <div className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">{number}</span><div><p className="text-sm font-semibold text-slate-900">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div></div>;
}

function InfoCard({ icon: Icon, title, text }: { icon: typeof ShieldCheck; title: string; text: string }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-5"><Icon className="text-purple-600" size={20} /><h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div>;
}

function StatusBadge({ connected }: { connected: boolean }) {
  return <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${connected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{connected ? <Check size={14} /> : <span className="h-2 w-2 rounded-full bg-slate-400" />}{connected ? "Connected" : "Not connected"}</span>;
}

function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) return error.response?.data?.message || "Telegram settings could not be loaded.";
  return "Something went wrong. Please try again.";
}
