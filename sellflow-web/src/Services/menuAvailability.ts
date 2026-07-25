import api from "../lib/Axios";
import type { Product } from "../types/product";

export interface AvailabilitySchedule {
  id?: number;
  name: string;
  days: number[];
  start_time: string;
  end_time: string;
  is_active: boolean;
  sort_order?: number;
}

export type AvailabilityStatus = "always" | "scheduled" | "sold_out" | "hidden";

export const menuAvailabilityService = {
  async all(): Promise<Product[]> {
    return (await api.get<{ data: Product[] }>("/menu-availability")).data.data;
  },
  async update(productId: number, availability_status: AvailabilityStatus, schedules: AvailabilitySchedule[]): Promise<Product> {
    return (await api.patch<{ data: Product }>(`/menu-availability/${productId}`, {
      availability_status,
      schedules,
    })).data.data;
  },
};
