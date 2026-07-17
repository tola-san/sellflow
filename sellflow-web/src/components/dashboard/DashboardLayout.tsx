import { useState } from "react";
import { BarChart3, Boxes, FolderTree, LayoutDashboard, LogOut, Menu, Package, Palette, ShoppingCart, Store, X } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { authService } from "../../Services/auth";
import { useToast } from "../ui/ToastContext";

const links = [
  { label: "Overview", path: "/dashboard", icon: LayoutDashboard, end: true },
  { label: "Business", path: "/dashboard/business", icon: Store },
  { label: "Categories", path: "/dashboard/categories", icon: FolderTree },
  { label: "Products", path: "/dashboard/products", icon: Package },
  { label: "Theme", path: "/dashboard/theme", icon: Palette },
  { label: "Orders", path: "/dashboard/orders", icon: ShoppingCart },
];

export function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const logout = async () => {
    const token = localStorage.getItem("token") || "";
    try { await authService.logout(token); } catch { /* Clear stale tokens too. */ }
    localStorage.removeItem("token");
    showToast("You have signed out successfully.");
    navigate("/");
  };

  const sidebar = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
        <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-purple-600 text-white"><Boxes size={19}/></span><div><p className="font-bold">SellFlow</p><p className="text-xs text-slate-500">Business dashboard</p></div></div>
        <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X size={20}/></button>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {links.map(({ label, path, icon: Icon, end }) => <NavLink key={path} to={path} end={end} onClick={() => setOpen(false)} className={({isActive}) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? "bg-purple-50 text-purple-700" : "text-slate-600 hover:bg-slate-100"}`}><Icon size={19}/>{label}</NavLink>)}
        <div className="pt-4"><p className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Coming next</p><div className="mt-2 flex items-center gap-3 px-4 py-3 text-sm text-slate-400"><BarChart3 size={19}/>Advanced analytics</div></div>
      </nav>
      <button onClick={logout} className="m-4 flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600"><LogOut size={18}/>Sign out</button>
    </>
  );

  return <div className="min-h-screen bg-slate-50 text-slate-900">
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">{sidebar}</aside>
    {open && <><button className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu overlay"/><aside className="fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-white lg:hidden">{sidebar}</aside></>}
    <div className="lg:pl-64"><header className="sticky top-0 z-20 flex h-16 items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6"><button className="mr-3 rounded-lg p-2 hover:bg-slate-100 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={20}/></button><p className="font-semibold">Manage your catalog</p><span className="ml-auto rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">API connected</span></header><main className="p-4 sm:p-6 lg:p-8"><Outlet/></main></div>
  </div>;
}
