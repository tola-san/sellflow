import { useCallback, useEffect, useState, type ComponentType } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Inbox,
  Package,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  notificationService,
  NOTIFICATIONS_CHANGED_EVENT,
  type BusinessNotification,
  type NotificationStatus,
  type NotificationType,
} from "../Services/notifications";
import { ErrorMessage } from "../components/dashboard/DashboardUI";

const filters: { value: NotificationStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
];

const typeMeta: Record<NotificationType, {
  label: string;
  icon: ComponentType<{ className?: string }>;
  tone: string;
}> = {
  order: { label: "Order", icon: ShoppingBag, tone: "bg-purple-100 text-purple-700" },
  inventory: { label: "Inventory", icon: Package, tone: "bg-amber-100 text-amber-700" },
  system: { label: "System", icon: CircleAlert, tone: "bg-blue-100 text-blue-700" },
};

export function NotificationsPage() {
  const [status, setStatus] = useState<NotificationStatus>("all");
  const [type, setType] = useState<NotificationType | "">("");
  const [items, setItems] = useState<BusinessNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.list({
        status,
        type: type || undefined,
        page,
        per_page: 20,
      });
      setItems(response.notifications);
      setUnreadCount(response.unread_count);
      setLastPage(response.meta.last_page);
    } catch (exception) {
      setError(exception);
    } finally {
      setLoading(false);
    }
  }, [page, status, type]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const refresh = () => void load();
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, refresh);
  }, [load]);

  const markRead = async (notification: BusinessNotification) => {
    if (notification.is_read) return;
    setBusyId(notification.id);
    try {
      const updated = await notificationService.markRead(notification.id);
      setItems((current) => current.map((item) => item.id === updated.id ? updated : item));
      setUnreadCount((current) => Math.max(0, current - 1));
    } catch (exception) {
      setError(exception);
    } finally {
      setBusyId(null);
    }
  };

  const dismiss = async (notification: BusinessNotification) => {
    setBusyId(notification.id);
    try {
      await notificationService.dismiss(notification.id);
      setItems((current) => current.filter((item) => item.id !== notification.id));
      if (!notification.is_read) setUnreadCount((current) => Math.max(0, current - 1));
    } catch (exception) {
      setError(exception);
    } finally {
      setBusyId(null);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setItems((current) => current.map((item) => ({ ...item, is_read: true, read_at: new Date().toISOString() })));
      setUnreadCount(0);
    } catch (exception) {
      setError(exception);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-purple-600">
            <Bell className="h-4 w-4" /> Activity inbox
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500">
            Orders, inventory risks, and important SellFlow updates in one place.
          </p>
        </div>
        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <CheckCheck className="h-4 w-4" /> Mark all read
        </button>
      </header>

      <ErrorMessage error={error} />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex rounded-xl bg-slate-100 p-1">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => {
                  setStatus(filter.value);
                  setPage(1);
                }}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                  status === filter.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {filter.label}
                {filter.value === "unread" && unreadCount > 0 && (
                  <span className="ml-2 rounded-full bg-purple-100 px-1.5 py-0.5 text-[9px] text-purple-700">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
          <select
            value={type}
            onChange={(event) => {
              setType(event.target.value as NotificationType | "");
              setPage(1);
            }}
            aria-label="Filter by notification type"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          >
            <option value="">All activity types</option>
            <option value="order">Orders</option>
            <option value="inventory">Inventory</option>
            <option value="system">System</option>
          </select>
        </div>

        {loading ? (
          <NotificationSkeleton />
        ) : items.length ? (
          <div className="divide-y divide-slate-100">
            {items.map((notification) => {
              const meta = typeMeta[notification.type];
              const Icon = meta.icon;
              return (
                <article
                  key={notification.id}
                  className={`group relative flex gap-3 p-4 transition hover:bg-slate-50 sm:gap-4 sm:px-5 ${
                    notification.is_read ? "bg-white" : "bg-purple-50/40"
                  }`}
                >
                  {!notification.is_read && <span className="absolute left-0 top-0 h-full w-1 bg-purple-500" />}
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${meta.tone}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className={`text-sm ${notification.is_read ? "font-semibold text-slate-800" : "font-bold text-slate-950"}`}>
                            {notification.title}
                          </h2>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                            {meta.label}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-5 text-slate-500">{notification.message}</p>
                      </div>
                      <time className="shrink-0 text-[10px] text-slate-400" dateTime={notification.created_at}>
                        {relativeTime(notification.created_at)}
                      </time>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {notification.action_url && (
                        <Link
                          to={notification.action_url}
                          onClick={() => void markRead(notification)}
                          className="inline-flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-purple-700"
                        >
                          View details <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                      {!notification.is_read && (
                        <button
                          type="button"
                          disabled={busyId === notification.id}
                          onClick={() => void markRead(notification)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-white"
                        >
                          <Check className="h-3.5 w-3.5" /> Mark read
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={busyId === notification.id}
                        onClick={() => void dismiss(notification)}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Dismiss
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
              <Inbox className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-sm font-bold text-slate-800">
              {status === "unread" ? "You’re all caught up" : "No notifications yet"}
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
              New orders, low-stock warnings, and important account activity will appear here.
            </p>
          </div>
        )}

        {lastPage > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
            <p className="text-xs text-slate-500">Page {page} of {lastPage}</p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={page === lastPage}
                onClick={() => setPage((current) => Math.min(lastPage, current + 1))}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function NotificationSkeleton() {
  return (
    <div className="divide-y divide-slate-100">
      {Array.from({ length: 5 }, (_, index) => (
        <div className="flex animate-pulse gap-4 p-5" key={index}>
          <div className="h-10 w-10 rounded-xl bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 rounded bg-slate-200" />
            <div className="h-3 max-w-md rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function relativeTime(value: string): string {
  const date = new Date(value);
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const ranges: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["week", 604_800],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];

  for (const [unit, divisor] of ranges) {
    if (Math.abs(seconds) >= divisor) return formatter.format(Math.round(seconds / divisor), unit);
  }

  return "just now";
}
