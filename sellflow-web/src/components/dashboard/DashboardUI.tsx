import type { ReactNode } from "react";
import axios from "axios";

export function PageHeader({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-bold sm:text-3xl">{title}</h1><p className="mt-1 text-sm text-slate-500">{description}</p></div>{action}</div>;
}
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><h3 className="font-semibold">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>{action && <div className="mt-5">{action}</div>}</div>;
}
export function ErrorMessage({ error }: { error: unknown }) {
  if (!error) return null;
  let message = "Something went wrong. Please try again.";
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;
    message = data?.message || (data?.errors && Object.values(data.errors)[0]?.[0]) || message;
  } else if (error instanceof Error) message = error.message;
  return <div className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{message}</div>;
}
export const buttonPrimary = "inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50";
export const buttonSecondary = "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-50";
export const inputClass = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100";
