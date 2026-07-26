import api from "../lib/Axios";

export type NotificationType = "order" | "inventory" | "system";
export type NotificationStatus = "all" | "unread";

export interface BusinessNotification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  action_url: string | null;
  data: Record<string, unknown>;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface NotificationListResponse {
  notifications: BusinessNotification[];
  unread_count: number;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const NOTIFICATIONS_CHANGED_EVENT = "sellflow:notifications-changed";

function changed(): void {
  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_CHANGED_EVENT));
}

export const notificationService = {
  async list(params: {
    status?: NotificationStatus;
    type?: NotificationType;
    per_page?: number;
    page?: number;
  } = {}): Promise<NotificationListResponse> {
    const response = await api.get<{
      success: boolean;
      data: BusinessNotification[];
      unread_count: number;
      meta: NotificationListResponse["meta"];
    }>("/notifications", { params });

    return {
      notifications: response.data.data,
      unread_count: response.data.unread_count,
      meta: response.data.meta,
    };
  },

  async markRead(id: number): Promise<BusinessNotification> {
    const response = await api.patch<{ success: boolean; data: BusinessNotification }>(`/notifications/${id}/read`);
    changed();
    return response.data.data;
  },

  async markAllRead(): Promise<void> {
    await api.patch("/notifications/read-all");
    changed();
  },

  async dismiss(id: number): Promise<void> {
    await api.delete(`/notifications/${id}`);
    changed();
  },
};
