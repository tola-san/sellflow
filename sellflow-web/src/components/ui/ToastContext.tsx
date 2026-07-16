import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, CircleAlert, X } from "lucide-react";

type ToastType = "success" | "error";
type Toast = { id: number; message: string; type: ToastType };

const ToastContext = createContext<{ showToast: (message: string, type?: ToastType) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const remove = useCallback((id: number) => setToasts((items) => items.filter((item) => item.id !== id)), []);
  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++nextId.current;
    setToasts((items) => [...items.slice(-2), { id, message, type }]);
    window.setTimeout(() => remove(id), 4000);
  }, [remove]);

  return <ToastContext.Provider value={{ showToast }}>
    {children}
    <div className="pointer-events-none fixed right-4 top-4 z-[200] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const success = toast.type === "success";
          const Icon = success ? CheckCircle2 : CircleAlert;
          return <motion.div key={toast.id} initial={{ opacity: 0, y: -14, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 30, scale: .96 }} className={`pointer-events-auto flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-xl ${success ? "border-emerald-200" : "border-rose-200"}`}>
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${success ? "text-emerald-600" : "text-rose-600"}`} />
            <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-900">{success ? "Success" : "Something went wrong"}</p><p className="mt-0.5 text-sm text-slate-600">{toast.message}</p></div>
            <button onClick={() => remove(toast.id)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Dismiss notification"><X size={16} /></button>
          </motion.div>;
        })}
      </AnimatePresence>
    </div>
  </ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
