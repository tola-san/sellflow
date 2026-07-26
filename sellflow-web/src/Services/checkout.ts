import api from "../lib/Axios";

export interface CheckoutPayload {
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  city?: string;
  notes?: string;
  payment_method: "cash" | "bakong";
  telegram_init_data?: string;
  table_token?: string;
  items: { product_slug: string; variant_id?: number; quantity: number; modifier_ids: number[] }[];
}

export interface PublicOrder {
  order_number: string;
  customer_name: string;
  subtotal: string;
  total: string;
  payment_method: "cash" | "bakong";
  payment_status: string;
  status: string;
  order_type: "delivery" | "dine_in";
  restaurant_table: { name: string; area: string | null } | null;
  telegram_receipt_sent: boolean;
  telegram_link_url: string | null;
  items: {
    product_name: string;
    product_slug: string;
    thumbnail: string | null;
    variant: { id: number; name: string; attributes: Record<string, string>; sku: string | null } | null;
    modifiers: { group_name: string; option_name: string; price_adjustment: string }[];
    unit_price: string;
    quantity: number;
    line_total: string;
  }[];
  created_at: string;
}

export const checkoutService = {
  async createOrder(slug: string, payload: CheckoutPayload): Promise<PublicOrder> {
    const response = await api.post<{ success: boolean; data: PublicOrder }>(`/store/${encodeURIComponent(slug)}/checkout`, payload);
    return response.data.data;
  },
};
