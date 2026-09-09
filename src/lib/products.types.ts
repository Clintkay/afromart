import type { Tables } from "@/integrations/supabase/types";

export type Category = Tables<"categories">;
export type Store = Tables<"stores">;

export type ProductWithRelations = Tables<"products"> & {
  categories: { name: string; slug: string } | null;
  stores: { name: string; slug: string; is_verified: boolean | null; rating: number | null } | null;
  product_images: { url: string; alt_text: string | null }[];
  product_variants: {
    id: string;
    name: string;
    price: number | null;
    inventory_count: number | null;
    product_id: string;
  }[];
};
