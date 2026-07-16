import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { PublicProduct } from "../../Services/storefront";

export interface CartItem {
  product: PublicProduct;
  quantity: number;
}

type Carts = Record<string, CartItem[]>;

interface CartContextValue {
  items: (slug: string) => CartItem[];
  count: (slug: string) => number;
  add: (slug: string, product: PublicProduct, quantity?: number) => void;
  update: (slug: string, productSlug: string, quantity: number) => void;
  remove: (slug: string, productSlug: string) => void;
  clear: (slug: string) => void;
}

const STORAGE_KEY = "sellflow_store_carts";
const CartContext = createContext<CartContextValue | null>(null);

function loadCarts(): Carts {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) as Carts : {};
  } catch {
    return {};
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [carts, setCarts] = useState<Carts>(loadCarts);

  const commit = (next: Carts) => {
    setCarts(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const value = useMemo<CartContextValue>(() => ({
    items: (slug) => carts[slug] || [],
    count: (slug) => (carts[slug] || []).reduce((sum, item) => sum + item.quantity, 0),
    add: (slug, product, quantity = 1) => {
      const current = carts[slug] || [];
      const existing = current.find((item) => item.product.slug === product.slug);
      const nextItems = existing
        ? current.map((item) => item.product.slug === product.slug
          ? { ...item, product, quantity: Math.min(product.stock, item.quantity + quantity) }
          : item)
        : [...current, { product, quantity: Math.min(product.stock, quantity) }];
      commit({ ...carts, [slug]: nextItems });
    },
    update: (slug, productSlug, quantity) => {
      const nextItems = (carts[slug] || []).map((item) => item.product.slug === productSlug
        ? { ...item, quantity: Math.max(1, Math.min(item.product.stock, quantity)) }
        : item);
      commit({ ...carts, [slug]: nextItems });
    },
    remove: (slug, productSlug) => commit({ ...carts, [slug]: (carts[slug] || []).filter((item) => item.product.slug !== productSlug) }),
    clear: (slug) => commit({ ...carts, [slug]: [] }),
  }), [carts]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
