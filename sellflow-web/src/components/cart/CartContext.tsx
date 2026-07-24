import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { PublicModifierOption, PublicProduct } from "../../Services/storefront";

export interface SelectedModifier extends PublicModifierOption {
  group_id: number;
  group_name: string;
}

export interface CartItem {
  line_id: string;
  product: PublicProduct;
  quantity: number;
  modifiers: SelectedModifier[];
  unit_price: number;
}

type Carts = Record<string, CartItem[]>;

interface CartContextValue {
  items: (slug: string) => CartItem[];
  count: (slug: string) => number;
  add: (slug: string, product: PublicProduct, quantity?: number, modifiers?: SelectedModifier[]) => void;
  update: (slug: string, lineId: string, quantity: number) => void;
  remove: (slug: string, lineId: string) => void;
  clear: (slug: string) => void;
}

const STORAGE_KEY = "sellflow_store_carts";
const CartContext = createContext<CartContextValue | null>(null);

function loadCarts(): Carts {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored) as Record<string, Partial<CartItem>[]>;
    return Object.fromEntries(Object.entries(parsed).map(([slug, items]) => [
      slug,
      items.map((item) => {
        const product = item.product as PublicProduct;
        const modifiers = item.modifiers || [];
        return {
          product,
          quantity: item.quantity || 1,
          modifiers,
          line_id: item.line_id || lineId(product.slug, modifiers),
          unit_price: item.unit_price ?? basePrice(product) + modifiers.reduce((sum, option) => sum + Number(option.price_adjustment), 0),
        };
      }),
    ]));
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
    add: (slug, product, quantity = 1, modifiers = []) => {
      const current = carts[slug] || [];
      const id = lineId(product.slug, modifiers);
      const existing = current.find((item) => item.line_id === id);
      const unitPrice = basePrice(product) + modifiers.reduce((sum, option) => sum + Number(option.price_adjustment), 0);
      const nextItems = existing
        ? current.map((item) => item.line_id === id
          ? { ...item, product, modifiers, unit_price: unitPrice, quantity: Math.min(product.stock, item.quantity + quantity) }
          : item)
        : [...current, { line_id: id, product, modifiers, unit_price: unitPrice, quantity: Math.min(product.stock, quantity) }];
      commit({ ...carts, [slug]: nextItems });
    },
    update: (slug, id, quantity) => {
      const nextItems = (carts[slug] || []).map((item) => item.line_id === id
        ? { ...item, quantity: Math.max(1, Math.min(item.product.stock, quantity)) }
        : item);
      commit({ ...carts, [slug]: nextItems });
    },
    remove: (slug, id) => commit({ ...carts, [slug]: (carts[slug] || []).filter((item) => item.line_id !== id) }),
    clear: (slug) => commit({ ...carts, [slug]: [] }),
  }), [carts]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function basePrice(product: PublicProduct): number {
  return Number(product.discount_price || product.price);
}

function lineId(productSlug: string, modifiers: SelectedModifier[]): string {
  const optionIds = modifiers.map((modifier) => modifier.id).sort((a, b) => a - b).join("-");
  return `${productSlug}:${optionIds || "base"}`;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
