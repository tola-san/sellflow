export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  id: number;
  product_id: number | null;
  product_name: string;
  product_slug: string;
  thumbnail: string | null;
  modifiers: { group_name: string; option_name: string; price_adjustment: string }[];
  unit_price: string;
  quantity: number;
  line_total: string;
}

export interface Order {
  id: number;
  uuid: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_address: string;
  city: string | null;
  notes: string | null;
  subtotal: string;
  total: string;
  payment_method: "cash" | "bakong";
  payment_status: PaymentStatus;
  status: OrderStatus;
  order_type: "delivery" | "dine_in";
  restaurant_table: { id: number; name: string; area: string | null } | null;
  items_count: number;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderSummary {
  total: number;
  pending: number;
  confirmed: number;
  preparing: number;
  ready: number;
  completed: number;
  cancelled: number;
  paid_revenue: string;
}

export interface OrderListResponse {
  orders: Order[];
  summary: OrderSummary;
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}
