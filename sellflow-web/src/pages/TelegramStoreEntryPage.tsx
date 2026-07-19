import { useEffect, useMemo } from "react";
import { Send, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTelegramMiniApp } from "../components/telegram/TelegramMiniAppContext";

const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function TelegramStoreEntryPage() {
  const navigate = useNavigate();
  const { startParam, isTelegramClient, close } = useTelegramMiniApp();
  const slug = useMemo(() => {
    const candidate = (startParam || localStorage.getItem("sellflow_telegram_last_store") || "").trim().toLowerCase();
    return validSlug.test(candidate) ? candidate : "";
  }, [startParam]);

  useEffect(() => {
    if (slug) navigate(`/telegram/store/${encodeURIComponent(slug)}`, { replace: true });
  }, [navigate, slug]);

  if (slug) return <div className="grid min-h-[100dvh] place-items-center bg-slate-50"><div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#229ED9]" /></div>;

  return (
    <main className="grid min-h-[100dvh] place-items-center bg-gradient-to-b from-sky-50 to-white px-6 py-12 text-center">
      <div className="w-full max-w-sm">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-white text-[#229ED9] shadow-xl shadow-sky-100"><Store size={36} /></span>
        <p className="mt-7 inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700"><Send size={13} /> SellFlow Mini App</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">Open a store link</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">This Mini App opens a specific seller’s storefront. Return to the seller’s Telegram channel or message and tap their Shop button.</p>
        {isTelegramClient && <button type="button" onClick={close} className="mt-8 w-full rounded-2xl bg-[#229ED9] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-200">Close Mini App</button>}
      </div>
    </main>
  );
}
