import type { Category } from "./category";
import type { ModifierGroup } from "../Services/modifierGroups";
import type { AvailabilitySchedule, AvailabilityStatus } from "../Services/menuAvailability";

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
  availability_status: AvailabilityStatus;
  is_available_now?: boolean;
  availability_schedules?: AvailabilitySchedule[];
  created_at: string;
}
