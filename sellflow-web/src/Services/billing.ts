import api from "../lib/Axios";

export type BillingCycle = "monthly" | "yearly";
export type SubscriptionStatus =
  | "trialing"
  | "trial_expired"
  | "active"
  | "past_due"
  | "cancelled"
  | "expired";

export interface SubscriptionPlan {
  id: number;
  name: string;
  slug: "starter" | "growth" | "pro";
  description: string;
  monthly_price: string;
  yearly_price: string;
  currency: string;
  limits: {
    businesses: number | null;
    staff: number | null;
    products: number | null;
  };
  features: {
    inventory: "basic" | "advanced";
    telegram_notifications: boolean;
    restaurant_qr: boolean;
    analytics_history_days: number | null;
    custom_domain: boolean;
    priority_support: boolean;
  };
  is_popular: boolean;
}

export interface BusinessSubscription {
  id: number;
  status: SubscriptionStatus;
  has_access: boolean;
  billing_cycle: BillingCycle | null;
  trial_started_at: string | null;
  trial_ends_at: string | null;
  trial_days_remaining: number;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  cancelled_at: string | null;
  plan: SubscriptionPlan;
}

export interface UsageMetric {
  used: number;
  limit: number | null;
  remaining: number | null;
  percent: number | null;
  unlimited: boolean;
}

export interface BillingOverview {
  subscription: BusinessSubscription;
  usage: {
    businesses: UsageMetric;
    staff: UsageMetric;
    products: UsageMetric;
  };
}

export interface SubscriptionPayment {
  id: number;
  invoice_number: string;
  plan: { name: string; slug: string } | null;
  amount: string;
  currency: string;
  billing_cycle: BillingCycle;
  status: string;
  provider: string | null;
  period_start: string | null;
  period_end: string | null;
  paid_at: string | null;
  created_at: string;
}

export const billingService = {
  async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await api.get<{ success: boolean; data: SubscriptionPlan[] }>("/billing/plans");
    return response.data.data;
  },

  async getOverview(): Promise<BillingOverview> {
    const response = await api.get<{ success: boolean; data: BillingOverview }>("/billing");
    return response.data.data;
  },

  async getPayments(): Promise<SubscriptionPayment[]> {
    const response = await api.get<{ success: boolean; data: SubscriptionPayment[] }>("/billing/payments");
    return response.data.data;
  },
};
