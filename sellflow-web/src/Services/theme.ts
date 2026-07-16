import api from "../lib/Axios";
import type { Business } from "../types/business";
import type { ThemeSettings } from "../types/theme";

export const themeService = {
  async getTheme(): Promise<ThemeSettings | null> {
    const response = await api.get<{ success: boolean; data: ThemeSettings | null }>("/business/theme");
    return response.data.data;
  },

  async publishTheme(theme: ThemeSettings): Promise<ThemeSettings> {
    const response = await api.put<{ success: boolean; data: Business }>("/business/theme", theme);
    return response.data.data.theme;
  },
};
