import { useEffect, useState } from "react";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { storefrontService, type Storefront } from "../Services/storefront";
import { useCart } from "../components/cart/CartContext";
import { useTelegramMiniApp } from "../components/telegram/TelegramMiniAppContext";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const drawerVariants = {
  hidden: { x: "100%" },
  visible: { 
    x: 0,
    transition: { type: "spring", stiffness: 280, damping: 28 }
  },
  exit: { 
    x: "100%",
    transition: { type: "spring", stiffness: 300, damping: 32 }
  }
};

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { slug = "" } = useParams();
    const [store, setStore] = useState<Storefront | null>(null);
    const [missing, setMissing] = useState(false);
    const [loading, setLoading] = useState(true);

    const cart = useCart();
    const { hapticImpact, storePath } = useTelegramMiniApp();
    const items = cart.items(slug);

    const primary = store?.business?.theme?.primary_color || "#3b82f6";
    const subtotal = items.reduce((sum, item) => 
        sum + Number(item.product.discount_price || item.product.price) * item.quantity, 0
    );

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && isOpen && onClose();
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen || !slug) return;
        
        setLoading(true);
        storefrontService.getStore(slug)
            .then(setStore)
            .catch(() => setMissing(true))
            .finally(() => setLoading(false));
    }, [slug, isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/70"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />

                    <motion.div
                        className="telegram-safe-fixed fixed right-0 top-0 z-[60] h-full w-full max-w-[420px] bg-white shadow-2xl flex flex-col md:max-w-md"
                        variants={drawerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Fixed Header */}
                        <div className="flex items-center justify-between border-b px-4 py-4 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-slate-700" size={26} />
                                <h2 className="text-2xl font-semibold">Cart</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-slate-100 active:bg-slate-200"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* Scrollable Content Area */}
                        <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4">
                            {loading ? (
                                <div className="flex h-full items-center justify-center">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
                                </div>
                            ) : missing ? (
                                <div className="flex h-full items-center justify-center text-center">
                                    <div>
                                        <h3 className="text-xl font-semibold">Store unavailable</h3>
                                        <p className="mt-2 text-slate-500">Please try again later.</p>
                                    </div>
                                </div>
                            ) : items.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center text-center px-6">
                                    <div className="rounded-full bg-slate-100 p-10">
                                        <ShoppingBag size={70} className="text-slate-300" />
                                    </div>
                                    <h3 className="mt-6 text-xl font-semibold">Your cart is empty</h3>
                                    <p className="mt-2 text-slate-500">Browse products and add items</p>
                                    <button
                                        onClick={onClose}
                                        className="mt-10 w-full rounded-2xl py-4 font-semibold text-white"
                                        style={{ backgroundColor: primary }}
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                items.map(({ product, quantity }) => (
                                    <div key={product.slug} className="flex gap-4 rounded-2xl border border-slate-100 p-4 bg-white">
                                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                            {product.thumbnail ? (
                                                <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="grid h-full place-items-center text-slate-300">
                                                    <ShoppingBag size={36} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-medium" style={{ color: primary }}>
                                                {product.category.name}
                                            </p>
                                            <p className="mt-1 text-[15px] font-medium leading-tight line-clamp-2">{product.name}</p>
                                            <p className="mt-1.5 font-semibold">
                                                ${Number(product.discount_price || product.price).toFixed(2)}
                                            </p>

                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="flex items-center border border-slate-200 rounded-xl">
                                                    <button onClick={() => { hapticImpact(); quantity === 1 ? cart.remove(slug, product.slug) : cart.update(slug, product.slug, quantity - 1); }} className="px-3 py-2 active:bg-slate-100">
                                                        <Minus size={18} />
                                                    </button>
                                                    <span className="px-5 font-semibold">{quantity}</span>
                                                    <button onClick={() => { hapticImpact(); cart.update(slug, product.slug, quantity + 1); }} className="px-3 py-2 active:bg-slate-100">
                                                        <Plus size={18} />
                                                    </button>
                                                </div>
                                                <button onClick={() => cart.remove(slug, product.slug)} className="p-2 text-slate-400 hover:text-rose-500">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Fixed Footer (Only show when there are items) */}
                        {items.length > 0 && !loading && !missing && (
                            <div className="border-t bg-white p-4 flex-shrink-0">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-slate-600 text-[17px]">Total</span>
                                    <span className="text-2xl font-bold">${subtotal.toFixed(2)}</span>
                                </div>

                                <Link
                                    to={storePath(slug, "/checkout")}
                                    onClick={onClose}
                                    className="block w-full py-4 text-center rounded-2xl font-semibold text-white text-[17px] active:scale-[0.985] transition-all"
                                    style={{ backgroundColor: primary }}
                                >
                                    Continue to Checkout
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
