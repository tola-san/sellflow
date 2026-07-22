import api from "../lib/Axios";

export interface CheckoutPayload {
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  city?: string;
  notes?: string;
  payment_method: "cash" | "bakong";
  telegram_init_data?: string;
  items: { product_slug: string; quantity: number }[];
}

export interface PublicOrder {
  order_number: string;
  customer_name: string;
  subtotal: string;
  total: string;
  payment_method: "cash" | "bakong";
  payment_status: string;
  status: string;
  telegram_receipt_sent: boolean;
  telegram_link_url: string | null;
  items: { product_name: string; product_slug: string; thumbnail: string | null; unit_price: string; quantity: number; line_total: string }[];
  created_at: string;
}

export const checkoutService = {
  async createOrder(slug: string, payload: CheckoutPayload): Promise<PublicOrder> {
    const response = await api.post<{ success: boolean; data: PublicOrder }>(`/store/${encodeURIComponent(slug)}/checkout`, payload);
    return response.data.data;
  },
};
