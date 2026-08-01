import { useState, type ComponentType, type FormEvent, type ReactNode } from "react";
import {
  Bell,
  Building2,
  Check,
  ChevronRight,
  CreditCard,
  KeyRound,
  LockKeyhole,
  Mail,
  Monitor,
  Save,
  Send,
  ShieldCheck,
  UserRound,
  Volume2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { authService } from "../Services/auth";
import { useAuth } from "../components/Auth/AuthContext";
import { ErrorMessage } from "../components/dashboard/DashboardUI";
import { useToast } from "../components/ui/ToastContext";
import {
  DASHBOARD_THEMES,
  getDashboardThemeId,
  saveDashboardTheme,
  type DashboardThemeId,
} from "../theme/dashboardThemes";
import {
  isNotificationSoundEnabled,
  playNotificationSound,
  setNotificationSoundEnabled,
} from "../lib/notificationSound";

type SettingsSection = "account" | "appearance" | "notifications" | "security";

const navigation: Array<{
  id: SettingsSection;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { id: "account", label: "Account", description: "Profile and contact details", icon: UserRound },
  { id: "appearance", label: "Appearance", description: "Dashboard color and display", icon: Monitor },
  { id: "notifications", label: "Notifications", description: "Alerts and destinations", icon: Bell },
  { id: "security", label: "Security", description: "Password and account safety", icon: ShieldCheck },
];

export function SettingsPage() {
  const [section, setSection] = useState<SettingsSection>("account");

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1450px] overflow-x-hidden space-y-5 pb-8 sm:space-y-6 sm:pb-10">
      <header>
        <p className="text-xs font-semibold text-violet-600">Workspace preferences</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-3xl">Settings</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
          Manage your SellFlow account, workspace appearance, notifications, and security.
        </p>
      </header>

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
        <SettingsNavigation active={section} onChange={setSection} />
        <div className="min-w-0">
          {section === "account" && <AccountSettings />}
          {section === "appearance" && <AppearanceSettings />}
          {section === "notifications" && <NotificationSettings />}
          {section === "security" && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}

function SettingsNavigation({
  active,
  onChange,
}: {
  active: SettingsSection;
  onChange: (section: SettingsSection) => void;
}) {
  return (
    <nav aria-label="Settings sections" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
      <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4 lg:block lg:space-y-1 lg:rounded-xl lg:border lg:border-slate-200 lg:bg-white lg:p-2 lg:shadow-sm">
        {navigation.map((item) => {
          const Icon = item.icon;
          const selected = active === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onChange(item.id)}
              aria-current={selected ? "page" : undefined}
              className={`flex min-w-0 items-center gap-2 rounded-xl border px-2.5 py-2.5 text-left transition sm:gap-2.5 sm:px-3 lg:w-full lg:gap-3 lg:border-transparent lg:p-3 ${
                selected
                  ? "border-violet-200 bg-violet-50 text-violet-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg lg:h-8 lg:w-8 ${selected ? "bg-white text-violet-600 shadow-sm" : "bg-slate-100 text-slate-500"}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[11px] font-semibold min-[360px]:text-xs sm:text-sm">{item.label}</span>
                <span className="mt-0.5 hidden text-[10px] text-slate-400 lg:block">{item.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function AccountSettings() {
  const { user, setSession } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const initials = initialsFor(form.name || form.email || "User");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updated = await authService.updateProfile(form);
      const token = localStorage.getItem("token");
      if (token) setSession(token, updated);
      showToast("Account profile updated.");
    } catch (requestError) {
      setError(requestError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <SettingsPanel
        title="Personal profile"
        description="This information identifies you inside your SellFlow workspace."
        icon={<UserRound className="h-4 w-4" />}
      >
        <ErrorMessage error={error} />
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:mb-6 sm:items-center sm:gap-4 sm:p-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-950 text-sm font-bold text-white sm:h-14 sm:w-14 sm:rounded-2xl">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{form.name || "Your account"}</p>
            <p className="mt-0.5 truncate text-xs text-slate-500">{form.email}</p>
            <p className="mt-1 text-[10px] text-slate-400">Account avatar uses your initials.</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4 sm:space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <SettingsField label="Full name" icon={<UserRound className="h-4 w-4" />}>
              <input
                required
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                autoComplete="name"
                className={inputClass}
                placeholder="Your full name"
              />
            </SettingsField>
            <SettingsField label="Email address" icon={<Mail className="h-4 w-4" />}>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                autoComplete="email"
                className={inputClass}
                placeholder="you@example.com"
              />
            </SettingsField>
          </div>
          <div className="flex justify-end border-t border-slate-100 pt-5">
            <button type="submit" disabled={saving} className={`${primaryButton} w-full sm:w-auto`}>
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </form>
      </SettingsPanel>

      <SettingsPanel
        title="Business workspace"
        description="Store identity and billing are managed in their dedicated sections."
        icon={<Building2 className="h-4 w-4" />}
      >
        <div className="grid gap-3 min-[480px]:grid-cols-2">
          <SettingsLink
            to="/dashboard/business"
            title="Business profile"
            description="Logo, store name, contact information, and public URL"
            icon={<Building2 className="h-4 w-4" />}
          />
          <SettingsLink
            to="/dashboard/billing"
            title="Billing & plan"
            description="Trial status, plan usage, pricing, and payment history"
            icon={<CreditCard className="h-4 w-4" />}
          />
        </div>
      </SettingsPanel>
    </div>
  );
}

function AppearanceSettings() {
  const [theme, setTheme] = useState<DashboardThemeId>(() => getDashboardThemeId());

  const select = (nextTheme: DashboardThemeId) => {
    setTheme(nextTheme);
    saveDashboardTheme(nextTheme);
  };

  return (
    <SettingsPanel
      title="Dashboard appearance"
      description="Choose how your private SellFlow workspace looks. Your public storefront is not affected."
      icon={<Monitor className="h-4 w-4" />}
    >
      <div className="grid gap-3 min-[480px]:grid-cols-2 xl:grid-cols-3">
        {(Object.keys(DASHBOARD_THEMES) as DashboardThemeId[]).map((themeId) => {
          const item = DASHBOARD_THEMES[themeId];
          const selected = theme === themeId;
          return (
            <button
              type="button"
              key={themeId}
              onClick={() => select(themeId)}
              className={`relative min-w-0 rounded-xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                selected ? "border-violet-500 ring-2 ring-violet-100" : "border-slate-200"
              }`}
            >
              {selected && (
                <span className="absolute right-2.5 top-2.5 z-10 grid h-6 w-6 place-items-center rounded-full bg-violet-600 text-white shadow">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
              <span className="block h-24 overflow-hidden rounded-xl border" style={{ backgroundColor: item.canvas, borderColor: item.border }}>
                <span className="flex h-full">
                  <span className="w-7 border-r" style={{ backgroundColor: item.surface, borderColor: item.border }}>
                    <span className="mx-auto mt-3 block h-3 w-3 rounded" style={{ backgroundColor: item.accent }} />
                  </span>
                  <span className="flex-1 p-3">
                    <span className="block h-2 w-16 rounded-full" style={{ backgroundColor: item.text }} />
                    <span className="mt-3 grid grid-cols-2 gap-2">
                      <span className="h-10 rounded-md" style={{ backgroundColor: item.surface, border: `1px solid ${item.border}` }} />
                      <span className="h-10 rounded-md" style={{ backgroundColor: item.accentSoft }} />
                    </span>
                  </span>
                </span>
              </span>
              <span className="mt-3 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-800">{item.label}</span>
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.accent }} />
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-800">
        Appearance preferences are saved to this browser and applied instantly.
      </div>
    </SettingsPanel>
  );
}

function NotificationSettings() {
  const [soundEnabled, setSoundEnabled] = useState(() => isNotificationSoundEnabled());

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    setNotificationSoundEnabled(next);
    if (next) void playNotificationSound("system");
  };

  return (
    <div className="space-y-5">
      <SettingsPanel
        title="Notification channels"
        description="Choose where to review business activity and configure external alerts."
        icon={<Bell className="h-4 w-4" />}
      >
        <div className="grid gap-3 min-[480px]:grid-cols-2">
          <SettingsLink
            to="/dashboard/activity"
            title="Notification center"
            description="Orders, low-stock warnings, and important workspace activity"
            icon={<Bell className="h-4 w-4" />}
            badge="Real time"
          />
          <SettingsLink
            to="/dashboard/notifications"
            title="Telegram"
            description="Connect destinations and control order and payment alerts"
            icon={<Send className="h-4 w-4" />}
            badge="Connected app"
          />
        </div>
      </SettingsPanel>

      <SettingsPanel
        title="Delivery status"
        description="SellFlow keeps in-app notifications available even when an external channel is disconnected."
        icon={<ShieldCheck className="h-4 w-4" />}
      >
        <div className="mb-5 flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-100 text-violet-700">
              <Volume2 className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Notification sound</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Play a short chime when a new real-time alert arrives.</p>
            </div>
          </div>
          <div className="flex w-full items-center justify-end gap-2 sm:w-auto sm:self-auto">
            <button
              type="button"
              onClick={() => void playNotificationSound("system")}
              disabled={!soundEnabled}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Test sound
            </button>
            <button
              type="button"
              role="switch"
              aria-checked={soundEnabled}
              onClick={toggleSound}
              className={`relative h-7 w-12 rounded-full transition-colors ${soundEnabled ? "bg-violet-600" : "bg-slate-300"}`}
              aria-label="Toggle notification sound"
            >
              <span className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${soundEnabled ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <StatusRow label="In-app notifications" description="Order and inventory activity" status="Active" />
          <StatusRow label="Real-time delivery" description="Laravel Reverb private business channel" status="Enabled" />
          <StatusRow label="Email notifications" description="Transactional email delivery" status="Planned" muted />
        </div>
      </SettingsPanel>
    </div>
  );
}

function SecuritySettings() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await authService.updatePassword(form);
      setForm({ current_password: "", password: "", password_confirmation: "" });
      showToast("Password updated successfully.");
    } catch (requestError) {
      setError(requestError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <SettingsPanel
        title="Change password"
        description="Use a strong password you do not reuse on another service."
        icon={<KeyRound className="h-4 w-4" />}
      >
        <ErrorMessage error={error} />
        <form onSubmit={submit} className="space-y-4 sm:space-y-5">
          <SettingsField label="Current password" icon={<LockKeyhole className="h-4 w-4" />}>
            <input
              required
              type="password"
              value={form.current_password}
              onChange={(event) => setForm((current) => ({ ...current, current_password: event.target.value }))}
              autoComplete="current-password"
              className={inputClass}
            />
          </SettingsField>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <SettingsField label="New password" icon={<KeyRound className="h-4 w-4" />}>
              <input
                required
                type="password"
                minLength={8}
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                autoComplete="new-password"
                className={inputClass}
              />
            </SettingsField>
            <SettingsField label="Confirm new password" icon={<KeyRound className="h-4 w-4" />}>
              <input
                required
                type="password"
                minLength={8}
                value={form.password_confirmation}
                onChange={(event) => setForm((current) => ({ ...current, password_confirmation: event.target.value }))}
                autoComplete="new-password"
                className={inputClass}
              />
            </SettingsField>
          </div>
          <div className="flex justify-end border-t border-slate-100 pt-5">
            <button type="submit" disabled={saving} className={`${primaryButton} w-full sm:w-auto`}>
              <KeyRound className="h-4 w-4" />
              {saving ? "Updating..." : "Update password"}
            </button>
          </div>
        </form>
      </SettingsPanel>

      <SettingsPanel
        title="Account protection"
        description="Current security status for your SellFlow account."
        icon={<ShieldCheck className="h-4 w-4" />}
      >
        <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-emerald-900">Token authentication is active</p>
            <p className="mt-1 text-xs leading-5 text-emerald-700">
              Your dashboard and private business APIs require an authenticated Sanctum session.
            </p>
          </div>
        </div>
      </SettingsPanel>
    </div>
  );
}

function SettingsPanel({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-950/[0.025]">
      <div className="flex items-start gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-6 sm:py-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-600">{icon}</span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-950">{title}</h2>
          <p className="mt-0.5 break-words text-[11px] leading-5 text-slate-500">{description}</p>
        </div>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
}

function SettingsField({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
        <span className="text-slate-400">{icon}</span>
        {label}
      </span>
      {children}
    </label>
  );
}

function SettingsLink({
  to,
  title,
  description,
  icon,
  badge,
}: {
  to: string;
  title: string;
  description: string;
  icon: ReactNode;
  badge?: string;
}) {
  return (
    <Link to={to} className="group flex min-w-0 items-start gap-3 overflow-hidden rounded-xl border border-slate-200 p-3.5 transition hover:border-violet-200 hover:bg-violet-50/40 sm:p-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600 transition group-hover:bg-white group-hover:text-violet-600">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">{title}</span>
          {badge && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-emerald-600">{badge}</span>}
        </span>
        <span className="mt-1 block break-words text-[11px] leading-5 text-slate-500">{description}</span>
      </span>
      <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-violet-500" />
    </Link>
  );
}

function StatusRow({
  label,
  description,
  status,
  muted = false,
}: {
  label: string;
  description: string;
  status: string;
  muted?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-start gap-3 rounded-xl border border-slate-100 px-3.5 py-3 sm:flex-nowrap sm:items-center sm:px-4">
      <span className={`h-2 w-2 shrink-0 rounded-full ${muted ? "bg-slate-300" : "bg-emerald-500"}`} />
      <div className="min-w-0 flex-[1_1_180px]">
        <p className="text-xs font-semibold text-slate-800">{label}</p>
        <p className="mt-0.5 text-[10px] leading-4 text-slate-400">{description}</p>
      </div>
      <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${
        muted ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-700"
      }`}>
        {status}
      </span>
    </div>
  );
}

function initialsFor(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100";

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60";
