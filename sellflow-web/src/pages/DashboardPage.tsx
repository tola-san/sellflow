import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  ArrowRight,
  Banknote,
  Box,
  CheckCircle2,
  FolderTree,
  Package,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Clock,
  Percent,
  Calendar,
  RefreshCw,
  Store,
  TrendingDown,
  Activity,
  DollarSign,
  Award,
  Zap,
  BarChart3,
  PieChart,
  Users,
  Target,
  Rocket,
  Gem,
  Crown,
  Flame,
  Star,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { dashboardService, type DashboardOverview } from "../Services/dashboard";
import { orderService } from "../Services/order";
import type { Order, OrderListResponse } from "../types/order";
import { ErrorMessage } from "../components/dashboard/DashboardUI";

const emptySummary: OrderListResponse["summary"] = {
  total: 0,
  pending: 0,
  confirmed: 0,
  preparing: 0,
  completed: 0,
  paid_revenue: "0",
};

const money = (value: number | string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value) || 0);

const orderTone: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-600/10",
  confirmed: "bg-blue-50 text-blue-700 ring-blue-600/10",
  preparing: "bg-violet-50 text-violet-700 ring-violet-600/10",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-600/10",
};

// Modern Premium Metric Card - Mobile Optimized
function MetricCard({
  label,
  value,
  note,
  icon: Icon,
  tone,
  gradient,
  trend,
  trendValue,
  delay = 0,
}: {
  label: string;
  value: string | number;
  note: string;
  icon: ComponentType<{ className?: string }>;
  tone: string;
  gradient?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  delay?: number;
}) {
  const trendColors = {
    up: 'text-emerald-600 bg-emerald-50',
    down: 'text-rose-600 bg-rose-50',
    neutral: 'text-slate-600 bg-slate-50',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Activity;

  return (
    <article 
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-xl hover:shadow-slate-200/50 ${gradient || ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" 
        style={{ 
          background: `linear-gradient(135deg, transparent 40%, ${tone.split(' ')[1]?.replace('text-', '') || 'purple'}10 100%)` 
        }} 
      />
      
      {/* Decorative ring - hidden on mobile */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-150 hidden sm:block"
        style={{ background: `radial-gradient(circle, ${tone.split(' ')[1]?.replace('text-', '') || 'purple'}15, transparent 70%)` }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className={`grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-xl ${tone} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
            {trend && trendValue && (
              <span className={`hidden sm:flex items-center gap-1 rounded-full ${trendColors[trend]} px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider`}>
                <TrendIcon className="h-3 w-3" />
                {trendValue}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 sm:px-3 py-1 text-[8px] sm:text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
            <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Live</span>
          </span>
        </div>
        
        <div className="mt-3 sm:mt-4">
          <p className="text-xs sm:text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-0.5 sm:mt-1 text-xl sm:text-3xl font-bold tracking-tight text-slate-950">{value}</p>
        </div>
        
        <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2">
          <RefreshCw className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-slate-400" />
          <p className="text-[10px] sm:text-xs text-slate-400 truncate">{note}</p>
        </div>

        {/* Progress bar indicator */}
        <div className="mt-3 sm:mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full transition-all duration-1000 group-hover:animate-pulse" 
            style={{ 
              width: '60%',
              background: `linear-gradient(90deg, ${tone.split(' ')[1]?.replace('text-', '') || 'purple'}, ${tone.split(' ')[1]?.replace('text-', '') || 'purple'}80)`
            }} 
          />
        </div>

        {/* Mobile trend indicator */}
        {trend && trendValue && (
          <div className="mt-2 sm:hidden flex items-center gap-1">
            <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[8px] font-semibold ${trendColors[trend]}`}>
              <TrendIcon className="h-2.5 w-2.5" />
              {trendValue}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

// Mobile-Optimized Donut Chart
function DonutChart({ orders }: { orders: Order[] }) {
  const data = useMemo(() => {
    const statusMap: Record<string, { count: number; color: string; label: string; icon: ComponentType }> = {
      pending: { count: 0, color: '#f59e0b', label: 'Pending', icon: Clock },
      confirmed: { count: 0, color: '#3b82f6', label: 'Confirmed', icon: CheckCircle2 },
      preparing: { count: 0, color: '#8b5cf6', label: 'Preparing', icon: Package },
      completed: { count: 0, color: '#10b981', label: 'Completed', icon: Award },
      cancelled: { count: 0, color: '#ef4444', label: 'Cancelled', icon: XCircle },
    };

    orders.forEach(order => {
      if (statusMap[order.status]) {
        statusMap[order.status].count += 1;
      }
    });

    return Object.values(statusMap).filter(item => item.count > 0);
  }, [orders]);

  const total = data.reduce((sum, item) => sum + item.count, 0);
  let currentAngle = 0;

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative h-40 w-40 sm:h-52 sm:w-52">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl font-bold text-slate-300">0</p>
              <p className="text-xs font-medium text-slate-400">No Orders</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-40 w-40 sm:h-52 sm:w-52">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.count / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;

            const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
            const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;

            return (
              <path
                key={item.label}
                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={item.color}
                className="transition-all duration-300 hover:opacity-80 hover:scale-105 cursor-pointer"
                style={{ transformOrigin: 'center' }}
              >
                <animate 
                  attributeName="opacity" 
                  from="0" 
                  to="1" 
                  dur="0.5s" 
                  begin={`${index * 0.1}s`} 
                />
              </path>
            );
          })}
          <circle cx="50" cy="50" r="25" fill="white" className="shadow-lg" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-slate-950">{total}</p>
            <p className="text-[8px] sm:text-[10px] font-medium text-slate-400">Total Orders</p>
          </div>
        </div>
      </div>
      <div className="mt-3 sm:mt-4 flex flex-wrap justify-center gap-1.5 sm:gap-2">
        {data.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-1 rounded-full bg-slate-50 px-2 sm:px-3 py-1 sm:py-1.5">
              <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <IconComponent className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-slate-500" />
              <span className="text-[9px] sm:text-xs font-medium text-slate-600 hidden xs:inline">{item.label}</span>
              <span className="text-[9px] sm:text-xs font-bold text-slate-900">{Math.round((item.count / total) * 100)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Mobile-Optimized Activity Chart
function ActivityChart({ orders }: { orders: Order[] }) {
  const data = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      const next = new Date(date);
      next.setDate(next.getDate() + 1);
      const dayOrders = orders.filter((order) => {
        const created = new Date(order.created_at);
        return created >= date && created < next;
      });
      return {
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        fullDate: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + Number(order.total || 0), 0),
      };
    });
  }, [orders]);

  const max = Math.max(...data.map((item) => item.count), 1);
  const points = data.map((item, index) => `${index * (600 / 6)},${150 - (item.count / max) * 120}`).join(" ");
  const area = `0,170 ${points} 600,170`;
  const weekRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <article className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-sm transition-all hover:shadow-md lg:col-span-2">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="font-semibold text-slate-950 flex items-center gap-2 text-sm sm:text-base">
            <Calendar className="h-4 w-4 text-violet-500" />
            Order Activity
          </h2>
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-500">Weekly performance overview</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] sm:text-xs font-medium text-slate-400">7-Day Revenue</p>
          <p className="text-base sm:text-xl font-bold text-slate-900">{money(weekRevenue)}</p>
        </div>
      </div>
      <div className="mt-4 sm:mt-6 h-40 sm:h-52">
        <svg viewBox="0 0 600 180" className="h-[140px] sm:h-[170px] w-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="analytics-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7c3aed" stopOpacity=".3" />
              <stop offset="0.5" stopColor="#7c3aed" stopOpacity=".1" />
              <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="analytics-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#7c3aed" stopOpacity="0.6" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          {[30, 70, 110, 150].map((y) => (
            <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="#f1f5f9" strokeDasharray="4 6" strokeWidth="1.5" />
          ))}
          <polygon points={area} fill="url(#analytics-area)">
            <animate attributeName="opacity" from="0" to="1" dur="0.8s" />
          </polygon>
          <polyline points={points} fill="none" stroke="url(#analytics-line)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="1s" />
          </polyline>
          {data.map((item, index) => (
            <g key={item.label}>
              <circle 
                cx={index * (600 / 6)} 
                cy={150 - (item.count / max) * 120} 
                r="4" 
                fill="white" 
                stroke="#7c3aed" 
                strokeWidth="2"
                className="transition-all duration-300 hover:r-6 hover:stroke-violet-400 cursor-pointer"
              >
                <animate attributeName="r" from="0" to="4" dur="0.3s" begin={`${index * 0.1}s`} />
              </circle>
              {item.count > 0 && (
                <text 
                  x={index * (600 / 6)} 
                  y={150 - (item.count / max) * 120 - 10} 
                  textAnchor="middle" 
                  className="text-[8px] sm:text-[10px] font-semibold fill-slate-600"
                >
                  {item.count}
                </text>
              )}
            </g>
          ))}
        </svg>
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center mt-1 sm:mt-2">
          {data.map((item) => (
            <div key={item.label}>
              <span className="text-[8px] sm:text-[11px] font-medium text-slate-400">{item.label}</span>
              <span className="block text-[7px] sm:text-[9px] text-slate-300 truncate">{item.fullDate}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

// XCircle component for cancelled orders
const XCircle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

// Mobile-Optimized Store Logo
const StoreLogo = ({ business, size = 'md' }: { business: Business | null; size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'h-8 w-8 sm:h-10 sm:w-10',
    md: 'h-10 w-10 sm:h-14 sm:w-14',
    lg: 'h-14 w-14 sm:h-20 sm:w-20'
  };
  
  const textSizes = {
    sm: 'text-xs sm:text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl'
  };

  if (business?.logo) {
    return (
      <img 
        src={business.logo} 
        alt={business.name || 'Store logo'} 
        className={`${sizes[size]} rounded-lg object-cover border border-slate-200/80 shadow-sm`}
      />
    );
  }

  const initials = business?.name 
    ? business.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
    : 'ST';

  return (
    <div className={`${sizes[size]} rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center border border-slate-200/80 shadow-sm`}>
      {business?.name ? (
        <span className={`${textSizes[size]} font-bold text-violet-700`}>{initials}</span>
      ) : (
        <Store className={`${size === 'sm' ? 'h-4 w-4 sm:h-5 sm:w-5' : size === 'md' ? 'h-5 w-5 sm:h-7 sm:w-7' : 'h-7 w-7 sm:h-10 sm:w-10'} text-violet-400`} />
      )}
    </div>
  );
};

interface Business {
  id: string;
  name: string;
  logo?: string;
}

export function DashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState(emptySummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      dashboardService.getOverview(),
      orderService.getOrders({ per_page: 50 }),
    ]).then(([overviewResult, ordersResult]) => {
      if (overviewResult.status === "fulfilled") setOverview(overviewResult.value);
      else setError(overviewResult.reason);
      if (ordersResult.status === "fulfilled") {
        setOrders(ordersResult.value.orders);
        setSummary(ordersResult.value.summary);
      } else if (overviewResult.status === "fulfilled") setError(ordersResult.reason);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 sm:space-y-6">
        <div className="h-24 sm:h-32 rounded-xl bg-slate-200" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => <div key={i} className="h-32 sm:h-44 rounded-xl bg-slate-200" />)}
        </div>
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          <div className="h-64 sm:h-80 rounded-xl bg-slate-200 lg:col-span-2" />
          <div className="h-64 sm:h-80 rounded-xl bg-slate-200" />
        </div>
      </div>
    );
  }

  const business = overview?.business as Business | null;
  const products = overview?.recent_products ?? [];
  const counts = overview?.stats ?? { products: 0, active_products: 0, categories: 0, active_categories: 0, low_stock: 0 };
  const revenue = Number(summary.paid_revenue || 0);
  const averageOrder = summary.total ? revenue / summary.total : 0;
  const fulfillment = summary.total ? Math.round((summary.completed / summary.total) * 100) : 0;

  return (
    <div className="space-y-4 sm:space-y-8 pb-20 sm:pb-8">
      {/* Mobile-Optimized Header */}
      <header className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3 sm:gap-4">
          <StoreLogo business={business} size="md" />
          <div className="min-w-0 flex-1">
            <div className="mb-1 sm:mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-200">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              </span>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[.12em] sm:tracking-[.16em] text-violet-600">
                Analytics
              </span>
            </div>
            <h1 className="text-lg sm:text-3xl font-bold tracking-tight text-slate-950 truncate">
              Welcome{business ? `, ${business.name}` : ""}
            </h1>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 sm:gap-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">Your store performance at a glance</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link 
            to="/dashboard/orders" 
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
          >
            Orders
          </Link>
          <Link 
            to="/dashboard/products" 
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet-200 hover:scale-[1.02] sm:hover:scale-105"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" /> 
            <span className="hidden sm:inline">Add product</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </div>
      </header>

      <ErrorMessage error={error} />

      {/* Mobile-Optimized Business CTA */}
      {!business && (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-4 sm:p-8 text-white shadow-lg shadow-violet-200">
          <div className="absolute right-0 top-0 h-32 sm:h-64 w-32 sm:w-64 translate-x-10 sm:translate-x-20 -translate-y-10 sm:-translate-y-20 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 left-0 h-32 sm:h-64 w-32 sm:w-64 -translate-x-10 sm:-translate-x-20 translate-y-10 sm:translate-y-20 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Store className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <p className="text-base sm:text-2xl font-bold">Complete Your Profile</p>
                <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-violet-100">Publish your storefront today.</p>
              </div>
            </div>
            <Link 
              to="/dashboard/business" 
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold text-violet-700 transition-all hover:shadow-lg hover:scale-[1.02] sm:hover:scale-105"
            >
              Get started <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Enhanced Metric Cards - Mobile Optimized */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard 
          label="Revenue" 
          value={money(revenue)} 
          note={`${summary.total} orders`} 
          icon={DollarSign} 
          tone="bg-emerald-50 text-emerald-600" 
          trend="up"
          trendValue="+12.5%"
          delay={0}
        />
        <MetricCard 
          label="Orders" 
          value={summary.total} 
          note={`${summary.pending} pending`} 
          icon={ShoppingCart} 
          tone="bg-violet-50 text-violet-600" 
          trend="up"
          trendValue="+8.3%"
          delay={100}
        />
        <MetricCard 
          label="Avg Order" 
          value={money(averageOrder)} 
          note="Paid revenue" 
          icon={TrendingUp} 
          tone="bg-blue-50 text-blue-600" 
          trend="neutral"
          trendValue="±0.0%"
          delay={200}
        />
        <MetricCard 
          label="Fulfillment" 
          value={`${fulfillment}%`} 
          note={`${summary.completed} completed`} 
          icon={Award} 
          tone="bg-amber-50 text-amber-600" 
          trend="up"
          trendValue="+5.2%"
          delay={300}
        />
      </section>

      {/* Charts Section - Mobile Optimized */}
      <section className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <ActivityChart orders={orders} />
        
        {/* Donut Chart Card - Mobile Optimized */}
        <article className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-sm transition-all hover:shadow-md">
          <h2 className="font-semibold text-slate-950 flex items-center gap-2 text-sm sm:text-base">
            <PieChart className="h-4 w-4 text-violet-500" />
            Order Distribution
          </h2>
          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-500">Status breakdown</p>
          <div className="mt-3 sm:mt-4">
            <DonutChart orders={orders} />
          </div>
          <div className="mt-3 sm:mt-4 flex items-center justify-between border-t border-slate-100 pt-3 sm:pt-4">
            <span className="text-[10px] sm:text-xs text-slate-400">{orders.length} total orders</span>
            <Link 
              to="/dashboard/orders" 
              className="text-[10px] sm:text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </article>
      </section>

      {/* Recent Orders & Inventory - Mobile Optimized */}
      <section className="grid gap-4 sm:gap-6 xl:grid-cols-[1.55fr_1fr]">
        {/* Recent Orders - Mobile Optimized */}
        <article className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 sm:px-6 py-4 sm:py-5">
            <div>
              <h2 className="font-semibold text-slate-950 flex items-center gap-2 text-sm sm:text-base">
                <ShoppingBag className="h-4 w-4 text-violet-500" />
                Recent Orders
              </h2>
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-500">Latest customer activity</p>
            </div>
            <Link 
              to="/dashboard/orders" 
              className="text-xs sm:text-sm font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          {orders.length ? (
            <div className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((order) => {
                return (
                  <Link 
                    to="/dashboard/orders" 
                    key={order.id} 
                    className="flex items-center gap-2 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 transition-all hover:bg-slate-50/80 hover:pl-5 sm:hover:pl-7"
                  >
                    <StoreLogo business={business} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs sm:text-sm font-semibold text-slate-900">{business?.name || "Store"}</p>
                      <p className="mt-0.5 text-[10px] sm:text-xs text-slate-400 truncate">
                        {order.order_number} · {order.items_count} items
                      </p>
                    </div>
                    <span className={`hidden sm:block rounded-full px-2 sm:px-3 py-1 text-[8px] sm:text-[10px] font-semibold capitalize ring-1 ring-inset ${orderTone[order.status]}`}>
                      {order.status}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">{money(order.total)}</p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-8 sm:p-12 text-center text-xs sm:text-sm text-slate-500">
              <ShoppingBag className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-slate-300" />
              <p className="mt-3">Orders will appear here when customers start purchasing.</p>
            </div>
          )}
        </article>

        {/* Inventory Health - Mobile Optimized */}
        <article className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-950 flex items-center gap-2 text-sm sm:text-base">
                <Box className="h-4 w-4 text-violet-500" />
                Inventory
              </h2>
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-500">Catalog availability</p>
            </div>
            <span className="grid h-9 w-9 sm:h-11 sm:w-11 place-items-center rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 text-violet-600">
              <Box className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
          </div>
          <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-xl bg-slate-50 p-3 sm:p-4 transition-all hover:bg-slate-100">
              <p className="text-[9px] sm:text-xs font-medium text-slate-400">Products</p>
              <p className="mt-0.5 sm:mt-1 text-lg sm:text-2xl font-bold text-slate-900">{counts.products}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 sm:p-4 transition-all hover:bg-emerald-100">
              <p className="text-[9px] sm:text-xs font-medium text-emerald-600">Active</p>
              <p className="mt-0.5 sm:mt-1 text-lg sm:text-2xl font-bold text-emerald-700">{counts.active_products}</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 sm:p-4 transition-all hover:bg-amber-100">
              <p className="text-[9px] sm:text-xs font-medium text-amber-600">Low Stock</p>
              <p className="mt-0.5 sm:mt-1 text-lg sm:text-2xl font-bold text-amber-700">{counts.low_stock}</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="flex items-center gap-2 sm:gap-3 rounded-xl p-2 transition-all hover:bg-slate-50">
                <span className="grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-xl bg-slate-100 text-slate-500">
                  <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs sm:text-sm font-medium text-slate-800">{product.name}</p>
                  <p className="text-[9px] sm:text-[11px] text-slate-400 truncate">{product.category?.name || "Uncategorized"}</p>
                </div>
                <span className={`text-[10px] sm:text-xs font-semibold ${product.stock <= 5 ? "text-amber-600" : "text-slate-500"}`}>
                  {product.stock} left
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 sm:mt-6 flex items-center justify-between border-t border-slate-100 pt-3 sm:pt-4">
            <span className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500">
              <FolderTree className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> {counts.categories} categories
            </span>
            <Link 
              to="/dashboard/products" 
              className="text-[10px] sm:text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              Manage <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </article>
      </section>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 sm:hidden z-50">
        <div className="flex justify-around items-center">
          <Link to="/dashboard" className="flex flex-col items-center gap-0.5 text-violet-600">
            <Sparkles className="h-5 w-5" />
            <span className="text-[8px] font-medium">Dashboard</span>
          </Link>
          <Link to="/dashboard/orders" className="flex flex-col items-center gap-0.5 text-slate-400">
            <ShoppingBag className="h-5 w-5" />
            <span className="text-[8px] font-medium">Orders</span>
          </Link>
          <Link to="/dashboard/products" className="flex flex-col items-center gap-0.5 text-slate-400">
            <Package className="h-5 w-5" />
            <span className="text-[8px] font-medium">Products</span>
          </Link>
          <Link to="/dashboard/business" className="flex flex-col items-center gap-0.5 text-slate-400">
            <Store className="h-5 w-5" />
            <span className="text-[8px] font-medium">Store</span>
          </Link>
        </div>
      </div>
    </div>
  );
}