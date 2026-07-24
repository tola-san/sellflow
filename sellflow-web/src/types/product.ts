import type { Category } from "./category";
import type { ModifierGroup } from "../Services/modifierGroups";

export interface Product {
  id: number;
  business_id: number;
  category_id: number;
  name: string;
  slug: string;
  sku: string | null;
  description: string | null;
  price: string;
  discount_price: string | null;
  stock: number;
  thumbnail: string | null;
  is_featured: boolean;
  is_active: boolean;
  category?: Category;
  modifier_groups?: ModifierGroup[];
  created_at: string;
}
