import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BellRing, Bot, Check, CheckCircle2, Clock3, Copy, ExternalLink, LoaderCircle, MessageCircle, RefreshCw, Send, ShieldCheck, Unplug } from "lucide-react";
import { telegramNotificationService, type TelegramConnectionCode, type TelegramSettings } from "../Services/telegramNotifications";
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
      if (data.connected) setConnection(null);
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

  const generateCode = async () => {
    setWorking("connect");
    try {
      setConnection(await telegramNotificationService.createConnectionCode());
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

  const sendTest = async () => {
    setWorking("test");
    try {
      showToast(await telegramNotificationService.sendTest());
    } catch (requestError) {
      showToast(errorMessage(requestError), "error");
    } finally {
      setWorking(null);
    }
  };

  const disconnect = async () => {
    if (!window.confirm("Disconnect this Telegram chat from SellFlow?")) return;
    setWorking("disconnect");
    try {
      setSettings(await telegramNotificationService.disconnect());
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
        <StatusBadge connected={Boolean(settings?.connected)} />
      </div>

      {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {settings?.connected ? (
        <ConnectedView settings={settings} working={working} onSendTest={sendTest} onDisconnect={disconnect} onPreferenceChange={updatePreference} />
      ) : connection ? (
        <ConnectionInstructions connection={connection} onCopy={copyCommand} onRefresh={() => loadSettings(true)} />
      ) : (
        <ConnectView working={working === "connect"} onConnect={generateCode} />
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <InfoCard icon={ShieldCheck} title="Secure connection" text="Codes expire after ten minutes and work only once." />
        <InfoCard icon={RefreshCw} title="Automatic detection" text="This page checks for the completed connection every few seconds." />
        <InfoCard icon={BellRing} title="Checkout stays fast" text="Telegram delivery will run separately from customer checkout." />
      </div>
    </div>
  );
}

function ConnectView({ working, onConnect }: { working: boolean; onConnect: () => void }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sky-50 text-sky-600"><Bot size={25} /></span>
          <div>
            <h2 className="text-lg font-bold text-slate-950">Connect the SellFlow bot</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Generate a temporary command, send it to the bot in a private chat or staff group, then return here to verify the connection.</p>
          </div>
        </div>
        <button type="button" disabled={working} onClick={onConnect} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:opacity-60">
          {working ? <LoaderCircle className="animate-spin" size={17} /> : <MessageCircle size={17} />} Connect Telegram
        </button>
      </div>
    </section>
  );
}

function ConnectionInstructions({ connection, onCopy, onRefresh }: { connection: TelegramConnectionCode; onCopy: () => void; onRefresh: () => void }) {
  const username = connection.bot_username?.replace(/^@/, "");
  return (
    <section className="overflow-hidden rounded-3xl border border-sky-200 bg-white shadow-sm">
      <div className="border-b border-sky-100 bg-sky-50/70 px-6 py-4 sm:px-8">
        <div className="flex items-center gap-3"><Clock3 className="text-sky-600" size={19} /><p className="text-sm font-semibold text-sky-800">Waiting for Telegram connection · expires {new Date(connection.expires_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p></div>
      </div>
      <div className="space-y-6 p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <Step number="1" title="Open the bot" text="Use a private chat or add the bot to your staff group." />
          <Step number="2" title="Send the command" text="Paste the one-time command exactly as shown." />
          <Step number="3" title="Return here" text="SellFlow will recognize the connection automatically." />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white sm:flex sm:items-center sm:gap-4">
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

function ConnectedView({ settings, working, onSendTest, onDisconnect, onPreferenceChange }: { settings: TelegramSettings; working: string | null; onSendTest: () => void; onDisconnect: () => void; onPreferenceChange: (key: "new_order_enabled" | "payment_enabled", value: boolean) => void }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-emerald-100 bg-emerald-50/60 p-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><CheckCircle2 size={23} /></span><div><h2 className="font-bold text-slate-950">Telegram connected</h2><p className="text-sm text-slate-500">{settings.chat_name || "Telegram chat"}</p></div></div>
        <button type="button" disabled={working === "test"} onClick={onSendTest} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60">{working === "test" ? <LoaderCircle className="animate-spin" size={16} /> : <Send size={16} />} Send test message</button>
      </div>
      <div className="divide-y divide-slate-100 px-6 sm:px-8">
        <PreferenceRow title="New order alerts" text="Notify this chat when a customer places an order." enabled={settings.new_order_enabled} onChange={(value) => onPreferenceChange("new_order_enabled", value)} />
        <PreferenceRow title="Payment alerts" text="Notify this chat when a payment is verified." enabled={settings.payment_enabled} onChange={(value) => onPreferenceChange("payment_enabled", value)} />
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-xs text-slate-500">Connected {settings.connected_at ? new Date(settings.connected_at).toLocaleString() : "recently"}</p>
        <button type="button" disabled={working === "disconnect"} onClick={onDisconnect} className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-rose-600 transition hover:text-rose-700 disabled:opacity-50">{working === "disconnect" ? <LoaderCircle className="animate-spin" size={16} /> : <Unplug size={16} />} Disconnect Telegram</button>
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
  return <div className="rounded-2xl border border-slate-200 bg-white p-5"><Icon className="text-purple-600" size={20} /><h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div>;
}

function StatusBadge({ connected }: { connected: boolean }) {
  return <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${connected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{connected ? <Check size={14} /> : <span className="h-2 w-2 rounded-full bg-slate-400" />}{connected ? "Connected" : "Not connected"}</span>;
}

function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) return error.response?.data?.message || "Telegram settings could not be loaded.";
  return "Something went wrong. Please try again.";
}
