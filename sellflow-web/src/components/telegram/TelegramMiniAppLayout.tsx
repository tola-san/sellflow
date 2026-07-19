import { useEffect } from "react";
import { ExternalLink, Send } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useTelegramMiniApp } from "./TelegramMiniAppContext";

export function TelegramMiniAppLayout() {
  const { slug = "" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isTelegramClient, webApp } = useTelegramMiniApp();
  const storeRoot = `/telegram/store/${slug}`;

  useEffect(() => {
    if (!isTelegramClient || !webApp?.BackButton) return;

    const back = () => {
      if (location.pathname === storeRoot) return;
      navigate(-1);
    };

    if (location.pathname === storeRoot) {
      webApp.BackButton.hide();
    } else {
      webApp.BackButton.onClick(back);
      webApp.BackButton.show();
    }

    return () => webApp.BackButton?.offClick(back);
  }, [isTelegramClient, location.pathname, navigate, storeRoot, webApp]);

  useEffect(() => {
    if (slug) localStorage.setItem("sellflow_telegram_last_store", slug);
  }, [slug]);

  return (
    <div className={`telegram-mini-app-shell ${isTelegramClient ? "" : "telegram-browser-preview"}`}>
      {!isTelegramClient && (
        <div className="telegram-preview-bar">
          <span className="inline-flex min-w-0 items-center gap-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#229ED9] text-white"><Send size={15} /></span>
            <span className="truncate"><strong>Telegram Mini App</strong><span className="ml-2 text-slate-500">Browser preview</span></span>
          </span>
          <Link to={`/${slug}`} className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-sky-700">Web store <ExternalLink size={13} /></Link>
        </div>
      )}
      <Outlet />
    </div>
  );
}
