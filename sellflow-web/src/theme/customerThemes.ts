import type { ThemeSettings } from "../types/theme";

export const CUSTOMER_THEMES = {
  light: { preset: "minimal", primary_color: "#2563EB", secondary_color: "#0EA5E9", background_color: "#F8FAFC", surface_color: "#FFFFFF", text_color: "#0F172A", muted_color: "#64748B", font_family: "system", card_style: "bordered", button_style: "rounded", hero_style: "minimal", banner_overlay_opacity: 30, grid_columns: 4 },
  night: { preset: "modern", primary_color: "#8B5CF6", secondary_color: "#06B6D4", background_color: "#020617", surface_color: "#0F172A", text_color: "#F8FAFC", muted_color: "#94A3B8", font_family: "modern", card_style: "bordered", button_style: "rounded", hero_style: "gradient", banner_overlay_opacity: 55, grid_columns: 4 },
  blossom: { preset: "modern", primary_color: "#DB2777", secondary_color: "#F97316", background_color: "#FFF7ED", surface_color: "#FFFFFF", text_color: "#4C1D2F", muted_color: "#9F5F76", font_family: "modern", card_style: "elevated", button_style: "pill", hero_style: "gradient", banner_overlay_opacity: 40, grid_columns: 4 },
  forest: { preset: "classic", primary_color: "#15803D", secondary_color: "#65A30D", background_color: "#F0FDF4", surface_color: "#FFFFFF", text_color: "#14532D", muted_color: "#52745E", font_family: "system", card_style: "bordered", button_style: "rounded", hero_style: "gradient", banner_overlay_opacity: 45, grid_columns: 3 },
  ocean: { preset: "modern", primary_color: "#0284C7", secondary_color: "#0D9488", background_color: "#F0FDFA", surface_color: "#FFFFFF", text_color: "#164E63", muted_color: "#5E7F89", font_family: "modern", card_style: "elevated", button_style: "pill", hero_style: "gradient", banner_overlay_opacity: 45, grid_columns: 4 },
  sunset: { preset: "classic", primary_color: "#EA580C", secondary_color: "#E11D48", background_color: "#FFF7ED", surface_color: "#FFFBEB", text_color: "#431407", muted_color: "#9A654F", font_family: "classic", card_style: "bordered", button_style: "rounded", hero_style: "gradient", banner_overlay_opacity: 50, grid_columns: 3 },
  lavender: { preset: "modern", primary_color: "#7C3AED", secondary_color: "#C026D3", background_color: "#FAF5FF", surface_color: "#FFFFFF", text_color: "#3B0764", muted_color: "#806398", font_family: "modern", card_style: "elevated", button_style: "pill", hero_style: "gradient", banner_overlay_opacity: 42, grid_columns: 4 },
  coffee: { preset: "classic", primary_color: "#92400E", secondary_color: "#B45309", background_color: "#1C1917", surface_color: "#292524", text_color: "#FEF3C7", muted_color: "#C9B99E", font_family: "classic", card_style: "bordered", button_style: "rounded", hero_style: "banner", banner_overlay_opacity: 60, grid_columns: 3 },
  midnight: { preset: "minimal", primary_color: "#38BDF8", secondary_color: "#6366F1", background_color: "#111827", surface_color: "#1F2937", text_color: "#F9FAFB", muted_color: "#9CA3AF", font_family: "system", card_style: "flat", button_style: "square", hero_style: "minimal", banner_overlay_opacity: 58, grid_columns: 4 },
  candy: { preset: "modern", primary_color: "#EC4899", secondary_color: "#8B5CF6", background_color: "#FDF4FF", surface_color: "#FFFFFF", text_color: "#4A044E", muted_color: "#9D659F", font_family: "modern", card_style: "elevated", button_style: "pill", hero_style: "gradient", banner_overlay_opacity: 38, grid_columns: 4 },
  lemon: { preset: "minimal", primary_color: "#65A30D", secondary_color: "#EAB308", background_color: "#FEFCE8", surface_color: "#FFFFFF", text_color: "#365314", muted_color: "#71864B", font_family: "system", card_style: "flat", button_style: "square", hero_style: "minimal", banner_overlay_opacity: 35, grid_columns: 4 },
  graphite: { preset: "minimal", primary_color: "#52525B", secondary_color: "#18181B", background_color: "#F4F4F5", surface_color: "#FFFFFF", text_color: "#18181B", muted_color: "#71717A", font_family: "system", card_style: "bordered", button_style: "square", hero_style: "minimal", banner_overlay_opacity: 48, grid_columns: 4 },
} as const satisfies Record<string, ThemeSettings>;

export type CustomerThemeId = keyof typeof CUSTOMER_THEMES;

export const CUSTOMER_THEME_LABELS: Record<CustomerThemeId, string> = {
  light: "Light", night: "Night", blossom: "Blossom", forest: "Forest",
  ocean: "Ocean", sunset: "Sunset", lavender: "Lavender", coffee: "Coffee",
  midnight: "Midnight", candy: "Candy", lemon: "Lemon", graphite: "Graphite",
};

export function isCustomerTheme(value: string): value is CustomerThemeId {
  return value in CUSTOMER_THEMES;
}
