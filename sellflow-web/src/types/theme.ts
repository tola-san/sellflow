export type ThemePreset = "minimal" | "modern" | "classic";
export type ThemeFont = "system" | "modern" | "classic";
export type ThemeCardStyle = "elevated" | "bordered" | "flat";
export type ThemeButtonStyle = "rounded" | "pill" | "square";
export type ThemeHeroStyle = "gradient" | "banner" | "minimal";

export interface ThemeSettings {
  preset: ThemePreset;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  surface_color: string;
  text_color: string;
  muted_color: string;
  font_family: ThemeFont;
  card_style: ThemeCardStyle;
  button_style: ThemeButtonStyle;
  hero_style: ThemeHeroStyle;
  banner_overlay_opacity: number;
  grid_columns: 2 | 3 | 4;
}

export const THEME_PRESETS: Record<ThemePreset, ThemeSettings> = {
  minimal: {
    preset: "minimal", primary_color: "#0F172A", secondary_color: "#64748B",
    background_color: "#F8FAFC", surface_color: "#FFFFFF", text_color: "#0F172A",
    muted_color: "#64748B", font_family: "system", card_style: "bordered",
    button_style: "rounded", hero_style: "minimal", banner_overlay_opacity: 25, grid_columns: 4,
  },
  modern: {
    preset: "modern", primary_color: "#7C3AED", secondary_color: "#0891B2",
    background_color: "#F8FAFC", surface_color: "#FFFFFF", text_color: "#0F172A",
    muted_color: "#64748B", font_family: "modern", card_style: "elevated",
    button_style: "pill", hero_style: "gradient", banner_overlay_opacity: 35, grid_columns: 4,
  },
  classic: {
    preset: "classic", primary_color: "#B45309", secondary_color: "#78350F",
    background_color: "#FFFBEB", surface_color: "#FFFFFF", text_color: "#292524",
    muted_color: "#78716C", font_family: "classic", card_style: "bordered",
    button_style: "rounded", hero_style: "banner", banner_overlay_opacity: 45, grid_columns: 3,
  },
};
