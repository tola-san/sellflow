import api from "../lib/Axios";
import type { Order, OrderListResponse, OrderStatus, PaymentStatus } from "../types/order";

interface Filters {
  search?: string;
  status?: string;
  payment_status?: string;
  page?: number;
  per_page?: number;
}

export const orderService = {
  async getOrders(filters: Filters = {}): Promise<OrderListResponse> {
    const response = await api.get<{ success: boolean; data: Order[]; summary: OrderListResponse["summary"]; meta: OrderListResponse["meta"] }>("/orders", { params: filters });
    return { orders: response.data.data, summary: response.data.summary, meta: response.data.meta };
  },
  async getOrder(id: number): Promise<Order> {
    const response = await api.get<{ success: boolean; data: Order }>(`/orders/${id}`);
    return response.data.data;
  },
  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const response = await api.patch<{ success: boolean; data: Order }>(`/orders/${id}/status`, { status });
    return response.data.data;
  },
  async updatePaymentStatus(id: number, payment_status: PaymentStatus): Promise<Order> {
    const response = await api.patch<{ success: boolean; data: Order }>(`/orders/${id}/payment-status`, { payment_status });
    return response.data.data;
  },
};
