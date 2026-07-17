import { useEffect, useState } from "react";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { storefrontService, type Storefront } from "../Services/storefront";
import { useCart } from "../components/cart/CartContext";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const drawerVariants = {
  hidden: { x: "100%" },
  visible: { 
    x: 0,
    transition: { 
      type: "spring", 
      stiffness: 280, 
      damping: 28,
      mass: 1.2
    }
  },
  exit: { 
    x: "100%",
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 32 
    }
  }
};

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { slug = "" } = useParams();
    const [store, setStore] = useState<Storefront | null>(null);
    const [missing, setMissing] = useState(false);
    const cart = useCart();
    const items = cart.items(slug);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen || !slug) return;
        storefrontService.getStore(slug).then(setStore).catch(() => setMissing(true));
    }, [slug, isOpen]);

    const primary = store?.business.theme.primary_color || "#3b82f6";
    const subtotal = items.reduce((sum, item) => 
        sum + Number(item.product.discount_price || item.product.price) * item.quantity, 0
    );

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/60"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        className="fixed right-0 top-0 z-[60] h-full w-full max-w-md bg-white shadow-2xl overflow-hidden"
                        variants={drawerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-2xl bg-slate-100 p-3">
                                    <ShoppingBag className="text-slate-700" size={28} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-semibold tracking-tight">Your Cart</h2>
                                    {items.length > 0 && <p className="text-slate-500">{items.length} items</p>}
                                </div>
                            </div>
                            <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className="rounded-full p-3 hover:bg-slate-100"
                            >
                                <X size={28} />
                            </motion.button>
                        </div>

                        <div className="flex h-[calc(100%-150px)] flex-col overflow-hidden">
                            {!items.length ? (
                                <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                                    <ShoppingBag size={90} className="text-slate-200" />
                                    <h3 className="mt-8 text-2xl font-semibold">Your cart is empty</h3>
                                    <p className="mt-3 text-slate-500">Start adding some products from the store.</p>
                                    <button
                                        onClick={onClose}
                                        className="mt-10 rounded-2xl px-10 py-4 font-semibold text-white transition hover:brightness-105"
                                        style={{ backgroundColor: primary }}
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-1 overflow-auto p-6 space-y-6">
                                        {items.map(({ product, quantity }) => (
                                            <div key={product.slug} className="flex gap-5 rounded-3xl border border-slate-100 p-5">
                                                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                                                    {product.thumbnail ? (
                                                        <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="grid h-full place-items-center text-slate-300">
                                                            <ShoppingBag size={48} />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1">
                                                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: primary }}>
                                                        {product.category.name}
                                                    </p>
                                                    <h4 className="mt-1.5 font-semibold">{product.name}</h4>
                                                    <p className="mt-2 font-bold text-xl">
                                                        ${Number(product.discount_price || product.price).toFixed(2)}
                                                    </p>

                                                    <div className="mt-5 flex justify-between items-center">
                                                        <div className="flex items-center rounded-2xl border border-slate-200">
                                                            <button onClick={() => quantity === 1 ? cart.remove(slug, product.slug) : cart.update(slug, product.slug, quantity - 1)} className="p-3 hover:bg-slate-100">
                                                                <Minus size={18} />
                                                            </button>
                                                            <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                                                            <button onClick={() => cart.update(slug, product.slug, quantity + 1)} className="p-3 hover:bg-slate-100">
                                                                <Plus size={18} />
                                                            </button>
                                                        </div>
                                                        <button onClick={() => cart.remove(slug, product.slug)} className="p-3 text-slate-400 hover:text-rose-600">
                                                            <Trash2 size={22} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Summary */}
                                    <div className="border-t p-6">
                                        <div className="flex justify-between text-lg">
                                            <span>Subtotal</span>
                                            <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="my-6 border-t" />
                                        <div className="flex justify-between text-2xl font-bold mb-6">
                                            <span>Total</span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>

                                        <Link
                                            to={`/${slug}/checkout`}
                                            onClick={onClose}
                                            className="block w-full rounded-2xl py-4 text-center text-lg font-semibold text-white hover:brightness-105 active:scale-95 transition-all"
                                            style={{ backgroundColor: primary }}
                                        >
                                            Continue to Checkout
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}