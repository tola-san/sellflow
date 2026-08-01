import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramBottomButton {
  show: () => void;
  hide: () => void;
  enable: () => void;
  disable: () => void;
  showProgress: (leaveActive?: boolean) => void;
  hideProgress: () => void;
  setParams: (params: Record<string, unknown>) => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
}

interface TelegramBackButton {
  show: () => void;
  hide: () => void;
  onClick: (callback: () => void) => void;
  offClick: (callback: () => void) => void;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe?: {
    user?: TelegramUser;
    start_param?: string;
  };
  themeParams?: Record<string, string | undefined>;
  colorScheme?: "light" | "dark";
  MainButton?: TelegramBottomButton;
  BackButton?: TelegramBackButton;
  HapticFeedback?: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  enableClosingConfirmation?: () => void;
  requestWriteAccess?: (callback: (allowed: boolean) => void) => void;
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

interface TelegramMiniAppContextValue {
  isMiniAppRoute: boolean;
  isTelegramClient: boolean;
  webApp: TelegramWebApp | null;
  user: TelegramUser | null;
  startParam: string | null;
  customerName: string;
  storePath: (slug: string, suffix?: string) => string;
  hapticImpact: () => void;
  hapticSuccess: () => void;
  requestWriteAccess: () => Promise<boolean>;
  close: () => void;
}

const TelegramMiniAppContext = createContext<TelegramMiniAppContextValue | null>(null);

export function TelegramMiniAppProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isMiniAppRoute = location.pathname === "/telegram/store" || location.pathname.startsWith("/telegram/store/");
  const webApp = typeof window !== "undefined" ? window.Telegram?.WebApp ?? null : null;
  const isTelegramClient = isMiniAppRoute && Boolean(webApp?.initData);
  const user = webApp?.initDataUnsafe?.user ?? null;

  const startParam = useMemo(() => {
    const query = new URLSearchParams(location.search);
    return webApp?.initDataUnsafe?.start_param
      || query.get("tgWebAppStartParam")
      || query.get("startapp")
      || query.get("store");
  }, [location.search, webApp]);

  useEffect(() => {
    if (!isMiniAppRoute) return;

    document.documentElement.dataset.telegramMiniApp = "true";
    webApp?.ready();
    webApp?.expand();
    if (isTelegramClient) {
      webApp?.enableClosingConfirmation?.();
    }

    const background = webApp?.themeParams?.bg_color;
    const header = webApp?.themeParams?.header_bg_color || background;
    if (background) webApp?.setBackgroundColor?.(background);
    if (header) webApp?.setHeaderColor?.(header);

    return () => {
      delete document.documentElement.dataset.telegramMiniApp;
      webApp?.MainButton?.hide();
      webApp?.BackButton?.hide();
    };
  }, [isMiniAppRoute, isTelegramClient, webApp]);

  const value = useMemo<TelegramMiniAppContextValue>(() => ({
    isMiniAppRoute,
    isTelegramClient,
    webApp,
    user,
    startParam,
    customerName: [user?.first_name, user?.last_name].filter(Boolean).join(" "),
    storePath: (slug, suffix = "") => isMiniAppRoute
      ? `/telegram/store/${encodeURIComponent(slug)}${suffix}`
      : `/store/${encodeURIComponent(slug)}${suffix}`,
    hapticImpact: () => webApp?.HapticFeedback?.impactOccurred("light"),
    hapticSuccess: () => webApp?.HapticFeedback?.notificationOccurred("success"),
    requestWriteAccess: () => new Promise((resolve) => {
      if (!isTelegramClient || !webApp?.requestWriteAccess) {
        resolve(false);
        return;
      }

      webApp.requestWriteAccess(resolve);
    }),
    close: () => webApp?.close(),
  }), [isMiniAppRoute, isTelegramClient, startParam, user, webApp]);

  return <TelegramMiniAppContext.Provider value={value}>{children}</TelegramMiniAppContext.Provider>;
}

export function useTelegramMiniApp() {
  const context = useContext(TelegramMiniAppContext);
  if (!context) throw new Error("useTelegramMiniApp must be used within TelegramMiniAppProvider");
  return context;
}

export function useTelegramMainButton({
  text,
  color,
  visible,
  enabled = true,
  loading = false,
  onClick,
}: {
  text: string;
  color?: string;
  visible: boolean;
  enabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}) {
  const { isTelegramClient, webApp } = useTelegramMiniApp();
  const callbackRef = useRef(onClick);
  callbackRef.current = onClick;

  useEffect(() => {
    const button = webApp?.MainButton;
    if (!isTelegramClient || !button || !visible) {
      button?.hide();
      return;
    }

    const handleClick = () => callbackRef.current();
    button.setParams({ text, color, is_visible: true, is_active: enabled });
    enabled ? button.enable() : button.disable();
    loading ? button.showProgress() : button.hideProgress();
    button.onClick(handleClick);
    button.show();

    return () => {
      button.offClick(handleClick);
      button.hideProgress();
      button.hide();
    };
  }, [color, enabled, isTelegramClient, loading, text, visible, webApp]);
}
