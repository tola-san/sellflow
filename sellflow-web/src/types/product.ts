import type { Category } from "./category";
import type { ModifierGroup } from "../Services/modifierGroups";
import type { AvailabilitySchedule, AvailabilityStatus } from "../Services/menuAvailability";

export interface ProductVariant {
  id: number;
  product_id: number;
  name: string;
  attributes: Record<string, string>;
  sku: string | null;
  price: string | null;
  discount_price: string | null;
  effective_price?: string;
  stock: number;
  low_stock_threshold: number;
  is_low_stock: boolean;
  is_active: boolean;
  sort_order: number;
  product?: Pick<Product, "id" | "name" | "slug" | "thumbnail">;
  created_at: string;
}

export interface Product {
  id: number;
  uuid: string;
  business_id: number;
  category_id: number;
  name: string;
  slug: string;
  sku: string | null;
  description: string | null;
  price: string;
  discount_price: string | null;
  stock: number;
  low_stock_threshold: number;
  thumbnail: string | null;
  is_featured: boolean;
  is_active: boolean;
  category?: Category;
  modifier_groups?: ModifierGroup[];
  availability_status: AvailabilityStatus;
  is_available_now?: boolean;
  availability_schedules?: AvailabilitySchedule[];
  variants?: ProductVariant[];
  created_at: string;
}
