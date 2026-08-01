import api from "../lib/Axios";

export type AnalyticsDays = 7 | 30 | 90 | 365;

export interface AnalyticsReport {
  period: {
    days: AnalyticsDays;
    from: string;
    to: string;
  };
  summary: {
    revenue: string;
    orders: number;
    average_order_value: string;
    completion_rate: number;
    changes: {
      revenue: number | null;
      orders: number | null;
      average_order_value: number | null;
    };
  };
  trend: Array<{ date: string; orders: number; revenue: string }>;
  statuses: Array<{ status: string; count: number }>;
  payment_statuses: Array<{ status: string; count: number }>;
  order_types: Array<{ type: string; count: number }>;
  top_products: Array<{ name: string; quantity: number; revenue: string }>;
}

export const analyticsService = {
  async getReport(days: AnalyticsDays): Promise<AnalyticsReport | null> {
    const response = await api.get<{ success: boolean; data: AnalyticsReport | null }>(
      "/dashboard/analytics",
      { params: { days } },
    );

    return response.data.data;
  },
};
