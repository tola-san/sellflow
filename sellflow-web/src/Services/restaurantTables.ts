import api from "../lib/Axios";

export type RestaurantTableStatus = "available" | "occupied" | "reserved" | "inactive";

export interface RestaurantTable {
  id: number;
  name: string;
  area: string | null;
  capacity: number;
  status: RestaurantTableStatus;
  qr_token: string;
  is_active: boolean;
  sort_order: number;
  active_order: {
    id: number;
    order_number: string;
    total: string;
    status: string;
    created_at: string;
  } | null;
}

export type RestaurantTablePayload = Pick<RestaurantTable, "name" | "area" | "capacity" | "status" | "is_active" | "sort_order">;

export const restaurantTableService = {
  async all(): Promise<RestaurantTable[]> {
    return (await api.get<{ data: RestaurantTable[] }>("/restaurant-tables")).data.data;
  },
  async create(payload: RestaurantTablePayload): Promise<RestaurantTable> {
    return (await api.post<{ data: RestaurantTable }>("/restaurant-tables", payload)).data.data;
  },
  async update(id: number, payload: RestaurantTablePayload): Promise<RestaurantTable> {
    return (await api.put<{ data: RestaurantTable }>(`/restaurant-tables/${id}`, payload)).data.data;
  },
  async remove(id: number): Promise<void> {
    await api.delete(`/restaurant-tables/${id}`);
  },
  async regenerateQr(id: number): Promise<RestaurantTable> {
    return (await api.post<{ data: RestaurantTable }>(`/restaurant-tables/${id}/regenerate-qr`)).data.data;
  },
};
