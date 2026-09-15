import { createServerFn } from "@tanstack/react-start";
import { PRODUCT_SELECT, STORE_PUBLIC_COLUMNS, type Store, type ProductWithRelations } from "./products.types";

export const getStoreBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => input)
  .handler(async ({ data }) => {
    const { createPublicSupabaseClient } = await import("./supabase.server");
    const supabase = createPublicSupabaseClient();
    const { data: store, error } = await supabase
      .from("stores")
      .select(STORE_PUBLIC_COLUMNS)
      .eq("slug", data.slug)
      .single();
    if (error) throw error;
    return store as unknown as Store;
  });

export const getStoreProducts = createServerFn({ method: "GET" })
  .inputValidator((input: { storeSlug: string }) => input)
  .handler(async ({ data }) => {
    const { createPublicSupabaseClient } = await import("./supabase.server");
    const supabase = createPublicSupabaseClient();
    const { data: products, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "active")
      .eq("stores.slug", data.storeSlug)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (products ?? []) as unknown as ProductWithRelations[];
  });
