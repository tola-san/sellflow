import { useState, useEffect } from "react";
import {
  Boxes,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown,
  Settings,
  HelpCircle,
  Calendar,
  Clock,
  Bell,
  CheckCheck,
  CircleAlert,
  Package,
  ShoppingBag,
  AlertTriangle,
  ChevronsUpDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { authService } from "../../Services/auth";
import { useToast } from "../ui/ToastContext";
import { useAuth } from "../../components/Auth/AuthContext";
import { DASHBOARD_THEMES, DASHBOARD_THEME_EVENT, dashboardThemeVariables, getDashboardThemeId, type DashboardThemeId } from "../../theme/dashboardThemes";
import { businessTypeLabel } from "../../types/businessTypes";
import { dashboardModuleSections } from "./dashboardModules";
import {
  notificationService,
  NOTIFICATIONS_CHANGED_EVENT,
  type BusinessNotification,
  type NotificationType,
} from "../../Services/notifications";

function DateTimeDisplay() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notifications, setNotifications] = useState<BusinessNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let active = true;

    const loadNotifications = async () => {
      try {
        const response = await notificationService.list({ per_page: 5 });
        if (active) {
          setNotifications(response.notifications);
          setUnreadCount(response.unread_count);
        }
      } catch {
        // The bell should never interrupt the rest of the dashboard.
      }
    };

    void loadNotifications();
    const interval = window.setInterval(loadNotifications, 60000);
    const refresh = () => void loadNotifications();
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, refresh);

    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, refresh);
    };
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDateClick = () => {
    setShowDatePicker(!showDatePicker);
    setShowNotifications(false);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
    setShowDatePicker(false);
  };

  return (
    <div className="hidden md:flex items-center gap-3 text-sm">
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setShowNotifications((current) => !current);
            setShowDatePicker(false);
          }}
          className="relative rounded-lg p-2 transition-colors hover:bg-slate-100"
          aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"}
          aria-expanded={showNotifications}
        >
          <Bell size={18} className="text-slate-500" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setShowNotifications(false)}
              aria-label="Close notifications"
            />
            <div className="absolute right-0 z-50 mt-2 w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">Notifications</p>
                  <p className="text-[10px] text-slate-400">
                    {unreadCount ? `${unreadCount} unread` : "You’re all caught up"}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={async () => {
                      await notificationService.markAllRead();
                      setUnreadCount(0);
                      setNotifications((current) => current.map((item) => ({ ...item, is_read: true })));
                    }}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-600 hover:text-purple-700"
                  >
                    <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                  </button>
                )}
              </div>
              {notifications.length ? (
                <div className="max-h-[360px] divide-y divide-slate-100 overflow-y-auto">
                  {notifications.map((notification) => {
                    const Icon = notificationIcon(notification.type);
                    return (
                      <button
                        type="button"
                        key={notification.id}
                        onClick={async () => {
                          if (!notification.is_read) await notificationService.markRead(notification.id);
                          setShowNotifications(false);
                          navigate(notification.action_url || "/dashboard/activity");
                        }}
                        className={`flex w-full gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${
                          notification.is_read ? "bg-white" : "bg-purple-50/50"
                        }`}
                      >
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${notificationTone(notification.type)}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className={`truncate text-xs ${notification.is_read ? "font-semibold text-slate-700" : "font-bold text-slate-950"}`}>
                              {notification.title}
                            </span>
                            {!notification.is_read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />}
                          </span>
                          <span className="mt-0.5 line-clamp-2 block text-[10px] leading-4 text-slate-500">
                            {notification.message}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="px-5 py-10 text-center">
                  <Bell className="mx-auto h-6 w-6 text-slate-300" />
                  <p className="mt-2 text-xs font-semibold text-slate-600">No notifications yet</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowNotifications(false);
                  navigate("/dashboard/activity");
                }}
                className="w-full border-t border-slate-100 px-4 py-3 text-center text-xs font-bold text-purple-600 transition hover:bg-purple-50"
              >
                View notification center
              </button>
            </div>
          </>
        )}
      </div>

      <div className="relative">
        <button
          onClick={handleDateClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <Calendar size={15} className="text-slate-400" />
          <span>{formatDate(selectedDate)}</span>
        </button>

        {showDatePicker && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDatePicker(false)}
            />
            <div className="absolute right-0 mt-2 z-50 bg-white rounded-xl border border-slate-200 shadow-lg p-4 min-w-[280px]">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-slate-700">Select Date</span>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={handleDateChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-1.5 text-purple-700">
        <Clock size={15} className="text-purple-400" />
        <span className="font-medium">{formatTime(currentDateTime)}</span>
      </div>
    </div>
  );
}

function notificationIcon(type: NotificationType) {
  if (type === "order") return ShoppingBag;
  if (type === "inventory") return Package;
  return CircleAlert;
}

function notificationTone(type: NotificationType): string {
  if (type === "order") return "bg-purple-100 text-purple-700";
  if (type === "inventory") return "bg-amber-100 text-amber-700";
  return "bg-blue-100 text-blue-700";
}

export function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("sellflow.sidebar.collapsed") === "true");
  const [dashboardTheme, setDashboardTheme] = useState<DashboardThemeId>(() => getDashboardThemeId());
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { openAuth, user, clearSession } = useAuth();
  const business = user?.business;
  const moduleSections = dashboardModuleSections(
    business?.business_type ?? user?.business_type,
    business?.slug,
    business?.is_active ?? true,
  );

  useEffect(() => {
    const syncTheme = (event: Event) => setDashboardTheme((event as CustomEvent<DashboardThemeId>).detail);
    window.addEventListener(DASHBOARD_THEME_EVENT, syncTheme);
    return () => window.removeEventListener(DASHBOARD_THEME_EVENT, syncTheme);
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const logout = async () => {
    const token = localStorage.getItem("token") || "";
    try {
      await authService.logout(token);
    } catch {
      // Clear stale tokens too.
    }
    clearSession();
    showToast("You have signed out successfully.");
    navigate("/");
  };

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem("sellflow.sidebar.collapsed", String(next));
      return next;
    });
  };

  const sidebar = (isCollapsed: boolean, mobile = false) => (
    <>
      <div className="border-b border-slate-200 p-3">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between gap-2"}`}>
          <div className={`flex min-w-0 items-center ${isCollapsed ? "" : "gap-3"}`}>
            {business?.logo ? (
              <img src={business.logo} alt="" className="h-10 w-10 shrink-0 rounded-xl border border-slate-200 object-cover" />
            ) : (
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-600 text-sm font-bold text-white">
                {business ? getInitials(business.name) : <Boxes size={19} />}
              </span>
            )}
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">{business?.name ?? "SellFlow"}</p>
                <p className="truncate text-[11px] text-slate-500">
                  {business?.business_type ? businessTypeLabel(business.business_type) : "Business dashboard"}
                </p>
              </div>
            )}
          </div>
          {mobile && (
            <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={20} />
            </button>
          )}
        </div>

        {!isCollapsed && (
          <button
            type="button"
            disabled
            title="Business switching will be available with multi-business support."
            className="mt-3 flex w-full cursor-not-allowed items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs text-slate-500"
          >
            <span className="truncate">Current business</span>
            <ChevronsUpDown size={14} />
          </button>
        )}
      </div>

      <nav
        aria-label="Dashboard navigation"
        className={`dashboard-sidebar-scrollbar flex-1 overflow-y-auto ${
          isCollapsed ? "space-y-3 p-2.5" : "space-y-4 px-3 py-4"
        }`}
      >
        {moduleSections.map((section) => (
          <div key={section.key}>
            {isCollapsed ? (
              <div className="mx-2 mb-1.5 border-t border-slate-200" />
            ) : (
              <div className="mb-1 flex min-h-6 items-center justify-between gap-2 px-2.5">
                <p className={`min-w-0 truncate whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.14em] ${
                  section.personalized ? "text-purple-600" : "text-slate-400"
                }`}>
                  {section.label}
                </p>
                {section.personalized && (
                  <span
                    className="flex shrink-0 items-center gap-1.5 text-[9px] font-semibold text-purple-600"
                    title="Modules tailored to your business type"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                    Tailored
                  </span>
                )}
              </div>
            )}

            <div className="space-y-0.5">
              {section.modules.map((module) => {
                const Icon = module.icon;

                if (module.status === "planned" || !module.path) {
                  return (
                    <div
                      key={module.key}
                      title={`${module.description} — planned module`}
                      aria-disabled="true"
                      className={`flex cursor-not-allowed items-center rounded-lg py-2 text-[13px] text-slate-400 ${
                        isCollapsed ? "justify-center px-2" : "justify-between px-3"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Icon size={17} strokeWidth={1.8} className="shrink-0" />
                        {!isCollapsed && <span className="truncate">{module.label}</span>}
                      </div>
                      {!isCollapsed && (
                        <span className="ml-2 shrink-0 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                          Soon
                        </span>
                      )}
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={module.key}
                    to={module.path}
                    end={module.end}
                    title={module.description}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center rounded-lg py-2 text-[13px] font-medium transition-colors ${
                        isActive
                          ? "bg-purple-50 text-purple-700 shadow-[inset_3px_0_0_var(--dashboard-accent)]"
                          : "text-slate-600 hover:bg-slate-100"
                      } ${isCollapsed ? "justify-center px-2" : "justify-between px-3"}`
                    }
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Icon size={17} strokeWidth={1.8} className="shrink-0" />
                      {!isCollapsed && <span className="truncate">{module.label}</span>}
                    </div>
                    {!isCollapsed && module.badge && (
                      <span className="ml-2 shrink-0 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-emerald-600">
                        {module.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {!mobile && (
        <div className="border-t border-slate-200 p-2.5">
          <button
            type="button"
            onClick={toggleCollapsed}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`flex w-full items-center rounded-xl p-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 ${
              isCollapsed ? "justify-center" : "gap-3"
            }`}
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            {!isCollapsed && <span>Collapse sidebar</span>}
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="dashboard-theme min-h-screen bg-slate-50 text-slate-900" data-dashboard-theme={dashboardTheme} style={dashboardThemeVariables(DASHBOARD_THEMES[dashboardTheme])}>
      <aside className={`fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-slate-200 bg-white transition-[width] duration-200 lg:flex ${
        collapsed ? "w-[76px]" : "w-[272px]"
      }`}>
        {sidebar(collapsed)}
      </aside>

      {open && (
        <>
          <button
            className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu overlay"
          />
          <aside className="fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-white lg:hidden">
            {sidebar(false, true)}
          </aside>
        </>
      )}

      <div className={`transition-[padding] duration-200 ${collapsed ? "lg:pl-[76px]" : "lg:pl-[272px]"}`}>
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center">
            <button
              className="mr-3 rounded-lg p-2 hover:bg-slate-100 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <p className="font-semibold">{business ? `Manage ${business.name}` : "Manage your catalog"}</p>
          </div>

          <div className="flex items-center gap-4">
            <DateTimeDisplay />

            <div className="relative">
              {user ? (
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 text-sm hover:bg-slate-50 border border-slate-200 transition"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-medium text-xs">
                    {getInitials(user.name || user.email || "User")}
                  </div>
                  <span className="hidden sm:inline text-slate-700 font-medium">
                    {user.name || user.email?.split('@')[0] || "User"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <button
                  onClick={() => openAuth('login')}
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition"
                >
                  <User size={16} />
                  Sign In
                </button>
              )}

              {profileOpen && user && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg z-50 py-1">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user.email || "No email"}
                      </p>
                    </div>

                    <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
                      <User size={16} />
                      My Profile
                    </button>
                    <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
                      <Settings size={16} />
                      Settings
                    </button>
                    <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
                      <HelpCircle size={16} />
                      Help
                    </button>

                    <div className="border-t border-slate-100 mt-1">
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition"
                      >
                        <LogOut size={16} />
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {business && !business.is_active && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">This business is inactive</p>
                <p className="mt-0.5 text-amber-700">Reactivate the store from Business Profile. Navigation is limited while the store is inactive.</p>
              </div>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
