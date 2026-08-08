import api from "../lib/Axios";
import type { BusinessType } from "../types/businessTypes";
import type { ThemeSettings } from "../types/theme";
import type { StoreCurrency } from "../lib/currency";

export interface PublicCategory {
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sort_order: number;
}

export interface PublicModifierOption {
  id: number;
  name: string;
  price_adjustment: string;
}

export interface PublicModifierGroup {
  id: number;
  name: string;
  selection_type: "single" | "multiple";
  is_required: boolean;
  min_select: number;
  max_select: number | null;
  options: PublicModifierOption[];
}

export interface PublicProductVariant {
  id: number;
  name: string;
  attributes: Record<string, string>;
  sku: string | null;
  price: string | null;
  discount_price: string | null;
  effective_price: string;
  stock: number;
}

export interface PublicProduct {
  name: string;
  slug: string;
  description: string | null;
  price: string;
  discount_price: string | null;
  stock: number;
  thumbnail: string | null;
  is_featured: boolean;
  category: PublicCategory;
  modifier_groups: PublicModifierGroup[];
  variants: PublicProductVariant[];
  availability_status: "always" | "scheduled" | "sold_out" | "hidden";
  is_available_now: boolean;
}

export interface PublicRestaurantTable {
  name: string;
  area: string | null;
  capacity: number;
  token: string;
}

export interface PublicBusiness {
  name: string;
  business_type: BusinessType;
  slug: string;
  logo: string | null;
  banner: string | null;
  description: string | null;
  phone: string | null;
  website: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  telegram_url: string | null;
  tiktok_url: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  currency: StoreCurrency;
  show_map: boolean;
  theme: ThemeSettings;
}

export interface Storefront {
  business: PublicBusiness;
  categories: PublicCategory[];
  products: PublicProduct[];
}

export interface StorefrontProductDetail {
  business: PublicBusiness;
  product: PublicProduct;
}

export const storefrontService = {
  
  async getStore(slug: string): Promise<Storefront> {
    const response = await api.get<{ success: boolean; data: Storefront }>(`/store/${encodeURIComponent(slug)}`);
    return response.data.data;
  },

  async getProduct(slug: string, productSlug: string): Promise<StorefrontProductDetail> {
    const response = await api.get<{ success: boolean; data: StorefrontProductDetail }>(
      `/store/${encodeURIComponent(slug)}/products/${encodeURIComponent(productSlug)}`,
    );
    return response.data.data;
  },

  async getTable(slug: string, token: string): Promise<PublicRestaurantTable> {
    const response = await api.get<{ success: boolean; data: PublicRestaurantTable }>(
      `/store/${encodeURIComponent(slug)}/tables/${encodeURIComponent(token)}`,
    );
    return response.data.data;
  },
};
