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
  async getOrder(identifier: string | number): Promise<Order> {
    const response = await api.get<{ success: boolean; data: Order }>(`/orders/${identifier}`);
    return response.data.data;
  },
  async updateStatus(identifier: string | number, status: OrderStatus): Promise<Order> {
    const response = await api.patch<{ success: boolean; data: Order }>(`/orders/${identifier}/status`, { status });
    return response.data.data;
  },
  async updatePaymentStatus(identifier: string | number, payment_status: PaymentStatus): Promise<Order> {
    const response = await api.patch<{ success: boolean; data: Order }>(`/orders/${identifier}/payment-status`, { payment_status });
    return response.data.data;
  },
};
