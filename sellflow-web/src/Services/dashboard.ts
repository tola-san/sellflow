import api from "../lib/Axios";
import type { Business } from "../types/business";
import type { Product } from "../types/product";

export interface DashboardOverview {
  business: Business | null;
  stats: {
    products: number;
    active_products: number;
    categories: number;
    active_categories: number;
    low_stock: number;
  };
  recent_products: Product[];
}

export const dashboardService = {
  async getOverview(): Promise<DashboardOverview> {
    const response = await api.get<{ success: boolean; data: DashboardOverview }>("/dashboard/overview");
    return response.data.data;
  },
};
