import type { ThemeSettings } from "./theme";

export interface Business {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  website: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  telegram_url: string | null;
  tiktok_url: string | null;
  logo: string | null;
  banner: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  primary_color: string;
  secondary_color: string;
  theme: ThemeSettings;
  is_active: boolean;
  created_at: string;
}
