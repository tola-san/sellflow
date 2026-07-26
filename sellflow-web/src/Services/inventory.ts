import api from "../lib/Axios";
import type { ProductVariant } from "../types/product";

export interface ProductVariantPayload {
  product_id: number;
  name: string;
  attributes: Record<string, string>;
  sku: string | null;
  price: number | null;
  discount_price: number | null;
  stock: number;
  low_stock_threshold: number;
  is_active: boolean;
  sort_order: number;
}

export interface InventoryItem {
  key: string;
  product_id: number;
  product_variant_id: number | null;
  product_name: string;
  variant_name: string | null;
  attributes: Record<string, string>;
  sku: string | null;
  thumbnail: string | null;
  stock: number;
  low_stock_threshold: number;
  is_active: boolean;
}

export interface InventoryMovement {
  id: number;
  type: "initial" | "adjustment" | "sale" | string;
  quantity_delta: number;
  quantity_before: number;
  quantity_after: number;
  reason: string | null;
  reference: string | null;
  product: { id: number; name: string };
  variant: { id: number; name: string; sku: string | null } | null;
  created_at: string;
}

export interface InventoryData {
  summary: {
    products: number;
    variants: number;
    units: number;
    low_stock: number;
    out_of_stock: number;
  };
  items: InventoryItem[];
  movements: InventoryMovement[];
}

type Response<T> = { success: boolean; data: T };

export const productVariantService = {
  async all(productId?: number): Promise<ProductVariant[]> {
    const response = await api.get<Response<ProductVariant[]>>("/product-variants", {
      params: productId ? { product_id: productId } : undefined,
    });
    return response.data.data;
  },
  async create(payload: ProductVariantPayload): Promise<ProductVariant> {
    return (await api.post<Response<ProductVariant>>("/product-variants", payload)).data.data;
  },
  async update(id: number, payload: Omit<ProductVariantPayload, "product_id">): Promise<ProductVariant> {
    return (await api.put<Response<ProductVariant>>(`/product-variants/${id}`, payload)).data.data;
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/product-variants/${id}`);
  },
};

export const inventoryService = {
  async get(): Promise<InventoryData> {
    return (await api.get<Response<InventoryData>>("/inventory")).data.data;
  },
  async adjust(payload: {
    product_id: number;
    product_variant_id: number | null;
    quantity: number;
    low_stock_threshold: number;
    reason: string | null;
  }): Promise<void> {
    await api.patch("/inventory/stock", payload);
  },
};
