export interface Business {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  logo: string | null;
  banner: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  primary_color: string;
  secondary_color: string;
  is_active: boolean;
  created_at: string;
}