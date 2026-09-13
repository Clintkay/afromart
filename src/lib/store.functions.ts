import { createServerFn } from "@tanstack/react-start";
import type { Store, ProductWithRelations } from "./products.types";

export const getStoreBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => input)
  .handler(async ({ data }) => {
    const { createPublicSupabaseClient } = await import("./supabase.server");
    const supabase = createPublicSupabaseClient();
    const { data: store, error } = await supabase
      .from("stores")
      .select("id, name, slug, description, logo_url, banner_url, is_verified, rating, created_at, updated_at")
      .eq("slug", data.slug)
      .single();
    if (error) throw error;
    return store as Store;
  });

export const getStoreProducts = createServerFn({ method: "GET" })
  .inputValidator((input: { storeSlug: string }) => input)
  .handler(async ({ data }) => {
    const { createPublicSupabaseClient } = await import("./supabase.server");
    const supabase = createPublicSupabaseClient();
    const { data: products, error } = await supabase
      .from("products")
      .select("*, categories(*), stores(id, name, slug, description, logo_url, banner_url, is_verified, rating, created_at, updated_at), product_images(*), product_variants(*)")
      .eq("status", "active")
      .eq("stores.slug", data.storeSlug)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (products ?? []) as ProductWithRelations[];
  });
