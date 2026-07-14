import {
  BarChart3,
  Boxes,
  FolderTree,
  LayoutDashboard,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    label: "Overview",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Business",
    path: "/dashboard/business",
    icon: Store,
  },
  {
    label: "Categories",
    path: "/dashboard/categories",
    icon: FolderTree,
  },
  {
    label: "Products",
    path: "/dashboard/products",
    icon: Package,
  },
  {
    label: "Orders",
    path: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    label: "Analytics",
    path: "/dashboard/analytics",
    icon: BarChart3,
  },
];

const stats = [
  {
    label: "Total Products",
    value: "24",
    icon: Package,
    note: "+4 this month",
  },
  {
    label: "Categories",
    value: "6",
    icon: FolderTree,
    note: "2 active",
  },
  {
    label: "Orders",
    value: "18",
    icon: ShoppingCart,
    note: "+12% this week",
  },
  {
    label: "Catalog Views",
    value: "1,284",
    icon: Users,
    note: "+18% this month",
  },
];

const recentProducts = [
  {
    id: 1,
    name: "Hot Latte",
    category: "Coffee",
    price: "$3.50",
    stock: 20,
    status: "Active",
  },
  {
    id: 2,
    name: "Iced Americano",
    category: "Coffee",
    price: "$2.75",
    stock: 14,
    status: "Active",
  },
  {
    id: 3,
    name: "Chocolate Cake",
    category: "Dessert",
    price: "$4.50",
    stock: 0,
    status: "Out of stock",
  },
];

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
          <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <Boxes className="h-5 w-5" />
            </div>

            <div>
              <p className="font-bold">SellFlow</p>
              <p className="text-xs text-slate-500">Business Dashboard</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-purple-100 text-purple-500"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                TS
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Tola San</p>
                <p className="truncate text-xs text-slate-500">
                  Store owner
                </p>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
            <div className="relative hidden max-w-md flex-1 md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                placeholder="Search products, categories..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
                View catalog
              </button>

              <button className="flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-600">
                <Plus className="h-4 w-4" />
                Add product
              </button>
            </div>
          </header>

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
              <p className="text-sm font-medium text-emerald-600">
                Dashboard overview
              </p>

              <h1 className="mt-1 text-3xl font-bold">
                Welcome back, Tola
              </h1>

              <p className="mt-2 text-slate-500">
                Manage your products, categories and business catalog.
              </p>
            </div>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <article
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <Icon className="h-5 w-5" />
                      </div>

                      <span className="text-xs font-medium text-emerald-600">
                        {stat.note}
                      </span>
                    </div>

                    <p className="mt-5 text-sm text-slate-500">
                      {stat.label}
                    </p>

                    <p className="mt-1 text-3xl font-bold">{stat.value}</p>
                  </article>
                );
              })}
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
              <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                  <div>
                    <h2 className="font-semibold">Recent products</h2>
                    <p className="text-sm text-slate-500">
                      Your latest catalog items
                    </p>
                  </div>

                  <NavLink
                    to="/dashboard/products"
                    className="text-sm font-semibold text-emerald-600 hover:underline"
                  >
                    View all
                  </NavLink>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-6 py-3 font-medium">Product</th>
                        <th className="px-6 py-3 font-medium">Category</th>
                        <th className="px-6 py-3 font-medium">Price</th>
                        <th className="px-6 py-3 font-medium">Stock</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {recentProducts.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 font-medium">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {product.category}
                          </td>
                          <td className="px-6 py-4">{product.price}</td>
                          <td className="px-6 py-4">{product.stock}</td>
                          <td className="px-6 py-4">
                            <span
                              className={[
                                "rounded-full px-2.5 py-1 text-xs font-semibold",
                                product.status === "Active"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-rose-50 text-rose-700",
                              ].join(" ")}
                            >
                              {product.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="font-semibold">Quick actions</h2>

                <div className="mt-5 space-y-3">
                  <NavLink
                    to="/dashboard/business"
                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <Store className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-semibold">Business profile</p>
                      <p className="text-xs text-slate-500">
                        Update store details
                      </p>
                    </div>
                  </NavLink>

                  <NavLink
                    to="/dashboard/categories"
                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <FolderTree className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-semibold">Add category</p>
                      <p className="text-xs text-slate-500">
                        Organize your catalog
                      </p>
                    </div>
                  </NavLink>

                  <NavLink
                    to="/dashboard/products"
                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <Package className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-semibold">Add product</p>
                      <p className="text-xs text-slate-500">
                        Create a catalog item
                      </p>
                    </div>
                  </NavLink>
                </div>
              </article>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}