import api from "../lib/Axios";

export interface TelegramSettings {
  connected: boolean;
  chat_name: string | null;
  new_order_enabled: boolean;
  payment_enabled: boolean;
  connected_at: string | null;
}

export interface TelegramConnectionCode {
  code: string;
  command: string;
  expires_at: string;
  bot_username: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const telegramNotificationService = {
  async getSettings(): Promise<TelegramSettings> {
    const response = await api.get<ApiResponse<TelegramSettings>>("/business/notifications/telegram");
    return response.data.data;
  },

  async createConnectionCode(): Promise<TelegramConnectionCode> {
    const response = await api.post<ApiResponse<TelegramConnectionCode>>("/business/notifications/telegram/connect-code");
    return response.data.data;
  },

  async updateSettings(data: Partial<Pick<TelegramSettings, "new_order_enabled" | "payment_enabled">>): Promise<TelegramSettings> {
    const response = await api.patch<ApiResponse<TelegramSettings>>("/business/notifications/telegram", data);
    return response.data.data;
  },

  async sendTest(): Promise<string> {
    const response = await api.post<{ success: boolean; message: string }>("/business/notifications/telegram/test");
    return response.data.message;
  },

  async disconnect(): Promise<TelegramSettings> {
    const response = await api.delete<ApiResponse<TelegramSettings>>("/business/notifications/telegram");
    return response.data.data;
  },
};
