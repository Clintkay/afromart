import type { Tables } from "@/integrations/supabase/types";

export type Category = Tables<"categories">;
export type Store = Omit<Tables<"stores">, "owner_id">;

export type ProductSeller = {
  id: string;
  name: string;
  slug: string;
  business_name: string | null;
  city: string | null;
  country: string | null;
  response_time: string | null;
  logo_url: string | null;
  is_verified: boolean | null;
  rating: number | null;
  total_sales: number | null;
};

/** Columns of `stores` that are safe to expose publicly. */
export const STORE_PUBLIC_COLUMNS =
  "id, name, slug, business_name, city, country, response_time, logo_url, banner_url, description, is_verified, rating, total_sales, created_at, updated_at";

export const PRODUCT_SELECT = `*, categories(*), stores(${STORE_PUBLIC_COLUMNS}), product_images(*), product_variants(*)`;

export type ProductWithRelations = Tables<"products"> & {
  categories: { name: string; slug: string } | null;
  stores: ProductSeller | null;
  product_images: { url: string; alt_text: string | null }[];
  product_variants: {
    id: string;
    name: string;
    price: number | null;
    inventory_count: number | null;
    product_id: string;
  }[];
};
