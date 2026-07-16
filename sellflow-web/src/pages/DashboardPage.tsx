import { useEffect, useState } from "react";
import { FolderTree, Package, Sparkles, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { businessService } from "../Services/business";
import { categoryService } from "../Services/category";
import { productService } from "../Services/product";
import type { Business } from "../types/business";
import type { Category } from "../types/category";
import type { Product } from "../types/product";
import { ErrorMessage, PageHeader, buttonPrimary } from "../components/dashboard/DashboardUI";

export function DashboardPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  useEffect(() => { Promise.all([businessService.getBusiness(), categoryService.getCategories(), productService.getProducts()]).then(([b,c,p]) => { setBusiness(b); setCategories(c); setProducts(p); }).catch(setError).finally(() => setLoading(false)); }, []);
  const active = products.filter(p => p.is_active).length;
  const lowStock = products.filter(p => p.stock <= 5).length;
  const stats = [{label:"Products",value:products.length,note:`${active} active`,icon:Package},{label:"Categories",value:categories.length,note:`${categories.filter(c=>c.is_active).length} active`,icon:FolderTree},{label:"Low stock",value:lowStock,note:"5 items or fewer",icon:Sparkles}];
  if (loading) return <div className="animate-pulse space-y-5"><div className="h-20 rounded-2xl bg-slate-200"/><div className="grid gap-4 md:grid-cols-3"><div className="h-36 rounded-2xl bg-slate-200"/><div className="h-36 rounded-2xl bg-slate-200"/><div className="h-36 rounded-2xl bg-slate-200"/></div></div>;
  return <><PageHeader title={`Welcome${business ? `, ${business.name}` : " to SellFlow"}`} description="Here is a live snapshot of your catalog." action={<Link className={buttonPrimary} to="/dashboard/products">Add product</Link>}/><ErrorMessage error={error}/>
    {!business && <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-bold">Create your business profile</h2><p className="mt-1 text-sm text-purple-100">Set up your store before adding categories and products.</p></div><Link to="/dashboard/business" className="rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold text-purple-700">Get started</Link></div>}
    <section className="grid gap-4 sm:grid-cols-3">{stats.map(({label,value,note,icon:Icon}) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="grid h-11 w-11 place-items-center rounded-xl bg-purple-50 text-purple-600"><Icon size={20}/></div><p className="mt-5 text-sm text-slate-500">{label}</p><div className="mt-1 flex items-end justify-between"><strong className="text-3xl">{value}</strong><span className="text-xs text-slate-500">{note}</span></div></article>)}</section>
    <section className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]"><article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-200 px-6 py-5"><div><h2 className="font-semibold">Recent products</h2><p className="text-sm text-slate-500">Latest additions to your catalog</p></div><Link to="/dashboard/products" className="text-sm font-semibold text-purple-600">View all</Link></div>{products.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="px-6 py-3">Product</th><th className="px-6 py-3">Category</th><th className="px-6 py-3">Price</th><th className="px-6 py-3">Stock</th></tr></thead><tbody className="divide-y divide-slate-100">{products.slice(0,5).map(p=><tr key={p.id}><td className="px-6 py-4 font-medium">{p.name}</td><td className="px-6 py-4 text-slate-500">{p.category?.name || "—"}</td><td className="px-6 py-4">${Number(p.discount_price || p.price).toFixed(2)}</td><td className="px-6 py-4"><span className={p.stock <= 5 ? "font-semibold text-amber-600" : ""}>{p.stock}</span></td></tr>)}</tbody></table></div> : <p className="p-8 text-center text-sm text-slate-500">No products yet.</p>}</article>
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="font-semibold">Setup progress</h2><div className="mt-5 space-y-4">{[[!!business,"Business profile","/dashboard/business",Store],[categories.length>0,"First category","/dashboard/categories",FolderTree],[products.length>0,"First product","/dashboard/products",Package]].map(([done,label,path,Icon]: any)=><Link key={label} to={path} className="flex items-center gap-3"><span className={`grid h-9 w-9 place-items-center rounded-full ${done ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}><Icon size={17}/></span><span className="text-sm font-medium">{label}</span><span className="ml-auto text-xs font-semibold text-slate-400">{done ? "Done" : "Next"}</span></Link>)}</div></article></section>
  </>;
}
