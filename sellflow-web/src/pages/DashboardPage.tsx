import { useEffect, useState } from "react";
import { FolderTree, Package, Sparkles, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { dashboardService, type DashboardOverview } from "../Services/dashboard";
import { ErrorMessage, PageHeader, buttonPrimary } from "../components/dashboard/DashboardUI";

export function DashboardPage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  /**
   * Fetch dashboard overview data on component mount
   */
  useEffect(() => {
    dashboardService
      .getOverview()
      .then(setOverview)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="animate-pulse space-y-5">
        <div className="h-20 rounded-lg bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-36 rounded-lg bg-slate-200" />
          <div className="h-36 rounded-lg bg-slate-200" />
          <div className="h-36 rounded-lg bg-slate-200" />
        </div>
      </div>
    );
  }

  // Extract data from overview with fallbacks
  const business = overview?.business ?? null;
  const products = overview?.recent_products ?? [];
  const counts = overview?.stats ?? {
    products: 0,
    active_products: 0,
    categories: 0,
    active_categories: 0,
    low_stock: 0,
  };

  // Stats cards configuration
  const stats = [
    {
      label: "Products",
      value: counts.products,
      note: `${counts.active_products} active`,
      icon: Package,
    },
    {
      label: "Categories",
      value: counts.categories,
      note: `${counts.active_categories} active`,
      icon: FolderTree,
    },
    {
      label: "Low stock",
      value: counts.low_stock,
      note: "5 items or fewer",
      icon: Sparkles,
    },
  ];

  return (
    <>
      <PageHeader
        title={`Welcome${business ? `, ${business.name}` : " to SellFlow"}`}
        description="Here is a live snapshot of your catalog."
        action={
          <Link className={buttonPrimary}  to="/dashboard/products">
            Add product
          </Link>
        }
      />

      <ErrorMessage error={error} />

      {/* Prompt to create business profile if none exists */}
      {!business && (
        <div className="mb-6 flex flex-col gap-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold">Create your business profile</h2>
            <p className="mt-1 text-sm text-purple-100">
              Set up your store before adding categories and products.
            </p>
          </div>
          <Link
            to="/dashboard/business"
            className="rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold text-purple-700"
          >
            Get started
          </Link>
        </div>
      )}

      {/* Statistics Cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, note, icon: Icon }) => (
          <article
            key={label}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-purple-50 text-purple-600">
              <Icon size={20} />
            </div>

            <p className="mt-5 text-sm text-slate-500">{label}</p>

            <div className="mt-1 flex items-end justify-between">
              <strong className="text-3xl">{value}</strong>
              <span className="text-xs text-slate-500">{note}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        {/* Recent Products */}
        <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="font-semibold">Recent products</h2>
              <p className="text-sm text-slate-500">
                Latest additions to your catalog
              </p>
            </div>
            <Link
              to="/dashboard/products"
              className="text-sm font-semibold text-purple-600"
            >
              View all
            </Link>
          </div>

          {products.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.slice(0, 5).map((p) => (
                    <tr key={p.id}>
                      <td className="px-6 py-4 font-medium">{p.name}</td>
                      <td className="px-6 py-4 text-slate-500">
                        {p.category?.name || "—"}
                      </td>
                      <td className="px-6 py-4">
                        ${Number(p.discount_price || p.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={p.stock <= 5 ? "font-semibold text-amber-600" : ""}
                        >
                          {p.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-8 text-center text-sm text-slate-500">
              No products yet.
            </p>
          )}
        </article>

           {/* Setup Progress */}
<article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
  <h2 className="font-semibold text-lg">Setup Progress</h2>

  <div className="mt-6 space-y-3">
    {[
      {
        done: !!business,
        label: "Business profile",
        path: "/dashboard/business",
        Icon: Store,
        color: "blue"      // Unique color for this step
      },
      {
        done: counts.categories > 0,
        label: "First category",
        path: "/dashboard/categories",
        Icon: FolderTree,
        color: "orange"     // Unique color
      },
      {
        done: counts.products > 0,
        label: "First product",
        path: "/dashboard/products",
        Icon: Package,
        color: "green"   // Unique color
      },
    ].map(({ done, label, path, Icon, color }) => {
      // Color mapping
      const colorMap: any = {
        blue: done ? "bg-blue-100 text-blue-600 border-blue-500" : "bg-blue-50 text-blue-400 border-blue-200",
        orange: done ? "bg-orange-100 text-orange-600 border-orange-500" : "bg-green-50 text-green-400 border-green-200",
        green: done ? "bg-green-50 text-green-600 border-green-500" : "bg-green-50 text-green-400 border-green-200",
      };

      const iconClass = colorMap[color];

      return (
        <Link
          key={label}
          to={path}
          className="group flex items-center gap-4 rounded-xl border border-transparent p-4 transition-all hover:border-slate-200 hover:bg-slate-50"
        >
          {/* Icon with UNIQUE background color per step */}
          <span className={`grid h-11 w-11 place-items-center rounded-2xl transition-all ${iconClass}`}>
            <Icon size={18} />
          </span>

          {/* Left accent border matching the icon color */}
          <div className={`border-l-4 pl-4 flex-1 transition-colors ${done ? `border-${color}-500` : 'border-slate-200'}`}>
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
              {label}
            </span>
          </div>

          {/* Status */}
          <span
            className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
              done
                ? "bg-green-100 text-green-500"
                : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
            }`}
          >
            {done ? "✓ Done" : "Next"}
          </span>
        </Link>
      );
    })}
  </div>
</article>
      </section>
    </>
  );
}