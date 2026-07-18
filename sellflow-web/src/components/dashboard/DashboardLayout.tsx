import { useState, useEffect } from "react";
import {
  BarChart3,
  Boxes,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Palette,
  ShoppingCart,
  Store,
  X,
  User,
  ChevronDown,
  Settings,
  HelpCircle,
  Calendar,
  Clock,
  Bell,
  Send,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { authService } from "../../Services/auth";
import { useToast } from "../ui/ToastContext";
import { useAuth } from "../../components/Auth/AuthContext";

const links = [
  { label: "Overview", path: "/dashboard", icon: LayoutDashboard, end: true },
  { label: "Business", path: "/dashboard/business", icon: Store },
  { label: "Categories", path: "/dashboard/categories", icon: FolderTree },
  { label: "Products", path: "/dashboard/products", icon: Package },
  { label: "Theme", path: "/dashboard/theme", icon: Palette },
  {
    label: "Orders",
    path: "/dashboard/orders",
    icon: ShoppingCart,
    isNew: true,
  },
  { label: "Notifications", path: "/dashboard/notifications", icon: Send, isNew: true },
];

// Date/Time Component with Click Handler and Date Picker
function DateTimeDisplay() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [hasNotifications, setHasNotifications] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
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

  const handleNotificationClick = () => {
    console.log("Notifications clicked");
    setHasNotifications(false);
  };

  const handleDateClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
    setShowDatePicker(false);
    console.log("Date selected:", newDate);
  };

  const handleTimeClick = () => {
    console.log("Time clicked");
    // Add your time-related logic here
  };

  return (
    <div className="hidden md:flex items-center gap-3 text-sm">
      {/* Notification Bell */}
      <button
        onClick={handleNotificationClick}
        className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={18} className="text-slate-500" />
        {hasNotifications && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {/* Clickable Date with Picker */}
      <div className="relative">
        <button
          onClick={handleDateClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <Calendar size={15} className="text-slate-400" />
          <span>{formatDate(selectedDate)}</span>
        </button>

        {/* Date Picker Popup */}
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

      {/* Clickable Time */}
      <button
        onClick={handleTimeClick}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer"
      >
        <Clock size={15} className="text-purple-400" />
        <span className="font-medium">{formatTime(currentDateTime)}</span>
      </button>
    </div>
  );
}

export function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { openAuth, user, clearSession } = useAuth();

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

  const sidebar = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-purple-600 text-white">
            <Boxes size={19} />
          </span>
          <div>
            <p className="font-bold">SellFlow</p>
            <p className="text-xs text-slate-500">Business dashboard</p>
          </div>
        </div>
        <button
          className="lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map(({ label, path, icon: Icon, end, isNew }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-purple-50 text-purple-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <Icon size={19} />
              <span>{label}</span>
            </div>

            {isNew && (
              <span className="rounded-xl bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-500 border border-green-300">
                NEW
              </span>
            )}
          </NavLink>
        ))}

        <div className="pt-4">
          <p className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Coming next
          </p>
          <div className="mt-2 flex items-center gap-3 px-4 py-3 text-sm text-slate-400">
            <BarChart3 size={19} />
            Advanced analytics
          </div>
        </div>
      </nav>

      {/* Sign out button removed from sidebar */}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        {sidebar}
      </aside>

      {open && (
        <>
          <button
            className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu overlay"
          />
          <aside className="fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-white lg:hidden">
            {sidebar}
          </aside>
        </>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center">
            <button
              className="mr-3 rounded-lg p-2 hover:bg-slate-100 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <p className="font-semibold">Manage your catalog</p>
          </div>

          <div className="flex items-center gap-4">
            <DateTimeDisplay />

            <div className="relative">
              {user ? (
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm hover:bg-slate-50 border border-slate-200 transition"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-purple-700 font-medium text-xs">
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
                  className="flex items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition"
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}
