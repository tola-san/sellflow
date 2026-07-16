import api from "../lib/Axios";
import type { ThemeSettings } from "../types/theme";

export interface PublicCategory {
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sort_order: number;
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
}

export interface PublicBusiness {
  name: string;
  slug: string;
  logo: string | null;
  banner: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  theme: ThemeSettings;
}

export interface Storefront {
  business: PublicBusiness;
  categories: PublicCategory[];
  products: PublicProduct[];
}

export const storefrontService = {
  
  async getStore(slug: string): Promise<Storefront> {
    const response = await api.get<{ success: boolean; data: Storefront }>(`/store/${encodeURIComponent(slug)}`);
    return response.data.data;
  },
};
